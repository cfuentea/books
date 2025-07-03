import { z } from 'zod';

export const BookSchema = z.object({
  title: z.string().min(1, 'El título es obligatorio'),
  author: z.string().min(1, 'El autor es obligatorio'),
  isbn: z.string().min(10, 'ISBN debe tener al menos 10 caracteres').optional(),
  cover: z.any().optional(),
  publishedAt: z.string().optional(),
  description: z.string().optional(),
  notes: z.string().optional(),
  
  // Nuevos campos
  purchaseDate: z.string().optional(),
  price: z.number().min(0, 'El precio no puede ser negativo').optional(),
  condition: z.enum(['NEW', 'LIKE_NEW', 'GOOD', 'FAIR', 'POOR']).default('GOOD'),
  location: z.string().optional(),
  isLent: z.boolean().default(false),
  lentTo: z.string().optional(),
  lentAt: z.string().optional(),
  tags: z.array(z.string()).default([]),
});

export type BookFormValues = z.infer<typeof BookSchema>; 