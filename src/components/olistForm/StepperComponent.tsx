'use client';
import React from 'react';

import { Step, type StepItem, Stepper } from '@/components/stepper';
import BasicData from './BasicData';
import Characteristics from './Characteristics';
import Images from './Images';
import Stock from './Stock';
import Taxation from './Taxation';
import Variations from './variations/Variations';
import { OlistStepperComponentProps } from '@/types/StepperComponentProps';

const initialSteps: StepItem[] = [
  { label: 'Dados básicos' },
  { label: 'Características' },
  { label: 'Imagens' },
  { label: 'Estoque' },
  { label: 'Tributação' },
];

const StepperClickableSteps: React.FC<OlistStepperComponentProps> = ({
  register,
  control,
  errors,
  trigger,
  setValue,
  getValues,
  watch,
}) => {
  const [currentStep, setCurrentStep] = React.useState<number>(0);
  const [steps, setSteps] = React.useState<StepItem[]>(initialSteps);

  const formatValue = watch('type');
  React.useEffect(() => {
    if (formatValue === 'V') {
      if (!steps.find((step) => step.label === 'Variações')) {
        setSteps((prevSteps) => [...prevSteps, { label: 'Variações' }]);
      }
    } else {
      setSteps((prevSteps) =>
        prevSteps.filter((step) => step.label !== 'Variações'),
      );
    }
  }, [formatValue, steps]);

  const handleNextStep = async (
    step: number,
    setStep: (step: number) => void,
  ) => {
    let result: boolean;

    if (step === currentStep) return;

    switch (step) {
      case 0:
        setCurrentStep(step);
        setStep(step);
        break;

      case 1:
        result = await trigger(['shortDescription', 'sku', 'type']);
        if (result) {
          setCurrentStep(step);
          setStep(step);
        }
        break;

      case 2:
        result = await trigger([ 'shortDescription', 'sku', 'type']);
        if (result) {
          setCurrentStep(step);
          setStep(step);
        }
        break;

      case 3:
        result = await trigger(['shortDescription', 'sku', 'type']);
        if (result) {
          setCurrentStep(step);
          setStep(step);
        }
        break;

      case 4:
        result = await trigger(['shortDescription', 'sku', 'type']);
        if (result) {
          setCurrentStep(step);
          setStep(step);
        }
        break;

      case 5:
        result = await trigger(['shortDescription', 'sku', 'type']);
        if (result) {
          setCurrentStep(step);
          setStep(step);
        }
        break;

      default:
        break;
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
            {stepProps.label === 'Dados básicos' && (
              <BasicData
                watch={watch}
                isDisabled={false}
                setCurrentStep={setCurrentStep}
                errors={errors}
                register={register}
                getValues={getValues}
                setValue={setValue}
                control={control}
                trigger={trigger}
                isVariation={false}
              />
            )}
            {stepProps.label === 'Características' && (
              <Characteristics
                getValues={getValues}
                setValue={setValue}
                watch={watch}
                isDisabled={false}
                setCurrentStep={setCurrentStep}
                errors={errors}
                register={register}
                control={control}
                trigger={trigger}
                isVariation={false}
              />
            )}
            {stepProps.label === 'Imagens' && (
              <Images
                watch={watch}
                getValues={null as any}
                setValue={null as any}
                isDisabled={false}
                setCurrentStep={setCurrentStep}
                errors={errors}
                register={register}
                control={control}
                trigger={trigger}
                isVariation={false}
              />
            )}
            {stepProps.label === 'Estoque' && (
              <Stock
                watch={watch}
                isDisabled={false}
                setCurrentStep={setCurrentStep}
                errors={errors}
                register={register}
                getValues={getValues}
                setValue={setValue}
                trigger={trigger}
                control={control}
                isVariation={false}
              />
            )}
            {stepProps.label === 'Tributação' && (
              <Taxation
                watch={watch}
                isDisabled={false}
                setCurrentStep={setCurrentStep}
                trigger={trigger}
                errors={errors}
                register={register}
                getValues={getValues}
                setValue={setValue}
                control={control}
                isVariation={false}
              />
            )}
            {stepProps.label === 'Variações' && (
              <Variations
                setValue={setValue}
                watch={watch}
                isDisabled={false}
                setCurrentStep={setCurrentStep}
                trigger={trigger}
                errors={errors}
                register={register}
                control={control}
                getValues={getValues}
                isVariation={false}
              />
            )}
          </Step>
        ))}
      </Stepper>
    </div>
  );
};
export default StepperClickableSteps;
