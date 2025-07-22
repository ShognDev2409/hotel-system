<template>
  <div class="rooms-page">
    <HeroBanner
      src="https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
    />

    <SearchBar
      :filters="filters"
      :min-date="minDate"
      :guest-options="guestOptions"
      @search="applyFilters"
    />

    <div class="room-list">
      <v-row dense>
        <v-col
          cols="12"
          v-for="room in filteredRooms"
          :key="room.id"
          class="mb-4"
        >
          <RoomCard
            :room="room"
            @book="handleBookNow(room.id)"
            @details="openDetails(room)"
          />
        </v-col>
      </v-row>
    </div>
  </div>
</template>

<script>
import HeroBanner  from '@/components/RoomPage/HeroBanner.vue'
import RoomCard    from '@/components/RoomPage/RoomCard.vue'
import SearchBar   from '@/components/RoomPage/SearchBar.vue'
import { fetchRooms } from '@/services/room.js'

export default {
  name: 'RoomsPage',
  components: { HeroBanner, SearchBar, RoomCard },

  data() {
    return {
      minDate: new Date().toISOString().substr(0, 10),
      guestOptions: [
        '1 guest, 1 room',
        '2 guests, 1 room',
        '3 guests, 1 room',
        '4 guests, 2 rooms',
        '5 guests, 2 rooms',
        '6 guests, 3 rooms'
      ],
      filters: {
        checkIn:  '',
        checkOut: '',
        guests:   '2 guests, 1 room'
      },
      rooms: []  // will be populated in created()
    }
  },

  async created() {
    try {
      // fetchRooms returns Room instances with description & image already attached
      this.rooms = await fetchRooms()
    } catch (err) {
      console.error('Error fetching rooms:', err)
    }
  },

  computed: {
    filteredRooms() {
      // TODO: implement real date/guest filtering here
      return this.rooms
    }
  },

  methods: {
    applyFilters() {
      // trigger any filtering or re-fetching logic
    },

    handleBookNow(roomId) {
      if (!this.$store.getters.isAuthenticated) {
        return this.$router.push({
          name: 'login',
          query: { redirect: this.$route.fullPath }
        })
      }
      if (!this.filters.checkIn || !this.filters.checkOut) {
        return alert('ກະລຸນາເລືອກວັນເຂົ້າແລະອອກກ່ອນ')
      }
      this.$router.push({
        name: 'Booking',
        params: { roomId },
        query: {
          checkIn:  this.filters.checkIn,
          checkOut: this.filters.checkOut,
          guests:   this.filters.guests
        }
      })
    },

    openDetails(room) {
      // e.g. show a modal or navigate to a details page
      this.$router.push({ name: 'RoomDetails', params: { roomId: room.id } })
    }
  }
}
</script>

<style scoped>
.rooms-page {
  background: #f5f5f5;
}
.room-list {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}
</style>
