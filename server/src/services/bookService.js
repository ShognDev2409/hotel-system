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

  const getTotalRevenue = async (filters = {}) => {
    const result = await bookRepo.getTotalRevenue(filters);
    return result?.total || 0;
};

const getThisMonthRevenue = async (month, year) => {
    const targetMonth = month || new Date().getMonth() + 1;
    const targetYear = year || new Date().getFullYear();
    const result = await bookRepo.getMonthlyRevenue(targetMonth, targetYear);
    return result?.total || 0;
};

const getAverageRevenue = async (filters = {}) => {
    const result = await bookRepo.getAverageRevenue(filters);
    return result?.average || 0;
};

const getGrowthPercentage = async (month, year) => {
    const targetMonth = month || new Date().getMonth() + 1;
    const targetYear = year || new Date().getFullYear();
    
    const prevMonth = targetMonth === 1 ? 12 : targetMonth - 1;
    const prevYear = targetMonth === 1 ? targetYear - 1 : targetYear;
    
    const thisMonthRevenue = await bookRepo.getMonthlyRevenue(targetMonth, targetYear);
    const lastMonthRevenue = await bookRepo.getMonthlyRevenue(prevMonth, prevYear);
    
    const thisAmount = thisMonthRevenue?.total || 0;
    const lastAmount = lastMonthRevenue?.total || 0;
    
    let percentage = 0;
    let direction = 'stable';
    
    if (lastAmount > 0) {
        percentage = Math.round(((thisAmount - lastAmount) / lastAmount) * 100);
        direction = percentage > 0 ? 'up' : percentage < 0 ? 'down' : 'stable';
    } else if (thisAmount > 0) {
        percentage = 100;
        direction = 'up';
    }
    
    return {
        percentage: Math.abs(percentage),
        direction,
        comparison: {
            thisMonth: thisAmount,
            lastMonth: lastAmount,
            difference: thisAmount - lastAmount
        }
    };
};
const getBookingReport = async (filters = {}) => {
    const reports = await bookRepo.getBookingReport(filters);
    const count = await bookRepo.getBookingReportCount(filters);
    
    return {
        data: reports.map(report => ({
            booking_id: report.booking_id,
            customer_name: report.customer_name,
            room_name: report.room_name,
            room_type: report.room_type_name,
            start_date: formatDateToYMD(report.startDate),
            end_date: formatDateToYMD(report.endDate),
            status: report.status,
            total_price: report.total_price
        })),
        total: count.total,
        filters: filters
    };
};

const getBookingSummary = async (filters = {}) => {
    const result = await bookRepo.getBookingSummary(filters);
    return result;
};

const getCheckinReport = async (filters = {}) => {
    const reports = await bookRepo.getCheckinReport(filters);
    const summary = await bookRepo.getCheckinSummary(filters); // ← This calls the summary method
    
    return {
        summary: {
            total_checkins: summary.total_checkins || 0,
            currently_staying: summary.currently_staying || 0,
            checked_out: summary.checked_out || 0,
            pending_checkin: summary.pending_checkin || 0,
            occupancy_rate: summary.occupancy_rate || 0,
            avg_stay_days: summary.avg_stay_days || 0,
            total_revenue: summary.total_revenue || 0
        },
        data: reports.map(report => ({
            checkin_id: report.checkin_id,
            customer_name: report.customer_name,
            room_name: report.room_name,
            checkin_date: formatDateToYMD(report.startDate),
            checkout_date: formatDateToYMD(report.endDate),
            total_stay_days: report.total_stay_days,
            status: report.status_lao,
            status_raw: report.status
        }))
    };
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
    getTotalRevenue,
    getThisMonthRevenue,
    getAverageRevenue,
    getGrowthPercentage,
    getBookingReport,
    getBookingSummary,
    getCheckinReport
};