<template>
  <v-dialog :value="dialog" @input="$emit('close')" max-width="800px" scrollable>
    <v-card v-if="booking" class="details-dialog-card">
      <v-toolbar flat class="details-toolbar">
        <v-toolbar-title>ລາຍລະອຽດການຈອງ #{{ booking.id }}</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon dark @click="$emit('close')">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>

      <v-card-text class="dialog-content pa-6">
        <v-row class="summary-section">
          <v-col cols="12" sm="4" class="summary-item">
            <v-icon class="summary-icon">mdi-ticket-confirmation</v-icon>
            <div class="summary-label">ສະຖານະ</div>
            <div class="summary-value">
              <v-chip :color="getStatusColor(booking.status)" dark>{{ getStatusText(booking.status) }}</v-chip>
            </div>
          </v-col>
          <v-col cols="12" sm="4" class="summary-item">
            <v-icon class="summary-icon">mdi-cash-multiple</v-icon>
            <div class="summary-label">ລາຄາລວມ</div>
            <div class="summary-value total-price">{{ formatPrice(booking.total_price) }}</div>
          </v-col>
          <v-col cols="12" sm="4" class="summary-item">
            <v-icon class="summary-icon">mdi-weather-night</v-icon>
            <div class="summary-label">ຈຳນວນຄືນ</div>
            <div class="summary-value">{{ booking.total_stay_days }} ຄືນ</div>
          </v-col>
        </v-row>

        <v-row class="mt-6">
          <v-col cols="12" md="6">
            <div class="info-block">
              <h3 class="section-title"><v-icon left>mdi-account-details</v-icon> ຂໍ້ມູນລູກຄ້າ ແລະ ຫ້ອງພັກ</h3>
              <v-list dense color="transparent">
                <v-list-item><v-list-item-icon><v-icon>mdi-account-outline</v-icon></v-list-item-icon><v-list-item-content><v-list-item-title>{{ booking.customer.name }}</v-list-item-title><v-list-item-subtitle>ຊື່ລູກຄ້າ</v-list-item-subtitle></v-list-item-content></v-list-item>
                <v-list-item><v-list-item-icon><v-icon>mdi-card-account-details-outline</v-icon></v-list-item-icon><v-list-item-content><v-list-item-title>{{ booking.cus_id }} (User ID: {{ booking.User_id || 'N/A' }})</v-list-item-title><v-list-item-subtitle>Customer & User ID</v-list-item-subtitle></v-list-item-content></v-list-item>
                <v-list-item><v-list-item-icon><v-icon>mdi-door</v-icon></v-list-item-icon><v-list-item-content><v-list-item-title>{{ booking.details[0].Room_id }}</v-list-item-title><v-list-item-subtitle>Room ID</v-list-item-subtitle></v-list-item-content></v-list-item>
              </v-list>
            </div>
          </v-col>
          <v-col cols="12" md="6">
            <div class="info-block">
              <h3 class="section-title"><v-icon left>mdi-calendar-clock</v-icon> ໄລຍະເວລາເຂົ້າພັກ</h3>
              <v-list dense color="transparent">
                  <v-list-item><v-list-item-icon><v-icon>mdi-calendar-arrow-right</v-icon></v-list-item-icon><v-list-item-content><v-list-item-title>{{ formatFullDate(booking.startDate) }}</v-list-item-title><v-list-item-subtitle>Check-In</v-list-item-subtitle></v-list-item-content></v-list-item>
                  <v-list-item><v-list-item-icon><v-icon>mdi-calendar-arrow-left</v-icon></v-list-item-icon><v-list-item-content><v-list-item-title>{{ formatFullDate(booking.endDate) }}</v-list-item-title><v-list-item-subtitle>Check-Out</v-list-item-subtitle></v-list-item-content></v-list-item>
              </v-list>
            </div>
          </v-col>
        </v-row>
        
        <div class="info-block mt-6" v-if="booking.payment_image">
          <h3 class="section-title"><v-icon left>mdi-image-check</v-icon> ຫຼັກຖານການໂອນເງິນ</h3>
          <v-img :src="booking.payment_image" max-height="400" contain class="mt-4 rounded-lg elevation-2"></v-img>
        </div>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'BookingDetailsDialog',
  props: {
    dialog: { type: Boolean, required: true },
    booking: { type: Object, default: null }
  },
  methods: {
    formatFullDate(dateString) {
      if (!dateString) return '';
      const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
      return new Date(dateString).toLocaleDateString('lo-LA', options);
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
  }
}
</script>

<style scoped>
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