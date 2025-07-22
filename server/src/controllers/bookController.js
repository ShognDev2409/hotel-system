const bookService = require('../services/bookService');
const roomService = require('../services/roomService');
exports.getAllBookings = async (req, res, next) => {
  try {
    const bookings = await bookService.getAllBookings();
    res.json({ success: true, data: bookings });
  } catch (err) {
    next(err);
  }
};

exports.getBookingById = async (req, res, next) => {
  try {
    const booking = await bookService.getBookingById(req.params.id);
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }
    res.json({ success: true, data: booking });
  } catch (err) {
    next(err);
  }
};

exports.getBookingHistory = async (req, res, next) => {
  try {
    const bookings = await bookService.getBookingHistoryByCusId(req.params.cus_id);
    res.json({ success: true, data: bookings });
  } catch (err) {
    next(err);
  }
};

// NEW: Get booking details separately
exports.getBookingDetails = async (req, res, next) => {
  try {
    const details = await bookService.getBookingDetailsById(req.params.id);
    res.json({ success: true, data: details });
  } catch (err) {
    next(err);
  }
};
exports.createBookingWithDetail = async (req, res, next) => {
  try {
    const { booking, detail } = req.body;

    // Validate required fields
    if (!booking || !detail || !booking.cus_id || !booking.startDate || 
        !booking.endDate || !detail.Room_id) {
      return res.status(400).json({ success: false, message: 'Missing required data' });
    }

    const room = await roomService.getRoomById(detail.Room_id);
    if (!room) {
      return res.status(404).json({ success: false, message: 'Room not found' });
    }
    
    if (room.status.toLowerCase() !== 'available') {
      return res.status(400).json({ 
        success: false, 
        message: 'Room is not available for booking' 
      });
    }

    booking.status = 'pending';
    const result = await bookService.createBookingWithDetail(booking, detail);

    // UPDATE ROOM STATUS TO BOOKED AFTER SUCCESSFUL BOOKING
    await roomService.updateRoomStatus(detail.Room_id, 'booked');

    res.status(201).json({
      success: true,
      message: 'Booking created and room reserved',
      data: result
    });
  } catch (err) {
    next(err);
  }
};

// NEW: Update check-in date
exports.updateCheckIn = async (req, res, next) => {
  try {
    const { checkInDate } = req.body;
    const updated = await bookService.updateCheckInDate(req.params.detailId, checkInDate);
    
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Detail not found' });
    }
    
    res.json({ success: true, message: 'Check-in updated' });
  } catch (err) {
    next(err);
  }
};

// NEW: Update check-out date  
exports.updateCheckOut = async (req, res, next) => {
  try {
    const { checkOutDate } = req.body;
    const updated = await bookService.updateCheckOutDate(req.params.detailId, checkOutDate);
    
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Detail not found' });
    }
    
    res.json({ success: true, message: 'Check-out updated' });
  } catch (err) {
    next(err);
  }
};

exports.updateBookingStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    
    if (!['pending', 'approved', 'rejected', 'checked_in', 'checked_out'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }

    const updated = await bookService.updateStatus(req.params.id, status);
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    res.json({ success: true, message: `Booking ${status}` });
  } catch (err) {
    next(err);
  }
};

exports.deleteBooking = async (req, res, next) => {
  try {
    const deleted = await bookService.deleteBooking(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }
    res.json({ success: true, message: 'Booking deleted' });
  } catch (err) {
    next(err);
  }
};

// Status update helpers
exports.approveBooking = (req, res, next) => updateStatusHelper(req, res, next, 'approved');
exports.rejectBooking = (req, res, next) => updateStatusHelper(req, res, next, 'rejected');
exports.checkInBooking = (req, res, next) => updateStatusHelper(req, res, next, 'checked_in');
exports.checkOutBooking = (req, res, next) => updateStatusHelper(req, res, next, 'checked_out');

async function updateStatusHelper(req, res, next, status) {
  try {
    const updated = await bookService.updateStatus(req.params.id, status);
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }
    res.json({ success: true, message: `Booking ${status.replace('_', ' ')}` });
  } catch (err) {
    next(err);
  }
}