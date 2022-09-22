import { Chip } from '@mui/material';
import React, { FC } from 'react';
import { SearchResult } from './eventsMatcher';

export const MatchedEventButton: FC<{ event: SearchResult }> = ({ event }) => {
  return <Chip label={event.name} variant="outlined" size="small" />;
};
