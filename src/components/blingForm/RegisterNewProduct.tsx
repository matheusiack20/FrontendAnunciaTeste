import React from 'react';
import { SubmitHandler, useForm, useFormState } from 'react-hook-form';
import { Button } from '../ui/button';
import { Search } from 'lucide-react';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  BlingFormType,
  BlingFormSchema,
  ProductData,
} from '@/types/BlingFormTypes';
import { useGenerateData } from '@/context/generateDataContext';
import {
  UseRefreshToken,
  CreateUrlImages,
  PostBlingProduct,
} from '../ApisAuthConnect/blingAuthConnect/BlingAuthConnect';
import {
  PostOlistProduct,
  UseOlistRefreshToken,
} from '../ApisAuthConnect/OlistAuthConnect/OlistAuthConnect';
import { useBling } from '@/context/blingContext';
import { useToast } from '@/hooks/use-toast';
import StepperClickableSteps from './StepperComponent';
import {cadastrouAnuncio} from '../../../trackingMeta' 

const RegisterNewProduct: React.FC = () => {
  const {
    register,
    handleSubmit,
    control,
    getValues,
    setValue,
    trigger,
    watch,
    reset,
  } = useForm<BlingFormType>({
    resolver: zodResolver(BlingFormSchema),
  });
  const { errors } = useFormState({ control });
  console.log('errors:', errors);
  const {
    variations,
    selectedProducts,
    setVariations,
    files,
    links,
    setActiveLabel,
    hasPreviousStep,
    handlePreviousStep,
    isLastStep,
    setLinks,
    setFiles,
  } = useBling();

  const { toast } = useToast();

  const onSubmit: SubmitHandler<BlingFormType> = async (data) => {
    console.log("files", files);
    console.log("files_length", files.length);

    const productData: ProductData = {
      nome: data.name,
      codigo: data.code,
      preco: Number(data.price),
      categoria: {
        id: Number(data.category !== 'noCategory' ? data.category : undefined),
      },
      tipo: 'P',
      situacao: 'A',
      formato: data.format || 'S',
      descricaoCurta: data.shortDescription || '',
      dataValidade: data.date,
      unidade: data.unit,
      pesoLiquido: data.netWeight,
      pesoBruto: data.grossWeight,
      volumes: data.volumes,
      itensPorCaixa: data.itemsPerBox,
      gtin: data.gtinEean,
      gtinEmbalagem: data.gtinEeanT,
      tipoProducao: data.production,
      condicao: Number(data.condition),
      freteGratis: data.freeShipping,
      marca: data.brand,
      descricaoComplementar: data.additionalData,
      linkExterno: data.externalLink,
      observacoes: data.comments,
      descricaoEmbalagemDiscreta: data.shortDescription,
      estoque: {
        minimo: data.minimum,
        maximo: data.maximum,
        crossdocking: data.crossdocking,
        localizacao: data.location,
      },
      dimensoes: {
        largura: data.width,
        altura: data.height,
        profundidade: data.depth,
        unidadeMedida: Number(data.unitsOfMeasurement),
      },
      tributacao: {
        origem: data.origin,
        ncm: data.ncm,
        cest: data.cest,
        spedTipoItem: data.typeItem,
        percentualTributos: data.tributs,
        valorBaseStRetencao: data.icmsStBase,
        valorStRetencao: data.icmsSt,
        valorICMSSubstituto: data.icmsOwn,
        codigoExcecaoTipi: data.tipi,
        valorPisFixo: data.pis,
        valorCofinsFixo: data.cofins,
      },
    };
    console.log(productData);
    if (data.format === 'V') {
      const modifiedVariations = await Promise.all(
        variations.map(async (item, index) => {
          const {
            format,
            variations: itemVariations,
            usingFatherProducts,
            nameVariations,
            imagesVariation,
            urlsImages,
            ...rest
          } = item;

          let mappedFilesImages: { link: string }[] = [];

          const nameVariationsCreated =
            Object.entries(itemVariations)
              .map(([key, value]) => `${key}:${value}`)
              .join(';') + ';';

          if (
            (imagesVariation && imagesVariation.length > 0) ||
            (urlsImages && urlsImages.length > 0)
          ) {
            if (files && files.length > 0) {
              const urls = await CreateUrlImages(files);

              console.log('url_first_mapped:', urls);

              if (urls) {
                const mappedLinks = urls.map((url) => ({ link: url }));
                console.log('mappedLinks:', mappedLinks);
                if (mappedLinks) {
                  mappedFilesImages = mappedLinks;
                }
              }
            }

            if (urlsImages && urlsImages.length > 0) {
              const mappedLinks = urlsImages.map((link) => ({
                link: link.url,
              }));
              mappedFilesImages = [...mappedFilesImages, ...mappedLinks];
            }
            return {
              ...rest,
              tipo: 'P',
              situacao: 'A',
              formato: 'S',
              variacao: {
                midia: {
                  imagens: {
                    externas: mappedFilesImages,
                  },
                },
                nome: nameVariations || nameVariationsCreated,
                ordem: index + 1,
                produtoPai: {
                  cloneInfo: usingFatherProducts,
                },
              },
            };
          }
          return {
            ...rest,
            variacao: {
              nome: nameVariations || nameVariationsCreated,
              ordem: index + 1,
              produtoPai: {
                cloneInfo: usingFatherProducts,
              },
            },
          };
        }),
      );
      console.log('modifiedVariations:', modifiedVariations);
      productData.variacoes = modifiedVariations;
    }

    if (data.format === 'V' && (!variations || variations.length === 0)) {
      productData.formato = 'S';
    }

    console.log('productData:', productData);

    if (data.format === 'E') {
      productData.estrutura = {
        tipoEstoque: data.stockType || 'F',
        lancamentoEstoque: data.postStock || 'A',
        componentes: selectedProducts.map((product: any) => {
          return {
            produto: {
              id: product.id,
            },
            quantidade: product.quantity || 1,
          };
        }),
      };
    }

    console.log(files.length);

    if (files && files.length > 0) {
      const urls = await CreateUrlImages(files);
      console.log('urls:', urls);
      if (urls) {
        const mappedFileImages = urls.map((url) => ({ link: url }));
        productData.midia = {
          imagens: {
            externas: mappedFileImages,
          },
        };
      }
    }

    if (links && links.length > 0) {
      const mappedLinkImages = links.map((link) => ({
        link: link.url,
      }));

      if (
        productData.midia &&
        productData.midia.imagens &&
        productData.midia.imagens.externas
      ) {
        productData.midia.imagens.externas =
          productData.midia.imagens.externas.concat(mappedLinkImages);
      } else {
        productData.midia = {
          imagens: {
            externas: mappedLinkImages,
          },
        };
      }
    }

    if (
      data.format === 'E' &&
      (!selectedProducts || selectedProducts.length === 0)
    ) {
      productData.formato = 'S';
    }


    const selectedErp = localStorage.getItem('selectedErp');
    try {
      if (selectedErp === 'bling') {
        await UseRefreshToken();
        const result = await PostBlingProduct(productData);
        if (result.status === 'success') {
          setLinks([]);
          setFiles([]);
          setVariations([]);
          reset();
          setActiveLabel('Dados básicos');
          toast({
            variant: 'default',
            title: `Seu produto - ${productData.nome} foi cadastrado com sucesso`,
            description: 'Para acessar seu produto, você deve entrar no Bling.',
          });
        } else {
          console.error(result.message);

          toast({
            variant: 'destructive',
            title: `Seu produto - ${productData.nome} não foi cadastrado`,
            description: result.message,
          });
        }
      } else if (selectedErp === 'olist') {
        await UseOlistRefreshToken();
        PostOlistProduct(productData);
      }
    } catch (error) {
      console.error('Erro ao cadastrar produto:', error);
    }
  };

  const { selectedTitleValue, selectedDescriptionValue } = useGenerateData();

  React.useEffect(() => {
    if (selectedTitleValue) {
      setValue('name', selectedTitleValue);
    }
  }, [selectedTitleValue, setValue]);

  React.useEffect(() => {
    if (selectedDescriptionValue) {
      setValue('shortDescription', selectedDescriptionValue);
    }
  }, [selectedDescriptionValue, setValue]);

  return (
    <div className="mt-16">
      <h2 className="text-white-800 text-4xl sm450:text-5xl font-extrabold dark:text-white md:text-6xl">
        Cadastrar novo produto
      </h2>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col items-start"
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
          }
        }}
      >
        <StepperClickableSteps
          setValue={setValue}
          watch={watch}
          errors={errors}
          register={register}
          control={control}
          trigger={trigger}
          getValues={getValues}
        />
        {isLastStep ? (
          <div className="w-full flex gap-5 justify-end">
            <Button
              onClick={handlePreviousStep}
              disabled={!hasPreviousStep}
              size="lg"
              variant="secondary"
              type="button"
            >
              Voltar
            </Button>
            <Button onClick={cadastrouAnuncio} className="w-1/2 h-auto" type="submit" variant="default">
              <Search className="w-5 h-5 mr-2" />
              Cadastrar produto
            </Button>
          </div>
        ) : null}
      </form>
    </div>
  );
};

export default RegisterNewProduct;
