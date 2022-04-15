import React, { ReactNode } from 'react';
import Header from '../header/header';
import styles from './container.module.scss';

/* eslint-disable-next-line */
export interface ContainerProps {
  children: ReactNode;
}

export function Container(props: ContainerProps) {
  return (
    <React.Fragment>
      <Header />

      <div className={styles['container']}>
        <h1>Welcome to Container!</h1>
      </div>

      {props.children}
    </React.Fragment>
  );
}

export default Container;
