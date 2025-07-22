const EmployeeService = require('../services/employeeService');

const EmployeeController = {
  async getEmployeeList(req, res) {
    const employees = await EmployeeService.getAllEmployees();
    res.json(employees);
  },

  async getEmployeeById(req, res) {
    const id = req.params.id;
    const employee = await EmployeeService.getEmployeeById(id);
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    res.json(employee);
  },

  async createEmployee(req, res) {
    const newEmployee = req.body;
    const id = await EmployeeService.createEmployee(newEmployee);
    res.status(201).json({ message: 'Employee created', id });
  },

  async updateEmployee(req, res) {
    const id = req.params.id;
    const updatedData = req.body;
    const updated = await EmployeeService.updateEmployee(id, updatedData);
    if (!updated) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    res.json({ message: 'Employee updated' });
  },

  async deleteEmployee(req, res) {
    const id = req.params.id;
    const deleted = await EmployeeService.deleteEmployee(id);
    if (!deleted) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    res.json({ message: 'Employee deleted' });
  }
};

module.exports = EmployeeController;
