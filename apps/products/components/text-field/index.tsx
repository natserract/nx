import { FormControl, FormLabel, FormErrorMessage, FormHelperText } from "@vechaiui/react"
import { InputBase as Input, InputBaseProps } from '@nx/components'

type TextFieldProps = {
  label?: string;
  helperText?: string;
} & InputBaseProps

const TextField: React.FC<TextFieldProps> = (props) => {
  const {
    control,
    errors,
    name,
    label,
    placeholder,
    disabled,
    errorMessage,
    helperText,
    ...other
  } = props

  let isFormError = false

  if (errors && Object.prototype.hasOwnProperty.call(errors, name)) {
    isFormError = true
  }

  console.log('errors', errors, isFormError)

  return (
    <FormControl invalid={Boolean(isFormError)}>
      <FormLabel>{placeholder || label}</FormLabel>
      <Input
        control={control}
        name={name}
        disabled={disabled}
        {...other}
      />

      {(helperText || (isFormError && errorMessage)) && (
        isFormError ?
          <FormErrorMessage>{label} is required</FormErrorMessage>
          : (
            <FormHelperText>
              {(isFormError && errorMessage)}
            </FormHelperText>
          )
      )}
    </FormControl>
  )
}

export default TextField
