import { NextPage } from "next";
import { useFieldArray, useForm } from "react-hook-form";
import { Button, Checkbox } from "@vechaiui/react"
import { InputBase as Input } from '@nx/components'
import TextField from 'apps/products/components/text-field'
import { useAddVariantGroupsMutation } from "apps/products/redux/api/products";
import { useCallback, useEffect, useState } from "react";

const Create: NextPage = () => {
  const { control, watch, handleSubmit, formState: { errors } } = useForm({
    mode: 'onChange'
  });
  const {
    fields,
    append,
    remove,
  } = useFieldArray({
    name: 'productItems',
    control,
  })

  const [numberOfItems, setNumberOfItems] = useState(1)

  const [addVariantGroupMutation] = useAddVariantGroupsMutation()

  const handleFormArray = useCallback(() => {
    const nextValue = numberOfItems;
    const prevValue = fields.length;

    if (nextValue > prevValue) {
      for (let i = prevValue; i < nextValue; i++) {
        append({ name: '', email: '' });
      }
    } else {
      for (let i = prevValue; i > nextValue; i--) {
        remove(i - 1);
      }
    }
  }, [append, fields.length, numberOfItems, remove])

  useEffect(handleFormArray, [handleFormArray]);

  const renderFormProductItems = () => {
    return fields.map((item, i) => (
      <div key={i} className="border border-neutral-600 p-7 mb-5">
        <div className="list-group-item space-y-4">
          <h5 className="italic mb-2">Product Item #{i + 1}</h5>

          <TextField
            control={control}
            name={`retail_price${i}`}
            errors={errors}
            label="Retail Price"
            type='number'
            placeholder="Enter retail price"
            required
          />

          <TextField
            control={control}
            name={`height_cm${i}`}
            errors={errors}
            label="Height(cm)"
            type='number'
            placeholder="Enter height"
            required
          />

          <TextField
            control={control}
            name={`length_cm${i}`}
            errors={errors}
            label="Length(cm)"
            type='number'
            placeholder="Enter length"
            required
          />

          <TextField
            control={control}
            name={`weight_kg${i}`}
            errors={errors}
            label="Weight(kg)"
            type='number'
            placeholder="Enter weight"
            required
          />

          <TextField
            control={control}
            name={`width_cm${i}`}
            errors={errors}
            label="Width(cm)"
            type='number'
            placeholder="Enter width"
            required
          />

          <TextField
            control={control}
            name={`size${i}`}
            errors={errors}
            label="Variant"
            customRenderInput={(field) => (
              <Checkbox.Group
                inline
                className={`space-x-4`}
                defaultValue={["1"]}
              >
                <Checkbox required value="1" color="default">Small</Checkbox>
                <Checkbox value="2" color="default">Medium</Checkbox>
                <Checkbox value="3" color="default">Large</Checkbox>
              </Checkbox.Group>
            )}
          />
        </div>
      </div>
    ))
  }

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

  console.log('watch', watch())

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

        <div className="block">
          <h3 className="text-2xl font-extrabold tracking-tight text-gray-900 mt-7 mb-3">
            <span className="block">Product Item</span>
          </h3>
          {renderFormProductItems()}
          <Button
            size='md'
            onClick={() => setNumberOfItems(value => value + 1)}
            className="text-gray-900 hover:text-slate-50 dark:hover:bg-gray-700 cursor-pointer"
          >
            Add more product item
          </Button>
        </div>

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
