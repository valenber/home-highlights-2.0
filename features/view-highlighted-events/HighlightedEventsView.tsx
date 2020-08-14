import React, { useState, ChangeEvent } from 'react';
import { Paper, Tabs, Tab } from '@material-ui/core';

export const HighlightedEventsView: React.FC = () => {
  const eventCategories = ['Home', 'Music', 'Sports', 'Fairs'];
  const [selectedCategory, setSelectedCategory] = useState(1);

  function handleTabChange(_event: ChangeEvent, newTab: number): void {
    setSelectedCategory(newTab);
  }

  return (
    <div className="highlightedEventsView">
      <Paper>
        <Tabs
          indicatorColor="primary"
          textColor="primary"
          onChange={handleTabChange}
          value={selectedCategory}
        >
          {eventCategories.map((category) => (
            <Tab key={category.toLowerCase()} label={category} />
          ))}
        </Tabs>
      </Paper>
    </div>
  );
};
