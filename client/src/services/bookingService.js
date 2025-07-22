import axios from 'axios';

// The API URL should match your backend.
const API_URL = "http://localhost:3000" || 'http://localhost:3000';

class BookingService {
  constructor() {
    this.api = axios.create({
      baseURL: API_URL,
      headers: {
        'Content-Type': 'application/json',
      }
    });

    // If you use authentication, you can add an interceptor here
    // to attach the token to requests, just like in your RoomService.
  }

  /**
   * Creates a new booking by sending the payload to the API.
   * @param {object} payload - The booking data structured for the API.
   * @returns {Promise<object>} The API response data.
   */
  async createBooking(payload) {
    try {
      // Makes a POST request to http://localhost:3000/api/bookings
      const response = await this.api.post('/api/bookings', payload);
      return response.data;
    } catch (error) {
      console.error('Error creating booking:', error.response?.data || error.message);
      // Re-throw the error so the component can display a message.
      throw error;
    }
  }
}

// Export a single instance so the same connection is used everywhere.
export default new BookingService();