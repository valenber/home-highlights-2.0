import { activeCategoryReducer, selectCategory } from './categorySlice';

test('updates selected event category', () => {
  const newState = activeCategoryReducer(null, selectCategory('current'));

  expect(newState).toBe('current');
});
