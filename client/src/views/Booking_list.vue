<template>
  <section class="booking-list-page">
    <v-container>
      <div class="page-header text-center">
        <v-icon class="header-icon" size="48" color="amber darken-2">mdi-calendar-check</v-icon>
        <h1 class="page-title">ລາຍການການຈອງຂອງຂ້ອຍ</h1>
        <p class="subtitle-text">ຕິດຕາມການຈອງຂອງທ່ານຜ່ານທາມລາຍທີ່ສວຍງາມ ແລະ ເຂົ້າใจง่าย</p>
      </div>

      <div v-if="loading" class="text-center py-12">
        <v-progress-circular indeterminate color="amber" size="64"></v-progress-circular>
        <p class="mt-4 grey--text">ກຳລັງໂຫຼດຂໍ້ມູນການຈອງ...</p>
      </div>

      <v-timeline v-else-if="bookings.length > 0" align-top dense>
        <v-timeline-item
          v-for="booking in bookings"
          :key="booking.id"
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
                    <v-btn :color="getStatusColor(booking.status)" text @click="viewBookingDetails(booking)" class="details-btn">
                      ເບິ່ງລາຍລະອຽດ
                      <v-icon right>mdi-arrow-right</v-icon>
                    </v-btn>
                  </div>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-timeline-item>
      </v-timeline>

      <div v-else class="empty-state text-center py-16">
        <v-icon size="80" color="grey lighten-2">mdi-calendar-search</v-icon>
        <h3 class="mt-4 grey--text text--darken-1 font-weight-medium">ບໍ່ພົບລາຍການຈອງ</h3>
        <p class="mt-2 grey--text">ທ່ານຍັງບໍ່ມີການຈອງທີ່ພັກໃນລະບົບ.</p>
      </div>

      <v-dialog v-model="detailsDialog" max-width="800px" scrollable>
        <v-card v-if="selectedBooking" class="details-dialog-card">
          <v-toolbar flat class="details-toolbar">
            <v-toolbar-title>ລາຍລະອຽດການຈອງ #{{ selectedBooking.id }}</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn icon dark @click="closeDetailsDialog">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-toolbar>

          <v-card-text class="dialog-content pa-6">
            <v-row class="summary-section">
              <v-col cols="12" sm="4" class="summary-item">
                <v-icon class="summary-icon">mdi-ticket-confirmation</v-icon>
                <div class="summary-label">ສະຖານະ</div>
                <div class="summary-value">
                  <v-chip :color="getStatusColor(selectedBooking.status)" dark>{{ getStatusText(selectedBooking.status) }}</v-chip>
                </div>
              </v-col>
              <v-col cols="12" sm="4" class="summary-item">
                <v-icon class="summary-icon">mdi-cash-multiple</v-icon>
                <div class="summary-label">ລາຄາລວມ</div>
                <div class="summary-value total-price">{{ formatPrice(selectedBooking.total_price) }}</div>
              </v-col>
              <v-col cols="12" sm="4" class="summary-item">
                <v-icon class="summary-icon">mdi-weather-night</v-icon>
                <div class="summary-label">ຈຳນວນຄືນ</div>
                <div class="summary-value">{{ selectedBooking.total_stay_days }} ຄືນ</div>
              </v-col>
            </v-row>

            <v-row class="mt-6">
              <v-col cols="12" md="6">
                <div class="info-block">
                  <h3 class="section-title"><v-icon left>mdi-account-details</v-icon> ຂໍ້ມູນລູກຄ້າ ແລະ ຫ້ອງພັກ</h3>
                  <v-list dense color="transparent">
                    <v-list-item><v-list-item-icon><v-icon>mdi-account-outline</v-icon></v-list-item-icon><v-list-item-content><v-list-item-title>{{ selectedBooking.customer.name }}</v-list-item-title><v-list-item-subtitle>ຊື່ລູກຄ້າ</v-list-item-subtitle></v-list-item-content></v-list-item>
                    <v-list-item><v-list-item-icon><v-icon>mdi-card-account-details-outline</v-icon></v-list-item-icon><v-list-item-content><v-list-item-title>{{ selectedBooking.cus_id }} (User ID: {{ selectedBooking.User_id || 'N/A' }})</v-list-item-title><v-list-item-subtitle>Customer & User ID</v-list-item-subtitle></v-list-item-content></v-list-item>
                    <v-list-item><v-list-item-icon><v-icon>mdi-door</v-icon></v-list-item-icon><v-list-item-content><v-list-item-title>{{ selectedBooking.details[0].Room_id }}</v-list-item-title><v-list-item-subtitle>Room ID</v-list-item-subtitle></v-list-item-content></v-list-item>
                  </v-list>
                </div>
              </v-col>
              <v-col cols="12" md="6">
                <div class="info-block">
                  <h3 class="section-title"><v-icon left>mdi-calendar-clock</v-icon> ໄລຍະເວລາເຂົ້າພັກ</h3>
                  <v-list dense color="transparent">
                     <v-list-item><v-list-item-icon><v-icon>mdi-calendar-arrow-right</v-icon></v-list-item-icon><v-list-item-content><v-list-item-title>{{ formatFullDate(selectedBooking.startDate) }}</v-list-item-title><v-list-item-subtitle>Check-In</v-list-item-subtitle></v-list-item-content></v-list-item>
                     <v-list-item><v-list-item-icon><v-icon>mdi-calendar-arrow-left</v-icon></v-list-item-icon><v-list-item-content><v-list-item-title>{{ formatFullDate(selectedBooking.endDate) }}</v-list-item-title><v-list-item-subtitle>Check-Out</v-list-item-subtitle></v-list-item-content></v-list-item>
                  </v-list>
                </div>
              </v-col>
            </v-row>
            
            <div class="info-block mt-6" v-if="selectedBooking.payment_image">
              <h3 class="section-title"><v-icon left>mdi-image-check</v-icon> ຫຼັກຖານການໂອນເງິນ</h3>
              <v-img :src="selectedBooking.payment_image" max-height="400" contain class="mt-4 rounded-lg elevation-2"></v-img>
            </div>
          </v-card-text>
        </v-card>
      </v-dialog>

    </v-container>
  </section>
</template>

<script>
// The script remains the same as the previous version
export default {
  name: 'BookingListPage',
  data() {
    return {
      loading: true,
      bookings: [],
      detailsDialog: false,
      selectedBooking: null,
    }
  },
  methods: {
    fetchBookings() {
      this.loading = true;
      setTimeout(() => {
        this.bookings = [
           {
            id: 'BK001',
            status: 'pending',
            User_id: 1,
            cus_id: 1,
            startDate: '2025-08-10T17:00:00.000Z',
            endDate: '2025-08-14T17:00:00.000Z',
            total_stay_days: 4,
            total_price: 2000000,
            payment_image: 'https://i.imgur.com/rG4g21b.png',
            details: [{ id: 10, Room_id: 204 }],
            room: { name: 'Deluxe Pool View', number: '204', image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=500&h=400&fit=crop', price_per_night: 500000 },
            customer: { name: 'ທ້າວ ສົມສັກ ໄຊຍະວົງ' }
          },
          {
            id: 'BK002',
            status: 'confirmed',
            User_id: 2,
            cus_id: 2,
            startDate: '2025-07-28T17:00:00.000Z',
            endDate: '2025-07-31T17:00:00.000Z',
            total_stay_days: 3,
            total_price: 900000,
            payment_image: null,
            details: [{ id: 11, Room_id: 102 }],
            room: { name: 'Standard Twin Room', number: '102', image: 'https://images.unsplash.com/photo-1590490359853-39213642364a?w=500&h=400&fit=crop', price_per_night: 300000 },
            customer: { name: 'ນາງ ສຸດາລິນ ຈັນທະວົງ' }
          },
        ];
        this.loading = false;
      }, 1200);
    },
    viewBookingDetails(booking) {
      this.selectedBooking = booking;
      this.detailsDialog = true;
    },
    closeDetailsDialog() {
      this.detailsDialog = false;
    },
    formatDate(dateString) {
      if (!dateString) return '';
      const date = new Date(dateString);
      return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    },
    formatFullDate(dateString) {
        if (!dateString) return '';
        const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        return new Date(dateString).toLocaleDateString('lo-LA', options);
    },
    formatPrice(value) {
      if (typeof value !== 'number') return '₭0';
      return value.toLocaleString('en-US', { style: 'currency', currency: 'LAK', minimumFractionDigits: 0 });
    },
    getStatusColor(status) { /* ... same ... */ },
    getStatusText(status) { /* ... same ... */ },
    getStatusIcon(status) { /* ... same ... */ },
  },
  mounted() {
    this.fetchBookings();
  }
}
</script>

<style scoped>
/* --- Existing styles for the page are fine, adding new styles for the dialog --- */
.details-dialog-card {
  border-radius: 12px !important;
}

.details-toolbar {
  background: linear-gradient(45deg, #F5B93F, #f7b023) !important;
  color: white !important;
  font-weight: bold;
}

.dialog-content {
  background-color: #f9f9f9;
}

.summary-section {
  background-color: #fff;
  border: 1px solid #eee;
  border-radius: 12px;
  padding: 16px 0;
  margin: -40px 0 0 0 !important;
  position: relative;
  z-index: 2;
  box-shadow: 0 4px 20px rgba(0,0,0,0.05);
}

.summary-item {
  text-align: center;
  border-right: 1px solid #eee;
}

.summary-item:last-child {
  border-right: none;
}

.summary-icon {
  font-size: 2rem !important;
  color: #ffb300 !important;
  margin-bottom: 8px;
}

.summary-label {
  font-size: 0.8rem;
  color: #757575;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.summary-value {
  font-size: 1.2rem;
  font-weight: 600;
  color: #333;
}

.summary-value.total-price {
  font-size: 1.4rem;
  color: #4CAF50;
}

.info-block {
  background-color: #fff;
  padding: 20px;
  border-radius: 12px;
  border: 1px solid #eee;
  height: 100%;
}

.section-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
}

.section-title .v-icon {
  margin-right: 8px;
  color: #F5B93F;
}
</style>