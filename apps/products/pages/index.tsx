import styles from './index.module.css';
import { getRunningOperationPromisesProduct, productApi } from '../redux/api/products'
import { useEffect } from 'react';
import { InputBase } from '@nx/components'
import { useForm } from 'react-hook-form'
import { AppState, useAppSelector, wrapper } from '../redux/configureStore';
import { connect } from 'react-redux';

export function Index(props) {
  // const { data } = useGetProductsQuery()
  const { control } = useForm()
  const state = useAppSelector(state => state.productApp.queries)

  // useEffect(() => {
  //   console.log('data', data)
  // }, [data])


  return (
    <div className={styles.page}>
      <div>
        <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
          <span className="block">Ready to dive in?</span>
          <span className="block text-indigo-600">
            Start your free trial today.
            <InputBase control={control} name='Text' />

          </span>
        </h2>
        {JSON.stringify(props)}
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
