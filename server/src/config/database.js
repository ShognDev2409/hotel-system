// src/config/database.js
const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME || 'hotel_booking_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Optional: log on connect
pool.getConnection()
  .then(() => console.log('✅ Successfully connected to the database'))
  .catch((err) => console.error('❌ Database connection failed:', err));

module.exports = pool;
