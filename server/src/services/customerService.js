const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const customerRepository = require('../repositories/customerRepository');

class CustomerService {
  async register(data) {
    const existingCustomer = await customerRepository.findByEmail(data.email);
    if (existingCustomer) throw new Error('Email already registered');

    const hashedPassword = await bcrypt.hash(data.password, 10);
    const customerData = { ...data, password: hashedPassword };
    const id = await customerRepository.createCustomer(customerData);
    return { id };
  }

  async login({ email, password }) {
    const customer = await customerRepository.findByEmail(email);
    if (!customer) throw new Error('Invalid email or password');

    const match = await bcrypt.compare(password, customer.password);
    if (!match) throw new Error('Invalid email or password');

    const token = jwt.sign({ c_id: customer.c_id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    return { token, customer };
  }

  async getCustomerList() {
    return await customerRepository.getAllCustomers();
  }

  async getCustomerById(id) {
    return await customerRepository.findByID(id);
  }

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
}

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

  
}

module.exports = new CustomerService();
