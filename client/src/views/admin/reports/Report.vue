<!-- src/views/admin/reports/Report.vue -->
<template>
  <div class="reports-container">
    <!-- Page Header -->
    <div class="page-header">
      <h2>ລາຍງານທັງໝົດ</h2>
      <div class="header-actions">
        <button class="btn btn-primary" @click="refreshReports">
          ໂຫຼດຂໍ້ມູນໃໝ່
        </button>
      </div>
    </div>

    <!-- Report Tabs -->
    <div class="tabs-container">
      <div class="tabs-header">
        <button 
          v-for="tab in reportTabs" 
          :key="tab.id"
          :class="['tab-button', { active: activeTab === tab.id }]"
          @click="setActiveTab(tab.id)"
        >
          <span class="tab-label">{{ tab.label }}</span>
        </button>
      </div>

      <!-- Tab Content -->
      <div class="tab-content">
        <!-- Booking Report Tab -->
        <div v-if="activeTab === 'booking'" class="report-section">
          <div class="report-header">
            <h3>ລາຍງານການຈອງ</h3>
            <div class="report-filters">
              <input 
                type="date" 
                v-model="filters.booking.startDate" 
                class="form-input"
                @change="loadBookingReport"
              >
              <input 
                type="date" 
                v-model="filters.booking.endDate" 
                class="form-input"
                @change="loadBookingReport"
              >
              <select v-model="filters.booking.status" class="form-select" @change="loadBookingReport">
                <option value="">ທຸກສະຖານະ</option>
                <option value="pending">ລໍຖ້າການຢືນຢັນ</option>
                <option value="confirmed">ຢືນຢັນແລ້ວ</option>
                <option value="cancelled">ຍົກເລີກ</option>
              </select>
            </div>
          </div>
          
          <div class="stats-grid">
            <div class="stat-card">
              <div class="stat-content">
                <div class="stat-value">{{ bookingStats.total }}</div>
                <div class="stat-label">ທັງໝົດ</div>
              </div>
            </div>
            <div class="stat-card">
              <div class="stat-content">
                <div class="stat-value">{{ bookingStats.confirmed }}</div>
                <div class="stat-label">ຢືນຢັນແລ້ວ</div>
              </div>
            </div>
            <div class="stat-card">
              <div class="stat-content">
                <div class="stat-value">{{ bookingStats.pending }}</div>
                <div class="stat-label">ລໍຖ້າການຢືນຢັນ</div>
              </div>
            </div>
            <div class="stat-card">
              <div class="stat-content">
                <div class="stat-value">{{ bookingStats.cancelled }}</div>
                <div class="stat-label">ຍົກເລີກ</div>
              </div>
            </div>
          </div>

          <div class="table-container">
            <table class="report-table">
              <thead>
                <tr>
                  <th>ລະຫັດການຈອງ</th>
                  <th>ລູກຄ້າ</th>
                  <th>ປະເພດຫ້ອງ</th>
                  <th>ວັນທີເຂົ້າ</th>
                  <th>ວັນທີອອກ</th>
                  <th>ສະຖານະ</th>
                  <th>ຍອດເງີນ</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="booking in bookingReportData" :key="booking.id">
                  <td>{{ booking.id }}</td>
                  <td>{{ booking.customerName }}</td>
                  <td>{{ booking.roomType }}</td>
                  <td>{{ formatDate(booking.checkIn) }}</td>
                  <td>{{ formatDate(booking.checkOut) }}</td>
                  <td>
                    <span :class="['status-badge', booking.status]">
                      {{ getStatusLabel(booking.status) }}
                    </span>
                  </td>
                  <td class="amount">{{ formatCurrency(booking.amount) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Revenue Report Tab -->
        <div v-if="activeTab === 'revenue'" class="report-section">
          <div class="report-header">
            <h3>ລາຍງານລາຍຮັບ</h3>
            <div class="report-filters">
              <select v-model="filters.revenue.period" class="form-select" @change="loadRevenueReport">
                <option value="daily">ລາຍວັນ</option>
                <option value="weekly">ລາຍອາທິດ</option>
                <option value="monthly">ລາຍເດືອນ</option>
                <option value="yearly">ລາຍປີ</option>
              </select>
              <input 
                type="month" 
                v-model="filters.revenue.month" 
                class="form-input"
                @change="loadRevenueReport"
              >
            </div>
          </div>

          <div class="stats-grid">
            <div class="stat-card primary">
              <div class="stat-content">
                <div class="stat-value">{{ formatCurrency(revenueStats.total) }}</div>
                <div class="stat-label">ລາຍຮັບທັງໝົດ</div>
              </div>
            </div>
            <div class="stat-card success">
              <div class="stat-content">
                <div class="stat-value">{{ formatCurrency(revenueStats.thisMonth) }}</div>
                <div class="stat-label">ເດືອນນີ້</div>
              </div>
            </div>
            <div class="stat-card info">
              <div class="stat-content">
                <div class="stat-value">{{ formatCurrency(revenueStats.average) }}</div>
                <div class="stat-label">ຄ່າເສລ່ຍ</div>
              </div>
            </div>
            <div class="stat-card warning">
              <div class="stat-content">
                <div class="stat-value">{{ revenueStats.growthPercent }}%</div>
                <div class="stat-label">ການເຕີບໂຕ</div>
              </div>
            </div>
          </div>

          <div class="chart-container">
            <canvas ref="revenueChart" width="400" height="200"></canvas>
          </div>
        </div>

        <!-- Customer Report Tab -->
        <div v-if="activeTab === 'customer'" class="report-section">
          <div class="report-header">
            <h3>ລາຍງານລູກຄ້າ</h3>
            <div class="report-filters">
              <input 
                type="text" 
                v-model="filters.customer.search" 
                class="form-input"
                placeholder="ຄົ້ນຫາລູກຄ້າ..."
                @input="loadCustomerReport"
              >
              <select v-model="filters.customer.type" class="form-select" @change="loadCustomerReport">
                <option value="">ທຸກປະເພດ</option>
                <option value="regular">ລູກຄ້າປົກກະຕິ</option>
                <option value="vip">ລູກຄ້າ VIP</option>
                <option value="corporate">ບໍລິສັດ</option>
              </select>
            </div>
          </div>

          <div class="stats-grid">
            <div class="stat-card">
              <div class="stat-content">
                <div class="stat-value">{{ customerStats.total }}</div>
                <div class="stat-label">ລູກຄ້າທັງໝົດ</div>
              </div>
            </div>
            <div class="stat-card">
              <div class="stat-content">
                <div class="stat-value">{{ customerStats.vip }}</div>
                <div class="stat-label">ລູກຄ້າ VIP</div>
              </div>
            </div>
            <div class="stat-card">
              <div class="stat-content">
                <div class="stat-value">{{ customerStats.corporate }}</div>
                <div class="stat-label">ບໍລິສັດ</div>
              </div>
            </div>
            <div class="stat-card">
              <div class="stat-content">
                <div class="stat-value">{{ customerStats.returning }}</div>
                <div class="stat-label">ກັບມາໃໝ່</div>
              </div>
            </div>
          </div>

          <div class="table-container">
            <table class="report-table">
              <thead>
                <tr>
                  <th>ລະຫັດລູກຄ້າ</th>
                  <th>ຊື່ລູກຄ້າ</th>
                  <th>ອີເມວ</th>
                  <th>ເບີໂທ</th>
                  <th>ປະເພດ</th>
                  <th>ການຈອງ</th>
                  <th>ຍອດເງີນທັງໝົດ</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="customer in customerReportData" :key="customer.id">
                  <td>{{ customer.id }}</td>
                  <td>{{ customer.name }}</td>
                  <td>{{ customer.email }}</td>
                  <td>{{ customer.phone }}</td>
                  <td>
                    <span :class="['type-badge', customer.type]">
                      {{ getCustomerTypeLabel(customer.type) }}
                    </span>
                  </td>
                  <td>{{ customer.bookingsCount }}</td>
                  <td class="amount">{{ formatCurrency(customer.totalSpent) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Check-in Report Tab -->
        <div v-if="activeTab === 'checkin'" class="report-section">
          <div class="report-header">
            <h3>ລາຍງານການເຂົ້າພັກ</h3>
            <div class="report-filters">
              <input 
                type="date" 
                v-model="filters.checkin.date" 
                class="form-input"
                @change="loadCheckinReport"
              >
              <select v-model="filters.checkin.roomType" class="form-select" @change="loadCheckinReport">
                <option value="">ທຸກປະເພດຫ້ອງ</option>
                <option value="standard">Standard</option>
                <option value="deluxe">Deluxe</option>
                <option value="suite">Suite</option>
              </select>
            </div>
          </div>

          <div class="stats-grid">
            <div class="stat-card">
              <div class="stat-content">
                <div class="stat-value">{{ checkinStats.total }}</div>
                <div class="stat-label">ເຂົ້າພັກທັງໝົດ</div>
              </div>
            </div>
            <div class="stat-card">
              <div class="stat-content">
                <div class="stat-value">{{ checkinStats.today }}</div>
                <div class="stat-label">ມື້ນີ້</div>
              </div>
            </div>
            <div class="stat-card">
              <div class="stat-content">
                <div class="stat-value">{{ checkinStats.occupied }}%</div>
                <div class="stat-label">ຫ້ອງທີ່ມີຄົນ</div>
              </div>
            </div>
            <div class="stat-card">
              <div class="stat-content">
                <div class="stat-value">{{ checkinStats.avgStay }}</div>
                <div class="stat-label">ໄລຍະພັກເສລ່ຍ</div>
              </div>
            </div>
          </div>

          <div class="table-container">
            <table class="report-table">
              <thead>
                <tr>
                  <th>ລະຫັດເຂົ້າພັກ</th>
                  <th>ລູກຄ້າ</th>
                  <th>ຫ້ອງ</th>
                  <th>ວັນທີເຂົ້າ</th>
                  <th>ວັນທີອອກ</th>
                  <th>ໄລຍະພັກ</th>
                  <th>ສະຖານະ</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="checkin in checkinReportData" :key="checkin.id">
                  <td>{{ checkin.id }}</td>
                  <td>{{ checkin.guestName }}</td>
                  <td>{{ checkin.roomNumber }}</td>
                  <td>{{ formatDate(checkin.checkInDate) }}</td>
                  <td>{{ formatDate(checkin.checkOutDate) }}</td>
                  <td>{{ checkin.stayDuration }} ວັນ</td>
                  <td>
                    <span :class="['status-badge', checkin.status]">
                      {{ getCheckinStatusLabel(checkin.status) }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading Overlay -->
    <div v-if="loading" class="loading-overlay">
      <div class="loading-spinner"></div>
      <p>ກໍາລັງໂຫຼດຂໍ້ມູນ...</p>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'Report',
  data() {
    return {
      loading: false,
      activeTab: 'booking',
      reportTabs: [
        { id: 'booking', label: 'ການຈອງ' },
        { id: 'revenue', label: 'ລາຍຮັບ' },
        { id: 'customer', label: 'ລູກຄ້າ' },
        { id: 'checkin', label: 'ເຂົ້າພັກ' }
      ],
      filters: {
        booking: {
          startDate: '',
          endDate: '',
          status: ''
        },
        revenue: {
          period: 'monthly',
          month: ''
        },
        customer: {
          search: '',
          type: ''
        },
        checkin: {
          date: '',
          roomType: ''
        }
      },
      // Booking Data
      bookingStats: {
        total: 0,
        confirmed: 0,
        pending: 0,
        cancelled: 0
      },
      bookingReportData: [],
      // Revenue Data
      revenueStats: {
        total: 0,
        thisMonth: 0,
        average: 0,
        growthPercent: 0
      },
      // Customer Data
      customerStats: {
        total: 0,
        vip: 0,
        corporate: 0,
        returning: 0
      },
      customerReportData: [],
      // Check-in Data
      checkinStats: {
        total: 0,
        today: 0,
        occupied: 0,
        avgStay: 0
      },
      checkinReportData: []
    }
  },
  mounted() {
    this.initializeDates()
    this.loadReports()
  },
  methods: {
    initializeDates() {
      const now = new Date()
      const firstDay = new Date(now.getFullYear(), now.getMonth(), 1)
      const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0)
      
      this.filters.booking.startDate = firstDay.toISOString().split('T')[0]
      this.filters.booking.endDate = lastDay.toISOString().split('T')[0]
      this.filters.revenue.month = now.toISOString().slice(0, 7)
      this.filters.checkin.date = now.toISOString().split('T')[0]
    },

    setActiveTab(tabId) {
      this.activeTab = tabId
      this.loadReports()
    },

    async loadReports() {
      switch (this.activeTab) {
        case 'booking':
          await this.loadBookingReport()
          break
        case 'revenue':
          await this.loadRevenueReport()
          break
        case 'customer':
          await this.loadCustomerReport()
          break
        case 'checkin':
          await this.loadCheckinReport()
          break
      }
    },

    async loadBookingReport() {
      this.loading = true
      try {
        const params = {
          startDate: this.filters.booking.startDate,
          endDate: this.filters.booking.endDate,
          status: this.filters.booking.status
        }
        
        const response = await axios.get('http://localhost:3000/api/reports/bookings', { params })
        this.bookingReportData = response.data.bookings || []
        this.bookingStats = response.data.stats || this.bookingStats
      } catch (error) {
        console.error('Error loading booking report:', error)
        // Mock data for demonstration
        this.bookingReportData = [
          { id: 'B001', customerName: 'ນາງ ສີດາ', roomType: 'Standard', checkIn: '2025-01-10', checkOut: '2025-01-12', status: 'confirmed', amount: 1200000 },
          { id: 'B002', customerName: 'ທ້າວ ບຸນມີ', roomType: 'Deluxe', checkIn: '2025-01-11', checkOut: '2025-01-14', status: 'pending', amount: 1800000 },
        ]
        this.bookingStats = { total: 25, confirmed: 18, pending: 5, cancelled: 2 }
      } finally {
        this.loading = false
      }
    },

    async loadRevenueReport() {
      this.loading = true
      try {
        const params = {
          period: this.filters.revenue.period,
          month: this.filters.revenue.month
        }
        
        const response = await axios.get('http://localhost:3000/api/reports/revenue', { params })
        this.revenueStats = response.data.stats || this.revenueStats
      } catch (error) {
        console.error('Error loading revenue report:', error)
        // Mock data
        this.revenueStats = { 
          total: 45000000, 
          thisMonth: 12000000, 
          average: 1500000, 
          growthPercent: 15 
        }
      } finally {
        this.loading = false
      }
    },

    async loadCustomerReport() {
      this.loading = true
      try {
        const params = {
          search: this.filters.customer.search,
          type: this.filters.customer.type
        }
        
        const response = await axios.get('http://localhost:3000/api/reports/customers', { params })
        this.customerReportData = response.data.customers || []
        this.customerStats = response.data.stats || this.customerStats
      } catch (error) {
        console.error('Error loading customer report:', error)
        // Mock data
        this.customerReportData = [
          { id: 'C001', name: 'ນາງ ສີດາ', email: 'sida@email.com', phone: '020 5555 1234', type: 'regular', bookingsCount: 3, totalSpent: 3600000 },
          { id: 'C002', name: 'ທ້າວ ບຸນມີ', email: 'bounmee@email.com', phone: '020 5555 5678', type: 'vip', bookingsCount: 8, totalSpent: 12000000 },
        ]
        this.customerStats = { total: 156, vip: 23, corporate: 12, returning: 89 }
      } finally {
        this.loading = false
      }
    },

    async loadCheckinReport() {
      this.loading = true
      try {
        const params = {
          date: this.filters.checkin.date,
          roomType: this.filters.checkin.roomType
        }
        
        const response = await axios.get('http://localhost:3000/api/reports/checkins', { params })
        this.checkinReportData = response.data.checkins || []
        this.checkinStats = response.data.stats || this.checkinStats
      } catch (error) {
        console.error('Error loading checkin report:', error)
        // Mock data
        this.checkinReportData = [
          { id: 'CI001', guestName: 'ນາງ ສີດາ', roomNumber: '101', checkInDate: '2025-01-10', checkOutDate: '2025-01-12', stayDuration: 2, status: 'active' },
          { id: 'CI002', guestName: 'ທ້າວ ບຸນມີ', roomNumber: '205', checkInDate: '2025-01-11', checkOutDate: '2025-01-14', stayDuration: 3, status: 'active' },
        ]
        this.checkinStats = { total: 45, today: 8, occupied: 78, avgStay: 2.5 }
      } finally {
        this.loading = false
      }
    },

    async refreshReports() {
      await this.loadReports()
    },

    async exportAllReports() {
      // Implementation for exporting reports
      console.log('Exporting all reports...')
    },

    formatDate(dateString) {
      if (!dateString) return '-'
      return new Date(dateString).toLocaleDateString('lo-LA')
    },

    formatCurrency(amount) {
      if (!amount) return '0 ກີບ'
      return new Intl.NumberFormat('lo-LA').format(amount) + ' ກີບ'
    },

    getStatusLabel(status) {
      const labels = {
        pending: 'ລໍຖ້າການຢືນຢັນ',
        confirmed: 'ຢືນຢັນແລ້ວ',
        cancelled: 'ຍົກເລີກ'
      }
      return labels[status] || status
    },

    getCustomerTypeLabel(type) {
      const labels = {
        regular: 'ປົກກະຕິ',
        vip: 'VIP',
        corporate: 'ບໍລິສັດ'
      }
      return labels[type] || type
    },

    getCheckinStatusLabel(status) {
      const labels = {
        active: 'ກໍາລັງພັກ',
        checkout: 'ອອກແລ້ວ',
        pending: 'ລໍຖ້າເຂົ້າພັກ'
      }
      return labels[status] || status
    }
  }
}
</script>

<style scoped>
.reports-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 2px solid #e5e7eb;
}

.page-header h2 {
  color: #1f2937;
  font-size: 2rem;
  font-weight: 700;
  margin: 0;
}

.header-actions {
  display: flex;
  gap: 12px;
}

/* Tabs */
.tabs-container {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.07);
  overflow: hidden;
}

.tabs-header {
  display: flex;
  background: #f8fafc;
  border-bottom: 1px solid #e5e7eb;
}

.tab-button {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px 24px;
  border: none;
  background: none;
  color: #6b7280;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  border-bottom: 3px solid transparent;
}

.tab-button:hover {
  background: #f3f4f6;
  color: #374151;
}

.tab-button.active {
  background: white;
  color: #2f70b6;
  border-bottom-color: #2f70b6;
}

/* Report Content */
.tab-content {
  padding: 24px;
}

.report-section {
  min-height: 600px;
}

.report-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.report-header h3 {
  color: #1f2937;
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0;
}

.report-filters {
  display: flex;
  gap: 12px;
  align-items: center;
}

/* Stats Grid */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.stat-card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.07);
  border-left: 4px solid #667eea;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-2px);
}

.stat-card.primary {
  border-left-color: #667eea;
}

.stat-card.success {
  border-left-color: #10b981;
}

.stat-card.info {
  border-left-color: #06b6d4;
}

.stat-card.warning {
  border-left-color: #f59e0b;
}

.stat-content {
  flex: 1;
  text-align: center;
}

.stat-value {
  font-size: 2rem;
  font-weight: 700;
  color: #1f2937;
  line-height: 1;
}

.stat-label {
  color: #6b7280;
  font-weight: 500;
  margin-top: 4px;
}

/* Tables */
.table-container {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.07);
  overflow: hidden;
}

.report-table {
  width: 100%;
  border-collapse: collapse;
}

.report-table thead {
  background: #2f70b6;
}

.report-table th {
  padding: 16px 20px;
  text-align: left;
  color: white;
  font-weight: 600;
  font-size: 0.95rem;
}

.report-table tbody tr {
  border-bottom: 1px solid #f3f4f6;
  transition: background-color 0.3s ease;
}

.report-table tbody tr:hover {
  background-color: #f8fafc;
}

.report-table td {
  padding: 16px 20px;
  vertical-align: middle;
}

.amount {
  font-weight: 600;
  color: #059669;
}

/* Badges */
.status-badge, .type-badge {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 500;
}

.status-badge.confirmed {
  background: #d1fae5;
  color: #065f46;
}

.status-badge.pending {
  background: #fef3c7;
  color: #92400e;
}

.status-badge.cancelled {
  background: #fee2e2;
  color: #991b1b;
}

.status-badge.active {
  background: #dbeafe;
  color: #1e40af;
}

.type-badge.regular {
  background: #f3f4f6;
  color: #374151;
}

.type-badge.vip {
  background: #fef3c7;
  color: #92400e;
}

.type-badge.corporate {
  background: #e0e7ff;
  color: #3730a3;
}

/* Chart Container */
.chart-container {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.07);
  padding: 24px;
  margin-top: 20px;
}

/* Form Elements */
.form-input, .form-select {
  padding: 8px 12px;
  border: 2px solid #e5e7eb;
  border-radius: 6px;
  font-size: 0.9rem;
  transition: border-color 0.3s ease;
}

.form-input:focus, .form-select:focus {
  outline: none;
  border-color: #667eea;
}

/* Buttons */
.btn {
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 600;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.btn-primary {
  background:#2f70b6;
  color: white;
}

.btn-primary:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.btn-outline {
  background: white;
  border: 2px solid #e5e7eb;
  color: #374151;
}

.btn-outline:hover {
  background: #f9fafb;
  border-color: #d1d5db;
}

/* Loading */
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255,255,255,0.9);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f4f6;
  border-top: 4px solid #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 16px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Responsive Design */
@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    gap: 16px;
    align-items: stretch;
  }
  
  .tabs-header {
    flex-wrap: wrap;
  }
  
  .tab-button {
    flex: 1;
    min-width: 120px;
  }
  
  .report-header {
    flex-direction: column;
    gap: 16px;
    align-items: stretch;
  }
  
  .report-filters {
    flex-wrap: wrap;
  }
  
  .stats-grid {
    grid-template-columns: 1fr;
  }
  
  .table-container {
    overflow-x: auto;
  }
  
  .report-table {
    min-width: 600px;
  }
}
</style>
