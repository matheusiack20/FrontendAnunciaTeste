import React from 'react';
import InputField from '../formComponents/InputField';
import SelectField from '../formComponents/SelectField';
import InputDate from '../formComponents/InputDate';
import TextareaField from '../formComponents/TextareaField';
import { OlistFormComponentsProps } from '@/types/FormComponentsProps';
import { Button } from '../ui/button';
import { useStepper } from '../stepper';

const productionOptions = [
  { value: 'simple', label: 'Simples' },
  { value: 'thirdParties', label: 'Por terceiros' },
];

const unitsOfMeasurement = [
  { value: 'Meters', label: 'Metros' },
  { value: 'Centimeters', label: 'Centímetros' },
  { value: 'millimeter', label: 'Milímetros' },
];

const freeShipping = [
  { value: 'true', label: 'Sim' },
  { value: 'false', label: 'Não' },
];

const departmentOptions = [
  { value: 'notInformed', label: 'Não informado' },
  { value: 'unisexBabies', label: 'Bebês Unissex' },
  { value: 'babyBoys', label: 'Bebês Meninos' },
  { value: 'babyGirls', label: 'Bebês Meninas' },
  { value: 'unisexKids', label: 'Infantil Unissex' },
  { value: 'boys', label: 'Meninos' },
  { value: 'girls', label: 'Meninas' },
  { value: 'unisexAdults', label: 'Adulto Unissex' },
  { value: 'male', label: 'Masculino' },
  { value: 'female', label: 'Feminino' },
];

const Characteristics: React.FC<OlistFormComponentsProps> = ({
  register,
  control,
  errors,
  trigger,
  setCurrentStep,
  isVariation,
  isDisabled = false,
}) => {
  const { nextStep, prevStep, isDisabledStep } = useStepper();

  const handleNextStep = async () => {
    const result = await trigger(['shortDescription']);
    if (!result) {
      return;
    }
    if (!isVariation) {
      if (setCurrentStep) {
        setCurrentStep(2);
        nextStep();
      }
    }
  };

  return (
    <>
      <h3 className="text-white-700 mt-10 mb-2 text-3xl font-extrabold dark:text-white">
        Características
      </h3>
      <div className="flex flex-col gap-5">
        <div className="flex flex-col w-full gap-3 sm:flex-row items-start">
          <div className="flex flex-col w-full sm450:flex-row sm:w-1/2 gap-2">
            <SelectField
              label="Produção"
              name="production"
              control={control}
              isDisabled={isDisabled}
              options={productionOptions}
              placeholder="Própria"
              error={errors.production?.message}
            />
          </div>
        </div>
        <div className="flex flex-col w-full gap-3 sm:flex-row">
          <div className="flex flex-col w-full sm450:flex-row sm:w-1/2 gap-2">
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
          </div>
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
              label="Profundidade"
              placeholder="Digite a profundidade"
              isDisabled={isDisabled}
              register={register('depth')}
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
        <div className="flex flex-col w-full gap-3 sm:flex-row">
          <div className="sm:flex w-full sm:w-full gap-2">
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
          </div>
          <SelectField
            label="Departamento"
            isDisabled={isDisabled}
            name="department"
            control={control}
            options={departmentOptions}
            placeholder="Não informado"
            error={errors.department?.message}
          />
        </div>
        <div className="flex flex-col w-full gap-3 sm:flex-row">
          <TextareaField
            resize={false}
            isDisabled={isDisabled}
            label="Descrição complementar"
            placeholder="Digite uma descrição complementar"
            register={register('detailedDescription')}
            error={errors.detailedDescription?.message}
          />
        </div>
        <div className="flex flex-col w-full gap-3">
          <InputField
            isDisabled={isDisabled}
            label="Link externo"
            placeholder="Link do produto na loja virtual, marketplace ou catálogo"
            register={register('externalLink')}
            error={errors.externalLink?.message}
          />
          <InputField
            label="Video"
            isDisabled={isDisabled}
            placeholder="Vídeo do produto, utilizado na exportação do produto para lojas virtuais"
            register={register('video')}
            error={errors.video?.message}
          />
          <TextareaField
            resize={false}
            isDisabled={isDisabled}
            label="Observações"
            placeholder="Observações gerais sobre os produtos"
            register={register('comments')}
            error={errors.comments?.message}
          />
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
    </>
  );
};

export default Characteristics;
