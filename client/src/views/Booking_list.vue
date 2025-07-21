<template>
  <section class="booking-list-page">
    <v-container>
      <!-- Page Header -->
      <div class="text-center mb-8">
        <h1 class="page-title mb-4">ລາຍການການຈອງຂອງຂ້ອຍ</h1>
        <p class="subtitle-text">ເບິ່ງແລະຈັດການການຈອງທີ່ພັກຂອງທ່ານ</p>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="text-center py-12">
        <v-progress-circular indeterminate color="primary" size="64"></v-progress-circular>
        <p class="mt-4">ກຳລັງໂຫຼດຂໍ້ມູນການຈອງ...</p>
      </div>

      <!-- Booking List -->
      <div v-else-if="bookings.length > 0" class="booking-list">
        <v-card
          v-for="booking in bookings"
          :key="booking.booking_id"
          class="booking-card mb-4"
          elevation="2"
        >
          <v-card-text class="pa-6">
            <v-row align="center">
              <!-- Room Image -->
              <v-col cols="12" sm="3" md="2">
                <v-img
                  :src="getRoomImage(booking.type_name)"
                  height="120"
                  class="room-image rounded-lg"
                  cover
                ></v-img>
              </v-col>

              <!-- Booking Info -->
              <v-col cols="12" sm="6" md="7">
                <div class="booking-info">
                  <!-- Booking ID & Status -->
                  <div class="d-flex align-center mb-2">
                    <h3 class="booking-id mr-3">ການຈອງ #{{ booking.booking_id }}</h3>
                    <v-chip
                      :color="getStatusColor(booking.booking_status)"
                      small
                      dark
                    >
                      {{ getStatusText(booking.booking_status) }}
                    </v-chip>
                  </div>

                  <!-- Room Details -->
                  <div class="room-details mb-3">
                    <div class="room-info">
                      <span class="room-number">ຫ້ອງ {{ booking.room_number }}</span>
                      <span class="room-type">{{ booking.type_name }}</span>
                    </div>
                    <div class="price-info">
                      {{ formatCurrency(booking.price_per_night) }} / ຄືນ
                    </div>
                  </div>

                  <!-- Stay Dates -->
                  <div class="stay-dates">
                    <div class="date-range">
                      <v-icon small color="primary" class="mr-1">mdi-calendar</v-icon>
                      {{ formatDate(booking.check_in_date) }} - {{ formatDate(booking.check_out_date) }}
                      <span class="nights-count">({{ calculateNights(booking.check_in_date, booking.check_out_date) }} ຄືນ)</span>
                    </div>
                  </div>

                  <!-- Customer Info -->
                  <div class="customer-info mt-2">
                    <div class="guest-name">
                      <v-icon small color="grey" class="mr-1">mdi-account</v-icon>
                      {{ booking.first_name }} {{ booking.last_name }}
                    </div>
                  </div>
                </div>
              </v-col>

              <!-- Price & Action -->
              <v-col cols="12" sm="3" md="3" class="text-right">
                <div class="price-section mb-4">
                  <div class="total-label">ລາຄາລວມ</div>
                  <div class="total-amount">{{ formatCurrency(booking.total_amount) }}</div>
                </div>

                <v-btn
                  color="primary"
                  outlined
                  @click="viewBookingDetails(booking.booking_id)"
                  class="detail-btn"
                  :disabled="loading"
                >
                  <v-icon left small>mdi-eye</v-icon>
                  ເບິ່ງລາຍລະອຽດ
                </v-btn>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </div>

      <!-- Empty State -->
      <div v-else class="empty-state text-center py-12">
        <v-icon size="80" color="grey lighten-2" class="mb-4">mdi-calendar-remove</v-icon>
        <h3 class="empty-title mb-4">ຍັງບໍ່ມີການຈອງ</h3>
        <p class="empty-subtitle mb-6">ທ່ານຍັງບໍ່ມີການຈອງທີ່ພັກໃນລະບົບ</p>
        <v-btn color="primary" large @click="goToBooking">
          <v-icon left>mdi-plus</v-icon>
          ຈອງທີ່ພັກໃໝ່
        </v-btn>
      </div>


    </v-container>

    <!-- Booking Details Modal -->
    <v-dialog v-model="shouldShowModal" max-width="800px" scrollable>
      <v-card>
        <!-- Modal Header -->
        <v-card-title class="booking-details-header">
          <div class="d-flex justify-space-between align-center w-100">
            <div class="d-flex align-center">
              <v-icon color="white" class="mr-2">mdi-receipt</v-icon>
              <span class="modal-title">ລາຍລະອຽດການຈອງ</span>
            </div>
            <v-btn icon dark @click="closeModal">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </div>
        </v-card-title>

        <!-- Modal Content -->
        <v-card-text class="pa-0" v-if="selectedBooking">
          <div class="details-content">
            <!-- Receipt Header -->
            <div class="receipt-header text-center pa-6">
              <h2 class="hotel-name mb-2">Grand Palace Hotel</h2>
              <p class="hotel-subtitle">ລາຍລະອຽດການຈອງ</p>
              
              <!-- Booking ID Card -->
              <div class="booking-id-card mx-auto mt-4">
                <div class="booking-id-label">ເລກທີ່ການຈອງ:</div>
                <div class="booking-id-value">{{ selectedBooking.booking_id }}</div>
              </div>
            </div>

            <v-divider></v-divider>

            <!-- Booking Information -->
            <div class="pa-6">
              <v-row>
                <!-- Left Column - Room & Guest Info -->
                <v-col cols="12" md="6">
                  <!-- Room Information -->
                  <div class="info-section mb-6">
                    <h3 class="section-title">
                      <v-icon left color="primary">mdi-bed</v-icon>
                      ຂໍ້ມູນຫ້ອງພັກ
                    </h3>
                    <div class="info-grid">
                      <div class="info-item">
                        <span class="info-label">ເບີຫ້ອງ:</span>
                        <span class="info-value">{{ selectedBooking.room_number }}</span>
                      </div>
                      <div class="info-item">
                        <span class="info-label">ປະເພດຫ້ອງ:</span>
                        <span class="info-value">{{ selectedBooking.type_name }}</span>
                      </div>
                      <div class="info-item">
                        <span class="info-label">ລາຄາຕໍ່ຄືນ:</span>
                        <span class="info-value price">{{ formatCurrency(selectedBooking.price_per_night) }}</span>
                      </div>
                      <div class="info-item">
                        <span class="info-label">ຈຳນວນຄືນ:</span>
                        <span class="info-value">{{ calculateNights(selectedBooking.check_in_date, selectedBooking.check_out_date) }} ຄືນ</span>
                      </div>
                    </div>
                  </div>

                  <!-- Guest Information -->
                  <div class="info-section mb-6">
                    <h3 class="section-title">
                      <v-icon left color="primary">mdi-account</v-icon>
                      ຂໍ້ມູນຜູ້ພັກ
                    </h3>
                    <div class="info-grid">
                      <div class="info-item">
                        <span class="info-label">ຊື່:</span>
                        <span class="info-value">{{ selectedBooking.first_name }} {{ selectedBooking.last_name }}</span>
                      </div>
                      <div class="info-item">
                        <span class="info-label">ອີເມວ:</span>
                        <span class="info-value">{{ selectedBooking.email }}</span>
                      </div>
                      <div class="info-item">
                        <span class="info-label">ເບີໂທ:</span>
                        <span class="info-value">{{ selectedBooking.phone }}</span>
                      </div>
                    </div>
                  </div>
                </v-col>

                <!-- Right Column - Dates & Status -->
                <v-col cols="12" md="6">
                  <!-- Check-in/out Information -->
                  <div class="info-section mb-6">
                    <h3 class="section-title">
                      <v-icon left color="primary">mdi-calendar</v-icon>
                      ວັນທີ່ເຂົ້າ-ອອກ
                    </h3>
                    <div class="date-cards">
                      <div class="date-card checkin-card">
                        <v-icon color="success" class="mb-2">mdi-calendar-arrow-right</v-icon>
                        <div class="date-label">ວັນທີ່ເຂົ້າ</div>
                        <div class="date-value">{{ formatDetailDate(selectedBooking.check_in_date) }}</div>
                        <div class="date-day">{{ getDayOfWeek(selectedBooking.check_in_date) }}</div>
                      </div>
                      <div class="date-card checkout-card">
                        <v-icon color="error" class="mb-2">mdi-calendar-arrow-left</v-icon>
                        <div class="date-label">ວັນທີ່ອອກ</div>
                        <div class="date-value">{{ formatDetailDate(selectedBooking.check_out_date) }}</div>
                        <div class="date-day">{{ getDayOfWeek(selectedBooking.check_out_date) }}</div>
                      </div>
                    </div>
                  </div>

                  <!-- Status Information -->
                  <div class="info-section mb-6">
                    <h3 class="section-title">
                      <v-icon left color="primary">mdi-information</v-icon>
                      ສະຖານະການຈອງ
                    </h3>
                    <div class="status-section">
                      <v-chip
                        :color="getStatusColor(selectedBooking.booking_status)"
                        dark
                        large
                        class="status-chip-large"
                      >
                        <v-icon left>{{ getStatusIcon(selectedBooking.booking_status) }}</v-icon>
                        {{ getStatusText(selectedBooking.booking_status) }}
                      </v-chip>
                      <div class="booking-date-info mt-3">
                        <div class="booking-date-label">ວັນທີ່ຈອງ:</div>
                        <div class="booking-date-value">{{ formatDetailDate(selectedBooking.booking_date) }}</div>
                      </div>
                    </div>
                  </div>
                </v-col>
              </v-row>

              <v-divider class="my-6"></v-divider>

              <!-- Price Breakdown -->
              <div class="price-breakdown">
                <h3 class="section-title mb-4">
                  <v-icon left color="primary">mdi-calculator</v-icon>
                  ລາຍລະອຽດຄ່າໃຊ້ຈ່າຍ
                </h3>
                <div class="price-table">
                  <div class="price-row">
                    <span class="price-label">{{ selectedBooking.type_name }} × {{ calculateNights(selectedBooking.check_in_date, selectedBooking.check_out_date) }} ຄືນ</span>
                    <span class="price-value">{{ formatCurrency(selectedBooking.price_per_night * calculateNights(selectedBooking.check_in_date, selectedBooking.check_out_date)) }}</span>
                  </div>
                  <div class="price-row">
                    <span class="price-label">ອາກອນບໍລິການ (0%)</span>
                    <span class="price-value">{{ formatCurrency(0) }}</span>
                  </div>
                  <v-divider class="my-3"></v-divider>
                  <div class="price-row total-row">
                    <span class="price-label-total">ລາຄາລວມທັງໝົດ</span>
                    <span class="price-value-total">{{ formatCurrency(selectedBooking.total_amount) }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </v-card-text>

        <!-- Modal Actions -->
        <v-card-actions class="pa-6" v-if="selectedBooking">
          <v-btn
            color="grey darken-1"
            outlined
            @click="downloadReceipt"
          >
            <v-icon left>mdi-download</v-icon>
            ດາວໂຫຼດໃບເສັດ
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            @click="closeModal"
          >
            ປິດ
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </section>
</template>

<script>
export default {
  name: 'BookingList',
  data() {
    return {
      loading: false,
      detailsDialog: false,
      selectedBooking: null,
      bookings: [
        {
          booking_id: 'BK001',
          customer_id: 1,
          room_id: 101,
          first_name: 'ສົມຊາຍ',
          last_name: 'ໃຈດີ',
          email: 'somchai@email.com',
          phone: '0812345678',
          room_number: '101',
          type_name: 'Dubble Room',
          price_per_night: 500000,
          check_in_date: '2025-07-20',
          check_out_date: '2025-07-23',
          total_amount: 1500000,
          booking_status: 'confirmed',
          booking_date: '2025-07-15'
        },
        
      ]
    }
  },

  computed: {
    shouldShowModal() {
      return this.detailsDialog && this.selectedBooking;
    }
  },
  
  methods: {
    getStatusColor(status) {
      switch (status) {
        case 'confirmed': return 'success';
        case 'checked_in': return 'info';
        case 'checked_out': return 'primary';
        case 'cancelled': return 'error';
        default: return 'grey';
      }
    },
    
    getStatusText(status) {
      switch (status) {
        case 'confirmed': return 'ຢືນຢັນແລ້ວ';
        case 'checked_in': return 'ເຊັກອິນແລ້ວ';
        case 'checked_out': return 'ເຊັກເອົາແລ້ວ';
        case 'cancelled': return 'ຍົກເລີກແລ້ວ';
        default: return 'ບໍ່ຮູ້ສະຖານະ';
      }
    },
    
    getStatusIcon(status) {
      switch (status) {
        case 'confirmed': return 'mdi-check-circle';
        case 'checked_in': return 'mdi-login';
        case 'checked_out': return 'mdi-logout';
        case 'cancelled': return 'mdi-cancel';
        default: return 'mdi-help-circle';
      }
    },
    
    formatDetailDate(dateString) {
      const date = new Date(dateString);
      return date.toLocaleDateString('lo-LA', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
    },
    
    getDayOfWeek(dateString) {
      const date = new Date(dateString);
      const days = ['ວັນອາທິດ', 'ວັນຈັນ', 'ວັນອັງຄານ', 'ວັນພຸດ', 'ວັນພະຫັດ', 'ວັນສຸກ', 'ວັນເສົາ'];
      return days[date.getDay()];
    },
    
    formatDate(dateString) {
      const date = new Date(dateString);
      return date.toLocaleDateString('th-TH', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    },
    
    formatCurrency(amount) {
      return `฿${amount.toLocaleString()}`;
    },
    
    calculateNights(checkIn, checkOut) {
      const start = new Date(checkIn);
      const end = new Date(checkOut);
      const diffTime = Math.abs(end - start);
      return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    },
    
    getRoomImage(roomType) {
      const images = {
        'Deluxe Room': 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=300&h=200&fit=crop',
        'Superior Room': 'https://images.unsplash.com/photo-1520637736862-4d197d17c52a?w=300&h=200&fit=crop',
        'Standard Room': 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=300&h=200&fit=crop'
      };
      return images[roomType] || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=300&h=200&fit=crop';
    },
    
    closeModal() {
      this.detailsDialog = false;
      this.selectedBooking = null;
    },
    
    viewBookingDetails(bookingId) {
      console.log('=== VIEW BOOKING DETAILS CLICKED ===');
      console.log('Booking ID:', bookingId);
      console.log('Available bookings:', this.bookings);
      
      // Find the booking by ID
      const booking = this.bookings.find(booking => booking.booking_id === bookingId);
      console.log('Found booking:', booking);
      
      if (booking) {
        this.selectedBooking = booking;
        console.log('Selected booking set:', this.selectedBooking);
        
        // Use $nextTick to ensure the data is set before opening dialog
        this.$nextTick(() => {
          console.log('Opening dialog...');
          this.detailsDialog = true;
        });
      } else {
        console.error('Booking not found:', bookingId);
        // Show error message if booking not found
        if (this.$toast) {
          this.$toast.error('ບໍ່ພົບຂໍ້ມູນການຈອງ');
        } else {
          alert('ບໍ່ພົບຂໍ້ມູນການຈອງ');
        }
      }
    },
    
    downloadReceipt() {
      console.log('Download receipt for booking:', this.selectedBooking.booking_id);
      // Generate and download PDF receipt
      this.$toast.success('ກຳລັງດາວໂຫຼດໃບເສັດ...');
    },
    
    goToBooking() {
      this.$router.push('/booking');
    },
    
    async loadBookings() {
      this.loading = true;
      try {
        // Call API to load user's bookings
        // const response = await this.$api.get('/api/bookings/my-bookings');
        // this.bookings = response.data;
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (error) {
        console.error('Error loading bookings:', error);
        this.$toast.error('ບໍ່ສາມາດໂຫຼດຂໍ້ມູນການຈອງໄດ້');
      } finally {
        this.loading = false;
      }
    }
  },
  
  mounted() {
    this.loadBookings();
  }
}
</script>

<style scoped>
.booking-list-page {
  min-height: 100vh;
  background: #f8f9fa;
  padding: 80px 0 40px 0;
}

.page-title {
  color: #2c3e50;
  font-size: 2.5rem;
  font-weight: 600;
}

.subtitle-text {
  color: #6c757d;
  font-size: 1.1rem;
}

/* Booking Card */
.booking-card {
  border-radius: 12px;
  transition: all 0.3s ease;
  border: 1px solid #e9ecef;
}

.booking-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 20px rgba(0,0,0,0.1) !important;
}

.booking-card .v-card__text {
  pointer-events: auto;
}

/* Room Image */
.room-image {
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

/* Booking Info */
.booking-info {
  padding-left: 16px;
}

.booking-id {
  color: #2c3e50;
  font-size: 1.3rem;
  font-weight: 600;
  margin: 0;
}

.room-details {
  border-left: 3px solid #007bff;
  padding-left: 12px;
}

.room-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.room-number {
  font-weight: 600;
  color: #2c3e50;
  font-size: 1.1rem;
}

.room-type {
  color: #6c757d;
  font-size: 0.95rem;
}

.price-info {
  color: #dc3545;
  font-weight: 600;
  font-size: 0.9rem;
  margin-top: 4px;
}

.stay-dates {
  margin-top: 8px;
}

.date-range {
  color: #495057;
  font-weight: 500;
  display: flex;
  align-items: center;
}

.nights-count {
  color: #6c757d;
  font-size: 0.9rem;
  margin-left: 8px;
}

.customer-info {
  border-top: 1px solid #e9ecef;
  padding-top: 8px;
}

.guest-name {
  color: #6c757d;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
}

/* Price Section */
.price-section {
  text-align: right;
}

.total-label {
  color: #6c757d;
  font-size: 0.9rem;
  margin-bottom: 4px;
}

.total-amount {
  color: #dc3545;
  font-size: 1.5rem;
  font-weight: 700;
}

/* Detail Button */
.detail-btn {
  width: 100%;
  border-radius: 8px;
  font-weight: 600;
  text-transform: none;
  pointer-events: auto !important;
  z-index: 1;
  position: relative;
}

/* Empty State */
.empty-state {
  background: white;
  border-radius: 12px;
  padding: 40px;
  margin: 40px 0;
}

.empty-title {
  color: #6c757d;
  font-weight: 500;
}

.empty-subtitle {
  color: #adb5bd;
}

/* Responsive Design */
@media (max-width: 768px) {
  .page-title {
    font-size: 2rem;
  }
  
  .booking-info {
    padding-left: 0;
    margin-top: 16px;
  }
  
  .price-section {
    text-align: left;
    margin-top: 16px;
  }
  
  .total-amount {
    font-size: 1.3rem;
  }
  
  .room-info {
    flex-direction: row;
    gap: 8px;
  }
  
  .room-number::after {
    content: " - ";
    color: #6c757d;
  }
}

@media (max-width: 600px) {
  .booking-card .v-card-text {
    padding: 16px !important;
  }
  
  .room-image {
    height: 100px !important;
  }
  
  .booking-id {
    font-size: 1.1rem;
  }
}

/* Booking Details Modal */
.booking-details-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  position: relative;
}

.booking-details-header::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, #F5B93F 0%, #FFD700 100%);
  opacity: 0.9;
}

.booking-details-header * {
  position: relative;
  z-index: 1;
}

.modal-title {
  font-size: 1.5rem;
  font-weight: 600;
}

.details-content {
  background: #f8f9fa;
}

.receipt-header {
  background: white;
  border-bottom: 3px solid #F5B93F;
}

.hotel-name {
  color: #2c3e50;
  font-size: 2rem;
  font-weight: 700;
  margin: 0;
}

.hotel-subtitle {
  color: #6c757d;
  font-size: 1.1rem;
  margin: 0;
}

.booking-id-card {
  background: linear-gradient(135deg, #F5B93F 0%, #FFD700 100%);
  padding: 16px 24px;
  border-radius: 12px;
  color: white;
  max-width: 300px;
  box-shadow: 0 4px 15px rgba(245, 185, 63, 0.3);
}

.booking-id-label {
  font-size: 0.9rem;
  opacity: 0.9;
  margin-bottom: 4px;
}

.booking-id-value {
  font-size: 1.5rem;
  font-weight: 700;
  letter-spacing: 2px;
}

.info-section {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  border: 1px solid #e9ecef;
}

.section-title {
  color: #2c3e50;
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 16px;
  border-bottom: 2px solid #F5B93F;
  padding-bottom: 8px;
}

.info-grid {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid #f1f3f4;
}

.info-item:last-child {
  border-bottom: none;
}

.info-label {
  color: #6c757d;
  font-weight: 500;
  flex: 1;
}

.info-value {
  color: #2c3e50;
  font-weight: 600;
  text-align: right;
  flex: 1;
}

.info-value.price {
  color: #dc3545;
  font-size: 1.1rem;
}

.date-cards {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.date-card {
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  padding: 20px;
  border-radius: 12px;
  text-align: center;
  border: 2px solid transparent;
  transition: all 0.3s ease;
}

.date-card:hover {
  border-color: #F5B93F;
  transform: translateY(-2px);
}

.checkin-card {
  border-left: 4px solid #28a745;
}

.checkout-card {
  border-left: 4px solid #dc3545;
}

.date-label {
  color: #6c757d;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 8px;
}

.date-value {
  color: #2c3e50;
  font-size: 1.1rem;
  font-weight: 700;
  margin-bottom: 4px;
}

.date-day {
  color: #6c757d;
  font-size: 0.8rem;
}

.status-section {
  text-align: center;
}

.status-chip-large {
  font-size: 1rem !important;
  height: 40px !important;
  padding: 0 16px !important;
}

.booking-date-info {
  background: #f8f9fa;
  padding: 12px;
  border-radius: 8px;
  border: 1px solid #e9ecef;
}

.booking-date-label {
  color: #6c757d;
  font-size: 0.9rem;
  margin-bottom: 4px;
}

.booking-date-value {
  color: #2c3e50;
  font-weight: 600;
}

.price-breakdown {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  border: 1px solid #e9ecef;
}

.price-table {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 20px;
}

.price-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  color: #495057;
}

.price-label {
  font-weight: 500;
}

.price-value {
  font-weight: 600;
  color: #2c3e50;
}

.total-row {
  background: linear-gradient(135deg, #F5B93F 0%, #FFD700 100%);
  margin: 16px -20px -20px -20px;
  padding: 20px;
  border-radius: 0 0 8px 8px;
  color: white;
}

.price-label-total {
  font-size: 1.1rem;
  font-weight: 700;
}

.price-value-total {
  font-size: 1.3rem;
  font-weight: 700;
}

/* Mobile Responsive for Modal */
@media (max-width: 768px) {
  .date-cards {
    grid-template-columns: 1fr;
  }
  
  .hotel-name {
    font-size: 1.5rem;
  }
  
  .booking-id-card {
    max-width: 100%;
  }
  
  .info-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
  }
  
  .info-value {
    text-align: left;
  }
}
</style>