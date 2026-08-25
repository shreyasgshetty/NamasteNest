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

app.use(helmet({ crossOriginEmbedderPolicy: false, contentSecurityPolicy: false }));
app.use(cors({ origin: process.env.CLIENT_URL || '*' }));
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

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
