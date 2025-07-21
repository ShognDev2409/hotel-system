const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Customer = require('../models/customerModel');
const customerRepo = require('../repositories/customerRepository');

exports.register = async (req, res) => {
  const customer = new Customer(req.body);

  try {
    const existing = await customerRepo.findByEmail(customer.email);
    if (existing) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    customer.password = await bcrypt.hash(customer.password, 10);

    const insertId = await customerRepo.createCustomer(customer);

    res.status(201).json({ message: 'Customer registered', c_id: insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await customerRepo.findByEmail(email);
    if (!user) return res.status(400).json({ message: 'Email not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user.c_id, email: user.email }, process.env.JWT_SECRET, {
      expiresIn: '1d',
    });

    res.json({ message: 'Login successful', token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
exports.getAllUsers = async (req, res) => {
  try {
    const users = await customerRepo.getAllCustomers();
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
