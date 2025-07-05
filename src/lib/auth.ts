import { PrismaAdapter } from "@auth/prisma-adapter";
import prisma from "./prisma";
import GoogleProvider from "next-auth/providers/google";
import type { NextAuthOptions } from "next-auth";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "demo-client-id",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "demo-client-secret",
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET || "dev-secret-key-for-local-development",
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      // En desarrollo, permitir todos los accesos
      if (process.env.NODE_ENV === "development") {
        return true;
      }
      
      // Verificar si el usuario ya existe
      const existingUser = await prisma.user.findUnique({
        where: { email: user.email! },
      });

      if (existingUser) {
        // Usuario existente - verificar si está activo
        if (existingUser.status === "SUSPENDED" || existingUser.status === "DELETED") {
          return false; // Bloquear acceso
        }
        
        // Actualizar estado a ACTIVE si estaba PENDING
        if (existingUser.status === "PENDING") {
          await prisma.user.update({
            where: { id: existingUser.id },
            data: { status: "ACTIVE" },
          });
        }
        
        return true;
      }

      return true;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.sub as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
  debug: process.env.NODE_ENV === "development",
}; 