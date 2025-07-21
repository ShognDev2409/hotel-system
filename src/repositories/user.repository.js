const { pool } = require('../config/database');
const User = require('../models/user.model');
const ApiError = require('../utils/apiError');

class UserRepository {
  constructor() {
    this.pool = pool;
  }

  async findByEmail(email) {
    try {
      const [rows] = await this.pool.query('SELECT * FROM users WHERE email = ?', [email]);
      if (rows.length === 0) return null;
      return new User(rows[0]);
    } catch (error) {
      console.error('Error in findByEmail:', error);
      throw new ApiError('Error finding user by email', 500);
    }
  }

  async findById(id) {
    try {
      const [rows] = await this.pool.query('SELECT * FROM users WHERE id = ?', [id]);
      if (rows.length === 0) return null;
      return new User(rows[0]);
    } catch (error) {
      console.error('Error in findById:', error);
      throw new ApiError('Error finding user by ID', 500);
    }
  }

  async create(userData) {
    const connection = await this.pool.getConnection();
    try {
      await connection.beginTransaction();
      
      const [result] = await connection.query('INSERT INTO users SET ?', [userData]);
      
      const [newUser] = await connection.query('SELECT * FROM users WHERE id = ?', [result.insertId]);
      
      await connection.commit();
      
      if (newUser.length === 0) {
        throw new ApiError('Failed to create user', 500);
      }
      
      return new User(newUser[0]);
    } catch (error) {
      await connection.rollback();
      console.error('Error in create user:', error);
      
      // Handle duplicate entry error
      if (error.code === 'ER_DUP_ENTRY') {
        throw new ApiError('Email already in use', 400);
      }
      
      throw new ApiError('Error creating user', 500);
    } finally {
      connection.release();
    }
  }

  async update(id, updateData) {
    const connection = await this.pool.getConnection();
    try {
      await connection.beginTransaction();
      
      await connection.query('UPDATE users SET ? WHERE id = ?', [updateData, id]);
      
      const [updatedUser] = await connection.query('SELECT * FROM users WHERE id = ?', [id]);
      
      await connection.commit();
      
      if (updatedUser.length === 0) {
        throw new ApiError('User not found', 404);
      }
      
      return new User(updatedUser[0]);
    } catch (error) {
      await connection.rollback();
      console.error('Error in update user:', error);
      
      if (error.code === 'ER_DUP_ENTRY') {
        throw new ApiError('Email already in use', 400);
      }
      
      throw new ApiError('Error updating user', 500);
    } finally {
      connection.release();
    }
  }

  async delete(id) {
    const connection = await this.pool.getConnection();
    try {
      await connection.beginTransaction();
      
      const [user] = await connection.query('SELECT * FROM users WHERE id = ?', [id]);
      
      if (user.length === 0) {
        throw new ApiError('User not found', 404);
      }
      
      await connection.query('DELETE FROM users WHERE id = ?', [id]);
      
      await connection.commit();
      
      return { success: true };
    } catch (error) {
      await connection.rollback();
      console.error('Error in delete user:', error);
      throw new ApiError('Error deleting user', 500);
    } finally {
      connection.release();
    }
  }

  // Additional methods for authentication
  async updatePassword(userId, newPassword) {
    return this.update(userId, { password: newPassword });
  }

  async setResetToken(userId, token, expiry) {
    return this.update(userId, {
      resetToken: token,
      resetTokenExpiry: expiry
    });
  }

  async clearResetToken(userId) {
    return this.update(userId, {
      resetToken: null,
      resetTokenExpiry: null
    });
  }
}

module.exports = new UserRepository();
