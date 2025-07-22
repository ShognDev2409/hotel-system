
<template>
  <div class="modern-login-page">
    <!-- Background Image -->
    <div class="background-overlay"></div>
    
    <v-container fluid class="login-container">
      <v-row justify="center" align="center" class="fill-height">
        <v-col cols="12" sm="8" md="6" lg="4" xl="3">
          <!-- Welcome Header -->
          <div class="welcome-header">
            <h1 class="welcome-title">ໂຮງແຮມ ທາດຫຼວງວິວ</h1>
          </div>
          
          <!-- Login Card -->
          <v-card class="login-card" elevation="0">
            <!-- Hotel Logo/Icon -->
            <div class="hotel-icon">
              <div class="logo-container">
                <img 
                  :src="require('@/assets/image/logohotel.png')"
                  alt="Hotel Logo"
                  class="hotel-logo"
                />
              </div>
            </div>
            
            <div class="login-title">ເຂົ້າສູ່ລະບົບ</div>
            
            <v-card-text class="px-8 pb-8">
              <v-form ref="form" v-model="valid" @submit.prevent="handleLogin">
                <!-- Email Field -->
                <div class="input-group">
                  <v-text-field
                    v-model="form.email"
                    label="ອີເມວ"
                    type="email"
                    :rules="emailRules"
                    :disabled="loading"
                    outlined
                    dense
                    required
                    class="custom-input"
                    prepend-inner-icon="mdi-email-outline"
                  ></v-text-field>
                </div>

                <!-- Password Field -->
                <div class="input-group">
                  <v-text-field
                    v-model="form.password"
                    label="ປ້ອນລະຫັດຜ່ານ"
                    :type="showPassword ? 'text' : 'password'"
                    :rules="passwordRules"
                    :disabled="loading"
                    outlined
                    dense
                    required
                    class="custom-input"
                    prepend-inner-icon="mdi-lock-outline"
                    :append-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
                    @click:append="showPassword = !showPassword"
                  ></v-text-field>
                </div>

                <!-- Success Message -->
                <v-alert
                  v-if="successMessage"
                  type="success"
                  dense
                  text
                  class="mb-4 custom-alert"
                >
                  {{ successMessage }}
                </v-alert>

                <!-- Error Message -->
                <v-alert
                  v-if="errorMessage"
                  type="error"
                  dense
                  text
                  class="mb-4 custom-alert"
                >
                  {{ errorMessage }}
                </v-alert>

                <!-- Login Button -->
                <v-btn
                  type="submit"
                  block
                  large
                  :loading="loading"
                  :disabled="!valid || loading"
                  class="login-btn"
                  depressed
                >
                  ເຂົ້າສູ່ລະບົບ
                </v-btn>
              </v-form>
            </v-card-text>

            <!-- Register Link -->
            <v-card-actions class="justify-center align-center pb-6">
              <div class="register-section">
                <span class="register-text">ຍັງບໍ່ມີບັນຊີ? </span>
                <v-btn 
                  text 
                  color="#F4B942" 
                  to="/register"
                  :disabled="loading"
                  class="register-btn"
                  small
                >
                  ສະໝັກສະມາຊິກ
                </v-btn>
              </div>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>
<script>
export default {
  name: 'LoginPage',
  data() {
    return {
      valid: false,
      loading: false,
      showPassword: false,
      errorMessage: '',
      successMessage: '',
      
      form: {
        email: '',
        password: ''
      },
      
      emailRules: [
        v => !!v || 'ອີເມວແມ່ນຈຳເປັນ',
        v => /.+@.+\..+/.test(v) || 'ອີເມວບໍ່ຖືກຕ້ອງ'
      ],
      
      passwordRules: [
        v => !!v || 'ລະຫັດຜ່ານແມ່ນຈຳເປັນ',
        v => (v && v.length >= 6) || 'ລະຫັດຜ່ານຕ້ອງມີຢ່າງໜ້ອຍ 6 ຕົວອັກສອນ'
      ]
    }
  },
  
  mounted() {
    this.checkExistingAuth();
  },
  
  methods: {
    async handleLogin() {
      this.errorMessage = '';
      this.successMessage = '';
      
      if (!this.$refs.form.validate()) {
        this.errorMessage = 'ກະລຸນາກວດສອບຂໍ້ມູນທີ່ປ້ອນ';
        return;
      }
      
      this.loading = true;
      
      try {
        const loginData = {
          email: this.form.email.trim(),
          password: this.form.password
        };
        
        console.log('Attempting login for:', loginData.email);
        
        const response = await fetch('http://localhost:3000/api/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(loginData)
        });
        
        console.log('Response status:', response.status);
        const responseData = await response.json();
        console.log('Response data:', responseData);
        
        if (response.ok && responseData.token) {
          this.handleLoginSuccess(responseData);
        } else {
          if (responseData.message) {
            this.errorMessage = this.translateErrorMessage(responseData.message);
          } else if (responseData.error) {
            this.errorMessage = this.translateErrorMessage(responseData.error);
          } else {
            this.errorMessage = 'ອີເມວ ຫຼື ລະຫັດຜ່ານບໍ່ຖືກຕ້ອງ';
          }
        }
        
      } catch (error) {
        console.error('Login error:', error);
        
        if (error.name === 'TypeError' && error.message.includes('fetch')) {
          this.errorMessage = 'ບໍ່ສາມາດເຊື່ອມຕໍ່ກັບເຊີເວີໄດ້ ກະລຸນາລອງໃໝ່';
        } else {
          this.errorMessage = 'ເກີດຂໍ້ຜິດພາດ ກະລຸນາລອງໃໝ່';
        }
        
      } finally {
        this.loading = false;
      }
    },
    
    handleLoginSuccess(responseData) {
      // ✅ This is correct!
      this.$store.dispatch('auth/login', {
        token: responseData.token,
        user: responseData.customer
      });
      
      this.successMessage = `ຍິນດີຕ້ອນຮັບ ${responseData.customer.name}!`;
      
      console.log('Login successful:', {
        customerId: responseData.customer.c_id,
        customerName: responseData.customer.name + ' ' + responseData.customer.last_name,
        token: responseData.token.substring(0, 20) + '...'
      });
      
      this.resetForm();
      
      setTimeout(() => {
        this.redirectAfterLogin();
      }, 1500);
    },
    
    redirectAfterLogin() {
      const redirectTo = this.$route.query.redirect;
      
      if (redirectTo) {
        this.$router.push(redirectTo);
      } else {
        // Change '/home' to your actual route
        this.$router.push('/'); // or '/dashboard' if you have one
      }
    },
    
    checkExistingAuth() {
      // ✅ Fixed to use Vuex
      if (this.$store.getters['auth/isLoggedIn']) {
        console.log('User already authenticated:', this.$store.getters['auth/userName']);
        this.$router.push('/');
      }
    },
    
    translateErrorMessage(message) {
      const translations = {
        'Invalid credentials': 'ອີເມວ ຫຼື ລະຫັດຜ່ານບໍ່ຖືກຕ້ອງ',
        'User not found': 'ບໍ່ພົບຜູ້ໃຊ້ນີ້',
        'Incorrect password': 'ລະຫັດຜ່ານບໍ່ຖືກຕ້ອງ',
        'Account suspended': 'ບັນຊີຖືກລະງັບການໃຊ້ງານ',
        'Account not verified': 'ບັນຊີຍັງບໍ່ໄດ້ຢືນຢັນ',
        'Too many login attempts': 'ພະຍາຍາມເຂົ້າສູ່ລະບົບຫຼາຍເທື່ອເກີນໄປ ກະລຸນາລໍຖ້າ',
        'Invalid email format': 'ຮູບແບບອີເມວບໍ່ຖືກຕ້ອງ'
      };
      
      return translations[message] || message || 'ອີເມວ ຫຼື ລະຫັດຜ່ານບໍ່ຖືກຕ້ອງ';
    },
    
    resetForm() {
      this.form = {
        email: '',
        password: ''
      };
      
      if (this.$refs.form) {
        this.$refs.form.reset();
        this.$refs.form.resetValidation();
      }
      
      this.showPassword = false;
    }
  }
}
</script>
<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Lao:wght@400;700&display=swap');

.modern-login-page {
  min-height: 100vh;
  background-image: url('https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
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

.login-container {
  position: relative;
  z-index: 2;
  padding: 2rem 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
}

.welcome-header {
  text-align: center;
  margin-bottom: 1rem;
  display: flex;
  justify-content: center;
  align-items: center;
}

.welcome-title {
  background: linear-gradient(135deg, #F4B942 0%, #FFD700 100%);
  color: transparent;
  background-clip: text;
  -webkit-background-clip: text;
  font-size: 1.3rem;
  font-weight: 600;
  margin: 0;
  padding: 0.8rem 1.5rem;
  background-color: rgba(255, 255, 255, 0.95);
  border-radius: 40px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(244, 185, 66, 0.2);
  color: #F4B942;
}

.login-card {
  background: rgba(255, 255, 255, 0.95) !important;
  border-radius: 50px !important;
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1) !important;
  
}

.hotel-icon {
  text-align: center;
  padding: 2rem 0 1rem 0;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

.temple-icon {
  display: inline-block;
  margin-bottom: 1rem;
}

.logo-container {
  display: inline-block;
  margin-bottom: 1rem;
}

.hotel-logo {
  width: 80px;
  height: 80px;
  object-fit: contain;
  filter: drop-shadow(0 4px 8px rgba(244, 185, 66, 0.3));
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  padding: 8px;
}

.temple-svg {
  width: 60px;
  height: 60px;
  filter: drop-shadow(0 4px 8px rgba(244, 185, 66, 0.3));
}

.hotel-name {
  font-size: 1.4rem;
  font-weight: 700;
  color: #F4B942;
  margin: 0;
  letter-spacing: 1px;
}

.hotel-subtitle {
  font-size: 0.9rem;
  color: #666;
  margin: 0.5rem 0 0 0;
  font-style: italic;
}

.login-title {
  text-align: center;
  font-size: 1.3rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 1.5rem;
  padding: 0 2rem;
  display: flex;
  justify-content: center;
  align-items: center;
}

.input-group {
  margin-bottom: 1rem;
}

.custom-input {
  margin-bottom: 0 !important;
}

.custom-input .v-input__control .v-input__slot {
  background: rgba(255, 255, 255, 0.9) !important;
  border-radius: 50px !important;
  border: 2px solid rgba(244, 185, 66, 0.2) !important;
  transition: all 0.3s ease;
}

.custom-input .v-input__control .v-input__slot:hover {
  border-color: rgba(244, 185, 66, 0.4) !important;
}

.custom-input.v-input--is-focused .v-input__control .v-input__slot {
  border-color: #F4B942 !important;
  box-shadow: 0 0 0 2px rgba(244, 185, 66, 0.2) !important;
  
}

.custom-input .v-text-field__details {
  display: none;
}

.custom-input .v-input__prepend-inner {
  margin-top: 12px;
  margin-right: 12px;
}

.custom-input .v-input__append-inner {
  margin-top: 12px;
  margin-left: 8px;
}

.login-btn {
  background: linear-gradient(135deg, #F4B942 0%, #FFD700 100%) !important;
  color: white !important;
  border-radius: 50px !important;
  font-weight: 600 !important;
  font-size: 1rem !important;
  text-transform: none !important;
  height: 50px !important;
  margin-top: 1rem;
  box-shadow: 0 4px 15px rgba(244, 185, 66, 0.3) !important;
  transition: all 0.3s ease !important;
}

.login-btn:hover {
  transform: translateY(-2px) !important;
  box-shadow: 0 6px 20px rgba(244, 185, 66, 0.4) !important;
}

.login-btn:disabled {
  background: #ccc !important;
  transform: none !important;
  box-shadow: none !important;
}

.custom-alert {
  border-radius: 10px !important;
  background: rgba(255, 235, 238, 0.9) !important;
}

.register-section {
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
  width: 100%;
}

.register-text {
  color: #666;
  font-size: 0.9rem;
  margin: 0;
}

.register-btn {
  text-transform: none !important;
  font-weight: 600 !important;
  padding: 0 8px !important;
  min-width: auto !important;
}

.fill-height {
  min-height: 100vh;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
}

/* Responsive */
@media (max-width: 600px) {
  .welcome-title {
    font-size: 1.2rem;
    padding: 0.8rem 1.5rem;
  }
  
  .login-card {
    margin: 1rem;
  }
  
  .hotel-name {
    font-size: 1.2rem;
  }
  
  .hotel-logo {
    width: 60px;
    height: 60px;
  }
  
  .temple-svg {
    width: 50px;
    height: 50px;
  }
}

/* Loading animation */
@keyframes pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
}

.login-btn.v-btn--loading {
  animation: pulse 1.5s infinite;
}
</style>