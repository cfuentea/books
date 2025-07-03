"use client";

import type { Book } from "@/generated/prisma";
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
import { Pencil, Trash2, BookOpen, Calendar, User } from "lucide-react";
import Image from "next/image";
import { EditBook } from "./EditBook";
import { useState } from "react";

type BookCardProps = {
  book: Book;
};

export function BookCard({ book }: BookCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (confirm("¿Estás seguro de que quieres eliminar este libro?")) {
      setIsDeleting(true);
      await deleteBook(book.id);
      setIsDeleting(false);
    }
  };

  const formatDate = (dateString: string | Date | null) => {
    if (!dateString) return null;
    const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
    return date.getFullYear();
  };

  return (
    <Card 
      className={`group relative overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-xl bg-gradient-to-br from-white/80 to-white/60 dark:from-slate-800/80 dark:to-slate-700/60 backdrop-blur-sm border-0 shadow-lg hover:shadow-2xl`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Gradient overlay on hover */}
      <div className={`absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
      
      <CardHeader className="relative z-10 pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg font-bold text-gray-900 dark:text-gray-100 truncate leading-tight">
              {book.title}
            </CardTitle>
            <CardDescription className="text-sm text-gray-600 dark:text-gray-400 mt-1 flex items-center gap-1">
              <User className="h-3 w-3" />
              {book.author}
            </CardDescription>
          </div>
        </div>
        
        {/* Book metadata */}
        <div className="flex items-center gap-4 mt-2 text-xs text-gray-500 dark:text-gray-400">
          {book.publishedAt && (
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              <span>{formatDate(book.publishedAt)}</span>
            </div>
          )}
          {book.isbn && (
            <div className="flex items-center gap-1">
              <BookOpen className="h-3 w-3" />
              <span className="font-mono">{book.isbn}</span>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="relative z-10 p-0">
        <div className="relative w-full overflow-hidden rounded-2xl mx-4 bg-muted flex items-center justify-center" style={{ paddingTop: '150%' /* Aspect Ratio 2:3 */ }}>
          {book.cover ? (
            <Image
              src={book.cover}
              alt={`Portada de ${book.title}`}
              fill
              className={`object-contain transition-transform duration-300 p-2 ${isHovered ? 'scale-105' : 'scale-100'} rounded-2xl`}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              style={{ background: 'rgba(255,255,255,0.7)' }}
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center text-center p-4 rounded-2xl">
              <div className="space-y-2">
                <BookOpen className="h-8 w-8 mx-auto text-gray-400 dark:text-gray-500" />
                <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                  Sin portada
                </span>
              </div>
            </div>
          )}
          {/* Overlay on hover */}
          <div className={`absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300 rounded-2xl`} />
        </div>
      </CardContent>

      <CardFooter className="relative z-10 pt-4 px-4 pb-4">
        <div className="flex justify-between items-center w-full">
          {/* Notes preview */}
          {book.notes && (
            <div className="flex-1 mr-3">
              <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2">
                {book.notes}
              </p>
            </div>
          )}
          
          {/* Action buttons */}
          <div className="flex space-x-2">
            <EditBook book={book}>
              <Button 
                variant="outline" 
                size="icon"
                className="h-8 w-8 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-gray-200 dark:border-gray-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-200"
              >
                <Pencil className="h-3 w-3" />
              </Button>
            </EditBook>
            <Button
              variant="destructive"
              size="icon"
              onClick={handleDelete}
              disabled={isDeleting}
              className="h-8 w-8 bg-red-500/10 dark:bg-red-500/20 backdrop-blur-sm border-red-200 dark:border-red-800 hover:bg-red-500/20 dark:hover:bg-red-500/30 transition-all duration-200"
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
} 