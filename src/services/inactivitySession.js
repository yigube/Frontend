export const SESSION_INACTIVITY_LIMIT_MS = 15 * 60 * 1000;

export function hasSessionExpired(lastActivityAt, now = Date.now(), limitMs = SESSION_INACTIVITY_LIMIT_MS) {
  const last = Number(lastActivityAt);
  const current = Number(now);
  const limit = Number(limitMs);
  if (!Number.isFinite(last) || !Number.isFinite(current) || !Number.isFinite(limit)) return false;
  return current - last >= limit;
}

export function getNextInactivityDelay(lastActivityAt, now = Date.now(), limitMs = SESSION_INACTIVITY_LIMIT_MS) {
  const last = Number(lastActivityAt);
  const current = Number(now);
  const limit = Number(limitMs);
  if (!Number.isFinite(last) || !Number.isFinite(current) || !Number.isFinite(limit)) return limitMs;
  return Math.max(0, limit - (current - last));
}
