"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { BookFormValues, BookSchema } from "@/lib/schemas";
import { writeFile } from "fs/promises";
import { join } from "path";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Decimal } from "@prisma/client/runtime/library";

async function getUserSession() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    throw new Error("You must be signed in to perform this action.");
  }
  return session;
}

export async function getBooks({
  query,
  limit = 20,
  cursor,
}: {
  query?: string;
  limit?: number;
  cursor?: string | null;
}) {
  const session = await getUserSession();
  const where: Record<string, unknown> = {
    userId: session.user.id,
  };
  if (query) {
    where.OR = [
      { title: { contains: query, mode: 'insensitive' } },
      { author: { contains: query, mode: 'insensitive' } },
    ];
  }
  const books = await prisma.book.findMany({
    where,
    orderBy: { createdAt: "desc" },
    take: limit + 1,
    ...(cursor ? { skip: 1, cursor: { id: cursor } } : {}),
  });
  let hasMore = false;
  if (books.length > limit) {
    hasMore = true;
    books.pop();
  }
  return { books, hasMore };
}

export async function addBook(formData: FormData) {
  const session = await getUserSession();
  const values = Object.fromEntries(formData.entries());
  const validatedFields = BookSchema.safeParse(values);

  if (!validatedFields.success) {
    console.error(validatedFields.error);
    return { error: "Invalid data" };
  }

  const { 
    title, 
    author, 
    isbn, 
    publishedAt, 
    description, 
    notes,
    purchaseDate,
    price,
    condition,
    location,
    isLent,
    lentTo,
    lentAt,
    tags
  } = validatedFields.data;
  const cover = validatedFields.data.cover;

  let coverPath: string | null = null;

  // Handle file upload
  if (cover && typeof cover !== 'string' && cover.size > 0) {
    const file = cover as File;
    if (file.size > 0) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      
      const fileExtension = file.name.split('.').pop();
      const newFilename = `${Date.now()}.${fileExtension}`;
      const path = join(process.cwd(), "public/covers", newFilename);
      
      await writeFile(path, buffer);
      coverPath = `/covers/${newFilename}`;
    }
  } else if (typeof cover === 'string') {
    coverPath = cover;
  }
  
  let publishedDate: Date | null = null;
  if (publishedAt) {
      const date = new Date(publishedAt as string);
      if (!isNaN(date.getTime())) {
          publishedDate = date;
      }
  }

  let purchaseDateTime: Date | null = null;
  if (purchaseDate) {
    const date = new Date(purchaseDate as string);
    if (!isNaN(date.getTime())) {
      purchaseDateTime = date;
    }
  }

  let lentDateTime: Date | null = null;
  if (lentAt) {
    const date = new Date(lentAt as string);
    if (!isNaN(date.getTime())) {
      lentDateTime = date;
    }
  }

  await prisma.book.create({
    data: {
      title,
      author: author || "Unknown Author",
      isbn: isbn || null,
      cover: coverPath,
      publishedAt: publishedDate,
      description: description || null,
      notes: notes || null,
      purchaseDate: purchaseDateTime,
      price: price ? new Decimal(price) : null,
      condition: condition || 'GOOD',
      location: location || null,
      isLent: isLent || false,
      lentTo: isLent ? (lentTo || null) : null,
      lentAt: isLent ? lentDateTime : null,
      tags: tags || [],
      userId: session.user.id,
    },
  });

  revalidatePath("/");
  return { success: "Book added!" };
}

export async function deleteBook(id: string) {
  const session = await getUserSession();
  await prisma.book.delete({
    where: {
      id,
      userId: session.user.id,
    },
  });

  revalidatePath("/");
}

export async function updateBook(id: string, formData: FormData) {
  const session = await getUserSession();
  const values = Object.fromEntries(formData.entries());
  const validatedFields = BookSchema.safeParse(values);

  if (!validatedFields.success) {
    console.error(validatedFields.error);
    return { error: "Invalid data" };
  }

  const { 
    title, 
    author, 
    isbn, 
    publishedAt, 
    description, 
    notes,
    purchaseDate,
    price,
    condition,
    location,
    isLent,
    lentTo,
    lentAt,
    tags
  } = validatedFields.data;
  const cover = validatedFields.data.cover;

  let coverPath: string | null = null;

  // Handle file upload
  if (cover && typeof cover !== 'string' && cover.size > 0) {
    const file = cover as File;
    if (file.size > 0) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      
      const fileExtension = file.name.split('.').pop();
      const newFilename = `${Date.now()}.${fileExtension}`;
      const path = join(process.cwd(), "public/covers", newFilename);
      
      await writeFile(path, buffer);
      coverPath = `/covers/${newFilename}`;
    }
  } else if (typeof cover === 'string') {
    coverPath = cover;
  }
  
  let publishedDate: Date | null = null;
  if (publishedAt) {
      const date = new Date(publishedAt as string);
      if (!isNaN(date.getTime())) {
          publishedDate = date;
      }
  }

  let purchaseDateTime: Date | null = null;
  if (purchaseDate) {
    const date = new Date(purchaseDate as string);
    if (!isNaN(date.getTime())) {
      purchaseDateTime = date;
    }
  }

  let lentDateTime: Date | null = null;
  if (lentAt) {
    const date = new Date(lentAt as string);
    if (!isNaN(date.getTime())) {
      lentDateTime = date;
    }
  }

  const dataToUpdate: Record<string, unknown> = {
    title,
    author: author || "Unknown Author",
    isbn: isbn || null,
    publishedAt: publishedDate,
    description: description || null,
    notes: notes || null,
    purchaseDate: purchaseDateTime,
    price: price ? new Decimal(price) : null,
    condition: condition || 'GOOD',
    location: location || null,
    isLent: isLent || false,
    lentTo: isLent ? (lentTo || null) : null,
    lentAt: isLent ? lentDateTime : null,
    tags: tags || [],
  };

  if (coverPath) {
    dataToUpdate.cover = coverPath;
  }

  await prisma.book.update({
    where: { 
      id,
      userId: session.user.id,
    },
    data: dataToUpdate,
  });

  revalidatePath("/");
  return { success: "Book updated!" };
}

export async function searchBookByISBN(isbn: string): Promise<Partial<BookFormValues> | null> {
  // Try Google Books API first
  try {
    const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}`);
    const data = await response.json();
    if (data.totalItems > 0) {
      const book = data.items[0].volumeInfo;
      return {
        title: book.title,
        author: book.authors ? book.authors.join(", ") : "Unknown Author",
        description: book.description,
        cover: book.imageLinks?.thumbnail,
        publishedAt: book.publishedDate,
        isbn: isbn,
      };
    }
  } catch (error) {
    console.error("Google Books API error:", error);
  }

  // Fallback to OpenLibrary API
  try {
    const response = await fetch(`https://openlibrary.org/api/books?bibkeys=ISBN:${isbn}&jscmd=data&format=json`);
    const data = await response.json();
    const bookKey = `ISBN:${isbn}`;
    if (data[bookKey]) {
      const book = data[bookKey];
      return {
        title: book.title,
        author: book.authors ? book.authors.map((a: { name: string }) => a.name).join(", ") : "Unknown Author",
        description: typeof book.notes === 'string' ? book.notes : '',
        cover: book.cover?.large,
        publishedAt: book.publish_date,
        isbn: isbn,
      };
    }
  } catch (error) {
    console.error("OpenLibrary API error:", error);
  }

  return null;
} 
