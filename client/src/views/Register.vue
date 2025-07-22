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
  name: 'CustomerRegister',
  
  data() {
    return {
      valid: false,
      showPassword: false,
      showConfirmPassword: false,
      loading: false,
      errorMessage: '',
      successMessage: '',
      form: {
        name: '',
        last_name: '',
        tel: '',
        email: '',
        address: '',
        password: '',
        confirmPassword: ''
      },
      
      // Validation Rules
      nameRules: [
        v => !!v || 'ກະລຸນາປ້ອນຊື່',
        v => (v && v.length >= 1) || 'ຊື່ຕ້ອງມີຢ່າງນ້ອຍ 1 ຕົວອັກສອນ'
      ],
      lastNameRules: [
        v => !!v || 'ກະລຸນາປ້ອນນາມສະກຸນ',
        v => (v && v.length >= 1) || 'ນາມສະກຸນຕ້ອງມີຢ່າງນ້ອຍ 1 ຕົວອັກສອນ'
      ],
      telRules: [
        v => !!v || 'ກະລຸນາປ້ອນເບີໂທ',
        v => /^[0-9]{8,10}$/.test(v.replace(/[^0-9]/g, '')) || 'ເບີໂທຕ້ອງເປັນ 8-10 ຕົວເລກ'
      ],
      emailRules: [
        v => !!v || 'ກະລຸນາປ້ອນອີເມວ',
        v => /.+@.+\..+/.test(v) || 'ຮູບແບບອີເມວບໍ່ຖືກຕ້ອງ'
      ],
      addressRules: [
        v => !!v || 'ກະລຸນາປ້ອນທີ່ຢູ່',
        v => (v && v.length >= 5) || 'ທີ່ຢູ່ຕ້ອງມີຢ່າງນ້ອຍ 5 ຕົວອັກສອນ'
      ],
      passwordRules: [
        v => !!v || 'ກະລຸນາປ້ອນລະຫັດຜ່ານ',
        v => (v && v.length >= 6) || 'ລະຫັດຕ້ອງຢ່າງນ້ອຍ 6 ຕົວອັກສອນ'
      ]
    }
  },
  
  computed: {
    // ใช้ computed property แทน data property สำหรับ confirmPasswordRules
    confirmPasswordRules() {
      return [
        v => !!v || 'ກະລຸນາຢືນຢັນລະຫັດຜ່ານ',
        v => v === this.form.password || 'ລະຫັດຜ່ານບໍ່ຕົງກັນ'
      ]
    }
  },
  
  methods: {
    async handleRegister() {
      console.log('🚀 Starting registration process...')
      
      // Debug validation first
      this.checkFormValidation()
      
      if (!this.$refs.form.validate()) {
        console.log('❌ Form validation failed')
        this.errorMessage = 'ກະລຸນາກວດສອບຂໍ້ມູນທີ່ປ້ອນໃຫ້ຖືກຕ້ອງ'
        return
      }
      
      this.loading = true
      this.errorMessage = ''
      this.successMessage = ''
      
      try {
        // เตรียมข้อมูลที่จะส่งไป API
        const registerData = {
          name: this.form.name,
          last_name: this.form.last_name,
          tel: this.form.tel,
          email: this.form.email,
          address: this.form.address,
          password: this.form.password,
          gender: null,
          birthday: null
        }
        
        console.log('📋 Registration data:', {
          ...registerData,
          password: '[HIDDEN]'
        })
        
        // เรียกใช้ API
        const response = await api.register(registerData)
        console.log('✅ Registration response:', response.data)
        
        if (response.data.success) {
          // ✅ แสดงข้อความสำเร็จ
          this.successMessage = 'ລົງທະບຽນສຳເລັດ! ກະລຸນາເຂົ້າສູ່ລະບົບເພື່ອໃຊ້ບໍລິການ'
          
          // ❌ ไม่เก็บ Token (ไม่ auto-login)
          // localStorage.setItem('token', response.data.token)
          // localStorage.setItem('user', JSON.stringify(response.data.user))
          
          // 🔄 Redirect ไปหน้า Login หลังจาก 3 วินาที
          setTimeout(() => {
            console.log('🔄 Redirecting to login page...')
            this.$router.push({
              path: '/login',
              query: { 
                email: this.form.email, // ส่ง email ไปใส่ใน login form
                registered: 'true' // flag บอกว่าเพิ่งสมัครเสร็จ
              }
            })
          }, 3000)
          
          // Clear form
          this.resetForm()
        }
      } catch (error) {
        console.error('❌ Registration error:', error)
        
        if (error.response?.data?.message) {
          this.errorMessage = this.translateErrorMessage(error.response.data.message)
        } else if (error.message && error.message.includes('Network Error')) {
          this.errorMessage = 'ບໍ່ສາມາດເຊື່ອມຕໍ່ກັບເຊີເວີໄດ້'
        } else if (error.code === 'ECONNREFUSED') {
          this.errorMessage = 'ເຊີເວີບໍ່ພ້ອມໃຫ້ບໍລິການ ກະລຸນາລອງໃໝ່ອີກຄັ້ງ'
        } else {
          this.errorMessage = 'ເກີດຂໍ້ຜິດພາດໃນການລົງທະບຽນ'
        }
      } finally {
        this.loading = false
      }
    },

    // เพิ่ม method สำหรับแปลงข้อความ error
    translateErrorMessage(message) {
      const translations = {
        'Email already registered': 'ອີເມວນີ້ຖືກລົງທະບຽນແລ້ວ',
        'Name, email, password, and phone number are required': 'ກະລຸນາກຸກຂໍ້ມູນໃຫ້ຄົບຖ້ວນ',
        'Please provide a valid email address': 'ຮູບແບບອີເມວບໍ່ຖືກຕ້ອງ',
        'Password must be at least 6 characters long': 'ລະຫັດຜ່ານຕ້ອງມີຢ່າງນ້ອຍ 6 ຕົວອັກສອນ',
        'Registration failed': 'ການລົງທະບຽນລົ້ມເຫລວ'
      }
      
      return translations[message] || message
    },

    resetForm() {
      this.form = {
        name: '',
        last_name: '',
        tel: '',
        email: '',
        address: '',
        password: '',
        confirmPassword: ''
      }
      if (this.$refs.form) {
        this.$refs.form.resetValidation()
      }
    },

    // เพิ่ม method เพื่อ debug validation
    checkFormValidation() {
      console.log('🔍 Form validation status:')
      console.log('='.repeat(50))
      console.log('Overall Valid:', this.valid)
      console.log('Loading:', this.loading)
      console.log('Button Disabled:', !this.valid || this.loading)
      
      console.log('\n📋 Form Data:')
      console.log('name:', this.form.name || '[EMPTY]')
      console.log('last_name:', this.form.last_name || '[EMPTY]')
      console.log('tel:', this.form.tel || '[EMPTY]')
      console.log('email:', this.form.email || '[EMPTY]')
      console.log('address:', this.form.address || '[EMPTY]')
      console.log('password:', this.form.password ? `[${this.form.password.length} chars]` : '[EMPTY]')
      console.log('confirmPassword:', this.form.confirmPassword ? `[${this.form.confirmPassword.length} chars]` : '[EMPTY]')
      console.log('passwordsMatch:', this.form.password === this.form.confirmPassword)
      
      console.log('\n✅ Validation Check:')
      
      // Check name
      const nameValid = this.form.name && this.form.name.length >= 1
      console.log('name valid:', nameValid ? '✅' : '❌', this.form.name)
      
      // Check last_name
      const lastNameValid = this.form.last_name && this.form.last_name.length >= 1
      console.log('last_name valid:', lastNameValid ? '✅' : '❌', this.form.last_name)
      
      // Check tel
      const telValid = this.form.tel && /^[0-9]{8,10}$/.test(this.form.tel.replace(/[^0-9]/g, ''))
      console.log('tel valid:', telValid ? '✅' : '❌', this.form.tel)
      
      // Check email
      const emailValid = this.form.email && /.+@.+\..+/.test(this.form.email)
      console.log('email valid:', emailValid ? '✅' : '❌', this.form.email)
      
      // Check address
      const addressValid = this.form.address && this.form.address.length >= 5
      console.log('address valid:', addressValid ? '✅' : '❌', this.form.address)
      
      // Check password
      const passwordValid = this.form.password && this.form.password.length >= 6
      console.log('password valid:', passwordValid ? '✅' : '❌', this.form.password ? '[SET]' : '[EMPTY]')
      
      // Check confirmPassword
      const confirmPasswordValid = this.form.confirmPassword && this.form.confirmPassword === this.form.password
      console.log('confirmPassword valid:', confirmPasswordValid ? '✅' : '❌', this.form.confirmPassword ? '[SET]' : '[EMPTY]')
      
      console.log('\n🔍 Individual Field Validation:')
      
      // Test each validation rule
      this.nameRules.forEach((rule, index) => {
        const result = rule(this.form.name)
        console.log(`nameRules[${index}]:`, result === true ? '✅' : '❌', result)
      })
      
      this.lastNameRules.forEach((rule, index) => {
        const result = rule(this.form.last_name)
        console.log(`lastNameRules[${index}]:`, result === true ? '✅' : '❌', result)
      })
      
      this.telRules.forEach((rule, index) => {
        const result = rule(this.form.tel)
        console.log(`telRules[${index}]:`, result === true ? '✅' : '❌', result)
      })
      
      this.emailRules.forEach((rule, index) => {
        const result = rule(this.form.email)
        console.log(`emailRules[${index}]:`, result === true ? '✅' : '❌', result)
      })
      
      this.addressRules.forEach((rule, index) => {
        const result = rule(this.form.address)
        console.log(`addressRules[${index}]:`, result === true ? '✅' : '❌', result)
      })
      
      this.passwordRules.forEach((rule, index) => {
        const result = rule(this.form.password)
        console.log(`passwordRules[${index}]:`, result === true ? '✅' : '❌', result)
      })
      
      this.confirmPasswordRules.forEach((rule, index) => {
        const result = rule(this.form.confirmPassword)
        console.log(`confirmPasswordRules[${index}]:`, result === true ? '✅' : '❌', result)
      })
      
      console.log('\n🎯 Summary:')
      const allValid = nameValid && lastNameValid && telValid && emailValid && addressValid && passwordValid && confirmPasswordValid
      console.log('All fields valid:', allValid ? '✅' : '❌')
      console.log('Form.valid:', this.valid ? '✅' : '❌')
      console.log('Should be able to submit:', allValid && this.valid ? '✅' : '❌')
      console.log('='.repeat(50))
    },

    // Test form submission without validation
    testSubmit() {
      console.log('🧪 Testing form submission...')
      
      // Bypass validation temporarily
      this.valid = true
      
      // Try to submit
      this.handleRegister()
    },
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