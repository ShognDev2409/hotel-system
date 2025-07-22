const customerService = require('../services/CustomerService');
console.log("✅ customerController loaded");
const customerController = {
  async register(req, res) {
    try {
      const result = await customerService.register(req.body);
      res.status(201).json({ message: 'Customer created', id: result.id });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  async login(req, res) {
    try {
      const result = await customerService.login(req.body);
      res.status(200).json(result);
    } catch (err) {
      res.status(401).json({ error: err.message });
    }
  },

  async getCustomerList(req, res) {
    try {
      const customers = await customerService.getCustomerList();
      res.status(200).json(customers);
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch customers' });
    }
  },
  async getCustomerById(req, res) {
    try {
      console.log(req.params.id);
      const customer = await customerService.getCustomerById(req.params.id);
      res.status(200).json(customer);
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch customer' });
    }
  },
  async updateCustomerById(req, res) {
    try {
      const id = req.params.id;
      const result = await customerService.updateCustomerById(id, req.body);
      res.status(200).json({ message: 'Customer updated successfully', result });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  async deleteCustomerById(req, res) {
    try {
      const id = req.params.id;
      await customerService.deleteCustomerById(id);
      res.status(200).json({ message: 'Customer deleted successfully' });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  async getFullCustomerBookingReport(req, res) {
    try {
      console.log("🔍 Reached getFullCustomerBookingReport endpoint");
      const result = await customerService.getFullCustomerBookingReport();
      console.log("✅ Result from service:", result);
      res.status(200).json(result);
    } catch (err) {
      console.error("❌ Error in getFullCustomerBookingReport:", err);
      res.status(500).json({ error: 'Failed to fetch booking report' });
    }
  }
};

module.exports = customerController;
