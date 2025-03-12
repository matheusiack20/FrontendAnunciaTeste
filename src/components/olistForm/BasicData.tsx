import { OlistFormComponentsProps } from '@/types/FormComponentsProps';
import React from 'react';
import { useStepper } from '../stepper';
import InputField from '../formComponents/InputField';
import SelectField from '../formComponents/SelectField';
import { Button } from '../ui/button';
import TextareaField from '../formComponents/TextareaField';

const unitOptions = [
  { value: 'UN', label: 'Un' },
  { value: 'KG', label: 'Kg' },
  { value: 'PÇ', label: 'Pç' },
  { value: 'GR', label: 'Gr' },
];

const formatOptions = [
  { value: 'S', label: 'Simples' },
  { value: 'V', label: 'Variação' },
  { value: 'M', label: 'Matéria-prima' },
];

const unitsOfMeasurement = [
  { value: 'Meters', label: 'Metros' },
  { value: 'Centimeters', label: 'Centímetros' },
  { value: 'millimeter', label: 'Milímetros' },
];

const packagingOptions = [
  { value: 0, label: 'Não definido' },
  { value: 1, label: 'Envelope' },
  { value: 2, label: 'Pacote / Caixa' },
  { value: 3, label: 'Rolo / Cilindro' },
];

const categoryOptions = [{ value: 'noCategory', label: 'Sem categoria' }];

const BasicData: React.FC<OlistFormComponentsProps> = ({
  register,
  control,
  errors,
  setCurrentStep,
  trigger,
  isVariation,
  isDisabled = false,
}) => {
  const { nextStep, prevStep, isDisabledStep } = useStepper();

  console.log('errors:', errors);

  const handleNextStep = async () => {
    const result = await trigger([ 'sku', 'type']);
    if (!result) {
      return;
    }
    if (!isVariation) {
      if (setCurrentStep) {
        setCurrentStep(1);
        nextStep();
      }
    }
  };

  return (
    <div className="flex flex-col gap-5">
      <h3 className="text-white-700 mt-10 mb-2 text-3xl font-extrabold dark:text-white">
        Dados básicos
      </h3>
      <div className="flex flex-col items-start w-full gap-3 sm:flex-row">
      <TextareaField
            resize={false}
            isDisabled={isDisabled}
            label="Descrição"
            placeholder="Digite uma descrição do seu produto"
            register={register('shortDescription')}
            required
            error={errors.shortDescription?.message}
          />
        <div className="flex flex-col sm:flex-row w-full sm:w-full gap-2">
          <InputField
            label="SKU"
            placeholder="Digite um código único"
            register={register('sku')}
            required
            error={errors.sku?.message}
          />
        </div>
      </div>
      <div className="flex flex-col w-full gap-3 sm:flex-row">
        <div className="flex flex-col w-full sm450:flex-row sm:w-1/2 gap-2">
          <SelectField
            label="Unidade"
            name="unit"
            isDisabled={isDisabled}
            control={control}
            options={unitOptions}
            placeholder="Un, Kg, Pç, Gr"
            error={errors.unit?.message}
          />
          {!isVariation && (
            <SelectField
              label="Formato"
              name="type"
              isDisabled={isDisabled}
              required
              control={control}
              options={formatOptions}
              error={errors.type?.message}
            />
          )}
        </div>
        <div className="flex flex-col w-full sm450:flex-row sm:w-1/2 gap-2">
          <SelectField
            label="Categoria"
            name="category"
            control={control}
            isDisabled={isDisabled}
            options={categoryOptions}
            placeholder="Sem categoria"
            error={errors.category?.message}
          />
          <SelectField
            label="Tipo de embalagem"
            name="dimensions.packaging.type"
            control={control}
            isDisabled={isDisabled}
            options={packagingOptions}
            placeholder="Embalagem"
            error={errors?.dimensions?.packaging?.message}
          />
        </div>
      </div>
      <div className="flex flex-col w-full gap-3 sm:flex-row">
        <InputField
          label="Preço de venda"
          placeholder="99,99"
          isDisabled={isDisabled}
          register={register('precos.preco')}
          error={errors.precos?.message}
        />
        <InputField
          label="Preço Promocional"
          placeholder="99,99"
          isDisabled={isDisabled}
          register={register('precos.precoPromocional')}
          error={errors.precos?.message}
        />
        <InputField
          label="Preço de Custo"
          placeholder="99,99"
          isDisabled={isDisabled}
          register={register('precos.precoCusto')}
          error={errors.precos?.message}
        />
        <InputField
          label="GTIN/EAN"
          isDisabled={isDisabled}
          placeholder="Sem GTIN"
          register={register('gtinEean')}
          error={errors.gtinEean?.message}
        />
        <InputField
          label="GTIN/EAN tributário"
          placeholder="Sem GTIN"
          isDisabled={isDisabled}
          register={register('gtinEeanT')}
          error={errors.gtinEeanT?.message}
        />
        <InputField
          label="Código CEST"
          placeholder="Sem CEST"
          isDisabled={isDisabled}
          register={register('cest')}
          error={errors.cest?.message}
        />
      </div>
      <div className="flex flex-col gap-5">
        <h3 className="text-white-700 mt-10 mb-2 text-3xl font-extrabold dark:text-white">
          Dimensões e peso
        </h3>

        <div className="flex flex-col items-start w-full gap-3 sm:flex-row">
        <InputField
              label="Peso líquido"
              placeholder="Digite o peso em kg"
              isDisabled={isDisabled}
              register={register('netWeight')}
              error={errors.netWeight?.message}
            />
            <InputField
              label="Peso bruto"
              placeholder="Digite o peso em kg"
              isDisabled={isDisabled}
              register={register('grossWeight')}
              error={errors.grossWeight?.message}
            />
            <div className="flex flex-col w-full sm450:flex-row sm:w-1/2 gap-2">
            <InputField
              label="Largura"
              placeholder="Ex: 80cm"
              register={register('width')}
              isDisabled={isDisabled}
              error={errors.width?.message}
            />
            <InputField
              label="Altura"
              isDisabled={isDisabled}
              placeholder="Ex: 65cm"
              register={register('height')}
              error={errors.height?.message}
            />
          </div>
        </div>
        <div className="flex flex-col w-full gap-3 sm:flex-row">
          <div className="flex flex-col w-full sm450:flex-row sm:w-1/2 gap-2">
            <InputField
              label="Comprimento"
              placeholder="Digite o comprimento"
              isDisabled={isDisabled}
              register={register('length')}
              error={errors.depth?.message}
            />
          </div>
          <div className="flex flex-col w-full sm450:flex-row sm:w-1/2 gap-2">
            <InputField
              label="Itens por caixa"
              placeholder="Quantos itens?"
              type="number"
              isDisabled={isDisabled}
              register={register('itemsPerBox')}
              error={errors.itemsPerBox?.message}
            />
            <SelectField
              label="Unidade de medida"
              name="unitsOfMeasurement"
              control={control}
              options={unitsOfMeasurement}
              isDisabled={isDisabled}
              placeholder="Unidade de medida"
              error={errors.unitsOfMeasurement?.message}
            />
          </div>
        </div>
      </div>
      {!isVariation && (
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
          <Button onClick={handleNextStep} size="lg" type="button">
            Avançar
          </Button>
        </div>
      )}
    </div>
  );
};

export default BasicData;
