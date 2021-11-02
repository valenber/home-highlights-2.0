import React from 'react';
import { ExpirationChip } from './ExpirationChip';

import { render, screen } from 'test-utils';

jest.mock('../event-expiration/helpers', () => ({
  getDaysTillDate: jest
    .fn()
    .mockReturnValueOnce(0)
    .mockReturnValueOnce(1)
    .mockReturnValueOnce(5),
}));

test('shows today if event expires in 0 days', () => {
  render(<ExpirationChip eventEndDate="1" />);

  expect(screen.getByText('expires today')).toBeInTheDocument();
});

test('shows tomorrow if event expires in 1 day', () => {
  render(<ExpirationChip eventEndDate="1" />);

  expect(screen.getByText('expires tomorrow')).toBeInTheDocument();
});

test('shows in 5 days if event expires in 5 days', () => {
  render(<ExpirationChip eventEndDate="1" />);

  expect(screen.getByText('expires in 5 days')).toBeInTheDocument();
});
