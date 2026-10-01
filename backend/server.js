const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
require('dotenv').config();

// Fail fast — crash immediately if critical env vars are missing
const required = ['MONGO_URI', 'JWT_SECRET'];
required.forEach((k) => {
  if (!process.env[k]) {
    console.error(`FATAL: Missing env variable: ${k}`);
    process.exit(1);
  }
});

const app = express();

app.use(helmet({ crossOriginResourcePolicy: false }));
const clientOrigins = process.env.CLIENT_URL
  ? process.env.CLIENT_URL.split(',').map((url) => url.trim().replace(/\/$/, ''))
  : ['http://localhost:3000'];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || clientOrigins.includes(origin) || clientOrigins.includes('*')) {
      return callback(null, true);
    }
    return callback(new Error(`Origin ${origin} not allowed by CORS`));
  },
  credentials: true,
}));
app.use(express.json({ limit: '10kb' }));

// Strip $ and . from req.body/params to block NoSQL injection
app.use(mongoSanitize());

app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: process.env.NODE_ENV === 'production' ? 200 : 2000,
    message: { message: 'Too many requests, please slow down.' },
  })
);

app.use('/api/health', require('./routes/health'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/days', require('./routes/days'));
app.use('/api/progress', require('./routes/progress'));
app.use('/api/vocabulary', require('./routes/vocabulary'));
app.use('/api/grammar', require('./routes/grammar'));
app.use('/api/challenge', require('./routes/challenge'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/gemini', require('./routes/gemini'));
app.use('/api/groq', require('./routes/groq'));
app.use('/api/dictionary', require('./routes/dictionary'));
app.use('/api/news', require('./routes/news'));

app.get('/api', (req, res) => res.json({
  message: 'Every Day Better API',
  version: '2.0',
  endpoints: {
    health: '/api/health',
    auth: '/api/auth',
    users: '/api/users',
    days: '/api/days',
    progress: '/api/progress',
    vocabulary: '/api/vocabulary',
    grammar: '/api/grammar',
    challenge: '/api/challenge',
    admin: '/api/admin',
    gemini: '/api/gemini',
    dictionary: '/api/dictionary/:word',
    news: '/api/news',
  },
}));

app.get('/', (req, res) => res.json({ message: 'Every Day Better API Running ✅', version: '2.0' }));

// Global error handler — never leak stack traces to client
app.use((err, req, res, next) => {
  if (process.env.NODE_ENV !== 'production') {
    console.error(`[${new Date().toISOString()}] ${req.method} ${req.path}`, err.stack);
  } else {
    console.error(`[${new Date().toISOString()}] ${req.method} ${req.path} — ${err.message}`);
  }
  res.status(err.status || 500).json({ message: process.env.NODE_ENV === 'production' ? 'Something went wrong.' : err.message });
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB Connected ✅');
    app.listen(process.env.PORT || 5000, () =>
      console.log(`Server running on port ${process.env.PORT || 5000} ✅`)
    );
  })
  .catch((err) => { console.error('MongoDB Error:', err); process.exit(1); });
