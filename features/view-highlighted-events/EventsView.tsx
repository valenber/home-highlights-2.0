import React, { useState, ChangeEvent } from 'react';
import { Paper, Tabs, Tab } from '@material-ui/core';

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
  const [selectedCategory, setSelectedCategory] = useState(1);

  function handleTabChange(_event: ChangeEvent, newTab: number): void {
    setSelectedCategory(newTab);
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
            <Tab key={category} label={category} />
          ))}
        </Tabs>
      </Paper>
    </div>
  );
};
