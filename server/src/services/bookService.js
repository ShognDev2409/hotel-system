const bookRepo = require('../repositories/bookRepository');

async function createBookingWithDetail(booking, detail) {
  const bookingResult = await bookRepo.insertBooking(booking);
  const bookingId = bookingResult.insertId;

  detail.Booking_id = bookingId;
  const detailResult = await bookRepo.insertBookingDetail(detail);
  const detailId = detailResult.insertId;

  return { bookingId, detailId };
}

async function getBookingById(id) {
  const rows = await bookRepo.findBookingById(id);
  if (!rows || rows.length === 0) return null;

  const bookingData = {
    id: rows[0].id,
    User_id: rows[0].User_id,
    startDate: rows[0].startDate,
    endDate: rows[0].endDate,
    status: rows[0].status,
    cus_id: rows[0].cus_id,
    payment_image: rows[0].payment_image,
    details: [],
  };

  for (const row of rows) {
    if (row.detail_id) {
      bookingData.details.push({
        id: row.detail_id,
        Room_id: row.Room_id,
        Check_in_Date: row.Check_in_Date,
        Check_out_Date: row.Check_out_Date,
      });
    }
  }

  return bookingData;
}

async function getAllBookings() {
  const rows = await bookRepo.findAllBookings();
  const bookingMap = new Map();

  for (const row of rows) {
    if (!bookingMap.has(row.id)) {
      bookingMap.set(row.id, {
        id: row.id,
        User_id: row.User_id,
        startDate: row.startDate,
        endDate: row.endDate,
        status: row.status,
        cus_id: row.cus_id,
        payment_image: row.payment_image,
        details: [],
      });
    }
    const booking = bookingMap.get(row.id);
    if (row.detail_id) {
      booking.details.push({
        id: row.detail_id,
        Room_id: row.Room_id,
        Check_in_Date: row.Check_in_Date,
        Check_out_Date: row.Check_out_Date,
      });
    }
  }

  return Array.from(bookingMap.values());
}

async function getBookingHistoryByCusId(cus_id) {
  const rows = await bookRepo.findBookingHistoryByCusId(cus_id);
  const bookingMap = new Map();

  for (const row of rows) {
    if (!bookingMap.has(row.id)) {
      bookingMap.set(row.id, {
        id: row.id,
        User_id: row.User_id,
        startDate: row.startDate,
        endDate: row.endDate,
        status: row.status,
        cus_id: row.cus_id,
        payment_image: row.payment_image,
        details: [],
      });
    }
    const booking = bookingMap.get(row.id);
    if (row.detail_id) {
      booking.details.push({
        id: row.detail_id,
        Room_id: row.Room_id,
        Check_in_Date: row.Check_in_Date,
        Check_out_Date: row.Check_out_Date,
      });
    }
  }

  return Array.from(bookingMap.values());
}

async function updateStatus(id, status) {
  const result = await bookRepo.updateStatus(id, status);
  return result.affectedRows > 0;
}

async function deleteBooking(id) {
  const result = await bookRepo.deleteBooking(id);
  return result.affectedRows > 0;
}

module.exports = {
  createBookingWithDetail,
  getBookingById,
  getAllBookings,
  getBookingHistoryByCusId,
  updateStatus,
  deleteBooking,
};
