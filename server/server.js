require('dotenv').config();
const express = require('express');
const cors = require('cors');
const roomTypeController = require('./src/controllers/roomTypeController');
const healthController = require('./src/controllers/healthController');

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.get('/api/room-types', roomTypeController.getAllRoomTypes);
app.get('/api/room-types/:id', roomTypeController.getRoomTypeById);
app.post('/api/room-types', roomTypeController.createRoomType);
app.put('/api/room-types/:id', roomTypeController.updateRoomType);
app.delete('/api/room-types/:id', roomTypeController.deleteRoomType);

// 404
app.all('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Can't find ${req.originalUrl} on this server!`
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: 'Something went wrong!' });
});

// DB connection
require('./src/config/database');

// Start server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`🚀 Server is running on port ${port}`);
});
