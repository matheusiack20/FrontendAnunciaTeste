import React from 'react';
import LabelInput from '../../formComponents/LabelInput';
import { Control, Controller } from 'react-hook-form';
import { Input } from '../../ui/input';
import { Button } from '../../ui/button';
import { Trash2 } from 'lucide-react';
import { useOlist } from '@/context/olistContext';
import { OlistFormType } from '@/types/OlistFormTypes';

interface CreateVariation {
  control: Control<OlistFormType>;
  containerRef: React.RefObject<HTMLDivElement>;
  setNewOption: React.Dispatch<React.SetStateAction<string>>;
  options: string[];
  nameVariationRef: React.RefObject<HTMLInputElement>;
  inputRef: React.RefObject<HTMLInputElement>;
  handleInputChange: () => void;
  handleAddOption: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  createVariation: () => void;
  handleRemoveOption: (optionToRemove: string) => void;
}

const CreateVariation: React.FC<CreateVariation> = ({
  handleRemoveOption,
  handleInputChange,
  createVariation,
  options,
  containerRef,
  nameVariationRef,
  inputRef,
  handleAddOption,
  setNewOption,
}) => {
  const { isSavedVariations } = useOlist();

  return (
    <div className="flex flex-col w-full items-start gap-2">
      <div className="flex flex-col sm:flex-row w-full gap-2 items-start">
        <div className="w-full sm:w-1/3">
          <LabelInput
            isRequired={false}
            htmlFor="nome-do-atributo"
            text="Nome do atributo"
          />
          <Input
            ref={nameVariationRef}
            id="variations"
            type="text"
            disabled={isSavedVariations}
            placeholder="Cor, tamanho, largura, voltagem"
          />
        </div>
        <div className="h-full w-full max-w-full sm:max-w-70p">
          <div className="flex flex-col">
            <LabelInput
              onClick={() => inputRef.current?.focus()}
              isRequired={false}
              htmlFor="opções"
              text="Opções"
            />
            <div
              onClick={() => inputRef.current?.focus()}
              ref={containerRef}
              className={`p-2 select-none cursor-text min-h-10 h-full items-center max-w-full gap-2 flex-wrap flex w-full rounded-md border border-input bg-background px-3 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
                isSavedVariations
                  ? 'disabled !cursor-not-allowed !opacity-50'
                  : ''
              }`}
            >
              <ul
                className={`flex gap-2 w-full max-w-full flex-wrap ${
                  isSavedVariations
                    ? 'disabled !cursor-not-allowed !opacity-50'
                    : ''
                }`}
              >
                {options.map((option, index) => (
                  <li
                    key={index}
                    className={`text-black bg-gray-200 truncate rounded-full px-4 py-1 flex items-center gap-2 ${
                      isSavedVariations
                        ? 'disabled !cursor-not-allowed !opacity-50'
                        : ''
                    }`}
                  >
                    <span className="truncate w-full">{option}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveOption(option)}
                      className="text-red-500"
                    >
                      <Trash2 className="w-5 h-5 text-black hover:text-inherit" />
                    </button>
                  </li>
                ))}
                <li className="items-center flex">
                  <input
                    placeholder="Digite as opções do seu atributo"
                    className={`bg-transparent placeholder:text-muted-foreground border-0 outline-none transition-colors w-60 max-w-full focus-visible:outline-none text-sm focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
                      isSavedVariations
                        ? 'disabled !cursor-not-allowed !opacity-50'
                        : ''
                    }`}
                    ref={inputRef}
                    disabled={isSavedVariations}
                    onChange={(e) => {
                      handleInputChange();
                      setNewOption(e.target.value);
                    }}
                    onKeyDown={handleAddOption}
                    type="text"
                  />
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <Button
        type="button"
        disabled={isSavedVariations}
        onClick={createVariation}
      >
        Adicionar Variação
      </Button>
    </div>
  );
};

export default CreateVariation;
