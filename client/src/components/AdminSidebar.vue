<template>
  <div class="admin-sidebar">
    <div class="sidebar-header">
      <div class="logo">
        <h3>HOTEL ADMIN</h3>
      </div>
    </div>
    
    <nav class="sidebar-nav">
      <!-- ຈັດການຂໍ້ມູນພື້ນຖານ -->
      <div class="nav-section">
        <h4 class="section-title">ຈັດການຂໍ້ມູນພື້ນຖານ</h4>
        <ul class="nav-list">
          <li class="nav-item" :class="{ active: $route.name === 'admin-rooms' }" @click="navigateTo('/admin/rooms')">
            <span>ຂໍ້ມູນຫ້ອງ</span>
          </li>
          <li class="nav-item" :class="{ active: $route.name === 'admin-room-types' }" @click="navigateTo('/admin/room-types')">
            <span>ຂໍ້ມູນປະເພດຫ້ອງ</span>
          </li>
          <li class="nav-item" :class="{ active: $route.name === 'admin-staff' }" @click="navigateTo('/admin/staff')">
            <span>ຂໍ້ມູນພະນັກງານ</span>
          </li>
          <li class="nav-item" :class="{ active: $route.name === 'admin-customers' }" @click="navigateTo('/admin/customers')">
            <span>ຂໍ້ມູນລູກຄ້າ</span>
          </li>
        </ul>
      </div>

      <!-- ແຈ້ງເຂົ້າ -->
      <div class="nav-section">
        <h4 class="section-title">ແຈ້ງເຂົ້າ</h4>
        <ul class="nav-list">
          <li class="nav-item" :class="{ active: $route.name === 'admin-check-booking' }" @click="navigateTo('/admin/check-booking')">
            <span>ກວດສອບການຈອງ</span>
          </li>
          <li class="nav-item" :class="{ active: $route.name === 'admin-check-in' }" @click="navigateTo('/admin/check-in')">
            <span>ບັນທຶກແຈ້ງເຂົ້າ</span>
          </li>
        </ul>
      </div>

      <!-- ແຈ້ງອອກ -->
      <div class="nav-section">
        <h4 class="section-title">ແຈ້ງອອກ</h4>
        <ul class="nav-list">
          <li class="nav-item" :class="{ active: $route.name === 'admin-check-in-status' }" @click="navigateTo('/admin/check-in-status')">
            <span>ກວດສອບແຈ້ງອອກ</span>
          </li>
        </ul>
      </div>

      <!-- ລາຍງານ -->
      <div class="nav-section">
        <h4 class="section-title">ລາຍງານ</h4>
        <ul class="nav-list">
          <li class="nav-item" :class="{ active: $route.name === 'admin-reports' }" @click="navigateTo('/admin/reports')">
            <span>ລາຍງານທັງໝົດ</span>
          </li>
        </ul>
      </div>
    </nav>
  </div>
</template>

<script>
export default {
  name: 'AdminSidebar',
  methods: {
    navigateTo(path) {
      if (this.$route.path !== path) {
        this.$router.push(path);
      }
    }
  }
}
</script>

<style scoped>
.admin-sidebar {
  background: #f7f6f2;
  min-width: 220px;
  box-shadow: 2px 0 8px rgba(0,0,0,0.06);
}
.sidebar-header {
  background: #2f70b6;
  color: white;
  padding: 16px;
  text-align: center;
}
.logo h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
}
.sidebar-nav {
  padding: 0;
}
.nav-section {
  margin-bottom: 16px;
}
.section-title {
  font-size: 14px;
  font-weight: 900;
  color: #495057;
  padding: 20px 16px;
  background: #e9ecef;
  border-radius: 4px;
}
.nav-list {
  list-style: none;
  padding: 0;
  margin: 0;
}
.nav-item {
  display: flex;
  align-items: center;
  padding: 12px 16px 12px 26px;
  cursor: pointer;
  transition: background 0.3s;
}
.nav-item:hover {
  background: #e2e6ea;
}
.nav-item.active {
  background: #2f70b6;
  color: white;
  font-weight: 500;
}
</style>

