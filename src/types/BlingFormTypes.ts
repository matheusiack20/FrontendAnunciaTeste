import { z } from 'zod';
export const fileSchema = z.object({
  name: z.string({
    required_error:
      'Please upload a valid file type. (MP3/MP4, JPG, JPEG, PNG)',
  }),
  lastModified: z.number(),
  size: z.number(),
  type: z.string(),
});

export const BlingFormSchema = z.object({
  name: z
    .string()
    .min(2, { message: 'O nome deve ter pelo menos 2 caracteres.' })
    .max(120, { message: 'O nome deve ter no máximo 100 caracteres.' }),
  code: z.string().optional().default(''),
  price: z
    .string()
    .default('0.00')
    .refine((val) => !val || /^\d+([.,]\d{1,2})?$/.test(val), {
      message: 'O preço deve ser um número válido com até duas casas decimais.',
    })
    .transform((val) => (val ? val.replace(',', '.') : val)),
  unit: z.string().optional(),
  format: z
    .string({
      required_error: 'Esse campo é obrigatório',
    })
    .optional(),
  category: z.string().optional(),
  brand: z.string().optional(),
  production: z.string().optional(),
  unitsOfMeasurement: z.string().optional(),
  stockType: z.string().optional(),
  postStock: z.string().optional(),
  gtinEean: z.string().optional(),
  gtinEeanT: z.string().optional(),
  department: z.string().optional(),
  shortDescription: z.string().optional(),
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
  netWeight: z.string().pipe(z.coerce.number()).optional(),
  grossWeight: z.string().pipe(z.coerce.number()).optional(),
  width: z.string().pipe(z.coerce.number()).optional(),
  height: z.string().pipe(z.coerce.number()).optional(),
  depth: z.string().pipe(z.coerce.number()).optional(),
  volumes: z.string().pipe(z.coerce.number()).optional(),
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
  cofins: z.string().optional(),
  date: z.date().optional(),
  freeShipping: z.string().pipe(z.coerce.boolean()).optional(),
  usingFatherProducts: z.boolean().default(false),
  imagesVariation: z.array(fileSchema).optional(),
  urlsImages: z.array(z.object({ url: z.string() })).optional(),
});

export type BlingFormType = z.infer<typeof BlingFormSchema>;

export interface ProductData {
  nome: string;
  codigo: string;
  preco: number;
  tipo: string;
  situacao: string;
  formato: string;
  categoria: {
    id: number | undefined
  };
  descricaoCurta: string;
  dataValidade: Date | undefined;
  unidade: string | undefined;
  pesoLiquido: number | undefined;
  pesoBruto: number | undefined;
  volumes: number | undefined;
  itensPorCaixa: number | undefined;
  gtin: string | undefined;
  gtinEmbalagem: string | undefined;
  tipoProducao: string | undefined;
  condicao: number | undefined;
  freteGratis: boolean | undefined;
  marca: string | undefined;
  descricaoComplementar: string | undefined;
  linkExterno: string | undefined;
  observacoes: string | undefined;
  descricaoEmbalagemDiscreta: string | undefined;
  estoque: {
    minimo: number | undefined;
    maximo: number | undefined;
    crossdocking: number | undefined;
    localizacao: string | undefined;
  };
  dimensoes: {
    largura: number | undefined;
    altura: number | undefined;
    profundidade: number | undefined;
    unidadeMedida: number | undefined;
  };
  tributacao: {
    origem: number | undefined;
    ncm: string | undefined;
    cest: string | undefined;
    spedTipoItem: string | undefined;
    percentualTributos: number | undefined;
    valorBaseStRetencao: number | undefined;
    valorStRetencao: number | undefined;
    valorICMSSubstituto: number | undefined;
    codigoExcecaoTipi: string | undefined;
    valorPisFixo: number | undefined;
    valorCofinsFixo: string | undefined;
  };
  midia?: {
    video?: {
      url: string | undefined;
    };
    imagens?: {
      externas: {
        link: string | undefined;
      }[];
    };
  };
  variacoes?: any;
  estrutura?: any;
}
