// services/roomService.js
import axios from 'axios';
import { Room } from '@/models/room_model.js';

const API_URL = 'http://localhost:3000/api/rooms';

/**
 * Fetches rooms from the API, filters to only "available" or "booked",
 * and returns an array of Room instances with a boolean `available` flag.
 *
* @returns {Promise<Room[]>}
 */
export async function fetchRooms() {
  try {
    const { data: resp } = await axios.get(API_URL);
    if (!resp.success) {
      throw new Error('API returned success=false');
    }
    return resp.data
      // only include available/booked statuses
      .filter(r => r.status === 'available' || r.status === 'booked')
      .map(roomObj => new Room(roomObj));
  } catch (err) {
    console.error('Failed to fetch rooms:', err);
    throw err;
  }
}
