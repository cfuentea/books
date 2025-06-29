import { AddBook } from "@/components/books/AddBook";
import { BookList } from "@/components/books/BookList";
import { SearchBooks } from "@/components/books/SearchBooks";
import { Suspense } from "react";

export default function Home() {
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
        </div>
      </div>
      <Suspense fallback={<p>Loading books...</p>}>
        <BookList />
      </Suspense>
    </main>
  );
}
