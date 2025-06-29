"use client";

import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { BookCard } from "./BookCard";
import { getBooks } from "@/app/actions";
import type { Book } from "@prisma/client";

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
    return <p className="text-center text-muted-foreground">Loading books...</p>;
  }

  if (filteredBooks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-12">
        <h3 className="text-xl font-semibold">No books found</h3>
        <p className="text-muted-foreground">Try adjusting your search or add a new book.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
      {filteredBooks.map((book) => (
        <BookCard key={book.id} book={book} />
      ))}
    </div>
  );
} 