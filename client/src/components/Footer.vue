<template>
  <footer class="footer-section py-8" style="background: linear-gradient(45deg, #F5F5DC, #F5F5DC); color: white;">
    <v-container>
      <v-row>
        <v-col cols="12" md="4">
          <h4 style="margin-bottom: 15px; color: #8B4513;">Location</h4>
          <p style="opacity: 0.8; color: #8B4513;">
            Thartlunag View Hotel<br>
            Nongbone Road<br>
            Thatluang village<br>
            Vientiane, Laos
          </p>
        </v-col>
        <v-col cols="12" md="4">
          <h4 style="margin-bottom: 15px; color: #8B4513;">Contact Us</h4>
          <p style="opacity: 0.8 ;color: #8B4513;">
            <v-icon left color="#8B4513" style="vertical-align: middle;">mdi-facebook</v-icon>
            Facebook : ໂຮງແຮມທາດຫຼວງວິວ<br> 
            <v-icon left color="#8B4513" style="vertical-align: middle;">mdi-phone</v-icon>
            Phone: +856 20 55978979<br>
            <v-icon left color="#8B4513" style="vertical-align: middle;">mdi-email</v-icon>
            thatluangview@gmail.com
          </p>
        </v-col>
        <v-col cols="12" md="4">
          <h4 style="margin-bottom: 15px; color: #8B4513;">Opening</h4>
          <p style="opacity: 0.8; color: #8B4513;">
            <v-icon left color="#8B4513" style="vertical-align: middle;">mdi-clock-outline</v-icon>
            24-hour front dask
          </p>
        </v-col>
      </v-row>
      
      <!-- Social Media -->
      <v-row class="mt-4 pt-4" style="border-top: 1px solid rgba(255,255,255,0.2);">
        <v-col cols="12" class="text-center d-flex justify-center align-center">
          <div class="social-links-container">
            <v-btn
              v-for="social in socialLinks"
              :key="social.icon"
              icon
              color="#8B4513"
              class="mx-2"
              :href="social.url || undefined"
              target="_blank"
              rel="noopener"
            >
              <v-icon>{{ social.icon }}</v-icon>
            </v-btn>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </footer>
</template>

<script>
export default {
  name: 'footer_v1',
  data() {
    return {
      socialLinks: [
        { icon: 'mdi-facebook', url: 'https://www.facebook.com/thatluangview' },
        { icon: 'mdi-whatsapp', url: 'https://web.whatsapp.com/#' },
      ]
    }
  }
}
</script>

<style scoped>
/* Footer */
.footer-section {
  background: linear-gradient(135deg, #8B4513, #A0522D);
}

/* Social Links Centering */
.social-links-container {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
}
</style>