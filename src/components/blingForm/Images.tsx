import React from 'react';
import FileUploaderComponent from '../formComponents/FileUploaderComponent';
import { Input } from '../ui/input';
import { CirclePlus, Trash } from 'lucide-react';
import { Button } from '../ui/button';
import { useStepper } from '../stepper';
import { useBling } from '@/context/blingContext';
import { BlingFormComponentsProps } from '@/types/FormComponentsProps';

const Images: React.FC<BlingFormComponentsProps> = ({
  trigger,
  setCurrentStep,
  isVariation,
  getValues,
  setValue,
}) => {
  interface urlsImagesI {
    url: string;
  }
  const { links, setLinks, files, setFiles } = useBling();
  const { nextStep, prevStep, isDisabledStep, activeStep } = useStepper();
  const values = getValues();
  const [urlsImagesVariation, setUrlsLocalImagesVariation] = React.useState<
    urlsImagesI[]
  >([]);

  const urlsImages = getValues?.('urlsImages') || [];
  React.useEffect(() => {
    if (isVariation) {
      if (urlsImages) {
        if (urlsImagesVariation.length === 0) {
          setUrlsLocalImagesVariation(urlsImages);
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [urlsImages]);

  React.useEffect(() => {
    if (urlsImagesVariation && setValue) {
      if (getValues) {
        const urlsImages = getValues('urlsImages');
        if (urlsImages && urlsImagesVariation !== urlsImages)
          setValue('urlsImages', urlsImagesVariation);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [urlsImagesVariation]);

  const handleNextStepClick = async () => {

    const result = await trigger(['name', 'format']);
    if (!result) {
      return;
    }
    if (!isVariation) {
      nextStep();
    }
  };

  const handleAddLink = () => {
    if (isVariation) {
      setUrlsLocalImagesVariation([...urlsImagesVariation, { url: '' }]);
    } else {
      setLinks([...links, { url: '' }]);
    }
  };

  const handleLinkChange = (index: number, url: string) => {
    if (isVariation) {
      const updatedLinks = [...urlsImagesVariation];
      updatedLinks[index].url = url;
      setUrlsLocalImagesVariation(updatedLinks);
    } else {
      const updatedLinks = [...links];
      updatedLinks[index].url = url;
      setLinks(updatedLinks);
    }
  };

  const handleRemoveLink = (index: number) => {
    if (isVariation) {
      const updatedLinks = urlsImagesVariation.filter((_, i) => i !== index);

      setUrlsLocalImagesVariation(updatedLinks);
    } else {
      const updatedLinks = links.filter((_, i) => i !== index);

      setLinks(updatedLinks);
    }
  };
  return (
    <div className="flex flex-col gap-5">
      <h3 className="text-white-700 mt-10 mb-2 text-3xl font-extrabold dark:text-white">
        Imagens
      </h3>
      <div className="w-full">
        <FileUploaderComponent
          files={files}
          setFiles={setFiles}
          setValue={setValue}
          getValues={getValues}
          isVariation={isVariation}
        />
      </div>
      <p>Ou digite seus links</p>
      {!isVariation &&
        links.map((link, index) => (
          <div className="w-full relative" key={index}>
            <Input
              type="text"
              value={link.url}
              onChange={(e) => handleLinkChange(index, e.target.value)}
              placeholder="Digite sua URL"
              className="w-full pr-10"
            />
            {index > 0 && (
              <button
                type="button"
                className="flex justify-center items-center absolute top-1 h-7 w-7 right-1 rounded-full hover:bg-red-600 hover:stroke-destructive hover:text-white "
                onClick={() => handleRemoveLink(index)}
              >
                <Trash
                  width={16}
                  height={16}
                  className="duration-200 ease-in-out"
                />
              </button>
            )}
          </div>
        ))}
      {isVariation &&
        urlsImagesVariation.map((link, index) => (
          <div className="w-full relative" key={index}>
            <Input
              type="text"
              value={link.url}
              onChange={(e) => handleLinkChange(index, e.target.value)}
              placeholder="Digite sua URL"
              className="w-full pr-10"
            />
            {index > 0 && (
              <button
                type="button"
                className="flex justify-center items-center absolute top-1 h-7 w-7 right-1 rounded-full hover:bg-red-600 hover:stroke-destructive hover:text-white "
                onClick={() => handleRemoveLink(index)}
              >
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
          <Button onClick={handleNextStepClick} size="lg" type="button">
            Avançar
          </Button>
        </div>
      )}
    </div>
  );
};

export default Images;
