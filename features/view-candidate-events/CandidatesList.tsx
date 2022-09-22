import React from 'react';
import { Chip, Typography, CardContent, Card } from '@mui/material';
import { getCandidatesForSelectedCategory } from './getCandidatesForSelectedCategory';
import { useSelector } from 'react-redux';
import { AgendaEvent } from '../../data/dbSchema';
import { byStartDateOldToNew, getFormattedEventDates } from '../shared/helpers';
import { EventButtonGroup } from '../edit-event/EventButtonGroup';
import { ExpirationChip } from '../shared/ExpirationChip';
import { getExpirationStatus } from '../event-expiration/helpers';
import { orange } from '@mui/material/colors';

export const CandidatesList: React.FC = () => {
  const categoryCandidates: AgendaEvent[] = useSelector(
    getCandidatesForSelectedCategory,
  );

  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  const sortedCategoryCandidates = categoryCandidates
    .sort(byStartDateOldToNew)
    .reduce((newList, event, idx, originalList) => {
      const previousEventStartDateMonth =
        idx === 0
          ? null
          : monthNames[new Date(originalList[idx - 1].start).getMonth()];

      const currentEventStartDateMonth =
        monthNames[new Date(event.start).getMonth()];

      if (previousEventStartDateMonth !== currentEventStartDateMonth) {
        newList.push(
          `${currentEventStartDateMonth} ${new Date(
            event.start,
          ).getFullYear()}`,
        );
      }

      newList.push(event);
      return newList;
    }, []);

  return (
    <div className="candidatesList">
      {sortedCategoryCandidates.map((event: AgendaEvent | string) => {
        if (typeof event === 'string') {
          return (
            <Typography
              className="monthSeparator"
              color="primary"
              variant="h6"
              component="h5"
              key={event}
            >
              {event}
            </Typography>
          );
        }

        const { startDate, endDate } = getFormattedEventDates(event);

        return (
          <Card
            className="eventCard"
            key={event.id}
            variant="elevation"
            data-expiration-status={getExpirationStatus({
              date: event.end,
              threshold: 14,
            })}
          >
            {getExpirationStatus({ date: event.end, threshold: 14 }) ===
              'expiring-soon' && <ExpirationChip eventEndDate={event.end} />}
            <CardContent>
              <Typography color="textSecondary" variant="body2" component="p">
                {startDate !== endDate ? `${startDate} - ${endDate}` : endDate}
              </Typography>

              <Typography gutterBottom variant="body1" component="h5">
                {event.name}
              </Typography>

              <div className="tagList">
                {event?.tags &&
                  event.tags.map((tag) => (
                    <Chip
                      key={tag}
                      label={tag}
                      style={{
                        backgroundColor: orange[700],
                        color: orange[50],
                      }}
                    />
                  ))}
              </div>
              <EventButtonGroup existingEvent={event} />
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
