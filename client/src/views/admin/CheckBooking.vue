<template>
  <div class="check-booking">
    <!-- Page Header -->
    <div class="page-header">
      <h2>ກວດສອບການຈອງ</h2>
      <button class="btn btn-primary" @click="exportBookings">
        ໂຫຼດຂໍ້ມູນ
      </button>
    </div>

    <!-- Search and Filters -->
    <div class="filters-section">
      <div class="search-box">
        <input 
          type="text" 
          v-model="searchQuery" 
          placeholder="ຄົ້ນຫາດ້ວຍເລກຈອງ, ຊື່ລູກຄ້າ, ຫຼືເບີໂທ..."
          class="search-input"
        >
      </div>
      <div class="filter-controls">
        <select v-model="statusFilter" class="filter-select">
          <option value="">ທຸກສະຖານະ</option>
          <option value="ກໍາລັງລໍຖ້າ">ກໍາລັງລໍຖ້າ</option>
          <option value="ຢືນຢັນແລ້ວ">ຢືນຢັນແລ້ວ</option>
          <option value="ເຊັກອິນແລ້ວ">ເຊັກອິນແລ້ວ</option>
          <option value="ເຊັກເອົາແລ້ວ">ເຊັກເອົາແລ້ວ</option>
          <option value="ຍົກເລີກ">ຍົກເລີກ</option>
        </select>
        <select v-model="roomTypeFilter" class="filter-select">
          <option value="">ທຸກປະເພດຫ້ອງ</option>
          <option value="Superior Room">Superior Room</option>
          <option value="Deluxe Room">Deluxe Room</option>
          <option value="Suite Room">Suite Room</option>
          <option value="Family Room">Family Room</option>
        </select>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="loading-container">
      <div class="loading-spinner"></div>
      <p>ກໍາລັງໂຫຼດຂໍ້ມູນການຈອງ...</p>
    </div>

    <!-- Bookings Table -->
    <div v-if="!loading" class="table-section">
      <div class="table-container">
        <table class="staff-table">
          <thead>
            <tr>
              <th>ເລກຈອງ</th>
              <th>ລູກຄ້າ</th>
              <th>ຫ້ອງ</th>
              <th>ວັນທີ່ເຂົ້າ-ອອກ</th>
              <th>ຍອດລວມ</th>
              <th>ສະຖານະ</th>
              <th>ການດໍາເນີນການ</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="booking in filteredBookings" :key="booking.id">
              <td class="booking-number">{{ booking.bookingNumber }}</td>
              <td class="customer-info">
                <div class="name-container">
                  <div class="full-name">{{ booking.customerName }}</div>
                  <div class="contact-info">{{ booking.customerPhone }}</div>
                </div>
              </td>
              <td class="room-info">
                <div class="room-number">{{ booking.roomNumber }}</div>
                <div class="room-type">{{ booking.roomType }}</div>
              </td>
              <td class="dates">
                <div>ເຂົ້າ: {{ formatDate(booking.checkInDate) }}</div>
                <div>ອອກ: {{ formatDate(booking.checkOutDate) }}</div>
                <div class="nights">({{ booking.nights }} ຄືນ)</div>
              </td>
              <td class="amount">
                <div class="total-amount">{{ formatCurrency(booking.totalAmount) }}</div>
                <div class="payment-status">{{ booking.paymentStatus }}</div>
              </td>
              <td>
                <span class="status-badge" :class="getStatusClass(booking.status)">
                  {{ booking.status }}
                </span>
              </td>
              <td class="actions">
                <button class="btn btn-sm btn-info" @click="viewBookingDetails(booking)">
                  👁️ ລາຍລະອຽດ
                </button>
                <button 
                  class="btn btn-sm btn-success" 
                  @click="confirmBooking(booking)"
                  v-if="booking.status === 'ກໍາລັງລໍຖ້າ'"
                >
                  ✓ ຢືນຢັນ
                </button>
                <button 
                  class="btn btn-sm btn-danger" 
                  @click="cancelBooking(booking)"
                  v-if="booking.status !== 'ຍົກເລີກ' && booking.status !== 'ເຊັກເອົາແລ້ວ'"
                >
                  ✕ ຍົກເລີກ
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="!loading && bookings.length === 0" class="empty-state">
      <div class="empty-icon">📋</div>
      <h3>ບໍ່ມີຂໍ້ມູນການຈອງ</h3>
      <p>ລໍຖ້າການຈອງຈາກລູກຄ້າ</p>
    </div>

    <!-- Booking Details Modal -->
    <div v-if="showDetailsModal" class="modal-overlay" @click="closeDetailsModal">
      <div class="modal large-modal" @click.stop>
        <div class="modal-header">
          <h3>ລາຍລະອຽດການຈອງ</h3>
          <button class="close-btn" @click="closeDetailsModal">✕</button>
        </div>
        
        <div class="modal-body" v-if="selectedBooking">
          <div class="booking-details">
            <!-- Customer Information -->
            <div class="detail-section">
              <h4>ຂໍ້ມູນລູກຄ້າ</h4>
              <div class="detail-row">
                <span class="detail-label">ຊື່:</span>
                <span class="detail-value">{{ selectedBooking.customerName }}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">ເບີໂທ:</span>
                <span class="detail-value">{{ selectedBooking.customerPhone }}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">ອີເມວ:</span>
                <span class="detail-value">{{ selectedBooking.customerEmail }}</span>
              </div>
            </div>

            <!-- Booking Information -->
            <div class="detail-section">
              <h4>ຂໍ້ມູນການຈອງ</h4>
              <div class="detail-row">
                <span class="detail-label">ເລກຈອງ:</span>
                <span class="detail-value">{{ selectedBooking.bookingNumber }}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">ວັນທີ່ຈອງ:</span>
                <span class="detail-value">{{ formatDate(selectedBooking.bookingDate) }}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">ສະຖານະ:</span>
                <span class="detail-value">
                  <span class="status-badge" :class="getStatusClass(selectedBooking.status)">
                    {{ selectedBooking.status }}
                  </span>
                </span>
              </div>
            </div>

            <!-- Room Information -->
            <div class="detail-section">
              <h4>ຂໍ້ມູນຫ້ອງ</h4>
              <div class="detail-row">
                <span class="detail-label">ຫ້ອງເລກ:</span>
                <span class="detail-value">{{ selectedBooking.roomNumber }}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">ປະເພດຫ້ອງ:</span>
                <span class="detail-value">{{ selectedBooking.roomType }}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">ວັນທີ່ເຂົ້າ:</span>
                <span class="detail-value">{{ formatDate(selectedBooking.checkInDate) }}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">ວັນທີ່ອອກ:</span>
                <span class="detail-value">{{ formatDate(selectedBooking.checkOutDate) }}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">ຈໍານວນຄືນ:</span>
                <span class="detail-value">{{ selectedBooking.nights }} ຄືນ</span>
              </div>
            </div>

            <!-- Guest Information -->
            <div class="detail-section">
              <h4>ຂໍ້ມູນແຂກ</h4>
              <div class="detail-row">
                <span class="detail-label">ຜູ້ໃຫຍ່:</span>
                <span class="detail-value">{{ selectedBooking.adults }} ຄົນ</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">ເດັກ:</span>
                <span class="detail-value">{{ selectedBooking.children }} ຄົນ</span>
              </div>
            </div>

            <!-- Payment Information -->
            <div class="detail-section">
              <h4>ຂໍ້ມູນການຊໍາລະ</h4>
              <div class="detail-row">
                <span class="detail-label">ຍອດລວມ:</span>
                <span class="detail-value highlight">{{ formatCurrency(selectedBooking.totalAmount) }}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">ສະຖານະການຊໍາລະ:</span>
                <span class="detail-value">{{ selectedBooking.paymentStatus }}</span>
              </div>
              <div class="detail-row" v-if="selectedBooking.paymentMethod">
                <span class="detail-label">ວິທີການຊໍາລະ:</span>
                <span class="detail-value">{{ selectedBooking.paymentMethod }}</span>
              </div>
            </div>

            <!-- Special Requests -->
            <div class="detail-section" v-if="selectedBooking.specialRequests">
              <h4>ຄໍາຂໍພິເສດ</h4>
              <div class="special-requests">
                {{ selectedBooking.specialRequests }}
              </div>
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <button class="btn btn-outline" @click="closeDetailsModal">
            ປິດ
          </button>
          <button class="btn btn-primary" @click="printBooking" v-if="selectedBooking">
            🖨️ ພິມ
          </button>
        </div>
      </div>
    </div>

    <!-- Success/Error Messages -->
    <div v-if="message.show" class="message" :class="message.type">
      {{ message.text }}
    </div>
  </div>
</template>

<script>
export default {
  name: 'CheckBooking',
  data() {
    return {
      loading: false,
      searchQuery: '',
      statusFilter: '',
      roomTypeFilter: '',
      showDetailsModal: false,
      selectedBooking: null,
      
      // Sample booking data
      bookings: [
        {
          id: 1,
          bookingNumber: 'BK001',
          customerName: 'ສົມຊາຍ ໃຈດີ',
          customerPhone: '020-12345678',
          customerEmail: 'somchai@email.com',
          roomNumber: '101',
          roomType: 'Dubble Room',
          checkInDate: '2024-07-15',
          checkOutDate: '2024-07-17',
          nights: 2,
          adults: 2,
          children: 0,
          totalAmount: 300000,
          paymentStatus: 'ຊໍາລະແລ້ວ',
          paymentMethod: 'ບັດເຄຣດິດ',
          status: 'ຢືນຢັນແລ້ວ',
          bookingDate: '2024-07-10',
          specialRequests: 'ຂໍຫ້ອງທີ່ມີວິວທະເລ'
        },
        {
          id: 2,
          bookingNumber: 'BK002',
          customerName: 'ສົມຍິງ ຮັກສະອາດ',
          customerPhone: '020-87654321',
          customerEmail: 'somying@email.com',
          roomNumber: '205',
          roomType: 'Family Room',
          checkInDate: '2024-07-20',
          checkOutDate: '2024-07-22',
          nights: 2,
          adults: 2,
          children: 1,
          totalAmount: 450000,
          paymentStatus: 'ລໍຖ້າຊໍາລະ',
          paymentMethod: null,
          status: 'ກໍາລັງລໍຖ້າ',
          bookingDate: '2024-07-12',
          specialRequests: null
        },
        {
          id: 3,
          bookingNumber: 'BK003',
          customerName: 'ວິໄຊ ເກ່ງຫຼາຍ',
          customerPhone: '020-55566677',
          customerEmail: 'wichai@email.com',
          roomNumber: '301',
          roomType: 'Suite Room',
          checkInDate: '2024-07-18',
          checkOutDate: '2024-07-21',
          nights: 3,
          adults: 2,
          children: 0,
          totalAmount: 900000,
          paymentStatus: 'ຊໍາລະແລ້ວ',
          paymentMethod: 'ໂອນເງິນ',
          status: 'ເຊັກອິນແລ້ວ',
          bookingDate: '2024-07-08',
          specialRequests: 'ຂໍດອກໄມ້ສໍາລັບວັນຄົບຮອບແຕ່ງງານ'
        },
        {
          id: 4,
          bookingNumber: 'BK004',
          customerName: 'ມາລີ ສວຍງາມ',
          customerPhone: '020-99988877',
          customerEmail: 'malee@email.com',
          roomNumber: '102',
          roomType: 'Family Room',
          checkInDate: '2024-07-25',
          checkOutDate: '2024-07-28',
          nights: 3,
          adults: 2,
          children: 2,
          totalAmount: 600000,
          paymentStatus: 'ຊໍາລະແລ້ວ',
          paymentMethod: 'ເງິນສົດ',
          status: 'ເຊັກເອົາແລ້ວ',
          bookingDate: '2024-07-20',
          specialRequests: 'ຂໍເຕັຽງເພີ່ມສໍາລັບເດັກ'
        }
      ],
      
      message: {
        show: false,
        type: 'success',
        text: ''
      }
    }
  },
  
  computed: {
    filteredBookings() {
      // ສະແດງແຕ່ສະຖານະ "ຢືນຢັນແລ້ວ" ແລະ "ກໍາລັງລໍຖ້າ" ເທົ່ານັ້ນ
      let filtered = this.bookings.filter(booking => 
        booking.status === 'ຢືນຢັນແລ້ວ' || booking.status === 'ກໍາລັງລໍຖ້າ'
      );
      
      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase();
        filtered = filtered.filter(booking => 
          booking.bookingNumber.toLowerCase().includes(query) ||
          booking.customerName.toLowerCase().includes(query) ||
          booking.customerPhone.includes(query) ||
          booking.customerEmail.toLowerCase().includes(query)
        );
      }
      
      if (this.statusFilter) {
        filtered = filtered.filter(booking => booking.status === this.statusFilter);
      }
      
      if (this.roomTypeFilter) {
        filtered = filtered.filter(booking => booking.roomType === this.roomTypeFilter);
      }
      
      return filtered;
    },
    
    totalBookings() {
      return this.bookings.length;
    },
    
    confirmedBookings() {
      return this.bookings.filter(booking => 
        ['ຢືນຢັນແລ້ວ', 'ເຊັກອິນແລ້ວ', 'ເຊັກເອົາແລ້ວ'].includes(booking.status)
      ).length;
    },
    
    pendingBookings() {
      return this.bookings.filter(booking => booking.status === 'ກໍາລັງລໍຖ້າ').length;
    },
    
    todayCheckins() {
      const today = new Date().toISOString().split('T')[0];
      return this.bookings.filter(booking => booking.checkInDate === today).length;
    }
  },
  
  mounted() {
    this.loadBookings();
  },
  
  methods: {
    // Load booking data
    async loadBookings() {
      this.loading = true;
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        console.log('Bookings loaded:', this.bookings);
      } catch (error) {
        console.error('Error loading bookings:', error);
        this.showMessage('ບໍ່ສາມາດໂຫຼດຂໍ້ມູນການຈອງໄດ້', 'error');
      } finally {
        this.loading = false;
      }
    },
    
    // View booking details
    viewBookingDetails(booking) {
      this.selectedBooking = booking;
      this.showDetailsModal = true;
    },
    
    // Edit booking
    editBooking(booking) {
      console.log('Edit booking:', booking);
      this.showMessage('ຟີເຈີແກ້ໄຂການຈອງຈະເປີດໃຫ້ໃຊ້ງານໃນໄວໆນີ້', 'info');
    },
    
    // Confirm booking
    confirmBooking(booking) {
      if (confirm(`ທ່ານແນ່ໃຈບໍ່ວ່າຕ້ອງການຢືນຢັນການຈອງ ${booking.bookingNumber}?`)) {
        booking.status = 'ຢືນຢັນແລ້ວ';
        this.showMessage(`ຢືນຢັນການຈອງ ${booking.bookingNumber} ສໍາເລັດ`, 'success');
      }
    },
    
    // Cancel booking
    cancelBooking(booking) {
      if (confirm(`ທ່ານແນ່ໃຈບໍ່ວ່າຕ້ອງການຍົກເລີກການຈອງ ${booking.bookingNumber}?`)) {
        booking.status = 'ຍົກເລີກ';
        this.showMessage(`ຍົກເລີກການຈອງ ${booking.bookingNumber} ສໍາເລັດ`, 'success');
      }
    },
    
    // Close details modal
    closeDetailsModal() {
      this.showDetailsModal = false;
      this.selectedBooking = null;
    },
    
    // Export bookings
    exportBookings() {
      console.log('Exporting booking data...');
      this.showMessage('ກໍາລັງໂຫຼດຂໍ້ມູນການຈອງ...', 'info');
    },
    
    // Print booking
    printBooking() {
      if (this.selectedBooking) {
        console.log('Printing booking:', this.selectedBooking);
        this.showMessage('ກໍາລັງພິມຂໍ້ມູນການຈອງ...', 'info');
      }
    },
    
    // Get status class for styling
    getStatusClass(status) {
      switch (status) {
        case 'ຢືນຢັນແລ້ວ': return 'status-confirmed';
        case 'ກໍາລັງລໍຖ້າ': return 'status-pending';
        case 'ເຊັກອິນແລ້ວ': return 'status-checkin';
        case 'ເຊັກເອົາແລ້ວ': return 'status-checkout';
        case 'ຍົກເລີກ': return 'status-cancelled';
        default: return 'status-default';
      }
    },
    
    // Format date
    formatDate(date) {
      if (!date) return '-';
      return new Date(date).toLocaleDateString('lo-LA');
    },
    
    // Format currency
    formatCurrency(amount) {
      return new Intl.NumberFormat('lo-LA', {
        style: 'currency',
        currency: 'LAK',
        minimumFractionDigits: 0
      }).format(amount);
    },
    
    // Show message
    showMessage(text, type = 'success') {
      this.message = { show: true, text, type };
      setTimeout(() => {
        this.message.show = false;
      }, 5000);
    }
  }
}
</script>

<style scoped>
/* Import base styles from StaffManagement */
.check-booking {
  padding: 20px;
  background-color: #f8f9fa;
  min-height: 100vh;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  padding: 20px;


}

.page-header h2 {
  margin: 0;
  color: #333;
  font-size: 24px;
  font-weight: 600;
}

.filters-section {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.search-box {
  flex: 1;
  min-width: 300px;
}

.search-input {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
}

.filter-controls {
  display: flex;
  gap: 15px;
}

.filter-select {
  padding: 12px 16px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
  min-width: 150px;
}

.loading-container {
  text-align: center;
  padding: 60px 20px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #f3f3f3;
  border-top: 3px solid #007bff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 20px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.staff-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.stat-item {
  background: white;
  padding: 30px 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  text-align: center;
  position: relative;
  overflow: hidden;
}

.stat-number {
  font-size: 36px;
  font-weight: 700;
  color: #007bff;
  margin-bottom: 8px;
}

.stat-label {
  font-size: 14px;
  color: #666;
  margin-bottom: 10px;
}

.table-section {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  overflow: hidden;
}

.table-container {
  overflow-x: auto;
}

.staff-table {
  width: 100%;
  border-collapse: collapse;
}

.staff-table th {
  background: #2f70b6;
  padding: 15px 12px;
  text-align: left;
  font-weight: 600;
  color: white;
  border: 1px solid #094b91;
  border-bottom: 2px solid #dee2e6;
  white-space: nowrap;
}

.staff-table td {
  padding: 12px;
  border-bottom: 1px solid #dee2e6;
  vertical-align: top;
}

.booking-number {
  font-weight: 600;
  color: #007bff;
}

.customer-info .full-name {
  font-weight: 600;
  margin-bottom: 4px;
}

.customer-info .contact-info {
  font-size: 12px;
  color: #666;
}

.room-info .room-number {
  font-weight: 600;
  margin-bottom: 4px;
}

.room-info .room-type {
  font-size: 12px;
  color: #666;
}

.dates {
  font-size: 13px;
}

.dates .nights {
  font-size: 11px;
  color: #666;
}

.guests {
  font-size: 13px;
}

.amount .total-amount {
  font-weight: 600;
  color: #28a745;
  margin-bottom: 4px;
}

.amount .payment-status {
  font-size: 11px;
  color: #666;
}

.status-badge {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
}

.status-confirmed { background: #d4edda; color: #155724; }
.status-pending { background: #fff3cd; color: #856404; }
.status-checkin { background: #d1ecf1; color: #0c5460; }
.status-checkout { background: #e2e3e5; color: #383d41; }
.status-cancelled { background: #f8d7da; color: #721c24; }

.actions {
  white-space: nowrap;
}

.btn {
  padding: 6px 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  text-decoration: none;
  margin-right: 5px;
  margin-bottom: 5px;
  display: inline-block;
  transition: all 0.2s;
}

.btn-sm {
  padding: 4px 8px;
  font-size: 11px;
}

.btn-primary {
  background: #007bff;
  color: white;
}

.btn-primary:hover {
  background: #0056b3;
}

.btn-outline {
  background: white;
  color: #007bff;
  border: 1px solid #007bff;
}

.btn-outline:hover {
  background: #007bff;
  color: white;
}

.btn-info {
  background: #17a2b8;
  color: white;
}

.btn-info:hover {
  background: #138496;
}

.btn-success {
  background: #28a745;
  color: white;
}

.btn-success:hover {
  background: #1e7e34;
}

.btn-danger {
  background: #dc3545;
  color: white;
}

.btn-danger:hover {
  background: #c82333;
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 20px;
  opacity: 0.5;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal {
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.3);
  max-width: 600px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
}

.large-modal {
  max-width: 800px;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #dee2e6;
}

.modal-header h3 {
  margin: 0;
  color: #333;
}

.close-btn {
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  color: #666;
  padding: 5px;
}

.close-btn:hover {
  color: #000;
}

.modal-body {
  padding: 20px;
}

.modal-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-top: 1px solid #dee2e6;
}

.booking-details {
  display: grid;
  gap: 25px;
}

.detail-section {
  background: #f8f9fa;
  padding: 15px;
  border-radius: 6px;
}

.detail-section h4 {
  margin: 0 0 15px 0;
  color: #333;
  font-size: 16px;
  font-weight: 600;
  border-bottom: 1px solid #dee2e6;
  padding-bottom: 8px;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  padding: 5px 0;
}

.detail-label {
  font-weight: 600;
  color: #666;
}

.detail-value {
  color: #333;
}

.detail-value.highlight {
  font-weight: 600;
  color: #28a745;
  font-size: 16px;
}

.special-requests {
  background: white;
  padding: 15px;
  border-radius: 4px;
  border-left: 4px solid #007bff;
  color: #333;
  line-height: 1.5;
}

.message {
  position: fixed;
  top: 20px;
  right: 20px;
  padding: 15px 20px;
  border-radius: 6px;
  color: white;
  font-weight: 500;
  z-index: 1100;
  max-width: 400px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.2);
}

.message.success {
  background: #28a745;
}

.message.error {
  background: #dc3545;
}

.message.info {
  background: #17a2b8;
}

/* Responsive Design */
@media (max-width: 768px) {
  .check-booking {
    padding: 15px;
  }
  
  .page-header {
    flex-direction: column;
    gap: 15px;
    text-align: center;
  }
  
  .filters-section {
    flex-direction: column;
  }
  
  .filter-controls {
    flex-direction: column;
  }
  
  .staff-stats {
    grid-template-columns: 1fr;
  }
  
  .staff-table {
    font-size: 12px;
  }
  
  .staff-table th,
  .staff-table td {
    padding: 8px 6px;
  }
  
  .actions {
    display: flex;
    flex-direction: column;
    gap: 5px;
  }
  
  .modal {
    width: 95%;
    margin: 10px;
  }
  
  .booking-details {
    gap: 15px;
  }
  
  .detail-row {
    flex-direction: column;
    gap: 5px;
  }
}
</style>
