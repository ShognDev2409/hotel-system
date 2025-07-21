<template>
  <v-card class="room-card" elevation="4">
    <v-row no-gutters>
      <div class="room-image-wrapper">
        <img :src="room.image" alt="Room Image" class="room-image" />
        <div class="status-chip-wrapper">
          <v-chip small :style="statusChipStyle">
            {{ room.available ? 'Available' : 'Booked' }}
          </v-chip>
        </div>
      </div>

      <v-col class="d-flex flex-column">
        <v-card-text class="pa-4 text-center flex-grow-1">
          <h3 class="room-name">{{ room.name }}</h3>
          <p>this is room description</p>
          <div class="d-flex align-center justify-center mb-3">
            <span class="price-amount">{{ formatPrice(room.price) }} ກີບ</span>
            <span class="price-per-night">/ ຄືນ</span>
          </div>
          <div class="d-flex align-center justify-center mb-4">
            <v-icon color="#D4AF37" size="20" class="mr-2">mdi-bed</v-icon>
            <span class="feature-text">{{ room.beds }} Bed</span>
            <v-icon color="#D4AF37" size="20" class="mr-2 ml-4">mdi-account-multiple</v-icon>
            <span class="feature-text">{{ room.maxGuests }} Guests</span>
            <v-icon color="#D4AF37" size="20" class="mr-2 ml-4">mdi-wifi</v-icon>
            <span class="feature-text">Wifi</span>
          </div>
        </v-card-text>

        <booking-dialog
          :room="room"
          :is-available="room.available"
          @book="handleBooking"
        />

      </v-col>
    </v-row>
  </v-card>
</template>

<script>
// 1. Import the new component
import BookingDialog from './BookingDialog.vue';

export default {
  name: 'RoomCard',
  // 2. Register the component
  components: {
    BookingDialog
  },
  props: {
    room: { type: Object, required: true }
  },
  computed: {
    statusChipStyle() {
      const background = this.room.available
        ? 'linear-gradient(45deg, #F5B93F, #f7b023)'
        : '#BDBDBD';
      return { background, color: 'white', fontWeight: 'bold' };
    }
  },
  methods: {
    formatPrice(v) {
      return v != null ? v.toLocaleString() : '';
    },
    // 3. Handle the 'book' event emitted from the dialog
    handleBooking(bookingData) {
      console.log('Booking received in parent component!', bookingData);
      // You can now send this data to your backend API or Vuex store
    }
  }
}
</script>

<style scoped>
/* The styles are now only for the card itself, much cleaner! */
.room-card {
  border-radius: 15px !important;
  overflow: hidden;
  transition: all 0.3s ease;
  font-family: 'Noto Sans Lao', sans-serif !important;
  margin-bottom: 24px;
}
.room-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 15px 35px rgba(0,0,0,0.15) !important;
}
.room-image-wrapper {
  height: 250px;
  width: 300px;
  position: relative;
  overflow: hidden;
}
.room-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.status-chip-wrapper {
  position: absolute;
  top: 15px;
  right: 15px;
  z-index: 2;
}
.room-name {
  color: #8B4513;
  font-weight: bold;
  margin-bottom: 10px;
  font-size: 1.1rem;
}
.price-amount {
  color: #D4AF37;
  font-size: 24px;
  font-weight: bold;
}
.price-per-night {
  color: #666;
  margin-left: 5px;
}
.feature-text {
  color: #666;
  font-size: 14px;
}
.flex-grow-1 {
  flex-grow: 1;
}
</style>