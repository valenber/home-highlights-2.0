import React, { ChangeEvent } from 'react';
import {
  Paper,
  Tabs,
  Tab,
  Card,
  CardContent,
  Typography,
} from '@material-ui/core';
import { AgendaEventCategory, AgendaEvent } from '../../data/dbSchema';
import { useSelector, useDispatch } from 'react-redux';
import { getSelectedCategory } from '../../store/selectors/getSelectedCategory';
import { selectEventCategory } from '../../store/eventsSlice';
import { getHighlightsForSelectedCategory } from '../../store/selectors/getHighlightsForSelectedCategory';

export const EventsView: React.FC = () => {
  const eventCategories = [
    'home',
    'current',
    'exhibitions',
    'theatre and dance',
    'music',
    'sports',
    'fairs',
    'events',
    'christmas',
  ];
  const selectedCategory = useSelector(getSelectedCategory);
  const categoryHighlights = useSelector(getHighlightsForSelectedCategory);
  const dispatch = useDispatch();

  function handleTabChange(
    _event: ChangeEvent,
    newTab: AgendaEventCategory,
  ): void {
    dispatch(selectEventCategory(newTab));
  }

  return (
    <div className="highlightedEventsView">
      <Paper>
        <Tabs
          indicatorColor="secondary"
          textColor="primary"
          onChange={handleTabChange}
          value={selectedCategory}
        >
          {eventCategories.map((category) => (
            <Tab
              key={category}
              label={category}
              value={
                category === 'theatre and dance' ? 'theatreanddance' : category
              }
            />
          ))}
        </Tabs>
      </Paper>

      <div className="eventsListsWrapper">
        <Paper className="highlightsGrid">
          {categoryHighlights.map((event: AgendaEvent) => {
            const formattedEndDate = new Intl.DateTimeFormat('en-GB', {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
            }).format(new Date(event.end));

            return (
              <Card className="eventCard" key={event.id} variant="elevation">
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>
                    {formattedEndDate}
                  </Typography>

                  <Typography gutterBottom variant="h6" component="h3">
                    {event.name}
                  </Typography>
                </CardContent>
              </Card>
            );
          })}
        </Paper>
      </div>
    </div>
  );
};
