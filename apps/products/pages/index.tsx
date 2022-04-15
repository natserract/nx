import styles from './index.module.css';
import { getRunningOperationPromisesProduct, productApi } from '../redux/api/products'
import { useForm } from 'react-hook-form'
import { useAppSelector, wrapper } from '../redux/configureStore';
import Card from '../components/card';
import React from 'react';
import { ProductsPayloadT } from '../redux/api/products/types';
import { useRouter } from 'next/router'

type Props = {
  products: {
    data: {
      products: ProductsPayloadT[]
    }
  }
}

export function Index(props: Props) {
  const { products } = props.products.data

  const router = useRouter()

  const { control } = useForm()
  const state = useAppSelector(state => state.productApp.queries)

  const renderProducts = () => {
    const navigateProduct =
      (url: string, id: string | number) => router.push(`${url}/${id}`)

    if (!products.length) return <React.Fragment />

    return products.map((product) => (
      <Card
        key={product.id}
        link={`/product/${product.id}`}
        title={product.name}
        description={product.description}
        btnText="Edit Product"
        btnClick={() => navigateProduct(`/product/edit`, product.id)}
        price='$220'
      />
    ))
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
  const response = await store.dispatch(productApi.endpoints.getProducts.initiate())
  await Promise.all(getRunningOperationPromisesProduct())

  return {
    props: {
      products: {
        data: response.data || []
      }
    },
    revalidate: 1
  }
})

export default Index
