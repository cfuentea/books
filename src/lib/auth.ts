import { PrismaAdapter } from "@auth/prisma-adapter";
import prisma from "./prisma";
import GoogleProvider from "next-auth/providers/google";
import type { NextAuthOptions } from "next-auth";
import { hasReachedUserLimit } from "./invite";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async signIn({ user, account, profile }) {
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

      // Nuevo usuario - verificar límites
      if (await hasReachedUserLimit()) {
        console.log("Límite de usuarios alcanzado");
        return false;
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
}; 