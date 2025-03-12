import { z } from 'zod';

export const OlistFormSchema = z.object({
  sku: z
    .string({
      required_error: 'Esse campo é obrigatório',
    })
    .min(1, { message: 'Esse campo é obrigatório' })
    .default(''),
  precos: z
    .object({
      preco: z
        .string()
        .transform((val) => val.replace(',', '.'))
        .pipe(z.coerce.number())
        .optional(),
      precoPromocional: z
        .string()
        .default('0.00')
        .transform((val) => val.replace(',', '.'))
        .pipe(z.coerce.number()),
      precoCusto: z
        .string()
        .default('0.00')
        .transform((val) => val.replace(',', '.'))
        .pipe(z.coerce.number()),
    })
    .optional()
    .nullable(),
  unit: z.string().optional(),
  type: z.string().optional(),
  category: z.string().optional(),
  production: z.string().optional(),
  unitsOfMeasurement: z.string().optional(),
  gtinEean: z.string().optional(),
  gtinEeanT: z.string().optional(),
  department: z.string().optional(),
  shortDescription: z
    .string({
      required_error: 'Esse campo é obrigatório.',
    })
    .min(1, { message: 'Esse campo é obrigatório.' }),
  detailedDescription: z.string().optional(),
  externalLink: z.string().optional(),
  video: z.string().optional(),
  comments: z.string().optional(),
  location: z.string().optional(),
  balanceObservations: z.string().optional(),
  ncm: z.string().optional(),
  cest: z.string().optional(),
  typeItem: z.string().optional(),
  tipi: z.string().optional(),
  additionalData: z.string().optional(),
  nameVariations: z.string().optional(),

  // Propriedades do tipo number
  netWeight: z.string().pipe(z.coerce.number()).optional(),
  grossWeight: z.string().pipe(z.coerce.number()).optional(),
  width: z.string().pipe(z.coerce.number()).optional(),
  length: z
    .string()
    .transform((val) => (val.trim() === '' ? '0' : val))
    .transform((val) => parseFloat(val))
    .pipe(z.coerce.number())
    .optional(),
  height: z.string().pipe(z.coerce.number()).optional(),
  depth: z.string().pipe(z.coerce.number()).optional(),
  itemsPerBox: z.string().pipe(z.coerce.number()).optional(),
  minimum: z.string().pipe(z.coerce.number()).optional(),
  maximum: z.string().pipe(z.coerce.number()).optional(),
  crossdocking: z.string().pipe(z.coerce.number()).optional(),
  origin: z.string().pipe(z.coerce.number()).optional(),
  condition: z.string().optional(),
  tributs: z.string().pipe(z.coerce.number()).optional(),
  icmsStBase: z.string().pipe(z.coerce.number()).optional(),
  icmsSt: z.string().pipe(z.coerce.number()).optional(),
  icmsOwn: z.string().pipe(z.coerce.number()).optional(),
  pis: z.string().pipe(z.coerce.number()).optional(),
  cofins: z.string().pipe(z.coerce.number()).optional(),

  date: z.date().optional(),
  usingFatherProducts: z.boolean().default(false),

  dimensions: z
    .object({
      packaging: z.object({
        id: z.number().optional(),
        type: z.enum(['0', '1', '2', '3']).transform(Number).optional(),
      }).optional(),
    }).optional(),
});

export type OlistFormType = z.infer<typeof OlistFormSchema>;
