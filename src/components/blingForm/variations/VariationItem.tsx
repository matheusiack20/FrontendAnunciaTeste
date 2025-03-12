import React from 'react';
import LabelInput from '../../formComponents/LabelInput';
import { Control } from 'react-hook-form';
import { Input } from '../../ui/input';
import { Trash2 } from 'lucide-react';
import { BlingFormType } from '@/types/BlingFormTypes';
import ObjectVariation from '@/context/blingContext';

interface VariationItemProps {
  variationIndex: number;
  control: Control<BlingFormType>;
  containerRefs: React.MutableRefObject<HTMLDivElement[]>;
  inputRefs: React.MutableRefObject<HTMLInputElement[][]>;
  handleContainerClick: (variationIndex: number) => void;
  attributesOfVariations: ObjectVariation;
  setNewOption: React.Dispatch<React.SetStateAction<string>>;
  handleRemoveVariationOption: (
    variationIndex: number,
    optionToRemove: string,
  ) => void;
  addOption: (
    variationIndex: number,
    event: React.KeyboardEvent<HTMLInputElement>,
  ) => void;
  setAttributesOfVariations: React.Dispatch<
    React.SetStateAction<ObjectVariation[]>
  >;
}
('');

const VariationItem: React.FC<VariationItemProps> = ({
  variationIndex,
  containerRefs,
  setAttributesOfVariations,
  inputRefs,
  handleContainerClick,
  addOption,
  attributesOfVariations,
  handleRemoveVariationOption,
}) => {
  return (
    <>
      <div
        key={variationIndex}
        className="flex flex-col sm:flex-row w-full gap-2 items-start"
      >
        <div className="w-full sm:w-1/3">
          <LabelInput
            isRequired={false}
            htmlFor={`nome-do-atributo-${variationIndex}`}
            text="Nome do atributo"
          />
          <Input
            value={attributesOfVariations.nameVariation}
            id={`nome-do-atributo-${variationIndex}`}
            type="text"
            placeholder="Nome do atributo"
            onChange={(e) => {
              const newName = e.target.value;
              setAttributesOfVariations((prevVariations) => {
                const updatedVariations = prevVariations.map(
                  (variationItem, index) =>
                    index === variationIndex
                      ? { ...variationItem, nameVariation: newName }
                      : variationItem,
                );
                return updatedVariations;
              });
            }}
          />
        </div>
        <div className="h-full w-full max-w-full sm:max-w-70p">
          <div className="flex flex-col ">
            <LabelInput
              isRequired={false}
              htmlFor={`opções-${variationIndex}`}
              text="Opções"
            />
            <div
              ref={(el) => {
                if (el) {
                  containerRefs.current[variationIndex] = el;
                }
              }}
              onClick={() => handleContainerClick(variationIndex)}
              className={`p-2 select-none cursor-text  min-h-10 h-full items-center max-w-full gap-2 flex-wrap flex w-full rounded-md border border-input bg-background px-3 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50`}
            >
              <ul className="flex gap-2 w-full max-w-full flex-wrap">
                {attributesOfVariations.options.map((option, optionIndex) => (
                  <li
                    key={optionIndex}
                    className="text-black bg-gray-200 truncate rounded-full px-4 py-1 flex items-center gap-2"
                  >
                    <span className="w-max g-transparent border-0 outline-none transition-colors  max-w-full">
                      {option}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        handleRemoveVariationOption(variationIndex, option)
                      }
                      className="text-red-500"
                    >
                      <Trash2 className="w-5 h-5 text-black hover:text-inherit" />
                    </button>
                  </li>
                ))}
                <li className="items-center flex">
                  <input
                    ref={(el) => {
                      if (el) {
                        if (!inputRefs.current[variationIndex]) {
                          inputRefs.current[variationIndex] = [];
                        }
                        inputRefs.current[variationIndex][0] = el;
                      }
                    }}
                    className="bg-transparent border-0 outline-none transition-colors w-20 max-w-full"
                    type="text"
                    onKeyDown={(e) => addOption(variationIndex, e)}
                  />
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default VariationItem;
