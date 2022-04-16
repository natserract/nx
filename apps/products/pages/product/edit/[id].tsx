import ProductForm from "apps/products/pieces/ProductForm";
import { getProduct, getRunningOperationPromisesProduct, useUpdateProductMutation } from "apps/products/redux/api";
import { ProductsPayloadT } from "apps/products/redux/api/products/types";
import { wrapper } from "apps/products/redux/configureStore";
import { NextPage } from "next";
import { useForm } from "react-hook-form";

type Props = {
  product: {
    data: ProductsPayloadT
  }
}

const EditProduct: NextPage = (props: Props) => {
  const { product } = props

  const { data } = product
  const { id, ...productData } = data

  const form = useForm({
    mode: 'onSubmit',
    defaultValues: {
      ...productData
    }
  })
  const [mutationFn] = useUpdateProductMutation()

  return (
    <div className="max-w-4xl mx-auto px-8 mb-10">
      <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl mb-7">
        <span className="block">Edit Product</span>
      </h2>

      <ProductForm
        form={form}
        type="Update"
        mutationFn={mutationFn}
        productId={id}
      />
    </div>
  )
}

export async function getStaticPaths() {
  return {
    paths: [
      {
        params: {
          id: ""
        }
      }
    ],
    fallback: "blocking",
  };
}

export const getStaticProps = wrapper.getServerSideProps(store => async ({ params }) => {
  const response = await store.dispatch(
    getProduct.initiate(params.id as string)
  )
  await Promise.all(getRunningOperationPromisesProduct())

  return {
    props: {
      product: {
        data: response.data.product || {}
      }
    },
    revalidate: 1,
  }
})

export default EditProduct
