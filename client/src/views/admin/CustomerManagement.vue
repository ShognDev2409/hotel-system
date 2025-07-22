<template>
  <div class="customer-management">
    <!-- Page Header -->
    <div class="page-header">
      <h2>ຈັດການຂໍ້ມູນລູກຄ້າ</h2>
      <button class="btn btn-primary" @click="openAddModal">
        ເພີ່ມລູກຄ້າໃໝ່
      </button>
    </div>

    <!-- Search and Filters -->
    <div class="filters-section">
      <div class="search-box">
        <input 
          type="text" 
          v-model="searchQuery" 
          placeholder="ຄົ້ນຫາລູກຄ້າ..."
          class="search-input"
        >
      </div>
      
      <div class="filter-controls">
        <select v-model="statusFilter" class="filter-select">
          <option value="">ທຸກສະຖານະ</option>
          <option value="ໃຊ້ງານ">ໃຊ້ງານ</option>
          <option value="ລໍຖ້າອະນຸມັດ">ລໍຖ້າອະນຸມັດ</option>
          <option value="ລະງັບ">ລະງັບ</option>
        </select>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="loading-container">
      <div class="loading-spinner"></div>
      <p>ກໍາລັງໂຫຼດຂໍ້ມູນລູກຄ້າ...</p>
    </div>

    <!-- Customers Table -->
    <div v-if="!loading && filteredCustomers.length > 0" class="table-section">
      <div class="table-container">
        <table class="customers-table">
          <thead>
            <tr>
              <th>ລະຫັດລູກຄ້າ</th>
              <th>ຊື່ ແລະ ນາມສະກຸນ</th>
              <th>ເບີໂທ</th>
              <th>ອີເມວ</th>
              <th>ທີ່ຢູ່</th>
              <th>ສະຖານະ</th>
              <th>ດຳເນີນການ</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="customer in filteredCustomers" :key="customer.id">
              <td class="customer-id">{{ customer.id }}</td>
              <td>
                <div class="name-container">
                  <div class="full-name">{{ customer.firstName }} {{ customer.lastName }}</div>
                  <div class="reg-date">ລົງທະບຽນ: {{ formatDate(customer.registrationDate) }}</div>
                </div>
              </td>
              <td>
                <div>{{ customer.phone }}</div>
              </td>
              <td>{{ customer.email }}</td>
              <td>{{ customer.location }}</td>
              <td>
                <span class="status-badge" :class="getStatusClass(customer.status)">
                  {{ customer.status }}
                </span>
              </td>
              <td class="actions">
                <button class="btn btn-info btn-sm" @click="viewCustomerDetails(customer)">
                  ເບິ່ງ
                </button>
                <button class="btn btn-success btn-sm" @click="editCustomer(customer)">
                  ແກ້ໄຂ
                </button>
                <button class="btn btn-danger btn-sm" @click="deleteCustomer(customer.id)">
                  ລຶບ
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="!loading && filteredCustomers.length === 0" class="empty-state">
      <div class="empty-icon">👥</div>
      <h3>ບໍ່ພົບຂໍ້ມູນລູກຄ້າ</h3>
      <p>ຍັງບໍ່ມີລູກຄ້າໃນລະບົບ ຫຼື ບໍ່ພົບຜົນການຄົ້ນຫາ</p>
      <button class="btn btn-primary" @click="openAddModal">
        ເພີ່ມລູກຄ້າໃໝ່
      </button>
    </div>

    <!-- Add/Edit Customer Modal -->
    <div v-if="showModal" class="modal-overlay" @click="closeModal">
      <div class="modal" @click.stop>
        <div class="modal-header">
          <h3>{{ isEditing ? 'ແກ້ໄຂຂໍ້ມູນລູກຄ້າ' : 'ເພີ່ມລູກຄ້າໃໝ່' }}</h3>
          <button class="close-btn" @click="closeModal">&times;</button>
        </div>
        
        <div class="modal-body">
          <form @submit.prevent="saveCustomer">
            <div class="form-row">
              <div class="form-group">
                <label>ຊື່</label>
                <input v-model="form.firstName" type="text" class="form-input" required>
              </div>
              <div class="form-group">
                <label>ນາມສະກຸນ</label>
                <input v-model="form.lastName" type="text" class="form-input" required>
              </div>
            </div>
            
            <div class="form-row">
              <div class="form-group">
                <label>ເບີໂທຫຼັກ</label>
                <input v-model="form.phone" type="tel" class="form-input" required>
              </div>
            </div>
            
            <div class="form-group">
              <label>ອີເມວ</label>
              <input v-model="form.email" type="email" class="form-input" required>
            </div>
            
            <div class="form-group">
              <label>ທີ່ຢູ່</label>
              <input v-model="form.location" type="text" class="form-input" required>
            </div>
            
            <div v-if="isEditing" class="form-group">
              <label>ສະຖານະ</label>
              <select v-model="form.status" class="form-input">
                <option value="ໃຊ້ງານ">ໃຊ້ງານ</option>
                <option value="ລໍຖ້າອະນຸມັດ">ລໍຖ້າອະນຸມັດ</option>
                <option value="ລະງັບ">ລະງັບ</option>
              </select>
            </div>
          </form>
        </div>
        
        <div class="modal-footer">
          <button class="btn btn-outline" @click="closeModal">ຍົກເລີກ</button>
          <button class="btn btn-success" @click="saveCustomer" :disabled="saving">
            {{ saving ? 'ກໍາລັງບັນທຶກ...' : 'ບັນທຶກ' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Customer Details Modal -->
    <div v-if="showDetailsModal" class="modal-overlay" @click="closeDetailsModal">
      <div class="modal" @click.stop>
        <div class="modal-header">
          <h3>ລາຍລະອຽດລູກຄ້າ</h3>
          <button class="close-btn" @click="closeDetailsModal">&times;</button>
        </div>
        
        <div class="modal-body" v-if="selectedCustomer">
          <div class="detail-row">
            <span class="detail-label">ລະຫັດລູກຄ້າ:</span>
            <span class="detail-value">{{ selectedCustomer.id }}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">ຊື່ ແລະ ນາມສະກຸນ:</span>
            <span class="detail-value">{{ selectedCustomer.firstName }} {{ selectedCustomer.lastName }}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">ເບີໂທຫຼັກ:</span>
            <span class="detail-value">{{ selectedCustomer.phone }}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">ອີເມວ:</span>
            <span class="detail-value">{{ selectedCustomer.email }}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">ທີ່ຢູ່:</span>
            <span class="detail-value">{{ selectedCustomer.location }}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">ສະຖານະ:</span>
            <span class="detail-value">
              <span class="status-badge" :class="getStatusClass(selectedCustomer.status)">
                {{ selectedCustomer.status }}
              </span>
            </span>
          </div>
          <div class="detail-row">
            <span class="detail-label">ວັນທີ່ລົງທະບຽນ:</span>
            <span class="detail-value">{{ formatDate(selectedCustomer.registrationDate) }}</span>
          </div>
        </div>
        
        <div class="modal-footer">
          <button class="btn btn-outline" @click="closeDetailsModal">ປິດ</button>
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
import customerService from '@/services/customerApi'

export default {
  name: 'CustomerManagement',
  data() {
    return {
      customers: [],
      filteredCustomers: [],
      loading: true,
      searchQuery: '',
      statusFilter: '',
      showModal: false,
      showDetailsModal: false,
      isEditing: false,
      saving: false,
      selectedCustomer: null,
      message: { 
        show: false, 
        text: '', 
        type: '' 
      },
      form: {
        firstName: '',
        lastName: '',
        phone: '',
        email: '',
        location: '',
        status: 'ໃຊ້ງານ',
        gender: 'M',
        birthday: ''
      }
    }
  },
  computed: {
    // API Base URL
    API_BASE() {
      return 'http://localhost:3000/api';
    }
  },
  watch: {
    // Watch for changes in search and filter
    searchQuery() {
      this.filterCustomers();
    },
    statusFilter() {
      this.filterCustomers();
    },
    customers() {
      this.filterCustomers();
    }
  },
  mounted() {
    this.fetchCustomers();
  },
  methods: {
    // Fetch customers from API
    async fetchCustomers() {
      try {
        this.loading = true;
        const response = await fetch(`${this.API_BASE}/customerlist`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch customers');
        }
        
        const data = await response.json();
        
        // Map API data to component format
        this.customers = data.map(customer => ({
          id: customer.c_id,
          firstName: customer.name,
          lastName: customer.last_name,
          phone: customer.tel,
          email: customer.email,
          location: customer.address,
          gender: customer.gender,
          birthday: customer.birthday,
          status: 'ໃຊ້ງານ', // Default status since API doesn't provide it
          registrationDate: new Date().toISOString() // Default since API doesn't provide it
        }));
        
      } catch (error) {
        console.error('Error fetching customers:', error);
        this.showMessage('ເກີດຂໍ້ຜິດພາດໃນການໂຫຼດຂໍ້ມູນລູກຄ້າ', 'error');
      } finally {
        this.loading = false;
      }
    },

    // Add new customer
    async addCustomer(customerData) {
      try {
        this.saving = true;
        
        const payload = {
          name: customerData.firstName,
          last_name: customerData.lastName,
          gender: customerData.gender,
          birthday: customerData.birthday || '1990-01-01',
          tel: customerData.phone,
          email: customerData.email,
          address: customerData.location,
          password: 'defaultpassword' // You may want to add password field to form
        };

        const response = await fetch(`${this.API_BASE}/register`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          throw new Error('Failed to add customer');
        }

        this.showMessage('ເພີ່ມລູກຄ້າສໍາເລັດແລ້ວ', 'success');
        await this.fetchCustomers(); // Refresh the list
        this.closeModal();
        
      } catch (error) {
        console.error('Error adding customer:', error);
        this.showMessage('ເກີດຂໍ້ຜິດພາດໃນການເພີ່ມລູກຄ້າ', 'error');
      } finally {
        this.saving = false;
      }
    },

    // Update customer
    async updateCustomer(customerId, customerData) {
      try {
        this.saving = true;
        
        const payload = {
          name: customerData.firstName,
          last_name: customerData.lastName,
          gender: customerData.gender,
          birthday: customerData.birthday,
          tel: customerData.phone,
          email: customerData.email,
          address: customerData.location
        };

        const response = await fetch(`${this.API_BASE}/customer/${customerId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          throw new Error('Failed to update customer');
        }

        this.showMessage('ອັບເດດຂໍ້ມູນລູກຄ້າສໍາເລັດແລ້ວ', 'success');
        await this.fetchCustomers(); // Refresh the list
        this.closeModal();
        
      } catch (error) {
        console.error('Error updating customer:', error);
        this.showMessage('ເກີດຂໍ້ຜິດພາດໃນການອັບເດດຂໍ້ມູນ', 'error');
      } finally {
        this.saving = false;
      }
    },

    // Handle form submission
    saveCustomer() {
      // Basic validation
      if (!this.form.firstName || !this.form.lastName || !this.form.email || !this.form.phone || !this.form.location) {
        this.showMessage('ກະລຸນາຕື່ມຂໍ້ມູນໃຫ້ຄົບຖ້ວນ', 'error');
        return;
      }

      if (this.isEditing && this.selectedCustomer) {
        this.updateCustomer(this.selectedCustomer.id, this.form);
      } else {
        this.addCustomer(this.form);
      }
    },

    // Filter customers based on search and status
    filterCustomers() {
      let filtered = this.customers;
      
      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase();
        filtered = filtered.filter(customer =>
          customer.firstName.toLowerCase().includes(query) ||
          customer.lastName.toLowerCase().includes(query) ||
          customer.email.toLowerCase().includes(query) ||
          customer.phone.includes(query)
        );
      }
      
      if (this.statusFilter) {
        filtered = filtered.filter(customer => customer.status === this.statusFilter);
      }
      
      this.filteredCustomers = filtered;
    },

    // Show message
    showMessage(text, type) {
      this.message = { show: true, text, type };
      setTimeout(() => {
        this.message = { show: false, text: '', type: '' };
      }, 3000);
    },

    // Modal handlers
    openAddModal() {
      this.form = {
        firstName: '',
        lastName: '',
        phone: '',
        email: '',
        location: '',
        status: 'ໃຊ້ງານ',
        gender: 'M',
        birthday: ''
      };
      this.isEditing = false;
      this.selectedCustomer = null;
      this.showModal = true;
    },

    editCustomer(customer) {
      this.form = {
        firstName: customer.firstName,
        lastName: customer.lastName,
        phone: customer.phone,
        email: customer.email,
        location: customer.location,
        status: customer.status,
        gender: customer.gender,
        birthday: customer.birthday ? customer.birthday.split('T')[0] : ''
      };
      this.isEditing = true;
      this.selectedCustomer = customer;
      this.showModal = true;
    },

    closeModal() {
      this.showModal = false;
      this.selectedCustomer = null;
      this.saving = false;
    },

    viewCustomerDetails(customer) {
      this.selectedCustomer = customer;
      this.showDetailsModal = true;
    },

    closeDetailsModal() {
      this.showDetailsModal = false;
      this.selectedCustomer = null;
    },

    async deleteCustomer(customerId) {
      if (confirm('ທ່ານແນ່ໃຈບໍ່ວ່າຕ້ອງການລຶບລູກຄ້ານີ້?')) {
        // Note: You'll need to implement DELETE endpoint in your API
        // For now, just show a message
        this.showMessage('ຟີເຈີລຶບຍັງບໍ່ພ້ອມໃຊ້ງານ', 'error');
        
        // When you have DELETE endpoint, uncomment and modify this:
        
        try {
          const response = await fetch(`${this.API_BASE}/customer/${customerId}`, {
            method: 'DELETE',
          });
          
          if (!response.ok) {
            throw new Error('Failed to delete customer');
          }
          
          this.showMessage('ລຶບລູກຄ້າສໍາເລັດແລ້ວ', 'success');
          await this.fetchCustomers();
          
        } catch (error) {
          console.error('Error deleting customer:', error);
          this.showMessage('ເກີດຂໍ້ຜິດພາດໃນການລຶບລູກຄ້າ', 'error');
        }
        
      }
    },

    // Utility functions
    formatDate(dateString) {
      if (!dateString) return '-';
      const date = new Date(dateString);
      return date.toLocaleDateString('lo-LA');
    },

    getStatusClass(status) {
      switch (status) {
        case 'ໃຊ້ງານ': return 'status-active';
        case 'ລໍຖ້າອະນຸມັດ': return 'status-pending';
        case 'ລະງັບ': return 'status-suspended';
        default: return 'status-active';
      }
    }
  }
}
</script>

<style scoped>
.customer-management {
  padding: 20px;
  background-color: #f8f9fa;
  min-height: 100vh;
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

/* Loading */
.loading-container {
  text-align: center;
  padding: 60px 20px;
}

.loading-spinner {
  width: 50px;
  height: 50px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3498db;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 20px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Statistics */
.customer-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.stat-item {
  background: white;
  padding: 25px;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  text-align: center;
  position: relative;
  transition: transform 0.3s ease;
}

.stat-item:hover {
  transform: translateY(-3px);
}

.stat-number {
  font-size: 32px;
  font-weight: bold;
  color: #2c3e50;
  margin-bottom: 8px;
}

.stat-label {
  color: #7f8c8d;
  font-size: 14px;
  font-weight: 500;
}

.stat-color {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  border-radius: 10px 10px 0 0;
}

.stat-color.total { background: linear-gradient(90deg, #3498db, #2980b9); }
.stat-color.active { background: linear-gradient(90deg, #27ae60, #229954); }
.stat-color.pending { background: linear-gradient(90deg, #f39c12, #e67e22); }
.stat-color.suspended { background: linear-gradient(90deg, #e74c3c, #c0392b); }

/* Table */
.table-section {
  background: white;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  overflow: hidden;
}

.table-container {
  overflow-x: auto;
}

.customers-table {
  width: 100%;
  border-collapse: collapse;
}

.customers-table th,
.customers-table td {
  padding: 15px;
  text-align: left;
  border-bottom: 1px solid #eee;
}

.customers-table th {
  background-color: #2f70b6;
  font-weight: 600;
  color: white;
  border: 1px solid #094b91;
  position: sticky;
  top: 0;
  z-index: 10;
}

.customers-table tr:hover {
  background-color: #f8f9fa;
}

.customer-id {
  font-family: monospace;
  font-weight: bold;
  color: #6c757d;
}

.name-container {
  display: flex;
  flex-direction: column;
}

.full-name {
  font-weight: 600;
  color: #2c3e50;
}

.reg-date {
  font-size: 12px;
  color: #6c757d;
  margin-top: 2px;
}

.secondary-phone {
  font-size: 12px;
  color: #6c757d;
  margin-top: 2px;
}

.actions {
  white-space: nowrap;
}

/* Status Badges */
.status-badge {
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

.status-active {
  background-color: #d4edda;
  color: #155724;
}

.status-pending {
  background-color: #fff3cd;
  color: #856404;
}

.status-suspended {
  background-color: #f8d7da;
  color: #721c24;
}

.status-default {
  background-color: #e2e3e5;
  color: #383d41;
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 60px 20px;
  background: white;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.empty-icon {
  font-size: 64px;
  margin-bottom: 20px;
  opacity: 0.5;
}

.empty-state h3 {
  color: #2c3e50;
  margin-bottom: 10px;
}

.empty-state p {
  color: #7f8c8d;
  margin-bottom: 20px;
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
  max-width: 600px;
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
  box-sizing: border-box;
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

/* Customer Details */
.detail-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid #f8f9fa;
}

.detail-row:last-child {
  border-bottom: none;
}

.detail-label {
  font-weight: 600;
  color: #2c3e50;
  min-width: 120px;
}

.detail-value {
  color: #495057;
  text-align: right;
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

/* Responsive */
@media (max-width: 768px) {
  .customer-management {
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
  }

  .customer-stats {
    grid-template-columns: 1fr;
  }

  .form-row {
    grid-template-columns: 1fr;
  }

  .modal {
    margin: 10px;
    max-width: none;
  }

  .customers-table {
    font-size: 12px;
  }

  .customers-table th,
  .customers-table td {
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
  .customers-table th:nth-child(3),
  .customers-table td:nth-child(3),
  .customers-table th:nth-child(5),
  .customers-table td:nth-child(5) {
    display: none;
  }
}
</style>