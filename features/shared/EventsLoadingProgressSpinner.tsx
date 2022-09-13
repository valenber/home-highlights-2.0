import React from 'react';
import { CircularProgress, Typography } from '@mui/material';

export const EventsLoadingProgressSpinner: React.FC = () => (
  <div className="eventsLoadingProgressSpinner">
    <CircularProgress size={128} color="secondary" />
    <Typography gutterBottom color="primary" variant="h4" component="p">
      Loading events...
    </Typography>
  </div>
);
