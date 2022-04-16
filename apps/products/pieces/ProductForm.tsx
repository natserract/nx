import { Any } from "@nx/components"
import { MutationDefinition, BaseQueryFn, FetchArgs, FetchBaseQueryError, FetchBaseQueryMeta } from "@reduxjs/toolkit/dist/query"
import { MutationTrigger } from "@reduxjs/toolkit/dist/query/react/buildHooks"
import { Button, Checkbox, useNotification } from "@vechaiui/react"
import { useRouter } from "next/router"
import { useState, useCallback, useEffect } from "react"
import { useFieldArray, UseFormReturn } from "react-hook-form"
import TextField from "../components/text-field"
import { ProductItem, ProductsPayloadT } from "../redux/api/products/types"
import { convertIntObj } from "../utils/array"

type ProductFormProps = {
  form: UseFormReturn<Any, Any>
  mutationFn: MutationTrigger<MutationDefinition<{ payload: ProductsPayloadT; }, BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError, {}, FetchBaseQueryMeta>, "Products" | "ProductsVariants", string, "productApp">>
  type: "Create" | "Update"
}

const ProductForm: React.FC<ProductFormProps> = (props) => {
  const { form, mutationFn, type: actionType } = props

  const { control, handleSubmit, formState: { errors }, reset } = form
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

  // Debug values
  // console.log('watch', watch())

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
      const response = await mutationFn({
        payload: {
          ...payload
        }
      }).unwrap()
      console.log('response', response)

      if (response) {
        notification({
          title: `${actionType} Product`,
          description: `Data successfully ${actionType == 'Create' ? 'added' : 'updated'}`,
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
      console.error(err)
      notification({
        title: `${actionType} Product`,
        description: err,
        status: 'error',
        position: "top",
        duration: 1000,
      });
    }
  };

  return (
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
  )
}

export default ProductForm
