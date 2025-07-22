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
            bd.description,
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
            bd.description,
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
            bd.description,
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
        SELECT id, Booking_id, Room_id, description, Check_in_Date, Check_out_Date
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


const getTotalRevenue = async (filters = {}) => {
    let sql = `
        SELECT SUM(total_price) as total 
        FROM booking 
        WHERE status IN ('approved', 'checked_in', 'checked_out')
    `;
    let params = [];
    
    if (filters.month && filters.year) {
        sql += ` AND MONTH(startDate) = ? AND YEAR(startDate) = ?`;
        params.push(filters.month, filters.year);
    } else if (filters.year) {
        sql += ` AND YEAR(startDate) = ?`;
        params.push(filters.year);
    } else if (filters.startDate && filters.endDate) {
        sql += ` AND startDate >= ? AND startDate <= ?`;
        params.push(filters.startDate, filters.endDate);
    }
    
    const [rows] = await db.query(sql, params);
    return rows[0];
};

const getMonthlyRevenue = async (month, year) => {
    const sql = `
        SELECT SUM(total_price) as total 
        FROM booking 
        WHERE MONTH(startDate) = ? 
        AND YEAR(startDate) = ?
        AND status IN ('approved', 'checked_in', 'checked_out')
    `;
    const [rows] = await db.query(sql, [month, year]);
    return rows[0];
};

const getAverageRevenue = async (filters = {}) => {
    let sql = `
        SELECT AVG(total_price) as average 
        FROM booking 
        WHERE status IN ('approved', 'checked_in', 'checked_out')
    `;
    let params = [];
    
    if (filters.month && filters.year) {
        sql += ` AND MONTH(startDate) = ? AND YEAR(startDate) = ?`;
        params.push(filters.month, filters.year);
    } else if (filters.year) {
        sql += ` AND YEAR(startDate) = ?`;
        params.push(filters.year);
    } else if (filters.startDate && filters.endDate) {
        sql += ` AND startDate >= ? AND startDate <= ?`;
        params.push(filters.startDate, filters.endDate);
    }
    
    const [rows] = await db.query(sql, params);
    return rows[0];
};

const getGrowthPercentage = async () => {
    const now = new Date();
    const thisMonth = now.getMonth() + 1;
    const thisYear = now.getFullYear();
    
    const lastMonth = thisMonth === 1 ? 12 : thisMonth - 1;
    const lastYear = thisMonth === 1 ? thisYear - 1 : thisYear;
    
    const thisMonthRevenue = await getMonthlyRevenue(thisMonth, thisYear);
    const lastMonthRevenue = await getMonthlyRevenue(lastMonth, lastYear);
    
    if (!lastMonthRevenue?.total || lastMonthRevenue.total === 0) return 0;
    
    const growth = ((thisMonthRevenue?.total || 0) - lastMonthRevenue.total) / lastMonthRevenue.total * 100;
    return Math.round(growth);
};

const getBookingSummary = async (filters = {}) => {
    let sql = `
        SELECT 
            COUNT(*) as total,
            SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending,
            SUM(CASE WHEN status = 'approved' THEN 1 ELSE 0 END) as approved,
            SUM(CASE WHEN status = 'rejected' THEN 1 ELSE 0 END) as rejected
        FROM booking
    `;
    
    let conditions = [];
    let params = [];
    
    if (filters.startDate) {
        conditions.push('startDate >= ?');
        params.push(filters.startDate);
    }
    
    if (filters.endDate) {
        conditions.push('endDate <= ?');
        params.push(filters.endDate);
    }
    
    if (conditions.length > 0) {
        sql += ' WHERE ' + conditions.join(' AND ');
    }
    
    const [rows] = await db.query(sql, params);
    return rows[0];
};
const getBookingReport = async (filters = {}) => {
    let sql = `
        SELECT 
            b.id as booking_id,
            b.startDate,
            b.endDate,
            b.status,
            b.total_price,
            CONCAT(c.name, ' ', COALESCE(c.last_name, '')) as customer_name,
            r.name as room_name,
            rt.name as room_type_name
        FROM booking b
        LEFT JOIN customer c ON b.cus_id = c.c_id
        LEFT JOIN bookingdetails bd ON b.id = bd.Booking_id
        LEFT JOIN room r ON bd.Room_id = r.id
        LEFT JOIN room_type rt ON r.RoomType_id = rt.id
    `;
    
    let conditions = [];
    let params = [];
    
    // Filter by status
    if (filters.status && filters.status !== 'all') {
        conditions.push('b.status = ?');
        params.push(filters.status);
    }
    
    // Filter by date range
    if (filters.startDate) {
        conditions.push('b.startDate >= ?');
        params.push(filters.startDate);
    }
    
    if (filters.endDate) {
        conditions.push('b.endDate <= ?');
        params.push(filters.endDate);
    }
    
    if (conditions.length > 0) {
        sql += ' WHERE ' + conditions.join(' AND ');
    }
    
    sql += ' ORDER BY b.id DESC';
    
    // Add pagination
    if (filters.limit && filters.offset !== undefined) {
        sql += ' LIMIT ? OFFSET ?';
        params.push(parseInt(filters.limit), parseInt(filters.offset));
    }
    
    const [rows] = await db.query(sql, params);
    return rows;
};

const getBookingReportCount = async (filters = {}) => {
    let sql = `
        SELECT COUNT(DISTINCT b.id) as total
        FROM booking b
        LEFT JOIN customer c ON b.cus_id = c.c_id
        LEFT JOIN bookingdetails bd ON b.id = bd.Booking_id
        LEFT JOIN room r ON bd.Room_id = r.id
    `;
    
    let conditions = [];
    let params = [];
    
    if (filters.status && filters.status !== 'all') {
        conditions.push('b.status = ?');
        params.push(filters.status);
    }
    
    if (filters.startDate) {
        conditions.push('b.startDate >= ?');
        params.push(filters.startDate);
    }
    
    if (filters.endDate) {
        conditions.push('b.endDate <= ?');
        params.push(filters.endDate);
    }
    
    if (conditions.length > 0) {
        sql += ' WHERE ' + conditions.join(' AND ');
    }
    
    const [rows] = await db.query(sql, params);
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
    getTotalRevenue,
    getMonthlyRevenue,
    getAverageRevenue,
    getGrowthPercentage,
    getBookingSummary,
    getBookingReport,
    getBookingReportCount
};