import React, { ChangeEvent } from 'react';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '../../store';
import { AgendaEventCategory } from '../../data/dbSchema';
import { Paper, Tabs, Tab } from '@mui/material';
import { getSelectedCategory } from '../../store/selectors/getSelectedCategory';
import { selectCategory } from '../../store/categorySlice';

export const CategoriesTabs: React.FC = () => {
  const dispatch = useAppDispatch();
  const selectedCategory = useSelector(getSelectedCategory);

  const categoriesLabels: Record<AgendaEventCategory, string> = {
    // eslint-disable-next-line quotes
    current: "What's on",
    /* eslint-enable */
    exhibitions: 'Exhibitions',
    theatreanddance: 'Theatre and Dance',
    music: 'Music',
    sports: 'Sports',
    fairs: 'Fairs',
    events: 'Events',
    christmas: 'Christmas',
  };

  function handleTabChange(
    _event: ChangeEvent,
    newTab: AgendaEventCategory,
  ): void {
    dispatch(selectCategory(newTab));
  }

  return (
    <Paper className="categoriesTabs">
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Tabs
          indicatorColor="secondary"
          textColor="primary"
          onChange={handleTabChange}
          value={selectedCategory}
        >
          {Object.keys(categoriesLabels).map((category) => (
            <Tab
              key={category}
              label={categoriesLabels[category]}
              value={category}
            />
          ))}
        </Tabs>
      </div>
    </Paper>
  );
};
