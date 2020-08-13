import React from 'react';
import { TabView, TabPanel } from 'primereact/tabview';
import { useSelector } from 'react-redux';
import { getStoreEventsCategories } from '../../store/selectors/getStoreEventsCategories';
import { getEventsByCategory } from '../../store/selectors/getEventsByCategory';
import { AgendaEventCategory } from '../../data/dbSchema';
import { Card } from 'primereact/card';

export const HighlightedEventsView: React.FC = () => {
  const categoriesList = useSelector(getStoreEventsCategories);

  function capitalize(string: string): string {
    return string.charAt(0).toUpperCase() + string.slice(1);
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
    </div>
  );
};
