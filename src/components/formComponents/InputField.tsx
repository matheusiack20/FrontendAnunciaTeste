import React from 'react';
import { Input } from '../ui/input';
import LabelInput from './LabelInput';
import { UseFormRegisterReturn } from 'react-hook-form';
import ErrorMessage from '../utils/ErrorMessage';

interface InputFieldProps {
  label: string;
  placeholder?: string;
  register: UseFormRegisterReturn;
  required?: boolean;
  type?: string;
  error?: any;
  isDisabled?: boolean;
  rgx?: string;
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  placeholder,
  register,
  required = false,
  type = 'text',
  error,
  isDisabled = false,
  rgx,
}) => {
  const handleInput = (e: React.FormEvent<HTMLInputElement>) => {
    if (rgx === 'number') {
      e.currentTarget.value = e.currentTarget.value.replace(/\D/g, '');
    }
  };

  return (
    <div className="w-full">
      <LabelInput
        isRequired={required}
        htmlFor={label.toLowerCase().trim()}
        text={label}
      />
      <Input
        id={label.toLowerCase().trim()}
        type={type}
        defaultValue={''}
        required={required}
        placeholder={placeholder}
        onInput={handleInput}
        {...register}
        aria-invalid={!!error}
        aria-describedby={`${label.toLowerCase().trim()}-error`}
        disabled={isDisabled}
      />
      {error && <ErrorMessage>{error}</ErrorMessage>}
    </div>
  );
};

export default InputField;
