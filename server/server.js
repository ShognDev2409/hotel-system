require('dotenv').config();
const express = require('express');
const cors = require('cors');
const roomTypeController = require('./src/controllers/roomTypeController');
const roomController = require('./src/controllers/roomController');
const detailController = require('./src/controllers/roomDetailController');
const customerController = require('./src/controllers/customerController');
const bookingController = require('./src/controllers/bookController');
const employeeController = require('./src/controllers/employeeController');

const app = express();
app.use(cors());
app.use(express.json({
  limit: '50mb',  // Increase from default 1mb to 50mb
  extended: true
}));
app.use(express.urlencoded({
  limit: '50mb',
  extended: true
}));
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
app.post('/api/register', customerController.register);
app.post('/api/login', customerController.login);
app.get('/api/customerlist', customerController.getCustomerList);

app.get('/api/customer/:id', customerController.getCustomerById);
app.put('/api/customer/:id', customerController.updateCustomerById);
app.delete('/api/customer/:id', customerController.deleteCustomerById);



// room detail 
app.get('/api/details', detailController.getAllDetails);
app.get('/api/details/:id', detailController.getDetailById);
app.post('/api/details', detailController.createDetail);
app.put('/api/details/:id', detailController.updateDetail);
app.delete('/api/details/:id', detailController.deleteDetail);

//booking

app.get('/api/bookings', bookingController.getAllBookings);
app.get('/api/bookings/:id', bookingController.getBookingById);
app.get('/api/bookings/history/:cus_id', bookingController.getBookingHistory);
app.post('/api/bookings', bookingController.createBookingWithDetail);
app.put('/api/bookings/:id/status', bookingController.updateBookingStatus); //via payload
app.put('/api/bookings/:id/approve', bookingController.approveBooking);
app.put('/api/bookings/:id/reject', bookingController.rejectBooking);
app.put('/api/bookings/:id/check_in', bookingController.checkInBooking);
app.put('/api/bookings/:id/check_out', bookingController.checkOutBooking);
app.delete('/api/bookings/:id', bookingController.deleteBooking);

app.get('/api/bookings/:id/details', bookingController.getBookingDetails);
app.patch('/api/booking-details/:detailId/checkin', bookingController.updateCheckIn);
app.patch('/api/booking-details/:detailId/checkout', bookingController.updateCheckOut);

// dashboard
app.get('/api/booking/report', bookingController.getBookingReport);

// income page with query param
app.get('/api/income/report', bookingController.getDashboardSummary);

// employee
app.get('/api/employees', employeeController.getEmployeeList);
app.get('/api/employees/:id', employeeController.getEmployeeById);
app.post('/api/employees', employeeController.createEmployee);
app.put('/api/employees/:id', employeeController.updateEmployee);
app.delete('/api/employees/:id', employeeController.deleteEmployee);
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
