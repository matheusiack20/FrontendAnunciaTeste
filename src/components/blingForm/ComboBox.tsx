'use client';

import * as React from 'react';
import { Check, ChevronsUpDown } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

interface ValuesType {
  value: string;
  label: string;
  id?: number;
  nome?: string;
  codigo?: string;
  descricaoCurta?: string;
  formato?: string;
  imagemURL?: string;
  preco?: number;
  precoCusto?: number;
  situacao?: string;
  tipo?: string;
}

interface ComboboxDemoProps {
  values: ValuesType[];
  setSelectedProducts: React.Dispatch<React.SetStateAction<ValuesType[]>>;
  selectedProducts: ValuesType[];
}

export function ComboboxDemo({
  values,
  setSelectedProducts,
  selectedProducts,
}: ComboboxDemoProps) {
  const [open, setOpen] = React.useState(false);
  const [selectedValue, setSelectedValue] = React.useState<string | null>(null);
  const handleSelect = (currentValue: string) => {
    const selectedProduct = values.find((item) => item.value === currentValue);
    if (!selectedProduct) return;

    const alreadySelected = selectedProducts.some(
      (product) => product.id === selectedProduct.id,
    );

    if (!alreadySelected) {
      setSelectedProducts((prev) => [...prev, selectedProduct]);
    }
    setSelectedValue(currentValue === selectedValue ? null : currentValue);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="sm:w-full justify-between truncate"
        >
          {selectedValue
            ? values.find((item) => item.value === selectedValue)?.label
            : 'Select value...'}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="sm:w-full p-0">
        <Command>
          <CommandList>
            <CommandGroup>
              {values.map((item) => (
                <CommandItem
                  key={item.value}
                  value={item.value}
                  onSelect={() => handleSelect(item.value)}
                >
                  <Check
                    className={cn(
                      'mr-2 h-4 w-4',
                      selectedValue === item.value
                        ? 'opacity-100'
                        : 'opacity-0',
                    )}
                  />
                  {item.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
