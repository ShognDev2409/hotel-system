<template>
  <v-timeline-item
    :color="getStatusColor(booking.status)"
    :icon="getStatusIcon(booking.status)"
    fill-dot
  >
    <v-card class="booking-card" :class="`${booking.status}-border`" elevation="2">
      <v-card-title class="card-header">
        <div class="booking-id-wrapper">
          <span class="booking-id">ການຈອງ #{{ booking.id }}</span>
          <v-chip :color="getStatusColor(booking.status)" small dark class="ml-3 status-chip">
            {{ getStatusText(booking.status) }}
          </v-chip>
        </div>
        <v-spacer></v-spacer>
        <div class="total-amount">{{ formatPrice(booking.total_price) }}</div>
      </v-card-title>
      <v-divider></v-divider>
      <v-card-text class="pa-5">
        <v-row>
          <v-col cols="12" md="4">
            <v-img :src="booking.room.image" class="rounded-lg elevation-1" height="150" cover></v-img>
          </v-col>
          <v-col cols="12" md="8" class="pl-md-6 d-flex flex-column">
            <div class="flex-grow-1">
              <h4 class="room-name">{{ booking.room.name }}</h4>
              <p class="room-number">ຫ້ອງ #{{ booking.room.number }} • {{ formatPrice(booking.room.price_per_night) }} / ຄືນ</p>
              <div class="info-grid mt-4">
                <div class="info-item">
                  <v-icon small color="grey darken-1">mdi-calendar-range</v-icon>
                  <span>{{ formatDate(booking.startDate) }} - {{ formatDate(booking.endDate) }} ({{ booking.total_stay_days }} ຄືນ)</span>
                </div>
                <div class="info-item">
                  <v-icon small color="grey darken-1">mdi-account-circle</v-icon>
                  <span>ຈອງໂດຍ: <strong>{{ booking.customer.name }}</strong></span>
                </div>
              </div>
            </div>
            <div class="text-right mt-4">
              <v-btn
                :color="getStatusColor(booking.status)"
                text
                @click="$emit('view-details', booking)"
                class="details-btn"
              >
                ເບິ່ງລາຍລະອຽດ
                <v-icon right>mdi-arrow-right</v-icon>
              </v-btn>
            </div>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-timeline-item>
</template>

<script>
export default {
  name: 'BookingListItem',
  props: {
    booking: {
      type: Object,
      required: true
    }
  },
  methods: {
    formatDate(dateString) {
      if (!dateString) return '';
      const date = new Date(dateString);
      return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    },
    formatPrice(value) {
      if (typeof value !== 'number') return '₭0';
      return value.toLocaleString('en-US', { style: 'currency', currency: 'LAK', minimumFractionDigits: 0 });
    },
    getStatusColor(status) {
      const colors = {
        pending: 'orange darken-1',
        confirmed: 'green darken-1',
        checked_in: 'blue darken-1',
        cancelled: 'red darken-1',
      };
      return colors[status] || 'grey darken-1';
    },
    getStatusText(status) {
      const texts = {
        pending: 'ລໍຖ້າອະນຸມັດ',
        confirmed: 'ຢືນຢັນແລ້ວ',
        checked_in: 'ເຊັກອິນແລ້ວ',
        cancelled: 'ຍົກເລີກ',
      };
      return texts[status] || 'ບໍ່ຮູ້ສະຖານະ';
    },
    getStatusIcon(status) {
      const icons = {
        pending: 'mdi-clock-time-eight-outline',
        confirmed: 'mdi-check-decagram',
        checked_in: 'mdi-login-variant',
        cancelled: 'mdi-close-circle-outline',
      };
      return icons[status] || 'mdi-help-circle-outline';
    },
  }
}
</script>

<style scoped>
.booking-card {
  border-left: 5px solid;
  transition: all 0.3s ease;
  border-radius: 12px !important;
  overflow: hidden;
  background-color: white;
}
.booking-card:hover {
  transform: translateY(-5px) scale(1.02);
  box-shadow: 0 12px 35px rgba(0, 0, 0, 0.08) !important;
}
.pending-border { border-left-color: #FB8C00; }
.confirmed-border { border-left-color: #43A047; }
.checked_in-border { border-left-color: #1E88E5; }
.cancelled-border { border-left-color: #E53935; }
.card-header {
  background-color: #fafafa;
  padding: 12px 20px;
}
.booking-id-wrapper {
  display: flex;
  align-items: center;
}
.booking-id {
  font-size: 1.1rem;
  font-weight: 600;
  color: #34495e;
}
.status-chip {
  font-weight: 500;
}
.total-amount {
  font-size: 1.5rem;
  font-weight: 700;
  color: #34495e;
}
.room-name {
  font-size: 1.25rem;
  font-weight: 600;
  color: #2c3e50;
}
.room-number {
  font-size: 1rem;
  color: #7f8c8d;
  margin-bottom: 8px;
}
.info-grid {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.info-item {
  display: flex;
  align-items: center;
  color: #34495e;
  gap: 10px;
}
.details-btn {
  font-weight: bold;
}
</style>