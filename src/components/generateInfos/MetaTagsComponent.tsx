'use client';
import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

interface MetaTagsComponentProps {
  data: string[];
}

const MetaTagsComponent: React.FC<MetaTagsComponentProps> = ({ data }) => {
  return (
    <div className="mt-10">
      <Accordion type="single" collapsible defaultValue="item-1">
        <AccordionItem value="item-1">
          <AccordionTrigger className="flex gap-2 items-center cursor-pointer">
            <h2 className="mb-4 text-3xl font-bold text-white dark:text-white md:text-4xl lg:text-5xl ">
              Palavras chaves
            </h2>
          </AccordionTrigger>
          <AccordionContent className="overflow-hidden transition-[height] duration-200">
            <div className="flex gap-5 flex-wrap">
              {data.map((metaTag, index) => {
                return (
                  <p
                    className="py-2 px-4 text-base bg-[#A8A419] text-white"
                    key={index}
                  >
                    {metaTag}
                  </p>
                );
              })}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default MetaTagsComponent;
