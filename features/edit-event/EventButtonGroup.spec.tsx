import React from 'react';
import { EventButtonGroup } from './EventButtonGroup';
import { render, screen } from 'test-utils';
import { firstEvent } from 'mock-events';

test('buttons group includes promote button', () => {
  render(<EventButtonGroup existingEvent={firstEvent} />);

  expect(screen.getByLabelText('promote event')).toBeInTheDocument();
});

test('buttons group includes edit button', () => {
  render(<EventButtonGroup existingEvent={firstEvent} />);

  expect(screen.getByLabelText('edit event')).toBeInTheDocument();
});
