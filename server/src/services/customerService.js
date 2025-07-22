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

  async updateCustomerById(id, data) {
    const customer = await customerRepository.findByID(id);
    if (!customer) throw new Error('Customer not found');

    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    }

    return await customerRepository.updateCustomer(id, data);
  }

  async deleteCustomerById(id) {
    const customer = await customerRepository.findByID(id);
    if (!customer) throw new Error('Customer not found');

    return await customerRepository.deleteCustomer(id);
  }

  async getFullCustomerBookingReport() {
    try {
      console.log("📞 Called getFullCustomerBookingReport in service");
      
      // Get report
      console.log("🔍 Fetching customer booking report...");
      const report = await customerRepository.getCustomerBookingReport();
      console.log("📊 Report data received:", JSON.stringify(report, null, 2));
      
      // Get summary
      console.log("🔍 Fetching customer booking summary...");
      const summary = await customerRepository.getCustomerBookingSummary();
      console.log("📈 Summary data received:", JSON.stringify(summary, null, 2));
      
      const result = { 
        report: report || [],
        summary: summary || {}
      };
      
      console.log("✅ Final result to return:", JSON.stringify(result, null, 2));
      return result;
    } catch (error) {
      console.error("❌ Error in getFullCustomerBookingReport:", error);
      throw error; // Re-throw to be handled by the controller
    }
  }

}

module.exports = new CustomerService();
