import '@testing-library/jest-dom';

// mock hook for the notifications library
jest.mock('notistack', () => ({
  useSnackbar: () => ({ enqueueSnackbar: jest.fn() }),
}));
