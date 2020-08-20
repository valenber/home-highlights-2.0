import React, { ChangeEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AgendaEventCategory } from '../../data/dbSchema';
import { selectEventCategory } from '../../store/eventsSlice';
import { Paper, Tabs, Tab } from '@material-ui/core';
import { getSelectedCategory } from '../../store/selectors/getSelectedCategory';

export const CategoriesTabs: React.FC = () => {
  const dispatch = useDispatch();
  const selectedCategory = useSelector(getSelectedCategory);

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

  function handleTabChange(
    _event: ChangeEvent,
    newTab: AgendaEventCategory,
  ): void {
    dispatch(selectEventCategory(newTab));
  }

  return (
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
  );
};
