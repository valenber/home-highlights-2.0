import { AppState } from '../../store';
import { getSelectedCategory } from './getSelectedCategory';

test('returns active category from store', () => {
  const mockState: AppState = {
    activeCategory: 'music',
    events: [],
    editedEvent: null,
  };
  const result = getSelectedCategory(mockState);
  expect(result).toBe('music');
});
