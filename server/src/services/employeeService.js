const EmployeeRepository = require('../repositories/employeeRepository');

const EmployeeService = {
  getAllEmployees: () => EmployeeRepository.getAll(),
  getEmployeeById: (id) => EmployeeRepository.getById(id),
  createEmployee: (data) => EmployeeRepository.create(data),
  updateEmployee: (id, data) => EmployeeRepository.update(id, data),
  deleteEmployee: (id) => EmployeeRepository.delete(id),
};

module.exports = EmployeeService;
