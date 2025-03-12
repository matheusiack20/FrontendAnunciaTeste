'use client';
import React from 'react';

import { Step, type StepItem, Stepper } from '@/components/stepper';
import BasicData from './BasicData';
import Characteristics from './Characteristics';
import Images from './Images';
import Stock from './Stock';
import Taxation from './Taxation';
import Variations from './variations/Variations';
import Structure from './Structure';
import { useBling } from '@/context/blingContext';
import { BlingStepperComponentProps } from '@/types/StepperComponentProps';

type StepsBling = {
  label: string;
  component: React.FC<any>;
};

const initialSteps: StepsBling[] = [
  { label: 'Dados básicos', component: BasicData },
  { label: 'Características', component: Characteristics },
  { label: 'Imagens', component: Images },
  { label: 'Estoque', component: Stock },
  { label: 'Tributação', component: Taxation },
];

const StepperClickableSteps: React.FC<BlingStepperComponentProps> = ({
  register,
  control,
  errors,
  trigger,
  setValue,
  getValues,
  watch,
}) => {
  const { setSteps } = useBling();
  const [currentStep, setCurrentStep] = React.useState<number>(0);
  const [steps, setLocalSteps] = React.useState<StepsBling[]>(initialSteps);

  const formatValue = watch('format');

  // Atualiza os passos localmente com base no formato selecionado
  React.useEffect(() => {
    let updatedSteps = [...initialSteps];

    if (formatValue === 'V') {
      if (!updatedSteps.find((step) => step.label === 'Variações')) {
        updatedSteps.push({ label: 'Variações', component: Variations });
      }
    }

    if (formatValue === 'E') {
      if (!updatedSteps.find((step) => step.label === 'Estrutura')) {
        updatedSteps.push({ label: 'Estrutura', component: Structure });
      }
    }

    // Atualiza o estado local uma única vez
    setLocalSteps(updatedSteps);

    // Atualiza os passos no contexto global (caso necessário)
    setSteps(updatedSteps);
  }, [formatValue, setSteps]);

  const handleNextStep = async (step: number, setStep: (step: number) => void) => {
    const result = await trigger(['name', 'format']); // Valida os campos relevantes
    if (result) {
      setCurrentStep(step);
      setStep(step);
    }
  };

  return (
    <div className="flex w-full flex-col gap-4 mt-5">
      <Stepper
        initialStep={0}
        steps={steps}
        onClickStep={(step, setStep) => handleNextStep(step, setStep)}
      >
        {steps.map((stepProps) => (
          <Step key={stepProps.label} {...stepProps}>
            <stepProps.component
              watch={watch}
              isDisabled={false}
              setValue={setValue}
              errors={errors}
              register={register}
              control={control}
              getValues={getValues}
              trigger={trigger}
              isVariation={false}
            />
          </Step>
        ))}
      </Stepper>
    </div>
  );
};

export default StepperClickableSteps;
