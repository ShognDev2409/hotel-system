const authService = require('../services/authService');

class AuthController {
  async loginAdmin(req, res) {
    try {
      const { email, password } = req.body;
      
      if (!email || !password) {
        return res.status(400).json({ 
          success: false, 
          message: 'Email and password are required' 
        });
      }
      
      const result = await authService.loginAdmin(email, password);
      
      res.status(200).json({
        success: true,
        message: 'Admin login successful',
        data: result
      });
      
    } catch (error) {
      res.status(401).json({
        success: false,
        message: error.message || 'Authentication failed',
        error: process.env.NODE_ENV === 'development' ? error.stack : {}
      });
    }
  }
}

module.exports = new AuthController();
