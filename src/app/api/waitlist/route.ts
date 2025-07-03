import { NextRequest, NextResponse } from "next/server";
import { addToWaitlist } from "@/lib/invite";
import { z } from "zod";

const waitlistSchema = z.object({
  email: z.string().email("Email inválido"),
  name: z.string().optional(),
  message: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = waitlistSchema.parse(body);

    const entry = await addToWaitlist(validatedData);

    return NextResponse.json(
      { 
        success: true, 
        message: "Registrado exitosamente en la lista de espera",
        id: entry.id 
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          success: false, 
          message: "Datos inválidos", 
          errors: error.errors 
        },
        { status: 400 }
      );
    }

    console.error("Error en waitlist API:", error);
    return NextResponse.json(
      { 
        success: false, 
        message: "Error interno del servidor" 
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    // Solo para verificar el estado de la lista de espera
    // En producción, esto debería estar protegido
    const { getUserStats } = await import("@/lib/invite");
    const stats = await getUserStats();
    
    return NextResponse.json({
      success: true,
      stats: {
        totalUsers: stats.totalUsers,
        waitlistCount: stats.waitlistCount,
      },
    });
  } catch (error) {
    console.error("Error obteniendo estadísticas:", error);
    return NextResponse.json(
      { success: false, message: "Error obteniendo estadísticas" },
      { status: 500 }
    );
  }
} 