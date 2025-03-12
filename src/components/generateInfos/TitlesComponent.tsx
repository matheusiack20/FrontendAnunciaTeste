'use client';
import { Label } from '@radix-ui/react-label';
import React, { useEffect } from 'react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { useGenerateData } from '@/context/generateDataContext';

interface TitlesComponentProps {
  data: string[];
}

const TitlesComponent: React.FC<TitlesComponentProps> = ({ data }) => {
  const { selectedTitleValue, setSelectedTitleValue } = useGenerateData();

  // Resetar o título selecionado quando os dados mudam
  useEffect(() => {
    if (data.length > 0) {
      const randomTitle = data[Math.floor(Math.random() * data.length)];
      setSelectedTitleValue(randomTitle);
    }
  }, [data, setSelectedTitleValue]);

  return (
    <div className="mt-10">
      <Accordion type="single" collapsible defaultValue="item-1">
        <AccordionItem value="item-1">
          <AccordionTrigger className="flex gap-2 items-center cursor-pointer">
            <h2 className="mb-4 text-3xl font-bold text-white dark:text-white md:text-4xl lg:text-5xl ">
              Títulos
            </h2>
          </AccordionTrigger>
          <AccordionContent className="overflow-hidden transition-[height] duration-200">
            <RadioGroup
              value={selectedTitleValue}
              onValueChange={(value) => setSelectedTitleValue(value)}
              className="gap-4"
            >
              {data.map((title, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <RadioGroupItem value={title} id={`title-${index + 1}`} />
                  <Label
                    className="cursor-pointer w-full max-w-90p"
                    htmlFor={`title-${index + 1}`}
                  >
                    {title}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default TitlesComponent;
