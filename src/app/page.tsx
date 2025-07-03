"use client";

import { AddBook } from "@/components/books/AddBook";
import { BookList } from "@/components/books/BookList";
import { SearchBooks } from "@/components/books/SearchBooks";
import { UserNav } from "@/components/auth/UserNav";
import { Suspense } from "react";
import { useSession, signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import { BookOpen, Sparkles, Users, Star } from "lucide-react";
import { Loading } from "@/components/ui/loading";

export default function Home() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loading text="Cargando tu biblioteca..." size="lg" variant="book" />
      </div>
    );
  }

  if (status === "unauthenticated") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        {/* Hero Section */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center space-y-8 fade-in">
            {/* Logo and Title */}
            <div className="space-y-4">
              <div className="flex justify-center">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full blur-xl opacity-30"></div>
                  <div className="relative bg-gradient-to-r from-blue-500 to-purple-600 p-4 rounded-full">
                    <BookOpen className="h-12 w-12 text-white" />
                  </div>
                </div>
              </div>
              <h1 className="text-5xl md:text-6xl font-bold tracking-tight gradient-text">
                Book Tracker
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
                Tu biblioteca personal en la nube
              </p>
              <p className="text-lg text-muted-foreground">
                Actualmente estamos en fase beta con acceso limitado.
              </p>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mt-12">
              <div className="glass p-6 rounded-xl hover-lift">
                <div className="flex justify-center mb-4">
                  <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-full">
                    <BookOpen className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>
                <h3 className="text-lg font-semibold mb-2">Organiza tu biblioteca</h3>
                <p className="text-muted-foreground text-sm">
                  Mantén un registro completo de todos tus libros favoritos
                </p>
              </div>
              
              <div className="glass p-6 rounded-xl hover-lift">
                <div className="flex justify-center mb-4">
                  <div className="bg-purple-100 dark:bg-purple-900/30 p-3 rounded-full">
                    <Sparkles className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                  </div>
                </div>
                <h3 className="text-lg font-semibold mb-2">Escáner de códigos</h3>
                <p className="text-muted-foreground text-sm">
                  Añade libros rápidamente escaneando códigos de barras
                </p>
              </div>
              
              <div className="glass p-6 rounded-xl hover-lift">
                <div className="flex justify-center mb-4">
                  <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-full">
                    <Users className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </div>
                </div>
                <h3 className="text-lg font-semibold mb-2">Comparte con amigos</h3>
                <p className="text-muted-foreground text-sm">
                  Próximamente: comparte tu biblioteca con otros lectores
                </p>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-12">
              <Button 
                onClick={() => signIn("google")} 
                size="lg"
                className="btn-animate bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-3 text-lg"
              >
                <Icons.google className="mr-2 h-5 w-5" />
                Iniciar Sesión
              </Button>
              <Button 
                onClick={() => window.location.href = '/waitlist'} 
                variant="outline" 
                size="lg"
                className="btn-animate px-8 py-3 text-lg glass"
              >
                <Star className="mr-2 h-5 w-5" />
                Unirse a la Lista de Espera
              </Button>
            </div>

            {/* Waitlist Info */}
            <div className="text-center text-sm text-muted-foreground mt-8 max-w-2xl mx-auto">
              <p className="glass p-4 rounded-lg">
                ¿No tienes acceso? Únete a nuestra lista de espera para ser notificado cuando esté disponible.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="glass rounded-2xl p-6 mb-8 slide-in">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-2 rounded-lg">
                  <BookOpen className="h-6 w-6 text-white" />
                </div>
                <h1 className="text-3xl font-bold tracking-tight gradient-text">
                  Book Tracker
                </h1>
              </div>
              <p className="text-muted-foreground text-lg">
                Tu biblioteca personal a un vistazo
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto">
              <div className="w-full sm:w-auto">
                <Suspense fallback={<div className="h-10 w-64 loading-pulse rounded-md" />}>
                  <SearchBooks />
                </Suspense>
              </div>
              <div className="flex items-center gap-2">
                <AddBook />
                <UserNav />
              </div>
            </div>
          </div>
        </div>

        {/* Books Section */}
        <div className="fade-in">
          <Suspense fallback={
            <div className="flex justify-center items-center py-12">
              <Loading text="Cargando libros..." size="md" variant="dots" />
            </div>
          }>
            <BookList />
          </Suspense>
        </div>
      </main>
    </div>
  );
}
