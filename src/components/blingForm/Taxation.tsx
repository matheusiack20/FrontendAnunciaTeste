import { BlingFormComponentsProps } from '@/types/FormComponentsProps';
import React from 'react';
import InputField from '../formComponents/InputField';
import SelectField from '../formComponents/SelectField';
import TextareaField from '../formComponents/TextareaField';
import AlertMessage from '../utils/AlertMessage';
import { Button } from '../ui/button';
import { useStepper } from '../stepper';
import { Search } from 'lucide-react';
import { cadastrouAnuncio } from '../../../trackingMeta';

const Taxation: React.FC<BlingFormComponentsProps> = ({
  register,
  control,
  errors,
  watch,
  setCurrentStep,
  trigger,
  isVariation,
  isDisabled = false,
}) => {
  const originOptions = [
    {
      value: 0,
      label: '0 - Nacional, exceto as indicadas nos códigos 3, 4, 5 e 8',
    },
    {
      value: 1,
      label:
        '1 - Estrangeira - Importação direta, exceto a indicada no código 6',
    },
    {
      value: 2,
      label:
        '2 - Estrangeira - Adquirida no mercado interno, exceto a indicada no código 7',
    },
    {
      value: 3,
      label:
        '3 - Nacional, mercadoria ou bem com Conteúdo de Importação superior a 40% e inferior ou igual a 70%',
    },
    {
      value: 4,
      label:
        '4 - Nacional, cuja produção tenha sido feita em conformidade com os processos produtivos básicos de que tratam as legislações citadas nos Ajustes',
    },
    {
      value: 5,
      label:
        '5 - Nacional, mercadoria ou bem com Conteúdo de Importação inferior ou igual a 40%',
    },
    {
      value: 6,
      label:
        '6 - Estrangeira - Importação direta, sem similar nacional, constante em lista da CAMEX',
    },
    {
      value: 7,
      label:
        '7 - Estrangeira - Adquirida no mercado interno, sem similar nacional, constante em lista da CAMEX',
    },
    {
      value: 8,
      label:
        '8 - Nacional, mercadoria ou bem com Conteúdo de Importação superior a 70%',
    },
  ];

  const { nextStep, prevStep, isDisabledStep, isLastStep } = useStepper();

  console.log('isLastStep :', isLastStep);

  const handleNextStepClick = async () => {

    const result = await trigger(['name', 'format']);
    if (!result) {
      return;
    }
    if (!isVariation) {
      nextStep();
    }
  };


  const formatValue = watch('format');

  const typeItensOptions = [
    { value: '0', label: 'Mercadoria para Revenda' },
    { value: '1', label: 'Matéria-Prima' },
    { value: '2', label: 'Embalagem' },
    { value: '3', label: 'Produto em Processo' },
    { value: '4', label: 'Produto Acabado' },
    { value: '5', label: 'Subproduto' },
    { value: '6', label: 'Produto Intermediário' },
    { value: '7', label: 'Material de Uso e Consumo' },
    { value: '8', label: 'Ativo Imobilizado' },
    { value: '9', label: 'Serviços' },
    { value: '10', label: 'Outros insumos' },
    { value: '11', label: 'Outras' },
  ];

  return (
    <div className="flex flex-col gap-5">
      <h3 className="text-white-700 mt-10 mb-2 text-3xl font-extrabold dark:text-white">
        Tributação
      </h3>
      <AlertMessage>
        Dados da nota fiscal. Preencha somente se for emitir nota fiscal.
      </AlertMessage>
      <div className="flex flex-col items-end w-full gap-3 sm:flex-row">
        <div className="flex flex-col sm:flex-row w-full sm:w-full gap-2">
          <SelectField
            isDisabled={isDisabled}
            label="Origem"
            name="origin"
            control={control}
            options={originOptions}
            placeholder="Origem do produto conforme ICMS"
            error={errors.origin?.message}
          />
        </div>
        <div className="flex flex-col sm:flex-row w-full sm:w-full gap-2">
          <InputField
            isDisabled={isDisabled}
            label="NCM"
            type="text"
            placeholder="Digite o NCM "
            register={register('ncm')}
            error={errors.ncm?.message}
          />
          <InputField
            isDisabled={isDisabled}
            label="CEST"
            rgx="number"
            type="text"
            placeholder="Digite o CEST"
            register={register('cest')}
            error={errors.price?.message}
          />
        </div>
      </div>
      <div className="flex flex-col items-end w-full gap-3 sm:flex-row">
        <div className="flex flex-col sm:flex-row w-full sm:w-full gap-2">
          <SelectField
            isDisabled={isDisabled}
            label="Tipo do item"
            name="typeItem"
            control={control}
            options={typeItensOptions}
            placeholder="Selecione"
            error={errors.typeItem?.message}
          />
        </div>
        <div className="flex flex-col sm:flex-row w-full sm:w-full gap-2">
          <InputField
            isDisabled={isDisabled}
            label="% Tributos"
            rgx="number"
            type="text"
            placeholder="Alíquota de valor aproximado dos produtos"
            register={register('tributs')}
            error={errors.tributs?.message}
          />
        </div>
      </div>
      <p className="text-xl font-medium">ICMS</p>
      <div className="flex flex-col sm:flex-row w-full sm:w-full gap-2">
        <InputField
          isDisabled={isDisabled}
          rgx="number"
          type="text"
          label=" Valor base ICMS ST - retenção "
          placeholder=" Valor base ICMS ST - retenção "
          register={register('icmsStBase')}
          error={errors.icmsStBase?.message}
        />
        <InputField
          type="text"
          isDisabled={isDisabled}
          rgx="number"
          label="Valor ICMS ST para retenção "
          placeholder=" Valor ICMS ST para retenção "
          register={register('icmsSt')}
          error={errors.icmsSt?.message}
        />
        <InputField
          isDisabled={isDisabled}
          type="text"
          label=" Valor ICMS próprio do substituto "
          rgx="number"
          placeholder=" Valor ICMS próprio do substituto"
          register={register('icmsOwn')}
          error={errors.icmsOwn?.message}
        />
      </div>
      <p className="text-xl font-medium">IPI</p>
      <div className="flex flex-col sm:flex-row w-full gap-2">
        <InputField
          isDisabled={isDisabled}
          label="Código exceção da TIPI"
          placeholder="Código exceção da TIPI"
          register={register('tipi')}
          error={errors.tipi?.message}
        />
      </div>
      <p className="text-xl font-medium">PIS / COFINS</p>
      <div className="flex flex-col sm:flex-row w-full gap-2">
        <InputField
          type="text"
          label="Valor PIS fixo"
          rgx="number"
          isDisabled={isDisabled}
          placeholder="Valor PIS fixo"
          register={register('pis')}
          error={errors.icmsStBase?.message}
        />
        <InputField
          type="text"
          isDisabled={isDisabled}
          label=" Valor COFINS fixo "
          placeholder=" Valor COFINS fixo"
          rgx="number"
          register={register('icmsStBase')}
          error={errors.icmsStBase?.message}
        />
      </div>
      <p className="text-xl font-medium">Dados adicionais</p>
      <div className="flex flex-col sm:flex-row w-full gap-2">
        <TextareaField
          isDisabled={isDisabled}
          resize={false}
          label="Informações Adicionais"
          placeholder="Informações Adicionais"
          register={register('additionalData')}
          error={errors.additionalData?.message}
        />
      </div>

      {isLastStep && (
        <div className="flex gap-5 justify-end">
          <Button
            disabled={isDisabledStep}
            onClick={prevStep}
            size="lg"
            variant="secondary"
            type="button"
          >
            Voltar
          </Button>
          <Button onClick={cadastrouAnuncio} className="w-1/2" type="submit" variant="default">
            <Search className="w-5 h-5 mr-2" />
            Cadastrar produto
          </Button>
        </div>
      )}
      {!isVariation && !isLastStep && (
        <div className="flex gap-5 justify-end">
          <Button
            disabled={isDisabledStep}
            onClick={prevStep}
            size="lg"
            variant="secondary"
            type="button"
          >
            Voltar
          </Button>
          <Button onClick={handleNextStepClick} size="lg" type="button">
            Avançar
          </Button>
        </div>
      )}
    </div>
  );
};

export default Taxation;
