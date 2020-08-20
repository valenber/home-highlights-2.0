import React from 'react';
import { CategoriesTabs } from './CategoriesTabs';
import { HighlightsList } from '../view-highlighted-events/HighlightsList';
import { CandidatesList } from '../view-candidate-events/CandidatesList';

export const EventsView: React.FC = () => {
  return (
    <div className="eventsView">
      <CategoriesTabs />

      <HighlightsList />

      <CandidatesList />
    </div>
  );
};
