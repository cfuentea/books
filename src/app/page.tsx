"use client";

import { AddBook } from "@/components/books/AddBook";
import { BookList } from "@/components/books/BookList";
import { SearchBooks } from "@/components/books/SearchBooks";
import { UserNav } from "@/components/auth/UserNav";
import { Suspense } from "react";
import { useSession, signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";

export default function Home() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (status === "unauthenticated") {
    return (
      <div className="container mx-auto flex flex-col items-center justify-center h-screen gap-6">
        <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight">Book Tracker</h1>
            <p className="text-xl text-muted-foreground mt-2">Tu biblioteca personal en la nube</p>
            <p className="text-lg text-muted-foreground mb-4">
              Actualmente estamos en fase beta con acceso limitado.
            </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4">
          <Button onClick={() => signIn("google")} variant="default">
            <Icons.google className="mr-2 h-4 w-4" />
            Iniciar Sesión
          </Button>
          <Button onClick={() => window.location.href = '/waitlist'} variant="outline">
            Unirse a la Lista de Espera
          </Button>
        </div>
        <div className="text-center text-sm text-muted-foreground mt-4">
          <p>¿No tienes acceso? Únete a nuestra lista de espera para ser notificado cuando esté disponible.</p>
        </div>
      </div>
    );
  }

  return (
    <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8">
        <div className="flex-1">
          <h1 className="text-3xl font-bold tracking-tight">Book Tracker</h1>
          <p className="text-muted-foreground">Your personal library at a glance.</p>
        </div>
        <div className="flex items-center gap-4">
          <Suspense fallback={<div className="h-10 w-64" />}>
            <SearchBooks />
          </Suspense>
          <AddBook />
          <UserNav />
        </div>
      </div>
      <Suspense fallback={<p>Loading books...</p>}>
        <BookList />
      </Suspense>
    </main>
  );
}
