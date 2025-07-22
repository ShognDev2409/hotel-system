const customerService = require('../services/CustomerService');

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
  async getCustomerById (req, res) {
    try {
      console.log(req.params.id);
      const customer = await customerService.getCustomerById(req.params.id);
      res.status(200).json(customer);
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch customer' });
    }
  } ,
  async updateCustomerById(req, res) {
  try {
    const updated = await customerService.updateCustomerById(req.params.id, req.body);
    if (updated) {
      res.status(200).json({ message: 'Customer updated' });
    } else {
      res.status(404).json({ error: 'Customer not found' });
    }
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
},

async deleteCustomerById(req, res) {
  try {
    const deleted = await customerService.deleteCustomerById(req.params.id);
    if (deleted) {
      res.status(200).json({ message: 'Customer deleted' });
    } else {
      res.status(404).json({ error: 'Customer not found' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete customer' });
  }
}

};

module.exports = customerController;
