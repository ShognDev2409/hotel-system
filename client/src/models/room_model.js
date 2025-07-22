// models/Room.js
import { roomDetails } from '../constants/roomDetails.js';

/**
 * @typedef {Object} RoomData
 * @property {number} id
 * @property {string} name
 * @property {'available'|'booked'} status      // we filter out other statuses upstream
 * @property {string} price
 * @property {string} roomTypeName
 * @property {number} roomType_id
 * @property {number} maxGuests
 */

/**
 * Represents a hotel room, with a boolean flag for availability,
 * plus description and image pulled from roomDetails.
 */
export class Room {
  /**
   * @param {RoomData} data
   */
  constructor(data) {
    this.id           = data.id;
    this.name         = data.name;
    this.available    = data.status === 'available';
    this.price        = parseFloat(data.price);
    this.roomTypeName = data.roomTypeName;
    this.roomTypeId   = data.roomType_id;
    this.maxGuests    = data.maxGuests;

    // pull in description + image based on roomTypeName
    const details = roomDetails[this.roomTypeName] || {};
    this.description = details.description || '';
    this.image       = details.image       || null;
  }

  /** @returns {boolean} */
  isAvailable() {
    return this.available;
  }
}
