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
  const LIMIT = 20; // Increased limit for better performance
  const observer = useRef<IntersectionObserver | null>(null);
  const gridRef = useRef<HTMLDivElement | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const loadMore = useCallback(async () => {
    if (!hasMore || isLoadingMore || books.length === 0) return;
    setIsLoadingMore(true);
    setError(null);
    try {
      const last = books[books.length - 1];
      const res = await getBooks({ query, limit: LIMIT, cursor: last.id });
      setBooks(prev => [...prev, ...res.books]);
      setHasMore(res.hasMore);
    } catch (e) {
      setError('Ocurrió un error al cargar más libros. Intenta nuevamente.');
    } finally {
      setIsLoadingMore(false);
    }
  }, [hasMore, isLoadingMore, books, query, LIMIT]);

  const lastBookRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (isLoadingMore) return;
      if (!('IntersectionObserver' in window)) {
        setAutoLoading(false);
        setError('Tu navegador no soporta scroll automático. Usa el botón para cargar más libros.');
        return;
      }
      if (observer.current) observer.current.disconnect();
      observer.current = new window.IntersectionObserver(
        entries => {
          if (entries[0].isIntersecting && hasMore && autoLoading) {
            loadMore();
          }
        },
        { rootMargin: '100px' } // Load more items before reaching the bottom
      );
      if (node) observer.current.observe(node);
    },
    [isLoadingMore, hasMore, autoLoading, loadMore]
  );

  // Cleanup observer on unmount
  useEffect(() => {
    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, []);

  useEffect(() => {
    setBooks([]);
    setHasMore(true);
    setIsLoading(true);
    setAutoLoading(true);
    setError(null);
    
    const fetchBooks = async () => {
      try {
        const res = await getBooks({ query, limit: LIMIT, cursor: null });
        setBooks(res.books);
        setHasMore(res.hasMore);
      } catch (e) {
        setError('Ocurrió un error al buscar libros.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchBooks();
  }, [query, LIMIT]);

  // Optimized check for loading more when screen is not full
  useEffect(() => {
    if (!isLoading && hasMore && autoLoading && books.length > 0) {
      const checkAndLoad = () => {
        if (gridRef.current) {
          const rect = gridRef.current.getBoundingClientRect();
          if (window.innerHeight > rect.bottom - 200) {
            loadMore();
          }
        }
      };
      
      const timeoutId = setTimeout(checkAndLoad, 500);
      return () => clearTimeout(timeoutId);
    }
  }, [books, isLoading, hasMore, autoLoading, loadMore]);

  const handleManualLoad = useCallback(() => {
    setAutoLoading(false);
    loadMore();
  }, [loadMore]);

  // Memoize empty state to prevent unnecessary re-renders
  const emptyState = useMemo(() => (
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
  ), [query]);

  if (isLoading) {
    return <BookGridSkeleton count={LIMIT} />;
  }

  if (books.length === 0) {
    return emptyState;
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
      
      {/* Optimized Books grid - removed individual animations for better performance */}
      <div 
        ref={gridRef} 
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8 gap-4 sm:gap-6"
      >
        {books.map((book, index) => {
          const isLast = index === books.length - 1;
          return (
            <div
              key={book.id}
              ref={isLast ? lastBookRef : undefined}
              className="opacity-0 animate-in fade-in-0 slide-in-from-bottom-4"
              style={{ 
                animationDelay: `${Math.min(index * 25, 500)}ms`,
                animationFillMode: 'forwards'
              }}
            >
              <BookCard book={book} />
            </div>
          );
        })}
      </div>
      
      {/* Loading more indicator */}
      {isLoadingMore && (
        <div className="flex justify-center py-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8 gap-4 sm:gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={`skeleton-${i}`}
                className="h-80 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 rounded-xl animate-pulse"
              />
            ))}
          </div>
        </div>
      )}
      
      {/* Error state */}
      {error && (
        <div className="text-center p-4 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-red-600 dark:text-red-400 font-medium">{error}</p>
          <Button 
            onClick={() => setError(null)} 
            variant="outline" 
            size="sm" 
            className="mt-2 border-red-200 text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900/20"
          >
            Cerrar
          </Button>
        </div>
      )}
      
      {/* Manual load more button */}
      {hasMore && !autoLoading && (
        <div className="flex justify-center py-6">
          <Button
            onClick={handleManualLoad}
            disabled={isLoadingMore}
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50"
          >
            {isLoadingMore ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Cargando...
              </>
            ) : (
              <>
                <Plus className="mr-2 h-4 w-4" />
                Cargar más libros
              </>
            )}
          </Button>
        </div>
      )}
      
      {/* End of library message */}
      {!hasMore && books.length > 0 && (
        <div className="text-center py-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-800 rounded-full">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-green-700 dark:text-green-400 font-medium text-sm">
              Has llegado al final de tu biblioteca 🎉
            </span>
          </div>
        </div>
      )}
    </div>
  );
} 