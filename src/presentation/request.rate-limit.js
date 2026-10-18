// Lightweight per-IP abuse guard for public request creation.
// Single-process only; use a shared Redis-backed limiter before multi-instance production.
const { AppError } = require('../domain/errors');
const buckets = new Map();
function rateLimit(req, res, next) {
  const windowMs = 60_000;
  const max = Number(process.env.PUBLIC_REQUESTS_PER_MINUTE || 30);
  const now = Date.now();
  const ip = req.ip || req.socket.remoteAddress || 'unknown';
  // Opportunistic expiry cleanup limits stale-key growth during sustained operation.
  if (buckets.size > 10000) for (const [key, value] of buckets) if (value.resetAt <= now) buckets.delete(key);
  let state = buckets.get(ip);
  if (!state || state.resetAt <= now) state = { count: 0, resetAt: now + windowMs };
  state.count++;
  buckets.set(ip, state);
  res.set('RateLimit-Limit', String(max));
  res.set('RateLimit-Remaining', String(Math.max(0, max - state.count)));
  if (state.count > max) {
    res.set('Retry-After', String(Math.ceil((state.resetAt - now) / 1000)));
    return next(new AppError(429, 'RATE_LIMITED', 'Too many requests. Please try again later.'));
  }
  return next();
}
module.exports = { rateLimit };
