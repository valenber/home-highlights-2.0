import React from 'react';
import { render, screen } from 'test-utils';
import { HighlightsList } from './HighlightsList';
import { secondEvent, thirdEvent, fourthEvent } from '../../tests/mocks/events';

const setup = () =>
  render(<HighlightsList />, {
    state: {
      events: [secondEvent, thirdEvent, fourthEvent],
      activeCategory: 'music',
    },
  });

test('renders all highlighted components', () => {
  setup();

  expect(screen.getByText(secondEvent.name)).toBeInTheDocument();
  expect(screen.getByText(thirdEvent.name)).toBeInTheDocument();
});

test('doesn not render candidates', () => {
  setup();

  expect(screen.queryByText(fourthEvent.name)).not.toBeInTheDocument();
});
