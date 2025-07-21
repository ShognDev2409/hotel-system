<template>
  <div class="checkout-management">
    <!-- Page Header -->
    <div class="page-header">
      <div class="header-content">
        <div class="header-title">
          <h1><i class="fas fa-sign-out-alt"></i> ບັນທຶກແຈ້ງອອກ</h1>
         
        </div>
      </div>
    </div>
 <!-- Search and Filters -->
    <div class="search-filters">
      <div class="search-box">
        <input 
          v-model="searchQuery" 
          type="text" 
          placeholder="ຄົ້ນຫາເລກຫ້ອງ, ຊື່ລູກຄ້າ, ຫຼືເລກການຈອງ..."
          class="search-input"
        >
        <i class="fas fa-search search-icon"></i>
      </div>
      
      <div class="filter-group">
        <select v-model="statusFilter" class="filter-select">
          <option value="">ທຸກສະຖານະ</option>
          <option value="ready-checkout">ພ້ອມແຈ້ງອອກ</option>
          <option value="processing">ກຳລັງດຳເນີນການ</option>
          <option value="completed">ແຈ້ງອອກແລ້ວ</option>
          <option value="late-checkout">ແຈ້ງອອກລ່າຊ້າ</option>
          <option value="overdue-12pm">ເກີນກຳນົດ 12 ໂມງ</option>
        </select>
        
        <select v-model="floorFilter" class="filter-select">
          <option value="">ທຸກຊັ້ນ</option>
          <option value="1">ຊັ້ນ 1</option>
          <option value="2">ຊັ້ນ 2</option>
          <option value="3">ຊັ້ນ 3</option>
          <option value="4">ຊັ້ນ 4</option>
        </select>
        
        <input 
          v-model="dateFilter" 
          type="date" 
          class="filter-date"
          :max="maxDate"
        >
        
        <button @click="clearFilters" class="btn btn-outline">
          <i class="fas fa-times"></i> ລຶບຕົວກອງ
        </button>
      </div>
    </div>
    <!-- DFD Process 5 Stats -->
    <div class="stats-grid">
      <div class="stat-card checkout">
        <div class="stat-icon">
          <i class="fas fa-door-open"></i>
        </div>
        <div class="stat-content">
          <div class="stat-number">{{ readyToCheckOut }}</div>
          <div class="stat-label">ພ້ອມແຈ້ງອອກ</div>
        </div>
      </div>
      
      <div class="stat-card processing">
        <div class="stat-icon">
          <i class="fas fa-cogs"></i>
        </div>
        <div class="stat-content">
          <div class="stat-number">{{ processingCheckOut }}</div>
          <div class="stat-label">ກຳລັງດຳເນີນການ</div>
        </div>
      </div>
      
      <div class="stat-card completed">
        <div class="stat-icon">
          <i class="fas fa-check-circle"></i>
        </div>
        <div class="stat-content">
          <div class="stat-number">{{ completedToday }}</div>
          <div class="stat-label">ແຈ້ງອອກແລ້ວມື້ນີ້</div>
        </div>
      </div>
      
      <div class="stat-card revenue">
        <div class="stat-icon">
          <i class="fas fa-money-bill-wave"></i>
        </div>
        <div class="stat-content">
          <div class="stat-number">{{ formatCurrency(totalRevenue) }}</div>
          <div class="stat-label">ລາຍຮັບມື້ນີ້</div>
        </div>
      </div>
    </div>

   

    <!-- Main Content Table -->
    <div class="table-container">
      <table class="data-table">
        <thead>
          <tr>
            <th>ຫ້ອງ</th>
            <th>ລູກຄ້າ</th>
            <th>ວັນທີເຂົ້າພັກ</th>
            <th>ກຳນົດແຈ້ງອອກ</th>
            <th>ຍອດເງິນ</th>
            <th>ການຊຳລະ</th>
            <th>ສະຖານະ</th>
            <th>ການດຳເນີນການ</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="checkout in filteredCheckouts" :key="checkout.id">
            <td>
              <div class="room-info">
                <span class="room-number">{{ checkout.roomNumber }}</span>
                <small class="room-type">{{ checkout.roomType }}</small>
              </div>
            </td>
            <td>
              <div class="customer-info">
                <span class="customer-name">{{ checkout.customerName }}</span>
                <small class="customer-phone">{{ checkout.customerPhone }}</small>
              </div>
            </td>
            <td>{{ formatDate(checkout.actualCheckInTime) }}</td>
            <td>
              <div class="checkout-time">
                <span :class="getCheckoutTimeClass(checkout)">
                  {{ formatDate(checkout.scheduledCheckOutDate) }}
                </span>
                <small>{{ formatTime(checkout.scheduledCheckOutTime) }}</small>
                <div class="deadline-info" :style="{ color: getCheckoutStatus(checkout).color }">
                  <small>{{ getCheckoutStatus(checkout).message }}</small>
                </div>
              </div>
            </td>
            <td>
              <div class="amount-info">
                <div class="total-amount">{{ formatCurrency(checkout.totalAmount) }}</div>
                <div class="payment-status">{{ getPaymentStatusText(checkout.paymentStatus) }}</div>
                <div v-if="checkout.remainingAmount > 0" class="remaining-amount">
                  ຄົງເຫລືອ: {{ formatCurrency(checkout.remainingAmount) }}
                </div>
              </div>
            </td>
            <td>
              <span :class="['payment-badge', getPaymentStatusClass(checkout.paymentStatus)]">
                {{ getPaymentStatusText(checkout.paymentStatus) }}
              </span>
            </td>
            <td>
              <span :class="['status-badge', getStatusClass(checkout.status)]">
                {{ getStatusText(checkout.status) }}
              </span>
            </td>
            <td>
              <div class="action-buttons">
                <button 
                  v-if="checkout.status === 'ready-checkout'" 
                  @click="processCheckOut(checkout)"
                  class="btn btn-success btn-sm"
                  title="ເລີ່ມການແຈ້ງອອກ"
                >
                  <i class="fas fa-sign-out-alt"></i>
                  ແຈ້ງອອກ
                </button>
                
                <button 
                  v-if="checkout.remainingAmount > 0"
                  @click="openPaymentModal(checkout)"
                  class="btn btn-warning btn-sm"
                  title="ຊຳລະເງິນສ່ວນທີ່ເຫຼືອ"
                >
                  <i class="fas fa-credit-card"></i>
                  ຊຳລະ {{ formatCurrency(checkout.remainingAmount) }}
                </button>
                
                <button 
                  @click="viewDetails(checkout)"
                  class="btn btn-info btn-sm"
                  title="ເບິ່ງລາຍລະອຽດ"
                >
                  <i class="fas fa-eye"></i>
                  ລາຍລະອຽດ
                </button>
                
                <button 
                  v-if="checkout.status === 'completed'"
                  @click="printReceipt(checkout)"
                  class="btn btn-secondary btn-sm"
                  title="ພິມໃບເສັດ"
                >
                  <i class="fas fa-print"></i>
                  ພິມ
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      
      <div v-if="filteredCheckouts.length === 0" class="no-data">
        <i class="fas fa-inbox"></i>
        <p>ບໍ່ພົບຂໍ້ມູນການແຈ້ງອອກ</p>
      </div>
    </div>

    <!-- Details Modal -->
    <div v-if="showDetailsModal" class="modal-overlay" @click="closeDetailsModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3><i class="fas fa-info-circle"></i> ລາຍລະອຽດການແຈ້ງອອກ - DFD Process 5</h3>
          <button @click="closeDetailsModal" class="modal-close">
            <i class="fas fa-times"></i>
          </button>
        </div>
        
        <div class="modal-body" v-if="selectedCheckout">
          <div class="detail-grid">
            <div class="detail-section">
              <h4><i class="fas fa-user"></i> ຂໍ້ມູນລູກຄ້າ (D3)</h4>
              <div class="detail-item">
                <label>ຊື່:</label>
                <span>{{ selectedCheckout.customerName }}</span>
              </div>
              <div class="detail-item">
                <label>ເບີໂທ:</label>
                <span>{{ selectedCheckout.customerPhone }}</span>
              </div>
              <div class="detail-item">
                <label>ເລກບັດປະຊາຊົນ:</label>
                <span>{{ selectedCheckout.idCardNumber }}</span>
              </div>
              <div class="detail-item">
                <label>ສັນຊາດ:</label>
                <span>{{ selectedCheckout.nationality }}</span>
              </div>
            </div>
            
            <div class="detail-section">
              <h4><i class="fas fa-bed"></i> ຂໍ້ມູນການພັກ (D2)</h4>
              <div class="detail-item">
                <label>ຫ້ອງ:</label>
                <span>{{ selectedCheckout.roomNumber }} ({{ selectedCheckout.roomType }})</span>
              </div>
              <div class="detail-item">
                <label>ວັນທີເຂົ້າພັກ:</label>
                <span>{{ formatDateTime(selectedCheckout.actualCheckInTime) }}</span>
              </div>
              <div class="detail-item">
                <label>ກຳນົດອອກ:</label>
                <span>{{ formatDateTime(selectedCheckout.scheduledCheckOutDate) }}</span>
              </div>
              <div class="detail-item">
                <label>ຈໍານວນຄືນ:</label>
                <span>{{ selectedCheckout.totalNights }} ຄືນ</span>
              </div>
            </div>
            
            <div class="detail-section">
              <h4><i class="fas fa-money-bill"></i> ຂໍ້ມູນການເງິນ (D7)</h4>
              <div class="detail-item">
                <label>ຄ່າຫ້ອງ:</label>
                <span>{{ formatCurrency(selectedCheckout.roomPrice) }} / ຄືນ</span>
              </div>
              <div class="detail-item">
                <label>ຄ່າບໍລິການເພີ່ມເຕີມ (D4):</label>
                <span>{{ formatCurrency(selectedCheckout.additionalCharges || 0) }}</span>
              </div>
              <div class="detail-item">
                <label>ຍອດລວມ:</label>
                <span class="total-amount">{{ formatCurrency(selectedCheckout.totalAmount) }}</span>
              </div>
              <div class="detail-item">
                <label>ຈ່າຍແລ້ວ:</label>
                <span>{{ formatCurrency(selectedCheckout.paidAmount) }}</span>
              </div>
              <div class="detail-item" v-if="selectedCheckout.remainingAmount > 0">
                <label>ຍັງເຫຼືອ:</label>
                <span class="remaining-amount">{{ formatCurrency(selectedCheckout.remainingAmount) }}</span>
              </div>
              <div class="detail-item">
                <label>ສະຖານະການຈ່າຍ:</label>
                <span :class="['payment-status-badge', getPaymentStatusClass(selectedCheckout.paymentStatus)]">
                  {{ getPaymentStatusText(selectedCheckout.paymentStatus) }}
                </span>
              </div>
            </div>

            <div class="detail-section">
              <h4><i class="fas fa-tasks"></i> DFD Process 5 ຂັ້ນຕອນ</h4>
              <div class="process-tracking">
                <div :class="['process-item', { 'completed': selectedCheckout.checkoutProcess.roomInspection }]">
                  <i class="fas fa-search"></i>
                  <span>5.1 ກວດສອບແຈ້ງອອກ</span>
                  <small>ກວດສອບຫ້ອງ, ອຸປະກອນ</small>
                </div>
                <div :class="['process-item', { 'completed': selectedCheckout.checkoutProcess.billSettlement }]">
                  <i class="fas fa-edit"></i>
                  <span>5.2 ປັບປຸງຂໍ້ມູນ</span>
                  <small>ອັບເດດສະຖານະຫ້ອງ D2</small>
                </div>
                <div :class="['process-item', { 'completed': selectedCheckout.checkoutProcess.keyReturn }]">
                  <i class="fas fa-key"></i>
                  <span>5.3 ປັບປຸງຂໍ້ມູນຄ່າບໍລິການ</span>
                  <small>ອັບເດດ D4 Service Data</small>
                </div>
                <div :class="['process-item', { 'completed': selectedCheckout.checkoutProcess.finalInvoice }]">
                  <i class="fas fa-check"></i>
                  <span>ສິ້ນສຸດ Process</span>
                  <small>ອັບເດດທຸກ Data Store</small>
                </div>
              </div>
            </div>
          </div>
          
          <div v-if="selectedCheckout.notes" class="notes-section">
            <h4><i class="fas fa-sticky-note"></i> ໝາຍເຫດ</h4>
            <p>{{ selectedCheckout.notes }}</p>
          </div>
        </div>
        
        <div class="modal-footer">
          <button @click="closeDetailsModal" class="btn btn-secondary">ປິດ</button>
          <button v-if="selectedCheckout.status === 'ready-checkout'" @click="processCheckOut(selectedCheckout)" class="btn btn-success">
            <i class="fas fa-sign-out-alt"></i> ດຳເນີນການແຈ້ງອອກ
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CheckOut',
  data() {
    return {
      searchQuery: '',
      statusFilter: '',
      floorFilter: '',
      dateFilter: '',
      showDetailsModal: false,
      selectedCheckout: null,
      
      // DFD Process 5 - ແຈ້ງອອກ Data Stores
      checkouts: [
        {
          id: 1,
          bookingNumber: 'BK001',
          roomNumber: '101',
          roomType: 'Deluxe room',
          customerName: 'ນາງ ສົມໃຈ ພົມມະວົງ',
          customerPhone: '020-55667788',
          customerEmail: 'somjai@email.com',
          idCardNumber: '1234567890123',
          nationality: 'ລາວ',
          actualCheckInTime: '2025-07-10T14:00:00Z',
          scheduledCheckOutDate: '2025-07-13',
          scheduledCheckOutTime: '12:00',
          totalNights: 3,
          roomPrice: 800000,
          additionalCharges: 100000,
          totalAmount: 2500000,
          paidAmount: 2500000,
          remainingAmount: 0,
          paymentStatus: 'paid',
          status: 'ready-checkout',
          notes: 'ລູກຄ້າປົກກະຕິ',
          processedBy: null,
          processedAt: null,
          actualCheckOutTime: null,
          // DFD Process 5 tracking
          checkoutProcess: {
            roomInspection: false,    // 5.1 ກວດສອບແຈ້ງອອກ
            billSettlement: true,     // 5.2 ປັບປຸງຂໍ້ມູນ (D2)
            keyReturn: false,         // 5.3 ປັບປຸງຂໍ້ມູນຄ່າບໍລິການ (D4)
            finalInvoice: false       // Update all data stores D2,D3,D4,D7
          }
        },
        {
          id: 2,
          bookingNumber: 'BK002',
          roomNumber: '202',
          roomType: 'Double room (Thatluang view)',
          customerName: 'ທ້າວ ບຸນມີ ຄຳພາ',
          customerPhone: '020-99887766',
          customerEmail: 'bunmee@email.com',
          idCardNumber: '2345678901234',
          nationality: 'ລາວ',
          actualCheckInTime: '2025-07-11T15:30:00Z',
          scheduledCheckOutDate: '2025-07-13',
          scheduledCheckOutTime: '12:00',
          totalNights: 2,
          roomPrice: 600000,
          additionalCharges: 50000,
          totalAmount: 1250000,
          paidAmount: 800000,
          remainingAmount: 450000,
          paymentStatus: 'partial',
          status: 'ready-checkout',
          notes: 'ຍັງເຫຼືອຄ່າບໍລິການເພີ່ມເຕີມ',
          processedBy: null,
          processedAt: null,
          actualCheckOutTime: null,
          checkoutProcess: {
            roomInspection: false,
            billSettlement: false,
            keyReturn: false,
            finalInvoice: false
          }
        },
        {
          id: 3,
          bookingNumber: 'BK003',
          roomNumber: '301',
          roomType: 'Twin room',
          customerName: 'Mr. John Smith',
          customerPhone: '020-11223344',
          customerEmail: 'john.smith@email.com',
          idCardNumber: 'P1234567',
          nationality: 'ອາເມລິກັນ',
          actualCheckInTime: '2025-07-09T16:00:00Z',
          scheduledCheckOutDate: '2025-07-13',
          scheduledCheckOutTime: '12:00',
          totalNights: 4,
          roomPrice: 500000,
          additionalCharges: 200000,
          totalAmount: 2200000,
          paidAmount: 2200000,
          remainingAmount: 0,
          paymentStatus: 'paid',
          status: 'processing',
          notes: 'ລູກຄ້າຕ່າງປະເທດ - ກຳລັງດຳເນີນການແຈ້ງອອກ',
          processedBy: 'ພະນັກງານແຜນກຕ້ອນຮັບ',
          processedAt: '2025-07-13T09:00:00Z',
          actualCheckOutTime: null,
          checkoutProcess: {
            roomInspection: true,
            billSettlement: true,
            keyReturn: false,
            finalInvoice: true
          }
        },
        {
          id: 4,
          bookingNumber: 'BK004',
          roomNumber: '401',
          roomType: 'Double Room',
          customerName: 'ທ້າວ ວິຣະພອນ ໄຊຍະສິດ',
          customerPhone: '020-33445566',
          customerEmail: 'viraphon@email.com',
          idCardNumber: '4567890123456',
          nationality: 'ລາວ',
          actualCheckInTime: '2025-07-12T14:30:00Z',
          scheduledCheckOutDate: '2025-07-13',
          scheduledCheckOutTime: '12:00',
          totalNights: 1,
          roomPrice: 500000,
          additionalCharges: 30000,
          totalAmount: 530000,
          paidAmount: 530000,
          remainingAmount: 0,
          paymentStatus: 'paid',
          status: 'completed',
          notes: 'ແຈ້ງອອກສຳເລັດແລ້ວ',
          processedBy: 'ພະນັກງານແຜນກຕ້ອນຮັບ',
          processedAt: '2025-07-13T11:45:00Z',
          actualCheckOutTime: '2025-07-13T11:45:00Z',
          checkoutProcess: {
            roomInspection: true,
            billSettlement: true,
            keyReturn: true,
            finalInvoice: true
          }
        }
      ]
    }
  },
  
  computed: {
    maxDate() {
      return new Date().toISOString().split('T')[0]
    },
    
    filteredCheckouts() {
      return this.checkouts.filter(checkout => {
        const matchesSearch = !this.searchQuery || 
          checkout.roomNumber.toString().includes(this.searchQuery) ||
          checkout.customerName.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          checkout.bookingNumber.toLowerCase().includes(this.searchQuery.toLowerCase())
        
        let matchesStatus = true
        if (this.statusFilter) {
          if (this.statusFilter === 'overdue-12pm') {
            const now = new Date()
            const today = now.toISOString().split('T')[0]
            const deadline = new Date(today + 'T12:00:00')
            matchesStatus = checkout.status !== 'completed' && 
                          checkout.scheduledCheckOutDate === today && 
                          now > deadline
          } else {
            matchesStatus = checkout.status === this.statusFilter
          }
        }
        
        const matchesFloor = !this.floorFilter || checkout.roomNumber.toString().charAt(0) === this.floorFilter
        const matchesDate = !this.dateFilter || checkout.scheduledCheckOutDate === this.dateFilter
        
        return matchesSearch && matchesStatus && matchesFloor && matchesDate
      })
    },
    
    // DFD Dashboard Statistics
    readyToCheckOut() {
      return this.checkouts.filter(c => c.status === 'ready-checkout').length
    },
    
    processingCheckOut() {
      return this.checkouts.filter(c => c.status === 'processing').length
    },
    
    completedToday() {
      const today = new Date().toISOString().split('T')[0]
      return this.checkouts.filter(c => 
        c.status === 'completed' && 
        c.actualCheckOutTime && 
        c.actualCheckOutTime.startsWith(today)
      ).length
    },
    
    totalRevenue() {
      const today = new Date().toISOString().split('T')[0]
      return this.checkouts
        .filter(c => c.actualCheckOutTime && c.actualCheckOutTime.startsWith(today))
        .reduce((total, c) => total + c.totalAmount, 0)
    }
  },
  
  methods: {
    // DFD Process 5.1: ກວດສອບແຈ້ງອອກ
    processCheckOut(checkout) {
      if (confirm(`ຢືນຢັນການແຈ້ງອອກສຳລັບ ${checkout.customerName} ຫ້ອງ ${checkout.roomNumber}?`)) {
        checkout.status = 'processing'
        checkout.processedBy = 'ພະນັກງານແຜນກຕ້ອນຮັບ'
        checkout.processedAt = new Date().toISOString()
        
        // Start DFD Process 5 sequence
        this.executeProcess5Sequence(checkout)
      }
    },

    // DFD Process 5 Implementation
    executeProcess5Sequence(checkout) {
      // 5.1 ກວດສອບແຈ້ງອອກ
      setTimeout(() => {
        checkout.checkoutProcess.roomInspection = true
        this.updateDataStore('D2', { roomNumber: checkout.roomNumber, status: 'inspecting' })
      }, 1000)
      
      // 5.2 ປັບປຸງຂໍ້ມູນ
      setTimeout(() => {
        checkout.checkoutProcess.billSettlement = true
        this.updateDataStore('D2', { roomNumber: checkout.roomNumber, status: 'cleaning' })
      }, 2000)
      
      // 5.3 ປັບປຸງຂໍ້ມູນຄ່າບໍລິການ
      setTimeout(() => {
        checkout.checkoutProcess.keyReturn = true
        this.updateDataStore('D4', { 
          bookingNumber: checkout.bookingNumber,
          services: checkout.additionalCharges,
          status: 'completed'
        })
      }, 3000)
      
      // Final data store updates
      setTimeout(() => {
        checkout.checkoutProcess.finalInvoice = true
        checkout.status = 'completed'
        checkout.actualCheckOutTime = new Date().toISOString()
        
        // Update all DFD data stores
        this.updateDataStore('D2', { roomNumber: checkout.roomNumber, status: 'available' })
        this.updateDataStore('D3', { customerId: checkout.id, checkoutDate: new Date() })
        this.updateDataStore('D7', { 
          bookingNumber: checkout.bookingNumber,
          finalAmount: checkout.totalAmount,
          status: 'completed'
        })
        
        alert(`✅ ການແຈ້ງອອກສຳເລັດ!\n\nລູກຄ້າ: ${checkout.customerName}\nຫ້ອງ: ${checkout.roomNumber}\nDFD Process 5 ສຳເລັດທຸກຂັ້ນຕອນ`)
      }, 4000)
    },

    // DFD Data Store Update Function
    updateDataStore(store, data) {
      console.log(`Updating ${store}:`, data)
      // This would connect to actual data stores in real implementation
    },

    openPaymentModal(checkout) {
      // ສຳລັບການຈ່າຍເງິນສ່ວນທີ່ເຫຼືອ - ໃຊ້ DFD D7 (Payment Data)
      const remainingAmount = checkout.remainingAmount
      if (confirm(`ຢືນຢັນການຊຳລະເງິນ ${this.formatCurrency(remainingAmount)} ສຳລັບ ${checkout.customerName}?`)) {
        checkout.paidAmount += remainingAmount
        checkout.remainingAmount = 0
        checkout.paymentStatus = 'paid'
        
        // Update D7 Payment Data Store
        this.updateDataStore('D7', {
          bookingNumber: checkout.bookingNumber,
          paidAmount: checkout.paidAmount,
          paymentStatus: 'paid',
          paymentDate: new Date().toISOString()
        })
        
        alert('ການຊຳລະເງິນສຳເລັດ!')
      }
    },

    viewDetails(checkout) {
      this.selectedCheckout = checkout
      this.showDetailsModal = true
    },

    closeDetailsModal() {
      this.showDetailsModal = false
      this.selectedCheckout = null
    },

    printReceipt(checkout) {
      alert(`ກຳລັງພິມໃບເສັດສຳລັບ ${checkout.customerName}\nຫ້ອງ: ${checkout.roomNumber}\nເລກທີ: ${checkout.bookingNumber}`)
    },

    clearFilters() {
      this.searchQuery = ''
      this.statusFilter = ''
      this.floorFilter = ''
      this.dateFilter = ''
    },

    getCheckoutStatus(checkout) {
      const now = new Date()
      const today = now.toISOString().split('T')[0]
      const deadline = new Date(today + 'T12:00:00')
      
      if (checkout.scheduledCheckOutDate === today) {
        if (now > deadline && checkout.status !== 'completed') {
          return { message: 'ເກີນກຳນົດ 12 ໂມງ', color: '#dc3545' }
        } else if (now < deadline) {
          const hoursLeft = Math.ceil((deadline - now) / (1000 * 60 * 60))
          return { message: `ເຫຼືອ ${hoursLeft} ຊົ່ວໂມງ`, color: '#ffc107' }
        }
      }
      return { message: 'ປົກກະຕິ', color: '#28a745' }
    },

    getCheckoutTimeClass(checkout) {
      const status = this.getCheckoutStatus(checkout)
      if (status.color === '#dc3545') return 'overdue'
      if (status.color === '#ffc107') return 'urgent'
      return 'normal'
    },

    getStatusClass(status) {
      const classes = {
        'ready-checkout': 'status-ready',
        'processing': 'status-processing',
        'completed': 'status-completed',
        'late-checkout': 'status-late'
      }
      return classes[status] || 'status-default'
    },

    getStatusText(status) {
      const texts = {
        'ready-checkout': 'ພ້ອມແຈ້ງອອກ',
        'processing': 'ກຳລັງດຳເນີນການ',
        'completed': 'ແຈ້ງອອກແລ້ວ',
        'late-checkout': 'ແຈ້ງອອກລ່າຊ້າ'
      }
      return texts[status] || status
    },

    getPaymentStatusClass(status) {
      const classes = {
        'paid': 'payment-paid',
        'partial': 'payment-partial',
        'unpaid': 'payment-unpaid'
      }
      return classes[status] || 'payment-default'
    },

    getPaymentStatusText(status) {
      const texts = {
        'paid': 'ຈ່າຍຄົບແລ້ວ',
        'partial': 'ຈ່າຍບາງສ່ວນ',
        'unpaid': 'ຍັງບໍ່ຈ່າຍ'
      }
      return texts[status] || status
    },

    formatCurrency(amount) {
      return new Intl.NumberFormat('lo-LA', {
        style: 'currency',
        currency: 'LAK',
        minimumFractionDigits: 0
      }).format(amount)
    },

    formatDate(dateString) {
      return new Date(dateString).toLocaleDateString('lo-LA')
    },

    formatTime(timeString) {
      return timeString
    },

    formatDateTime(dateString) {
      return new Date(dateString).toLocaleString('lo-LA')
    }
  }
}
</script>

<style scoped>
/* CheckBooking.vue UI Pattern */
.checkout-management {
  padding: 20px;
  background-color: #f8f9fa;
}

/* Page Header */
.page-header {
  color: #094b91;
  padding: 24px;
  border-radius: 12px;
  margin-bottom: 24px;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-title h1 {
  margin: 0;
  font-size: 28px;
  font-weight: 600;
  color: #094b91;
}

.header-title h1 i {
  margin-right: 12px;
  color: #2f70b6;
}


/* Stats Grid */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 24px;
}

.stat-card {
  background: white;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  transition: all 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

.stat-icon {
  width: 60px;
  height: 60px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  color: white;
  margin-right: 16px;
}

.stat-card.checkout .stat-icon { background: linear-gradient(135deg, #28a745, #20c997); }
.stat-card.processing .stat-icon { background: linear-gradient(135deg, #ffc107, #fd7e14); }
.stat-card.completed .stat-icon { background: linear-gradient(135deg, #007bff, #6610f2); }
.stat-card.revenue .stat-icon { background: linear-gradient(135deg, #dc3545, #e83e8c); }

.stat-content {
  flex: 1;
}

.stat-number {
  font-size: 32px;
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 14px;
  color: #6c757d;
  font-weight: 500;
}

/* Search and Filters */
.search-filters {

  border-radius: 12px;
  margin-bottom: 24px;
  display: flex;
  gap: 16px;
  align-items: center;
  flex-wrap: wrap;
}

.search-box {
  position: relative;
  flex: 1;
  min-width: 300px;
}

.search-input {
  width: 100%;
  padding: 12px 40px 12px 16px;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  font-size: 14px;
  transition: all 0.3s ease;
}

.search-input:focus {
  outline: none;
  border-color: #2f70b6;
  box-shadow: 0 0 0 3px rgba(47, 112, 182, 0.1);
}

.search-icon {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #6c757d;
}

.filter-group {
  display: flex;
  gap: 12px;
  align-items: center;
  flex-wrap: wrap;
}

.filter-select,
.filter-date {
  padding: 10px 12px;
  border: 2px solid #e9ecef;
  border-radius: 6px;
  font-size: 14px;
  min-width: 120px;
}

/* Table Container */
.table-container {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.table-header {
  background: #2f70b6;
  color: white;
  padding: 16px 20px;
}

.table-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
}

.data-table th {
  background-color: #2f70b6;
  padding: 16px 12px;
  text-align: left;
  font-weight: 600;
  color: white;
  border: 1px solid #dee2e6;
  font-size: 14px;
}

.data-table td {
  padding: 16px 12px;
  border-bottom: 1px solid #dee2e6;
  font-size: 14px;
}

.data-table tbody tr:hover {
  background-color: #f8f9fa;
}

/* Room and Customer Info */
.room-info,
.customer-info,
.amount-info {
  display: flex;
  flex-direction: column;
}

.room-number,
.customer-name {
  font-weight: 600;
  color: #2c3e50;
}

.room-type,
.customer-phone {
  font-size: 12px;
  color: #6c757d;
  margin-top: 2px;
}

/* Amount Info */
.total-amount {
  font-weight: 600;
  color: #2c3e50;
  font-size: 14px;
}

.payment-status {
  font-size: 12px;
  color: #6c757d;
  margin-top: 2px;
}

.remaining-amount {
  font-size: 12px;
  color: #dc3545;
  font-weight: 600;
  margin-top: 2px;
}

/* Checkout Time */
.checkout-time {
  display: flex;
  flex-direction: column;
}

.deadline-info {
  margin-top: 4px;
  font-weight: 500;
}

.overdue { color: #dc3545; font-weight: 600; }
.urgent { color: #ffc107; font-weight: 600; }
.normal { color: #28a745; }

/* Status Badges */
.status-badge,
.payment-badge,
.payment-status-badge {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  text-transform: uppercase;
}

.status-ready { background: #d4edda; color: #155724; }
.status-processing { background: #fff3cd; color: #856404; }
.status-completed { background: #d1ecf1; color: #0c5460; }
.status-late { background: #f8d7da; color: #721c24; }

.payment-paid { background: #d4edda; color: #155724; }
.payment-partial { background: #fff3cd; color: #856404; }
.payment-unpaid { background: #f8d7da; color: #721c24; }

/* DFD Process Steps */
.dfd-process {
  display: flex;
  justify-content: center;
}

.process-steps {
  display: flex;
  gap: 8px;
}

.step {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #e9ecef;
  color: #6c757d;
  font-size: 12px;
  transition: all 0.3s ease;
}

.step.completed {
  background: #28a745;
  color: white;
}

/* Action Buttons */
.action-buttons {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.btn {
  padding: 8px 12px;
  border: none;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  text-decoration: none;
}

.btn-sm {
  padding: 6px 10px;
  font-size: 11px;
}

.btn-success { background: #28a745; color: white; }
.btn-warning { background: #ffc107; color: #212529; }
.btn-info { background: #17a2b8; color: white; }
.btn-secondary { background: #6c757d; color: white; }
.btn-outline { background: white; color: #6c757d; border: 1px solid #6c757d; }

.btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

/* Modal Styles */
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
}

.modal-content {
  background: white;
  border-radius: 12px;
  width: 90%;
  max-width: 800px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}

.modal-header {
  background: #2f70b6;
  color: white;
  padding: 20px;
  border-radius: 12px 12px 0 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h3 {
  margin: 0;
  font-size: 18px;
}

.modal-close {
  background: none;
  border: none;
  color: white;
  font-size: 20px;
  cursor: pointer;
  padding: 0;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.3s ease;
}

.modal-close:hover {
  background: rgba(255, 255, 255, 0.2);
}

.modal-body {
  padding: 24px;
}

.detail-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
  margin-bottom: 24px;
}

.detail-section h4 {
  color: #2f70b6;
  margin-bottom: 16px;
  font-size: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid #f0f0f0;
}

.detail-item:last-child {
  border-bottom: none;
}

.detail-item label {
  font-weight: 500;
  color: #6c757d;
  min-width: 120px;
}

.total-amount {
  color: #28a745;
  font-weight: 600;
}

.remaining-amount {
  color: #dc3545;
  font-weight: 600;
}

/* Process Tracking */
.process-tracking {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.process-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border-radius: 8px;
  background: #f8f9fa;
  transition: all 0.3s ease;
}

.process-item.completed {
  background: #d4edda;
  color: #155724;
}

.process-item i {
  width: 24px;
  text-align: center;
}

.process-item span {
  font-weight: 500;
  margin-bottom: 2px;
}

.process-item small {
  display: block;
  color: #6c757d;
  font-size: 11px;
}

.notes-section {
  background: #f8f9fa;
  padding: 16px;
  border-radius: 8px;
  margin-top: 16px;
}

.notes-section h4 {
  color: #2f70b6;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.modal-footer {
  padding: 20px;
  border-top: 1px solid #dee2e6;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

/* No Data */
.no-data {
  text-align: center;
  padding: 40px;
  color: #6c757d;
}

.no-data i {
  font-size: 48px;
  margin-bottom: 16px;
  opacity: 0.5;
}

/* Responsive */
@media (max-width: 768px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }
  
  .search-filters {
    flex-direction: column;
    align-items: stretch;
  }
  
  .filter-group {
    justify-content: center;
  }
  
  .data-table {
    font-size: 12px;
  }
  
  .data-table th,
  .data-table td {
    padding: 8px 6px;
  }
  
  .action-buttons {
    flex-direction: column;
  }
  
  .detail-grid {
    grid-template-columns: 1fr;
  }
}
</style>
