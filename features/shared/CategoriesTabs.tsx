import React, { ChangeEvent } from 'react';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '../../store';
import { AgendaEventCategory } from '../../data/dbSchema';
import { Paper, Tabs, Tab } from '@material-ui/core';
import { getSelectedCategory } from '../../store/selectors/getSelectedCategory';
import { selectCategory } from '../../store/categorySlice';

export const CategoriesTabs: React.FC = () => {
  const dispatch = useAppDispatch();
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
    dispatch(selectCategory(newTab));
  }

  return (
    <Paper className="categoriesTabs">
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
