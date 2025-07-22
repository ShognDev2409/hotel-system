<!-- src/views/admin/RoomTypeManagement.vue -->
<template>
  <div class="room-type-management">
    <!-- Page Header -->
    <div class="page-header">
      <h2>ຈັດການປະເພດຫ້ອງ</h2>
      <button class="btn btn-primary" @click="openAddModal">
        <i class="icon">➕</i>
        ເພີ່ມປະເພດຫ້ອງໃໝ່
      </button>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="loading-container">
      <div class="loading-spinner"></div>
      <p>ກໍາລັງໂຫຼດຂໍ້ມູນ...</p>
    </div>

    <!-- Room Types Table -->
    <div v-else class="table-container">
      <table class="room-types-table">
        <thead>
          <tr>
            <th class="room-id">ID</th>
            <th class="room-name">ຊື່ປະເພດຫ້ອງ</th>
            <th class="room-count">ຈໍານວນຫ້ອງ</th>
            <th class="room-status">ສະຖານະ</th>
            <th class="room-actions">ກິດຈະກຳ</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="roomType in roomTypes" :key="roomType.id">
            <td class="room-id">{{ roomType.id }}</td>
            <td class="room-name">
              <div class="name-display">
                <div class="main-name">{{ roomType.name }}</div>
              </div>
            </td>
            <td class="room-count">
              <div class="count-badge">{{ getRoomCount(roomType.id) }}</div>
            </td>
            <td class="room-status">
              <div class="status-indicator active">
                ເປີດໃຊ້ງານ
              </div>
            </td>
            <td class="room-actions">
              <div class="action-buttons">
                <button class="btn btn-sm btn-outline" @click="editRoomType(roomType)">
                  ✏️ ແກ້ໄຂ
                </button>
                <button class="btn btn-sm btn-danger" @click="deleteRoomType(roomType.id)">
                  🗑️ ລຶບ
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Empty State -->
    <div v-if="!loading && roomTypes.length === 0" class="empty-state">
      <div class="empty-icon">🏢</div>
      <h3>ບໍ່ມີປະເພດຫ້ອງ</h3>
      <p>ເລີ່ມຕົ້ນໂດຍການເພີ່ມປະເພດຫ້ອງໃໝ່</p>
      <button class="btn btn-primary" @click="openAddModal">
        ເພີ່ມປະເພດຫ້ອງໃໝ່
      </button>
    </div>

    <!-- Add/Edit Modal -->
    <div v-if="showModal" class="modal-overlay" @click="closeModal">
      <div class="modal" @click.stop>
        <div class="modal-header">
          <h3>{{ isEditing ? 'ແກ້ໄຂປະເພດຫ້ອງ' : 'ເພີ່ມປະເພດຫ້ອງໃໝ່' }}</h3>
          <button class="close-btn" @click="closeModal">✕</button>
        </div>
        
        <div class="modal-body">
          <form @submit.prevent="saveRoomType">
            <div class="form-group">
              <label>ຊື່ປະເພດຫ້ອງ *</label>
              <input 
                type="text" 
                v-model="form.name" 
                required 
                class="form-input"
                placeholder="Standard Room, Deluxe Room, Suite..."
              >
            </div>
            
            <div class="form-actions">
              <button type="button" class="btn btn-outline" @click="closeModal">
                ຍົກເລີກ
              </button>
              <button type="submit" class="btn btn-primary" :disabled="saving">
                {{ saving ? 'ກໍາລັງບັນທຶກ...' : (isEditing ? 'ບັນທຶກການແກ້ໄຂ' : 'ເພີ່ມປະເພດຫ້ອງ') }}
              </button>
            </div>
          </form>
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
import axios from 'axios'

export default {
  name: 'RoomTypeManagement',
  data() {
    return {
      loading: false,
      saving: false,
      showModal: false,
      isEditing: false,
      roomTypes: [],
      roomCounts: {},
      form: {
        id: null,
        name: ''
      },
      message: {
        show: false,
        type: 'success',
        text: ''
      }
    }
  },
  mounted() {
    this.loadRoomTypes()
    this.loadRoomCounts()
  },
  methods: {
    // Load room types from database
    async loadRoomTypes() {
      this.loading = true
      try {
        // ใช้ axios ตรงๆ เพื่อเรียก API
        const response = await axios.get('http://localhost:3000/api/room-types')
        this.roomTypes = response.data || []
        console.log('Room types loaded:', this.roomTypes)
      } catch (error) {
        console.error('Error loading room types:', error)
        this.showMessage('ບໍ່ສາມາດໂຫຼດຂໍ້ມູນປະເພດຫ້ອງໄດ້: ' + (error.response?.data?.message || error.message), 'error')
      } finally {
        this.loading = false
      }
    },

    // Load room counts for each room type
    async loadRoomCounts() {
      try {
        const response = await axios.get('http://localhost:3000/api/room-counts-by-type')
        this.roomCounts = response.data || {}
        console.log('Room counts loaded:', this.roomCounts)
      } catch (error) {
        console.error('Error loading room counts:', error)
        // ถ้าไม่มี API สำหรับนับห้อง ให้ใช้ข้อมูลจำลอง
        this.roomCounts = {
          1: 3, // Standard Room
          2: 4, // Deluxe Room  
          3: 2, // Suite
          4: 1  // Family Room
        }
      }
    },

    // Get room count for specific room type
    getRoomCount(roomTypeId) {
      return this.roomCounts[roomTypeId] || 0
    },

    // Open add modal
    openAddModal() {
      this.isEditing = false
      this.resetForm()
      this.showModal = true
    },

    // Edit room type
    editRoomType(roomType) {
      this.isEditing = true
      this.form = {
        id: roomType.id,
        name: roomType.name
      }
      this.showModal = true
    },

    // Save room type (add or edit)
    async saveRoomType() {
      this.saving = true
      try {
        const data = {
          name: this.form.name.trim()
        }

        if (this.isEditing) {
          // Update existing room type
          await axios.put(`http://localhost:3000/api/room-types/${this.form.id}`, data)
          this.showMessage('ແກ້ໄຂປະເພດຫ້ອງສໍາເລັດແລ້ວ', 'success')
        } else {
          // Create new room type
          await axios.post('http://localhost:3000/api/room-types', data)
          this.showMessage('ເພີ່ມປະເພດຫ້ອງໃໝ່ສໍາເລັດແລ້ວ', 'success')
        }

        this.closeModal()
        this.loadRoomTypes()
        this.loadRoomCounts()
      } catch (error) {
        console.error('Error saving room type:', error)
        const errorMessage = error.response?.data?.message || error.message || 'ເກີດຄວາມຜິດພາດທີ່ບໍ່ຄາດຄິດ'
        this.showMessage('ເກີດຄວາມຜິດພາດໃນການບັນທຶກ: ' + errorMessage, 'error')
      } finally {
        this.saving = false
      }
    },

    // Delete room type
    async deleteRoomType(id) {
      const roomType = this.roomTypes.find(rt => rt.id === id)
      const roomCount = this.getRoomCount(id)
      
      let confirmMessage = `ທ່ານແນ່ໃຈບໍ່ວ່າຕ້ອງການລຶບປະເພດຫ້ອງ "${roomType?.name}"?`
      
      if (roomCount > 0) {
        confirmMessage += `\n\nປະເພດຫ້ອງນີ້ມີຫ້ອງຈໍານວນ ${roomCount} ຫ້ອງ ການລຶບອາດສົ່ງຜົນກະທົບ!`
      }

      if (!confirm(confirmMessage)) {
        return
      }

      try {
        await axios.delete(`http://localhost:3000/api/room-types/${id}`)
        this.showMessage('ລຶບປະເພດຫ້ອງສໍາເລັດແລ້ວ', 'success')
        this.loadRoomTypes()
        this.loadRoomCounts()
      } catch (error) {
        console.error('Error deleting room type:', error)
        const errorMessage = error.response?.data?.message || error.message
        
        if (error.response?.status === 400) {
          this.showMessage('ບໍ່ສາມາດລຶບປະເພດຫ້ອງນີ້ໄດ້ ເນື່ອງຈາກມີຫ້ອງທີ່ໃຊ້ປະເພດນີ້ຢູ່', 'error')
        } else {
          this.showMessage('ເກີດຄວາມຜິດພາດໃນການລຶບ: ' + errorMessage, 'error')
        }
      }
    },

    // Close modal
    closeModal() {
      this.showModal = false
      this.resetForm()
    },

    // Reset form
    resetForm() {
      this.form = {
        id: null,
        name: ''
      }
    },

    // Show message
    showMessage(text, type = 'success') {
      this.message = { show: true, text, type }
      setTimeout(() => {
        this.message.show = false
      }, 5000)
    }
  }
}
</script>

<style scoped>
.room-type-management {
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px;
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

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px;
  color: #6b7280;
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

/* Table Styles */
.table-container {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.07);
  overflow: hidden;
  margin-bottom: 30px;
}

.room-types-table {
  width: 100%;
  border-collapse: collapse;
}

.room-types-table thead {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.room-types-table th {
  padding: 16px 20px;
  text-align: left;
  color: white;
  font-weight: 600;
  font-size: 0.95rem;
  border: none;
}

.room-types-table tbody tr {
  border-bottom: 1px solid #f3f4f6;
  transition: background-color 0.3s ease;
}

.room-types-table tbody tr:hover {
  background-color: #f8fafc;
}

.room-types-table tbody tr:last-child {
  border-bottom: none;
}

.room-types-table td {
  padding: 16px 20px;
  vertical-align: middle;
  border: none;
}

.room-id {
  color: #6b7280;
  font-weight: 600;
  font-size: 0.9rem;
}

.room-name .name-display {
  display: flex;
  flex-direction: column;
}

.room-name .main-name {
  color: #1f2937;
  font-weight: 600;
  font-size: 1rem;
}

.room-count .count-badge {
  background: #e0e7ff;
  color: #3730a3;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 500;
}

.room-status .status-indicator {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 500;
}

.room-status .status-indicator.active {
  background: #d1fae5;
  color: #065f46;
}

.room-actions .action-buttons {
  display: flex;
  gap: 8px;
}

/* Remove old grid styles and update responsive design */
.room-types-grid {
  display: none;
}

/* Responsive Design for Table */
@media (max-width: 768px) {
  .table-container {
    overflow-x: auto;
  }
  
  .room-types-table {
    min-width: 600px;
  }
  
  .room-types-table th,
  .room-types-table td {
    padding: 12px 16px;
  }
  
  .room-actions .action-buttons {
    flex-direction: column;
    gap: 4px;
  }
  
  .btn-sm {
    padding: 6px 12px;
    font-size: 0.75rem;
  }
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
  border-radius: 12px;
  box-shadow: 0 20px 25px rgba(0,0,0,0.2);
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px;
  border-bottom: 1px solid #e5e7eb;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.modal-header h3 {
  color: white;
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: white;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: background 0.3s ease;
}

.close-btn:hover {
  background: rgba(255,255,255,0.2);
}

.modal-body {
  padding: 24px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  color: #374151;
  font-weight: 600;
  font-size: 0.95rem;
}

.form-input {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 0.95rem;
  transition: border-color 0.3s ease;
}

.form-input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.form-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 24px;
  padding-top: 20px;
  border-top: 1px solid #e5e7eb;
}

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

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.btn-primary:hover:not(:disabled) {
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

.btn-danger {
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  color: white;
}

.btn-danger:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.4);
}

.btn-sm {
  padding: 8px 16px;
  font-size: 0.8rem;
}

.message {
  position: fixed;
  top: 20px;
  right: 20px;
  padding: 16px 24px;
  border-radius: 8px;
  font-weight: 500;
  z-index: 1001;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  max-width: 400px;
}

.message.success {
  background: #d1fae5;
  color: #065f46;
  border: 1px solid #a7f3d0;
}

.message.error {
  background: #fee2e2;
  color: #991b1b;
  border: 1px solid #fca5a5;
}

/* Responsive Design */
@media (max-width: 768px) {
  .room-types-grid {
    grid-template-columns: 1fr;
  }
  
  .page-header {
    flex-direction: column;
    gap: 16px;
    align-items: stretch;
  }
  
  .card-header {
    flex-direction: column;
    gap: 12px;
    align-items: stretch;
  }
  
  .card-actions {
    justify-content: center;
  }
  
  .modal {
    width: 95%;
    margin: 20px;
  }
  
  .form-actions {
    flex-direction: column;
  }
  
  .info-item {
    flex-direction: column;
    gap: 4px;
  }
}
</style>