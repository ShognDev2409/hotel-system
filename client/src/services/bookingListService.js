import axios from 'axios';

function fetchBookingHistory(id) {
  return axios
    .get(`http://127.0.0.1:3000/api/bookings/history/${id}`)
    .then(resp => {
      const { success, data: bookings } = resp.data;
      if (!success) {
        return Promise.reject(new Error('API returned success: false'));
      }
      return bookings;
    })
    .then(bookings => {
      // bookings is that array:
      console.log('Got', bookings.length, 'booking(s)');
      return bookings;
    })
    .catch(err => {
      console.error('Failed to fetch booking history:', err);
      throw err;
    });
}