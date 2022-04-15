import { AppProps } from 'next/app';
import { SnackbarProvider } from 'notistack';

// custom shared styles
import '../styles/app.css';
import '../styles/components.css';

import { ReactText, StrictMode } from 'react';
import { Provider } from 'react-redux';
import { store } from '../store';
import React from 'react';
import { Button, createTheme, ThemeProvider } from '@material-ui/core';
import { green, purple } from '@material-ui/core/colors';

const customTheme = createTheme({
  palette: {
    primary: {
      main: purple[500],
    },
    secondary: {
      main: green[500],
    },
  },
});

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
        <ThemeProvider theme={customTheme}>
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
        </ThemeProvider>
      </Provider>
    </StrictMode>
  );
};

export default AppRoot;
