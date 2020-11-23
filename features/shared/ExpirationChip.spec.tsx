import '@testing-library/jest-dom';

import React from 'react';
import { ExpirationChip } from './ExpirationChip';

import { render } from '@testing-library/react';

jest.mock('../event-expiration/helpers', () => ({
  getDaysTillDate: jest
    .fn()
    .mockReturnValueOnce(0)
    .mockReturnValueOnce(1)
    .mockReturnValueOnce(5),
}));

test('shows today if event expires in 0 days', () => {
  const { getByText } = render(<ExpirationChip eventEndDate="1" />);

  expect(getByText('expires today')).toBeInTheDocument();
});

test('shows tomorrow if event expires in 1 day', () => {
  const { getByText } = render(<ExpirationChip eventEndDate="1" />);

  expect(getByText('expires tomorrow')).toBeInTheDocument();
});

test('shows in 5 days if event expires in 5 days', () => {
  const { getByText } = render(<ExpirationChip eventEndDate="1" />);

  expect(getByText('expires in 5 days')).toBeInTheDocument();
});
