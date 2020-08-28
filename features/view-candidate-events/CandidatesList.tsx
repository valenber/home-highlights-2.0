import React from 'react';
import { Typography, CardContent, Card } from '@material-ui/core';
import { getCandidatesForSelectedCategory } from './getCandidatesForSelectedCategory';
import { useSelector } from 'react-redux';
import { AgendaEvent } from '../../data/dbSchema';
import { dateFormat, byEndDateOldToNew } from '../shared/helpers';
import { EventButtonGroup } from '../edit-event/eventButtonGroup';

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
    .sort(byEndDateOldToNew)
    .reduce((newList, event, idx, originalList) => {
      const previousEventEndDateMonth =
        idx === 0
          ? null
          : monthNames[new Date(originalList[idx - 1].end).getMonth()];

      const currentEventEndDateMonth =
        monthNames[new Date(event.end).getMonth()];

      if (previousEventEndDateMonth !== currentEventEndDateMonth) {
        newList.push(
          `${currentEventEndDateMonth} ${new Date(event.end).getFullYear()}`,
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

        const formattedEndDate = dateFormat.format(new Date(event.end));

        return (
          <Card className="eventCard" key={event.id} variant="elevation">
            <CardContent>
              <Typography color="textSecondary" variant="body2" component="p">
                {formattedEndDate}
              </Typography>

              <Typography gutterBottom variant="body1" component="h5">
                {event.name}
              </Typography>
              <EventButtonGroup event={event} />
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
