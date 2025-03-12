import * as React from 'react';
import type { StepperProps } from './types';
import { useBling } from '@/context/blingContext';

interface StepperContextValue extends StepperProps {
  clickable?: boolean;
  isError?: boolean;
  isLoading?: boolean;
  isVertical?: boolean;
  stepCount?: number;
  expandVerticalSteps?: boolean;
  activeStep: number; // Mantido
  initialStep: number;
  setActiveStep: React.Dispatch<React.SetStateAction<number>>;
}

type StepperContextProviderProps = {
  value: StepperContextValue; // Removido Omit para permitir activeStep
  children: React.ReactNode;
};

const StepperContext = React.createContext< 
  StepperContextValue & {
    nextStep: () => void;
    prevStep: () => void;
    resetSteps: () => void;
  }
>({
  steps: [],
  activeStep: 0,
  initialStep: 0,
  nextStep: () => {},
  prevStep: () => {},
  resetSteps: () => {},
  setActiveStep: () => {},
});

const StepperProvider = ({ value, children }: StepperContextProviderProps) => {
  const isError = value.state === 'error';
  const isLoading = value.state === 'loading';
  const [activeStep, setActiveStep] = React.useState(value.initialStep);
  console.log('initialStep:', value.initialStep);

  const nextStep = () => {
    setActiveStep((prev) => prev + 1);
  };

  const prevStep = () => {
    setActiveStep((prev) => prev - 1);
  };

  const resetSteps = () => {
    setActiveStep(0);
  };

  return (
    <StepperContext.Provider
      value={{
        ...value,
        isError,
        isLoading,
        activeStep,
        nextStep,
        prevStep,
        resetSteps,
        setActiveStep,
      }}
    >
      {children}
    </StepperContext.Provider>
  );
};

export { StepperContext, StepperProvider };
