/* eslint-disable react/react-in-jsx-scope */
import { ErrorBoundary, Provider } from '@rollbar/react';

export const RollbarProvider = ({ children }) => {
  const rollbarConfig = {
    accessToken: '81130914d102461986689fb582fe6111',
    captureUncaught: true,
    captureUnhandledRejections: true,
    environment: process.env.NEXT_PUBLIC_ROLLBAR_ENV,
    payload: {},
  };

  return (
    <Provider config={rollbarConfig}>
      <ErrorBoundary>{children}</ErrorBoundary>
    </Provider>
  );
};
