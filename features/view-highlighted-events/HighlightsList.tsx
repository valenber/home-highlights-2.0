import React from 'react';
import { useSelector } from 'react-redux';

import { Card, Typography, Box } from '@material-ui/core';

import { AgendaEvent } from '../../data/dbSchema';
import { getHighlightsForSelectedCategory } from './getHighlightsForSelectedCategory';
import { getSelectedCategory } from '../edit-event/getSelectedCategory';
import { dateFormat, byEndDateOldToNew } from '../shared/helpers';

import { ExpirationChip } from '../shared/ExpirationChip';
import { EventButtonGroup } from '../edit-event/EventButtonGroup';
import { getExpirationStatus } from '../event-expiration/helpers';

export const HighlightsList: React.FC = () => {
  const categoryHighlights = useSelector(getHighlightsForSelectedCategory).sort(
    byEndDateOldToNew,
  );
  const selectedCategory = useSelector(getSelectedCategory);

  return (
    <Box
      className="highlightsList"
      borderRight={1}
      borderColor="secondary.main"
    >
      {categoryHighlights.map((event: AgendaEvent) => {
        const formattedStartDate = dateFormat.format(new Date(event.start));
        const formattedEndDate = dateFormat.format(new Date(event.end));

        const cardClass =
          event.state[selectedCategory] === 'highlight'
            ? 'eventCard'
            : 'eventCard mainFocus';

        return (
          <Card
            className={cardClass}
            data-expiration-status={getExpirationStatus({ date: event.end })}
            key={event.id}
            variant="elevation"
          >
            <Typography
              className="eventDate"
              color="textSecondary"
              gutterBottom
            >
              {formattedStartDate !== formattedEndDate
                ? `${formattedStartDate} - ${formattedEndDate}`
                : formattedEndDate}

              {getExpirationStatus({ date: event.end }) === 'expiring-soon' && (
                <ExpirationChip eventEndDate={event.end} />
              )}
            </Typography>

            {event.state[selectedCategory] === 'highlight' && (
              <Typography gutterBottom variant="h6" component="h3">
                {event.name}
              </Typography>
            )}

            {event.state[selectedCategory] === 'mainfocus' && (
              <Typography gutterBottom variant="h4" component="h3">
                {event.name}
              </Typography>
            )}

            <EventButtonGroup existingEvent={event} />
          </Card>
        );
      })}
    </Box>
  );
};
