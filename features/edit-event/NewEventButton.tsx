import React from 'react';
import { Button, Box } from '@material-ui/core';
import { useAppDispatch } from '../../store';
import { selectEventToEdit } from '../../store/editorSlice';

export const NewEventButton: React.FC = () => {
  const dispatch = useAppDispatch();

  function handleButtonClick(): void {
    dispatch(selectEventToEdit(null));
  }

  return (
    <Box className="newEventButton">
      <Button
        onClick={handleButtonClick}
        variant="contained"
        color="secondary"
        size="large"
      >
        Add Event
      </Button>
    </Box>
  );
};
