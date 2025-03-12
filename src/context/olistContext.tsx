'use client';

import BasicData from '@/components/olistForm/BasicData';
import Characteristics from '@/components/olistForm/Characteristics';
import Images from '@/components/olistForm/Images';
import Stock from '@/components/olistForm/Stock';
import Taxation from '@/components/olistForm/Taxation';
import { OlistFormType } from '@/types/OlistFormTypes';
import { OlistFormComponentsProps } from '@/types/FormComponentsProps';
import React, { createContext, useState, useContext, ReactNode } from 'react';

export interface ObjectVariation extends OlistFormType {
  nameVariation: string;
  options: string[];
}

interface ValuesType {
  value: string;
  label: string;
  id?: number;
  name?: string;
  code?: string;
  sku?: any;
  descricaoCurta?: string;
  formato?: string;
  imagemURL?: string;
  preco?: number;
  precoCusto?: number;
  situacao?: string;
  tipo?: string;
  quantity?: number;
}

export interface NewValuesType extends OlistFormType {
  variations: { [key: string]: string };
  sku: any;
  shortDescription: string;
  code: string;
  price: number;
  [key: string]: any;
}

interface StepsOlist {
  id?: string;
  label: string;
  description?: string;
  component: React.FC<OlistFormComponentsProps>;
  optional?: boolean;
}

interface OlistContextType {
  variations: NewValuesType[];
  setVariations: React.Dispatch<React.SetStateAction<NewValuesType[]>>;
  attributesOfVariations: ObjectVariation[];
  setAttributesOfVariations: React.Dispatch<React.SetStateAction<ObjectVariation[]>>;
  setSelectedProducts: React.Dispatch<React.SetStateAction<ValuesType[]>>;
  selectedProducts: ValuesType[];
  setIsSavedVariations: React.Dispatch<React.SetStateAction<boolean>>;
  isSavedVariations: boolean;

  files: File[];
  setFiles: React.Dispatch<React.SetStateAction<File[]>>;
  links: { url: string }[];
  setLinks: React.Dispatch<React.SetStateAction<{ url: string }[]>>;
  urlImages: string[];
  setUrlImages: React.Dispatch<React.SetStateAction<string[]>>;
  filesVariations: File[];
  setFilesVariations: React.Dispatch<React.SetStateAction<File[]>>;

  currentStep: number;
  steps: StepsOlist[];
  setSteps: React.Dispatch<React.SetStateAction<StepsOlist[]>>;
  setCurrentStep: React.Dispatch<React.SetStateAction<number>>;
  activeLabel: string | null;
  setActiveLabel: React.Dispatch<React.SetStateAction<string | null>>;
  handleNextStep: () => void;
  handlePreviousStep: () => void;
  hasNextStep: boolean;
  isLastStep: boolean;
  hasPreviousStep: boolean;
}

const stepsInitial = [
  { label: 'Dados básicos', component: BasicData },
  { label: 'Características', component: Characteristics },
  { label: 'Imagens', component: Images },
  { label: 'Estoque', component: Stock },
  { label: 'Tributação', component: Taxation },
];

const VariationContext = createContext<OlistContextType | undefined>(undefined);

const OlistContextProvider = ({ children }: { children: ReactNode }) => {
  const [variations, setVariations] = useState<NewValuesType[]>([]);
  const [attributesOfVariations, setAttributesOfVariations] = useState<ObjectVariation[]>([]);
  const [activeLabel, setActiveLabel] = useState<string | null>('Dados básicos');
  const [steps, setSteps] = useState<StepsOlist[]>(stepsInitial);
  const [isSavedVariations, setIsSavedVariations] = useState<boolean>(false);
  const [selectedProducts, setSelectedProducts] = useState<ValuesType[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const [filesVariations, setFilesVariations] = useState<File[]>([]);
  const [links, setLinks] = useState<{ url: string }[]>([{ url: '' }]);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [urlImages, setUrlImages] = useState<string[]>([]);

  React.useEffect(() => {
    if (!variations || variations.length === 0) {
      setIsSavedVariations(false);
    }
  }, [variations]);

  const currentIndex = steps.findIndex((step) => step.label === activeLabel);
  const hasNextStep = currentIndex < steps.length - 1;
  const isLastStep = currentIndex === steps.length - 1;
  const hasPreviousStep = currentIndex > 0;

  const handleNextStep = () => {
    if (hasNextStep) {
      setActiveLabel(steps[currentIndex + 1].label);
    }
  };

  const handlePreviousStep = () => {
    if (hasPreviousStep) {
      setActiveLabel(steps[currentIndex - 1].label);
    }
  };

  return (
    <VariationContext.Provider
      value={{
        activeLabel,
        setActiveLabel,
        steps,
        setSteps,
        currentStep,
        setCurrentStep,
        variations,
        setVariations,
        attributesOfVariations,
        setAttributesOfVariations,
        selectedProducts,
        setSelectedProducts,
        isSavedVariations,
        setIsSavedVariations,
        files,
        setFiles,
        links,
        setLinks,
        urlImages,
        setUrlImages,
        filesVariations,
        setFilesVariations,
        handleNextStep,
        handlePreviousStep,
        hasNextStep,
        isLastStep,
        hasPreviousStep,
      }}
    >
      {children}
    </VariationContext.Provider>
  );
};

const useOlist = () => {
  const context = useContext(VariationContext);
  if (!context) {
    throw new Error('useOlist must be used within an OlistContextProvider');
  }
  return context;
};

export { OlistContextProvider, useOlist };
