import styles from './index.module.css';
import { getRunningOperationPromisesProduct, productApi } from '../redux/api/products'
import { useEffect } from 'react';
import { InputBase } from '@nx/components'
import { useForm } from 'react-hook-form'
import { useAppSelector, wrapper } from '../redux/configureStore';
import Card from '../components/card';


export function Index(props) {
  // const { data } = useGetProductsQuery()
  const { control } = useForm()
  const state = useAppSelector(state => state.productApp.queries)

  return (
    <div className={styles.page}>
      <div>
        <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl mb-7">
          <span className="block">Product Lists</span>
        </h2>

        <Card />
      </div>
    </div>
  );
}

export const getStaticProps = wrapper.getStaticProps(store => async (context) => {
  console.log('store state on the server before dispatch', store.getState());

  const response = await store.dispatch(productApi.endpoints.getProducts.initiate())
  await Promise.all(getRunningOperationPromisesProduct())

  return {
    props: {
      products: response.data || []
    },
    revalidate: 1
  }
})

export default Index
