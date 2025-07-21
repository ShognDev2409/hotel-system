const db = require('../config/database');

async function insertBooking(booking) {
  const sql = `INSERT INTO booking (User_id, startDate, endDate, status, cus_id, payment_image) VALUES (?, ?, ?, ?, ?, ?)`;
  const params = [booking.User_id, booking.startDate, booking.endDate, booking.status, booking.cus_id, booking.payment_image];
  const [result] = await db.query(sql, params);
  return result;
}

async function insertBookingDetail(detail) {
  const sql = `INSERT INTO bookingdetails (Booking_id, Room_id, Check_in_Date, Check_out_Date) VALUES (?, ?, ?, ?)`;
  const params = [detail.Booking_id, detail.Room_id, detail.Check_in_Date, detail.Check_out_Date];
  const [result] = await db.query(sql, params);
  return result;
}

async function findBookingById(id) {
  const sql = `
    SELECT b.*, bd.id AS detail_id, bd.Room_id, bd.Check_in_Date, bd.Check_out_Date
    FROM booking b
    LEFT JOIN bookingdetails bd ON b.id = bd.Booking_id
    WHERE b.id = ?`;
  const [rows] = await db.query(sql, [id]);
  return rows;
}

async function findAllBookings() {
  const sql = `
    SELECT b.*, bd.id AS detail_id, bd.Room_id, bd.Check_in_Date, bd.Check_out_Date
    FROM booking b
    LEFT JOIN bookingdetails bd ON b.id = bd.Booking_id
    ORDER BY b.id DESC`;
  const [rows] = await db.query(sql);
  return rows;
}

async function findBookingHistoryByCusId(cus_id) {
  const sql = `
    SELECT b.*, bd.id AS detail_id, bd.Room_id, bd.Check_in_Date, bd.Check_out_Date
    FROM booking b
    LEFT JOIN bookingdetails bd ON b.id = bd.Booking_id
    WHERE b.cus_id = ?
    ORDER BY b.startDate DESC`;
  const [rows] = await db.query(sql, [cus_id]);
  return rows;
}

async function updateStatus(id, status) {
  const sql = 'UPDATE booking SET status = ? WHERE id = ?';
  const [result] = await db.query(sql, [status, id]);
  return result;
}

async function deleteBooking(id) {
  const sql = 'DELETE FROM booking WHERE id = ?';
  const [result] = await db.query(sql, [id]);
  return result;
}

module.exports = {
  insertBooking,
  insertBookingDetail,
  findBookingById,
  findAllBookings,
  findBookingHistoryByCusId,
  updateStatus,
  deleteBooking,
};
