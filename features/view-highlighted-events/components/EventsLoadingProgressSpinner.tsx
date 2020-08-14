import React from 'react';
import { CircularProgress } from '@material-ui/core';

export const EventsLoadingProgressSpinner: React.FC = () => (
  <div className="eventsLoadingProgressSpinner">
    <CircularProgress size={128} color="secondary" />
    <p>Loading events...</p>
  </div>
);
