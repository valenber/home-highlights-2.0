export function getDaysTillDate(date: string): number {
  return Math.ceil(
    (new Date(date).getTime() - new Date().getTime()) / (1000 * 3600 * 24),
  );
}

type ExpirationStatus = 'ok' | 'expired' | 'expiring-soon';

interface GetExpirationStatusArgs {
  date: string;
  threshold?: number;
}

export function getExpirationStatus({
  date,
  threshold = 7,
}: GetExpirationStatusArgs): ExpirationStatus {
  const hasExpired = getDaysTillDate(date) < 0;
  const expiresSoon = getDaysTillDate(date) < threshold;

  if (hasExpired) return 'expired';

  if (expiresSoon) return 'expiring-soon';

  return 'ok';
}
