import React, { useState, useRef } from 'react';
import VariationItem from './VariationItem';
import CreateVariation from './CreateVariation';
import { useStepper } from '../../stepper';
import { Button } from '../../ui/button';
import { Search, Eraser } from 'lucide-react';
import { OlistFormComponentsProps} from '@/types/FormComponentsProps';
import { UseFormGetValues } from 'react-hook-form';
import DataTable from '../DataTable';
import { useOlist } from '@/context/olistContext';
import ErrorMessage from '@/components/utils/ErrorMessage';
import { OlistFormType } from '@/types/OlistFormTypes';
import { cadastrouAnuncio } from '../../../../trackingMeta';

interface VariationProps extends OlistFormComponentsProps {
  getValues: UseFormGetValues<OlistFormType>;
}

const Variations: React.FC<VariationProps> = ({
  control,
  getValues,
  register,
  trigger,
  setCurrentStep,
  errors,
  watch,
}) => {
  const { prevStep, isDisabledStep } = useStepper();
  const {
    attributesOfVariations,
    setAttributesOfVariations,
    isSavedVariations,
    setIsSavedVariations,
    variations,
    setVariations,
  } = useOlist();
  const [options, setOptions] = useState<string[]>([]);
  const [newOption, setNewOption] = useState<string>('');
  const nameVariationRef = useRef<HTMLInputElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputVariationRef = useRef<HTMLInputElement>(null);
  const inputRefs = useRef<Array<HTMLInputElement[]>>([]);
  const containerRefs = useRef<HTMLDivElement[]>([]);
  const formatValue = watch('type');

  const handleAddOption = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' || event.key === 'Tab') {
      event.preventDefault();
      const trimmedValue = newOption.trim();
      if (trimmedValue && !options.includes(trimmedValue)) {
        setOptions((prevOptions) => [...prevOptions, trimmedValue]);
        setNewOption('');
        event.currentTarget.value = '';
      }
    }
  };

  const handleInputChange = () => {
    const textLength = newOption.length;
    const containerWidth = containerRef.current?.scrollWidth || 0;
    const newWidth = Math.max(
      235,
      Math.min(containerWidth - 20, textLength * 10),
    );
    if (inputRef.current) {
      inputRef.current.style.width = `${newWidth}px`;
    }
  };

  const addOption = (
    variationIndex: number,
    event: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    const target = event.target as HTMLInputElement;

    if (event.key === 'Enter' || event.key === 'Tab') {
      setAttributesOfVariations((prevVariations) => {
        const newVariations = [...prevVariations];
        const trimmedValue = target.value.trim();

        if (
          trimmedValue &&
          !newVariations[variationIndex].options.includes(trimmedValue)
        ) {
          newVariations[variationIndex].options.push(trimmedValue);
        }

        return newVariations;
      });

      target.value = '';

      setNewOption('');

      if (inputVariationRef.current) {
        inputVariationRef.current.focus();
      }
    }
  };

  const handleRemoveOption = (optionToRemove: string) => {
    setOptions((prevOptions) =>
      prevOptions.filter((option) => option !== optionToRemove),
    );
  };

  const handleRemoveVariationOption = (
    variationIndex: number,
    optionToRemove: string,
  ) => {
    setAttributesOfVariations((prevVariations) => {
      const updatedOptions = prevVariations[variationIndex].options.filter(
        (option) => option !== optionToRemove,
      );

      if (updatedOptions.length === 0) {
        return prevVariations.filter((_, index) => index !== variationIndex);
      }

      const updatedVariations = [...prevVariations];
      updatedVariations[variationIndex].options = updatedOptions;
      return updatedVariations;
    });
  };

  const createVariation = () => {
    const currentValue = nameVariationRef.current?.value;
    if (currentValue && options.length > 0) {
      setAttributesOfVariations((prevVariations:any) => {
        const newVariation = {
          name: currentValue,
          sku: '',
          shortDescription: '',
          nameVariation: currentValue,
          nameVariations: '',
          options: options,
          precos: {
            preco: 0,
            precoPromocional: 0,
            precoCusto: 0,
          },
          code: '',
          usingFatherProducts: false,
          variations: variations,
          price: '',
        };
        return [...prevVariations, newVariation];
      });

      setOptions([]);
      setNewOption('');
      if (nameVariationRef.current) {
        nameVariationRef.current.value = '';
      }
    }
  };

  const handleContainerClick = (variationIndex: number) => {
    const inputs = inputRefs.current[variationIndex];
    if (inputs.length > 0) {
      inputs[0]?.focus();
    }
  };

  React.useEffect(() => {
    if (attributesOfVariations.length === 0) {
      setVariations([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [attributesOfVariations]);

  return (
    <div className="flex flex-col gap-5 ml-0 pl-0">
      <h3 className="text-4xl font-extrabold">Variações</h3>

      <CreateVariation
        control={control}
        setNewOption={setNewOption}
        nameVariationRef={nameVariationRef}
        containerRef={containerRef}
        createVariation={createVariation}
        handleAddOption={handleAddOption}
        handleInputChange={handleInputChange}
        handleRemoveOption={handleRemoveOption}
        inputRef={inputRef}
        options={options}
      />

      <ul className="flex flex-col gap-4">
        {attributesOfVariations && variations && variations.length > 0 && (
          <div className="flex flex-col mb-4  gap-2">
            {isSavedVariations && (
              <ErrorMessage className="ml-0">
                Não é possível adicionar um novo atributo após criar uma
                variação
              </ErrorMessage>
            )}
            {isSavedVariations && (
              <Button
                className="w-1/2"
                onClick={() => {
                  setVariations([]);
                  setAttributesOfVariations([]);
                  setIsSavedVariations(false);
                }}
              >
                <Eraser className="w-5 h-5 mr-2" />
                Limpar variações
              </Button>
            )}
            {attributesOfVariations && variations && variations.length > 0 && (
              <p className="text-white-700  mt-2 text-3xl font-extrabold dark:text-white">
                Variações cadastradas
              </p>
            )}
          </div>
        )}
        {attributesOfVariations.map((variation, variationIndex) => (
          <VariationItem
            setattributesOfVariations={setAttributesOfVariations}
            key={variationIndex}
            attributesOfVariations={variation}
            variationIndex={variationIndex}
            control={control}
            containerRefs={containerRefs}
            inputRefs={inputRefs}
            handleContainerClick={handleContainerClick}
            addOption={addOption}
            handleRemoveVariationOption={handleRemoveVariationOption}
            setNewOption={setNewOption}
          />
        ))}
      </ul>
      {attributesOfVariations && attributesOfVariations.length >= 1 && (
        <DataTable
          getValues={getValues}
          control={control}
          errors={errors}
          register={register}
          setCurrentStep={setCurrentStep}
          trigger={trigger}
        />
      )}
      {formatValue === 'V' && (
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
    </div>
  );
};

export default Variations;
