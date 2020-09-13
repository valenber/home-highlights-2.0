import React from 'react';

import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { Chip } from '@material-ui/core';
dayjs.extend(relativeTime);

import utc from 'dayjs/plugin/utc'; // dependent on utc plugin
import timezone from 'dayjs/plugin/timezone';
dayjs.extend(utc);
dayjs.extend(timezone);

const tzMadrid = 'EUROPE/MADRID';

interface ExpirationChipProps {
  eventEndDate: string;
}
export const ExpirationChip: React.FC<ExpirationChipProps> = ({
  eventEndDate,
}) => {
  const today = dayjs(new Date(), tzMadrid);
  const endDate = dayjs(eventEndDate, tzMadrid);

  const daysDiff = dayjs.tz(eventEndDate, tzMadrid).diff(dayjs(), 'd');
  const hoursDiff = endDate.diff(today, 'h');

  const debug = false;

  if (hoursDiff > 0 && hoursDiff <= 23) {
    return (
      <>
        <Chip
          className="expirationChip expireSoonWarningChip"
          label="expires today"
        />
        {debug && hoursDiff}
      </>
    );
  }

  if (hoursDiff > 23 && hoursDiff < 240) {
    return (
      <>
        <Chip
          className="expirationChip expireSoonWarningChip"
          label={`expires ${dayjs().to(dayjs.tz(eventEndDate, tzMadrid))}`}
        />
        {debug && hoursDiff}
      </>
    );
  }

  if (daysDiff < 0) {
    return (
      <>
        <Chip
          className="expirationChip expiredWarningChip"
          label={`expired ${dayjs.tz(eventEndDate, tzMadrid).fromNow()}`}
        />
        {debug && hoursDiff}
      </>
    );
  }

  return null;
};
