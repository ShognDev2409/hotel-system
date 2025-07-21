<template>
  <div class="booking-page">
    <v-container>
      <div class="booking-header">
        <h1 class="booking-title">ຈອງຫ້ອງພັກ</h1>
        <p class="booking-subtitle">ກະລຸນາເລືອກວັນທີ່ແລະລາຍລະອຽດການຈອງ</p>
      </div>

      <v-row>
        <!-- Room Selection -->
        <v-col cols="12" md="4">
          <v-card class="room-selection-card">
            <v-card-title>
              <v-icon class="mr-2">mdi-bed</v-icon>
              ຂໍ້ມູນຫ້ອງພັກ
            </v-card-title>
            
            <v-card-text>
              <div v-if="selectedRoom" class="selected-room">
                <div class="room-info">
                  <h3>{{ selectedRoom.name }}</h3>
                  <p class="room-type">
                    <v-icon small class="mr-1">mdi-bed</v-icon>
                    {{ selectedRoom.type }}
                  </p>
                  <p class="room-price">
                    <v-icon small class="mr-1">mdi-currency-usd</v-icon>
                    {{ formatPrice(selectedRoom.price) }} ບາດ/ຄືນ
                  </p>
                </div>
                
                <v-btn
                  text
                  color="primary"
                  @click="changeRoom"
                  class="mt-2"
                >
                  <v-icon small class="mr-1">mdi-swap-horizontal</v-icon>
                  ເປ່ຽນຫ້ອງ
                </v-btn>
              </div>
              
              <div v-else class="no-room-selected">
                <p>ບໍ່ໄດ້ເລືອກຫ້ອງ</p>
                <v-btn
                  color="primary"
                  @click="selectRoom"
                >
                  <v-icon class="mr-1">mdi-plus</v-icon>
                  ເລືອກຫ້ອງ
                </v-btn>
              </div>
            </v-card-text>
          </v-card>
        </v-col>

        <!-- Booking Form -->
        <v-col cols="12" md="8">
          <v-card class="booking-form-card">
            <v-card-title>
              <v-icon class="mr-2">mdi-calendar</v-icon>
              ລາຍລະອຽດການຈອງ
            </v-card-title>
            
            <v-card-text>
              <v-form ref="bookingForm" v-model="valid">
                <!-- Date Selection -->
                <v-row>
                  <v-col cols="12" md="6">
                    <v-menu
                      v-model="checkinMenu"
                      :close-on-content-click="false"
                      :nudge-right="40"
                      transition="scale-transition"
                      offset-y
                      min-width="auto"
                    >
                      <template v-slot:activator="{ on, attrs }">
                        <v-text-field
                          v-model="booking.checkinDate"
                          label="ວັນທີ່ເຂົ້າພັກ *"
                          prepend-icon="mdi-calendar"
                          readonly
                          outlined
                          :rules="checkinRules"
                          v-bind="attrs"
                          v-on="on"
                        ></v-text-field>
                      </template>
                      <v-date-picker
                        v-model="booking.checkinDate"
                        :min="today"
                        @input="checkinMenu = false"
                      ></v-date-picker>
                    </v-menu>
                  </v-col>
                  
                  <v-col cols="12" md="6">
                    <v-menu
                      v-model="checkoutMenu"
                      :close-on-content-click="false"
                      :nudge-right="40"
                      transition="scale-transition"
                      offset-y
                      min-width="auto"
                    >
                      <template v-slot:activator="{ on, attrs }">
                        <v-text-field
                          v-model="booking.checkoutDate"
                          label="ວັນທີ່ອອກ *"
                          prepend-icon="mdi-calendar"
                          readonly
                          outlined
                          :rules="checkoutRules"
                          v-bind="attrs"
                          v-on="on"
                        ></v-text-field>
                      </template>
                      <v-date-picker
                        v-model="booking.checkoutDate"
                        :min="minCheckoutDate"
                        @input="checkoutMenu = false"
                      ></v-date-picker>
                    </v-menu>
                  </v-col>
                </v-row>

                <!-- Guest Information -->
                <v-row>
                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model="booking.guestName"
                      label="ຊື່ຜູ້ຈອງ *"
                      prepend-icon="mdi-account"
                      :rules="nameRules"
                      outlined
                    ></v-text-field>
                  </v-col>
                  
                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model="booking.guestPhone"
                      label="ເບີໂທ *"
                      prepend-icon="mdi-phone"
                      :rules="phoneRules"
                      outlined
                    ></v-text-field>
                  </v-col>
                </v-row>

                <!-- Special Requests -->
                <v-textarea
                  v-model="booking.specialRequests"
                  label="ຄຳຂໍພິເສດ"
                  prepend-icon="mdi-message-text"
                  outlined
                  rows="3"
                ></v-textarea>

                <!-- Booking Summary -->
                <v-card class="booking-summary mt-4" outlined>
                  <v-card-title class="subtitle-1">
                    <v-icon class="mr-2">mdi-calculator</v-icon>
                    ສະຫຼຸບການຈອງ
                  </v-card-title>
                  
                  <v-card-text>
                    <div class="summary-item">
                      <span>ຈຳນວນຄືນ:</span>
                      <span>{{ totalNights }} ຄືນ</span>
                    </div>
                    <div class="summary-item">
                      <span>ລາຄາຕໍ່ຄືນ:</span>
                      <span>{{ formatPrice(selectedRoom?.price || 0) }} ບາດ</span>
                    </div>
                    <div class="summary-item total">
                      <span>ລາຄາລວມ:</span>
                      <span>{{ formatPrice(totalPrice) }} ບາດ</span>
                    </div>
                  </v-card-text>
                </v-card>

                <!-- Submit Button -->
                <v-row class="mt-4">
                  <v-col cols="12">
                    <v-btn
                      :disabled="!valid || !selectedRoom"
                      :loading="submitting"
                      color="success"
                      large
                      block
                      @click="submitBooking"
                    >
                      <v-icon class="mr-2">mdi-check</v-icon>
                      ຢືນຢັນການຈອງ
                    </v-btn>
                  </v-col>
                </v-row>
              </v-form>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import api from '@/services/api'

export default {
  name: 'BookingPage',
  
  data() {
    return {
      valid: false,
      submitting: false,
      checkinMenu: false,
      checkoutMenu: false,
      selectedRoom: null,
      
      booking: {
        checkinDate: '',
        checkoutDate: '',
        guestName: '',
        guestPhone: '',
        specialRequests: ''
      },
      
      // Validation rules
      checkinRules: [
        v => !!v || 'ກະລຸນາເລືອກວັນທີ່ເຂົ້າພັກ'
      ],
      checkoutRules: [
        v => !!v || 'ກະລຸນາເລືອກວັນທີ່ອອກ'
      ],
      nameRules: [
        v => !!v || 'ກະລຸນາໃສ່ຊື່ຜູ້ຈອງ'
      ],
      phoneRules: [
        v => !!v || 'ກະລຸນາໃສ່ເບີໂທ'
      ]
    }
  },

  computed: {
    today() {
      return new Date().toISOString().substr(0, 10)
    },
    
    minCheckoutDate() {
      if (!this.booking.checkinDate) return this.today
      const checkin = new Date(this.booking.checkinDate)
      checkin.setDate(checkin.getDate() + 1)
      return checkin.toISOString().substr(0, 10)
    },
    
    totalNights() {
      if (!this.booking.checkinDate || !this.booking.checkoutDate) return 0
      const checkin = new Date(this.booking.checkinDate)
      const checkout = new Date(this.booking.checkoutDate)
      const diffTime = Math.abs(checkout - checkin)
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      return diffDays
    },
    
    totalPrice() {
      if (!this.selectedRoom) return 0
      return this.totalNights * this.selectedRoom.price
    }
  },

  created() {
    this.loadRoomFromQuery()
    this.loadUserData()
  },

  methods: {
    loadRoomFromQuery() {
      // ✅ Get room data from route query (รวมข้อมูลวันที่จากการค้นหา)
      if (this.$route.query.roomData) {
        try {
          this.selectedRoom = JSON.parse(this.$route.query.roomData)
          console.log('✅ Room loaded from query:', this.selectedRoom)
          
          // ✅ Pre-fill วันที่จากการค้นหา
          if (this.selectedRoom.checkInDate) {
            this.booking.checkinDate = this.selectedRoom.checkInDate
          }
          if (this.selectedRoom.checkOutDate) {
            this.booking.checkoutDate = this.selectedRoom.checkOutDate
          }
          
        } catch (error) {
          console.error('❌ Error parsing room data:', error)
        }
      }
    },

    loadUserData() {
      // ✅ Pre-fill user data
      try {
        const userStr = localStorage.getItem('user')
        const user = userStr ? JSON.parse(userStr) : null
        if (user && user.name) {
          this.booking.guestName = `${user.name} ${user.last_name || ''}`.trim()
          this.booking.guestPhone = user.tel || ''
        }
      } catch (error) {
        console.error('Error loading user data:', error)
      }
    },

    selectRoom() {
      this.$router.push('/rooms')
    },

    changeRoom() {
      this.$router.push('/rooms')
    },

    async submitBooking() {
      if (!this.$refs.bookingForm.validate()) return
      
      this.submitting = true
      
      try {
        const bookingData = {
          room_id: this.selectedRoom.id,
          checkin_date: this.booking.checkinDate,
          checkout_date: this.booking.checkoutDate,
          guest_name: this.booking.guestName,
          guest_phone: this.booking.guestPhone,
          special_requests: this.booking.specialRequests,
          total_nights: this.totalNights,
          total_price: this.totalPrice
        }
        
        console.log('📋 Booking data:', bookingData)
        
        const response = await api.createBooking(bookingData)
        
        if (response.data.success) {
          if (this.$toast) {
            this.$toast.success('ຈອງຫ້ອງສຳເລັດແລ້ວ!')
          } else {
            alert('ຈອງຫ້ອງສຳເລັດແລ້ວ!')
          }
          
          // Redirect to booking list page
          this.$router.push({
            path: '/Booking',
            query: { bookingSuccess: 'true' }
          })
        }
        
      } catch (error) {
        console.error('❌ Booking error:', error)
        if (this.$toast) {
          this.$toast.error('ຈອງຫ້ອງບໍ່ສຳເລັດ')
        } else {
          alert('ຈອງຫ້ອງບໍ່ສຳເລັດ')
        }
      } finally {
        this.submitting = false
      }
    },

    formatPrice(price) {
      return new Intl.NumberFormat('lo-LA').format(price)
    }
  }
}
</script>

<style scoped>
.booking-page {
  padding: 2rem 0;
}

.booking-header {
  text-align: center;
  margin-bottom: 2rem;
}

.booking-title {
  font-size: 2.5rem;
  font-weight: bold;
  color: #333;
}

.booking-subtitle {
  font-size: 1.2rem;
  color: #666;
  margin-top: 1rem;
}

.room-selection-card,
.booking-form-card {
  border-radius: 12px;
}

.selected-room {
  border: 2px solid #4CAF50;
  border-radius: 8px;
  padding: 1rem;
  background-color: #f8f9fa;
}

.room-info h3 {
  margin: 0 0 0.5rem 0;
  color: #333;
}

.room-type, .room-price {
  display: flex;
  align-items: center;
  margin-bottom: 0.5rem;
  color: #666;
}

.room-price {
  font-weight: 600;
  color: #4CAF50;
}

.booking-summary {
  background-color: #f8f9fa;
}

.summary-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
  padding: 0.25rem 0;
}

.summary-item.total {
  font-weight: bold;
  font-size: 1.1rem;
  border-top: 1px solid #ddd;
  padding-top: 0.5rem;
  margin-top: 0.5rem;
}

.no-room-selected {
  text-align: center;
  padding: 2rem;
  color: #666;
}
</style>
