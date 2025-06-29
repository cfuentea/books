import { z } from 'zod';

export const BookSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  author: z.string().optional(),
  isbn: z.string().optional(),
  cover: z.any().optional(),
  publishedAt: z.string().optional(),
  description: z.string().optional(),
  notes: z.string().optional(),
});

export type BookFormValues = z.infer<typeof BookSchema>; 