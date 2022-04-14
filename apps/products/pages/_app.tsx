import { AppProps } from 'next/app';
import Head from 'next/head';
import 'tailwindcss/tailwind.css';
import './styles.css';

// Redux blocks
import { Provider } from 'react-redux'
import { store } from '../redux/configureStore';

function CustomApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Welcome to products!</title>
      </Head>

      <Provider store={store}>
        <main className="app">
          <Component {...pageProps} />
        </main>
      </Provider>
    </>
  );
}

export default CustomApp;
