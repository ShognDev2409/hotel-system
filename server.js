require('dotenv').config();
const express = require('express');
const cors = require('cors');

// Initialize express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Simple route for testing
app.get('/', (req, res) => {
  res.send('Hotel API is running!');
});

// Simple login endpoint
app.post('/api/v1/auth/login', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Login successful!',
    token: 'dummy-jwt-token'
  });
});

// Simple register endpoint
app.post('/api/v1/auth/register', (req, res) => {
  res.status(201).json({ 
    success: true, 
    message: 'User registered successfully!',
    user: {
      id: 1,
      name: 'Test User',
      email: 'test@example.com'
    }
  });
});

// Handle 404 routes
app.all('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Can't find ${req.originalUrl} on this server!`
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: 'Something went wrong!' });
});

// Start the server
const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`Server running on port ${port}`);
  console.log('Endpoints:');
  console.log(`  GET  /`);
  console.log(`  POST /api/v1/auth/login`);
  console.log(`  POST /api/v1/auth/register`);
});

// Handle server errors
server.on('error', (error) => {
  console.error('Server error:', error);
});

// Handle process termination
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully');
  server.close(() => {
    console.log('Process terminated');
  });
});