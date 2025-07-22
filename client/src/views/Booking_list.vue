<template>
  <section class="booking-list-page">
    <v-container>
      <div class="page-header text-center">
        <v-icon class="header-icon" size="48" color="amber darken-2">mdi-calendar-check</v-icon>
        <h1 class="page-title">ລາຍການການຈອງຂອງຂ້ອຍ</h1>
      </div>

      <div v-if="loading" class="text-center py-12">
        <v-progress-circular indeterminate color="amber" size="64"></v-progress-circular>
        <p class="mt-4 grey--text">ກຳລັງໂຫຼດຂໍ້ມູນການຈອງ...</p>
      </div>

      <v-timeline v-else-if="bookings.length > 0" align-top dense>
        <booking-list-item v-for="booking in bookings" :key="booking.id" :booking="booking"
          @view-details="handleViewDetails" />
      </v-timeline>

      <div v-else class="empty-state text-center py-16">
        <v-icon size="80" color="grey lighten-2">mdi-calendar-search</v-icon>
        <h3 class="mt-4 grey--text text--darken-1 font-weight-medium">ບໍ່ພົບລາຍການຈອງ</h3>
        <p class="mt-2 grey--text">ທ່ານຍັງບໍ່ມີການຈອງທີ່ພັກໃນລະບົບ.</p>
      </div>

      <booking-details-dialog v-if="selectedBooking" :dialog="detailsDialog" :booking="selectedBooking"
        @close="handleCloseDialog" />

    </v-container>
  </section>
</template>

<script>
import BookingListItem from '@/components/BookingListPage/BookingListItem.vue';
import BookingDetailsDialog from '@/components/BookingListPage/BookingDetailsDialog.vue';
import axios from 'axios';
import { mapGetters } from 'vuex';
import { fetchRooms } from '@/services/room';

export default {
  name: 'BookingListPage',
  components: {
    BookingListItem,
    BookingDetailsDialog
  },
  data() {
    return {
      customerName: '',
      loading: true,
      bookings: [],
      detailsDialog: false,
      selectedBooking: null,
      error: null
    }
  },
  computed: {
    ...mapGetters('auth', ['cusId']),
  },
  methods: {
    async loadBookings(userId) {
      this.loading = true;
      this.error = null;

      try {
        // 1) get the raw bookings array
        const historyRes = await axios.get(
          `http://127.0.0.1:3000/api/bookings/history/${userId}`
        );
        const bookings = historyRes.data.data;   // → [ { id, cus_id, details: [{Room_id…}], … } ]

        // 2) for each booking, fetch customer + room in parallel
        const enriched = await Promise.all(
          bookings.map(async (bk) => {
            // fetch customer
            const custRes = await axios.get(
              `http://127.0.0.1:3000/api/customer/${bk.cus_id}`
            );
            const cust = custRes.data; // { c_id, name, last_name, … }

            // fetch room (we assume only one detail item per booking)
            const roomId = bk.details[0].Room_id;
            const roomRes = await axios.get(
              `http://127.0.0.1:3000/api/rooms/${roomId}`
            );
            const room = roomRes.data.data; 
            // { id, name: "Room 402", price, roomTypeName, … }

            // build the final shape:
            return {
              // prefix "BK" + zero‑padded ID, e.g. 24 → "BK024"
              id: `BK${String(bk.id).padStart(3, '0')}`,

              status:         bk.status,
              User_id:        bk.User_id,
              cus_id:         bk.cus_id,
              startDate:      bk.startDate,
              endDate:        bk.endDate,
              total_stay_days:bk.total_stay_days,
              total_price:    parseFloat(bk.total_price),

              payment_image:  bk.payment_image,
              details:        bk.details,

              // pull apart the room object into exactly the keys you want
              room: {
                name:           room.roomTypeName,                     // "Twin Room" or "Deluxe Pool View"
                number:         room.name.split(' ').pop(),            // "402"
                image:          'https://lh3.googleusercontent.com/d/1TQE8GybYqGN_v-ZrMPApGRwCXt9FNnpc',     // ← you'll need to supply your own
                price_per_night: parseFloat(room.price)
              },

              // single field with full name
              customer: {
                name: `${cust.name} ${cust.last_name}`                // "testt testt"
              }
            };
          })
        );

        this.bookings = enriched;
        console.log('Enriched bookings:', this.bookings);

      } catch (err) {
        this.error = 'Failed to load bookings';
        console.error(err);
      } finally {
        this.loading = false;
      }
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
    this.loadBookings(this.cusId);
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