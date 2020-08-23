import React from 'react';
import { Paper, Card, Typography } from '@material-ui/core';
import { AgendaEvent } from '../../data/dbSchema';
import { useSelector } from 'react-redux';
import { getHighlightsForSelectedCategory } from './getHighlightsForSelectedCategory';
import { dateFormat } from '../shared/helpers';
import { EventButtonGroup } from '../edit-event/eventButtonGroup';
import { getSelectedCategory } from '../edit-event/getSelectedCategory';

export const HighlightsList: React.FC = () => {
  const categoryHighlights = useSelector(getHighlightsForSelectedCategory);
  const selectedCategory = useSelector(getSelectedCategory);

  return (
    <Paper className="highlightsGrid">
      {categoryHighlights.map((event: AgendaEvent) => {
        const formattedEndDate = dateFormat.format(new Date(event.end));
        const cardClass =
          event.state[selectedCategory] === 'highlight'
            ? 'eventCard'
            : 'eventCard mainFocus';

        return (
          <Card className={cardClass} key={event.id} variant="elevation">
            <Typography color="textSecondary" gutterBottom>
              {formattedEndDate}
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

            <EventButtonGroup event={event} />
          </Card>
        );
      })}
    </Paper>
  );
};
