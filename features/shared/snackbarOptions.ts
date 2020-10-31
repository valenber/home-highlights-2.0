import { VariantType } from 'notistack';

export const snackbarOptions = {
  success: {
    variant: 'success' as VariantType,
    autoHideDuration: 3500,
  },
  error: {
    variant: 'error' as VariantType,
    autoHideDuration: null,
  },
};
