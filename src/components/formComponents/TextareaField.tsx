import React from 'react';
import { Textarea } from '../ui/textarea';
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
  resize?: boolean;
  isDisabled: boolean;
}

const TextareaField: React.FC<InputFieldProps> = ({
  label,
  placeholder,
  register,
  required = false,
  type = 'text',
  error,
  resize = true,
  isDisabled = false,
}) => {
  return (
    <div className="w-full">
      <LabelInput htmlFor={label.toLowerCase().trim()} text={label} />
      <Textarea
        disabled={isDisabled}
        className={`${resize ? 'resize' : 'resize-none'}`}
        {...register}
        placeholder={placeholder}
        required={required}
      />
      {error && <ErrorMessage>{error}</ErrorMessage>}
    </div>
  );
};

export default TextareaField;
