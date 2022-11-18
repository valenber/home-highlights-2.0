import { AppProps } from 'next/app';
import { SnackbarKey, SnackbarProvider } from 'notistack';

// custom shared styles
import '../styles/app.css';
import '../styles/components.css';

import { StrictMode } from 'react';
import { Provider } from 'react-redux';
import { store } from '../store';
import React from 'react';
import {
  Button,
  createTheme,
  ThemeProvider,
  // Theme,
  StyledEngineProvider,
} from '@mui/material';
import { green, purple } from '@mui/material/colors';
import { RollbarProvider } from 'services/rollbar';

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
  const notistackRef = React.createRef<SnackbarProvider>();
  const onClickDismiss = (key: SnackbarKey) => () => {
    notistackRef.current.closeSnackbar(key);
  };

  return (
    <StrictMode>
      <RollbarProvider>
        <Provider store={store}>
          <StyledEngineProvider injectFirst>
            <ThemeProvider theme={customTheme}>
              <SnackbarProvider
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
          </StyledEngineProvider>
        </Provider>
      </RollbarProvider>
    </StrictMode>
  );
};

export default AppRoot;
