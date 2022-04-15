import { getRunningOperationPromisesProduct, productApi } from "apps/products/redux/api";
import { ProductsPayloadT } from "apps/products/redux/api/products/types";
import { wrapper } from "apps/products/redux/configureStore";
import { NextPage } from "next";

type Props = {
  product: {
    data: ProductsPayloadT
  }
}

const ProductPage: NextPage = (props: Props) => {
  return (
    <div className="max-w-4xl mx-auto px-8">
      <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl mb-7">
        <span className="block">Product Detail</span>
      </h2>

      {JSON.stringify(props)}
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
    productApi.endpoints.getProduct.initiate(params.id as string)
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

export default ProductPage
