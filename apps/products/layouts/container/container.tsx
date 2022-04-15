import React, { ReactNode } from 'react';
import Header from '../header/header';

/* eslint-disable-next-line */
export interface ContainerProps {
  children: ReactNode;
}

export function Container(props: ContainerProps) {
  return (
    <React.Fragment>
      <Header />

      <div className="max-w-7xl mx-auto px-8 mt-10">
        {props.children}
      </div>
    </React.Fragment>
  );
}

export default Container;
