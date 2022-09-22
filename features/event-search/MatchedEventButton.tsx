import { Button } from '@mui/material';
import React, { FC } from 'react';
import { useAppDispatch } from 'store';
import { selectEventToEdit } from 'store/editorSlice';
import { SearchResult } from './eventsMatcher';

export const MatchedEventButton: FC<{ event: SearchResult }> = ({ event }) => {
  const dispatch = useAppDispatch();

  function editMatchedEvent() {
    dispatch(selectEventToEdit(event.id));
  }

  return (
    <Button variant="outlined" size="small" onClick={editMatchedEvent}>
      {event.name}
    </Button>
  );
};
