import { z } from 'zod';

export const BookSchema = z.object({
  title: z.string().min(1, 'El título es obligatorio'),
  author: z.string().min(1, 'El autor es obligatorio'),
  isbn: z.string().optional().or(z.literal('')),
  cover: z.any().optional(),
  publishedAt: z.string().optional(),
  description: z.string().optional(),
  notes: z.string().optional(),
  
  // Nuevos campos
  purchaseDate: z.string().optional(),
  price: z.union([
    z.string().transform((val: string) => val === '' ? undefined : parseFloat(val)),
    z.number(),
    z.undefined()
  ]).refine((val: number | undefined) => val === undefined || val >= 0, 'El precio no puede ser negativo').optional(),
  condition: z.enum(['NEW', 'LIKE_NEW', 'GOOD', 'FAIR', 'POOR']).default('GOOD'),
  location: z.string().optional(),
  isLent: z.boolean().default(false),
  lentTo: z.string().optional(),
  lentAt: z.string().optional(),
  tags: z.string().optional(),
});

export type BookFormValues = z.infer<typeof BookSchema>; 