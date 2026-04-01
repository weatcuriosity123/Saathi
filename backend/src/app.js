const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');

const errorMiddleware = require('./middleware/error.middleware');
const AppError = require('./utils/AppError');

// ── Route Imports ─────────────────────────────────────────────────────────────
const authRoutes       = require('./modules/auth/auth.routes');
const courseRoutes     = require('./modules/course/course.routes');
const enrollmentRoutes = require('./modules/enrollment/enrollment.routes');
// Future: const tutorRoutes  = require('./modules/tutor/tutor.routes');
// Future: const adminRoutes  = require('./modules/admin/admin.routes');

const app = express();

// ── Security Headers (helmet) ─────────────────────────────────────────────────
app.use(helmet());

// ── CORS ──────────────────────────────────────────────────────────────────────
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    credentials: true, // required for cookies (refresh token)
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// ── Global Rate Limit ─────────────────────────────────────────────────────────
// Backs up route-level limiters. 100 requests per minute per IP overall.
app.use(
  rateLimit({
    windowMs: 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, message: 'Too many requests. Slow down.' },
  })
);

// ── Body Parsers ──────────────────────────────────────────────────────────────
app.use(express.json({ limit: '10kb' })); // reject huge JSON bodies
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

// ── Request Logger ────────────────────────────────────────────────────────────
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// ── Health Check ──────────────────────────────────────────────────────────────
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Saathi API is running',
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
  });
});

// ── API Routes ────────────────────────────────────────────────────────────────
app.use('/api/v1/auth',        authRoutes);
app.use('/api/v1/courses',     courseRoutes);
app.use('/api/v1/enrollments', enrollmentRoutes);
// app.use('/api/v1/tutors',   tutorRoutes);
// app.use('/api/v1/admin',    adminRoutes);

// ── 404 Handler ───────────────────────────────────────────────────────────────
// Catches any request that didn't match a route above
app.all('*', (req, res, next) => {
  next(new AppError(`Route ${req.method} ${req.originalUrl} not found`, 404));
});

// ── Global Error Handler ──────────────────────────────────────────────────────
// Must be registered last
app.use(errorMiddleware);

module.exports = app;
