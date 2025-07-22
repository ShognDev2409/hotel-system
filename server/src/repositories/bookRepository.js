const db = require('../config/database');

const insertBooking = async (booking) => {
    const sql = `
        INSERT INTO booking 
        (User_id, startDate, endDate, status, cus_id, payment_image, total_stay_days, total_price)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
    
    const params = [
        booking.User_id,
        booking.startDate,
        booking.endDate,
        booking.status,
        booking.cus_id,
        booking.payment_image,
        booking.total_stay_days,
        booking.total_price,
    ];
    
    const [result] = await db.query(sql, params);
    return result;
};

const insertBookingDetail = async (detail) => {
    const sql = `INSERT INTO bookingdetails 
        (Booking_id, Room_id, description) VALUES (?, ?, ?)`;
    const params = [detail.Booking_id, detail.Room_id, detail.description];
    const [result] = await db.query(sql, params);
    return result;
};
const findBookingById = async (id) => {
    const sql = `
        SELECT 
            b.*,
            bd.id AS detail_id, 
            bd.Room_id, 
            bd.Check_in_Date, 
            bd.Check_out_Date
        FROM booking b
        LEFT JOIN bookingdetails bd ON b.id = bd.Booking_id
        WHERE b.id = ?`;
    
    const [rows] = await db.query(sql, [id]);
    return rows;
};

const findAllBookings = async () => {
    const sql = `
        SELECT 
            b.*,
            bd.id AS detail_id, 
            bd.Room_id, 
            bd.Check_in_Date, 
            bd.Check_out_Date
        FROM booking b
        LEFT JOIN bookingdetails bd ON b.id = bd.Booking_id
        ORDER BY b.id DESC`;
    
    const [rows] = await db.query(sql);
    return rows;
};

const findBookingHistoryByCusId = async (cus_id) => {
    const sql = `
        SELECT 
            b.*,
            bd.id AS detail_id, 
            bd.Room_id, 
            bd.Check_in_Date, 
            bd.Check_out_Date
        FROM booking b
        LEFT JOIN bookingdetails bd ON b.id = bd.Booking_id
        WHERE b.cus_id = ?
        ORDER BY b.startDate DESC`;
    
    const [rows] = await db.query(sql, [cus_id]);
    return rows;
};

// NEW: Find booking details by booking ID
const findBookingDetailsById = async (bookingId) => {
    const sql = `
        SELECT id, Booking_id, Room_id, Check_in_Date, Check_out_Date
        FROM bookingdetails 
        WHERE Booking_id = ?`;
    
    const [rows] = await db.query(sql, [bookingId]);
    return rows;
};

// NEW: Update check-in date
const updateCheckInDate = async (detailId, checkInDate) => {
    const sql = `UPDATE bookingdetails SET Check_in_Date = ? WHERE id = ?`;
    const [result] = await db.query(sql, [checkInDate, detailId]);
    return result;
};

// NEW: Update check-out date
const updateCheckOutDate = async (detailId, checkOutDate) => {
    const sql = `UPDATE bookingdetails SET Check_out_Date = ? WHERE id = ?`;
    const [result] = await db.query(sql, [checkOutDate, detailId]);
    return result;
};

const updateStatus = async (id, status) => {
    const sql = `UPDATE booking SET status = ? WHERE id = ?`;
    const [result] = await db.query(sql, [status, id]);
    return result;
};

const deleteBooking = async (id) => {
    const sql = `DELETE FROM booking WHERE id = ?`;
    const [result] = await db.query(sql, [id]);
    return result;
};

const getRoomPriceById = async (roomId) => {
    const [rows] = await db.query("SELECT price FROM room WHERE id = ?", [roomId]);
    return rows[0];
};

module.exports = {
    insertBooking,
    insertBookingDetail,
    findBookingById,
    findAllBookings,
    findBookingHistoryByCusId,
    findBookingDetailsById,
    updateCheckInDate,
    updateCheckOutDate,
    updateStatus,
    deleteBooking,
    getRoomPriceById,
};