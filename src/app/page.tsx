"use client";

import { AddBook } from "@/components/books/AddBook";
import { BookList } from "@/components/books/BookList";
import { SearchBooks } from "@/components/books/SearchBooks";
import { UserNav } from "@/components/auth/UserNav";
import { Suspense } from "react";
import { useSession, signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import { BookOpen, Sparkles, Users, Star, Smartphone, Share2, Search as SearchIcon, Book, Globe, CheckCircle } from "lucide-react";
import { Loading } from "@/components/ui/loading";
import Image from "next/image";

const SOCIAL_PROOF = {
  users: 124,
  books: 2345,
  friends: 37,
};

const FEATURES = [
  {
    icon: <SearchIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />, 
    title: "Búsqueda instantánea",
    desc: "Encuentra cualquier libro por título, autor o código de barras al instante."
  },
  {
    icon: <BookOpen className="h-6 w-6 text-purple-600 dark:text-purple-400" />, 
    title: "Organización fácil",
    desc: "Gestiona tu biblioteca personal de forma intuitiva y visual."
  },
  {
    icon: <Smartphone className="h-6 w-6 text-green-600 dark:text-green-400" />, 
    title: "Acceso multiplataforma",
    desc: "Tus libros siempre disponibles desde cualquier dispositivo."
  },
  {
    icon: <Share2 className="h-6 w-6 text-pink-600 dark:text-pink-400" />, 
    title: "Comparte con amigos",
    desc: "Próximamente: comparte tu biblioteca y recomendaciones."
  },
  {
    icon: <Sparkles className="h-6 w-6 text-yellow-500 dark:text-yellow-300" />, 
    title: "Recomendaciones inteligentes",
    desc: "Recibe sugerencias personalizadas según tus gustos."
  },
];

const TESTIMONIALS = [
  {
    name: "María P.",
    text: "¡Por fin tengo mis libros organizados y puedo encontrarlos en segundos! La app es hermosa y fácil de usar.",
  },
  {
    name: "Carlos R.",
    text: "El escáner de códigos me ahorra mucho tiempo. ¡La recomiendo a todos los lectores!",
  },
  {
    name: "Lucía G.",
    text: "Me encanta poder acceder a mi biblioteca desde el móvil y la web. El diseño es espectacular.",
  },
];

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
        {/* HERO SECTION */}
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 flex flex-col items-center text-center gap-10 fade-in">
          <div className="relative w-full max-w-3xl mx-auto">
            <div className="absolute -top-16 -left-16 hidden md:block opacity-40 animate-bounce-slow">
              <Image src="/globe.svg" alt="Ilustración mundo" width={80} height={80} />
            </div>
            <div className="absolute -bottom-16 -right-16 hidden md:block opacity-40 animate-bounce-slow">
              <Image src="/window.svg" alt="Ilustración ventana" width={80} height={80} />
            </div>
            <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight gradient-text mb-4">
              Organiza, descubre y comparte tu biblioteca personal
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8">
              Lleva el control de tus libros, encuentra recomendaciones y accede desde cualquier lugar.
            </p>
            <Button 
              onClick={() => signIn("google")}
              size="lg"
              className="btn-animate bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-10 py-4 text-xl shadow-xl"
            >
              <Icons.google className="mr-2 h-6 w-6" />
              Regístrate gratis
            </Button>
            <div className="flex flex-wrap justify-center gap-6 mt-10">
              <div className="flex items-center gap-2 text-lg text-muted-foreground">
                <Users className="h-5 w-5 text-blue-500" />
                <span><b>{SOCIAL_PROOF.users}</b> usuarios</span>
              </div>
              <div className="flex items-center gap-2 text-lg text-muted-foreground">
                <Book className="h-5 w-5 text-purple-500" />
                <span><b>{SOCIAL_PROOF.books}</b> libros registrados</span>
              </div>
              <div className="flex items-center gap-2 text-lg text-muted-foreground">
                <Globe className="h-5 w-5 text-green-500" />
                <span><b>{SOCIAL_PROOF.friends}</b> bibliotecas compartidas</span>
              </div>
            </div>
          </div>
        </section>

        {/* DEMO VISUAL */}
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col items-center text-center fade-in">
          <div className="relative w-full max-w-2xl mx-auto rounded-2xl overflow-hidden shadow-2xl bg-white/80 dark:bg-slate-800/80 p-4">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-100/40 to-purple-100/40 dark:from-blue-900/20 dark:to-purple-900/20 pointer-events-none" />
            <div className="relative z-10">
              <Image src="/file.svg" alt="Demo app" width={60} height={60} className="mx-auto mb-4" />
              <p className="text-lg text-muted-foreground mb-2">Así se ve tu biblioteca personal:</p>
              <div className="rounded-xl overflow-hidden border border-muted shadow-lg">
                {/* Aquí podrías poner un screenshot real o un video demo */}
                <Image src="/demo-screenshot.png" alt="Screenshot app" width={600} height={320} className="w-full object-cover" />
              </div>
              <p className="text-xs text-muted-foreground mt-2">* Demo visual, tu biblioteca se verá así de bien</p>
            </div>
          </div>
        </section>

        {/* CARACTERÍSTICAS PRINCIPALES */}
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 fade-in">
          <h2 className="text-3xl font-bold mb-8 gradient-text">Características principales</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {FEATURES.map((f, i) => (
              <div key={i} className="glass rounded-xl p-6 flex flex-col items-center text-center hover-lift fade-in" style={{ animationDelay: `${i * 100}ms` }}>
                <div className="mb-4">{f.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{f.title}</h3>
                <p className="text-muted-foreground">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* TESTIMONIOS */}
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 fade-in">
          <h2 className="text-3xl font-bold mb-8 gradient-text">Testimonios</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className="glass rounded-xl p-6 flex flex-col items-center text-center hover-lift fade-in" style={{ animationDelay: `${i * 100}ms` }}>
                <CheckCircle className="h-8 w-8 text-green-500 mb-2" />
                <p className="text-lg italic mb-4">“{t.text}”</p>
                <span className="font-semibold text-blue-600">{t.name}</span>
              </div>
            ))}
          </div>
        </section>

        {/* CTA FINAL */}
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col items-center text-center fade-in">
          <h2 className="text-3xl font-bold mb-6 gradient-text">¿Listo para organizar tu biblioteca?</h2>
          <Button 
            onClick={() => signIn("google")}
            size="lg"
            className="btn-animate bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-10 py-4 text-xl shadow-xl"
          >
            <Icons.google className="mr-2 h-6 w-6" />
            Regístrate gratis
          </Button>
        </section>
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
