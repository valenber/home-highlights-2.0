import React, { useState, ChangeEvent } from 'react';
import { TabView, TabPanel } from 'primereact/tabview';
import { useSelector } from 'react-redux';
import { getStoreEventsCategories } from '../../store/selectors/getStoreEventsCategories';
import { getEventsByCategory } from '../../store/selectors/getEventsByCategory';
import { AgendaEventCategory } from '../../data/dbSchema';
import { Card } from 'primereact/card';

import { Paper, Tabs, Tab } from '@material-ui/core';

export const HighlightedEventsView: React.FC = () => {
  const categoriesList = useSelector(getStoreEventsCategories);

  function capitalize(string: string): string {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  const eventCategories = ['Home', 'Music', 'Sports', 'Fairs'];
  const [selectedCategory, setSelectedCategory] = useState(1);

  function handleTabChange(_event: ChangeEvent, newTab: number): void {
    setSelectedCategory(newTab);
  }

  return (
    <div className="highlightedEventsView">
      <TabView>
        {categoriesList.map((category: AgendaEventCategory) => (
          <TabPanel key={category} header={capitalize(category)}>
            {useSelector(getEventsByCategory(category)).map((event) => {
              return <Card key={event.id} title={event.name}></Card>;
            })}
          </TabPanel>
        ))}
      </TabView>

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
