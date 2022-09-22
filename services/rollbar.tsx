/* eslint-disable react/react-in-jsx-scope */
import { ErrorBoundary, Provider } from '@rollbar/react';
import Rollbar from 'rollbar';

export const rollbarConfig = {
  accessToken: '81130914d102461986689fb582fe6111',
  captureUncaught: true,
  captureUnhandledRejections: true,
  environment: process.env.NEXT_PUBLIC_ROLLBAR_ENV,
  payload: {},
};

export const rollbarReporter = new Rollbar(rollbarConfig);

export const RollbarProvider = ({ children }) => {
  return (
    <Provider config={rollbarConfig}>
      <ErrorBoundary>{children}</ErrorBoundary>
    </Provider>
  );
};
