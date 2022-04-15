import React from 'react';
import {
  Control,
  RegisterOptions,
} from 'react-hook-form'
import { Any } from '../../types/share';

type BaseProps = {
  onChange: React.ChangeEventHandler<HTMLInputElement> | React.ChangeEventHandler<HTMLTextAreaElement>;
  rules: Omit<
    RegisterOptions<Any, Any>,
    'valueAsNumber' | 'valueAsDate' | 'setValueAs' | 'disabled'
  >;
  required: boolean;
}

export type OptionalProps<T = unknown> =
  Partial<React.InputHTMLAttributes<HTMLElement> |
    React.TextareaHTMLAttributes<HTMLElement>> &
  Partial<BaseProps> &
  Partial<React.MutableRefObject<T>>

export type InputElement = React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>

export type InputBaseProps<T = HTMLInputElement | HTMLTextAreaElement> = OptionalProps<T> & InputElement & {
  // React hook form
  name: string;
  control: Control<Any, Any>;
  shouldUnregister?: boolean;

  // Base
  color?: "primary" | "secondary" | "success" | "error" | "info"
  variant?: "outlined" | "filled" | "standard"
  inputComponent?: string;
  sx?: React.CSSProperties | { [p: string]: Any }

  // Errors
  isError?: boolean
  errors?: { [x: string]: Any }
  errorMessage?: string;

  // Icon
  activeIconOnChange?: boolean;

  // Multiline/textarea
  multiline?: boolean
}
