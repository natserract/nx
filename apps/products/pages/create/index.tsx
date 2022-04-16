import { NextPage } from "next";
import { useForm } from "react-hook-form";
import { Button } from "@vechaiui/react"
import { InputBase as Input } from '@nx/components'
import TextField from 'apps/products/components/text-field'
import { useAddVariantGroupsMutation } from "apps/products/redux/api/products";

const Create: NextPage = () => {
  const { control, handleSubmit, formState: { errors } } = useForm({
    mode: 'onChange'
  });

  const [addVariantGroupMutation] = useAddVariantGroupsMutation()

  const onSubmit = async (data) => {
    try {
      const response = await addVariantGroupMutation({
        payload: {
          name: "Size2",
          description: "Item Size",
          product_variants: [
            {
              name: "Small"
            }
          ]
        }
      }).unwrap()
      console.log('response', response)
    } catch (err) {
      console.log(err)
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-8">
      <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl mb-7">
        <span className="block">Create Product</span>
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <TextField
          control={control}
          name='name'
          errors={errors}
          label="Name"
          placeholder="Enter your product name"
          required
        />

        <TextField
          control={control}
          name='brand'
          errors={errors}
          label="Brand"
          placeholder="Enter your product brand"
        />

        <TextField
          control={control}
          name='description'
          errors={errors}
          label="Description"
          placeholder="Enter your product description"
        />

        <Button
          size='xl'
          className="dark:bg-gray-800 dark:hover:bg-gray-700 float-right block cursor-pointer"
          style={{ marginTop: 25 }}
          type="submit"
        >
          Submit
        </Button>
      </form>
    </div>
  )
}

export default Create
