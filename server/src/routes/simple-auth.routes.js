const express = require('express');
const router = express.Router();

// Simple login endpoint
router.post('/login', (req, res) => {
  res.json({ success: true, message: 'Login endpoint is working!' });
});

// Simple register endpoint
router.post('/register', (req, res) => {
  res.status(201).json({ success: true, message: 'Register endpoint is working!' });
});

module.exports = router;
