"use client";

import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { BookCard } from "./BookCard";
import { getBooks } from "@/app/actions";
import type { Book } from "@/generated/prisma";
import { BookOpen, Search, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AddBook } from "./AddBook";
import { BookGridSkeleton } from "@/components/ui/loading";

export function BookList() {
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const searchParams = useSearchParams();
  const query = searchParams.get("query") || "";

  useEffect(() => {
    const fetchBooks = async () => {
      setIsLoading(true);
      const allBooks = await getBooks({});
      setBooks(allBooks);
      setIsLoading(false);
    };
    fetchBooks();
  }, []);

  const filteredBooks = useMemo(() => {
    if (!query) {
      return books;
    }
    return books.filter(
      (book) =>
        book.title.toLowerCase().includes(query.toLowerCase()) ||
        book.author.toLowerCase().includes(query.toLowerCase())
    );
  }, [books, query]);

  if (isLoading) {
    return <BookGridSkeleton count={12} />;
  }

  if (filteredBooks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-16 space-y-6">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-xl"></div>
          <div className="relative bg-gradient-to-r from-blue-500 to-purple-600 p-6 rounded-full">
            {query ? (
              <Search className="h-12 w-12 text-white" />
            ) : (
              <BookOpen className="h-12 w-12 text-white" />
            )}
          </div>
        </div>
        
        <div className="space-y-2">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {query ? "No se encontraron libros" : "Tu biblioteca está vacía"}
          </h3>
          <p className="text-muted-foreground max-w-md">
            {query 
              ? "Intenta ajustar tu búsqueda o añadir un nuevo libro a tu colección."
              : "Comienza a construir tu biblioteca personal añadiendo tu primer libro."
            }
          </p>
        </div>

        {!query && (
          <div className="flex flex-col sm:flex-row gap-3">
            <AddBook />
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Results header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-2 rounded-lg">
            <BookOpen className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              Tu Biblioteca
            </h2>
            <p className="text-sm text-muted-foreground">
              {filteredBooks.length} libro{filteredBooks.length !== 1 ? 's' : ''} en tu colección
              {query && ` que coinciden con "${query}"`}
            </p>
          </div>
        </div>
        
        <AddBook />
      </div>

      {/* Books grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-4 sm:gap-6">
        {filteredBooks.map((book, index) => (
          <div 
            key={book.id} 
            className="bounce-in"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <BookCard book={book} />
          </div>
        ))}
      </div>
    </div>
  );
} 