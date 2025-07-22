<template>
  <v-container fluid class="checkin-management">
    <!-- Page Header -->
    <v-row class="mb-4">
      <v-col cols="12">
        <v-card>
          <v-card-title>
            <h2>ບັນທຶກການແຈ້ງເຂົ້າພັກ</h2>
            <v-spacer></v-spacer>
            <v-btn color="primary" @click="refreshData">
              <v-icon left>mdi-refresh</v-icon>
              ໂຫຼດຂໍ້ມູນໃໝ່
            </v-btn>
          </v-card-title>
        </v-card>
      </v-col>
    </v-row>

    <!-- Search and Filters -->
    <v-row class="mb-4">
      <v-col cols="12">
        <v-card>
          <v-card-text>
            <v-row>
              <v-col cols="12" md="4">
                <v-text-field
                  v-model="searchQuery"
                  label="ຄົ້ນຫາເລກການຈອງ ຫຼື ລະຫັດລູກຄ້າ"
                  prepend-icon="mdi-magnify"
                  clearable
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="3">
                <v-select
                  v-model="statusFilter"
                  :items="statusOptions"
                  label="ສະຖານະ"
                  clearable
                ></v-select>
              </v-col>
              <v-col cols="12" md="3">
                <v-text-field
                  v-model="dateFilter"
                  label="ວັນທີ່ເຂົ້າພັກ"
                  type="date"
                  prepend-icon="mdi-calendar"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="2">
                <v-btn @click="clearFilters" outlined color="grey">
                  <v-icon left>mdi-filter-remove</v-icon>
                  ລ້າງ
                </v-btn>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Check-ins Table -->
    <v-row>
      <v-col cols="12">
        <v-card>
          <v-card-title>
            ລາຍການການຈອງ
            <v-spacer></v-spacer>
            <v-chip :color="getStatsColor('total')" text-color="white">
              ທັງໝົດ: {{ totalBookings }}
            </v-chip>
            <v-chip :color="getStatsColor('pending')" text-color="white" class="ml-2">
              ລໍຖ້າ: {{ pendingCheckIns }}
            </v-chip>
            <v-chip :color="getStatsColor('checked-in')" text-color="white" class="ml-2">
              ເຂົ້າພັກແລ້ວ: {{ checkedInCount }}
            </v-chip>
          </v-card-title>

          <v-data-table
            :headers="headers"
            :items="filteredBookings"
            :loading="loading"
            loading-text="ກຳລັງໂຫຼດຂໍ້ມູນ..."
            no-data-text="ບໍ່ພົບຂໍ້ມູນ"
            :items-per-page="10"
          >
            <!-- Booking Number -->
            <template v-slot:item.bookingNumber="{ item }">
              <v-chip color="info" small>
                #{{ item.bookingNumber }}
              </v-chip>
            </template>

            <!-- Customer ID -->
            <template v-slot:item.customerId="{ item }">
              <div class="customer-info">
                <v-icon small class="mr-1">mdi-account</v-icon>
                ລູກຄ້າ #{{ item.customerId }}
              </div>
            </template>

            <!-- Room Info -->
            <template v-slot:item.roomInfo="{ item }">
              <v-chip color="accent" small>
                <v-icon small left>mdi-bed</v-icon>
                ຫ້ອງ #{{ item.roomInfo }}
              </v-chip>
            </template>

            <!-- Dates -->
            <template v-slot:item.dates="{ item }">
              <div class="dates-info">
                <div><strong>ເຂົ້າ:</strong> {{ formatDate(item.startDate) }}</div>
                <div><strong>ອອກ:</strong> {{ formatDate(item.endDate) }}</div>
                <div v-if="item.actualCheckInTime" class="actual-time mt-1">
                  <v-chip x-small color="success">
                    ເຊັກອິນ: {{ formatDateTime(item.actualCheckInTime) }}
                  </v-chip>
                </div>
              </div>
            </template>

            <!-- Total Price -->
            <template v-slot:item.totalPrice="{ item }">
              <div class="amount-info">
                <div class="total-amount">
                  <strong>{{ formatCurrency(item.totalPrice) }}</strong>
                </div>
                <v-chip x-small color="success">ຈ່າຍແລ້ວ</v-chip>
              </div>
            </template>

            <!-- Status -->
            <template v-slot:item.status="{ item }">
              <v-chip :color="getStatusColor(item.status)" small text-color="white">
                <v-icon small left>{{ getStatusIcon(item.status) }}</v-icon>
                {{ getStatusText(item.status) }}
              </v-chip>
            </template>

            <!-- Actions -->
            <template v-slot:item.actions="{ item }">
              <div class="actions-buttons">
                <v-btn
                  v-if="item.status === 'pending'"
                  color="success"
                  small
                  @click="processCheckIn(item)"
                  :loading="item.processing"
                  class="mr-2"
                >
                  <v-icon small left>mdi-check</v-icon>
                  Check In
                </v-btn>
                <v-btn
                  color="info"
                  small
                  outlined
                  @click="viewDetails(item)"
                >
                  <v-icon small left>mdi-eye</v-icon>
                  ລາຍລະອຽດ
                </v-btn>
              </div>
            </template>
          </v-data-table>
        </v-card>
      </v-col>
    </v-row>

    <!-- Details Dialog -->
    <v-dialog v-model="showDetailsDialog" max-width="800px">
      <v-card v-if="selectedBooking">
        <v-card-title>
          <span class="headline">ລາຍລະອຽດການຈອງ #{{ selectedBooking.bookingNumber }}</span>
          <v-spacer></v-spacer>
          <v-btn icon @click="closeDetailsDialog">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12" md="6">
                <v-card outlined>
                  <v-card-subtitle>ຂໍ້ມູນການຈອງ</v-card-subtitle>
                  <v-card-text>
                    <div class="detail-row">
                      <strong>ເລກຈອງ:</strong> #{{ selectedBooking.bookingNumber }}
                    </div>
                    <div class="detail-row">
                      <strong>ລະຫັດລູກຄ້າ:</strong> #{{ selectedBooking.customerId }}
                    </div>
                    <div class="detail-row">
                      <strong>ຫ້ອງ:</strong> #{{ selectedBooking.roomInfo }}
                    </div>
                    <div class="detail-row">
                      <strong>ວັນທີ່ເຂົ້າ:</strong> {{ formatDate(selectedBooking.startDate) }}
                    </div>
                    <div class="detail-row">
                      <strong>ວັນທີ່ອອກ:</strong> {{ formatDate(selectedBooking.endDate) }}
                    </div>
                  </v-card-text>
                </v-card>
              </v-col>
              <v-col cols="12" md="6">
                <v-card outlined>
                  <v-card-subtitle>ຂໍ້ມູນການຊຳລະ</v-card-subtitle>
                  <v-card-text>
                    <div class="detail-row">
                      <strong>ຍອດເງິນລວມ:</strong> {{ formatCurrency(selectedBooking.totalPrice) }}
                    </div>
                    <div class="detail-row">
                      <strong>ສະຖານະ:</strong>
                      <v-chip :color="getStatusColor(selectedBooking.status)" small text-color="white" class="ml-2">
                        {{ getStatusText(selectedBooking.status) }}
                      </v-chip>
                    </div>
                    <div v-if="selectedBooking.actualCheckInTime" class="detail-row">
                      <strong>ເວລາເຊັກອິນ:</strong> {{ formatDateTime(selectedBooking.actualCheckInTime) }}
                    </div>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="grey" text @click="closeDetailsDialog">
            ປິດ
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Snackbar for messages -->
    <v-snackbar
      v-model="snackbar.show"
      :color="snackbar.color"
      :timeout="5000"
      top
      right
    >
      {{ snackbar.text }}
      <template v-slot:action="{ attrs }">
        <v-btn text v-bind="attrs" @click="snackbar.show = false">
          ປິດ
        </v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>

<script>
export default {
  name: 'CheckInManagement',
  data() {
    return {
      loading: false,
      searchQuery: '',
      statusFilter: '',
      dateFilter: '',
      showDetailsDialog: false,
      selectedBooking: null,
      bookings: [],
      
      statusOptions: [
        { text: 'ລໍຖ້າແຈ້ງເຂົ້າ', value: 'pending' },
        { text: 'ເຂົ້າພັກແລ້ວ', value: 'checked-in' }
      ],

      headers: [
        { text: 'ເລກຈອງ', value: 'bookingNumber', sortable: true },
        { text: 'ລະຫັດລູກຄ້າ', value: 'customerId', sortable: true },
        { text: 'ຫ້ອງ', value: 'roomInfo', sortable: true },
        { text: 'ວັນທີ່ເຂົ້າ-ອອກ', value: 'dates', sortable: false },
        { text: 'ຍອດເງິນ', value: 'totalPrice', sortable: true },
        { text: 'ສະຖານະ', value: 'status', sortable: true },
        { text: 'ການດຳເນີນການ', value: 'actions', sortable: false }
      ],

      snackbar: {
        show: false,
        text: '',
        color: 'success'
      }
    }
  },

  computed: {
    filteredBookings() {
      return this.processedBookings.filter(booking => {
        const matchesSearch = !this.searchQuery || 
          booking.bookingNumber.toString().includes(this.searchQuery) ||
          booking.customerId.toString().includes(this.searchQuery);
        
        const matchesStatus = !this.statusFilter || booking.status === this.statusFilter;
        const matchesDate = !this.dateFilter || booking.startDate === this.dateFilter;
        
        return matchesSearch && matchesStatus && matchesDate;
      });
    },

    processedBookings() {
      const processed = [];
      this.bookings.forEach(booking => {
        booking.details.forEach(detail => {
          processed.push({
            ...booking,
            detailId: detail.id,
            roomInfo: detail.Room_id,
            actualCheckInTime: detail.Check_in_Date,
            status: detail.Check_in_Date ? 'checked-in' : 'pending',
            bookingNumber: booking.id,
            customerId: booking.cus_id,
            totalPrice: booking.total_price,
            processing: false
          });
        });
      });
      return processed;
    },

    totalBookings() {
      return this.processedBookings.length;
    },

    pendingCheckIns() {
      return this.processedBookings.filter(b => b.status === 'pending').length;
    },

    checkedInCount() {
      return this.processedBookings.filter(b => b.status === 'checked-in').length;
    }
  },

  mounted() {
    this.fetchBookings();
  },

  methods: {
    async fetchBookings() {
      this.loading = true;
      try {
        const response = await fetch('http://localhost:3000/api/bookings');
        const result = await response.json();
        
        if (result.success && Array.isArray(result.data)) {
          this.bookings = result.data;
        } else {
          throw new Error('Invalid response format');
        }
        
      } catch (error) {
        console.error('Error fetching bookings:', error);
        this.showMessage('ເກີດຂໍ້ຜິດພາດໃນການໂຫຼດຂໍ້ມູນ', 'error');
      } finally {
        this.loading = false;
      }
    },

    async processCheckIn(booking) {
      if (!confirm(`ຢືນຢັນການເຊັກອິນສຳລັບການຈອງ #${booking.bookingNumber}?`)) {
        return;
      }

      // Set processing state
      const bookingIndex = this.processedBookings.findIndex(b => 
        b.bookingNumber === booking.bookingNumber && b.detailId === booking.detailId
      );
      if (bookingIndex !== -1) {
        this.$set(this.processedBookings[bookingIndex], 'processing', true);
      }

      try {
        const response = await fetch(`http://localhost:3000/api/booking-details/${booking.detailId}/checkin`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            Check_in_Date: new Date().toISOString(),
          }),
        });

        if (response.ok) {
          // Update local state
          const originalBooking = this.bookings.find(b => b.id === booking.bookingNumber);
          if (originalBooking) {
            const detail = originalBooking.details.find(d => d.id === booking.detailId);
            if (detail) {
              this.$set(detail, 'Check_in_Date', new Date().toISOString());
            }
          }

          this.showMessage('ເຊັກອິນສຳເລັດແລ້ວ', 'success');
        } else {
          throw new Error('Check-in failed');
        }
      } catch (error) {
        console.error('Error processing check-in:', error);
        this.showMessage('ເກີດຂໍ້ຜິດພາດໃນການເຊັກອິນ', 'error');
      } finally {
        // Reset processing state
        if (bookingIndex !== -1) {
          this.$set(this.processedBookings[bookingIndex], 'processing', false);
        }
      }
    },

    viewDetails(booking) {
      this.selectedBooking = booking;
      this.showDetailsDialog = true;
    },

    closeDetailsDialog() {
      this.showDetailsDialog = false;
      this.selectedBooking = null;
    },

    clearFilters() {
      this.searchQuery = '';
      this.statusFilter = '';
      this.dateFilter = '';
    },

    refreshData() {
      this.fetchBookings();
    },

    getStatusText(status) {
      const statusMap = {
        'pending': 'ລໍຖ້າແຈ້ງເຂົ້າ',
        'checked-in': 'ເຂົ້າພັກແລ້ວ'
      };
      return statusMap[status] || status;
    },

    getStatusColor(status) {
      const colorMap = {
        'pending': 'orange',
        'checked-in': 'green'
      };
      return colorMap[status] || 'grey';
    },

    getStatusIcon(status) {
      const iconMap = {
        'pending': 'mdi-clock-outline',
        'checked-in': 'mdi-check-circle'
      };
      return iconMap[status] || 'mdi-help-circle';
    },

    getStatsColor(type) {
      const colorMap = {
        'total': 'primary',
        'pending': 'orange',
        'checked-in': 'green'
      };
      return colorMap[type] || 'grey';
    },

    formatDate(date) {
      if (!date) return '-';
      return new Date(date).toLocaleDateString('th-TH');
    },

    formatDateTime(datetime) {
      if (!datetime) return '-';
      return new Date(datetime).toLocaleString('th-TH');
    },

    formatCurrency(amount) {
      if (!amount) return '0 ₭';
      const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
      return new Intl.NumberFormat('lo-LA').format(numAmount) + ' ₭';
    },

    showMessage(text, type = 'success') {
      this.snackbar = {
        show: true,
        text: text,
        color: type === 'error' ? 'red' : type === 'info' ? 'blue' : 'green'
      };
    }
  }
}
</script>

<style scoped>
.checkin-management {
  padding: 20px;
  background-color: #f8f9fa;
  min-height: 100vh;
}
/* Buttons */
.btn {
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.3s ease;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 5px;
}

.btn-primary {
  background-color: #3498db;
  color: white;
}

.btn-primary:hover {
  background-color: #2980b9;
  transform: translateY(-1px);
}

.btn-outline {
  background-color: transparent;
  color: #6c757d;
  border: 1px solid #dee2e6;
}

.btn-outline:hover {
  background-color: #6c757d;
  color: white;
}

.btn-success {
  background-color: #27ae60;
  color: white;
}

.btn-success:hover {
  background-color: #229954;
}

.btn-info {
  background-color: #17a2b8;
  color: white;
}

.btn-info:hover {
  background-color: #138496;
}

.btn-danger {
  background-color: #e74c3c;
  color: white;
}

.btn-danger:hover {
  background-color: #c0392b;
}

.btn-sm {
  padding: 4px 8px;
  font-size: 12px;
  margin-right: 4px;
}
/* Page Header */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  padding: 20px 0;
}

.page-header h2 {
  color: #2c3e50;
  font-size: 28px;
  font-weight: 600;
  margin: 0;
}

/* Search and Filters */
.filters-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
  flex-wrap: wrap;
  gap: 15px;
}

.search-box {
  flex: 1;
  max-width: 400px;
}

.search-input {
  width: 100%;
  padding: 10px 15px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
}

.search-input:focus {
  outline: none;
  border-color: #3498db;
  box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.2);
}

.filter-controls {
  display: flex;
  gap: 10px;
  align-items: center;
}

.filter-select {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
  background-color: white;
}

/* Statistics */
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

/* Table */
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

.staff-table tr:hover {
  background-color: #f8f9fa;
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

.dates .actual-time {
  font-size: 11px;
  color: #17a2b8;
  background-color: #d1ecf1;
  padding: 2px 4px;
  border-radius: 3px;
  margin-top: 2px;
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

.amount .remaining-amount {
  font-size: 11px;
  color: #dc3545;
  margin-top: 2px;
  font-weight: 500;
}

/* Status Badges */
.status-badge {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
}

.status-pending { 
  background: #fff3cd; 
  color: #856404; 
}

.status-checkin { 
  background: #d1ecf1; 
  color: #0c5460; 
}

.status-checkout { 
  background: #e2e3e5; 
  color: #383d41; 
}

.actions {
  white-space: nowrap;
}

/* Buttons */
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
  background: #218838;
}

.btn-warning {
  background: #ffc107;
  color: #212529;
}

.btn-warning:hover {
  background: #e0a800;
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.modal {
  background: white;
  border-radius: 10px;
  width: 100%;
  max-width: 700px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 10px 30px rgba(0,0,0,0.3);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #eee;
}

.modal-header h3 {
  margin: 0;
  color: #2c3e50;
  font-size: 20px;
}

.close-btn {
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  color: #6c757d;
  padding: 5px;
  border-radius: 3px;
}

.close-btn:hover {
  background-color: #f8f9fa;
}

.modal-body {
  padding: 20px;
}

.modal-footer {
  padding: 20px;
  border-top: 1px solid #eee;
  text-align: right;
}

/* Form */
.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: 500;
  color: #2c3e50;
}

.form-input {
  width: 100%;
  padding: 10px 15px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
  transition: border-color 0.3s ease;
}

.form-input:focus {
  outline: none;
  border-color: #3498db;
  box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.2);
}

.form-actions {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  margin-top: 20px;
}

/* Detail Sections */
.detail-section {
  margin-bottom: 25px;
}

.detail-section h4 {
  color: #2c3e50;
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 15px;
  padding-bottom: 5px;
  border-bottom: 2px solid #3498db;
}

.detail-row {
  display: flex;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid #f8f9fa;
  gap: 10px;
}

.detail-row:last-child {
  border-bottom: none;
}

.detail-label {
  font-weight: 600;
  color: #2c3e50;
  min-width: 150px;
  flex-shrink: 0;
}

.detail-value {
  color: #495057;
  text-align: left;
  flex: 1;
}

/* Messages */
.message {
  position: fixed;
  top: 20px;
  right: 20px;
  padding: 15px 20px;
  border-radius: 6px;
  color: white;
  font-weight: 500;
  z-index: 1100;
  min-width: 250px;
  animation: slideIn 0.3s ease;
}

.message.success {
  background-color: #27ae60;
}

.message.error {
  background-color: #e74c3c;
}

.message.info {
  background-color: #3498db;
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

/* Payment Status Badge */
.payment-status-badge {
  padding: 3px 8px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 500;
}

.payment-status-badge.paid {
  background-color: #d4edda;
  color: #155724;
}

.payment-status-badge.partial {
  background-color: #fff3cd;
  color: #856404;
}

.payment-status-badge.unpaid {
  background-color: #f8d7da;
  color: #721c24;
}

.text-danger {
  color: #dc3545 !important;
  font-weight: 600;
}

/* Responsive */
@media (max-width: 768px) {
  .checkin-management {
    padding: 15px;
  }

  .page-header {
    flex-direction: column;
    gap: 15px;
    align-items: stretch;
  }

  .page-header h2 {
    text-align: center;
  }

  .filters-section {
    flex-direction: column;
    align-items: stretch;
  }

  .filter-controls {
    justify-content: center;
    flex-wrap: wrap;
  }

  .checkin-stats {
    grid-template-columns: 1fr;
  }

  .form-row {
    grid-template-columns: 1fr;
  }

  .modal {
    margin: 10px;
    max-width: none;
  }

  .checkin-table {
    font-size: 12px;
  }

  .checkin-table th,
  .checkin-table td {
    padding: 8px;
  }

  .btn-sm {
    padding: 2px 6px;
    font-size: 10px;
    margin: 1px;
  }

  .actions {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }
}

@media (max-width: 480px) {
  .checkin-table th:nth-child(4),
  .checkin-table td:nth-child(4),
  .checkin-table th:nth-child(5),
  .checkin-table td:nth-child(5),
  .checkin-table th:nth-child(6),
  .checkin-table td:nth-child(6) {
    display: none;
  }
}
</style>
