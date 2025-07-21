require('dotenv').config();
const express = require('express');
const cors = require('cors');
const roomTypeController = require('./src/controllers/roomTypeController');
const roomController = require('./src/controllers/roomController');
const detailController = require('./src/controllers/roomDetailController');
// const authRoutes = require('./src/routes/authRoutes');
const customerController = require('./src/controllers/customerController');

const app = express();
app.use(cors());
app.use(express.json());

// room type 
app.get('/api/room-types', roomTypeController.getAllRoomTypes);
app.get('/api/room-types/:id', roomTypeController.getRoomTypeById);
app.post('/api/room-types', roomTypeController.createRoomType);
app.put('/api/room-types/:id', roomTypeController.updateRoomType);
app.delete('/api/room-types/:id', roomTypeController.deleteRoomType);

// room
app.get('/api/rooms', roomController.getAllRooms);
app.get('/api/rooms/:id', roomController.getRoomById);
app.post('/api/rooms', roomController.createRoom);
app.put('/api/rooms/:id', roomController.updateRoom);
app.delete('/api/rooms/:id', roomController.deleteRoom);
app.get('/api/rooms/:id/available', roomController.checkAvailable);


// auth routes
// app.use('/api/auth', authRoutes);
app.post('/api/register', customerController.register);
app.post('/api/login', customerController.login);
app.get('/api/users', customerController.getCustomerList);


// room detail 
app.get('/api/details', detailController.getAllDetails);
app.get('/api/details/:id', detailController.getDetailById);
app.post('/api/details', detailController.createDetail);
app.put('/api/details/:id', detailController.updateDetail);
app.delete('/api/details/:id', detailController.deleteDetail);
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
