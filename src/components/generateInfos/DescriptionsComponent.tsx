'use client';
import { Label } from '@radix-ui/react-label';
import React, { useEffect } from 'react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import styles from "./DescriptionsComponent.module.scss"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { useGenerateData } from '@/context/generateDataContext';

interface DescriptionComponentProps {
  data: string[];
}

const DescriptionComponent: React.FC<DescriptionComponentProps> = ({
  data,
}) => {
  const { selectedDescriptionValue, setSelectedDescriptionValue } =
    useGenerateData();

  // Resetar a descrição selecionada quando os dados mudam
  useEffect(() => {
    if (data.length > 0) {
      const randomDescription = data[Math.floor(Math.random() * data.length)];
      setSelectedDescriptionValue(randomDescription);
    }
  }, [data, setSelectedDescriptionValue]);

  console.log(data)

  return (
    <div className="mt-10">
      <Accordion type="single" collapsible defaultValue="item-1">
        <AccordionItem value="item-1">
          <AccordionTrigger className="flex gap-2 items-center cursor-pointer">
            <h2 className="mb-4 text-3xl font-bold text-white dark:text-white md:text-4xl lg:text-5xl ">
              Descrições
            </h2>
          </AccordionTrigger>
          <AccordionContent className="overflow-hidden transition-[height] duration-200">
            <RadioGroup
              value={selectedDescriptionValue}
              onValueChange={(value) => setSelectedDescriptionValue(value)}
              className="gap-4"
            >
              {data.map((description, index) => (
                <div key={index} className="flex items-center space-x-3 my-10">
                  <RadioGroupItem
                    value={description}
                    id={`description-${index + 1}`}
                  />
                  <Label
                    className="cursor-pointer w-full max-w-90p"
                    htmlFor={`description-${index + 1}`}
                  >
                    <div className={styles.prose} dangerouslySetInnerHTML={{ __html: description }}/>
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

export default DescriptionComponent;
