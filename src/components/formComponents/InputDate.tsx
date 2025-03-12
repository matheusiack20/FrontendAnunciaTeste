import React from 'react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import LabelInput from './LabelInput';
import { ptBR } from 'date-fns/locale';
import ErrorMessage from '../utils/ErrorMessage';
import { Controller, Control } from 'react-hook-form';
import { BlingFormType } from '@/types/BlingFormTypes';

interface InputFieldProps {
  label: string;
  isRequired?: boolean;
  name: 'date';
  control: Control<any>;
  error?: any;
  isDisabled?: boolean;
}

const InputDate: React.FC<InputFieldProps> = ({
  label,
  isRequired = false,
  control,
  name,
  error,
  isDisabled = false,
}) => {
  const tomorrow = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);

  return (
    <div className="w-full">
      <LabelInput htmlFor={label.toLowerCase().trim()} text={label} />
      <Controller
        control={control}
        name={name}
        rules={{
          required: isRequired ? `O campo ${label} é obrigatório.` : false,
          validate: (value) =>
            value && new Date(value) >= tomorrow
              ? true
              : `Selecione uma data a partir de ${format(
                  tomorrow,
                  'dd/MM/yyyy',
                )}.`,
        }}
        render={({ field: { onChange, value }, fieldState: { error } }) => (
          <>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={'outline'}
                  className={cn(
                    `w-full justify-start text-left font-normal`,
                    !value && 'text-muted-foreground',
                    error && 'text-error',
                  )}
                  disabled={isDisabled}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {value ? (
                    format(new Date(value), 'PPP', { locale: ptBR })
                  ) : (
                    <span>Selecione a data</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={value ? new Date(value) : undefined}
                  onSelect={(day) => {
                    if (!isDisabled && day && day >= tomorrow) {
                      onChange(day);
                    } else {
                      onChange(null);
                    }
                  }}
                  initialFocus
                  locale={ptBR}
                  min={tomorrow.getTime()}
                  disabled={isDisabled}
                  modifiers={{
                    disabled: (date: Date) => date < tomorrow,
                  }}
                />
              </PopoverContent>
            </Popover>
            {error && <ErrorMessage>{error.message}</ErrorMessage>}
          </>
        )}
      />
      {error && <ErrorMessage>{error}</ErrorMessage>}
    </div>
  );
};

export default InputDate;
