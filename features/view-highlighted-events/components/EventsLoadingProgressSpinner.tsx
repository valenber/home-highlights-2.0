import { ProgressSpinner } from 'primereact/progressspinner';
import React from 'react';

export const EventsLoadingProgressSpinner: React.FC = () => (
  <div className="eventsLoadingProgressSpinner">
    <ProgressSpinner strokeWidth="4" />
    <p>Loading events...</p>
  </div>
);
