<!-- src/views/admin/RoomManagement.vue -->
<template>
  <div class="room-management">
    <!-- Page Header -->
    <div class="page-header">
      <h2>ຈັດການຂໍ້ມູນຫ້ອງ</h2>
      <button class="btn btn-primary" @click="showAddModal = true">
        ເພີ່ມຫ້ອງໃໝ່
      </button>
    </div>

    <!-- Search and Filters -->
    <div class="filters-section">
      <div class="search-box">
        <input 
          type="text" 
          v-model="searchQuery" 
          placeholder="ຄົ້ນຫາເລກຫ້ອງ..."
          class="search-input"
        >
      </div>
      <div class="filter-controls">
        <select v-model="statusFilter" class="filter-select">
          <option value="">ທຸກສະຖານະ</option>
          <option value="available">ວ່າງ</option>
          <option value="occupied">ຖືກຈອງ</option>
          <option value="maintenance">ສ້ອມແປງ</option>
        </select>
        <select v-model="typeFilter" class="filter-select">
          <option value="">ທຸກປະເພດ</option>
          <option v-for="type in roomTypes" :key="type" :value="type">
            {{ type }}
          </option>
        </select>
      </div>
    </div>

    <!-- Room Statistics -->
    <div class="room-stats">
      <div class="stat-item">
        <div class="stat-number">{{ roomStats.availableRooms || 0 }}</div>
        <div class="stat-label">ຫ້ອງວ່າງ</div>
      </div>
      <div class="stat-item">
        <div class="stat-number">{{ roomStats.occupiedRooms || 0 }}</div>
        <div class="stat-label">ຫ້ອງຖືກຈອງ</div>
      </div>
      <div class="stat-item">
        <div class="stat-number">{{ roomStats.maintenanceRooms || 0 }}</div>
        <div class="stat-label">ຫ້ອງສ້ອມແປງ</div>
      </div>
      <div class="stat-item">
        <div class="stat-number">{{ roomStats.totalRooms || 0 }}</div>
        <div class="stat-label">ຫ້ອງທັງໝົດ</div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="loading-state">
      <div class="spinner"></div>
      <p>ກຳລັງໂຫລດຂໍ້ມູນ...</p>
    </div>

    <!-- Rooms Table -->
    <div v-else class="table-section">
      <div class="table-container">
        <table class="rooms-table">
          <thead>
            <tr>
              <th>ເລກຫ້ອງ</th>
              <th>ປະເພດຫ້ອງ</th>
              <th>ຊັ້ນ</th>
              <th>ຄວາມຈຸ</th>
              <th>ລາຄາ</th>
              <th>ສະຖານະ</th>
              <th>ການດໍາເນີນການ</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="room in filteredRooms" :key="room.id">
              <td class="room-number">{{ room.roomNumber }}</td>
              <td>{{ room.type }}</td>
              <td>{{ room.floor }}</td>
              <td>{{ room.capacity }} ຄົນ</td>
              <td class="price">{{ formatPrice(room.price) }}</td>
              <td>
                <span class="status-badge" :class="room.status">
                  {{ getStatusText(room.status) }}
                </span>
              </td>
              <td class="actions">
                <button class="btn btn-sm btn-outline" @click="editRoom(room)">
                  ແກ້ໄຂ
                </button>
                <button class="btn btn-sm btn-danger" @click="deleteRoom(room.id)">
                  ລຶບ
                </button>
              </td>
            </tr>
          </tbody>
        </table>
        
        <!-- Empty State -->
        <div v-if="filteredRooms.length === 0" class="empty-state">
          <p>ບໍ່ພົບຂໍ້ມູນຫ້ອງ</p>
        </div>
      </div>
    </div>

    <!-- Add/Edit Modal -->
    <div v-if="showAddModal || showEditModal" class="modal-overlay" @click="closeModals">
      <div class="modal" @click.stop>
        <div class="modal-header">
          <h3>{{ showAddModal ? 'ເພີ່ມຫ້ອງໃໝ່' : 'ແກ້ໄຂຂໍ້ມູນຫ້ອງ' }}</h3>
          <button class="close-btn" @click="closeModals">✕</button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="saveRoom">
            <div class="form-row">
              <div class="form-group">
                <label>ເລກຫ້ອງ *</label>
                <input 
                  type="text" 
                  v-model="roomForm.roomNumber" 
                  required 
                  class="form-input"
                  placeholder="ເຊັ່ນ: 101"
                >
              </div>
              <div class="form-group">
                <label>ປະເພດຫ້ອງ *</label>
                <select v-model="roomForm.type" required class="form-input">
                  <option value="">ເລືອກປະເພດຫ້ອງ</option>
                  <option v-for="type in availableRoomTypes" :key="type.id" :value="type.name">
                    {{ type.name }}
                  </option>
                </select>
              </div>
            </div>
     
            <div class="form-row">
              <div class="form-group">
                <label>ລາຄາ (ກີບ) *</label>
                <input 
                  type="number" 
                  v-model="roomForm.price" 
                  required 
                  class="form-input"
                  min="0"
                  step="1000"
                >
              </div>
              <div class="form-group">
                <label>ສະຖານະ *</label>
                <select v-model="roomForm.status" required class="form-input">
                  <option value="available">ວ່າງ</option>
                  <option value="occupied">ຖືກຈອງ</option>
                  <option value="maintenance">ສ້ອມແປງ</option>
                </select>
              </div>
            </div>
            
            <div class="form-actions">
              <button type="button" class="btn btn-outline" @click="closeModals">
                ຍົກເລີກ
              </button>
              <button type="submit" class="btn btn-primary" :disabled="saving">
                {{ saving ? 'ກຳລັງບັນທຶກ...' : (showAddModal ? 'ເພີ່ມຫ້ອງ' : 'ບັນທຶກການແກ້ໄຂ') }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import roomService from '@/services/roomService';

export default {
  name: 'RoomManagement',
  data() {
    return {
      loading: true,
      saving: false,
      searchQuery: '',
      statusFilter: '',
      typeFilter: '',
      showAddModal: false,
      showEditModal: false,
      roomForm: {
        id: null,
        roomNumber: '',
        type: '',
        price: '',
        status: 'available'
      },
      rooms: [],
      roomStats: {},
      availableRoomTypes: []
    }
  },
  computed: {
    filteredRooms() {
      let filtered = this.rooms;
      
      if (this.searchQuery) {
        filtered = filtered.filter(room => 
          room.roomNumber.toLowerCase().includes(this.searchQuery.toLowerCase())
        );
      }
      
      if (this.statusFilter) {
        filtered = filtered.filter(room => room.status === this.statusFilter);
      }
      
      if (this.typeFilter) {
        filtered = filtered.filter(room => room.type === this.typeFilter);
      }
      
      return filtered;
    },
    roomTypes() {
      return [...new Set(this.rooms.map(room => room.type))];
    }
  },
  async mounted() {
    await this.fetchRooms();
    await this.fetchRoomStats();
    await this.fetchRoomTypes();
  },
  methods: {
    async fetchRooms() {
      try {
        this.loading = true;
        const response = await roomService.getRooms();
        
        if (response.success) {
          this.rooms = response.data;
        }
      } catch (error) {
        console.error('Error fetching rooms:', error);
        this.$toast.error('ເກີດຂໍ້ຜິດພາດໃນການດຶງຂໍ້ມູນຫ້ອງ');
      } finally {
        this.loading = false;
      }
    },
    
    async fetchRoomStats() {
      try {
        const response = await roomService.getRoomStats();
        
        if (response.success) {
          this.roomStats = response.data;
        }
      } catch (error) {
        console.error('Error fetching room stats:', error);
      }
    },
    
    async fetchRoomTypes() {
      try {
        const response = await roomService.getRoomTypes();
        
        if (response.success) {
          this.availableRoomTypes = response.data;
        }
      } catch (error) {
        console.error('Error fetching room types:', error);
      }
    },
    
    formatPrice(price) {
      return new Intl.NumberFormat('lo-LA').format(price) + ' ກີບ';
    },
    
    getStatusText(status) {
      const statusMap = {
        'available': 'ວ່າງ',
        'occupied': 'ຖືກຈອງ',
        'maintenance': 'ສ້ອມແປງ'
      };
      return statusMap[status] || status;
    },
    
    editRoom(room) {
      this.roomForm = { ...room };
      this.showEditModal = true;
    },
    
    async deleteRoom(roomId) {
      if (confirm('ທ່ານແນ່ໃຈບໍ່ວ່າຕ້ອງການລຶບຫ້ອງນີ້?')) {
        try {
          const response = await roomService.deleteRoom(roomId);
          
          if (response.success) {
            this.$toast.success('ລຶບຫ້ອງສໍາເລັດແລ້ວ');
            await this.fetchRooms();
            await this.fetchRoomStats();
          }
        } catch (error) {
          console.error('Error deleting room:', error);
          this.$toast.error(error.response?.data?.message || 'ເກີດຂໍ້ຜິດພາດໃນການລຶບຫ້ອງ');
        }
      }
    },
    
    async saveRoom() {
      try {
        this.saving = true;
        
        const roomData = {
          roomNumber: this.roomForm.roomNumber,
          type: this.roomForm.type,
          price: parseInt(this.roomForm.price),
          status: this.roomForm.status
        };
        
        let response;
        if (this.showAddModal) {
          // Add new room
          response = await roomService.createRoom(roomData);
          this.$toast.success('ເພີ່ມຫ້ອງໃໝ່ສໍາເລັດແລ້ວ');
        } else {
          // Edit existing room
          response = await roomService.updateRoom(this.roomForm.id, roomData);
          this.$toast.success('ແກ້ໄຂຂໍ້ມູນຫ້ອງສໍາເລັດແລ້ວ');
        }
        
        if (response.success) {
          await this.fetchRooms();
          await this.fetchRoomStats();
          this.closeModals();
        }
      } catch (error) {
        console.error('Error saving room:', error);
        this.$toast.error(error.response?.data?.message || 'ເກີດຂໍ້ຜິດພາດໃນການບັນທຶກຂໍ້ມູນ');
      } finally {
        this.saving = false;
      }
    },
    
    closeModals() {
      this.showAddModal = false;
      this.showEditModal = false;
      this.roomForm = {
        id: null,
        roomNumber: '',
        type: '',
        price: '',
        status: 'available'
      };
    }
  }
}
</script>

<style scoped>
.room-management {
  max-width: 1400px;
  margin: 0 auto;
}

.loading-state {
  text-align: center;
  padding: 40px;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 20px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.empty-state {
  text-align: center;
  padding: 40px;
  color: #6b7280;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.page-header h2 {
  color: #1f2937;
  font-size: 1.8rem;
  font-weight: 600;
  margin: 0;
}

.filters-section {
  display: flex;
  gap: 20px;
  margin-bottom: 25px;
  align-items: center;
}

.search-box {
  flex: 1;
  max-width: 400px;
}

.search-input {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 0.95rem;
}

.filter-controls {
  display: flex;
  gap: 12px;
}

.filter-select {
  padding: 12px 16px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 0.95rem;
  min-width: 140px;
}

.room-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.stat-item {
  background: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  text-align: center;
  position: relative;
  overflow: hidden;
}

.stat-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
}

.stat-item:nth-child(1)::before { background: #10b981; }
.stat-item:nth-child(2)::before { background: #ef4444; }
.stat-item:nth-child(3)::before { background: #f59e0b; }
.stat-item:nth-child(4)::before { background: #6366f1; }

.stat-number {
  font-size: 2.2rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 8px;
}

.stat-label {
  color: #6b7280;
  font-size: 0.9rem;
  font-weight: 500;
}

.table-section {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.07);
  overflow: hidden;
}

.table-container {
  overflow-x: auto;
}

.rooms-table {
  width: 100%;
  border-collapse: collapse;
}

.rooms-table th,
.rooms-table td {
  padding: 16px;
  text-align: left;
  border-bottom: 1px solid #f3f4f6;
}

.rooms-table th {
  background: #2f70b6;
  color: white;
  font-weight: 600;
  font-size: 0.9rem;
  border: 1px solid #094b91;
}

.room-number {
  font-weight: 600;
  color: #667eea;
  font-size: 1.1rem;
}

.price {
  font-weight: 600;
  color: #059669;
}

.status-badge {
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 500;
  text-transform: capitalize;
}

.status-badge.available {
  background: #d1fae5;
  color: #065f46;
}

.status-badge.occupied {
  background: #fee2e2;
  color: #991b1b;
}

.status-badge.maintenance {
  background: #fef3c7;
  color: #92400e;
}

.actions {
  display: flex;
  gap: 8px;
}

.btn {
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.85rem;
  font-weight: 500;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-primary {
  background: #667eea;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: #5a6fd8;
}

.btn-outline {
  background: white;
  border: 1px solid #d1d5db;
  color: #374151;
}

.btn-outline:hover:not(:disabled) {
  background: #f9fafb;
}

.btn-danger {
  background: #ef4444;
  color: white;
}

.btn-danger:hover:not(:disabled) {
  background: #dc2626;
}

.btn-sm {
  padding: 6px 12px;
  font-size: 0.8rem;
}

/* Modal Styles */
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
  border-radius: 12px;
  box-shadow: 0 20px 25px rgba(0,0,0,0.2);
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px;
  border-bottom: 1px solid #e5e7eb;
}

.modal-header h3 {
  color: #1f2937;
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #6b7280;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: background 0.3s ease;
}

.close-btn:hover {
  background: #f3f4f6;
}

.modal-body {
  padding: 24px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 16px;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group label {
  margin-bottom: 8px;
  font-weight: 500;
  color: #374151;
  font-size: 0.9rem;
}

.form-input {
  padding: 12px 16px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 0.95rem;
  color: #374151;
  transition: border-color 0.3s ease;
}

.form-input:focus {
  border-color: #667eea;
  outline: none;
}

.form-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 24px;
}

@media (max-width: 768px) {
  .form-row {
    grid-template-columns: 1fr;
  }
  
  .filters-section {
    flex-direction: column;
    align-items: stretch;
  }
  
  .room-stats {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>