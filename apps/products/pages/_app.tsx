/* eslint-disable @typescript-eslint/no-var-requires */
// https://github.com/reduxjs/redux-toolkit/issues/1240
import 'isomorphic-fetch'
import { default as AbortController } from "abort-controller"

Object.assign(globalThis, {
  AbortController,
});

import App from 'next/app';
import Head from 'next/head';
import 'tailwindcss/tailwind.css';
import './styles.css';

// Redux blocks
import { Provider } from 'react-redux'
import { store, wrapper } from '../redux/configureStore';

class MyApp extends App {
  static async getInitialProps({ Component, ctx }) {
    const pageProps = Component.getInitialProps ? await Component.getInitialProps(ctx) : {};

    // Anything returned here can be access by the client
    return { pageProps: pageProps };
  }

  render() {
    const { Component, pageProps } = this.props;

    return (
      <>
        <Head>
          <title>Welcome to products!</title>
        </Head>

        <Provider store={store}>
          <Component {...pageProps} />
        </Provider>
      </>
    );
  }
}

export default wrapper.withRedux(MyApp)
