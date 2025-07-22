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
          <option value="pending">ກໍາລັງລໍຖ້າ</option>
          <option value="confirmed">ຢືນຢັນແລ້ວ</option>
          <option value="checked_in">ເຊັກອິນແລ້ວ</option>
          <option value="checked_out">ເຊັກເອົາແລ້ວ</option>
          <option value="cancelled">ຍົກເລີກ</option>
        </select>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="loading-container">
      <div class="loading-spinner"></div>
      <p>ກໍາລັງໂຫຼດຂໍ້ມູນການຈອງ...</p>
    </div>

    <!-- Error State -->
    <div v-if="error && !loading" class="error-container">
      <div class="error-icon">⚠️</div>
      <h3>ເກີດຂໍ້ຜິດພາດ</h3>
      <p>{{ error }}</p>
      <button class="btn btn-primary" @click="loadBookings">ລອງໃໝ່</button>
    </div>

    <!-- Bookings Table -->
    <div v-if="!loading && !error && filteredBookings.length > 0" class="table-section">
      <div class="table-container">
        <table class="staff-table">
          <thead>
            <tr>
              <th>ເລກຈອງ</th>
              <th>ລູກຄ້າ ID</th>
              <th>ວັນທີ່ເຂົ້າ-ອອກ</th>
              <th>ຈໍານວນວັນ</th>
              <th>ຍອດລວມ</th>
              <th>ສະຖານະ</th>
              <th>ຮູບການຊໍາລະ</th>
              <th>ການດໍາເນີນການ</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="booking in filteredBookings" :key="booking.id">
              <td class="booking-number">{{ String(booking.id) }}</td>
              <td class="customer-info">
                <div class="customer-id">ລູກຄ້າ #{{ booking.cus_id }}</div>
                <div class="user-id">ຜູ້ໃຊ້ #{{ booking.User_id }}</div>
              </td>
              <td class="dates">
                <div>ເຂົ້າ: {{ formatDate(booking.startDate) }}</div>
                <div>ອອກ: {{ formatDate(booking.endDate) }}</div>
              </td>
              <td class="nights">{{ booking.total_stay_days || calculateDays(booking.startDate, booking.endDate) }} ວັນ</td>
              <td class="amount">
                <div class="total-amount">{{ formatCurrency(booking.total_price) }}</div>
              </td>
              <td>
                <span class="status-badge" :class="getStatusClass(booking.status)">
                  {{ getStatusText(booking.status) }}
                </span>
              </td>
              <td class="payment-image">
                <button 
                  v-if="booking.payment_image" 
                  class="btn btn-sm btn-info"
                  @click="viewPaymentImage(booking)"
                >
                  👁️ ເບິ່ງຮູບ
                </button>
                <span v-else class="no-image">-</span>
              </td>
              <td class="actions">
                <button class="btn btn-sm btn-info" @click="viewBookingDetails(booking)">
                  👁️ ລາຍລະອຽດ
                </button>
                <button 
                  class="btn btn-sm btn-success" 
                  @click="confirmBooking(booking)"
                  v-if="booking.status === 'pending'"
                >
                  ✓ ຢືນຢັນ
                </button>
                <button 
                  class="btn btn-sm btn-danger" 
                  @click="cancelBooking(booking)"
                  v-if="booking.status !== 'cancelled' && booking.status !== 'checked_out'"
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
    <div v-if="!loading && !error && filteredBookings.length === 0" class="empty-state">
      <div class="empty-icon">📋</div>
      <h3>ບໍ່ມີຂໍ້ມູນການຈອງ</h3>
      <p>{{ searchQuery || statusFilter ? 'ບໍ່ພົບຂໍ້ມູນທີ່ຄົ້ນຫາ' : 'ລໍຖ້າການຈອງຈາກລູກຄ້າ' }}</p>
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
            <!-- Booking Information -->
            <div class="detail-section">
              <h4>ຂໍ້ມູນການຈອງ</h4>
              <div class="detail-row">
                <span class="detail-label">ເລກຈອງ:</span>
                <span class="detail-value">{{ String(selectedBooking.id).padStart(3, '0') }}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">ລະຫັດລູກຄ້າ:</span>
                <span class="detail-value">{{ selectedBooking.cus_id }}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">ລະຫັດຜູ້ໃຊ້:</span>
                <span class="detail-value">{{ selectedBooking.User_id }}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">ສະຖານະ:</span>
                <span class="detail-value">
                  <span class="status-badge" :class="getStatusClass(selectedBooking.status)">
                    {{ getStatusText(selectedBooking.status) }}
                  </span>
                </span>
              </div>
            </div>

            <!-- Date Information -->
            <div class="detail-section">
              <h4>ຂໍ້ມູນວັນທີ່</h4>
              <div class="detail-row">
                <span class="detail-label">ວັນທີ່ເຂົ້າ:</span>
                <span class="detail-value">{{ formatDate(selectedBooking.startDate) }}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">ວັນທີ່ອອກ:</span>
                <span class="detail-value">{{ formatDate(selectedBooking.endDate) }}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">ຈໍານວນວັນທີ່ພັກ:</span>
                <span class="detail-value">{{ selectedBooking.total_stay_days || calculateDays(selectedBooking.startDate, selectedBooking.endDate) }} ວັນ</span>
              </div>
            </div>

            <!-- Payment Information -->
            <div class="detail-section">
              <h4>ຂໍ້ມູນການຊໍາລະ</h4>
              <div class="detail-row">
                <span class="detail-label">ຍອດລວມ:</span>
                <span class="detail-value highlight">{{ formatCurrency(selectedBooking.total_price) }}</span>
              </div>
              <div class="detail-row" v-if="selectedBooking.payment_image">
                <span class="detail-label">ຫຼັກຖານການຊໍາລະ:</span>
                <span class="detail-value">
                  <button class="btn btn-sm btn-info" @click="viewPaymentImage(selectedBooking)">
                    ເບິ່ງຮູບການຊໍາລະ
                  </button>
                </span>
              </div>
            </div>

            <!-- Additional Details -->
            <div class="detail-section" v-if="selectedBooking.details && selectedBooking.details.length > 0">
              <h4>ລາຍລະອຽດເພີ່ມເຕີມ</h4>
              <div class="additional-details">
                <pre>{{ JSON.stringify(selectedBooking.details, null, 2) }}</pre>
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

    <!-- Payment Image Modal -->
    <div v-if="showPaymentModal" class="modal-overlay" @click="closePaymentModal">
      <div class="modal image-modal" @click.stop>
        <div class="modal-header">
          <h3>ຮູບການຊໍາລະເງິນ</h3>
          <button class="close-btn" @click="closePaymentModal">✕</button>
        </div>
        <div class="modal-body">
          <img 
            v-if="selectedPaymentImage" 
            :src="selectedPaymentImage" 
            alt="Payment Image" 
            class="payment-image-preview"
          >
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
      error: null,
      searchQuery: '',
      statusFilter: '',
      showDetailsModal: false,
      showPaymentModal: false,
      selectedBooking: null,
      selectedPaymentImage: null,
      bookings: [],
      message: {
        show: false,
        type: 'success',
        text: ''
      }
    }
  },
  
  computed: {
    filteredBookings() {
      let filtered = this.bookings;
      
      // Filter by search query
      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase();
        filtered = filtered.filter(booking => 
          `BK${String(booking.id).padStart(3, '0')}`.toLowerCase().includes(query) ||
          String(booking.cus_id).includes(query) ||
          String(booking.User_id).includes(query)
        );
      }
      
      // Filter by status
      if (this.statusFilter) {
        filtered = filtered.filter(booking => booking.status === this.statusFilter);
      }
      
      return filtered;
    }
  },
  
  mounted() {
    this.loadBookings();
  },
  
  methods: {
    // Load booking data from API
    async loadBookings() {
      this.loading = true;
      this.error = null;
      
      try {
        const response = await fetch('http://localhost:3000/api/bookings');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        
        if (result.success && result.data) {
          this.bookings = result.data;
          console.log('Bookings loaded:', this.bookings);
        } else {
          throw new Error('Invalid response format');
        }
      } catch (error) {
        console.error('Error loading bookings:', error);
        this.error = error.message || 'ບໍ່ສາມາດໂຫຼດຂໍ້ມູນການຈອງໄດ້';
        this.showMessage('ບໍ່ສາມາດໂຫຼດຂໍ້ມູນການຈອງໄດ້', 'error');
      } finally {
        this.loading = false;
      }
    },
    
    // Calculate days between dates
    calculateDays(startDate, endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const diffTime = Math.abs(end - start);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays;
    },
    
    // View booking details
    viewBookingDetails(booking) {
      this.selectedBooking = booking;
      this.showDetailsModal = true;
    },
    
    // View payment image
    viewPaymentImage(booking) {
      this.selectedPaymentImage = booking.payment_image;
      this.showPaymentModal = true;
    },
    
    // Confirm booking
    async confirmBooking(booking) {
      if (confirm(`ທ່ານແນ່ໃຈບໍ່ວ່າຕ້ອງການຢືນຢັນການຈອງ BK${String(booking.id).padStart(3, '0')}?`)) {
        try {
          const response = await fetch(`http://localhost:3000/api/bookings/${booking.id}/approve`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json'
            }
          });
          if (!response.ok) {
            throw new Error('Failed to approve booking');
          }
          booking.status = 'confirmed';
          this.showMessage(`ຢືນຢັນການຈອງ BK${String(booking.id).padStart(3, '0')} ສໍາເລັດ`, 'success');
        } catch (error) {
          this.showMessage('ເກີດຂໍ້ຜິດພາດໃນການຢືນຢັນການຈອງ', 'error');
        }
      }
    },
    
    // Cancel booking
    async cancelBooking(booking) {
      if (confirm(`ທ່ານແນ່ໃຈບໍ່ວ່າຕ້ອງການຍົກເລີກການຈອງ BK${String(booking.id).padStart(3, '0')}?`)) {
        try {
          const response = await fetch(`http://localhost:3000/api/bookings/${booking.id}/reject`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json'
            }
          });
          if (!response.ok) {
            throw new Error('Failed to reject booking');
          }
          booking.status = 'cancelled';
          this.showMessage(`ຍົກເລີກການຈອງ BK${String(booking.id).padStart(3, '0')} ສໍາເລັດ`, 'success');
        } catch (error) {
          this.showMessage('ເກີດຂໍ້ຜິດພາດໃນການຍົກເລີກການຈອງ', 'error');
        }
      }
    },
    
    // Close modals
    closeDetailsModal() {
      this.showDetailsModal = false;
      this.selectedBooking = null;
    },
    
    closePaymentModal() {
      this.showPaymentModal = false;
      this.selectedPaymentImage = null;
    },
    
    // Export bookings
    exportBookings() {
      console.log('Exporting booking data...');
      // Convert bookings to CSV or Excel format
      const csvContent = this.convertToCSV(this.filteredBookings);
      this.downloadCSV(csvContent, 'bookings.csv');
      this.showMessage('ກໍາລັງໂຫຼດຂໍ້ມູນການຈອງ...', 'info');
    },
    
    // Convert data to CSV
    convertToCSV(data) {
      const headers = ['Booking ID', 'Customer ID', 'User ID', 'Start Date', 'End Date', 'Days', 'Total Price', 'Status'];
      const rows = data.map(booking => [
        `BK${String(booking.id).padStart(3, '0')}`,
        booking.cus_id,
        booking.User_id,
        booking.startDate,
        booking.endDate,
        booking.total_stay_days || this.calculateDays(booking.startDate, booking.endDate),
        booking.total_price,
        booking.status
      ]);
      
      const csvContent = [headers, ...rows]
        .map(row => row.join(','))
        .join('\n');
      
      return csvContent;
    },
    
    // Download CSV file
    downloadCSV(content, filename) {
      const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      
      link.setAttribute('href', url);
      link.setAttribute('download', filename);
      link.style.visibility = 'hidden';
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    },
    
    // Print booking
    printBooking() {
      if (this.selectedBooking) {
        window.print();
        this.showMessage('ກໍາລັງພິມຂໍ້ມູນການຈອງ...', 'info');
      }
    },
    
    // Get status class for styling
    getStatusClass(status) {
      const statusMap = {
        'confirmed': 'status-confirmed',
        'pending': 'status-pending',
        'checked_in': 'status-checkin',
        'checked_out': 'status-checkout',
        'cancelled': 'status-cancelled'
      };
      return statusMap[status] || 'status-default';
    },
    
    // Get status text in Lao
    getStatusText(status) {
      const statusTextMap = {
        'confirmed': 'ຢືນຢັນແລ້ວ',
        'pending': 'ກໍາລັງລໍຖ້າ',
        'checked_in': 'ເຊັກອິນແລ້ວ',
        'checked_out': 'ເຊັກເອົາແລ້ວ',
        'cancelled': 'ຍົກເລີກ'
      };
      return statusTextMap[status] || status;
    },
    
    // Format date
    formatDate(date) {
      if (!date) return '-';
      return new Date(date).toLocaleDateString('lo-LA');
    },
    
    // Format currency
    formatCurrency(amount) {
      const numAmount = parseFloat(amount) || 0;
      return new Intl.NumberFormat('lo-LA', {
        style: 'currency',
        currency: 'LAK',
        minimumFractionDigits: 0
      }).format(numAmount);
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

.loading-container,
.error-container {
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

.error-icon {
  font-size: 48px;
  margin-bottom: 20px;
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

.customer-info .customer-id {
  font-weight: 600;
  margin-bottom: 4px;
}

.customer-info .user-id {
  font-size: 12px;
  color: #666;
}

.dates {
  font-size: 13px;
}

.nights {
  font-weight: 600;
  color: #666;
}

.amount .total-amount {
  font-weight: 600;
  color: #28a745;
}

.payment-image .no-image {
  color: #999;
  font-size: 12px;
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

.image-modal {
  max-width: 900px;
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

.additional-details {
  background: white;
  padding: 15px;
  border-radius: 4px;
  border-left: 4px solid #007bff;
}

.additional-details pre {
  margin: 0;
  font-size: 12px;
  overflow-x: auto;
}

.payment-image-preview {
  max-width: 100%;
  height: auto;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
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

/* Print styles */
@media print {
  .page-header button,
  .filters-section,
  .actions,
  .message,
  .modal-footer button {
    display: none !important;
  }
  
  .modal-overlay {
    position: static;
    background: none;
  }
  
  .modal {
    box-shadow: none;
    max-width: 100%;
  }
}
</style>