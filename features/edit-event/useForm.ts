import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { AgendaEvent, AgendaEventCategory } from '../../data/dbSchema';
import { updateEventProps, createNewEvent } from '../../services/api';
import { useAppDispatch } from '../../store';
import { patchEvent, addEvent } from '../../store/eventsSlice';
import { selectEventToEdit } from '../../store/editorSlice';

interface UseFormReturnObject {
  values: Partial<AgendaEvent>;
  handleInputChange: (data: unknown) => void;
  handleFormSubmit: (event: FormEvent) => void;
  deleteEventCategory: (category: AgendaEventCategory) => void;
}

export const useForm = (
  initialValues: Partial<AgendaEvent> | false,
): UseFormReturnObject => {
  const [values, setValues] = useState<Partial<AgendaEvent>>();
  const dispatch = useAppDispatch();

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
      return;
    }

    if (event) {
      dispatch(patchEvent(event));
      dispatch(selectEventToEdit(false));
      return;
    }
  };

  const createNewAgendaEvent = async (
    eventObject: Partial<AgendaEvent>,
  ): Promise<void> => {
    const { event, error } = await createNewEvent(eventObject);
    if (error) {
      console.error(error);
      return;
    }

    if (event) {
      dispatch(addEvent(event));
      dispatch(selectEventToEdit(false));
      return;
    }
  };

  const handleFormSubmit = (event: FormEvent): void => {
    event.preventDefault();

    if (values.id) {
      updateExistingAgendaEvent(values);
    } else {
      createNewAgendaEvent(values);
    }
  };

  const deleteEventCategory = (category: AgendaEventCategory): void => {
    const { [category]: removeThis, ...remainingState } = values.state;
    setValues({
      ...values,
      state: { ...remainingState },
    });
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

    if (!['name', 'start', 'end'].includes(name)) {
      setValues({ ...values, state: { ...values.state, [name]: value } });
      return;
    }

    setValues({ ...values, [name]: value });
  };

  return {
    values,
    handleInputChange,
    handleFormSubmit,
    deleteEventCategory,
  };
};
