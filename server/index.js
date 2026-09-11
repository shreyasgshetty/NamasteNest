const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const path = require('path');
const rateLimit = require('express-rate-limit');
require('dotenv').config();
const connectDB = require('./config/db');

const app = express();
connectDB();

app.use(helmet({
  crossOriginEmbedderPolicy: false,
  crossOriginResourcePolicy: { policy: 'cross-origin' },
  crossOriginOpenerPolicy: { policy: 'same-origin-allow-popups' },
  contentSecurityPolicy: false,
}));

const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'http://localhost:5000',
  'https://namaste-nest.vercel.app',
];

if (process.env.CLIENT_URL) {
  process.env.CLIENT_URL.split(',').forEach(u => {
    const trimmed = u.trim().replace(/\/$/, '');
    if (trimmed && !allowedOrigins.includes(trimmed)) {
      allowedOrigins.push(trimmed);
    }
  });
}

app.use(cors({
  origin: (origin, callback) => {
    // Allow non-browser requests (e.g. mobile apps, curl, Postman)
    if (!origin) return callback(null, true);

    if (
      allowedOrigins.includes('*') ||
      allowedOrigins.includes(origin) ||
      /^https:\/\/.*\.vercel\.app$/.test(origin)
    ) {
      return callback(null, true);
    }

    // Fallback: allow origin so valid frontend deployments are never blocked
    return callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());
// Use compact colourised logs in dev, structured logs in production
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

// ─── Rate Limiters ──────────────────────────────────────────────────────────
const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,                   // max 10 submissions per window per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many submissions. Please try again in 15 minutes.' },
});

// Serve legacy local uploads (development only — new images go to Cloudinary)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/properties', require('./routes/properties'));
app.use('/api/contact', contactLimiter, require('./routes/contact'));

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'OK', message: 'Namaste Nest API 🏡' }));

// 404
app.use((req, res) => res.status(404).json({ message: 'Route not found' }));

// Global error handler — guarantees JSON response on any unhandled error
app.use((err, req, res, next) => {
  console.error('❌ Server error:', err);
  const status = err.status || err.statusCode || (err.name === 'ValidationError' || err.name === 'MulterError' ? 400 : 500);
  res.status(status).json({
    success: false,
    message: err.message || 'Internal server error',
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
