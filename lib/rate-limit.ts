// Very small in-memory rate limiter for portfolio/demo usage
const ipCounts = new Map<string, { count: number; lastReset: number }>();

export function checkRateLimit(ip: string, limit = 5) {
  const now = Date.now();
  const hour = 1000 * 60 * 60;

  const entry = ipCounts.get(ip) ?? { count: 0, lastReset: now };

  if (now - entry.lastReset > hour) {
    entry.count = 0;
    entry.lastReset = now;
  }

  entry.count += 1;
  ipCounts.set(ip, entry);

  return entry.count <= limit;
}
