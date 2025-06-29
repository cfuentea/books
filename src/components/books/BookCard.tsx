"use client";

import { Book } from "@prisma/client";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { deleteBook } from "@/app/actions";
import { Pencil, Trash2 } from "lucide-react";
import Image from "next/image";
import { EditBook } from "./EditBook";

type BookCardProps = {
  book: Book;
};

export function BookCard({ book }: BookCardProps) {
  return (
    <Card className="flex flex-col overflow-hidden">
      <CardHeader className="flex-grow">
        <CardTitle className="truncate text-lg">{book.title}</CardTitle>
        <CardDescription>{book.author}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow flex items-center justify-center p-0">
        <div className="relative w-full" style={{ paddingTop: '150%' /* Aspect Ratio 2:3 */ }}>
          {book.cover ? (
            <Image
              src={book.cover}
              alt={`Cover of ${book.title}`}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="absolute inset-0 bg-secondary flex items-center justify-center text-center text-muted-foreground p-2">
              <span>No cover available</span>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-end pt-4">
        <div className="flex space-x-2">
          <EditBook book={book}>
            <Button variant="outline" size="icon">
              <Pencil className="h-4 w-4" />
            </Button>
          </EditBook>
          <Button
            variant="destructive"
            size="icon"
            onClick={async () => {
              if (confirm("Are you sure you want to delete this book?")) {
                await deleteBook(book.id);
              }
            }}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
} 