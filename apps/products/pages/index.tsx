import styles from './index.module.css';
import { useGetProductsQuery } from '../redux/api/products'
import { useEffect } from 'react';
import { InputBase } from '@nx/components'

export function Index() {
  const { data } = useGetProductsQuery()

  useEffect(() => {
    console.log('data', data)
  }, [data])

  return (
    <div className={styles.page}>
      <div>
        <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
          <span className="block">Ready to dive in?</span>
          <span className="block text-indigo-600">
            Start your free trial today.
            <InputBase />
          </span>
        </h2>
      </div>
    </div>
  );
}

export default Index;
