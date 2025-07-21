<!-- src/views/AdminPage.vue (Your main admin layout) -->
<template>
  <div class="admin-layout">
    <!-- Import the new sidebar -->
    <AdminSidebar />
    
    <!-- Main content area -->
    <div class="admin-main-content">
      <!-- Header -->
      <header class="admin-header">
        <div class="header-left">
          <h1>{{ getPageTitle() }}</h1>
        </div>
        <div class="header-right">
          <div class="user-info">
            <span>ຍິນດີຕ້ອນຮັບ, Admin User</span>
            <div class="user-avatar">AU</div>
          </div>
          <button class="logout-btn" @click="handleLogout">
            ອອກຈາກລະບົບ
          </button>
        </div>
      </header>

      <!-- Content Area where your different pages will show -->
      <main class="content-area">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script>
import AdminSidebar from '@/components/AdminSidebar.vue'

export default {
  name: 'AdminPage',
  components: {
    AdminSidebar
  },
  methods: {
    getPageTitle() {
      // Map route names to Lao titles
      const pageTitles = {
        'admin-dashboard': 'ໜ້າຫຼັກ',
        'admin-rooms': 'ຈັດການຂໍ້ມູນຫ້ອງ',
        'admin-room-types': 'ຈັດການປະເພດຫ້ອງ',
        'admin-staff': 'ຈັດການພະນັກງານ',
        'admin-customers': 'ຈັດການລູກຄ້າ',
        'admin-check-booking': 'ກວດສອບການຈອງ',
        'admin-check-in': 'ບັນທຶກແຈ້ງເຂົ້າ',
        'admin-check-in-status': 'ກວດສອບແຈ້ງເຂົ້າ',
        'admin-check-out': 'ບັນທຶກແຈ້ງອອກ',
        'admin-confirm-checkout': 'ຢືນຢັນແຈ້ງອອກ',
        'admin-customer-report': 'ລາຍງານຂໍ້ມູນລູກຄ້າ',
        'admin-booking-report': 'ລາຍງານການຈອງ',
        'admin-checkin-report': 'ລາຍງານແຈ້ງເຂົ້າ-ອອກ',
        'admin-revenue-report': 'ລາຍງານສະຫຼຸບລາຍຮັບ'
      }
      return pageTitles[this.$route.name] || 'ລະບົບຈັດການໂຮງແຮມ'
    },
    handleLogout() {
      // Handle logout logic
      localStorage.removeItem('admin_token')
      this.$router.push('/login')
    }
  }
}
</script>

<style scoped>
.admin-layout {
  display: flex;
  min-height: 100vh;
  background-color: #f8fafc;
}

.admin-main-content {
  flex: 1;
  margin-left: 0px; /* Match sidebar width */
  display: flex;
  flex-direction: column;
}

.admin-header {
  background: white;
  padding: 12px 24px;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  position: sticky;
  top: 0;
  z-index: 10;
}

.header-left h1 {
  color: #1f2937;
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #6b7280;
  font-size: 0.9rem;
}

.user-avatar {
  width: 32px;
  height: 32px;
  background:#094b91;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 0.8rem;
}

.logout-btn {
  background: #ef4444;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background 0.3s ease;
}

.logout-btn:hover {
  background: #dc2626;
}

.content-area {
  flex: 1;
  padding: 24px;
  overflow-y: auto;
}

/* Responsive Design */
@media (max-width: 768px) {
  .admin-main-content {
    margin-left: 0;
  }
  
  .admin-header {
    padding: 12px 16px;
  }
  
  .header-left h1 {
    font-size: 1.25rem;
  }
  
  .content-area {
    padding: 16px;
  }
  
  .user-info span {
    display: none;
  }
}
</style>