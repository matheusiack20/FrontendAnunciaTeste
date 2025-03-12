import { z } from 'zod';
import { fileSchema } from './BlingFormTypes';

// Define a schema to validate file-like objects

// Define the main schema for generating infos
export const generateInfos = z.object({
  title: z
    .string()
    .min(0, { message: 'O nome deve ter pelo menos 2 caracteres.' })
    .max(100, { message: 'O nome deve ter no máximo 100 caracteres.' }),
  description: z.string().optional(),
  files: z
    .array(fileSchema)
    .refine(
      (files) => files.every((file) => file.size < 12 * 1024 * 1024),
      'File size must be less than 12MB',
    )
    .optional(),
  characters: z.enum(['60', '80', '100', '120']),
});

export type GenerateInfosType = z.infer<typeof generateInfos>;
