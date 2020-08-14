/* NextJS page */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable react/display-name */

import { AppProps } from 'next/app';

// custom shared styles
import '../styles/app.css';
import '../styles/components.css';

import { StrictMode } from 'react';
import { Provider } from 'react-redux';
import { store } from '../store';

const AppRoot = ({ Component, pageProps }: AppProps) => {
  return (
    <StrictMode>
      <Provider store={store}>
        <div className="appLayout">
          <Component {...pageProps} />
        </div>
      </Provider>
    </StrictMode>
  );
};

export default AppRoot;
