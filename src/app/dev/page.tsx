"use client";

import { BookList } from "@/components/books/BookList";
import { SearchBooks } from "@/components/books/SearchBooks";
import { AddBookWizard } from "@/components/books/AddBookWizard";
import { Suspense } from "react";
import { BookOpen, AlertTriangle } from "lucide-react";
import { Loading } from "@/components/ui/loading";
import { Button } from "@/components/ui/button";

export default function DevPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Development Banner */}
      <div className="bg-yellow-100 dark:bg-yellow-900/20 border-b border-yellow-200 dark:border-yellow-800 p-3">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
            <span className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
              Modo de Desarrollo - No se requiere autenticación
            </span>
          </div>
          <Button 
            onClick={() => window.location.href = "/"}
            variant="outline"
            size="sm"
            className="text-xs border-yellow-300 text-yellow-700 hover:bg-yellow-50 dark:border-yellow-700 dark:text-yellow-300 dark:hover:bg-yellow-900/30"
          >
            Volver al inicio
          </Button>
        </div>
      </div>

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
                  Book Tracker - Demo
                </h1>
              </div>
              <p className="text-muted-foreground text-lg">
                Tu biblioteca personal a un vistazo (Modo de desarrollo)
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto">
              <div className="w-full sm:w-auto">
                <Suspense fallback={<div className="h-10 w-64 loading-pulse rounded-md" />}>
                  <SearchBooks />
                </Suspense>
              </div>
              <div className="flex items-center gap-2">
                <AddBookWizard />
                <div className="glass rounded-full p-2">
                  <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                    <span className="text-white text-sm font-bold">D</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Development Info */}
        <div className="glass rounded-xl p-4 mb-6 bg-blue-50/50 dark:bg-blue-900/10 border border-blue-200/50 dark:border-blue-800/50">
          <div className="flex items-start gap-3">
            <BookOpen className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
            <div>
              <h3 className="font-medium text-blue-900 dark:text-blue-100 mb-1">
                Modo de Desarrollo Activado
              </h3>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                Esta es una versión de demostración. Para usar todas las funcionalidades, configura Google OAuth en el archivo <code className="bg-blue-100 dark:bg-blue-800 px-1 rounded">.env.local</code>.
              </p>
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

        {/* Instructions */}
        <div className="mt-8 glass rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-4 gradient-text">
            Instrucciones para el desarrollo
          </h3>
          <div className="space-y-3 text-sm text-muted-foreground">
            <p>• Para usar la autenticación completa, configura las variables de Google OAuth en <code className="bg-muted px-1 rounded">.env.local</code></p>
            <p>• La base de datos SQLite está configurada y funcionando correctamente</p>
            <p>• Puedes añadir libros, buscar y gestionar tu biblioteca en este modo</p>
            <p>• Consulta el archivo <code className="bg-muted px-1 rounded">PROBLEMAS_RESUELTOS.md</code> para más información</p>
          </div>
        </div>
      </main>
    </div>
  );
}