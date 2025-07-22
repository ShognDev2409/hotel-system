<template>
  <v-dialog v-model="dialog" persistent max-width="600px">
    <template #activator="{ on, attrs }">
      <v-btn
        block
        class="details-btn ma-0"
        v-bind="attrs"
        v-on="on"
        :disabled="!isAvailable"
      >
        Booking Now
      </v-btn>
    </template>

    <v-card class="dialog-card">
      <v-toolbar flat class="dialog-toolbar">
        <v-toolbar-title>Booking - {{ room.name }}</v-toolbar-title>
        <v-spacer />
        <v-btn icon @click="dialog = false" :disabled="submitting">
          <v-icon color="white">mdi-close</v-icon>
        </v-btn>
      </v-toolbar>

      <v-card-text class="dialog-content-area pa-5">
        <v-row align="center" class="mb-5">
          <v-col cols="12" sm="4">
            <v-img :src="room.image" height="120px" class="rounded-lg elevation-2" cover></v-img>
          </v-col>
          <v-col cols="12" sm="8" class="pl-sm-5">
            <h3 class="text-h6 font-weight-bold mb-2">{{ room.name }}</h3>
            <p class="body-2 grey--text text--darken-3">{{ room.description }}</p>
          </v-col>
        </v-row>

        <v-divider class="mb-6"></v-divider>

        <v-form ref="form" v-model="valid" lazy-validation>
          <div class="info-block mb-6">
            <h3 class="section-title">Guest Information</h3>
            <v-list dense color="transparent">
              <v-list-item>
                <v-list-item-icon><v-icon color="grey darken-1">mdi-account</v-icon></v-list-item-icon>
                <v-list-item-content><v-list-item-title>{{ form.name }}</v-list-item-title></v-list-item-content>
              </v-list-item>
              <v-list-item>
                <v-list-item-icon><v-icon color="grey darken-1">mdi-email</v-icon></v-list-item-icon>
                <v-list-item-content><v-list-item-title>{{ form.email }}</v-list-item-title></v-list-item-content>
              </v-list-item>
              <v-list-item>
                <v-list-item-icon><v-icon color="grey darken-1">mdi-phone</v-icon></v-list-item-icon>
                <v-list-item-content><v-list-item-title>{{ form.phone }}</v-list-item-title></v-list-item-content>
              </v-list-item>
            </v-list>
          </div>
          
          <v-row>
            <v-col cols="12" sm="6">
              <v-menu v-model="menuIn" :close-on-content-click="false" transition="scale-transition" offset-y min-width="auto">
                <template #activator="{ on, attrs }">
                  <v-text-field v-model="form.checkIn" label="Check In" prepend-inner-icon="mdi-calendar" readonly outlined dense v-bind="attrs" v-on="on" :rules="[v => !!v || 'Please select a date']"></v-text-field>
                </template>
                <v-date-picker v-model="form.checkIn" @input="menuIn = false" :min="minDate" no-title></v-date-picker>
              </v-menu>
            </v-col>
            <v-col cols="12" sm="6">
              <v-menu v-model="menuOut" :close-on-content-click="false" transition="scale-transition" offset-y min-width="auto">
                <template #activator="{ on, attrs }">
                  <v-text-field v-model="form.checkOut" label="Check Out" prepend-inner-icon="mdi-calendar" readonly outlined dense v-bind="attrs" v-on="on" :rules="[v => !!v || 'Please select a date']"></v-text-field>
                </template>
                <v-date-picker v-model="form.checkOut" @input="menuOut = false" :min="form.checkIn || minDate" no-title></v-date-picker>
              </v-menu>
            </v-col>
            
            <v-col cols="12" v-if="numberOfNights > 0" class="date-summary">
              <v-icon color="indigo">mdi-bed-clock</v-icon>
              <span>Total Stay: <strong>{{ numberOfNights }} {{ numberOfNights > 1 ? 'Nights' : 'Night' }}</strong></span>
            </v-col>

            <v-col cols="12" class="mt-4" v-if="totalPrice > 0">
              <div class="payment-section">
                <div class="price-display">
                  <v-icon color="green darken-2" class="mr-2">mdi-cash</v-icon>
                  <span class="price-label">Total Price:</span>
                  <span class="price-amount">{{ totalPrice.toLocaleString() }} LAK</span>
                </div>
                <v-divider class="my-4"></v-divider>
                <div class="qr-code-area text-center">
                  <h3 class="section-title-small">Scan QR to Pay</h3>
                  <v-img
                      src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=pay-me-now"
                      alt="Mock QR Code for Payment"
                      max-width="150"
                      class="mx-auto my-2 elevation-2 rounded-lg"
                  ></v-img>
                </div>
              </div>
            </v-col>
            <v-col cols="12" class="mt-6">
               <h3 class="section-title text-center">Upload Payment Statement</h3>
              <input
                ref="hiddenFileInput"
                type="file"
                accept="image/*"
                style="display: none"
                @change="handleFileSelect"
              />
              
              <div class="file-drop-zone" @click="triggerFileSelect">
                <div v-if="!form.imageBase64" class="text-center placeholder-content">
                  <v-icon class="upload-icon" size="48">mdi-cloud-upload-outline</v-icon>
                  <div class="upload-text">Click to upload your receipt</div>
                  <div class="upload-subtext">PNG, JPG or GIF</div>
                </div>
                <div v-else class="image-preview-container">
                  <v-img
                    :src="form.imageBase64"
                    max-height="200"
                    contain
                    class="image-preview"
                  ></v-img>
                  <v-btn
                    icon
                    small
                    class="remove-image-btn"
                    @click.stop="removeImage"
                  >
                    <v-icon color="error">mdi-close-circle</v-icon>
                  </v-btn>
                </div>
              </div>
              
              <div v-if="imageError" class="error--text text-caption mt-2">
                {{ imageError }}
              </div>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>

      <v-divider></v-divider>

      <v-card-actions class="pa-4">
        <v-spacer />
        <v-btn text @click="dialog = false" large :disabled="submitting">Cancel</v-btn>
        <v-btn
          class="dialog-btn"
          :loading="submitting"
          :disabled="!isFormValid || submitting"
          @click="submit"
          large
          depressed
        >
          <v-icon left>mdi-check-circle-outline</v-icon>
          Confirm Booking
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import BookingService from '@/services/bookingService.js';
import { mapGetters } from 'vuex';
import axios from 'axios';

export default {
  name: 'BookingDialog',
  props: {
    // IMPORTANT: Make sure your room object contains a 'price' property (e.g., room.price)
    room: { type: Object, required: true },
    isAvailable: { type: Boolean, default: true }
  },
  data() {
    return {
      dialog: false,
      valid: true,
      menuIn: false,
      menuOut: false,
      minDate: new Date().toISOString().substr(0, 10),
      form: {
        name: '', 
        email: '', 
        phone: '',
        checkIn: '', 
        checkOut: '',
        imageFile: null, 
        imageBase64: '',
      },
      submitting: false,
      imageError: '',
    }
  },
  computed: {
    ...mapGetters('auth', ['cusId']), 
    numberOfNights() {
      if (!this.form.checkIn || !this.form.checkOut) return 0;
      const start = new Date(this.form.checkIn);
      const end = new Date(this.form.checkOut);
      if (end <= start) return 0;
      const diffTime = end - start;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays > 0 ? diffDays : 0;
    },
    totalPrice() {
      if (!this.room.price || this.numberOfNights <= 0) return 0;
      return this.numberOfNights * this.room.price;
    },
    isFormValid() {
      return this.valid && 
             this.form.checkIn && 
             this.form.checkOut && 
             this.numberOfNights > 0 &&
             this.form.imageBase64 &&
             !this.imageError;
    }
  },
  methods: {
    async fetchUserData() {
      this.isLoading = true;
      this.error     = null;

      try {
        // 1) hit your customer endpoint (don’t forget http://)
        const response = await axios.get(
          `http://127.0.0.1:3000/api/customer/${this.cusId}`
        );

        // 2) the API returns the object directly
        const cust = response.data;  
        // {
        //   c_id: 38,
        //   name: "testt",
        //   last_name: "testt",
        //   tel: "12345678",
        //   email: "test@gmaill.com",
        //   …
        // }

        // 3) build full name and populate your form
        this.form.name  = `${cust.name} ${cust.last_name}`;
        this.form.email = cust.email;
        this.form.phone = cust.tel;

      } catch (err) {
        this.error = 'Failed to fetch customer data.';
        console.error('fetchUserData error:', err);
      } finally {
        this.isLoading = false;
      }
    },
    
    triggerFileSelect() {
      this.$refs.hiddenFileInput.click();
    },
    
    handleFileSelect(event) {
      const file = event.target.files[0];
      if (file) {
        this.handleImageUpload(file);
      }
    },
    
    handleImageUpload(file) {
      this.imageError = '';
      if (!file) {
        this.form.imageBase64 = '';
        this.form.imageFile = null;
        return;
      }
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
      if (!validTypes.includes(file.type)) {
        this.imageError = 'Please upload a valid image file (PNG, JPG, or GIF)';
        return;
      }
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        this.imageError = 'File size must be less than 5MB';
        return;
      }
      this.form.imageFile = file;
      const reader = new FileReader();
      reader.onload = (e) => {
        this.form.imageBase64 = e.target.result;
      };
      reader.onerror = () => {
        this.imageError = 'Error reading file. Please try again.';
        this.form.imageBase64 = '';
        this.form.imageFile = null;
      };
      reader.readAsDataURL(file);
    },
    
    removeImage() {
      this.form.imageFile = null;
      this.form.imageBase64 = '';
      this.imageError = '';
      if (this.$refs.hiddenFileInput) {
        this.$refs.hiddenFileInput.value = '';
      }
    },
    
    async submit() {
      if (!this.form.imageBase64) {
        this.imageError = 'Please upload a payment statement';
        return;
      }
      
      if (!this.$refs.form.validate() || !this.isFormValid) {
        return;
      }
      
      this.submitting = true;
      const payload = {
        booking: {
          cus_id: this.cusId, 
          startDate: this.form.checkIn,
          endDate: this.form.checkOut,
          payment_image: this.form.imageBase64,
          total_price: this.totalPrice
        },
        detail: {
          Room_id: this.room.id,
          description: `Booking for room ${this.room.name} by ${this.form.name}`,
        }
      };

      try {
        const response = await BookingService.createBooking(payload);
        if (response.success) {
          this.$emit('book-success');
          this.dialog = false;
          this.resetForm();
          alert(response.message);
          this.$router.push('/booking-list');
        } else {
          alert('An error occurred: ' + response.message);
        }
      } catch (error) {
        console.error('Booking error:', error);
        alert('Failed to create the booking. Please try again later.');
      } finally {
        this.submitting = false;
      }
    },
    
    resetForm() {
      this.form.checkIn = '';
      this.form.checkOut = '';
      this.form.imageFile = null;
      this.form.imageBase64 = '';
      this.imageError = '';
      if (this.$refs.hiddenFileInput) {
        this.$refs.hiddenFileInput.value = '';
      }
    }
  },
  created() {
    this.fetchUserData();
  },
  watch: {
    dialog(val) {
      if (!val) {
        this.resetForm();
      }
    },
    'form.checkIn': function (newVal) {
      if (this.form.checkOut && new Date(newVal) >= new Date(this.form.checkOut)) {
        this.form.checkOut = '';
      }
    }
  }
}
</script>

<style scoped>
.details-btn {
  background: linear-gradient(45deg, #F5B93F, #f7b023) !important;
  color: white !important;
  font-weight: bold !important;
  text-transform: none !important;
  border-top-left-radius: 0 !important;
  border-top-right-radius: 0 !important;
  border-bottom-left-radius: 15px !important;
  border-bottom-right-radius: 0px !important;
}
.ma-0 { margin: 0 !important; }
.dialog-card {
  border-radius: 16px !important;
  font-family: 'Noto Sans Lao', sans-serif !important;
  overflow: hidden;
}
.dialog-toolbar {
  background: linear-gradient(45deg, #F5B93F, #f7b023) !important;
  color: white !important;
  font-weight: bold !important;
}
.dialog-content-area { background-color: #FBFBFB; }
.dialog-btn {
  background: linear-gradient(45deg, #F5B93F, #f7b023) !important;
  color: white !important;
  font-weight: bold !important;
  text-transform: none !important;
}
.info-block {
  background-color: #fff;
  padding: 8px 16px;
  border-radius: 12px;
  border: 1px solid #eee;
}
.section-title {
  font-size: 1rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
}
.section-title-small {
  font-size: 0.9rem;
  font-weight: 600;
  color: #555;
  margin-bottom: 4px;
}
.file-drop-zone {
  border: 2px dashed #ccc;
  border-radius: 12px;
  padding: 24px;
  cursor: pointer;
  transition: all 0.3s ease;
  background-color: #fff;
  position: relative;
  min-height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.file-drop-zone:hover {
  border-color: #F5B93F;
  background-color: #fffaf0;
}
.placeholder-content {
  width: 100%;
}
.placeholder-content .upload-icon {
  color: #F5B93F;
}
.placeholder-content .upload-text {
  font-weight: 500;
  margin-top: 8px;
}
.placeholder-content .upload-subtext {
  font-size: 0.8rem;
  color: #999;
}
.image-preview-container {
  position: relative;
  width: 100%;
}
.image-preview {
  border-radius: 8px;
}
.remove-image-btn {
  position: absolute;
  top: -10px;
  right: -10px;
  background-color: white;
  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
}
.date-summary {
  background-color: #f1f3ff;
  border-radius: 8px;
  padding: 12px 16px;
  text-align: center;
  font-weight: 500;
  color: #3f51b5;
}
.error--text {
  color: #ff5252;
}

/* START: Added styles for new payment section */
.payment-section {
  background-color: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  padding: 16px;
}
.price-display {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.price-label {
  font-size: 1.1rem;
  font-weight: 500;
  color: #444;
}
.price-amount {
  font-size: 1.2rem;
  font-weight: bold;
  color: #2e7d32;
}
/* END: Added styles for new payment section */
</style>