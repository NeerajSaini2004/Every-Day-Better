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
const rawClientUrl = process.env.CLIENT_URL || '';
const clientOrigins = rawClientUrl
  ? rawClientUrl.split(',').map((url) => url.trim().replace(/\/+$/, '')).filter(Boolean)
  : [];

app.use(cors({
  origin: (origin, callback) => {
    // Allow non-browser requests (e.g. mobile apps, curl, server-to-server)
    if (!origin) return callback(null, true);

    // If no CLIENT_URL is specified or set to '*', allow the request
    if (clientOrigins.length === 0 || clientOrigins.includes('*')) {
      return callback(null, true);
    }

    // Check exact origin or subdomains for Vercel/Netlify/Render
    const isAllowed = clientOrigins.some((allowed) => {
      if (allowed === origin) return true;
      if ((allowed.includes('.vercel.app') || allowed === 'vercel') && origin.endsWith('.vercel.app')) return true;
      if ((allowed.includes('.netlify.app') || allowed === 'netlify') && origin.endsWith('.netlify.app')) return true;
      if ((allowed.includes('.onrender.com') || allowed === 'render') && origin.endsWith('.onrender.com')) return true;
      return false;
    });

    if (isAllowed || origin.startsWith('http://localhost:') || origin.startsWith('http://127.0.0.1:')) {
      return callback(null, true);
    }

    return callback(null, false);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
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

// One-time seed trigger — protected by SEED_SECRET env var
app.post('/api/run-seed', async (req, res) => {
  if (req.body.secret !== (process.env.SEED_SECRET || 'seed_everydaybetter_2024')) {
    return res.status(403).json({ message: 'Forbidden' });
  }
  try {
    const { execFile } = require('child_process');
    execFile('node', ['seed/seedData.js'], { cwd: __dirname, env: process.env }, (err, stdout, stderr) => {
      if (err) return res.status(500).json({ message: 'Seed failed', error: err.message, stderr });
      res.json({ message: 'Seed completed', output: stdout });
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

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
