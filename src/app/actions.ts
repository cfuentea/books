"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { BookFormValues, BookSchema } from "@/lib/schemas";
import { writeFile } from "fs/promises";
import { join } from "path";

export async function getBooks({
  query,
}: {
  query?: string;
}) {
  const where = query
    ? {
        OR: [
          {
            title: {
              contains: query,
            },
          },
          {
            author: {
              contains: query,
            },
          },
        ],
      }
    : {};

  return await prisma.book.findMany({
    where,
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function addBook(formData: FormData) {
  const values = Object.fromEntries(formData.entries());
  const validatedFields = BookSchema.safeParse(values);

  if (!validatedFields.success) {
    console.error(validatedFields.error);
    return { error: "Invalid data" };
  }

  const { title, author, isbn, publishedAt, description, notes } = validatedFields.data;
  let cover = validatedFields.data.cover;

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

  await prisma.book.create({
    data: {
      title,
      author: author || "Unknown Author",
      isbn: isbn || null,
      cover: coverPath,
      publishedAt: publishedDate,
      description: description || null,
      notes: notes || null,
    },
  });

  revalidatePath("/");
  return { success: "Book added!" };
}

export async function deleteBook(id: string) {
  await prisma.book.delete({
    where: {
      id,
    },
  });

  revalidatePath("/");
}

export async function updateBook(id: string, formData: FormData) {
  const values = Object.fromEntries(formData.entries());
  const validatedFields = BookSchema.safeParse(values);

  if (!validatedFields.success) {
    console.error(validatedFields.error);
    return { error: "Invalid data" };
  }

  const { title, author, isbn, publishedAt, description, notes } = validatedFields.data;
  let cover = validatedFields.data.cover;

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

  const dataToUpdate: any = {
    title,
    author: author || "Unknown Author",
    isbn: isbn || null,
    publishedAt: publishedDate,
    description: description || null,
    notes: notes || null,
  };

  if (coverPath) {
    dataToUpdate.cover = coverPath;
  }

  await prisma.book.update({
    where: { id },
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
        author: book.authors ? book.authors.map((a: { name: any; }) => a.name).join(", ") : "Unknown Author",
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