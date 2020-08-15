import React, { ChangeEvent } from 'react';
import { Paper, Tabs, Tab } from '@material-ui/core';
import { AgendaEventCategory } from '../../data/dbSchema';
import { useSelector, useDispatch } from 'react-redux';
import { getSelectedCategory } from '../../store/selectors/getSelectedCategory';
import { selectEventCategory } from '../../store/eventsSlice';

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
            <Tab key={category} label={category} value={category} />
          ))}
        </Tabs>
      </Paper>

      <div className="eventsListsWrapper">
        <Paper className="highlightsGrid">
          highlightsGrid - {selectedCategory}
        </Paper>
      </div>
    </div>
  );
};
