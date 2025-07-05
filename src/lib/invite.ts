import prisma from "./prisma";
import { randomBytes } from "crypto";

export interface InviteCodeData {
  code: string;
  email?: string;
  expiresAt?: Date;
  createdBy?: string;
}

export interface WaitlistData {
  email: string;
  name?: string;
  message?: string;
}

/**
 * Genera un código de invitación único
 */
export function generateInviteCode(): string {
  return randomBytes(8).toString('hex').toUpperCase();
}

/**
 * Crea un nuevo código de invitación
 */
export async function createInviteCode(data: InviteCodeData) {
  return await prisma.inviteCode.create({
    data: {
      code: data.code,
      email: data.email,
      expiresAt: data.expiresAt,
      createdBy: data.createdBy,
    },
  });
}

/**
 * Valida un código de invitación
 */
export async function validateInviteCode(code: string, email?: string) {
  const inviteCode = await prisma.inviteCode.findUnique({
    where: { code: code.toUpperCase() },
  });

  if (!inviteCode) {
    return { valid: false, error: "Código de invitación no válido" };
  }

  if (inviteCode.used) {
    return { valid: false, error: "Código de invitación ya ha sido utilizado" };
  }

  if (inviteCode.expiresAt && inviteCode.expiresAt < new Date()) {
    return { valid: false, error: "Código de invitación ha expirado" };
  }

  if (inviteCode.email && email && inviteCode.email !== email) {
    return { valid: false, error: "Código de invitación no es válido para este email" };
  }

  return { valid: true, inviteCode };
}

/**
 * Marca un código de invitación como usado
 */
export async function useInviteCode(code: string, userId: string) {
  return await prisma.inviteCode.update({
    where: { code: code.toUpperCase() },
    data: {
      used: true,
      usedBy: userId,
      usedAt: new Date(),
    },
  });
}

/**
 * Agrega un email a la lista de espera
 */
export async function addToWaitlist(data: WaitlistData) {
  return await prisma.waitlistEntry.upsert({
    where: { email: data.email },
    update: {
      name: data.name,
      message: data.message,
      status: "PENDING",
    },
    create: {
      email: data.email,
      name: data.name,
      message: data.message,
    },
  });
}

/**
 * Obtiene estadísticas de usuarios
 */
export async function getUserStats() {
  const [totalUsers, activeUsers, pendingUsers, waitlistCount] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { status: "ACTIVE" } }),
    prisma.user.count({ where: { status: "PENDING" } }),
    prisma.waitlistEntry.count({ where: { status: "PENDING" } }),
  ]);

  return {
    totalUsers,
    activeUsers,
    pendingUsers,
    waitlistCount,
  };
}

/**
 * Verifica si el registro está abierto
 */
export async function isRegistrationOpen(): Promise<boolean> {
  // Por ahora, permitimos registro con código de invitación
  // En el futuro, esto podría ser configurable
  return true;
}

/**
 * Obtiene el límite máximo de usuarios
 */
export function getMaxUsers(): number {
  // Configurable - por ahora 100 usuarios
  return parseInt(process.env.MAX_USERS || "100");
}

/**
 * Verifica si se ha alcanzado el límite de usuarios
 */
export async function hasReachedUserLimit(): Promise<boolean> {
  // En desarrollo, nunca limitar usuarios
  if (process.env.NODE_ENV === "development") {
    return false;
  }
  
  // En producción, limitar a 1000 usuarios por ejemplo
  const userCount = await prisma.user.count();
  return userCount >= 1000;
} 