import { useSnackbar } from 'notistack';
import { useState, useEffect, ChangeEvent, FormEvent, FocusEvent } from 'react';
import { AgendaEvent, AgendaEventCategory } from '../../data/dbSchema';
import {
  updateEventProps,
  createNewEvent,
  deleteEvent,
} from '../../services/api';
import { useAppDispatch } from '../../store';
import { patchEvent, addEvent, removeEventById } from '../../store/eventsSlice';
import { selectEventToEdit } from '../../store/editorSlice';
import { snackbarOptions } from '../shared/snackbarOptions';

interface FormErrorsObject {
  name?: string;
  end?: string;
}

interface UseFormReturnObject {
  errors: FormErrorsObject;
  validateInput: (event: FocusEvent<HTMLInputElement>) => void;
  values: Partial<AgendaEvent>;
  handleInputChange: (data: unknown) => void;
  handleFormSubmit: (event: FormEvent) => void;
  deleteEventCategory: (category: AgendaEventCategory) => void;
  deleteSelectedAgendaEvent: () => void;
}

export const useForm = (
  initialValues: Partial<AgendaEvent> | false,
): UseFormReturnObject => {
  const [values, setValues] = useState<Partial<AgendaEvent>>();
  const [errors, setErrors] = useState<FormErrorsObject>({});
  const dispatch = useAppDispatch();
  const editedEventName = values?.name ?? 'UNKNOWN';
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    if (initialValues !== false) {
      setValues(initialValues);
    }
  }, [initialValues]);

  const updateExistingAgendaEvent = async (
    updateObject: Partial<AgendaEvent>,
  ): Promise<void> => {
    const { event, error } = await updateEventProps(updateObject);

    if (error) {
      console.error(error);

      enqueueSnackbar(`Failed to update event "${editedEventName}"`, {
        ...snackbarOptions.error,
      });
      return;
    }

    if (event) {
      dispatch(patchEvent(event));

      dispatch(selectEventToEdit(false));

      enqueueSnackbar(`Updated event "${event.name}"`, {
        ...snackbarOptions.success,
      });

      return;
    }
  };

  const createNewAgendaEvent = async (
    eventObject: Partial<AgendaEvent>,
  ): Promise<void> => {
    const { event, error } = await createNewEvent(eventObject);
    if (error) {
      console.error(error);

      enqueueSnackbar(`Failed to create new event "${editedEventName}"`, {
        ...snackbarOptions.error,
      });

      return;
    }

    if (event) {
      dispatch(addEvent(event));
      dispatch(selectEventToEdit(false));

      enqueueSnackbar(`Created new event "${event.name}"`, {
        ...snackbarOptions.success,
      });

      return;
    }
  };

  const deleteSelectedAgendaEvent = async (): Promise<void> => {
    if (!values.id) {
      dispatch(selectEventToEdit(false));
      return;
    }

    const { event, error } = await deleteEvent(values.id);

    if (error) {
      console.error(error);

      enqueueSnackbar(`Failed to delete "${editedEventName}" from the DB`, {
        ...snackbarOptions.error,
      });

      return;
    }

    if (event) {
      dispatch(selectEventToEdit(false));

      dispatch(removeEventById(event));

      enqueueSnackbar(`Deleted "${editedEventName}" from the DB`, {
        ...snackbarOptions.success,
      });

      return;
    }
  };

  const handleFormSubmit = (event: FormEvent): void => {
    event.preventDefault();
    if (!values.name || !values.end || Object.keys(errors).length) {
      return;
    }

    if (values.id) {
      updateExistingAgendaEvent(values);
    } else {
      createNewAgendaEvent(values);
    }
  };

  const deleteEventCategory = (category: AgendaEventCategory): void => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { [category]: removeThis, ...remainingState } = values.state;
    setValues({
      ...values,
      state: { ...remainingState },
    });
  };

  const validateInput = (event: FocusEvent<HTMLInputElement>): void => {
    const { name, value } = event.target;

    // name is required
    if (name === 'name' && !values?.name?.trim()?.length) {
      setErrors({ ...errors, [name]: 'An event must have a name' });
      return;
    }

    // end date is required
    if (name === 'end' && !value) {
      setErrors({ ...errors, [name]: 'An event must have an end date' });
      return;
    }

    // if input is valid clear its errors
    const {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      [name as keyof FormErrorsObject]: removeThis,
      ...remainingErrors
    } = errors;
    setErrors({ ...remainingErrors });
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = event.target;

    if (name === 'newCategory') {
      setValues({
        ...values,
        state: { ...values.state, [value]: 'candidate' },
      });

      return;
    }

    if (['start', 'end'].includes(name)) {
      setValues({ ...values, [name]: new Date(value).toISOString() });
      return;
    }

    if (!['name', 'start', 'end', 'tags'].includes(name)) {
      setValues({ ...values, state: { ...values.state, [name]: value } });
      return;
    }

    if (['tags'].includes(name)) {
      setValues({
        ...values,
        tags: value.length
          ? value.replace(/^\s+|\s+$|\s+(?=\s)/g, '').split(',')
          : null,
      });
      return;
    }

    setValues({ ...values, [name]: value });
  };

  return {
    values,
    validateInput,
    errors,
    handleInputChange,
    handleFormSubmit,
    deleteEventCategory,
    deleteSelectedAgendaEvent,
  };
};
