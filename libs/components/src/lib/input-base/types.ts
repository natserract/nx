import React from 'react';
import {
  Control,
  ControllerRenderProps,
  RegisterOptions,
} from 'react-hook-form'
import { Any } from '../../types/share';
import { InputProps } from "@vechaiui/react"

type BaseProps = {
  onChange: React.ChangeEventHandler<HTMLElement>;
  rules: Omit<
    RegisterOptions<Any, Any>,
    'valueAsNumber' | 'valueAsDate' | 'setValueAs' | 'disabled'
  >;
  required: boolean;
}

export type OptionalProps<T = unknown> =
  Partial<React.InputHTMLAttributes<HTMLElement>> &
  Partial<BaseProps> &
  Partial<InputProps> &
  Partial<React.MutableRefObject<T>>

export type InputElement = React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>

export type InputBaseProps<T = HTMLElement> = OptionalProps<T> & {
  // React hook form
  name: string;
  control: Control<Any, Any>;
  shouldUnregister?: boolean;

  // Base
  variant?: "outline" | "solid"
  inputComponent?: string;

  // Errors
  isError?: boolean
  errors?: { [x: string]: Any }
  errorMessage?: string;

  // Icon
  activeIconOnChange?: boolean;

  // Multiline/textarea
  multiline?: boolean

  // custom render
  customRenderInput?: (field: ControllerRenderProps<Any, string>) => JSX.Element
}
