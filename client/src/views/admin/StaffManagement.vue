<!-- src/views/admin/StaffManagement.vue -->
<template>
  <div class="staff-management">
    <!-- Page Header -->
    <div class="page-header">
      <h2>ຈັດການຂໍ້ມູນພະນັກງານ</h2>
      <button class="btn btn-primary" @click="openAddModal">
        ເພີ່ມພະນັກງານໃໝ່
      </button>
    </div>

    <!-- Search and Filters -->
    <div class="filters-section">
      <div class="search-box">
        <input 
          type="text" 
          v-model="searchQuery" 
          placeholder="ຄົ້ນຫາພະນັກງານ..."
          class="search-input"
        >
      </div>
      <div class="filter-controls">
        <select v-model="userTypeFilter" class="filter-select">
          <option value="">ທຸກຕໍາແໜ່ງ</option>
          <option v-for="userType in userTypes" :key="userType.id" :value="userType.id">
            {{ userType.name }}
          </option>
        </select>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="loading-container">
      <div class="loading-spinner"></div>
      <p>ກໍາລັງໂຫຼດຂໍ້ມູນພະນັກງານ...</p>
    </div>

    <!-- Staff Statistics -->
    <div v-if="!loading" class="staff-stats">
      <div class="stat-item">
        <div class="stat-number">{{ totalStaff }}</div>
        <div class="stat-label">ພະນັກງານທັງໝົດ</div>
        <div class="stat-icon">👥</div>
      </div>
      <div class="stat-item">
        <div class="stat-number">{{ activeStaff }}</div>
        <div class="stat-label">ພະນັກງານປະຈໍາ</div>
        <div class="stat-icon">🏢</div>
      </div>
      <div class="stat-item">
        <div class="stat-number">{{ userTypes.length }}</div>
        <div class="stat-label">ປະເພດຕໍາແໜ່ງ</div>
        <div class="stat-icon">📋</div>
      </div>
    </div>

    <!-- Staff Table -->
    <div v-if="!loading" class="table-section">
      <div class="table-container">
        <table class="staff-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>ຊື່-ນາມສະກຸນ</th>
              <th>ເບີໂທ</th>
              <th>ເພດ</th>
              <th>ເລກປະຈໍາຕົວ</th>
              <th>ວັນເກີດ</th>
              <th>ການດໍາເນີນການ</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="staff in filteredStaff" :key="staff.e_id">
              <td>{{ staff.e_id }}</td>
              <td class="staff-name">
                <div class="name-container">
                  <div class="full-name">{{ staff.name }} {{ staff.last_name }}</div>
                </div>
              </td>
              <td>{{ staff.tel || '-' }}</td>
              <td>
                <span class="position-badge">
                  {{ staff.gender || 'ບໍ່ລະບຸ' }}
                </span>
              </td>
              <td class="salary">{{ staff.idcard || '-' }}</td>
              <td>{{ formatDate(staff.birthday) }}</td>
              <td class="actions">
                <button class="btn btn-sm btn-outline" @click="editStaff(staff)">
                  ✏️ ແກ້ໄຂ
                </button>
                <button class="btn btn-sm btn-info" @click="viewStaffDetails(staff)">
                  👁️ ລາຍລະອຽດ
                </button>
                <button class="btn btn-sm btn-danger" @click="deleteStaff(staff.e_id)">
                  🗑️ ລຶບ
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="!loading && staff.length === 0" class="empty-state">
      <div class="empty-icon">👤</div>
      <h3>ບໍ່ມີຂໍ້ມູນພະນັກງານ</h3>
      <p>ເລີ່ມຕົ້ນໂດຍການເພີ່ມພະນັກງານໃໝ່</p>
      <button class="btn btn-primary" @click="openAddModal">
        ເພີ່ມພະນັກງານໃໝ່
      </button>
    </div>

    <!-- Add/Edit Modal -->
    <div v-if="showModal" class="modal-overlay" @click="closeModal">
      <div class="modal" @click.stop>
        <div class="modal-header">
          <h3>{{ isEditing ? 'ແກ້ໄຂຂໍ້ມູນພະນັກງານ' : 'ເພີ່ມພະນັກງານໃໝ່' }}</h3>
          <button class="close-btn" @click="closeModal">✕</button>
        </div>
        
        <div class="modal-body">
          <form @submit.prevent="saveStaff">
            <div class="form-row">
              <div class="form-group">
                <label>ຊື່ *</label>
                <input 
                  type="text" 
                  v-model="form.name" 
                  required 
                  class="form-input"
                  placeholder="ຊື່"
                >
              </div>
              
              <div class="form-group">
                <label>ນາມສະກຸນ *</label>
                <input 
                  type="text" 
                  v-model="form.last_name" 
                  required 
                  class="form-input"
                  placeholder="ນາມສະກຸນ"
                >
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label>ເບີໂທ</label>
                <input 
                  type="tel" 
                  v-model="form.tel" 
                  class="form-input"
                  placeholder="020xxxxxxxx"
                >
              </div>

              <div class="form-group">
                <label>ເພດ</label>
                <select v-model="form.gender" class="form-input">
                  <option value="">ເລືອກເພດ</option>
                  <option value="Male">ຊາຍ</option>
                  <option value="Female">ຍິງ</option>
                  <option value="Other">ອື່ນໆ</option>
                </select>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label>ວັນເກີດ</label>
                <input 
                  type="date" 
                  v-model="form.birthday" 
                  class="form-input"
                >
              </div>

              <div class="form-group">
                <label>ເລກປະຈໍາຕົວ</label>
                <input 
                  type="text" 
                  v-model="form.idcard" 
                  class="form-input"
                  placeholder="1234567890123"
                  maxlength="13"
                >
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label>ແຂວງ <span class="required">*</span></label>
                <input 
                  type="text" 
                  v-model="form.Province_name" 
                  class="form-input"
                  placeholder="ປ້ອນຊື່ແຂວງ"
                  required
                >
              </div>

              <div class="form-group">
                <label>ເມືອງ <span class="required">*</span></label>
                <input 
                  type="text" 
                  v-model="form.District_name" 
                  class="form-input"
                  placeholder="ປ້ອນຊື່ເມືອງ"
                  required
                >
              </div>
            </div>

            <div class="form-group">
              <label>ບ້ານ <span class="required">*</span></label>
              <input 
                type="text" 
                v-model="form.Village_name" 
                class="form-input"
                placeholder="ປ້ອນຊື່ບ້ານ"
                required
              >
            </div>
            
            <div class="form-actions">
              <button type="button" class="btn btn-outline" @click="closeModal">
                ຍົກເລີກ
              </button>
              <button type="submit" class="btn btn-primary" :disabled="saving">
                {{ saving ? 'ກໍາລັງບັນທຶກ...' : (isEditing ? 'ບັນທຶກການແກ້ໄຂ' : 'ເພີ່ມພະນັກງານ') }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Staff Details Modal -->
    <div v-if="showDetailsModal" class="modal-overlay" @click="closeDetailsModal">
      <div class="modal" @click.stop>
        <div class="modal-header">
          <h3>ລາຍລະອຽດພະນັກງານ</h3>
          <button class="close-btn" @click="closeDetailsModal">✕</button>
        </div>
        
        <div class="modal-body" v-if="selectedStaff">
          <div class="staff-details">
            <div class="detail-row">
              <span class="detail-label">ID:</span>
              <span class="detail-value">{{ selectedStaff.e_id }}</span>
            </div>
            
            <div class="detail-row">
              <span class="detail-label">ຊື່ເຕັມ:</span>
              <span class="detail-value">{{ selectedStaff.name }} {{ selectedStaff.last_name }}</span>
            </div>
            
            <div class="detail-row">
              <span class="detail-label">ເບີໂທ:</span>
              <span class="detail-value">{{ selectedStaff.tel || '-' }}</span>
            </div>
            
            <div class="detail-row">
              <span class="detail-label">ເພດ:</span>
              <span class="detail-value">{{ getGenderDisplay(selectedStaff.gender) }}</span>
            </div>
            
            <div class="detail-row">
              <span class="detail-label">ວັນເກີດ:</span>
              <span class="detail-value">{{ formatDate(selectedStaff.birthday) }}</span>
            </div>
            
            <div class="detail-row">
              <span class="detail-label">ເລກປະຈໍາຕົວ:</span>
              <span class="detail-value">{{ selectedStaff.idcard || '-' }}</span>
            </div>
            
            <div class="detail-row">
              <span class="detail-label">ທີ່ຢູ່:</span>
              <span class="detail-value">
                {{ getLocationDisplayText(selectedStaff) }}
              </span>
            </div>
          </div>
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
  name: 'StaffManagement',
  data() {
    return {
      loading: false,
      saving: false,
      showModal: false,
      showDetailsModal: false,
      isEditing: false,
      searchQuery: '',
      userTypeFilter: '',
      staff: [],
      userTypes: [],
      provinces: [],
      districts: [],
      villages: [],
      selectedStaff: null,
      form: {
        id: null,
        name: '',
        last_name: '',
        tel: '',
        gender: '',
        birthday: '',
        idcard: '',
        Village_id: '',
        District_id: '',
        Province_id: '',
        Village_name: '',
        District_name: '',
        Province_name: ''
      },
      message: {
        show: false,
        type: 'success',
        text: ''
      }
    }
  },
  computed: {
    filteredStaff() {
      let filtered = this.staff;
      
      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase();
        filtered = filtered.filter(staff => 
          (staff.name && staff.name.toLowerCase().includes(query)) ||
          (staff.last_name && staff.last_name.toLowerCase().includes(query)) ||
          (staff.tel && staff.tel.includes(query)) ||
          (staff.idcard && staff.idcard.includes(query))
        );
      }
      
      if (this.userTypeFilter) {
        filtered = filtered.filter(staff => staff.user_type_id == this.userTypeFilter);
      }
      
      return filtered;
    },
    totalStaff() {
      return this.staff.length;
    },
    activeStaff() {
      return this.staff.filter(staff => staff.user_type_id).length;
    }
  },
  mounted() {
    this.loadStaff();
    this.loadUserTypes();
    this.loadProvinces();
    this.loadFromLocalStorage(); // Load local data on mount
  },
  methods: {
    // Load all staff from database
    async loadStaff() {
      this.loading = true;
      try {
        const response = await axios.get('http://localhost:3000/api/staff');
        this.staff = response.data.data || [];
        // Also load any local offline data
        this.loadFromLocalStorage();
        console.log('Staff loaded:', this.staff);
      } catch (error) {
        console.error('Error loading staff:', error);
        if (error.code === 'ERR_NETWORK' || error.message.includes('ERR_CONNECTION_REFUSED')) {
          this.showMessage('ບໍ່ສາມາດເຊື່ອມຕໍ່ກັບເຊີເວີໄດ້ - ກະລຸນາກວດເຊີເວີ', 'error');
          // Load only local data when server is down
          this.staff = [];
          this.loadFromLocalStorage();
        } else {
          this.showMessage('ບໍ່ສາມາດໂຫຼດຂໍ້ມູນພະນັກງານໄດ້: ' + (error.response?.data?.message || error.message), 'error');
        }
      } finally {
        this.loading = false;
      }
    },

    // Load user types for positions
    async loadUserTypes() {
      try {
        const response = await axios.get('http://localhost:3000/api/user-types');
        this.userTypes = response.data.data || [];
      } catch (error) {
        console.error('Error loading user types:', error);
        // Fallback data if API fails
        this.userTypes = [
          { id: 1, name: 'ຜູ້ຈັດການ' },
          { id: 2, name: 'ພະນັກງານຕ້ອນຮັບ' },
          { id: 3, name: 'ພະນັກງານທໍາຄວາມສະອາດ' },
          { id: 4, name: 'ພະນັກງານຄົວ' },
          { id: 5, name: 'ພະນັກງານຮັກສາຄວາມປອດໄພ' }
        ];
      }
    },

    // Load provinces
    async loadProvinces() {
      try {
        const response = await axios.get('http://localhost:3000/api/provinces');
        this.provinces = response.data.data || [];
      } catch (error) {
        console.error('Error loading provinces:', error);
        // Provide fallback data when server is not available
        this.provinces = [
          { id: 1, name: 'ວຽງຈັນ' },
          { id: 2, name: 'ຫຼວງພະບາງ' },
          { id: 3, name: 'ຄໍາມ່ວນ' },
          { id: 4, name: 'ບໍລິຄໍາໄຊ' },
          { id: 5, name: 'ສາລະວັນ' },
          { id: 6, name: 'ຊ້າມະເພືອ' },
          { id: 7, name: 'ອັດຕະປື' },
          { id: 8, name: 'ອະເຕຳໃຕ້' },
          { id: 9, name: 'ບໍ່ແກ້ວ' },
          { id: 10, name: 'ຫົວພັນ' },
          { id: 11, name: 'ຜົ້ງສາລີ' },
          { id: 12, name: 'ວຽງຈັນ (ແຂວງ)' },
          { id: 13, name: 'ໄຊຍະບູລີ' },
          { id: 14, name: 'ອຸດົມໄຊ' },
          { id: 15, name: 'ຫຼວງນ້ໍາທາ' },
          { id: 16, name: 'ຊຽງຂວາງ' },
          { id: 17, name: 'ສະຫວັນນະເຂດ' }
        ];
        this.showMessage('ໃຊ້ຂໍ້ມູນແຂວງສໍາຮອງ (ເຊີເວີຢຸດການເຮັດວຽກ)', 'error');
      }
    },

    // Load districts by province
    async loadDistricts(provinceId) {
      try {
        const response = await axios.get(`http://localhost:3000/api/districts/${provinceId}`);
        this.districts = response.data.data || [];
      } catch (error) {
        console.error('Error loading districts:', error);
        // Provide fallback data based on province
        this.districts = this.getFallbackDistricts(provinceId);
      }
    },

    // Load villages by district
    async loadVillages(districtId) {
      try {
        const response = await axios.get(`http://localhost:3000/api/villages/${districtId}`);
        this.villages = response.data.data || [];
      } catch (error) {
        console.error('Error loading villages:', error);
        // Provide fallback data based on district
        this.villages = this.getFallbackVillages(districtId);
      }
    },

    // Get fallback districts when server is unavailable
    getFallbackDistricts(provinceId) {
      const districtMap = {
        1: [ // ວຽງຈັນ
          { id: 1, name: 'ເມືອງຈັນທະບູລີ' },
          { id: 2, name: 'ເມືອງຫາດໄຊຟອງ' },
          { id: 3, name: 'ເມືອງໄຊເສດຖາ' },
          { id: 4, name: 'ເມືອງສີສັດຕະນາກ' },
          { id: 5, name: 'ເມືອງສີໂຄດຕະບອງ' }
        ],
        2: [ // ຫຼວງພະບາງ
          { id: 6, name: 'ເມືອງຫຼວງພະບາງ' },
          { id: 7, name: 'ເມືອງຊຽງນະເຄືອ' },
          { id: 8, name: 'ເມືອງນ້ໍາບາກ' },
          { id: 9, name: 'ເມືອງປາກແຊງ' }
        ],
        3: [ // ຄໍາມ່ວນ
          { id: 10, name: 'ເມືອງຄໍາມ່ວນ' },
          { id: 11, name: 'ເມືອງຕ່າແອງ' },
          { id: 12, name: 'ເມືອງນາກາ' }
        ]
      };
      return districtMap[provinceId] || [
        { id: 99, name: 'ເມືອງອື່ນໆ' }
      ];
    },

    // Get fallback villages when server is unavailable
    getFallbackVillages(districtId) {
      const villageMap = {
        1: [ // ຈັນທະບູລີ
          { id: 1, name: 'ບ້ານວັດຈັນ' },
          { id: 2, name: 'ບ້ານສີມືງ' },
          { id: 3, name: 'ບ້ານນາງມັງ' }
        ],
        2: [ // ຫາດໄຊຟອງ
          { id: 4, name: 'ບ້ານໂຫາດໄຊຟອງ' },
          { id: 5, name: 'ບ້ານດອນດື່ງ' }
        ],
        6: [ // ຫຼວງພະບາງ
          { id: 6, name: 'ບ້ານວາດໃໝ່' },
          { id: 7, name: 'ບ້ານພອນຄໍາ' },
          { id: 8, name: 'ບ້ານເຊັ່ງຍາງ' }
        ]
      };
      return villageMap[districtId] || [
        { id: 99, name: 'ບ້ານອື່ນໆ' }
      ];
    },

    // Handle province change
    async onProvinceChange() {
      this.form.District_id = '';
      this.form.Village_id = '';
      this.districts = [];
      this.villages = [];
      
      if (this.form.Province_id) {
        await this.loadDistricts(this.form.Province_id);
      }
    },

    // Handle district change
    async onDistrictChange() {
      this.form.Village_id = '';
      this.villages = [];
      
      if (this.form.District_id) {
        await this.loadVillages(this.form.District_id);
      }
    },

    // Get location display text for details view
    getLocationDisplayText(staff) {
      if (!staff) return '-';
      
      // If we have manual input location text, use it
      if (staff.location_text) {
        return staff.location_text;
      }
      
      // Otherwise try to find location names from loaded data
      const province = this.provinces.find(p => p.id === staff.Province_id);
      const district = this.districts.find(d => d.id === staff.District_id);
      const village = this.villages.find(v => v.id === staff.Village_id);
      
      const parts = [];
      if (village) parts.push(`ບ້ານ${village.name}`);
      else if (staff.Village_id && staff.Village_id !== 999) parts.push(`ບ້ານ ID: ${staff.Village_id}`);
      
      if (district) parts.push(`ເມືອງ${district.name}`);
      else if (staff.District_id && staff.District_id !== 999) parts.push(`ເມືອງ ID: ${staff.District_id}`);
      
      if (province) parts.push(`ແຂວງ${province.name}`);
      else if (staff.Province_id && staff.Province_id !== 999) parts.push(`ແຂວງ ID: ${staff.Province_id}`);
      
      return parts.length > 0 ? parts.join(', ') : '-';
    },

    // Open add modal
    openAddModal() {
      this.isEditing = false;
      this.resetForm();
      this.showModal = true;
    },

    // Edit staff
    async editStaff(staff) {
      this.isEditing = true;
      
      // Extract manual location data if exists
      let province_name = '', district_name = '', village_name = '';
      if (staff.location_text) {
        const locationParts = staff.location_text.split(', ');
        if (locationParts.length >= 3) {
          village_name = locationParts[0];
          district_name = locationParts[1];
          province_name = locationParts[2];
        }
      }
      
      this.form = {
        id: staff.e_id,
        name: staff.name || '',
        last_name: staff.last_name || '',
        tel: staff.tel || '',
        gender: staff.gender || '',
        birthday: staff.birthday ? staff.birthday.split('T')[0] : '',
        idcard: staff.idcard || '',
        Village_id: staff.Village_id || 1,
        District_id: staff.District_id || 1,
        Province_id: staff.Province_id || 1,
        Village_name: village_name,
        District_name: district_name,
        Province_name: province_name
      };
      
      this.showModal = true;
    },

    // View staff details
    viewStaffDetails(staff) {
      this.selectedStaff = staff;
      this.showDetailsModal = true;
    },

    // Save staff (add or edit)
    async saveStaff() {
      this.saving = true;
      try {
        // Validate required fields
        if (!this.form.name.trim() || !this.form.last_name.trim()) {
          this.showMessage('ກະລຸນາປ້ອນຊື່ແລະນາມສະກຸນ', 'error');
          return;
        }
        
        // Validate manual location input (required)
        if (!this.form.Province_name || !this.form.District_name || !this.form.Village_name) {
          this.showMessage('ກະລຸນາປ້ອນທີ່ຢູ່ໃຫ້ຄົບຖ້ວນ (ແຂວງ, ເມືອງ, ບ້ານ)', 'error');
          return;
        }
        
        const data = {
          name: this.form.name.trim(),
          last_name: this.form.last_name.trim(),
          tel: this.form.tel.trim() || null,
          gender: this.form.gender || null,
          birthday: this.form.birthday || null,
          idcard: this.form.idcard.trim() || null,
        };

        // Add location data from manual input
        data.Village_id = 999; // Special ID for manual entries
        data.District_id = 999;
        data.Province_id = 999;
        data.location_text = `${this.form.Village_name}, ${this.form.District_name}, ${this.form.Province_name}`;

        // Map form data to match backend expectations (no need for mapping now)
        const backendData = data;

        if (this.isEditing) {
          // Update existing staff
          try {
            await axios.put(`http://localhost:3000/api/staff/${this.form.id}`, backendData);
            this.showMessage('ແກ້ໄຂຂໍ້ມູນພະນັກງານສໍາເລັດແລ້ວ', 'success');
          } catch (apiError) {
            // If server is down, update local data only
            if (apiError.code === 'ERR_NETWORK' || apiError.message.includes('ERR_CONNECTION_REFUSED')) {
              this.updateLocalStaff(this.form.id, backendData);
              this.showMessage('ແກ້ໄຂຂໍ້ມູນພະນັກງານໃນເຄື່ອງສໍາເລັດແລ້ວ (ເຊີເວີຢຸດເຮັດວຽກ)', 'success');
            } else {
              throw apiError;
            }
          }
        } else {
          // Create new staff
          try {
            await axios.post('http://localhost:3000/api/staff', backendData);
            this.showMessage('ເພີ່ມພະນັກງານໃໝ່ສໍາເລັດແລ້ວ', 'success');
          } catch (apiError) {
            // If server is down, add to local data only
            if (apiError.code === 'ERR_NETWORK' || apiError.message.includes('ERR_CONNECTION_REFUSED')) {
              this.addLocalStaff(backendData);
              this.showMessage('ເພີ່ມພະນັກງານໃໝ່ໃນເຄື່ອງສໍາເລັດແລ້ວ (ເຊີເວີຢຸດເຮັດວຽກ)', 'success');
            } else {
              throw apiError;
            }
          }
        }

        this.closeModal();
        this.loadStaff();
      } catch (error) {
        console.error('Error saving staff:', error);
        const errorMessage = error.response?.data?.message || error.message || 'ເກີດຄວາມຜິດພາດທີ່ບໍ່ຄາດຄິດ';
        this.showMessage('ເກີດຄວາມຜິດພາດໃນການບັນທຶກ: ' + errorMessage, 'error');
      } finally {
        this.saving = false;
      }
    },

    // Delete staff
    async deleteStaff(id) {
      const staff = this.staff.find(s => s.e_id === id);
      const confirmMessage = `ທ່ານແນ່ໃຈບໍ່ວ່າຕ້ອງການລຶບພະນັກງານ "${staff?.name} ${staff?.last_name}"?`;

      if (!confirm(confirmMessage)) {
        return;
      }

      try {
        await axios.delete(`http://localhost:3000/api/staff/${id}`);
        this.showMessage('ລຶບພະນັກງານສໍາເລັດແລ້ວ', 'success');
        this.loadStaff();
      } catch (error) {
        console.error('Error deleting staff:', error);
        const errorMessage = error.response?.data?.message || error.message;
        this.showMessage('ເກີດຄວາມຜິດພາດໃນການລຶບ: ' + errorMessage, 'error');
      }
    },

    // Close modal
    closeModal() {
      this.showModal = false;
      this.resetForm();
    },

    // Close details modal
    closeDetailsModal() {
      this.showDetailsModal = false;
      this.selectedStaff = null;
    },

    // Reset form
    resetForm() {
      this.form = {
        id: null,
        name: '',
        last_name: '',
        tel: '',
        gender: '',
        birthday: '',
        idcard: '',
        Village_id: '',
        District_id: '',
        Province_id: '',
        Village_name: '',
        District_name: '',
        Province_name: ''
      };
      // Clear location dropdowns
      this.districts = [];
      this.villages = [];
    },

    // Get gender display text
    getGenderDisplay(gender) {
      if (!gender) return 'ບໍ່ລະບຸ';
      
      const genderMap = {
        'Male': 'ຊາຍ',
        'Female': 'ຍິງ',
        'Other': 'ອື່ນໆ'
      };
      
      return genderMap[gender] || gender;
    },

    // Format salary
    formatSalary(salary) {
      if (!salary) return '-';
      return new Intl.NumberFormat('lo-LA').format(salary) + ' ກີບ';
    },

    // Format date
    formatDate(date) {
      if (!date) return '-';
      return new Date(date).toLocaleDateString('lo-LA');
    },

    // Show message
    showMessage(text, type = 'success') {
      this.message = { show: true, text, type };
      setTimeout(() => {
        this.message.show = false;
      }, 5000);
    },

    // Add staff to local storage when server is down
    addLocalStaff(staffData) {
      const newStaff = {
        ...staffData,
        e_id: Date.now(), // Use timestamp as temporary ID
        isLocal: true // Mark as local data
      };
      this.staff.push(newStaff);
      this.saveToLocalStorage();
    },

    // Update local staff data when server is down
    updateLocalStaff(staffId, staffData) {
      const index = this.staff.findIndex(s => s.e_id === staffId);
      if (index !== -1) {
        this.staff[index] = { ...this.staff[index], ...staffData };
        this.saveToLocalStorage();
      }
    },

    // Save data to local storage
    saveToLocalStorage() {
      const localStaff = this.staff.filter(s => s.isLocal);
      localStorage.setItem('hotel_staff_offline', JSON.stringify(localStaff));
    },

    // Load data from local storage
    loadFromLocalStorage() {
      const localData = localStorage.getItem('hotel_staff_offline');
      if (localData) {
        const localStaff = JSON.parse(localData);
        this.staff = [...this.staff, ...localStaff];
      }
    }
  }
}
</script>

<style scoped>
.staff-management {
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

.filters-section {
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
  align-items: center;
}

.search-box {
  flex: 1;
  max-width: 400px;
}

.search-input {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 0.95rem;
  transition: border-color 0.3s ease;
}

.search-input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.filter-controls {
  display: flex;
  gap: 12px;
}

.filter-select {
  padding: 12px 16px;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 0.95rem;
  background: white;
  min-width: 150px;
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

.staff-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.stat-item {
  background: white;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.07);
  border-left: 4px solid #667eea;
  display: flex;
  align-items: center;
  justify-content: space-between;
  transition: transform 0.3s ease;
}

.stat-item:hover {
  transform: translateY(-2px);
}

.stat-number {
  font-size: 2.5rem;
  font-weight: 700;
  color: #1f2937;
}

.stat-label {
  color: #6b7280;
  font-size: 0.9rem;
  font-weight: 500;
  margin-top: 4px;
}

.stat-icon {
  font-size: 2rem;
  opacity: 0.7;
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

.staff-table {
  width: 100%;
  border-collapse: collapse;
}

.staff-table th {
  background: #2f70b6;
  color: white;
  padding: 16px 12px;
  text-align:center;
  font-weight: 600;
  font-size: 0.9rem;
  border: 1px solid #094b91;
}

.staff-table td {
  padding: 16px 12px;
  border-bottom: 1px solid #f3f4f6;
  font-size: 0.9rem;
}

.staff-table tr:hover {
  background-color: #f9fafb;
}

.staff-name {
  font-weight: 600;
  color: #1f2937;
}

.name-container {
  display: flex;
  align-items: center;
}

.full-name {
  font-weight: 600;
}

.position-badge {
  background: #e0e7ff;
  color: #3730a3;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 500;
}

.salary {
  font-weight: 600;
  color: #059669;
}

.actions {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.07);
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 16px;
}

.empty-state h3 {
  color: #1f2937;
  font-size: 1.5rem;
  margin-bottom: 8px;
}

.empty-state p {
  color: #6b7280;
  margin-bottom: 24px;
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
  background: #2f70b6;
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

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
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

.required {
  color: #ef4444;
}

.form-input:disabled {
  background-color: #f9fafb;
  color: #6b7280;
  cursor: not-allowed;
  border-color: #d1d5db;
}

.form-input {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 0.95rem;
  transition: border-color 0.3s ease;
  box-sizing: border-box;
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

.detail-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #f3f4f6;
  margin-bottom: 16px;
}

.detail-row:last-child {
  border-bottom: none;
}

.detail-label {
  font-weight: 600;
  color: #6b7280;
  font-size: 0.95rem;
}

.detail-value {
  color: #1f2937;
  font-weight: 500;
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
  background:#2f70b6;
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

.btn-info {
  background: linear-gradient(135deg, #06b6d4 0%, #0891b2 100%);
  color: white;
}

.btn-info:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(6, 182, 212, 0.4);
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
  .filters-section {
    flex-direction: column;
    align-items: stretch;
  }
  
  .page-header {
    flex-direction: column;
    gap: 16px;
    align-items: stretch;
  }
  
  .form-row {
    grid-template-columns: 1fr;
  }
  
  .actions {
    flex-direction: column;
  }
  
  .modal {
    width: 95%;
    margin: 20px;
  }
  
  .form-actions {
    flex-direction: column;
  }
  
  .staff-stats {
    grid-template-columns: 1fr;
  }
  
  .detail-row {
    flex-direction: column;
    gap: 4px;
    align-items: flex-start;
  }
}

@media (max-width: 480px) {
  .staff-table {
    font-size: 0.8rem;
  }
  
  .staff-table th,
  .staff-table td {
    padding: 8px 6px;
  }
}
</style>
