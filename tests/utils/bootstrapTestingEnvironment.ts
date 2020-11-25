import '@testing-library/jest-dom/extend-expect';

// mock hook for the notifications library
jest.mock('notistack', () => ({
  useSnackbar: () => ({ enqueueSnackbar: jest.fn() }),
}));
