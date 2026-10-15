const rateLimit = require('express-rate-limit');

// Per-user rate limit for AI endpoints — prevents abuse and runaway API costs.
// Uses the JWT-authenticated user ID as the key (falls back to IP).
const aiRateLimit = rateLimit({
  windowMs: 24 * 60 * 60 * 1000, // 24 hours
  max: 50, // 50 AI requests per user per day
  keyGenerator: (req) => req.user?._id?.toString() || req.ip,
  validate: false,
  message: { message: 'AI usage limit reached (50/day). Try again tomorrow.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Stricter burst limiter — prevents rapid-fire requests
const aiBurstLimit = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 5, // max 5 requests per minute
  keyGenerator: (req) => req.user?._id?.toString() || req.ip,
  validate: false,
  message: { message: 'Too many AI requests. Wait a minute and try again.' },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = { aiRateLimit, aiBurstLimit };
