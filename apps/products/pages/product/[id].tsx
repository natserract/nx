import { getProduct, getRunningOperationPromisesProduct } from "apps/products/redux/api";
import { ProductsPayloadT } from "apps/products/redux/api/products/types";
import { wrapper } from "apps/products/redux/configureStore";
import { NextPage } from "next";
import { Tag, Button } from "@vechaiui/react"
import { useRouter } from "next/router";
import React from "react";
import { ConditionalRender } from "@nx/components"

type Props = {
  product: {
    data: ProductsPayloadT
  }
}

const ProductPage: NextPage = (props: Props) => {
  const { product } = props

  const router = useRouter()

  const { data } = product
  const { product_item, product_variant_groups } = data

  const handleClick = () => router.push(`/product/edit/${data.id}`)

  const renderVariantGroups = () => (
    <ConditionalRender
      items={product_variant_groups}
      RenderComponent={(items) => (
        <React.Fragment>
          {items.map(value => (
            <div className="ml-4" key={value.id}>
              <dt className="font-medium text-gray-900">
                {value.name}
              </dt>
              <dd className="mt-2 text-sm text-gray-500">{value.description}</dd>
            </div>
          ))}
        </React.Fragment>
      )
      }
    />
  )

  const renderDetailProduct = () => (
    <ConditionalRender
      items={product_item}
      RenderComponent={(items) => (
        <React.Fragment>
          {items
            .filter(value => value.product_id == data.id)
            .map((value) => (
              <li key={value.id} className="flex">
                <div className="ml-4 flex flex-1 flex-col">
                  <ol className="mt-2 text-sm text-gray-500">
                    <li className="mb-2">Retail Price: {value.retail_price}</li>
                    <li className="mb-2">Weight(kg): {value.weight_kg}</li>
                    <li className="mb-2">Length(cm): {value.length_cm}</li>
                    <li className="mb-2">Height(cm): {value.height_cm}</li>
                    <li>Width(cm): {value.width_cm}</li>
                  </ol>
                </div>

                <div className="ml-4 flex flex-1 flex-col">
                  <div>
                    <div className="flex justify-between text-base font-medium text-gray-900">
                      <h3 className="mb-1">Product Variants</h3>
                    </div>

                    {value.product_variants.map(variant => (
                      <Tag
                        className="mt-1 text-sm text-gray-900 mr-2"
                        key={variant.id}>
                        {variant.name}
                      </Tag>
                    ))}
                  </div>
                </div>
              </li>
            ))}
        </React.Fragment>
      )}
    />
  )

  return (
    <div className="max-w-4xl mx-auto px-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            {data.name}, {data.brand}
          </h1>
          <p className="mt-4 text-gray-500">
            {data.description}
          </p>
        </div>

        <div className="flex justify-end">
          <Button
            onClick={handleClick}
            className="text-gray-900 hover:text-slate-50 cursor-pointer dark:hover:bg-gray-700"
          >
            Edit Product
          </Button>
        </div>
      </div>

      <dl className="mt-5 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-1 sm:gap-y-16 lg:gap-x-8">
        <div className="border-t border-gray-200 pt-4">
          <h2 className="text-1xl font-extrabold tracking-tight text-gray-900 sm:text-2xl mb-5">Variant Groups</h2>
          {renderVariantGroups()}

          <div className="mt-10">
            <ul role="list">
              <h2 className="text-1xl font-extrabold text-gray-900 sm:text-2xl mb-5">Details</h2>
              {renderDetailProduct()}
            </ul>
          </div>
        </div>
      </dl>
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

export default ProductPage
