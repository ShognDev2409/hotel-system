<template>
  <div>
    <div class="appbar-custom">
      <div class="logo-nav">
        <img 
          :src="require('@/assets/image/logohotel.png')"
          alt="Hotel Logo" 
          style="height: 64px; width: auto; margin-right: 8px;"
        />
      </div>
      <div class="nav-btn-list right-align">
        <ul>
          <li v-for="item in navItems" :key="item.name">
            <button
              class="nav-btn-custom"
              :class="{ 
                active: isActive(item.path),
                'signup-btn': item.isSignUp,
                'login-btn': item.isLogin
              }"
              @click="handleNavigation(item.path)"
            >
              {{ item.name }}
              <span v-if="isActive(item.path)" class="nav-underline"></span>
            </button>
            
          </li>
        </ul>
      </div>
    </div>

    <v-navigation-drawer
      v-model="drawer"
      app
      temporary
      :clipped="$vuetify.breakpoint.lgAndUp"
      class="drawer"
    >
      <div class="logo-drewer">
        <!-- <img :src="require('@/assets/image/logohotel.png')" alt="Logo" /> -->
      </div>
      <v-list>
        <v-list-item
          v-for="item in navItems"
          :key="item.name"
          @click="navigate(item.path)"
        >
          <v-list-item-content>
            <v-list-item-title>{{ item.name }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
  </div>
</template>

<script>
export default {
  data() {
    return {
      drawer: false,
      navItems: [
        { name: "Home", path: "/" },
        { name: "ROOMS", path: "/Rooms" },
        { name: "Booking List", path: "/Booking" },
        { name: "Contact", path: "/contact" },
        { name: "Login", path: "/login", isLogin: true },
        { name: "Sign Up", path: "/register", isSignUp: true },
      ],
      activePath: this.$route.path,
    };
  },
  watch: {
    "$route.path": function (newPath) {
      this.setActive(newPath);
    },
  },
  methods: {
    setActive(path) {
      this.activePath = path;
    },
    isActive(path) {
      return this.activePath === path;
    },
    navigate(path) {
      if (this.$route.path !== path) {
        this.$router.push(path).catch(err => {
          // Ignore NavigationDuplicated errors
          if (err.name !== 'NavigationDuplicated') {
            throw err;
          }
        });
      }
      this.drawer = false;
      this.setActive(path);
    },

    handleNavigation(path) {
      // Only navigate if we're not already on this path
      if (this.$route.path !== path) {
        this.navigate(path);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.appbar-custom {
  background: linear-gradient(90deg, #fff8dc 0%, #f5f5dc 100%);
  display: flex;
  align-items: center;
  padding: 0 56px;
  
  min-height: 70px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}
.logo-nav img {
  height: 64px;
  width: auto;
}
.nav-btn-list {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: flex-end;
}
.nav-btn-list ul {
  list-style-type: none;
  margin: 0;
  padding: 0;
  display: flex;
  align-items: center;
}
.nav-btn-list ul li {
  margin-right: 2.5rem;
}
.nav-btn-list ul li:last-child {
  margin-right: 0;
}
.nav-btn-custom {
  background: transparent;
  border: none;
  color: #8B4513;
  font-weight: 600;
  font-size: 18px;
  padding: 10px 18px;
  border-radius: 100px;
  cursor: pointer;
  position: relative;
  transition: background 0.2s, color 0.2s;
}
.nav-btn-custom.active,
.nav-btn-custom:hover {
  background: #fff7e0;
  color: #d4af37;
}

/* Special styling for Sign Up button */
.nav-btn-custom.signup-btn {
  background: linear-gradient(135deg, #F4B942 0%, #FFD700 100%);
  color: white !important;
  font-weight: 700;
  box-shadow: 0 2px 8px rgba(244, 185, 66, 0.3);
  transition: all 0.3s ease;
}

.nav-btn-custom.signup-btn:hover {
  background: linear-gradient(135deg, #FFD700 0%, #F4B942 100%);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(244, 185, 66, 0.4);
  color: white !important;
}

.nav-btn-custom.signup-btn.active {
  background: linear-gradient(135deg, #FFD700 0%, #F4B942 100%);
  color: white !important;
}

/* Special styling for Login button */
.nav-btn-custom.login-btn {
  background: linear-gradient(135deg, #F4B942 0%, #FFD700 100%);
  color: white !important;
  font-weight: 700;
  box-shadow: 0 4px 12px rgba(244, 185, 66, 0.4);
  transition: all 0.3s ease;
}

.nav-btn-custom.login-btn:hover {
  background: linear-gradient(135deg, #F4B942 0%, #FFD700 100%);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(244, 185, 66, 0.4);
  color: white !important;
}

.nav-btn-custom.login-btn.active {
  background: linear-gradient(135deg, #FFD700 0%, #F4B942 100%);
  color: white !important;
}
.nav-underline {
  display: block;
  height: 4px;
  width: 28px;
  background: #ffd700;
  border-radius: 2px;
  margin: 0 auto 0.2rem auto;
}
.drawer-icon {
  display: none;
  color: #fff;
}
@media (max-width: 960px) {
  .nav-btn-list {
    display: none;
  }
  .drawer-icon {
    display: block;
  }
}
.drawer {
  z-index: 100;
  background-color: rgb(236, 236, 236);
}
.logo-drewer img {
  width: 60px;
  height: 60px;
  border-radius: 16px;
}
</style>
