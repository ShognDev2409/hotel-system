const bookService = require('../services/bookService');

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
    const cus_id = req.params.cus_id;
    const bookings = await bookService.getBookingHistoryByCusId(cus_id);
    res.json({ success: true, data: bookings });
  } catch (err) {
    next(err);
  }
};

exports.createBookingWithDetail = async (req, res, next) => {
  try {
    const { booking, detail } = req.body;

    if (
      !booking || !detail ||
      !booking.User_id || !booking.cus_id || !booking.startDate || !booking.endDate || !booking.payment_image ||
      !detail.Room_id || !detail.Check_in_Date || !detail.Check_out_Date
    ) {
      return res.status(400).json({ success: false, message: 'Missing booking or detail data' });
    }

    booking.status = 'pending';

    const result = await bookService.createBookingWithDetail(booking, detail);

    res.status(201).json({
      success: true,
      message: 'Booking and detail created',
      booking_id: result.bookingId,
      detail_id: result.detailId,
    });
  } catch (err) {
    next(err);
  }
};

exports.updateBookingStatus = async (req, res, next) => {
  try {
    const id = req.params.id;
    const status = req.body.status;

    if (!['pending', 'approved', 'rejected'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }

    const updated = await bookService.updateStatus(id, status);
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
    const id = req.params.id;
    const deleted = await bookService.deleteBooking(id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }
    res.json({ success: true, message: 'Booking deleted' });
  } catch (err) {
    next(err);
  }
};

exports.approveBooking = (req, res, next) => updateStatusHandler(req, res, next, 'approved');
exports.rejectBooking = (req, res, next) => updateStatusHandler(req, res, next, 'rejected');
exports.checkInBooking = (req, res, next) => updateStatusHandler(req, res, next, 'checked_in');
exports.checkOutBooking = (req, res, next) => updateStatusHandler(req, res, next, 'checked_out');

async function updateStatusHandler(req, res, next, status) {
  try {
    const id = req.params.id;
    const updated = await bookingService.updateStatus(id, status);
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }
    res.json({ success: true, message: `Booking ${status.replace('_', ' ')}` });
  } catch (err) {
    next(err);
  }
}