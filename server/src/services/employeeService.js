const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const employeeRepository = require('../repositories/employeeRepository');

class EmployeeService {
  getAllEmployees() {
    return employeeRepository.getAll();
  }

  getEmployeeById(id) {
    return employeeRepository.getById(id);
  }

  createEmployee(employee) {
    return employeeRepository.create(employee);
  }

  updateEmployee(id, employee) {
    return employeeRepository.update(id, employee);
  }

  deleteEmployee(id) {
    return employeeRepository.delete(id);
  }

  async login({ name, password }) {
    const employee = await employeeRepository.findByEmail(name);
    if (!employee) throw new Error('Invalid name or password');
    
    // Check if user is admin
    if (employee.role !== 'admin') {
      throw new Error('Access denied. Admin privileges required.');
    }

    const match = await bcrypt.compare(password, employee.password);
    if (!match) throw new Error('Invalid name or password');

    const token = jwt.sign(
      { e_id: employee.e_id, role: employee.role }, 
      process.env.JWT_SECRET, 
      { expiresIn: '24h' }
    );
    
    // Remove password from the response
    const { password: _, ...employeeWithoutPassword } = employee;
    
    return { token, employee: employeeWithoutPassword };
  }

  
}

module.exports = new EmployeeService();
