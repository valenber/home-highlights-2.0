import React from 'react';
import { ButtonGroup, IconButton } from '@material-ui/core';
import StarIcon from '@material-ui/icons/Star';
import StarBorderIcon from '@material-ui/icons/StarBorder';
import StarsIcon from '@material-ui/icons/Stars';
import EditIcon from '@material-ui/icons/Edit';
import { AgendaEvent } from '../../data/dbSchema';
import { useSelector } from 'react-redux';
import { getSelectedCategory } from './getSelectedCategory';
import { updateEventProps } from '../../services/api';
import { patchEvent } from '../../store/eventsSlice';
import { useAppDispatch } from '../../store';
import { selectEventToEdit } from '../../store/editorSlice';

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
      return;
    }

    if (event) {
      dispatch(patchEvent(event));
      return;
    }
  }

  function handleEditButtonClick(): void {
    dispatch(selectEventToEdit(id));
  }

  return (
    <ButtonGroup className="cardControls">
      <IconButton onClick={handlePromoteButtonClick}>
        <StateButton />
      </IconButton>
      <IconButton onClick={handleEditButtonClick}>
        <EditIcon color="primary" />
      </IconButton>
    </ButtonGroup>
  );
};
