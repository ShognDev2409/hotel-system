<template>
  <div class="contact-page">
    <!-- Hero Section -->
    <section class="hero-section">
      <div class="hero-bg"></div>
      <v-container class="fill-height">
        <v-row align="center" justify="center" class="fill-height">
          <v-col cols="12" class="text-center">
            <!-- Contact Header -->
            <div class="contact-header-section">
              <div class="contact-header">
                <h1 class="contact-title">Contact Us</h1>
                <div class="decorative-line"></div>
              </div>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </section>

    <!-- Contact Cards Section -->
    <section class="contact-cards-section">
      <v-container class="contact-cards-container">
        <v-row justify="center" class="mt-12">
          <v-col cols="12" md="4" class="d-flex justify-center">
            <div class="contact-card contact-card-white">
              <div class="contact-icon contact-icon-dark">
                <v-icon size="40" color="#8B4513">mdi-phone</v-icon>
              </div>
              <h1 class="contact-card-title contact-card-title-dark"> +856 20 55 978 979</h1>
              
              <p class="contact-card-text contact-card-text-dark">
                ຍິນດີໃຫ້ບໍລິການ 24 ຊົ່ວໂມງ
              </p>
              <v-btn 
                text 
                color="#8B4513" 
                class="contact-btn contact-btn-dark"
                @click="callPhone"
              >
                <v-icon left small color="#8B4513">mdi-phone</v-icon>
                Call Us
              </v-btn>
            </div>
          </v-col>

          <v-col cols="12" md="4" class="d-flex justify-center">
            <div class="contact-card contact-card-white">
              <div class="contact-icon contact-icon-dark">
                <v-icon size="40" color="#8B4513">mdi-email</v-icon>
              </div>
              <h3 class="contact-card-title contact-card-title-dark">thatluangview@gmail.com
</h3>
              
              <v-btn 
                text 
                color="#8B4513" 
                class="contact-btn contact-btn-dark"
                @click="sendEmail"
              >
                <v-icon left small color="#8B4513">mdi-email</v-icon>
                Email Us
              </v-btn>
            </div>
          </v-col>

          <v-col cols="12" md="4" class="d-flex justify-center">
            <div class="contact-card contact-card-white">
              <div class="contact-icon contact-icon-dark">
                <v-icon size="40" color="#8B4513">mdi-map-marker</v-icon>
              </div>
              <h3 class="contact-card-title contact-card-title-dark">Nongbone Road Thatluang village Vientiane, Laos</h3>

              <v-btn 
                text 
                color="#8B4513" 
                class="contact-btn contact-btn-dark"
                @click="openMap"
              >
                <v-icon left small color="#8B4513">mdi-map</v-icon>
                Visit Us
              </v-btn>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </section>

    <!-- Map Section -->
    <section class="map-section-wrapper">
      <section class="map-section">
        <v-container>
          <div class="map-container">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d387.5279644097242!2d102.6376918!3d17.9750935!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x312467ce956e7623%3A0x8ec3fe7fe8924579!2sThatluangview%20Hotel!5e1!3m2!1sen!2sla!4v1720272000000!5m2!1sen!2sla"
              width="100%"
              height="400"
              style="border:0;"
              allowfullscreen=""
              loading="lazy"
              referrerpolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </v-container>
      </section>
    </section>

    <!-- Back to Home Button -->
    <section class="back-home-section">
      <v-container class="py-8">
        <v-row class="mt-8">
        <v-col cols="12" class="text-center">
          <v-btn
            class="golden-btn-outline"
            large
            @click="$router.push('/')"
          >
            <v-icon left>mdi-arrow-left</v-icon>
            Back to Home
          </v-btn>
        </v-col>
      </v-row>
      </v-container>
    </section>
  </div>
</template>

<script>
export default {
  name: 'ContactPage',
  methods: {
    callPhone() {
      window.location.href = 'tel:+1555876544';
    },
    sendEmail() {
      window.location.href = 'mailto:mail@kidsstars.id';
    },
    openMap() {
      window.open('https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d387.5279644097242!2d102.6376918!3d17.9750935!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x312467ce956e7623%3A0x8ec3fe7fe8924579!2sThatluangview%20Hotel!5e1!3m2!1sen!2sla!4v1720272000000!5m2!1sen!2sla');
    }
  }
}
</script>

<style scoped>
.contact-page {
  min-height: 100vh;
  background: #fffcf4;
}

.hero-bg {
  background: url('@/assets/image/view.jpg') center center;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  opacity: 0.25;
}

.hero-section {
  position: relative;
  min-height: 60vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  overflow: hidden;
}

.contact-header-section, .contact-cards-section, .map-section-wrapper, .back-home-section {
  position: relative;
  z-index: 2;
}

.contact-header {
  text-align: center;
  margin-bottom: 2rem;
}

.contact-title {
  font-size: 3.5rem;
  font-weight: 300;
  color: #8B4513;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
  margin-bottom: 1rem;
}

.decorative-line {
  width: 80px;
  height: 3px;
  margin: 0 auto;
  border-radius: 2px;
}

.contact-cards-container {
  position: relative;
  z-index: 10;
}

.contact-card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 15px;
  padding: 2rem;
  text-align: center;
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  height: 280px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.contact-card-white {
  background: #fff;
  color: #222;
  border: 1px solid #eee;
}

.contact-icon {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1rem;
}

.contact-icon-dark {
  background: #f5f5f5;
}

.contact-card-title {
  font-size: 1.4rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: white;
}

.contact-card-title-dark {
  color: #222;
}

.contact-card-text {
  font-size: 0.9rem;
  line-height: 1.5;
  margin-bottom: 1.5rem;
  opacity: 0.9;
}

.contact-card-text-dark {
  color: #444;
  opacity: 1;
}

.contact-btn {
  border: 1px solid rgba(255, 255, 255, 0.3) !important;
  border-radius: 25px !important;
  text-transform: none !important;
  font-weight: 500 !important;
}

.contact-btn-dark {
  border: 1px solid #8B4513 !important;
  color: #8B4513 !important;
  background: #fff !important;
}

.contact-btn-dark:hover {
  background: #FFF8E1 !important;
}

.contact-btn:hover {
  background: rgba(255, 255, 255, 0.1) !important;
}

/* Map Section */
.map-section {
  padding: 0px 0;
}

.map-container {
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
}

.back-home-btn {
  background: linear-gradient(45deg, #FFD700, #FFA500) !important;
  color: black !important;
  font-weight: bold !important;
  text-transform: none !important;
  border-radius: 25px !important;
  padding: 0 2rem !important;
}

.back-home-btn:hover {
  background: linear-gradient(45deg, #FFA500, #FFD700) !important;
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(255, 215, 0, 0.3);
}

/* Mobile Responsiveness */
@media (max-width: 960px) {
  .contact-title {
    font-size: 2.5rem;
  }
  
  .contact-card {
    height: auto;
    margin-bottom: 1rem;
  }
  
  .hero-section {
    min-height: 100vh;
    padding: 2rem 0;
  }
}

@media (max-width: 600px) {
  .contact-title {
    font-size: 2rem;
  }
  
  .contact-card {
    padding: 1.5rem;
  }
  
  .map-container {
    height: 300px;
  }
}
.golden-btn-outline {
  background: transparent !important;
  color: #F5B93F !important;
  border: 2px solid #F5B93F !important;
  font-weight: bold !important;
  border-radius: 12px !important;
  text-transform: none !important;
}
</style>