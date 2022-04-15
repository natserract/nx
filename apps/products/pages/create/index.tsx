import { NextPage } from "next";
import { useForm } from "react-hook-form";
import { FormControl, FormLabel, FormHelperText, FormErrorMessage, } from "@vechaiui/react"
import { InputBase as Input } from '@nx/components'
import TextField from '../../components/text-field'


const Create: NextPage = () => {
  const { control, handleSubmit, formState: { errors } } = useForm({
    mode: 'onChange'
  });

  const onSubmit = async (data) => {
    //
  };

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* <FormControl invalid={Boolean(errors.username)}>
          <FormLabel>Username</FormLabel>
          <Input control={control} required name='username' placeholder="Enter your username." />
          {errors.username && errors.username.type === "required" && <FormErrorMessage>Username is required</FormErrorMessage>}
        </FormControl> */}
        <TextField
          control={control}
          name='input'
          errors={errors}
          label="Input"
          placeholder="Enter your input."
          errorMessage="Field is Required"
          required
        />

      </form>
    </div>
  )
}

export default Create
