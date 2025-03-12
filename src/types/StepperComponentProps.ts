import {
  UseFormRegister,
  Control,
  FieldErrors,
  UseFormTrigger,
  UseFormGetValues,
  UseFormWatch,
  UseFormSetValue,
} from 'react-hook-form';

import { OlistFormType } from './OlistFormTypes';
import { BlingFormType } from './BlingFormTypes';

export interface BlingStepperComponentProps {
  register: UseFormRegister<BlingFormType>;
  control: Control<BlingFormType>;
  setValue: UseFormSetValue<BlingFormType>;
  errors: FieldErrors<BlingFormType>;
  trigger: UseFormTrigger<BlingFormType>;
  getValues: UseFormGetValues<BlingFormType>;
  watch: UseFormWatch<BlingFormType>;
}

export interface OlistStepperComponentProps {
  register: UseFormRegister<OlistFormType>;
  control: Control<OlistFormType>;
  errors: FieldErrors<OlistFormType>;
  trigger: UseFormTrigger<OlistFormType>;
  getValues: UseFormGetValues<OlistFormType>;
  watch: UseFormWatch<OlistFormType>;
  setValue: UseFormSetValue<OlistFormType>;
}
