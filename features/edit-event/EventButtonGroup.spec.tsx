import React from 'react';
import { EventButtonGroup } from './EventButtonGroup';
import { render, screen } from 'test-utils';
import { firstEvent } from 'mock-events';

beforeEach(() => {
  render(<EventButtonGroup existingEvent={firstEvent} />);
});

test('buttons group includes promote button', () => {
  expect(screen.getByLabelText('promote event')).toBeInTheDocument();
});

test('buttons group includes edit button', () => {
  expect(screen.getByLabelText('edit event')).toBeInTheDocument();
});
