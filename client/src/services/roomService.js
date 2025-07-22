// src/services/roomService.js
import axios from 'axios';

const API_URL = process.env.VUE_APP_API_URL || 'http://localhost:5000';

class RoomService {
  constructor() {
    this.api = axios.create({
      baseURL: API_URL,
      timeout: 10000,
    });

    // Add token to requests
    this.api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Handle response errors
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          // Token expired, redirect to login
          localStorage.removeItem('token');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  // Get all rooms
  async getRooms() {
    try {
      const response = await this.api.get('/api/rooms');
      return response.data;
    } catch (error) {
      console.error('Error fetching rooms:', error);
      throw error;
    }
  }

  // Get room by ID
  async getRoomById(id) {
    try {
      const response = await this.api.get(`/api/rooms/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching room:', error);
      throw error;
    }
  }

  // Create new room
  async createRoom(roomData) {
    try {
      const response = await this.api.post('/api/rooms', roomData);
      return response.data;
    } catch (error) {
      console.error('Error creating room:', error);
      throw error;
    }
  }

  // Update room
  async updateRoom(id, roomData) {
    try {
      const response = await this.api.put(`/api/rooms/${id}`, roomData);
      return response.data;
    } catch (error) {
      console.error('Error updating room:', error);
      throw error;
    }
  }

  // Delete room
  async deleteRoom(id) {
    try {
      const response = await this.api.delete(`/api/rooms/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting room:', error);
      throw error;
    }
  }

  // Get room statistics
  async getRoomStats() {
    try {
      const response = await this.api.get('/api/rooms/stats');
      return response.data;
    } catch (error) {
      console.error('Error fetching room stats:', error);
      throw error;
    }
  }

  // Get room types
  async getRoomTypes() {
    try {
      const response = await this.api.get('/api/room-types');
      return response.data;
    } catch (error) {
      console.error('Error fetching room types:', error);
      throw error;
    }
  }

  // Update room status
  async updateRoomStatus(id, status) {
    try {
      const response = await this.api.patch(`/api/rooms/${id}/status`, { status });
      return response.data;
    } catch (error) {
      console.error('Error updating room status:', error);
      throw error;
    }
  }

  // Get available rooms for booking
  async getAvailableRooms(checkIn, checkOut) {
    try {
      const response = await this.api.get('/api/rooms/available', {
        params: { checkIn, checkOut }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching available rooms:', error);
      throw error;
    }
  }
}

export default new RoomService();
