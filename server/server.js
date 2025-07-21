require('dotenv').config();
const express = require('express');
const cors = require('cors');


// Initialize express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

require('./src/config/database');

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