<template>
  <div id="app">
    <Navbar v-if="!isAdminRoute" />
    <router-view> 
    </router-view>
    <Footer v-if="!isAdminRoute" />
  </div>
</template>

<script>
import Footer from "./components/Footer.vue";
import Navbar from "./components/Navbar.vue";

export default {
  name: "App",
  components: {
    Navbar,
    Footer,
  },
  computed: {
    isAdminRoute() {
      // Check if current route starts with /admin
      return this.$route.path.startsWith('/admin');
    }
  },
};
</script>
<style >
.background-b {
  background: url('~@/assets/image/bar.jpg') no-repeat center center fixed;
  background-size: cover;
  height: 450px;
  align-items: center;
}
.footer {
  background: url('~@/assets/image/bar.jpg') no-repeat center center fixed;
  background-size: cover;
}
@media (max-width: 768px) {
  .background-b {
    height: 250px;
  }
}
</style>
