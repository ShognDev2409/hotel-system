const employeeService = require('../services/employeeService');

const employeeController = {
  async login(req, res) {
    try {
      const result = await employeeService.login(req.body);
      res.status(200).json(result);
    } catch (err) {
      res.status(401).json({ error: err.message });
    }
  },

  async getEmployeeList(req, res) {
    try {
      const employees = await employeeService.getAllEmployees();
      res.json(employees);
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch employees' });
    }
  },

  async getEmployeeById(req, res) {
    try {
      const id = req.params.id;
      const employee = await employeeService.getEmployeeById(id);
      if (!employee) {
        return res.status(404).json({ message: 'Employee not found' });
      }
      res.json(employee);
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch employee' });
    }
  },

  async createEmployee(req, res) {
    try {
      const newEmployee = req.body;
      const id = await employeeService.createEmployee(newEmployee);
      res.status(201).json({ message: 'Employee created', id });
    } catch (err) {
      res.status(500).json({ error: 'Failed to create employee' });
    }
  },

  async updateEmployee(req, res) {
    try {
      const id = req.params.id;
      const updatedData = req.body;
      const updated = await employeeService.updateEmployee(id, updatedData);
      if (!updated) {
        return res.status(404).json({ message: 'Employee not found' });
      }
      res.json({ message: 'Employee updated' });
    } catch (err) {
      res.status(500).json({ error: 'Failed to update employee' });
    }
  },

  async deleteEmployee(req, res) {
    try {
      const id = req.params.id;
      const deleted = await employeeService.deleteEmployee(id);
      if (!deleted) {
        return res.status(404).json({ message: 'Employee not found' });
      }
      res.json({ message: 'Employee deleted' });
    } catch (err) {
      res.status(500).json({ error: 'Failed to delete employee' });
    }
  }
};

module.exports = employeeController;
