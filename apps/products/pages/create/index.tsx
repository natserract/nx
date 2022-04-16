import { NextPage } from "next";
import { useForm } from "react-hook-form";
import { useAddProductMutation } from "apps/products/redux/api/products";
import ProductForm from "apps/products/pieces/ProductForm";

const Create: NextPage = () => {
  const form = useForm({
    mode: 'onSubmit',
  })
  const [mutationFn] = useAddProductMutation()

  return (
    <div className="max-w-4xl mx-auto px-8 mb-10">
      <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl mb-7">
        <span className="block">Create Product</span>
      </h2>

      <ProductForm
        form={form}
        type="Create"
        mutationFn={mutationFn}
      />
    </div>
  )
}

export default Create
