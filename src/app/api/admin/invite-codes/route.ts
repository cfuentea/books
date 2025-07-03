import { NextRequest, NextResponse } from "next/server";
import { createInviteCode, generateInviteCode } from "@/lib/invite";
import prisma from "@/lib/prisma";
import { z } from "zod";

const createCodeSchema = z.object({
  email: z.string().email().optional(),
  expiresInDays: z.number().min(1).max(365),
});

export async function GET() {
  try {
    const codes = await prisma.inviteCode.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      success: true,
      codes: codes.map(code => ({
        id: code.id,
        code: code.code,
        email: code.email,
        used: code.used,
        usedBy: code.usedBy,
        usedAt: code.usedAt,
        expiresAt: code.expiresAt,
        createdAt: code.createdAt,
      })),
    });
  } catch (error) {
    console.error("Error obteniendo códigos de invitación:", error);
    return NextResponse.json(
      { success: false, message: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = createCodeSchema.parse(body);

    // Generar código único
    let code: string;
    let attempts = 0;
    const maxAttempts = 10;

    do {
      code = generateInviteCode();
      const existingCode = await prisma.inviteCode.findUnique({
        where: { code },
      });
      if (!existingCode) break;
      attempts++;
    } while (attempts < maxAttempts);

    if (attempts >= maxAttempts) {
      return NextResponse.json(
        { success: false, message: "Error generando código único" },
        { status: 500 }
      );
    }

    // Calcular fecha de expiración
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + validatedData.expiresInDays);

    // Crear el código de invitación
    const inviteCode = await createInviteCode({
      code,
      email: validatedData.email,
      expiresAt,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Código de invitación generado exitosamente",
        code: inviteCode,
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          message: "Datos inválidos",
          errors: error.errors,
        },
        { status: 400 }
      );
    }

    console.error("Error generando código de invitación:", error);
    return NextResponse.json(
      { success: false, message: "Error interno del servidor" },
      { status: 500 }
    );
  }
} 