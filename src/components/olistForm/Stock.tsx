import React from 'react';
import InputField from '../formComponents/InputField';
import SelectField from '../formComponents/SelectField';
import TextareaField from '../formComponents/TextareaField';
import { Button } from '../ui/button';
import { useStepper } from '../stepper';
import { OlistFormComponentsProps } from '@/types/FormComponentsProps';

const Stock: React.FC<OlistFormComponentsProps> = ({
  register,
  control,
  errors,
  trigger,
  isVariation,
  setCurrentStep,
  isDisabled = false,
}) => {
  const depositOptions = [
    { value: 'AmazonFBAOnsite', label: 'Amazon FBA Onsite' },
    { value: 'Headquarters', label: 'Matriz' },
  ];

  const { nextStep, prevStep, isDisabledStep } = useStepper();

  const handleNextStep = async () => {
    const result = await trigger('shortDescription');
    if (!result) {
      return;
    }
    if (!isVariation) {
      if (setCurrentStep) {
        nextStep();
        setCurrentStep(4);
      }
    }
  };

  return (
    <div className="flex flex-col gap-5">
      <h3 className="text-white-700 mt-10 mb-2 text-3xl font-extrabold dark:text-white">
        Estoque
      </h3>
      <div className="flex flex-col items-end w-full gap-3 sm:flex-row">
        <div className="flex flex-col sm:flex-row w-full sm:w-full gap-2">
          <InputField
            label="Mínimo"
            type="number"
            isDisabled={isDisabled}
            placeholder="Digite o valor mínimo"
            register={register('minimum')}
            error={errors.minimum?.message}
          />
          <InputField
            label="Máximo"
            isDisabled={isDisabled}
            type="number"
            placeholder="Digite o valor máximo"
            register={register('maximum')}
            error={errors.maximum?.message}
          />
        </div>
        <div className="flex flex-col sm:flex-row w-full sm:w-full gap-2">
          <InputField
            isDisabled={isDisabled}
            label="Crossdocking"
            type="number"
            placeholder="Digite o Crossdocking "
            register={register('crossdocking')}
            error={errors.crossdocking?.message}
          />
          <InputField
            isDisabled={isDisabled}
            label="Localização "
            placeholder="Localização do produto no estoque"
            register={register('location')}
            error={errors.location?.message}
          />
        </div>
      </div>
      <TextareaField
        resize={false}
        isDisabled={isDisabled}
        label=" Observações do saldo inicial"
        placeholder="Observações do saldo inicial"
        register={register('cofins')}
        error={errors.cofins?.message}
      />
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

export default Stock;
