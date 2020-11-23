import '@testing-library/jest-dom';
import React from 'react';
import { render, RenderResult } from '@testing-library/react';
import { HighlightsList } from './HighlightsList';
import { AgendaEvent, exampleAgendaEvent } from '../../data/dbSchema';
import { getSelectedCategory } from '../edit-event/getSelectedCategory';
import { getHighlightsForSelectedCategory } from './getHighlightsForSelectedCategory';

const mockSelectorMap = new Map();

const mockCategoryEvents: AgendaEvent[] = [exampleAgendaEvent];

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useSelector: jest
    .fn()
    .mockImplementation((selector) => mockSelectorMap.get(selector)),
  useDispatch: jest.fn(() => jest.fn()),
}));

jest.mock('notistack', () => ({
  ...jest.requireActual('notistack'),
  useSnackbar: jest.fn().mockImplementation(() => ({
    enqueueSnackbar: jest.fn(),
  })),
}));

let documentBody: RenderResult;

beforeEach(() => {
  mockSelectorMap.set(getHighlightsForSelectedCategory, mockCategoryEvents);
  mockSelectorMap.set(getSelectedCategory, 'fairs');

  documentBody = render(<HighlightsList />);
});

test('renders highlighted component', () => {
  const { getByText } = documentBody;
  expect(getByText('PhotoEspaña 2020')).toBeInTheDocument();
});

test('event card displays promote button', () => {
  const { getByLabelText } = documentBody;
  expect(getByLabelText('promote event')).toBeInTheDocument();
});

test('event card displays edit button', () => {
  const { getByLabelText } = documentBody;
  expect(getByLabelText('edit event')).toBeInTheDocument();
});
