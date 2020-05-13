import eventsAPI from '../../pages/api/events';

test('setup test', () => {
  eventsAPI();
  expect(true).toBe(true);
});
