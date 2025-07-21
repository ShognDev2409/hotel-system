<template>
  <v-card class="room-card " elevation="4">
    
    <v-row>
      <div class="room-image-wrapper">
        <img :src="room.image" alt="Room Image" class="room-image" />
        <div class="status-chip-wrapper">
          <v-chip small :style="{
            background: room.available ? 'linear-gradient(45deg, #F5B93F, #f7b023)' : '#BDBDBD',
            color: 'white',
            fontWeight: 'bold'
          }">
            {{ room.available ? 'Available' : 'Booked' }}
          </v-chip>
        </div>
      </div>
      <div>
        <v-col>
          <v-card-text class="pa-4 text-center">
            <h3 class="room-name">
              {{ room.name }}
            </h3>
            <div>
              <p>this is room description</p>
            </div>

            <div class="d-flex align-center justify-center mb-3">
              <span class="price-amount">
                {{ formatPrice(room.price) }} ກີບ
              </span>
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
          <v-btn block class="details-btn" :disabled="!room.available" @click="$emit('book', room)">
            ລາຍລະອຽດເພີ່ມເຕີມ
          </v-btn>
        </v-col>
      </div>
    </v-row>
  </v-card>
</template>

<script>
export default {
  name: 'RoomCard',
  props: {
    room: { type: Object, required: true }
  },
  methods: {
    formatPrice(value) {
      if (value == null) return '';
      return value.toLocaleString();
    }
  }
}
</script>

<style scoped>
.room-card {
  border-radius: 15px !important;
  overflow: hidden;
  transition: all 0.3s ease;
  font-family: 'Noto Sans Lao', sans-serif !important;
}

.room-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.15) !important;
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

.details-btn {
  background: linear-gradient(45deg, #F5B93F, #f7b023) !important;
  color: white !important;
  font-weight: bold !important;
  text-transform: none !important;
  border-radius: 8px !important;
  width: 100% !important;
}
</style>