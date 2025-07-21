<template>
  <div>
    <!-- Hero Section -->
    <section class="hero-section">
      <div class="hero-image">
        <img :src="require('@/assets/image/bar.jpg')" alt="Luxury Pool Resort" />
        <div class="hero-overlay">
          <v-container class="fill-height">
            <v-row align="center" justify="center" class="fill-height">
              <v-col cols="12" class="text-center">
                <div class="hero-content">
                  <h1 class="hero-title">ໂຮງແຮມທາດຫຼວງວິວສະບາຍດີ</h1>
                  <p class="hero-subtitle">ຍິນດີຕອນຮັບ ລູກຄ້າທຸກທ່ານ ສູ່ປະສົບການພັກຜ່ອນທີ່ດີທີ່ສຸດ</p>
                  <div class="hero-buttons mt-6">
                    <v-btn 
                      x-large
                      class="hero-btn-primary mr-4"
                      @click="$router.push('/Rooms')"
                    >
                      <v-icon left>mdi-bed</v-icon>
                      ຈອງຫ້ອງ
                    </v-btn>
                    <v-btn 
                      x-large
                      outlined
                      class="hero-btn-outline"
                      @click="$router.push('/contact')"
                    >
                      <v-icon left>mdi-phone</v-icon>
                      ຕິດຕໍ່ເຮົາ
                    </v-btn>
                  </div>
                </div>
              </v-col>
            </v-row>
          </v-container>
        </div>
      </div>
    </section>



    <!-- Our Rooms Section -->
    <section class="rooms-section py-12">
      <v-container>
        <!-- Section Title -->
        <v-row justify="center">
          <v-col cols="12" class="text-center mb-8">
            <div class="rooms-title-container">
              <h2 class="section-title" style="color: #8B4513; font-size: 2.5rem; font-weight: bold; margin: 0 auto; max-width: 600px; padding: 20px;">
                ຫ້ອງພັກຂອງເຮົາ
              </h2>
            </div>
          </v-col>
        </v-row>

        <!-- Rooms Grid -->
        <v-row>
          <v-col 
            v-for="room in rooms" 
            :key="room.id"
            cols="12" 
            md="4"
            class="mb-6"
          >
            <v-card class="room-card" elevation="4" style="border-radius: 15px; overflow: hidden;">
              <!-- Room Image -->
              <div class="room-image" style="height: 250px; position: relative; overflow: hidden;">
                <img :src="room.imageUrl || require('@/assets/image/family.jpg')" alt="Room Image" style="width: 100%; height: 100%; object-fit: cover;" />
                <div style="position: absolute; top: 15px; right: 15px;">
                  <v-chip 
                    small 
                    style="background: linear-gradient(45deg, #F5B93F, #f7b023); color: white ; font-weight: bold;"
                  >
                    {{ room.status === 'available' ? 'Available' : 'Booked' }}
                  </v-chip>
                </div>
              </div>

              <!-- Room Details -->
              <v-card-text class="pa-4 text-center">
                <h3 style="color: #8B4513; font-weight: bold; margin-bottom: 10px;">
                  {{ room.room_type }}
                </h3>
                
                <!-- Price -->
                <div class="d-flex align-center justify-center mb-3">
                  <span style="color: #D4AF37; font-size: 24px; font-weight: bold;">
                    {{ room.price_per_night.toLocaleString() }} ກີບ
                  </span>
                  <span style="color: #666; margin-left: 5px;">/ ຄືນ</span>
                </div>

                <!-- Room Features -->
                <div class="d-flex align-center justify-center mb-3">
                  <v-icon color="#D4AF37" size="20" class="mr-2">mdi-bed</v-icon>
                  <span style="color: #666; font-size: 14px;">1 Bed</span>
                  
                  <v-icon color="#D4AF37" size="20" class="mr-2 ml-4">mdi-account-multiple</v-icon>
                  <span style="color: #666; font-size: 14px;">{{ room.max_occupancy }} Guest</span>
                  
                  <v-icon color="#D4AF37" size="20" class="mr-2 ml-4">mdi-wifi</v-icon>
                  <span style="color: #666; font-size: 14px;">Wifi</span>
                </div>

                <!-- More Details Button -->
                <v-btn
                  block
                  style="background: linear-gradient(45deg, #F5B93F, #f7b023); color: white; font-weight: bold; text-transform: none; border-radius: 8px;"
                  @click="viewRoomDetails(room)"
                >
                  ລາຍລະອຽດເພີ່ມເຕີມ
                </v-btn>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>

        <!-- More Button -->
        <v-row justify="center" align="center">
          <v-col cols="12" class="d-flex justify-center align-center mt-6">
            <v-btn
              x-large
              class="view-more-btn"
              @click="$router.push('/Rooms')"
            >
              <v-icon left>mdi-eye</v-icon>
              ເບີ່ງຫ້ອງທັງໝົດ
            </v-btn>
          </v-col>
        </v-row>
      </v-container>
    </section>

    <!-- About Hotel Section -->
    <section class="about-section py-12" style="background: white;">
      <v-container>
        <v-row align="center">
          <v-col cols="12" md="6" class="mb-6 mb-md-0">
            <div class="about-image-container">
              <img src="@/assets/image/building.jpg" alt="Hotel Building" class="about-image" />
              <div class="image-overlay">
                <div class="overlay-text">
                  <v-icon size="48" color="white">mdi-star</v-icon>
                  <div class="rating-text">5 ດາວ</div>
                </div>
              </div>
            </div>
          </v-col>
          <v-col cols="12" md="6">
            <div class="about-content">
              <h2 class="about-title">
                ໂຮງແຮມທາດຫຼວງວິວ
              </h2>
              <p class="about-description">
                ສະອາດ ປອດໄພ ແລະ ໃກ້ແຫຼ່ງທ່ອງທ່ຽວຫຼາຍບ່ອນໃນນະຄອນຫຼວງວຽງຈັນ
                ຫ້ອງພັກສະອາດງາມຕາ ແລະ ສິ່ງອຳນວຍຄວາມສະດວກຫຼາຍຢ່າງ ພ້ອມດ້ວຍທິວທັດທີ໇ງາມຂອງພະທາດຫຼວງ
              </p>
              
              <!-- Statistics -->
              <div class="stats-container">
                <div class="stat-item">
                  <div class="stat-number">11</div>
                  <div class="stat-label">ຫ້ອງທັງໝົດ</div>
                </div>
                <div class="stat-item">
                  <div class="stat-number">5</div>
                  <div class="stat-label">ປະເພດຫ້ອງ</div>
                </div>
                <div class="stat-item">
                  <div class="stat-number">24/7</div>
                  <div class="stat-label">ບໍລິການ</div>
                </div>
              </div>
              
            </div>
          </v-col>
        </v-row>
      </v-container>
    </section>
        <!-- Features Section -->
    <section class="features-section py-12">
      <v-container>
        <v-row justify="center">
          <v-col cols="12" class="text-center mb-8">
            <div class="features-title-container">
              <h2 class="section-title" style="color: #8B4513; font-size: 2.5rem; font-weight: bold; margin: 0 auto; max-width: 600px; padding: 20px;">
                ບໍລິການພິເສດ
              </h2>
            </div>
          </v-col>
        </v-row>

        
        <v-row>
          <v-col cols="12" md="4" class="mb-4">
            <div class="feature-card">
              <div class="feature-icon">
                <v-icon size="48" color="#F5B93F">mdi-wifi</v-icon>
              </div>
              <h3 class="feature-title">Free WiFi</h3>
              <p class="feature-description">ອິນເຕີເນັດໄວຟາຍຟຣີທົ່ວທຸກບ່ອນ</p>
            </div>
          </v-col>
          
          <v-col cols="12" md="4" class="mb-4">
            <div class="feature-card">
              <div class="feature-icon">
                <v-icon size="48" color="#F5B93F">mdi-car</v-icon>
              </div>
              <h3 class="feature-title">Free Parking</h3>
              <p class="feature-description">ບ່ອນຈອດລົດຟຣີ ປອດໄພ 24 ຊົ່ວໂມງ</p>
            </div>
          </v-col>
          
          <v-col cols="12" md="4" class="mb-4">
            <div class="feature-card">
              <div class="feature-icon">
                <v-icon size="48" color="#F5B93F">mdi-room-service</v-icon>
              </div>
              <h3 class="feature-title">Room Service</h3>
              <p class="feature-description">ບໍລິການຫ້ອງ 24/7</p>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </section>
    
  </div>
</template>

<script>
export default {
  name: 'Home_page',
  data() {
    return {
      // Your existing rooms data
      rooms: [
        {
          id: 1,
          room_type: 'Double Room',
          price_per_night: 500000,
          max_occupancy: 2,
          status: 'available'
        },
        {
          id: 2,
          room_type: 'Double Room(Thartluang View)',
          price_per_night: 600000,
          max_occupancy: 4,
          status: 'available'
        },
        {
          id: 3,
          room_type: 'Family Room',
          price_per_night: 700000,
          max_occupancy: 4,
          status: 'booked'
        }
      ]
    }
  },
  methods: {
    // Your existing methods
    handleBookingOpen() {
      this.$emit('open-booking')
    },
    
    bookRoom(room) {
      this.$emit('book-room', room)
    }
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Lao:wght@400;700&display=swap');

:root {
  font-family: 'Noto Sans Lao', sans-serif !important;
}

/* Hero Section */
.hero-section {
  position: relative;
  height: 70vh;
  min-height: 600px;
  overflow: hidden;
}

.hero-image {
  position: relative;
  height: 100%;
  width: 100%;
}

.hero-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.hero-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.6));
  display: flex;
  align-items: center;
  justify-content: center;
}

.hero-content {
  text-align: center;
  color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  position: relative;
  z-index: 2;
}

.hero-badge {
  background: rgba(245, 185, 63, 0.9);
  color: white;
  padding: 8px 24px;
  border-radius: 30px;
  font-weight: 600;
  font-size: 0.9rem;
  backdrop-filter: blur(10px);
}

.hero-title {
  font-size: 4rem;
  font-weight: bold;
  margin-bottom: 1.5rem;
  text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.7);
  line-height: 1.2;
}

.hero-subtitle {
  font-size: 1.4rem;
  opacity: 0.95;
  text-shadow: 1px 1px 4px rgba(0, 0, 0, 0.7);
  line-height: 1.6;
  margin-bottom: 2rem;
}

.hero-buttons {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
  justify-content: center;
}

.hero-btn-primary {
  background: linear-gradient(45deg, #F5B93F, #e5b960) !important;
  color: white !important;
  border-radius: 50px !important;
  padding: 0 40px !important;
  height: 56px !important;
  font-weight: bold !important;
  text-transform: none !important;
  box-shadow: 0 8px 20px rgba(245, 185, 63, 0.4) !important;
  transition: all 0.3s ease !important;
}

.hero-btn-primary:hover {
  transform: translateY(-3px) !important;
  box-shadow: 0 12px 25px rgba(245, 185, 63, 0.6) !important;
}

.hero-btn-outline {
  border: 2px solid white !important;
  color: white !important;
  border-radius: 50px !important;
  padding: 0 40px !important;
  height: 56px !important;
  font-weight: bold !important;
  text-transform: none !important;
  backdrop-filter: blur(10px) !important;
  transition: all 0.3s ease !important;
}

.hero-btn-outline:hover {
  background: rgba(255, 255, 255, 0.1) !important;
  transform: translateY(-3px) !important;
}

/* Global Styles */
.section-subtitle {
  color: #666;
  font-size: 1.1rem;
  margin-bottom: 3rem;
  line-height: 1.6;
}

/* Features Section */
.features-section {
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
}

.features-title-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
}

.feature-card {
  text-align: center;
  padding: 3rem 2rem;
  border-radius: 15px;
  background: white;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.feature-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.15);
}

.feature-icon {
  margin-bottom: 1.5rem;
}

.feature-title {
  color: #8B4513;
  font-size: 1.3rem;
  font-weight: bold;
  margin-bottom: 1rem;
}

.feature-description {
  color: #666;
  line-height: 1.6;
}

/* Room Cards */
.room-card {
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
}

.room-card .v-card-text {
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: center;
}

.room-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 15px 35px rgba(0,0,0,0.2) !important;
}

.view-more-btn {
  background: linear-gradient(45deg, #8B4513, #a0522d) !important;
  color: white !important;
  border-radius: 50px !important;
  padding: 0 40px !important;
  font-weight: bold !important;
  text-transform: none !important;
  transition: all 0.3s ease !important;
}

.view-more-btn:hover {
  transform: translateY(-3px) !important;
  box-shadow: 0 8px 20px rgba(139, 69, 19, 0.4) !important;
}

/* About Section */
.about-section {
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.about-image-container {
  position: relative;
  border-radius: 20px;
  overflow: hidden;
  height: 500px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.about-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.about-image-container:hover .about-image {
  transform: scale(1.05);
}

.image-overlay {
  position: absolute;
  top: 20px;
  right: 20px;
  background: rgba(245, 185, 63, 0.9);
  padding: 15px 20px;
  border-radius: 50px;
  text-align: center;
  backdrop-filter: blur(10px);
}

.overlay-text {
  color: white;
}

.rating-text {
  font-weight: bold;
  margin-top: 5px;
  font-size: 0.9rem;
}

.about-content {
  padding: 2rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  height: 100%;
}

.about-title {
  color: #8B4513;
  font-size: 2.5rem;
  font-weight: bold;
  margin-bottom: 1.5rem;
  line-height: 1.3;
}

.about-description {
  color: #666;
  font-size: 1.1rem;
  line-height: 1.8;
  margin-bottom: 2rem;
}

.stats-container {
  display: flex;
  gap: 2rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
}

.stat-item {
  text-align: center;
}

.stat-number {
  color: #F5B93F;
  font-size: 2.5rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
}

.stat-label {
  color: #8B4513;
  font-weight: 600;
  font-size: 0.9rem;
}

.learn-more-btn {
  background: linear-gradient(45deg, #F5B93F, #e5b960) !important;
  color: white !important;
  border-radius: 50px !important;
  padding: 0 30px !important;
  font-weight: bold !important;
  text-transform: none !important;
  transition: all 0.3s ease !important;
}

.learn-more-btn:hover {
  transform: translateY(-3px) !important;
  box-shadow: 0 8px 20px rgba(245, 185, 63, 0.4) !important;
}

/* Testimonials Section - Removed */

/* Sections */
.rooms-section {
  background: white;
  padding: 5rem 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.about-section {
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.features-section {
  padding: 5rem 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.section-title {
  font-family: 'Playfair Display', serif !important;
  text-align: center;
  display: block;
  margin: 0 auto;
  position: relative;
  width: 100%;
  max-width: 100%;
}

/* Responsive Design */
@media (max-width: 768px) {
  .hero-title {
    font-size: 2.5rem;
  }
  
  .hero-subtitle {
    font-size: 1.1rem;
  }
  
  .hero-buttons {
    flex-direction: column;
    align-items: center;
  }
  
  .hero-btn-primary, .hero-btn-outline {
    width: 280px;
  }
  
  .about-title {
    font-size: 2rem;
  }
  
  .stats-container {
    justify-content: center;
  }
  
  .feature-card, .testimonial-card {
    margin-bottom: 2rem;
  }
}

@media (max-width: 480px) {
  .hero-section {
    min-height: 600px;
  }
  
  .hero-title {
    font-size: 2rem;
  }
  
  .about-image-container {
    height: 300px;
  }
}

.hero-section, .rooms-section, .thai-section, .section-title, .hero-title, .hero-subtitle, .room-card, .room-card * {
  font-family: 'Noto Sans Lao', sans-serif !important;
}
</style>