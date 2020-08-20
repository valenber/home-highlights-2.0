import React from 'react';
import { CategoriesTabs } from './CategoriesTabs';
import { HighlightsList } from '../view-highlighted-events/HighlightsList';

export const EventsView: React.FC = () => {
  return (
    <div className="eventsView">
      <CategoriesTabs />

      <HighlightsList />
    </div>
  );
};
