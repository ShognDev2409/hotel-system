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
}

module.exports = new CustomerService();
