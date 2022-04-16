import clsx from 'clsx';
import Link from 'next/link';
import React from 'react';
import { HTMLElementT, MouseEventT } from 'apps/products/interfaces/share';
import { styles } from './styles'

type CardProps = {
  title: string;
  description: string;
  price: string;
  link: string;
  btnText: string;
  btnClick?: (e: MouseEventT<HTMLButtonElement>) => void;
} & Partial<HTMLElementT<HTMLDivElement>>

const Card = React.forwardRef<HTMLDivElement, CardProps>(function Card(props, ref) {
  const {
    link,
    title,
    description,
    price,
    btnText,
    btnClick,
    className,
    ...other
  } = props

  return (
    <div
      ref={ref}
      className={clsx(className, styles.container)}
      {...other}
    >
      <div className="w-full p-4">
        <Link href={link}>
          <a children={
            <h2 className="text-gray-900 font-bold text-2xl">
              {title}
            </h2>
          } />
        </Link>

        <p className="mt-2 text-gray-600 text-sm">
          {description}
        </p>
        <div className="flex item-center justify-between mt-3">
          <h3 className="text-gray-700 font-bold text-xl">
            {price}
          </h3>

          <button
            onClick={btnClick}
            className="px-3 py-2 bg-gray-800 text-white text-xs font-bold uppercase rounded"
          >
            {btnText}
          </button>
        </div>
      </div>
    </div>
  )
})

export default Card
