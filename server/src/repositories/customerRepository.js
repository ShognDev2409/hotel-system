const pool = require('../config/database');

exports.findByEmail = async (email) => {
  const [rows] = await pool.query('SELECT * FROM customer WHERE email = ?', [email]);
  return rows[0];
};
exports.findByID = async (id) => {
  const [rows] = await pool.query('SELECT c_id, name, last_name, gender, tel, email, address, password FROM customer WHERE c_id =?', [id])
  return rows[0];
}
exports.createCustomer = async (customerData) => {
  const [result] = await pool.query(
    `INSERT INTO customer (name, last_name, gender, birthday, tel, email, address, password)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      customerData.name,
      customerData.last_name,
      customerData.gender,
      customerData.birthday,
      customerData.tel,
      customerData.email,
      customerData.address,
      customerData.password
    ]
  );
  return result.insertId;
};
exports.getAllCustomers = async () => {
  const [rows] = await pool.query(`
    SELECT c_id, name, last_name, gender, birthday, tel, email, address
    FROM customer
  `);
  return rows;
};
exports.updateCustomer = async (id, data) => {
  const fields = [];
  const values = [];

  for (const [key, value] of Object.entries(data)) {
    fields.push(`${key} = ?`);
    values.push(value);
  }

  if (fields.length === 0) throw new Error('No fields to update');

  const sql = `UPDATE customer SET ${fields.join(', ')} WHERE c_id = ?`;
  values.push(id);

  const [result] = await pool.query(sql, values);
  return result;
};

exports.deleteCustomer = async (id) => {
  const [result] = await pool.query('DELETE FROM customer WHERE c_id = ?', [id]);
  return result;
};


exports.getCustomerBookingReport = async () => {
  try {
    const sql = `
      SELECT 
          c.c_id,
          CONCAT(c.name, ' ', COALESCE(c.last_name, '')) AS customer_name,
          COUNT(b.id) AS total_bookings,
          SUM(b.total_price) AS total_spent
      FROM customer c
      LEFT JOIN booking b ON c.c_id = b.cus_id
        AND b.status IN ('approved', 'checked_in', 'checked_out')
      GROUP BY c.c_id
      ORDER BY total_spent DESC
    `;
    console.log('Executing SQL:', sql);
    const [rows] = await pool.query(sql);
    console.log('Query result:', JSON.stringify(rows, null, 2));
    return rows;
  } catch (error) {
    console.error('Error in getCustomerBookingReport:', error);
    throw error;
  }
};

exports.getCustomerBookingSummary = async () => {
  try {
    const sql = `
      SELECT 
          COUNT(DISTINCT b.cus_id) AS total_customers,
          COUNT(b.id) AS total_bookings,
          SUM(b.total_price) AS total_revenue
      FROM booking b
      WHERE b.status IN ('approved', 'checked_in', 'checked_out')
    `;
    console.log('Executing summary SQL:', sql);
    const [rows] = await pool.query(sql);
    console.log('Summary result:', JSON.stringify(rows[0], null, 2));
    return rows[0];
  } catch (error) {
    console.error('Error in getCustomerBookingSummary:', error);
    throw error;
  }
};
