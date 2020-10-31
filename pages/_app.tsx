/* NextJS page */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable react/display-name */

import { AppProps } from 'next/app';
import { SnackbarProvider } from 'notistack';

// custom shared styles
import '../styles/app.css';
import '../styles/components.css';

import { ReactText, StrictMode } from 'react';
import { Provider } from 'react-redux';
import { store } from '../store';
import React from 'react';
import { Button } from '@material-ui/core';

const AppRoot: React.FC<AppProps> = ({ Component, pageProps }) => {
  const notistackRef = React.createRef();
  const onClickDismiss = (key: ReactText) => () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    notistackRef.current.closeSnackbar(key);
  };

  return (
    <StrictMode>
      <Provider store={store}>
        <SnackbarProvider
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          ref={notistackRef}
          maxSnack={3}
          action={(key) => (
            <Button
              size="small"
              variant="outlined"
              onClick={onClickDismiss(key)}
            >
              dismiss
            </Button>
          )}
        >
          <div className="appLayout">
            <Component {...pageProps} />
          </div>
        </SnackbarProvider>
      </Provider>
    </StrictMode>
  );
};

export default AppRoot;
