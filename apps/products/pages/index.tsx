import styles from './index.module.css';
import { getProducts, getRunningOperationPromisesProduct } from '../redux/api/products'
import { useForm } from 'react-hook-form'
import { useAppSelector, wrapper } from '../redux/configureStore';
import Card from '../components/card';
import React from 'react';
import { ProductsPayloadT } from '../redux/api/products/types';
import { useRouter } from 'next/router'
import { stringToSlug } from '../utils/string';

type Props = {
  products: {
    data: ProductsPayloadT[]
  }
}

export function IndexPage(props: Props) {
  const { data } = props.products

  const router = useRouter()

  const { control } = useForm()
  const state = useAppSelector(state => state.productApp.queries)

  const renderProducts = () => {
    const navigateProduct =
      (url: string, id: string | number) => router.push(`${url}/${id}`)

    if (!data.length) return <React.Fragment />

    return data.map((product) => {
      const id = product.id
      const slug = stringToSlug(product.name)

      return (
        <Card
          key={product.id}
          link={`/product/${id}`}
          title={`${product.name}, ${product.brand}`}
          description={product.description}
          btnText="Edit Product"
          btnClick={() =>
            navigateProduct(`/product/edit`, id)
          }
          price='$220'
        // ^ Todo price (static), soon reduced as a total price
        />
      )
    })
  }

  return (
    <div className={styles.page}>
      <div>
        <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl mb-7">
          <span className="block">Product Lists</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {renderProducts()}
        </div>
      </div>
    </div>
  );
}

export const getStaticProps = wrapper.getStaticProps(store => async (context) => {
  const response = await store.dispatch(getProducts.initiate())
  await Promise.all(getRunningOperationPromisesProduct())

  return {
    props: {
      products: {
        data: response.data.products || []
      }
    },
    revalidate: 1
  }
})

export default IndexPage
