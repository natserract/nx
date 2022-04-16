import { NextPage } from "next";
import { useFieldArray, useForm } from "react-hook-form";
import { Button, Checkbox } from "@vechaiui/react"
import TextField from 'apps/products/components/text-field'
import { useAddProductMutation } from "apps/products/redux/api/products";
import { useCallback, useEffect, useState } from "react";
import { convertIntObj } from "apps/products/utils/array";
import { ProductItem, ProductsPayloadT } from "apps/products/redux/api/products/types";
import { useNotification } from "@vechaiui/react"
import { useRouter } from "next/router";

const Create: NextPage = () => {
  const { control, watch, handleSubmit, formState: { errors }, reset } = useForm({
    mode: 'onSubmit'
  });
  const {
    fields,
    append,
    remove,
  } = useFieldArray({
    name: 'product_items',
    control,
  })

  const [numberOfItems, setNumberOfItems] = useState(1)

  const router = useRouter()
  const notification = useNotification();
  const [addProductMutation] = useAddProductMutation()

  const handleFormArray = useCallback(() => {
    const nextValue = numberOfItems;
    const prevValue = fields.length;

    if (nextValue > prevValue) {
      for (let i = prevValue; i < nextValue; i++) {
        append({
          is_active: true,
        });
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
            name={`product_items.${i}.retail_price`}
            errors={errors}
            label="Retail Price"
            type='number'
            placeholder="Enter retail price"
            required
          />

          <TextField
            control={control}
            name={`product_items.${i}.height_cm`}
            errors={errors}
            label="Height(cm)"
            type='number'
            placeholder="Enter height"
            required
          />

          <TextField
            control={control}
            name={`product_items.${i}.length_cm`}
            errors={errors}
            label="Length(cm)"
            type='number'
            placeholder="Enter length"
            required
          />

          <TextField
            control={control}
            name={`product_items.${i}.weight_kg`}
            errors={errors}
            label="Weight(kg)"
            type='number'
            placeholder="Enter weight"
            required
          />

          <TextField
            control={control}
            name={`product_items.${i}.width_cm`}
            errors={errors}
            label="Width(cm)"
            type='number'
            placeholder="Enter width"
            required
          />

          <TextField
            required
            control={control}
            name={`product_items.${i}.product_variant_ids`}
            errors={errors}
            label="Variant"
            customRenderInput={(field) => (
              <Checkbox.Group
                inline
                className={`space-x-4`}
              >
                <Checkbox value="1" color="default">Small</Checkbox>
                <Checkbox value="2" color="default">Medium</Checkbox>
                <Checkbox value="3" color="default">Large</Checkbox>
              </Checkbox.Group>
            )}
          />
        </div>
      </div>
    ))
  }

  const onSubmit = async (data: ProductsPayloadT) => {
    const productItems = [
      ...Object.values(convertIntObj(data.product_items)) as ProductItem[],
    ]
    const payload = {
      ...data,
      product_items: productItems,
      product_variant_group_ids: [1]
    }

    try {
      const response = await addProductMutation({
        payload: {
          ...payload
        }
      }).unwrap()
      console.log('response', response)

      if (response) {
        notification({
          title: "Create Product",
          description: "Data successfully added",
          status: 'success',
          position: "top",
          duration: 1000,
        });

        setTimeout(() => {
          reset()
          router.push('/')
        }, 1100)
      }
    } catch (err) {
      console.log(err)
    }
  };

  // Debug for values
  // console.log('watch', watch())

  return (
    <div className="max-w-4xl mx-auto px-8 mb-10">
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
            Add More Items
          </Button>
        </div>

        <div className="flex justify-end mb-10">
          <Button
            size='xl'
            className="dark:bg-gray-800 dark:hover:bg-gray-700 block cursor-pointer"
            type="submit"
          >
            Submit
          </Button>
        </div>
      </form>
    </div>
  )
}

export default Create
