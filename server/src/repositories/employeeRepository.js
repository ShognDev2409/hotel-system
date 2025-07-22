const db = require('../config/database');

const EmployeeRepository = {
  async getAll() {
    const [rows] = await db.query('SELECT * FROM employee');
    return rows;
  },

  async getById(id) {
    const [rows] = await db.query('SELECT * FROM employee WHERE e_id = ?', [id]);
    return rows[0];
  },

  async create(employee) {
    const [result] = await db.query(
      `INSERT INTO employee 
      (name, last_name, gender, birthday, tel, idcard, District_id, Province_, village_id, role) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [employee.name, employee.last_name, employee.gender, employee.birthday, employee.tel,
       employee.idcard, employee.District_id, employee.Province_, employee.village_id, employee.role]
    );
    return result.insertId;
  },

  async update(id, employee) {
    const [result] = await db.query(
      `UPDATE employee SET 
        name = ?, last_name = ?, gender = ?, birthday = ?, tel = ?, 
        idcard = ?, District_id = ?, Province_ = ?, village_id = ?, role = ?
      WHERE e_id = ?`,
      [employee.name, employee.last_name, employee.gender, employee.birthday, employee.tel,
       employee.idcard, employee.District_id, employee.Province_, employee.village_id, employee.role, id]
    );
    return result.affectedRows;
  },

  async delete(id) {
    const [result] = await db.query('DELETE FROM employee WHERE e_id = ?', [id]);
    return result.affectedRows;
  }
};

module.exports = EmployeeRepository;
