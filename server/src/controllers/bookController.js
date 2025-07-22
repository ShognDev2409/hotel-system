const bookService = require('../services/bookService');
const roomService = require('../services/roomService');

function getTimestamp() {
 const now = new Date();

  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0'); // 01–12
  const day = String(now.getDate()).padStart(2, '0');       // 01–31

  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

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
        !booking.endDate || !detail.Room_id ) {
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

    // Add emp_id to the booking
    
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

exports.getDashboardStats = async (req, res, next) => {
  try {
    const totalRevenue = await bookService.getTotalRevenue();
    const thisMonthRevenue = await bookService.getThisMonthRevenue();
    const averageRevenue = await bookService.getAverageRevenue();
    const growthPercentage = await bookService.getGrowthPercentage();

    res.json({
      success: true,
      data: {
        totalRevenue: Math.round(totalRevenue),
        thisMonthRevenue: Math.round(thisMonthRevenue),
        averageRevenue: Math.round(averageRevenue),
        growthPercentage: growthPercentage
      }
    });
  } catch (err) {
    next(err);
  }
};
// NEW: Update check-in date
exports.updateCheckIn = async (req, res, next) => {
  try {
    const { checkInDate } = req.body;
    const datenow = getTimestamp();
    const updated = await bookService.updateCheckInDate(req.params.detailId, datenow);
    
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Detail not found' });
    }
    
     const detail = await bookService.getBookingDetailsById(req.params.detailId);
      if (detail && detail.Room_id) {
        console.log(`Updating room status for Room ID: ${detail.Room_id}`);
        // Update room status to 'booked'
        await roomService.updateRoomStatus(detail.Room_id, 'booked');
        console.log(`Room status updated to 'booked' for Room ID: ${detail.Room_id}`);
      }

      res.json({ success: true, message: 'Check-In completed and room booked' ,
         data: {
          detailId: req.params.detailId,
             roomId: detail.Room_id,
          checkOutDate: datenow,
          timestamp: getTimestamp()
        }
      });
  } catch (err) {
    next(err);
  }
};

exports.updateCheckOut = async (req, res, next) => {
    try {
      const { checkOutDate } = req.body;
      const datenow = getTimestamp();
      const updated = await bookService.updateCheckOutDate(req.params.detailId, datenow);
      
      if (!updated) {
        return res.status(404).json({ success: false, message: 'Detail not found' });
      }
      
      const detail = await bookService.getBookingDetailsById(req.params.detailId);
      
      if (detail && detail.Room_id) {
        await roomService.updateRoomStatus(detail.Room_id, 'available');
              console.log(`Room status updated to 'available' for Room ID: ${detail.Room_id}`);
      }
      
      res.json({ success: true, message: 'Check-out completed and room available' ,
        data: {
          detailId: req.params.detailId,
          roomId: detail.Room_id,
          checkOutDate: datenow,
          timestamp: getTimestamp()
        }

      });
    } catch (err) {
      next(err);
    }
  };

// Get dashboard summary with optional month/year filtering
exports.getDashboardSummary = async (req, res, next) => {
  try {
    // Get query parameters for filtering
    const { month, year, startDate, endDate } = req.query;
    
    // Prepare filters object based on provided query params
    const filters = {};
    if (month && year) {
      filters.month = parseInt(month, 10);
      filters.year = parseInt(year, 10);
    } else if (startDate && endDate) {
      filters.startDate = startDate;
      filters.endDate = endDate;
    } else if (year) {
      filters.year = parseInt(year, 10);
    }

    // Get all metrics in parallel
    const [
      totalRevenue,
      thisMonthRevenue,
      averageRevenue,
      growthData
    ] = await Promise.all([
      bookService.getTotalRevenue(filters),
      bookService.getThisMonthRevenue(
        filters.month || new Date().getMonth() + 1,
        filters.year || new Date().getFullYear()
      ),
      bookService.getAverageRevenue(filters),
      bookService.getGrowthPercentage(
        filters.month || new Date().getMonth() + 1,
        filters.year || new Date().getFullYear()
      )
    ]);

    // Prepare and send response
    res.json({
      success: true,
      data: {
        totalRevenue: Math.round(totalRevenue),
        thisMonthRevenue: Math.round(thisMonthRevenue),
        averageRevenue: Math.round(averageRevenue),
        growthPercentage: growthData.percentage,
        direction: growthData.direction,
        comparison: growthData.comparison,
        filters: {
          month: filters.month || null,
          year: filters.year || new Date().getFullYear(),
          startDate: filters.startDate || null,
          endDate: filters.endDate || null
        },
        currency: 'LAK'
      }
    });
  } catch (err) {
    next(err);
  }
};

exports.getBookingReport = async (req, res, next) => {
  try {
    const filters = {
      status: req.query.status || 'all',
      startDate: req.query.startDate,
      endDate: req.query.endDate,
      limit: req.query.limit || 50,
      offset: req.query.offset || 0
    };
    
    const result = await bookService.getBookingReport(filters);
    const summary = await bookService.getBookingSummary(filters);
    
    res.json({
      success: true,
      data: result.data,
      summary: summary,
      pagination: result.pagination,
      filters: result.filters
    });
  } catch (err) {
    next(err);
  }
};

exports.getCheckinReport = async (req, res, next) => {
  try {
    const filters = {
      date: req.query.date, // Format: 2025-07-22
      status: req.query.status // 'checked_in', 'checked_out', or 'all'
    };
    
    const result = await bookService.getCheckinReport(filters);
    
    res.json({
      success: true,
      summary: result.summary,
      data: result.data,
      filters: filters
    });
  } catch (err) {
    next(err);
  }
};
