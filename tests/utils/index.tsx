import { render, RenderOptions } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React, { ReactElement } from 'react';
import { AppState } from '../../store';
import reduxMockStore, { MockStoreEnhanced } from 'redux-mock-store';
import { Provider } from 'react-redux';
import { baseState } from '../mocks/baseState';

interface CustomRenderOptions extends RenderOptions {
  state?: Partial<AppState>;
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
function renderWithProviders(
  children: ReactElement,
  { state = {}, ...options }: CustomRenderOptions = {},
) {
  const mockStore = reduxMockStore<AppState>();
  const store: MockStoreEnhanced<AppState> = mockStore({
    ...baseState,
    ...state,
  });

  // this allows us to spy on dispatch
  store.dispatch = jest.fn(store.dispatch);

  const view = render(<Provider store={store}>{children}</Provider>, {
    ...options,
  });

  return { store, ...view };
}

export * from '@testing-library/react';

export { renderWithProviders as render, userEvent };
