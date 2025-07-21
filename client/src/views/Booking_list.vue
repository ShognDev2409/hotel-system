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
        <booking-list-item
          v-for="booking in bookings"
          :key="booking.id"
          :booking="booking"
          @view-details="handleViewDetails"
        />
      </v-timeline>
      
      <div v-else class="empty-state text-center py-16">
        <v-icon size="80" color="grey lighten-2">mdi-calendar-search</v-icon>
        <h3 class="mt-4 grey--text text--darken-1 font-weight-medium">ບໍ່ພົບລາຍການຈອງ</h3>
        <p class="mt-2 grey--text">ທ່ານຍັງບໍ່ມີການຈອງທີ່ພັກໃນລະບົບ.</p>
      </div>

      <booking-details-dialog
        v-if="selectedBooking"
        :dialog="detailsDialog"
        :booking="selectedBooking"
        @close="handleCloseDialog"
      />

    </v-container>
  </section>
</template>

<script>
import BookingListItem from '@/components/BookingListPage/BookingListItem.vue';
import BookingDetailsDialog from '@/components/BookingListPage/BookingDetailsDialog.vue';

export default {
  name: 'BookingListPage',
  components: {
    BookingListItem,
    BookingDetailsDialog
  },
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
            id: 'BK001', status: 'pending', User_id: 1, cus_id: 1, startDate: '2025-08-10T17:00:00.000Z', endDate: '2025-08-14T17:00:00.000Z', total_stay_days: 4, total_price: 2000000, payment_image: 'https://i.imgur.com/rG4g21b.png', details: [{ id: 10, Room_id: 204 }], room: { name: 'Deluxe Pool View', number: '204', image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=500&h=400&fit=crop', price_per_night: 500000 }, customer: { name: 'ທ້າວ ສົມສັກ ໄຊຍະວົງ' }
          },
          {
            id: 'BK002', status: 'confirmed', User_id: 2, cus_id: 2, startDate: '2025-07-28T17:00:00.000Z', endDate: '2025-07-31T17:00:00.000Z', total_stay_days: 3, total_price: 900000, payment_image: null, details: [{ id: 11, Room_id: 102 }], room: { name: 'Standard Twin Room', number: '102', image: 'https://images.unsplash.com/photo-1590490359853-39213642364a?w=500&h=400&fit=crop', price_per_night: 300000 }, customer: { name: 'ນາງ ສຸດາລິນ ຈັນທະວົງ' }
          },
        ];
        this.loading = false;
      }, 1200);
    },
    handleViewDetails(booking) {
      this.selectedBooking = booking;
      this.detailsDialog = true;
    },
    handleCloseDialog() {
      this.detailsDialog = false;
    }
  },
  mounted() {
    this.fetchBookings();
  }
}
</script>

<style scoped>
.booking-list-page {
  background: linear-gradient(to bottom, #ffffff, #f7f8fc);
  min-height: 100vh;
  padding: 60px 0;
}
.page-header {
  margin-bottom: 48px;
}
.header-icon {
  background: linear-gradient(45deg, #FFC107, #FF9800);
  border-radius: 50%;
  padding: 12px;
  color: white !important;
  box-shadow: 0 4px 15px rgba(255, 152, 0, 0.4);
}
.page-title {
  font-family: 'Noto Sans Lao', sans-serif;
  font-size: 2.5rem;
  font-weight: 700;
  color: #2c3e50;
  margin-top: 16px;
}
.subtitle-text {
  font-size: 1.1rem;
  color: #7f8c8d;
  max-width: 600px;
  margin: 8px auto 0;
}
.empty-state {
  border: 2px dashed #e0e0e0;
  border-radius: 16px;
  background-color: #fff;
}
</style>