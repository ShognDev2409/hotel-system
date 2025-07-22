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
          <!-- Regular nav items -->
          <li v-for="item in regularNavItems" :key="item.name">
            <button
              class="nav-btn-custom"
              :class="{ active: isActive(item.path) }"
              @click="handleNavigation(item.path)"
            >
              {{ item.name }}
              <span v-if="isActive(item.path)" class="nav-underline"></span>
            </button>
          </li>
          
          <!-- Show login/signup when NOT logged in -->
          <li v-if="!isLoggedIn">
            <button
              class="nav-btn-custom login-btn"
              @click="handleNavigation('/login')"
            >
              Login
            </button>
          </li>
          <li v-if="!isLoggedIn">
            <button
              class="nav-btn-custom signup-btn"
              @click="handleNavigation('/register')"
            >
              Sign Up
            </button>
          </li>
          
          <!-- Show user menu when logged in -->
          <li v-if="isLoggedIn">
            <button class="nav-btn-custom user-btn">
              ສະບາຍດີ {{ userName }}!
            </button>
          </li>
          <li v-if="isLoggedIn">
            <button class="nav-btn-custom logout-btn" @click="handleLogout">
              ອອກຈາກລະບົບ
            </button>
          </li>
        </ul>
      </div>
    </div>

    <!-- Your existing drawer code -->
    <v-navigation-drawer
      v-model="drawer"
      app
      temporary
      :clipped="$vuetify.breakpoint.lgAndUp"
      class="drawer"
    >
      <div class="logo-drewer"></div>
      <v-list>
        <v-list-item
          v-for="item in regularNavItems"
          :key="item.name"
          @click="navigate(item.path)"
        >
          <v-list-item-content>
            <v-list-item-title>{{ item.name }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        
        <!-- Mobile auth buttons -->
        <div v-if="!isLoggedIn">
          <v-list-item @click="navigate('/login')">
            <v-list-item-content>
              <v-list-item-title>Login</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item @click="navigate('/register')">
            <v-list-item-content>
              <v-list-item-title>Sign Up</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </div>
        
        <div v-if="isLoggedIn">
          <v-divider></v-divider>
          <v-list-item @click="handleLogout">
            <v-list-item-content>
              <v-list-item-title>ອອກຈາກລະບົບ</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </div>
      </v-list>
    </v-navigation-drawer>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'   // ← ADD THIS IMPORT

export default {
  data() {
    return {
      drawer: false,
      regularNavItems: [   // ← RENAMED FROM navItems
        { name: "Home", path: "/" },
        { name: "ROOMS", path: "/Rooms" },
        { name: "Booking List", path: "/Booking" },
        { name: "Contact", path: "/contact" }
      ],
      activePath: this.$route.path,
    };
  },
  
  computed: {
    // ← ADD THIS COMPUTED SECTION
    ...mapGetters('auth', ['isLoggedIn', 'currentUser']),
    
    userName() {
      return this.currentUser ? this.currentUser.name : 'User'
    }
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
          if (err.name !== 'NavigationDuplicated') {
            throw err;
          }
        });
      }
      this.drawer = false;
      this.setActive(path);
    },

    handleNavigation(path) {
      if (this.$route.path !== path) {
        this.navigate(path);
      }
    },
    
    handleLogout() {
      this.$store.dispatch('auth/logout')
  
      if (this.$route.path !== '/') {
        this.$router.push('/')
      }
  
  this.drawer = false
    }
  },
};
</script>

<!-- Keep your existing styles -->
<style lang="scss" scoped>
/* Your existing styles... */
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

.nav-btn-custom.signup-btn,
.nav-btn-custom.login-btn {
  background: linear-gradient(135deg, #F4B942 0%, #FFD700 100%);
  color: white !important;
  font-weight: 700;
  box-shadow: 0 2px 8px rgba(244, 185, 66, 0.3);
}

.nav-btn-custom.signup-btn:hover,
.nav-btn-custom.login-btn:hover {
  background: linear-gradient(135deg, #FFD700 0%, #F4B942 100%);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(244, 185, 66, 0.4);
}

/* Add styles for user button and logout */
.user-btn {
  background: #4CAF50 !important;
  color: white !important;
}

.logout-btn {
  background: #f44336 !important;
  color: white !important;
}

.logout-btn:hover {
  background: #d32f2f !important;
}

.nav-underline {
  display: block;
  height: 4px;
  width: 28px;
  background: #ffd700;
  border-radius: 2px;
  margin: 0 auto 0.2rem auto;
}

/* Your existing media queries and other styles... */
</style>