const bookRepo = require('../repositories/bookRepository');

// Fixed date formatting function - handles timezone issues
function formatDateToYMD(date) {
    if (!date) return null;
    const d = new Date(date);
    // Use local methods to match database timezone
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}


// Calculate date difference
const getDateDiff = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

// Create booking with detail
const createBookingWithDetail = async function (booking, detail) {
    const total_stay_days = getDateDiff(booking.startDate, booking.endDate);
    
    const room = await bookRepo.getRoomPriceById(detail.Room_id);
    const roomPrice = room?.price || 0;
    
    const total_price = roomPrice * total_stay_days;
    
    booking.total_stay_days = total_stay_days;
    booking.total_price = total_price;
    
    const bookingResult = await bookRepo.insertBooking(booking);
    const bookingId = bookingResult.insertId;
    
    detail.Booking_id = bookingId;
    await bookRepo.insertBookingDetail(detail);
    
    return { bookingId, detailId: detail.Booking_id };
};

// Get booking by ID with proper date formatting
const getBookingById = async (id) => {
    const rows = await bookRepo.findBookingById(id);
    if (!rows || rows.length === 0) return null;
    
    const bookingData = {
        id: rows[0].id,
        User_id: rows[0].User_id,
        startDate: formatDateToYMD(rows[0].startDate),
        endDate: formatDateToYMD(rows[0].endDate),
        status: rows[0].status,
        cus_id: rows[0].cus_id,
        payment_image: rows[0].payment_image,
        total_stay_days: rows[0].total_stay_days,
        total_price: rows[0].total_price,
        details: [],
    };
    
    for (const row of rows) {
        if (row.detail_id) {
            bookingData.details.push({
                id: row.detail_id,
                Room_id: row.Room_id,
                Check_in_Date: formatDateToYMD(row.Check_in_Date),
                Check_out_Date: formatDateToYMD(row.Check_out_Date),
            });
        }
    }
    
    return bookingData;
};

// Get all bookings with consistent date formatting
const getAllBookings = async () => {
    const rows = await bookRepo.findAllBookings();
    const bookingMap = new Map();
    
    for (const row of rows) {
        if (!bookingMap.has(row.id)) {
            bookingMap.set(row.id, {
                id: row.id,
                User_id: row.User_id,
                startDate: formatDateToYMD(row.startDate),
                endDate: formatDateToYMD(row.endDate),
                status: row.status,
                cus_id: row.cus_id,
                payment_image: row.payment_image,
                total_stay_days: row.total_stay_days,
                total_price: row.total_price,
                details: [],
            });
        }
        const booking = bookingMap.get(row.id);
        if (row.detail_id) {
            booking.details.push({
                id: row.detail_id,
                Room_id: row.Room_id,
                Check_in_Date: formatDateToYMD(row.Check_in_Date),
                Check_out_Date: formatDateToYMD(row.Check_out_Date),
            });
        }
    }
    
    return Array.from(bookingMap.values());
};

// Get booking history with consistent date formatting
const getBookingHistoryByCusId = async (cus_id) => {
    const rows = await bookRepo.findBookingHistoryByCusId(cus_id);
    const bookingMap = new Map();
    
    for (const row of rows) {
        if (!bookingMap.has(row.id)) {
            bookingMap.set(row.id, {
                id: row.id,
                User_id: row.User_id,
                startDate: formatDateToYMD(row.startDate),
                endDate: formatDateToYMD(row.endDate),
                status: row.status,
                cus_id: row.cus_id,
                payment_image: row.payment_image,
                total_stay_days: row.total_stay_days,
                total_price: row.total_price,
                details: [],
            });
        }
        const booking = bookingMap.get(row.id);
        if (row.detail_id) {
            booking.details.push({
                id: row.detail_id,
                Room_id: row.Room_id,
                Check_in_Date: formatDateToYMD(row.Check_in_Date),
                Check_out_Date: formatDateToYMD(row.Check_out_Date),
            });
        }
    }
    
    return Array.from(bookingMap.values());
};

// NEW: Get booking details by booking ID (separate endpoint)
const getBookingDetailsById = async (bookingId) => {
    const details = await bookRepo.findBookingDetailsById(bookingId);
    return details.map(detail => ({
        id: detail.id,
        Booking_id: detail.Booking_id,
        Room_id: detail.Room_id,
        Check_in_Date: formatDateToYMD(detail.Check_in_Date),
        Check_out_Date: formatDateToYMD(detail.Check_out_Date),
    }));
};

// NEW: Update check-in date for specific booking detail
const updateCheckInDate = async (detailId, checkInDate) => {
    const result = await bookRepo.updateCheckInDate(detailId, checkInDate);
    return result.affectedRows > 0;
};

// NEW: Update check-out date for specific booking detail
const updateCheckOutDate = async (detailId, checkOutDate) => {
    const result = await bookRepo.updateCheckOutDate(detailId, checkOutDate);
    return result.affectedRows > 0;
};

const updateStatus = async (id, status) => {
    const result = await bookRepo.updateStatus(id, status);
    return result.affectedRows > 0;
};

const deleteBooking = async (id) => {
    const result = await bookRepo.deleteBooking(id);
    return result.affectedRows > 0;
};

exports.updateCheckOut = async (req, res, next) => {
    try {
      const { checkOutDate } = req.body;
      const updated = await bookService.updateCheckOutDate(req.params.detailId, checkOutDate);
      
      if (!updated) {
        return res.status(404).json({ success: false, message: 'Detail not found' });
      }
      
      // GET ROOM ID FROM BOOKING DETAIL
      const detail = await bookService.getBookingDetailById(req.params.detailId);
      if (detail && detail.Room_id) {
        // FREE THE ROOM AFTER CHECKOUT
        await roomService.updateRoomStatus(detail.Room_id, 'available');
      }
      
      res.json({ success: true, message: 'Check-out completed and room available' });
    } catch (err) {
      next(err);
    }
  };
module.exports = {
    createBookingWithDetail,
    getBookingById,
    getAllBookings,
    getBookingHistoryByCusId,
    getBookingDetailsById,
    updateCheckInDate,
    updateCheckOutDate,
    updateStatus,
    deleteBooking,
};