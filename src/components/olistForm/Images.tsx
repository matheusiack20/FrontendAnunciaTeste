import { OlistFormComponentsProps } from '@/types/FormComponentsProps';
import React, { useState } from 'react';
import FileUploaderComponent from '../formComponents/FileUploaderComponent';
import { Input } from '../ui/input';
import { CirclePlus, Trash } from 'lucide-react';
import { Button } from '../ui/button';
import { useStepper } from '../stepper';

const Images: React.FC<OlistFormComponentsProps> = ({
  trigger,
  setCurrentStep,
  isVariation,
}) => {
  const [files, setFiles] = useState<File[]>([]);
  const [links, setLinks] = useState([{ url: '' }]);
  const { nextStep, prevStep, isDisabledStep, activeStep, isError } =
    useStepper();

  const handleNextStep = async () => {
    const result = await trigger('shortDescription');
    if (!result) {
      return;
    }
    if (!isVariation) {
      if (setCurrentStep) {
        setCurrentStep(activeStep + 1);
        nextStep();
      }
    }
  };

  const handleAddLink = () => {
    setLinks([...links, { url: '' }]);
  };

  const handleLinkChange = (index: number, url: string) => {
    links[index].url = url;
    setLinks([...links]);
  };

  const handleRemoveLink = (index: number) => {
    setLinks(links.filter((_, i) => i !== index));
  };

  return (
    <div className="flex flex-col gap-5">
      <h3 className="text-white-700 mt-10 mb-2 text-3xl font-extrabold dark:text-white">
        Imagens
      </h3>
      <div className="w-full">
        <FileUploaderComponent files={files} setFiles={setFiles} />
      </div>
      <p>Ou digite seus links</p>
      {links.map((link, index) => (
        <div className="w-full relative" key={index}>
          <Input
            type="text"
            value={link.url}
            onChange={(e) => handleLinkChange(index, e.target.value)}
            placeholder="Digite sua URL"
            className="w-full"
          />
          {index > 0 && (
            <button
              type="button"
              className="flex justify-center items-center absolute top-1 h-7 w-7 right-1  rounded-full hover:bg-red-600 hover:stroke-destructive hover:text-white"
              onClick={() => handleRemoveLink(index)}
            >
              {' '}
              <Trash
                width={16}
                height={16}
                className="duration-200 ease-in-out"
              />
            </button>
          )}
        </div>
      ))}
      <button
        className="flex gap-2 text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
        type="button"
        onClick={handleAddLink}
      >
        <p>Insira uma nova URL</p>
        <CirclePlus />
      </button>
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

export default Images;
