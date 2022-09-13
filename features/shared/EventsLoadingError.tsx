import React from 'react';
import PermScanWifiTwoToneIcon from '@mui/icons-material/PermScanWifiTwoTone';

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
