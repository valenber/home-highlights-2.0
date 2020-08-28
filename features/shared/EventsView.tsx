import React from 'react';
import { CategoriesTabs } from './CategoriesTabs';
import { HighlightsList } from '../view-highlighted-events/HighlightsList';
import { CandidatesList } from '../view-candidate-events/CandidatesList';
import { EditorFormModal } from '../edit-event/EditorForm';

export const EventsView: React.FC = () => {
  return (
    <div className="eventsView">
      <CategoriesTabs />

      <HighlightsList />

      <CandidatesList />

      <EditorFormModal />
    </div>
  );
};
