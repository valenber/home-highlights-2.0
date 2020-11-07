import { getDaysTillDate, getExpirationStatus } from './helpers';

beforeEach(() => {
  jest
    .spyOn(global.Date, 'now')
    .mockImplementation(() => new Date('2020-11-02:00:00.000Z').valueOf());
});

describe('days till date', () => {
  test('correctly returns 7', () => {
    expect(getDaysTillDate('2020-11-09:00:00.000Z')).toBe(7);
  });

  test('correctly returns 0', () => {
    expect(getDaysTillDate('2020-11-02:00:00.000Z')).toBe(0);
  });

  test('correctly returns -5', () => {
    expect(getDaysTillDate('2020-10-28:00:00.000Z')).toBe(-5);
  });
});

describe('expiration status', () => {
  describe('default threshold', () => {
    test('returns "expiring-soon" for 3 days', () => {
      expect(getExpirationStatus({ date: '2020-11-05:00:00.000Z' })).toBe(
        'expiring-soon',
      );
    });

    test('returns "expired" for -1 day', () => {
      expect(getExpirationStatus({ date: '2020-11-01:00:00.000Z' })).toBe(
        'expired',
      );
    });

    test('returns "ok" for 9 days', () => {
      expect(getExpirationStatus({ date: '2020-11-11:00:00.000Z' })).toBe('ok');
    });
  });

  describe('custom threshold', () => {
    test('returns "ok" for 3 days with 2 days threshold', () => {
      expect(
        getExpirationStatus({ date: '2020-11-11:00:00.000Z', threshold: 2 }),
      ).toBe('ok');
    });

    test('returns "expiring-soon" for 12 days with 14 days threshold', () => {
      expect(
        getExpirationStatus({ date: '2020-11-12:00:00.000Z', threshold: 14 }),
      ).toBe('expiring-soon');
    });
  });
});
