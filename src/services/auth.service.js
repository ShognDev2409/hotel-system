const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const userRepository = require('../repositories/user.repository');
const ApiError = require('../utils/apiError');

class AuthService {
  async register(userData) {
    try {
      // 1. Check if user already exists
      const existingUser = await userRepository.findByEmail(userData.email);
      if (existingUser) {
        throw new ApiError('Email already in use', 400);
      }

      // 2. Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(userData.password, salt);

      // 3. Create user
      const newUser = await userRepository.create({
        ...userData,
        password: hashedPassword
      });

      // 4. Generate token
      const token = this.generateToken(newUser);

      return {
        user: newUser.toJSON(),
        token
      };
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }

  async login(email, password) {
    try {
      // 1. Find user by email
      const user = await userRepository.findByEmail(email);
      if (!user) {
        throw new ApiError('Invalid credentials', 401);
      }

      // 2. Verify password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        throw new ApiError('Invalid credentials', 401);
      }

      // 3. Generate JWT token
      const token = this.generateToken(user);
      
      // 4. Return user data (without password) and token
      return {
        user: user.toJSON(),
        token
      };
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  async requestPasswordReset(email) {
    try {
      // 1. Find user by email
      const user = await userRepository.findByEmail(email);
      if (!user) {
        // Don't reveal if user doesn't exist for security
        return { success: true };
      }

      // 2. Generate reset token
      const resetToken = crypto.randomBytes(32).toString('hex');
      const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour from now

      // 3. Save reset token to user
      await userRepository.update(user.id, {
        resetToken,
        resetTokenExpiry
      });

      // TODO: Send email with reset link
      // await this.sendPasswordResetEmail(user.email, resetToken);

      return { success: true };
    } catch (error) {
      console.error('Password reset request error:', error);
      throw new ApiError('Error requesting password reset', 500);
    }
  }

  async resetPassword(token, newPassword) {
    try {
      // 1. Find user by reset token
      const [users] = await userRepository.pool.query(
        'SELECT * FROM users WHERE resetToken = ? AND resetTokenExpiry > ?',
        [token, new Date()]
      );

      if (users.length === 0) {
        throw new ApiError('Invalid or expired reset token', 400);
      }

      const user = users[0];

      // 2. Hash new password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);

      // 3. Update user password and clear reset token
      await userRepository.update(user.id, {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpiry: null
      });

      return { success: true };
    } catch (error) {
      console.error('Password reset error:', error);
      throw new ApiError('Error resetting password', 500);
    }
  }

  generateToken(user) {
    return jwt.sign(
      { 
        id: user.id, 
        email: user.email, 
        role: user.role 
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '1h' }
    );
  }

  // Helper method to send password reset email (implementation depends on email service)
  async sendPasswordResetEmail(email, token) {
    // Implementation depends on your email service (e.g., SendGrid, Nodemailer)
    // This is a placeholder implementation
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
    console.log(`Password reset link for ${email}: ${resetUrl}`);
    
    // In a real app, you would use an email service here
    // Example with Nodemailer:
    /*
    const transporter = nodemailer.createTransport({...});
    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: email,
      subject: 'Password Reset',
      html: `Click <a href="${resetUrl}">here</a> to reset your password.`
    });
    */
  }
}

module.exports = new AuthService();
