import React from 'react';

import { Chip } from '@material-ui/core';

import { getDaysTillDate } from '../event-expiration/helpers';

interface ExpirationChipProps {
  eventEndDate: string;
}

export const ExpirationChip: React.FC<ExpirationChipProps> = ({
  eventEndDate,
}) => {
  const daysCount = getDaysTillDate(eventEndDate);

  const chipLabel =
    daysCount === 0
      ? 'expires today'
      : daysCount === 1
      ? 'expires in 1 day'
      : `expires in ${daysCount} days`;

  return (
    <>
      <Chip
        className="expirationChip expireSoonWarningChip"
        label={chipLabel}
      />
    </>
  );
};
