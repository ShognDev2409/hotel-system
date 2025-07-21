const healthService = require('../services/healthService');

exports.checkHealth = (req, res) => {
  console.log('📥 Controller: Received health check request');
  const message = healthService.getHealthStatus();
  res.status(200).json({ message });
};
