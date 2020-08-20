import React from 'react';
import PermScanWifiTwoToneIcon from '@material-ui/icons/PermScanWifiTwoTone';

interface EventsLoadingErrorProps {
  message: string;
}

export const EventsLoadingError: React.FC<EventsLoadingErrorProps> = ({
  message,
}) => (
  <div className="eventsLoadingError">
    <PermScanWifiTwoToneIcon color="secondary" fontSize="large" />
    <h2>{message}</h2>
  </div>
);
