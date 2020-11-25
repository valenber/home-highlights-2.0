import { getHighlightsForSelectedCategory } from './getHighlightsForSelectedCategory';
import { firstEvent, secondEvent, thirdEvent } from '../../tests/mocks/events';
import { AppState } from '../../store';

test('returns highlighted events of selected category', () => {
  const mockState: AppState = {
    activeCategory: 'music',
    editedEvent: null,
    events: [
      firstEvent,
      secondEvent,
      { ...thirdEvent, state: { fairs: 'highlight' } },
    ],
  };

  const result = getHighlightsForSelectedCategory(mockState);

  expect(result).toEqual([secondEvent]);
});
