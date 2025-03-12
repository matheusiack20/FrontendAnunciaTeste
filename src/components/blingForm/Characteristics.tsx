import React from 'react';
import InputField from '../formComponents/InputField';
import SelectField from '../formComponents/SelectField';
import InputDate from '../formComponents/InputDate';
import TextareaField from '../formComponents/TextareaField';
import { Button } from '../ui/button';
import { useStepper } from '../stepper';
import { BlingFormComponentsProps } from '@/types/FormComponentsProps';

const productionOptions = [
  { value: 'P', label: 'Própria' },
  { value: 'T', label: 'Por terceiros' },
];

const unitsOfMeasurement = [
  { value: '0', label: 'Metros' },
  { value: '1', label: 'Centímetros' },
  { value: '2', label: 'Milímetros' },
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

const Characteristics: React.FC<BlingFormComponentsProps> = ({
  register,
  control,
  errors,
  trigger,
  setCurrentStep,
  isVariation,
  isDisabled = false,
}) => {
  const { nextStep, prevStep, isDisabledStep } = useStepper();

  const handleNextStepClick = async () => {

    const result = await trigger(['name', 'format']);
    if (!result) {
      return;
    }
    if (!isVariation) {
      nextStep();
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
            <InputField
              label="Marca do produto"
              isDisabled={isDisabled}
              placeholder="Digite a marca do seu produto"
              register={register('brand')}
              error={errors.brand?.message}
            />
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
          <div className="flex flex-col w-full sm450:flex-row sm:w-1/2 gap-2 items-start">
            <InputDate
              isDisabled={isDisabled}
              control={control}
              label="Data de validade"
              name="date"
              error={errors.date?.message}
            />
            <SelectField
              label="Frete grátis"
              name="freeShipping"
              control={control}
              isDisabled={isDisabled}
              options={freeShipping}
              placeholder="Seu frete é grátis?"
              error={errors.freeShipping?.message}
            />
          </div>
        </div>
        <div className="flex flex-col w-full gap-3 sm:flex-row">
          <div className="flex flex-col w-full sm450:flex-row sm:w-1/2 gap-2">
            <InputField
              type="text"
              rgx="number"
              label="Peso líquido"
              placeholder="Digite o peso em kg"
              isDisabled={isDisabled}
              register={register('netWeight')}
              error={errors.netWeight?.message}
            />
            <InputField
              label="Peso bruto"
              type="text"
              rgx="number"
              placeholder="Digite o peso em kg"
              isDisabled={isDisabled}
              register={register('grossWeight')}
              error={errors.grossWeight?.message}
            />
          </div>
          <div className="flex flex-col w-full sm450:flex-row sm:w-1/2 gap-2">
            <InputField
              label="Largura"
              type="text"
              rgx="number"
              placeholder="Ex: 80cm"
              register={register('width')}
              isDisabled={isDisabled}
              error={errors.width?.message}
            />
            <InputField
              label="Altura"
              type="text"
              rgx="number"
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
              type="text"
              rgx="number"
              placeholder="Digite a profundidade"
              isDisabled={isDisabled}
              register={register('depth')}
              error={errors.depth?.message}
            />
            <InputField
              label="Volumes"
              type="text"
              rgx="number"
              register={register('volumes')}
              error={errors.volumes?.message}
              isDisabled={isDisabled}
            />
          </div>
          <div className="flex flex-col w-full sm450:flex-row sm:w-1/2 gap-2">
            <InputField
              label="Itens por caixa"
              placeholder="Quantos itens?"
              type="text"
              rgx="number"
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
            label="Descrição curta"
            placeholder="Digite uma descrição curta do seu produto"
            register={register('shortDescription')}
            error={errors.shortDescription?.message}
          />
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
          <Button onClick={handleNextStepClick} size="lg" type="button">
            Avançar
          </Button>
        </div>
      )}
    </>
  );
};

export default Characteristics;
