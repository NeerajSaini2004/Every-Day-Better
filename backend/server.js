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
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:3000', credentials: true }));
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

app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/days', require('./routes/days'));
app.use('/api/progress', require('./routes/progress'));
app.use('/api/vocabulary', require('./routes/vocabulary'));
app.use('/api/grammar', require('./routes/grammar'));
app.use('/api/challenge', require('./routes/challenge'));
app.use('/api/admin', require('./routes/admin'));

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
