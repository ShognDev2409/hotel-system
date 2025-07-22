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


