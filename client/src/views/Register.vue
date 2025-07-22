<!-- client/src/views/Register.vue -->
<template>
  <div class="register-page">
    <!-- Background overlay -->
    <div class="background-overlay"></div>
    
    <v-container fluid class="register-container">
      <v-row justify="center" align="center" class="fill-height">
        <v-col cols="12" sm="10" md="8" lg="6" xl="4">
          <!-- Registration Card -->
          <v-card class="register-card" elevation="0">
            <div class="register-icon">
              <h1 class="register-title">ສະໝັກສະມາຊິກ</h1>
              <p class="register-subtitle">ສ້າງບັນຊີໃໝ່ເພື່ອຈອງຫ້ອງພັກ</p>
            </div>
            <v-card-text class="px-8 pb-8">
              <v-form ref="form" v-model="valid" @submit.prevent="handleRegister">
                <v-row>
                  <v-col cols="6">
                    <v-text-field
                      v-model="form.name"
                      label="ຊື່ *"
                      :rules="nameRules"
                      :disabled="loading"
                      outlined
                      dense
                      required
                      prepend-inner-icon="mdi-account"
                      class="custom-field"
                    />
                  </v-col>
                  <v-col cols="6">
                    <v-text-field
                      v-model="form.last_name"
                      label="ນາມສະກຸນ *"
                      :rules="lastNameRules"
                      :disabled="loading"
                      outlined
                      dense
                      required
                      prepend-inner-icon="mdi-account"
                      class="custom-field"
                    />
                  </v-col>
                </v-row>
                
                <v-text-field
                  v-model="form.tel"
                  label="ເບີໂທບະສັບ *"
                  type="tel"
                  :rules="telRules"
                  :disabled="loading"
                  outlined
                  dense
                  required
                  prepend-inner-icon="mdi-phone"
                  class="custom-field"
                  maxlength="10"
                />
                
                <v-text-field
                  v-model="form.email"
                  label="ອີເມວ *"
                  type="email"
                  :rules="emailRules"
                  :disabled="loading"
                  outlined
                  dense
                  required
                  prepend-inner-icon="mdi-email"
                  class="custom-field"
                  placeholder="example@gmail.com"
                />
                
                <v-textarea
                  v-model="form.address"
                  label="ທີ່ຢູ່ *"
                  :rules="addressRules"
                  :disabled="loading"
                  outlined
                  dense
                  required
                  prepend-inner-icon="mdi-map-marker"
                  class="custom-field"
                  rows="3"
                  placeholder="ບ້ານ, ເມືອງ, ແຂວງ"
                  :maxlength="null"
                />
                
                <v-text-field
                  v-model="form.password"
                  label="ລະຫັດຜ່ານ *"
                  :type="showPassword ? 'text' : 'password'"
                  :rules="passwordRules"
                  :disabled="loading"
                  outlined
                  dense
                  required
                  prepend-inner-icon="mdi-lock"
                  :append-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
                  @click:append="showPassword = !showPassword"
                  class="custom-field"
                />
                
                <v-text-field
                  v-model="form.confirmPassword"
                  label="ຢືນຢັນລະຫັດຜ່ານ *"
                  :type="showConfirmPassword ? 'text' : 'password'"
                  :rules="confirmPasswordRules"
                  :disabled="loading"
                  outlined
                  dense
                  required
                  prepend-inner-icon="mdi-lock-check"
                  :append-icon="showConfirmPassword ? 'mdi-eye-off' : 'mdi-eye'"
                  @click:append="showConfirmPassword = !showConfirmPassword"
                  class="custom-field"
                />
                
                <v-alert
                  v-if="errorMessage"
                  type="error"
                  dense
                  text
                  class="mb-4 custom-alert"
                >
                  {{ errorMessage }}
                </v-alert>
                
                <v-alert
                  v-if="successMessage"
                  type="success"
                  dense
                  text
                  class="mb-4 custom-alert"
                >
                  {{ successMessage }}
                </v-alert>
                
                <v-btn
                  type="submit"
                  block
                  large
                  :loading="loading"
                  :disabled="!valid || loading"
                  class="register-btn mt-4"
                  depressed
                >
                  ລົງທະບຽນ
                </v-btn>
                
                <!-- Debug button (temporary) -->
                <v-btn @click="checkFormValidation" color="info" small class="mt-2">
                  Debug Form
                </v-btn>
                
                <!-- Test submit button (temporary) -->
                <v-btn @click="testSubmit" color="warning" small class="mt-2 ml-2">
                  Test Submit
                </v-btn>
              </v-form>
            </v-card-text>

            <!-- Login Link -->
            <v-card-actions class="justify-center align-center pb-6 px-0">
              <div class="login-section-wrapper">
                <div class="login-section">
                  <span class="login-text">ມີບັນຊີແລ້ວ? </span>
                  <v-btn 
                    text 
                    color="#F4B942" 
                    to="/login"
                    :disabled="loading"
                    class="login-btn"
                    small
                  >
                    ເຂົ້າສູ່ລະບົບ
                  </v-btn>
                </div>
              </div>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import api from '@/services/api'

export default {
  name: 'RegisterPage',
  data() {
    return {
      valid: false,
      loading: false,
      showPassword: false,
      showConfirmPassword: false,
      errorMessage: '',
      successMessage: '',
      
      // Form data matching your API endpoint
      form: {
        name: '',
        last_name: '',
        tel: '',
        email: '',
        address: '',
        password: '',
        confirmPassword: '',
        // Additional fields required by your API
        gender: 'M', // Default to Male, you can add gender selection to template if needed
        birthday: '1990-01-01' // Default birthday, you can add date picker if needed
      },
      
      // Validation rules
      nameRules: [
        v => !!v || 'ຊື່ແມ່ນຈຳເປັນ',
        v => (v && v.length >= 2) || 'ຊື່ຕ້ອງມີຢ່າງໜ້ອຍ 2 ຕົວອັກສອນ'
      ],
      
      lastNameRules: [
        v => !!v || 'ນາມສະກຸນແມ່ນຈຳເປັນ',
        v => (v && v.length >= 2) || 'ນາມສະກຸນຕ້ອງມີຢ່າງໜ້ອຍ 2 ຕົວອັກສອນ'
      ],
      
      telRules: [
        v => !!v || 'ເບີໂທແມ່ນຈຳເປັນ',
        v => /^\d{8,10}$/.test(v) || 'ເບີໂທຕ້ອງເປັນຕົວເລກ 8-10 ຫລັກ'
      ],
      
      emailRules: [
        v => !!v || 'ອີເມວແມ່ນຈຳເປັນ',
        v => /.+@.+\..+/.test(v) || 'ອີເມວບໍ່ຖືກຕ້ອງ'
      ],
      
      addressRules: [
        v => !!v || 'ທີ່ຢູ່ແມ່ນຈຳເປັນ',
        v => (v && v.length >= 10) || 'ທີ່ຢູ່ຕ້ອງມີຢ່າງໜ້ອຍ 10 ຕົວອັກສອນ'
      ],
      
      passwordRules: [
        v => !!v || 'ລະຫັດຜ່ານແມ່ນຈຳເປັນ',
        v => (v && v.length >= 6) || 'ລະຫັດຜ່ານຕ້ອງມີຢ່າງໜ້ອຍ 6 ຕົວອັກສອນ'
      ],
      
      confirmPasswordRules: [
        v => !!v || 'ຢືນຢັນລະຫັດຜ່ານແມ່ນຈຳເປັນ',
        v => v === this.form.password || 'ລະຫັດຜ່ານບໍ່ກົງກັນ'
      ]
    }
  },
  
  methods: {
    async handleRegister() {
      // Clear previous messages
      this.errorMessage = '';
      this.successMessage = '';
      
      // Validate form
      if (!this.$refs.form.validate()) {
        this.errorMessage = 'ກະລຸນາກວດສອບຂໍ້ມູນທີ່ປ້ອນ';
        return;
      }
      
      // Check if passwords match
      if (this.form.password !== this.form.confirmPassword) {
        this.errorMessage = 'ລະຫັດຜ່ານບໍ່ກົງກັນ';
        return;
      }
      
      this.loading = true;
      
      try {
        // Prepare data for API (exclude confirmPassword)
        const registrationData = {
          name: this.form.name.trim(),
          last_name: this.form.last_name.trim(),
          gender: this.form.gender,
          birthday: this.form.birthday,
          tel: this.form.tel.trim(),
          email: this.form.email.trim(),
          address: this.form.address.trim(),
          password: this.form.password
        };
        
        console.log('Sending registration data:', registrationData);
        
        // Make API call
        const response = await fetch('http://localhost:3000/api/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(registrationData)
        });
        
        console.log('Response status:', response.status);
        const responseData = await response.json();
        console.log('Response data:', responseData);
        
        if (response.ok) {
          // Success
          this.successMessage = 'ລົງທະບຽນສຳເລັດ! ກະລຸນາເຂົ້າສູ່ລະບົບ';
          
          // Reset form
          this.resetForm();
          
          // Redirect to login after 2 seconds
          setTimeout(() => {
            this.$router.push('/login');
          }, 2000);
          
        } else {
          // Handle error response
          if (responseData.message) {
            this.errorMessage = this.translateErrorMessage(responseData.message);
          } else if (responseData.error) {
            this.errorMessage = this.translateErrorMessage(responseData.error);
          } else {
            this.errorMessage = 'ເກີດຂໍ້ຜິດພາດ ກະລຸນາລອງໃໝ່';
          }
        }
        
      } catch (error) {
        console.error('Registration error:', error);
        
        if (error.name === 'TypeError' && error.message.includes('fetch')) {
          this.errorMessage = 'ບໍ່ສາມາດເຊື່ອມຕໍ່ກັບເຊີເວີໄດ້ ກະລຸນາລອງໃໝ່';
        } else {
          this.errorMessage = 'ເກີດຂໍ້ຜິດພາດ ກະລຸນາລອງໃໝ່';
        }
        
      } finally {
        this.loading = false;
      }
    },
    
    translateErrorMessage(message) {
      // Translate common error messages to Lao
      const translations = {
        'Email already exists': 'ອີເມວນີ້ຖືກນຳໃຊ້ແລ້ວ',
        'Phone number already exists': 'ເບີໂທນີ້ຖືກນຳໃຊ້ແລ້ວ',
        'User already exists': 'ຜູ້ໃຊ້ນີ້ມີຢູ່ແລ້ວ',
        'Invalid email format': 'ຮູບແບບອີເມວບໍ່ຖືກຕ້ອງ',
        'Password too weak': 'ລະຫັດຜ່ານບໍ່ແຂງແກ່ນພໍ',
        'Invalid phone number': 'ເບີໂທບໍ່ຖືກຕ້ອງ',
        'Required fields missing': 'ມີຂໍ້ມູນທີ່ຈຳເປັນຍັງບໍ່ໄດ້ປ້ອນ'
      };
      
      return translations[message] || message;
    },
    
    resetForm() {
      this.form = {
        name: '',
        last_name: '',
        tel: '',
        email: '',
        address: '',
        password: '',
        confirmPassword: '',
        gender: 'M',
        birthday: '1990-01-01'
      };
      
      if (this.$refs.form) {
        this.$refs.form.reset();
        this.$refs.form.resetValidation();
      }
      
      this.showPassword = false;
      this.showConfirmPassword = false;
    },
    
    // Debug methods (remove in production)
    checkFormValidation() {
      console.log('Form valid:', this.valid);
      console.log('Form data:', this.form);
      console.log('Form validation:', this.$refs.form.validate());
    },
    
    testSubmit() {
      console.log('Test submit clicked');
      console.log('Current form data:', this.form);
      
      // Fill form with test data
      this.form = {
        name: 'Test',
        last_name: 'User',
        tel: '12345678',
        email: 'test@example.com',
        address: 'Test Address, Test City, Test Province',
        password: 'testpassword',
        confirmPassword: 'testpassword',
        gender: 'M',
        birthday: '1990-01-01'
      };
    }
  },
  
  watch: {
    // Watch for password changes to update confirm password validation
    'form.password'() {
      if (this.$refs.form && this.form.confirmPassword) {
        this.$refs.form.validate();
      }
    }
  }

}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Lao:wght@400;700&display=swap');

.register-page {
  min-height: 100vh;
  background-image: url('https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem 0;
  font-family: 'Noto Sans Lao', sans-serif !important;
}

.background-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(2px);
}

.register-container {
  position: relative;
  z-index: 2;
  padding: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
}

.register-card {
  background: rgba(255, 255, 255, 0.95) !important;
  border-radius: 20px !important;
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1) !important;
  max-width: 500px;
  margin: 0 auto;
  width: 100%;
}

.register-icon {
  text-align: center;
  padding: 2.5rem 0 1.5rem 0;
}

.register-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #333;
  margin: 0;
}

.register-subtitle {
  font-size: 1rem;
  color: #666;
  margin: 0;
}

.custom-field >>> .v-input__control .v-input__slot {
  background: rgba(255, 255, 255, 0.9) !important;
  border-radius: 8px !important;
  border: 1px solid rgba(244, 185, 66, 0.3) !important;
}

.custom-field >>> .v-input__control .v-input__slot fieldset {
  border-radius: 8px !important;
  border-color: rgba(244, 185, 66, 0.3) !important;
}

.custom-field.v-input--is-focused >>> .v-input__control .v-input__slot {
  border-color: #F4B942 !important;
  box-shadow: 0 0 0 1px rgba(244, 185, 66, 0.3) !important;
}

.register-btn {
  background: linear-gradient(135deg, #F4B942 0%, #FFD700 100%) !important;
  color: white !important;
  border-radius: 10px !important;
  font-weight: 600 !important;
  font-size: 1rem !important;
  text-transform: none !important;
  height: 50px !important;
  box-shadow: 0 4px 15px rgba(244, 185, 66, 0.3) !important;
  transition: all 0.3s ease !important;
}

.register-btn:hover {
  transform: translateY(-2px) !important;
  box-shadow: 0 6px 20px rgba(244, 185, 66, 0.4) !important;
}

.custom-alert {
  border-radius: 8px !important;
}

.login-section-wrapper {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.login-section {
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: 0.25rem;
  width: 100%;
}

.login-text {
  color: #666;
  font-size: 0.9rem;
  display: inline-flex;
  align-items: center;
}

.fill-height {
  min-height: 100vh;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
}

/* Responsive */
@media (max-width: 600px) {
  .register-card {
    margin: 0.5rem;
  }
}

@media (max-width: 650px) {
  .register-card {
    max-width: 98vw;
    margin: 0.5rem auto;
  }
}
</style>