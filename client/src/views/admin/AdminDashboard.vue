<!-- src/views/admin/AdminDashboard.vue -->
<template>
  <div class="admin-dashboard">
    <!-- Welcome Section -->
    <div class="welcome-section">
      <h2>ຍິນດີຕ້ອນຮັບສູ່ລະບົບຈັດການໂຮງແຮມ</h2>
      <p>ມື້ນີ້: {{ currentDate }}</p>
    </div>

    <!-- Quick Stats -->
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon available">🏠</div>
        <div class="stat-content">
          <h3>{{ stats.availableRooms }}</h3>
          <p>ຫ້ອງວ່າງ</p>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon occupied">👥</div>
        <div class="stat-content">
          <h3>{{ stats.occupiedRooms }}</h3>
          <p>ຫ້ອງຖືກຈອງ</p>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon bookings">📋</div>
        <div class="stat-content">
          <h3>{{ stats.todayBookings }}</h3>
          <p>ການຈອງມື້ນີ້</p>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon revenue">💰</div>
        <div class="stat-content">
          <h3>{{ formatCurrency(stats.todayRevenue) }}</h3>
          <p>ລາຍຮັບມື້ນີ້</p>
        </div>
      </div>
    </div>

    <!-- Dashboard Cards -->
    <div class="dashboard-grid">
      <!-- Recent Check-ins -->
      <div class="dashboard-card">
        <div class="card-header">
          <h3>ແຈ້ງເຂົ້າມື້ນີ້</h3>
          <router-link to="/admin/check-in" class="view-all">ເບິ່ງທັງໝົດ</router-link>
        </div>
        <div class="card-content">
          <div v-if="recentCheckIns.length === 0" class="empty-state">
            ບໍ່ມີການແຈ້ງເຂົ້າມື້ນີ້
          </div>
          <div v-else>
            <div v-for="checkin in recentCheckIns" :key="checkin.id" class="checkin-item">
              <div class="guest-info">
                <div class="guest-name">{{ checkin.guestName }}</div>
                <div class="room-info">ຫ້ອງ {{ checkin.roomNumber }}</div>
              </div>
              <div class="checkin-time">{{ checkin.time }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Pending Check-outs -->
      <div class="dashboard-card">
        <div class="card-header">
          <h3>ລໍຖ້າແຈ້ງອອກ</h3>
          <router-link to="/admin/check-out" class="view-all">ເບິ່ງທັງໝົດ</router-link>
        </div>
        <div class="card-content">
          <div v-if="pendingCheckOuts.length === 0" class="empty-state">
            ບໍ່ມີການແຈ້ງອອກທີ່ລໍຖ້າ
          </div>
          <div v-else>
            <div v-for="checkout in pendingCheckOuts" :key="checkout.id" class="checkout-item">
              <div class="guest-info">
                <div class="guest-name">{{ checkout.guestName }}</div>
                <div class="room-info">ຫ້ອງ {{ checkout.roomNumber }}</div>
              </div>
              <div class="checkout-date">{{ formatDate(checkout.checkOutDate) }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="dashboard-card">
        <div class="card-header">
          <h3>ການປະຕິບັດງານໄວ</h3>
        </div>
        <div class="card-content">
          <div class="quick-actions">
            <router-link to="/admin/rooms" class="quick-action">
              <div class="action-icon">🏠</div>
              <span>ຈັດການຫ້ອງ</span>
            </router-link>
            <router-link to="/admin/check-booking" class="quick-action">
              <div class="action-icon">🔍</div>
              <span>ກວດສອບການຈອງ</span>
            </router-link>
            <router-link to="/admin/check-in" class="quick-action">
              <div class="action-icon">📝</div>
              <span>ແຈ້ງເຂົ້າ</span>
            </router-link>
            <router-link to="/admin/reports/revenue" class="quick-action">
              <div class="action-icon">📊</div>
              <span>ລາຍງານ</span>
            </router-link>
          </div>
        </div>
      </div>

      <!-- Room Status -->
      <div class="dashboard-card">
        <div class="card-header">
          <h3>ສະຖານະຫ້ອງ</h3>
        </div>
        <div class="card-content">
          <div class="room-status">
            <div class="status-item">
              <div class="status-color available"></div>
              <span>ວ່າງ: {{ stats.availableRooms }} ຫ້ອງ</span>
            </div>
            <div class="status-item">
              <div class="status-color occupied"></div>
              <span>ຖືກຈອງ: {{ stats.occupiedRooms }} ຫ້ອງ</span>
            </div>
            <div class="status-item">
              <div class="status-color maintenance"></div>
              <span>ສ້ອມແປງ: {{ stats.maintenanceRooms }} ຫ້ອງ</span>
            </div>
          </div>
          <div class="occupancy-rate">
            <div class="rate-label">ອັດຕາການຈອງ</div>
            <div class="rate-bar">
              <div class="rate-fill" :style="{ width: occupancyRate + '%' }"></div>
            </div>
            <div class="rate-text">{{ occupancyRate }}%</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AdminDashboard',
  data() {
    return {
      stats: {
        availableRooms: 15,
        occupiedRooms: 8,
        maintenanceRooms: 2,
        totalRooms: 25,
        todayBookings: 5,
        todayRevenue: 2500000
      },
      recentCheckIns: [
        { id: 1, guestName: 'ວີລາຊັກ ພົງສະວັນ', roomNumber: '301', time: '14:30' },
        { id: 2, guestName: 'ສົມຊາຍ ບຸນມາ', roomNumber: '205', time: '15:45' },
        { id: 3, guestName: 'ນາງລັດ ວົງໄຊ', roomNumber: '102', time: '16:20' }
      ],
      pendingCheckOuts: [
        { id: 1, guestName: 'ທອງດີ ພັນນາ', roomNumber: '401', checkOutDate: '2024-03-15' },
        { id: 2, guestName: 'ອານຸພາບ ສີຫາ', roomNumber: '303', checkOutDate: '2024-03-15' }
      ]
    }
  },
  computed: {
    currentDate() {
      return new Date().toLocaleDateString('lo-LA', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'long'
      });
    },
    occupancyRate() {
      return Math.round((this.stats.occupiedRooms / this.stats.totalRooms) * 100);
    }
  },
  methods: {
    formatCurrency(amount) {
      return new Intl.NumberFormat('lo-LA').format(amount) + ' ກີບ';
    },
    formatDate(date) {
      return new Date(date).toLocaleDateString('lo-LA');
    },
    loadDashboardData() {
      // TODO: Fetch real data from API
      console.log('Loading dashboard data...');
    }
  },
  mounted() {
    this.loadDashboardData();
  }
}
</script>

<style scoped>
.admin-dashboard {
  max-width: 1200px;
  margin: 0 auto;
}

.welcome-section {
  text-align: center;
  margin-bottom: 30px;
  padding: 30px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
}

.welcome-section h2 {
  font-size: 2rem;
  margin-bottom: 10px;
  font-weight: 600;
}

.welcome-section p {
  font-size: 1.1rem;
  opacity: 0.9;
  margin: 0;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.stat-card {
  background: white;
  padding: 25px;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  display: flex;
  align-items: center;
  gap: 20px;
  transition: transform 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-2px);
}

.stat-icon {
  font-size: 2.5rem;
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
}

.stat-icon.available { background: #d1fae5; }
.stat-icon.occupied { background: #fed7d7; }
.stat-icon.bookings { background: #dbeafe; }
.stat-icon.revenue { background: #fef3c7; }

.stat-content h3 {
  font-size: 1.8rem;
  font-weight: 700;
  color: #2d3748;
  margin: 0 0 5px 0;
}

.stat-content p {
  color: #718096;
  font-size: 0.9rem;
  margin: 0;
}

.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}

.dashboard-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  overflow: hidden;
}

.card-header {
  padding: 20px 25px;
  border-bottom: 1px solid #e0e6ed;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-header h3 {
  color: #2d3748;
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0;
}

.view-all {
  color: #667eea;
  text-decoration: none;
  font-size: 0.9rem;
  font-weight: 500;
}

.view-all:hover {
  text-decoration: underline;
}

.card-content {
  padding: 20px 25px;
}

.empty-state {
  text-align: center;
  color: #718096;
  font-style: italic;
  padding: 20px 0;
}

.checkin-item, .checkout-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #f7fafc;
}

.checkin-item:last-child, .checkout-item:last-child {
  border-bottom: none;
}

.guest-name {
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 4px;
}

.room-info {
  font-size: 0.8rem;
  color: #718096;
}

.checkin-time, .checkout-date {
  font-size: 0.9rem;
  color: #667eea;
  font-weight: 500;
}

.quick-actions {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;
}

.quick-action {
  text-decoration: none;
  color: inherit;
  padding: 20px;
  text-align: center;
  border: 1px solid #e0e6ed;
  border-radius: 8px;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.quick-action:hover {
  background: #f7fafc;
  border-color: #667eea;
  transform: translateY(-2px);
}

.action-icon {
  font-size: 2rem;
}

.room-status {
  margin-bottom: 25px;
}

.status-item {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
  font-size: 0.9rem;
  color: #2d3748;
}

.status-color {
  width: 16px;
  height: 16px;
  border-radius: 50%;
}

.status-color.available { background: #22c55e; }
.status-color.occupied { background: #ef4444; }
.status-color.maintenance { background: #f59e0b; }

.occupancy-rate {
  text-align: center;
}

.rate-label {
  font-size: 0.9rem;
  color: #718096;
  margin-bottom: 10px;
}

.rate-bar {
  width: 100%;
  height: 8px;
  background: #e0e6ed;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 10px;
}

.rate-fill {
  height: 100%;
  background: linear-gradient(90deg, #667eea, #764ba2);
  border-radius: 4px;
  transition: width 0.3s ease;
}

.rate-text {
  font-size: 1.2rem;
  font-weight: 600;
  color: #667eea;
}

/* Responsive Design */
@media (max-width: 768px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .dashboard-grid {
    grid-template-columns: 1fr;
  }
  
  .quick-actions {
    grid-template-columns: 1fr;
  }
  
  .welcome-section {
    padding: 20px;
  }
  
  .welcome-section h2 {
    font-size: 1.5rem;
  }
}

@media (max-width: 480px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }
  
  .stat-card {
    padding: 20px;
  }
}
</style>