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
import { Pencil, Trash2, BookOpen, Calendar, User, Star, Eye } from "lucide-react";
import Image from "next/image";
import { EditBook } from "./EditBook";
import { useState, memo } from "react";

type BookCardProps = {
  book: Book;
};

export const BookCard = memo(function BookCard({ book }: BookCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [imageError, setImageError] = useState(false);

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
      className={`group relative overflow-hidden transition-all duration-500 ease-out transform hover:scale-[1.02] hover:-translate-y-2 bg-gradient-to-br from-white via-white to-gray-50/30 dark:from-slate-800 dark:via-slate-800 dark:to-slate-900/50 border-0 shadow-lg hover:shadow-2xl hover:shadow-blue-500/10 dark:hover:shadow-purple-500/10`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Animated background gradient */}
      <div className={`absolute inset-0 bg-gradient-to-br from-blue-500/0 via-purple-500/0 to-pink-500/0 group-hover:from-blue-500/5 group-hover:via-purple-500/5 group-hover:to-pink-500/5 transition-all duration-700 ease-out`} />
      
      {/* Shimmer effect on hover */}
      <div className={`absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent dark:via-white/10 transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[200%] transition-transform duration-1000 ease-out pointer-events-none`} />
      
      <CardHeader className="relative z-10 pb-3 space-y-3">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0 pr-2">
            <CardTitle className="text-base font-bold text-gray-900 dark:text-gray-100 line-clamp-2 leading-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
              {book.title}
            </CardTitle>
            <CardDescription className="text-sm text-gray-600 dark:text-gray-400 mt-1.5 flex items-center gap-1.5 group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors duration-300">
              <div className="p-1 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 group-hover:from-blue-500/20 group-hover:to-purple-500/20 transition-all duration-300">
                <User className="h-3 w-3 text-blue-600 dark:text-blue-400" />
              </div>
              <span className="truncate">{book.author}</span>
            </CardDescription>
          </div>
        </div>
        
        {/* Enhanced metadata */}
        <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
          {book.publishedAt && (
            <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-gradient-to-r from-green-500/10 to-emerald-500/10 group-hover:from-green-500/20 group-hover:to-emerald-500/20 transition-all duration-300">
              <Calendar className="h-3 w-3 text-green-600 dark:text-green-400" />
              <span className="font-medium">{formatDate(book.publishedAt)}</span>
            </div>
          )}
          {book.isbn && (
            <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-gradient-to-r from-purple-500/10 to-pink-500/10 group-hover:from-purple-500/20 group-hover:to-pink-500/20 transition-all duration-300">
              <BookOpen className="h-3 w-3 text-purple-600 dark:text-purple-400" />
              <span className="font-mono font-medium">ISBN</span>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="relative z-10 p-0 mb-4">
        <div className="relative w-full overflow-hidden rounded-2xl mx-4 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 flex items-center justify-center shadow-inner group-hover:shadow-lg transition-all duration-500" style={{ paddingTop: '140%' }}>
          {book.cover && !imageError ? (
            <Image
              src={book.cover}
              alt={`Portada de ${book.title}`}
              fill
              className={`object-contain transition-all duration-500 p-3 ${isHovered ? 'scale-105 brightness-110' : 'scale-100'} rounded-2xl filter drop-shadow-lg`}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              onError={() => setImageError(true)}
              priority={false}
              quality={85}
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-blue-900/20 dark:via-purple-900/20 dark:to-pink-900/20 flex items-center justify-center text-center p-6 rounded-2xl group-hover:scale-105 transition-all duration-500">
              <div className="space-y-3">
                <div className="p-3 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 group-hover:from-blue-500/30 group-hover:to-purple-500/30 transition-all duration-300 mx-auto w-fit">
                  <BookOpen className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-400 font-medium block">
                  Sin portada
                </span>
              </div>
            </div>
          )}
          
          {/* Book preview overlay */}
          <div className={`absolute inset-0 bg-gradient-to-t from-black/0 via-transparent to-black/0 group-hover:from-black/10 group-hover:to-transparent transition-all duration-500 rounded-2xl flex items-end justify-center pb-3 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
            <div className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm shadow-lg">
              <Eye className="h-3 w-3 text-blue-600 dark:text-blue-400" />
              <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Vista previa</span>
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="relative z-10 pt-2 px-4 pb-4">
        {/* Enhanced notes and rating */}
        <div className="w-full space-y-3">
          {book.notes && (
            <div className="p-3 rounded-xl bg-gradient-to-r from-gray-50/50 to-gray-100/50 dark:from-slate-800/50 dark:to-slate-700/50 border border-gray-200/50 dark:border-slate-600/50 group-hover:border-blue-200/50 dark:group-hover:border-blue-800/50 transition-all duration-300">
              <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-3 leading-relaxed">
                {book.notes}
              </p>
            </div>
          )}
          
          {/* Rating and actions */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star 
                  key={star} 
                  className={`h-3 w-3 ${star <= 4 ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300 dark:text-gray-600'} transition-colors duration-200`} 
                />
              ))}
              <span className="text-xs text-gray-500 dark:text-gray-400 ml-1 font-medium">4.0</span>
            </div>
            
            {/* Action buttons */}
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all duration-300">
              <EditBook book={book}>
                <Button 
                  variant="outline" 
                  size="icon"
                  className="h-7 w-7 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-gray-200 dark:border-gray-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-200"
                >
                  <Pencil className="h-3 w-3" />
                </Button>
              </EditBook>
              <Button
                variant="destructive"
                size="icon"
                onClick={handleDelete}
                disabled={isDeleting}
                className="h-7 w-7 bg-red-500/10 dark:bg-red-500/20 backdrop-blur-sm border-red-200 dark:border-red-800 hover:bg-red-500/20 dark:hover:bg-red-500/30 transition-all duration-200"
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          </div>
          
          {/* Status badge */}
          <div className="flex justify-center">
            <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-gradient-to-r from-emerald-500/10 to-green-500/10 group-hover:from-emerald-500/20 group-hover:to-green-500/20 transition-all duration-300">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
              <span className="text-xs font-medium text-emerald-700 dark:text-emerald-400">Disponible</span>
            </div>
          </div>
        </div>
      </CardFooter>
      
      {/* Magical border glow on hover */}
      <div className={`absolute inset-0 rounded-lg bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 opacity-0 group-hover:opacity-100 transition-all duration-500 pointer-events-none -z-10 blur-sm`} />
    </Card>
  );
}); 