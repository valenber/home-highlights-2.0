import React from 'react';
import { Button, ButtonGroup } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import StarsIcon from '@mui/icons-material/Stars';
import EditIcon from '@mui/icons-material/Edit';
import { AgendaEvent } from '../../data/dbSchema';
import { useSelector } from 'react-redux';
import { getSelectedCategory } from './getSelectedCategory';
import { useSnackbar } from 'notistack';
import { updateEventProps } from '../../services/api';
import { patchEvent } from '../../store/eventsSlice';
import { useAppDispatch } from '../../store';
import { selectEventToEdit } from '../../store/editorSlice';
import { snackbarOptions } from '../shared/snackbarOptions';

interface EventButtonGroupProps {
  existingEvent: AgendaEvent;
}

export const EventButtonGroup: React.FC<EventButtonGroupProps> = ({
  existingEvent,
}) => {
  const dispatch = useAppDispatch();

  const selectedCategory = useSelector(getSelectedCategory);
  const eventStatus = existingEvent.state[selectedCategory];
  const { id } = existingEvent;

  const editedEventName = existingEvent?.name ?? 'UNKNOWN';
  const { enqueueSnackbar } = useSnackbar();

  const stateIconMap = {
    candidate: <StarBorderIcon color="primary" />,
    highlight: <StarIcon color="primary" />,
    mainfocus: <StarsIcon color="primary" />,
  };

  const StateButton = (): React.ReactElement => stateIconMap[eventStatus];

  const nextStatusMap = {
    candidate: 'highlight',
    highlight: 'mainfocus',
    mainfocus: 'candidate',
  };

  async function handlePromoteButtonClick(): Promise<void> {
    const statusUpdateObject = {
      ...existingEvent,
      state: {
        ...existingEvent.state,
        [selectedCategory]: nextStatusMap[eventStatus],
      },
    };

    const { event, error } = await updateEventProps(statusUpdateObject);

    if (error) {
      console.error(error);

      enqueueSnackbar(`Failed to change status of "${editedEventName}"`, {
        ...snackbarOptions.error,
      });
      return;
    }

    if (event) {
      dispatch(patchEvent(event));

      enqueueSnackbar(`Changed status of "${editedEventName}"`, {
        ...snackbarOptions.success,
      });
      return;
    }
  }

  function handleEditButtonClick(): void {
    dispatch(selectEventToEdit(id));
  }

  return (
    <ButtonGroup className="cardControls" variant="text">
      <Button onClick={handlePromoteButtonClick} aria-label="promote event">
        <StateButton />
      </Button>

      <Button
        onClick={handleEditButtonClick}
        aria-label="edit event"
        variant="text"
      >
        <EditIcon color="primary" />
      </Button>
    </ButtonGroup>
  );
};
