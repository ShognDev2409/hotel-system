const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const { testConnection } = require('./config/database');
const ApiError = require('./utils/apiError');
const authRoutes = require('./routes/auth.routes');

// Initialize express app
const app = express();

// 1. GLOBAL MIDDLEWARES
// Enable CORS
app.use(cors());
app.options('*', cors());

// Set security HTTP headers
app.use(helmet());

// Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Data sanitization against XSS
// app.use(xss());

// Prevent parameter pollution
// app.use(hpp({
//   whitelist: []
// }));

// Compression
app.use(compression());

// Limit requests from same API
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000, // 1 hour
  message: 'Too many requests from this IP, please try again in an hour!'
});
app.use('/api', limiter);

// Test DB connection
app.use(async (req, res, next) => {
  try {
    await testConnection();
    next();
  } catch (error) {
    next(error);
  }
});

// 2. ROUTES
app.use('/api/v1/auth', authRoutes);

// 3. ERROR HANDLING MIDDLEWARE
// Handle 404 routes
app.all('*', (req, res, next) => {
  next(new ApiError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Global error handler
app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    console.error('ERROR 💥', err);
    
    return res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack
    });
  }

  // Production error handling
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message
    });
  }

  // For programming or other unknown errors
  console.error('ERROR 💥', err);
  
  return res.status(500).json({
    status: 'error',
    message: 'Something went very wrong!'
  });
});

module.exports = app;