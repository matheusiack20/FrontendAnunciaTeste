import React from 'react';
import { SubmitHandler, useForm, useFormState } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { OlistFormSchema, OlistFormType } from '@/types/OlistFormTypes';
import { useGenerateData } from '@/context/generateDataContext';
import StepperClickableSteps from './StepperComponent';
import {
  PostOlistProduct,
  UseOlistRefreshToken,
} from '../ApisAuthConnect/OlistAuthConnect/OlistAuthConnect';
import { useOlist } from '@/context/olistContext';
import { useToast } from '@/hooks/use-toast';

const OlistRegisterNewProduct: React.FC = () => {
  const {
    register,
    handleSubmit,
    control,
    getValues,
    setValue,
    trigger,
    watch,
    reset,
  } = useForm<OlistFormType>({
    resolver: zodResolver(OlistFormSchema),
  });
  const { errors } = useFormState({ control });
  const {
    variations,
    selectedProducts,
    setVariations,
    files,
    links,
    setActiveLabel,
    setLinks,
    setFiles,
  } = useOlist();

  const { toast } = useToast();

  console.log('errors:', errors);
  interface OlistProductData {
    sku: string;
    precos?: {};
    tipo: string;
    situacao: string;
    descricao: string;
    dataValidade: Date | undefined;
    unidade: string | undefined;
    unidadePorCaixa: number | undefined;
    gtin: string | undefined;
    codigoEspecificadorSubstituicaoTributaria: string | undefined;
    gtinEmbalagem: string | undefined;
    tipoProducao: string | undefined;
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
      embalagem: {
        id: number | undefined;
        tipo: number | undefined;
      }
      largura: number | undefined;
      altura: number | undefined;
      profundidade: number | undefined;
      comprimento: number | undefined;
      unidadeMedida: string | undefined;
      pesoLiquido: number | undefined;
      pesoBruto: number | undefined;
    };
    tributacao: {
      origem: number | undefined;
      ncm: string | undefined;
      spedTipoItem: string | undefined;
      percentualTributos: number | undefined;
      valorBaseStRetencao: number | undefined;
      valorStRetencao: number | undefined;
      valorICMSSubstituto: number | undefined;
      codigoExcecaoTipi: string | undefined;
      valorPisFixo: number | undefined;
      valorCofinsFixo: number | undefined;
    };
    midia: {
      video: {
        url: string | undefined;
      };
      images: {
        externas: {
          link: string | undefined;
        }[];
      };
    };
    variacoes?: any;
  }

  const onSubmit: SubmitHandler<OlistFormType> = async (data) => {
    console.log('foi chamadooooo');
    console.log('data:', data);

    const productData: OlistProductData = {
      sku: data.sku,
      precos: {
        preco: data.precos?.preco,
        precoPromocional: data.precos?.precoPromocional,
        precoCusto: data.precos?.precoCusto,
      },
      // tipo: 'S',
      situacao: 'A',
      tipo: data.type || 'S',
      descricao: data.shortDescription,
      dataValidade: data.date,
      unidade: data.unit,
      unidadePorCaixa: data.itemsPerBox,
      gtin: data.gtinEean,
      codigoEspecificadorSubstituicaoTributaria: data.cest,
      gtinEmbalagem: data.gtinEeanT,
      tipoProducao: data.production,
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
        embalagem: {
          id: data.dimensions?.packaging?.id,
          tipo: data.dimensions?.packaging?.type,
        },
        largura: data.width,
        altura: data.height,
        profundidade: data.depth,
        comprimento: parseFloat(data.length as any),
        unidadeMedida: data.unitsOfMeasurement,
        pesoLiquido: data.netWeight,
        pesoBruto: data.grossWeight,
      },
      tributacao: {
        origem: data.origin,
        ncm: data.ncm,
        spedTipoItem: data.typeItem,
        percentualTributos: data.tributs,
        valorBaseStRetencao: data.icmsStBase,
        valorStRetencao: data.icmsSt,
        valorICMSSubstituto: data.icmsOwn,
        codigoExcecaoTipi: data.tipi,
        valorPisFixo: data.pis,
        valorCofinsFixo: data.cofins,
      },
      midia: {
        video: {
          url: data.video,
        },
        images: {
          externas: [
            {
              link: data.externalLink,
            },
          ],
        },
      },
      variacoes: data.nameVariations
    };
    console.log(data.precos);

    if (data.type === 'V') {
      const modifiedVariations = variations.map((item: any, index: any) => {
        const {
          format,
          variations,
          usingFatherProducts,
          nameVariations,
          ...rest
        } = item;

        const nameVariationsCreated =
          Object.entries(variations)
            .map(([key, value]) => `${key}:${value}`)
            .join(';') + ';';

        return {
          ...rest,
          situacao: 'A',
          // tipo: 'S',
          variacao: {
            nome: nameVariations || nameVariationsCreated,
            ordem: index + 1,
            produtoPai: {
              cloneInfo: usingFatherProducts,
            },
          },
        };
      });

      productData.variacoes = modifiedVariations;
    }

    if (data.type === 'V' && variations && variations.length === 0) {
      productData.tipo = 'S';
    }

    try {
      await UseOlistRefreshToken();
      const result = await PostOlistProduct(productData);
      if (result?.status === 'success') {
        setLinks([]);
        setFiles([]);
        setVariations([]);
        reset();
        setActiveLabel('Dados básicos');
        toast({
          variant: 'default',
          title: `Seu produto - ${productData.sku} foi cadastrado com sucesso`,
          description: 'Para acessar seu produto, você deve entrar na Olist.',
        });
        setTimeout(() => {
          window.location.reload();
        }, 3000);
      } else {
        console.error(result?.message);

        toast({
          variant: 'destructive',
          title: `Seu produto - ${productData?.sku} não foi cadastrado`,
          description: result?.message,
        });        
      }
    } catch (error) {
      console.error('Erro ao cadastrar produto:', error);
    }
  };

  const { selectedTitleValue, selectedDescriptionValue } = useGenerateData();


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
          watch={watch}
          setValue={setValue}
          errors={errors}
          register={register}
          control={control}
          trigger={trigger}
          getValues={getValues}
        />
      </form>
    </div>
  );
};

export default OlistRegisterNewProduct;
