"use client";

import { useState, useEffect, useMemo, useRef, useCallback } from "react";
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
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [autoLoading, setAutoLoading] = useState(true);
  const searchParams = useSearchParams();
  const query = searchParams.get("query") || "";
  const LIMIT = 10;
  const observer = useRef<IntersectionObserver | null>(null);
  const gridRef = useRef<HTMLDivElement | null>(null);
  const lastBookRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (isLoadingMore) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new window.IntersectionObserver(entries => {
        if (entries[0].isIntersecting && hasMore && autoLoading) {
          loadMore();
        }
      });
      if (node) observer.current.observe(node);
    },
    [isLoadingMore, hasMore, autoLoading]
  );

  useEffect(() => {
    setBooks([]);
    setHasMore(true);
    setIsLoading(true);
    setAutoLoading(true);
    getBooks({ query, limit: LIMIT, cursor: null }).then(res => {
      setBooks(res.books);
      setHasMore(res.hasMore);
      setIsLoading(false);
    });
  }, [query]);

  // Cargar más si la lista no llena la pantalla
  useEffect(() => {
    if (!isLoading && hasMore && autoLoading) {
      const checkAndLoad = () => {
        if (gridRef.current && window.innerHeight > gridRef.current.getBoundingClientRect().bottom) {
          loadMore();
        }
      };
      setTimeout(checkAndLoad, 300);
    }
  }, [books, isLoading, hasMore, autoLoading]);

  const loadMore = async () => {
    if (!hasMore || isLoadingMore || books.length === 0) return;
    setIsLoadingMore(true);
    const last = books[books.length - 1];
    const res = await getBooks({ query, limit: LIMIT, cursor: last.id });
    setBooks(prev => [...prev, ...res.books]);
    setHasMore(res.hasMore);
    setIsLoadingMore(false);
  };

  const handleManualLoad = () => {
    setAutoLoading(false);
    loadMore();
  };

  if (isLoading) {
    return <BookGridSkeleton count={LIMIT} />;
  }

  if (books.length === 0) {
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
              {books.length} libro{books.length !== 1 ? 's' : ''} en tu colección
              {query && ` que coinciden con "${query}"`}
            </p>
          </div>
        </div>
        <AddBook />
      </div>
      {/* Books grid */}
      <div ref={gridRef} className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-4 sm:gap-6">
        {books.map((book, index) => {
          const isLast = index === books.length - 1;
          return (
            <div
              key={book.id}
              className="bounce-in"
              style={{ animationDelay: `${index * 50}ms` }}
              ref={isLast ? lastBookRef : undefined}
            >
              <BookCard book={book} />
            </div>
          );
        })}
      </div>
      {isLoadingMore && (
        <div className="flex justify-center py-6">
          <BookGridSkeleton count={4} />
        </div>
      )}
      {hasMore && !autoLoading && (
        <div className="flex justify-center py-6">
          <button
            onClick={handleManualLoad}
            className="btn-animate bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 py-2 rounded-lg shadow-lg"
          >
            Cargar más libros
          </button>
        </div>
      )}
      {!hasMore && books.length > 0 && (
        <div className="text-center text-muted-foreground py-6">
          <span>Has llegado al final de tu biblioteca 🎉</span>
        </div>
      )}
    </div>
  );
} 