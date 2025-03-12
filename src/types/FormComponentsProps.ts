import {
  UseFormRegister,
  Control,
  FieldErrors,
  UseFormTrigger,
  UseFormWatch,
  UseFormGetValues,
  UseFormSetValue,
} from 'react-hook-form';
import { BlingFormType } from './BlingFormTypes';
import { OlistFormType } from './OlistFormTypes';

export interface BlingFormComponentsProps {
  register: UseFormRegister<any>;
  getValues: UseFormGetValues<any>;
  control: Control<any>;
  errors: FieldErrors<any>;
  setValue: UseFormSetValue<any>;
  watch: UseFormWatch<any>;
  trigger: UseFormTrigger<any>;
  setCurrentStep?: React.Dispatch<React.SetStateAction<number>>;
  isVariation: boolean;
  isDisabled: boolean;
}

export interface OlistFormComponentsProps {
  register: UseFormRegister<OlistFormType>;
  getValues: UseFormGetValues<OlistFormType>;
  control: Control<OlistFormType>;
  errors: FieldErrors<OlistFormType>;
  setValue: UseFormSetValue<OlistFormType>;
  watch: UseFormWatch<OlistFormType>;
  trigger: UseFormTrigger<OlistFormType>;
  setCurrentStep?: React.Dispatch<React.SetStateAction<number>>;
  isVariation: boolean;
  isDisabled: boolean;
}
