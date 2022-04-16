import React from 'react'
import { Controller, ControllerRenderProps } from 'react-hook-form'
import { InputBaseProps } from './types';
import { Any } from '../../types/share';
import clsx from 'clsx'
import { styles } from './styles';
import { Input } from "@vechaiui/react"

export const InputBase = React.forwardRef<
  HTMLElement,
  InputBaseProps
>((props, _ref) => {
  const {
    name,
    control,
    required,
    onChange: onChangeProps,
    rules,
    inputComponent = 'input',
    variant = 'outline',
    multiline,
    shouldUnregister,
    className,
    customRenderInput = false,
    size = 'lg',
    ...inputProps
  } = props

  let InputComponent = inputComponent;

  if (multiline && InputComponent === 'input') {
    InputComponent = 'textarea';
  }

  const mergeOnChange = (event: React.ChangeEvent<HTMLInputElement>, fn) => {
    if (onChangeProps && typeof onChangeProps === "function") {
      onChangeProps(event)
    }

    return fn
  }

  const renderInput = (field: ControllerRenderProps<Any, string>) => {
    const baseInputProps = {
      ref: field.ref as Any,
      name: field.name,
      required,
      onChange: (e) => mergeOnChange(e, field.onChange(e)),
    }

    if (customRenderInput) {
      const RenderInput = customRenderInput(field)

      return React.cloneElement(
        RenderInput,
        { ...baseInputProps, ...inputProps }
      )
    }

    return (
      <Input
        as={InputComponent as Any} // <- Need to enforce this
        className={clsx(styles.inputBase, className)}
        variant={variant}
        size={size}
        value={field.value ?? ''}
        {...baseInputProps}
        {...inputProps}
      />
    )
  }

  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => renderInput(field)}
      rules={{
        required,
        ...rules
      }}
      shouldUnregister={shouldUnregister}
    />
  )
})

export default InputBase;
