import React from 'react';
import { ButtonGroup, IconButton } from '@material-ui/core';
import StarIcon from '@material-ui/icons/Star';
import StarBorderIcon from '@material-ui/icons/StarBorder';
import StarsIcon from '@material-ui/icons/Stars';
import { AgendaEvent } from '../../data/dbSchema';
import { useSelector, useDispatch } from 'react-redux';
import { getSelectedCategory } from './getSelectedCategory';
import { updateEventProps } from '../../services/api';
import { patchEvent } from '../../store/eventsSlice';

interface EventButtonGroupProps {
  event: AgendaEvent;
}

/* 
[x] display correct star
on click

[x] prepare DB update objetc
[x] call endpoint to update DB
[ ] patch the store with new version of event */

export const EventButtonGroup: React.FC<EventButtonGroupProps> = ({
  event,
}) => {
  const dispatch = useDispatch();

  const selectedCategory = useSelector(getSelectedCategory);
  const eventStatus = event.state[selectedCategory];
  const { id } = event;

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

  async function handlePromoteButtonClic(): Promise<void> {
    const statusUpdateObject = {
      id: id,
      state: {
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

  return (
    <ButtonGroup className="cardControls">
      <IconButton onClick={handlePromoteButtonClic}>
        <StateButton />
      </IconButton>
    </ButtonGroup>
  );
};
