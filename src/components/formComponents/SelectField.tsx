import React from 'react';
import LabelInput from './LabelInput';
import { Controller, Control } from 'react-hook-form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import ErrorMessage from '../utils/ErrorMessage';

interface SelectFieldProps {
  label: string;
  name: string;
  control: Control<any>;
  options: { value: string | number; label: string }[];
  placeholder?: string;
  error?: any;
  isDisabled?: boolean;
  required?: boolean;
}

const SelectField: React.FC<SelectFieldProps> = ({
  label,
  name,
  control,
  options,
  placeholder,
  error,
  required,
  isDisabled = false,
}) => {
  const defaultValue = options[0]?.value;

  return (
    <div className="w-full">
      <LabelInput isRequired={required} htmlFor={name} text={label} />
      <Controller
        name={name}
        control={control}
        defaultValue={placeholder ? undefined : defaultValue}
        render={({ field: { onChange, value } }) => {
          return (
            <Select
              disabled={isDisabled}
              value={value}
              onValueChange={onChange}
            >
              <SelectTrigger id={name}>
                <SelectValue placeholder={placeholder}>
                  {value
                    ? options.find((option) => option.value === value)?.label
                    : placeholder || options[0]?.label}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {options.map((option) => (
                  <SelectItem key={option.value} value={String(option.value)}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          );
        }}
      />
      {error && <ErrorMessage>{error}</ErrorMessage>}
    </div>
  );
};

export default SelectField;
