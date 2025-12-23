// Fixed-window rate limiter middleware keyed by x-user-id header.
// Configurable via options: { windowMs, max }.
const DEFAULT_WINDOW_MS = 60_000; // 1 minute
const DEFAULT_MAX = 10; // requests per window per user

const rateLimit = (options = {}) => {
  const windowMs = options.windowMs ?? DEFAULT_WINDOW_MS;
  const max = options.max ?? DEFAULT_MAX;

  // In-memory store: userId -> { count, windowStart }
  const requestCounts = new Map();

  return (req, res, next) => {
    const userId = req.header("x-user-id");
    if (!userId) {
      return res
        .status(400)
        .json({ error: "User header (x-user-id) required for rate limiting" });
    }

    const now = Date.now();
    const userState = requestCounts.get(userId) || {
      count: 0,
      windowStart: now,
    };

    // Reset the window if expired.
    if (now - userState.windowStart >= windowMs) {
      userState.count = 0;
      userState.windowStart = now;
    }

    userState.count += 1;
    requestCounts.set(userId, userState);

    if (userState.count > max) {
      return res.status(429).json({ error: "Too many requests" });
    }

    next();
  };
};

module.exports = rateLimit;
