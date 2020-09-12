import { useState, useEffect, ChangeEvent } from 'react';
import { AgendaEvent } from '../../data/dbSchema';

interface UseFormReturnObject {
  values: Partial<AgendaEvent>;
  handleInputChange: (data: unknown) => void;
}

export const useForm = (
  initialValues: Partial<AgendaEvent> | false,
): UseFormReturnObject => {
  const [values, setValues] = useState<Partial<AgendaEvent>>();

  useEffect(() => {
    if (initialValues !== false) {
      setValues(initialValues);
    }
  }, [initialValues]);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = event.target;
    console.log(name, value);

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
  };
};
