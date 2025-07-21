const { validationResult } = require('express-validator');
const authService = require('../services/auth.service');
const ApiError = require('../utils/apiError');

class AuthController {
  async register(req, res, next) {
    try {
      // 1. Validate request
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw new ApiError('Validation failed', 400, errors.array());
      }

      // 2. Register new user
      const result = await authService.register(req.body);
      
      // 3. Send response
      res.status(201).json({
        success: true,
        data: result
      });
    } catch (error) {
      next(error);
    }
  }

  async login(req, res, next) {
    try {
      // 1. Validate request
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw new ApiError('Validation failed', 400, errors.array());
      }

      const { email, password } = req.body;
      
      // 2. Authenticate user
      const result = await authService.login(email, password);
      
      // 3. Send response
      res.status(200).json({
        success: true,
        data: result
      });
    } catch (error) {
      next(error);
    }
  }

  async requestPasswordReset(req, res, next) {
    try {
      // 1. Validate request
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw new ApiError('Validation failed', 400, errors.array());
      }

      const { email } = req.body;
      
      // 2. Request password reset
      await authService.requestPasswordReset(email);
      
      // 3. Send response (don't reveal if email exists for security)
      res.status(200).json({
        success: true,
        message: 'If an account with that email exists, a password reset link has been sent.'
      });
    } catch (error) {
      next(error);
    }
  }

  async resetPassword(req, res, next) {
    try {
      // 1. Validate request
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw new ApiError('Validation failed', 400, errors.array());
      }

      const { token, newPassword } = req.body;
      
      // 2. Reset password
      await authService.resetPassword(token, newPassword);
      
      // 3. Send response
      res.status(200).json({
        success: true,
        message: 'Password has been reset successfully.'
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AuthController();
