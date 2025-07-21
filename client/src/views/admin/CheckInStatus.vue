<template>
  <div class="checkout-management">
    <!-- Page Header -->
    <div class="page-header">
      <div class="header-content">
        <div class="header-title">
          <h1><i class="fas fa-sign-out-alt"></i> ກວດສອບແຈ້ງອອກ</h1>
          <div class="checkout-policy">
            <i class="fas fa-clock"></i>
            <span>ນະໂຍບາຍ: ກຳນົດແຈ້ງອອກຕອນ 12:00 ໂມງ</span>
          </div>
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
          <option value="urgent-12pm">ໃກ້ກຳນົດ 12 ໂມງ</option>
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

    <!-- Main Content Table -->
    <div class="table-container">
      <table class="data-table">
        <thead>
          <tr>
            <th>ຫ້ອງ</th>
            <th>ລູກຄ້າ</th>
            <th>ວັນທີແຈ້ງເຂົ້າ</th>
            <th>ກຳນົດແຈ້ງອອກ</th>
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
                  :title="getActionTooltip(checkout, 'checkout')"
                >
                  <i class="fas fa-sign-out-alt"></i>
                  <span class="btn-text">ແຈ້ງອອກ</span>
                </button>
                
                <button 
                  v-if="checkout.paymentStatus !== 'paid'"
                  @click="openPaymentModal(checkout)"
                  class="btn btn-warning btn-sm"
                  :title="getActionTooltip(checkout, 'payment')"
                >
                  <i class="fas fa-credit-card"></i>
                  <span class="btn-text">ຊຳລະ {{ formatCurrency(checkout.remainingAmount) }}</span>
                </button>
                
                <button 
                  @click="viewDetails(checkout)"
                  class="btn btn-info btn-sm"
                  :title="getActionTooltip(checkout, 'details')"
                >
                  <i class="fas fa-eye"></i>
                  <span class="btn-text">ລາຍລະອຽດ</span>
                </button>
                
                <button 
                  v-if="checkout.status === 'completed'"
                  @click="printReceipt(checkout)"
                  class="btn btn-secondary btn-sm"
                  :title="getActionTooltip(checkout, 'print')"
                >
                  <i class="fas fa-print"></i>
                  <span class="btn-text">ພິມໃບເສັດ</span>
                </button>
                
                <button 
                  v-if="checkout.status === 'processing'"
                  @click="viewProcessStatus(checkout)"
                  class="btn btn-primary btn-sm"
                  :title="getActionTooltip(checkout, 'process')"
                >
                  <i class="fas fa-tasks"></i>
                  <span class="btn-text">ສະຖານະ</span>
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
          <h3><i class="fas fa-info-circle"></i> ລາຍລະອຽດການແຈ້ງອອກ</h3>
          <button @click="closeDetailsModal" class="modal-close">
            <i class="fas fa-times"></i>
          </button>
        </div>
        
        <div class="modal-body" v-if="selectedCheckout">
          <div class="detail-grid">
            <div class="detail-section">
              <h4>ຂໍ້ມູນລູກຄ້າ</h4>
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
              <h4>ຂໍ້ມູນການພັກ</h4>
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
              <h4>ຂໍ້ມູນການເງິນ</h4>
              <div class="detail-item">
                <label>ຄ່າຫ້ອງ:</label>
                <span>{{ formatCurrency(selectedCheckout.roomPrice) }} / ຄືນ</span>
              </div>
              <div class="detail-item">
                <label>ຄ່າບໍລິການເພີ່ມເຕີມ:</label>
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
              <div class="detail-item">
                <label>ຍັງເຫຼືອ:</label>
                <span class="remaining-amount">{{ formatCurrency(selectedCheckout.remainingAmount) }}</span>
              </div>
            </div>
          </div>
          
          <div v-if="selectedCheckout.notes" class="notes-section">
            <h4>ໝາຍເຫດ</h4>
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
  name: 'CheckInStatus',
  data() {
    return {
      searchQuery: '',
      statusFilter: '',
      floorFilter: '',
      dateFilter: '',
      showDetailsModal: false,
      selectedCheckout: null,
      
      // DFD Process 5 - ແຈ້ງອອກ Data
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
          scheduledCheckOutTime: '12:00', // ກຳນົດແຈ້ງອອກຕອນ 12 ໂມງ
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
            roomInspection: false,
            billSettlement: true,
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
          scheduledCheckOutTime: '12:00', // ກຳນົດແຈ້ງອອກຕອນ 12 ໂມງ
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
          roomNumber: '308',
          roomType: 'Triple room',
          customerName: 'ນາງ ລັດຕະນາ ສີວິໄລ',
          customerPhone: '020-77889900',
          customerEmail: 'lattana@email.com',
          idCardNumber: '3456789012345',
          nationality: 'ລາວ',
          actualCheckInTime: '2025-07-12T13:00:00Z',
          scheduledCheckOutDate: '2025-07-13',
          scheduledCheckOutTime: '12:00', // ແຈ້ງອອກລ່າຊ້າ - ເກີນ 12 ໂມງແລ້ວ
          totalNights: 1,
          roomPrice: 700000,
          additionalCharges: 0,
          totalAmount: 700000,
          paidAmount: 700000,
          remainingAmount: 0,
          paymentStatus: 'paid',
          status: 'late-checkout',
          notes: 'ແຈ້ງອອກລ່າຊ້າ - ຄິດຄ່າປັບ',
          processedBy: null,
          processedAt: null,
          actualCheckOutTime: null,
          checkoutProcess: {
            roomInspection: false,
            billSettlement: true,
            keyReturn: false,
            finalInvoice: false
          }
        },
        {
          id: 5,
          bookingNumber: 'BK005',
          roomNumber: '401',
          roomType: 'Double Room',
          customerName: 'ທ້າວ ວິຣະພອນ ໄຊຍະສິດ',
          customerPhone: '020-33445566',
          customerEmail: 'viraphon@email.com',
          idCardNumber: '4567890123456',
          nationality: 'ລາວ',
          actualCheckInTime: '2025-07-12T14:30:00Z',
          scheduledCheckOutDate: '2025-07-13',
          scheduledCheckOutTime: '12:00', // ກຳນົດແຈ້ງອອກຕອນ 12 ໂມງ
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
      // DFD Process 5: ການກັ່ນຕອງຂໍ້ມູນການແຈ້ງອອກ
      // ສະແດງແຕ່ລູກຄ້າທີ່ພ້ອມແຈ້ງອອກເທົ່ານັ້ນ
      return this.checkouts.filter(checkout => {
        // ສະແດງແຕ່ສະຖານະ 'ready-checkout' ເທົ່ານັ້ນ
        const isReadyCheckout = checkout.status === 'ready-checkout'
        
        if (!isReadyCheckout) {
          return false
        }
        
        const matchesSearch = !this.searchQuery || 
          checkout.roomNumber.toString().includes(this.searchQuery) ||
          checkout.customerName.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          checkout.bookingNumber.toLowerCase().includes(this.searchQuery.toLowerCase())
        
        const matchesFloor = !this.floorFilter || checkout.roomNumber.toString().charAt(0) === this.floorFilter
        const matchesDate = !this.dateFilter || checkout.scheduledCheckOutDate === this.dateFilter
        
        return matchesSearch && matchesFloor && matchesDate
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
      // ລາຍຮັບມື້ນີ້ຈາກການແຈ້ງອອກ (D7 Payment Data)
      const today = new Date().toISOString().split('T')[0]
      return this.checkouts
        .filter(c => c.actualCheckOutTime && c.actualCheckOutTime.startsWith(today))
        .reduce((total, c) => total + c.totalAmount, 0)
    },

    // ສະຖິຕິການແຈ້ງອອກຕາມເວລາກຳນົດ 12 ໂມງ
    overdueCheckouts() {
      const now = new Date()
      const today = now.toISOString().split('T')[0]
      const deadline = new Date(today + 'T12:00:00')
      
      return this.checkouts.filter(c => 
        c.status !== 'completed' && 
        c.scheduledCheckOutDate === today && 
        now > deadline
      ).length
    },

    urgentCheckouts() {
      const now = new Date()
      const today = now.toISOString().split('T')[0]
      const deadline = new Date(today + 'T12:00:00')
      const timeUntilDeadline = deadline.getTime() - now.getTime()
      
      return this.checkouts.filter(c => 
        c.status !== 'completed' && 
        c.scheduledCheckOutDate === today && 
        timeUntilDeadline > 0 && 
        timeUntilDeadline < 1800000 // 30 minutes
      ).length
    }
  },
  
  methods: {
    // DFD Process 5.1: ກວດສອບແຈ້ງອອກ
    validateCheckOutData(checkoutData) {
      const errors = []
      
      // ກວດສອບການຊຳລະເງິນ (from D7)
      if (checkoutData.remainingAmount > 0) {
        errors.push('ຍັງມີເງິນຄ້າງຊຳລະ')
      }
      
      // ກວດສອບການກວດຫ້ອງ (from D2)
      if (!checkoutData.checkoutProcess.roomInspection) {
        errors.push('ຍັງບໍ່ໄດ້ກວດຫ້ອງ')
      }
      
      // ກວດສອບການສົ່ງກະແຈ
      if (!checkoutData.checkoutProcess.keyReturn) {
        errors.push('ຍັງບໍ່ໄດ້ສົ່ງກະແຈ')
      }
      
      return {
        isValid: errors.length === 0,
        errors: errors
      }
    },

    // DFD Process 5.2: ປັບປຸງຂໍ້ມູນ
    processRoomUpdate(roomNumber, status) {
      // ອັບເດດສະຖານະຫ້ອງໃນ D2 (Room Data Store)
      console.log(`Processing room update for ${roomNumber}: ${status}`)
      // Update room status to cleaning after checkout
      // This connects to D2 data store in the DFD
    },

    // DFD Process 5.3: ປັບປຸງຂໍ້ມູນຄ່າບໍລິການ
    processServiceUpdate(checkoutData) {
      // ອັບເດດຂໍ້ມູນບໍລິການໃນ D4 (Service Data Store)
      console.log('Processing service update for:', checkoutData.bookingNumber)
      
      const serviceData = {
        bookingNumber: checkoutData.bookingNumber,
        roomNumber: checkoutData.roomNumber,
        services: checkoutData.additionalCharges || 0,
        processedAt: new Date().toISOString(),
        processedBy: 'ພະນັກງານແຜນກຕ້ອນຮັບ'
      }
      
      // Update D4 service data store
      this.updateDataStore('D4', serviceData)
      return serviceData
    },

    processCheckOut(checkout) {
      // ສະແດງຂໍ້ມູນລາຍລະອຽດກ່ອນການຢືນຢັນ
      const timeStatus = this.getCheckoutStatus(checkout)
      let confirmMessage = `🏨 ຢືນຢັນການແຈ້ງອອກ\n\n`
      confirmMessage += `👤 ລູກຄ້າ: ${checkout.customerName}\n`
      confirmMessage += `🚪 ຫ້ອງ: ${checkout.roomNumber} (${checkout.roomType})\n`
      confirmMessage += `⏰ ${timeStatus.message}\n`
      confirmMessage += `💰 ຍອດລວມ: ${this.formatCurrency(checkout.totalAmount)}\n`
      
      if (checkout.remainingAmount > 0) {
        confirmMessage += `⚠️ ຍັງເຫຼືອຄ່າໃຊ້ຈ່າຍ: ${this.formatCurrency(checkout.remainingAmount)}\n`
      } else {
        confirmMessage += `✅ ຊຳລະຄົບແລ້ວ\n`
      }
      
      confirmMessage += `\n📋 ການກວດສອບ:\n`
      const validation = this.validateCheckOutData(checkout)
      if (!validation.isValid) {
        confirmMessage += `❌ ພົບບັນຫາ:\n${validation.errors.map(err => `   • ${err}`).join('\n')}\n\n`
        confirmMessage += `ທ່ານຕ້ອງການແກ້ໄຂບັນຫາເຫຼົ່ານີ້ກ່ອນບໍ?`
      } else {
        confirmMessage += `✅ ທຸກຢ່າງພ້ອມສຳລັບການແຈ້ງອອກ\n\n`
        confirmMessage += `ຕ້ອງການດຳເນີນການແຈ້ງອອກບໍ?`
      }
      
      if (confirm(confirmMessage)) {
        if (!validation.isValid) {
          this.showMessage('ກະລຸນາແກ້ໄຂບັນຫາກ່ອນການແຈ້ງອອກ:\n' + validation.errors.join('\n'), 'error')
          return
        }
        
        // Process 5.1: ກວດສອບແຈ້ງອອກ
        checkout.status = 'processing'
        checkout.processedBy = 'ພະນັກງານແຜນກຕ້ອນຮັບ'
        checkout.processedAt = new Date().toISOString()
        
        this.showMessage(`🔄 ເລີ່ມຕົ້ນການແຈ້ງອອກສຳລັບ ${checkout.customerName}\nຫ້ອງ: ${checkout.roomNumber}\nກະລຸນາລໍຖ້າ...`, 'info')
        
        // Simulate checkout process with detailed steps
        let step = 1
        const totalSteps = 4
        
        setTimeout(() => {
          checkout.checkoutProcess.roomInspection = true
          this.showMessage(`✅ ຂັ້ນຕອນ ${step}/${totalSteps}: ກວດສອບຫ້ອງສຳເລັດ\n🔍 ກວດສອບສະພາບຫ້ອງ, ອຸປະກອນ`, 'info')
          step++
          
          setTimeout(() => {
            checkout.checkoutProcess.keyReturn = true
            this.showMessage(`✅ ຂັ້ນຕອນ ${step}/${totalSteps}: ຮັບກະແຈສຳເລັດ\n🔑 ຮັບກະແຈຫ້ອງແລະກະແຈເສີມ`, 'info')
            step++
            
            setTimeout(() => {
              checkout.checkoutProcess.finalInvoice = true
              this.showMessage(`✅ ຂັ້ນຕອນ ${step}/${totalSteps}: ອອກໃບເສັດສຳເລັດ\n📄 ສ້າງໃບເສັດສຸດທ້າຍ`, 'info')
              step++
              
              setTimeout(() => {
                // Process 5.2: ປັບປຸງຂໍ້ມູນ (Room Data)
                this.processRoomUpdate(checkout.roomNumber, 'cleaning')
                
                // Process 5.3: ປັບປຸງຂໍ້ມູນຄ່າບໍລິການ
                this.processServiceUpdate(checkout)
                
                // Complete checkout
                checkout.status = 'completed'
                checkout.actualCheckOutTime = new Date().toISOString()
                checkout.checkoutProcess.billSettlement = true
                
                let successMessage = `🎉 ແຈ້ງອອກສຳເລັດ!\n\n`
                successMessage += `👤 ລູກຄ້າ: ${checkout.customerName}\n`
                successMessage += `🚪 ຫ້ອງ: ${checkout.roomNumber}\n`
                successMessage += `⏰ ເວລາແຈ້ງອອກ: ${this.formatDateTime(checkout.actualCheckOutTime)}\n`
                successMessage += `💰 ຍອດເງິນ: ${this.formatCurrency(checkout.totalAmount)}\n`
                successMessage += `🧹 ສະຖານະຫ້ອງ: ສົ່ງທຳຄວາມສະອາດ\n`
                successMessage += `📄 ໃບເສັດພ້ອມພິມ`
                
                this.showMessage(successMessage, 'success')
                
                // Auto close details modal if open
                if (this.showDetailsModal && this.selectedCheckout?.id === checkout.id) {
                  this.closeDetailsModal()
                }
              }, 1000)
            }, 1000)
          }, 1000)
        }, 1000)
      }
    },

    openPaymentModal(checkout) {
      // ສຳລັບການຊຳລະເງິນສ່ວນທີ່ເຫຼືອ - ໃຊ້ DFD D7 (Payment Data)
      let paymentInfo = `💳 ການຊຳລະເງິນ\n\n`
      paymentInfo += `👤 ລູກຄ້າ: ${checkout.customerName}\n`
      paymentInfo += `🚪 ຫ້ອງ: ${checkout.roomNumber}\n`
      paymentInfo += `💰 ຍອດລວມ: ${this.formatCurrency(checkout.totalAmount)}\n`
      paymentInfo += `✅ ຊຳລະແລ້ວ: ${this.formatCurrency(checkout.paidAmount)}\n`
      paymentInfo += `⚠️ ຍັງເຫຼືອ: ${this.formatCurrency(checkout.remainingAmount)}\n\n`
      
      if (checkout.additionalCharges > 0) {
        paymentInfo += `📝 ລາຍການຄ່າໃຊ້ຈ່າຍເພີ່ມເຕີມ:\n`
        paymentInfo += `   • ຄ່າບໍລິການ: ${this.formatCurrency(checkout.additionalCharges)}\n\n`
      }
      
      paymentInfo += `ລະບົບການຊຳລະເງິນກຳລັງພັດທະນາ\nຈະສາມາດຮັບຊຳລະດ້ວຍ:\n• ເງິນສົດ\n• ບັດເຄຣດິດ\n• ໂອນເງິນ\n• QR Code`
      
      this.showMessage(paymentInfo, 'info')
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
      // ພິມໃບເສັດການແຈ້ງອອກ
      let receiptInfo = `🧾 ໃບເສັດການແຈ້ງອອກ\n\n`
      receiptInfo += `===========================================\n`
      receiptInfo += `🏨 [ຊື່ໂຮງແຮມ]\n`
      receiptInfo += `📍 [ທີ່ຢູ່ໂຮງແຮມ]\n`
      receiptInfo += `☎️ [ເບີໂທໂຮງແຮມ]\n`
      receiptInfo += `===========================================\n\n`
      
      receiptInfo += `📄 ເລກທີໃບເສັດ: ${checkout.bookingNumber}-OUT\n`
      receiptInfo += `📅 ວັນທີອອກໃບເສັດ: ${this.formatDateTime(new Date())}\n\n`
      
      receiptInfo += `👤 ຂໍ້ມູນລູກຄ້າ:\n`
      receiptInfo += `   • ຊື່: ${checkout.customerName}\n`
      receiptInfo += `   • ເບີໂທ: ${checkout.customerPhone}\n`
      receiptInfo += `   • ສັນຊາດ: ${checkout.nationality}\n\n`
      
      receiptInfo += `🏠 ຂໍ້ມູນການພັກ:\n`
      receiptInfo += `   • ຫ້ອງ: ${checkout.roomNumber} (${checkout.roomType})\n`
      receiptInfo += `   • ເຂົ້າພັກ: ${this.formatDateTime(checkout.actualCheckInTime)}\n`
      receiptInfo += `   • ອອກພັກ: ${this.formatDateTime(checkout.actualCheckOutTime)}\n`
      receiptInfo += `   • ຈໍານວນຄືນ: ${checkout.totalNights} ຄືນ\n\n`
      
      receiptInfo += `💰 ລາຍການຄ່າໃຊ້ຈ່າຍ:\n`
      receiptInfo += `   • ຄ່າຫ້ອງ (${checkout.totalNights} ຄືນ): ${this.formatCurrency(checkout.roomPrice * checkout.totalNights)}\n`
      if (checkout.additionalCharges > 0) {
        receiptInfo += `   • ຄ່າບໍລິການເພີ່ມເຕີມ: ${this.formatCurrency(checkout.additionalCharges)}\n`
      }
      receiptInfo += `   • ລວມທັງໝົດ: ${this.formatCurrency(checkout.totalAmount)}\n`
      receiptInfo += `   • ຊຳລະແລ້ວ: ${this.formatCurrency(checkout.paidAmount)}\n`
      if (checkout.remainingAmount > 0) {
        receiptInfo += `   • ຍັງເຫຼືອ: ${this.formatCurrency(checkout.remainingAmount)}\n`
      }
      
      receiptInfo += `\n===========================================\n`
      receiptInfo += `🙏 ຂໍຂອບໃຈທີ່ມາພັກທີ່ໂຮງແຮມຂອງພວກເຮົາ\n`
      receiptInfo += `⭐ ຫວັງວ່າຈະໄດ້ຕ້ອນຮັບອີກ\n`
      receiptInfo += `===========================================`
      
      alert(receiptInfo)
      this.showMessage('ກຳລັງເປີດໜ້າຕ່າງພິມ...', 'info')
      
      // Simulate print dialog
      setTimeout(() => {
        window.print()
      }, 1000)
    },

    refreshData() {
      // ໂຫຼດຂໍ້ມູນໃໝ່ຈາກ DFD Data Stores
      let refreshInfo = `🔄 ໂຫຼດຂໍ້ມູນໃໝ່\n\n`
      refreshInfo += `📊 ກຳລັງອັບເດດ:\n`
      refreshInfo += `• D2: ຂໍ້ມູນຫ້ອງພັກ\n`
      refreshInfo += `• D3: ຂໍ້ມູນລູກຄ້າ\n`
      refreshInfo += `• D4: ຂໍ້ມູນບໍລິການ\n`
      refreshInfo += `• D7: ຂໍ້ມູນການຊຳລະເງິນ\n\n`
      refreshInfo += `⏰ ເວລາອັບເດດ: ${this.formatDateTime(new Date())}\n`
      refreshInfo += `✅ ອັບເດດສຳເລັດ`
      
      this.showMessage(refreshInfo, 'success')
    },

    clearFilters() {
      this.searchQuery = ''
      this.statusFilter = ''
      this.floorFilter = ''
      this.dateFilter = ''
    },

    // Helper Methods
    getStatusText(status) {
      const statusMap = {
        'ready-checkout': 'ພ້ອມແຈ້ງອອກ',
        'processing': 'ກຳລັງດຳເນີນການ', 
        'completed': 'ແຈ້ງອອກແລ້ວ',
        'late-checkout': 'ແຈ້ງອອກລ່າຊ້າ'
      }
      return statusMap[status] || status
    },

    getPaymentStatusText(status) {
      const statusMap = {
        'unpaid': 'ຍັງບໍ່ຊຳລະ',
        'partial': 'ຊຳລະບາງສ່ວນ',
        'paid': 'ຊຳລະຄົບແລ້ວ'
      }
      return statusMap[status] || status
    },

    getStatusClass(status) {
      switch (status) {
        case 'ready-checkout': return 'status-ready';
        case 'processing': return 'status-processing';
        case 'completed': return 'status-completed';
        case 'late-checkout': return 'status-late';
        default: return 'status-default';
      }
    },

    getPaymentStatusClass(status) {
      switch (status) {
        case 'unpaid': return 'payment-unpaid';
        case 'partial': return 'payment-partial';
        case 'paid': return 'payment-paid';
        default: return 'payment-default';
      }
    },

    getCheckoutTimeClass(checkout) {
      const now = new Date()
      const scheduledTime = new Date(checkout.scheduledCheckOutDate + 'T' + checkout.scheduledCheckOutTime)
      
      if (checkout.status === 'completed') return 'time-completed'
      if (now > scheduledTime) return 'time-late'
      
      // ກຳນົດແຈ້ງອອກຕອນ 12 ໂມງ - ແຈ້ງເຕືອນເມື່ອໃກ້ເວລາ
      const timeDiff = scheduledTime.getTime() - now.getTime()
      if (timeDiff < 3600000 && timeDiff > 0) return 'time-soon' // within 1 hour
      if (timeDiff < 7200000 && timeDiff > 0) return 'time-warning' // within 2 hours
      
      return 'time-normal'
    },

    // ກວດສອບການແຈ້ງອອກຕາມເວລາກຳນົດ (12 ໂມງ)
    getCheckoutStatus(checkout) {
      const now = new Date()
      const scheduledTime = new Date(checkout.scheduledCheckOutDate + 'T' + checkout.scheduledCheckOutTime)
      const checkoutDeadline = new Date(checkout.scheduledCheckOutDate + 'T12:00:00') // ກຳນົດແຈ້ງອອກຕອນ 12 ໂມງ
      
      if (checkout.status === 'completed') {
        return {
          status: 'completed',
          message: 'ແຈ້ງອອກສຳເລັດແລ້ວ',
          color: '#28a745'
        }
      }
      
      if (now > checkoutDeadline) {
        return {
          status: 'overdue',
          message: 'ເກີນກຳນົດແຈ້ງອອກ (12:00)',
          color: '#dc3545'
        }
      }
      
      const timeUntilDeadline = checkoutDeadline.getTime() - now.getTime()
      const hoursLeft = Math.floor(timeUntilDeadline / (1000 * 60 * 60))
      const minutesLeft = Math.floor((timeUntilDeadline % (1000 * 60 * 60)) / (1000 * 60))
      
      if (timeUntilDeadline < 1800000) { // 30 minutes
        return {
          status: 'urgent',
          message: `ຕ້ອງແຈ້ງອອກໃນ ${minutesLeft} ນາທີ`,
          color: '#dc3545'
        }
      } else if (timeUntilDeadline < 3600000) { // 1 hour
        return {
          status: 'soon',
          message: `ຕ້ອງແຈ້ງອອກໃນ ${minutesLeft} ນາທີ`,
          color: '#ffc107'
        }
      } else if (timeUntilDeadline < 7200000) { // 2 hours
        return {
          status: 'warning',
          message: `ຕ້ອງແຈ້ງອອກໃນ ${hoursLeft} ຊົ່ວໂມງ`,
          color: '#fd7e14'
        }
      }
      
      return {
        status: 'normal',
        message: `ແຈ້ງອອກກ່ອນ 12:00 ໂມງ`,
        color: '#28a745'
      }
    },

    formatDate(date) {
      if (!date) return '-'
      return new Date(date).toLocaleDateString('lo-LA')
    },

    formatTime(time) {
      if (!time) return '-'
      return time
    },

    formatDateTime(datetime) {
      if (!datetime) return '-'
      return new Date(datetime).toLocaleString('lo-LA')
    },

    formatCurrency(amount) {
      if (!amount) return '0 ₭'
      return new Intl.NumberFormat('lo-LA').format(amount) + ' ₭'
    },

    showMessage(text, type = 'success') {
      // ສະແດງຂໍ້ຄວາມແຈ້ງເຕືອນ
      alert(text)
    },

    // DFD Data Store Management Methods
    updateDataStore(storeType, data) {
      // จัดการ Data Stores ตาม DFD Level 2 Process 5
      switch(storeType) {
        case 'D2': // Room Data
          console.log('Updating D2 (Room Data Store):', data)
          break
        case 'D3': // Customer Data  
          console.log('Updating D3 (Customer Data Store):', data)
          break
        case 'D4': // Service Data
          console.log('Updating D4 (Service Data Store):', data)
          break
        case 'D7': // Payment Data
          console.log('Updating D7 (Payment Data Store):', data)
          break
        default:
          console.warn('ບໍ່ພົບ Data Store:', storeType)
      }
    },

    // ສ້າງຂໍ້ຄວາມລາຍລະອຽດສຳລັບ tooltips
    getActionTooltip(checkout, action) {
      const timeStatus = this.getCheckoutStatus(checkout)
      
      switch(action) {
        case 'checkout':
          let checkoutMessage = `ດຳເນີນການແຈ້ງອອກສຳລັບ ${checkout.customerName}\n`
          checkoutMessage += `ຫ້ອງ: ${checkout.roomNumber} (${checkout.roomType})\n`
          checkoutMessage += `${timeStatus.message}\n`
          
          if (checkout.remainingAmount > 0) {
            checkoutMessage += `⚠️ ຍັງເຫຼືອຄ່າໃຊ້ຈ່າຍ: ${this.formatCurrency(checkout.remainingAmount)}\n`
          }
          
          const validation = this.validateCheckOutData(checkout)
          if (!validation.isValid) {
            checkoutMessage += `❌ ບໍ່ສາມາດແຈ້ງອອກໄດ້:\n${validation.errors.join('\n')}`
          } else {
            checkoutMessage += `✅ ພ້ອມແຈ້ງອອກ`
          }
          
          return checkoutMessage
          
        case 'payment':
          return `ຊຳລະເງິນສ່ວນທີ່ເຫຼືອ\nຍອດທີ່ຕ້ອງຊຳລະ: ${this.formatCurrency(checkout.remainingAmount)}\nຈາກຍອດລວມ: ${this.formatCurrency(checkout.totalAmount)}`
          
        case 'details':
          return `ເບິ່ງລາຍລະອຽດການພັກຂອງ ${checkout.customerName}\nຫ້ອງ: ${checkout.roomNumber}\nສະຖານະ: ${this.getStatusText(checkout.status)}\nການຊຳລະ: ${this.getPaymentStatusText(checkout.paymentStatus)}`
          
        case 'print':
          return `ພິມໃບເສັດການແຈ້ງອອກ\nລູກຄ້າ: ${checkout.customerName}\nຫ້ອງ: ${checkout.roomNumber}\nແຈ້ງອອກເມື່ອ: ${this.formatDateTime(checkout.actualCheckOutTime)}`
          
        case 'process':
          const process = checkout.checkoutProcess
          let processStatus = `ສະຖານະການດຳເນີນການ:\n`
          processStatus += `🔍 ກວດຫ້ອງ: ${process.roomInspection ? '✅ ແລ້ວ' : '❌ ຍັງ'}\n`
          processStatus += `💰 ຮັບເງິນ: ${process.billSettlement ? '✅ ແລ້ວ' : '❌ ຍັງ'}\n`
          processStatus += `🔑 ຮັບກະແຈ: ${process.keyReturn ? '✅ ແລ້ວ' : '❌ ຍັງ'}\n`
          processStatus += `📄 ໃບເສັດ: ${process.finalInvoice ? '✅ ແລ້ວ' : '❌ ຍັງ'}`
          return processStatus
          
        default:
          return ''
      }
    },

    // ຀ບິ່ງສະຖານະການດຳເນີນການ
    viewProcessStatus(checkout) {
      const process = checkout.checkoutProcess
      let statusMessage = `ສະຖານະການດຳເນີນການແຈ້ງອອກ:\n\n`
      statusMessage += `🏨 ລູກຄ້າ: ${checkout.customerName}\n`
      statusMessage += `🚪 ຫ້ອງ: ${checkout.roomNumber} (${checkout.roomType})\n`
      statusMessage += `⏰ ເລີ່ມດຳເນີນການ: ${this.formatDateTime(checkout.processedAt)}\n`
      statusMessage += `👤 ດຳເນີນການໂດຍ: ${checkout.processedBy}\n\n`
      
      statusMessage += `📋 ຂັ້ນຕອນການດຳເນີນການ:\n`
      statusMessage += `${process.roomInspection ? '✅' : '🔲'} 1. ກວດສອບຫ້ອງພັກ\n`
      statusMessage += `${process.billSettlement ? '✅' : '🔲'} 2. ຮັບເງິນຄ່າໃຊ້ຈ່າຍ\n`
      statusMessage += `${process.keyReturn ? '✅' : '🔲'} 3. ຮັບກະແຈຫ້ອງ\n`
      statusMessage += `${process.finalInvoice ? '✅' : '🔲'} 4. ອອກໃບເສັດ\n\n`
      
      const completedSteps = Object.values(process).filter(step => step === true).length
      statusMessage += `📊 ຄວາມຄືບໜ້າ: ${completedSteps}/4 ຂັ້ນຕອນ (${Math.round(completedSteps/4*100)}%)`
      
      alert(statusMessage)
    },

    // ...existing code...
  }
}
</script>

<style scoped>
.checkout-management {
  padding: 20px;
  background-color: #f8f9fa;
  min-height: 100vh;
}

/* Page Header - ตาม CheckBooking.vue pattern */
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
  display: flex;
  align-items: center;
  gap: 12px;
}

.header-title p {
  margin: 8px 0 0 0;
  opacity: 0.9;
  font-size: 14px;
}

.checkout-policy {
  margin-top: 8px;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  opacity: 0.95;
  background: rgba(255, 255, 255, 0.1);
  padding: 6px 12px;
  border-radius: 6px;
  border-left: 3px solid #ffc107;
}

.header-actions .btn {

  border: 1px solid#094b91;
  color:#094b91;
  padding: 8px 16px;
  border-radius: 6px;
  transition: all 0.3s ease;
}

.header-actions .btn:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateY(-1px);
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
  gap: 16px;
  transition: transform 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-2px);
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
}

.checkout-icon { background: linear-gradient(135deg, #28a745, #20c997); }
.processing-icon { background: linear-gradient(135deg, #ffc107, #fd7e14); }
.completed-icon { background: linear-gradient(135deg, #007bff, #6610f2); }
.revenue-icon { background: linear-gradient(135deg, #dc3545, #e83e8c); }

.stat-content {
  flex: 1;
}

.stat-number {
  font-size: 32px;
  font-weight: 700;
  color: #2c3e50;
  line-height: 1;
}

.stat-label {
  font-size: 14px;
  color: #6c757d;
  margin-top: 4px;
}

/* Search and Filters */
.search-filters {
  background: white;
  padding: 20px;
  border-radius: 12px;
  margin-bottom: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
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
  padding: 12px 16px 12px 44px;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  font-size: 14px;
  transition: border-color 0.3s ease;
}

.search-input:focus {
  outline: none;
  border-color: #2f70b6;
}

.search-icon {
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  color: #6c757d;
}

.filter-group {
  display: flex;
  gap: 12px;
  align-items: center;
}

.filter-select, .filter-date {
  padding: 8px 12px;
  border: 2px solid #e9ecef;
  border-radius: 6px;
  font-size: 14px;
  min-width: 140px;
}

.filter-select:focus, .filter-date:focus {
  outline: none;
  border-color: #2f70b6;
}

/* Table */
.table-container {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.data-table {
  width: 100%;
  border-collapse: collapse;
}

.data-table th {
  background: #2f70b6;
  color: white;
  padding: 16px 12px;
  text-align: left;
  font-weight: 600;
  font-size: 14px;
}

.data-table td {
  padding: 16px 12px;
  border-bottom: 1px solid #e9ecef;
  vertical-align: middle;
}

.data-table tr:hover {
  background-color: #f8f9fa;
}

.room-info {
  display: flex;
  flex-direction: column;
}

.room-number {
  font-weight: 600;
  color: #2c3e50;
  font-size: 16px;
}

.room-type {
  color: #6c757d;
  font-size: 12px;
}

.customer-info {
  display: flex;
  flex-direction: column;
}

.customer-name {
  font-weight: 500;
  color: #2c3e50;
}

.customer-phone {
  color: #6c757d;
  font-size: 12px;
}

.checkout-time {
  display: flex;
  flex-direction: column;
}

.time-normal { color: #2c3e50; }
.time-warning { color: #fd7e14; font-weight: 600; }
.time-soon { color: #ffc107; font-weight: 600; }
.time-late { color: #dc3545; font-weight: 600; }
.time-completed { color: #28a745; }

.deadline-info {
  margin-top: 4px;
  font-size: 11px;
  font-weight: 500;
}

/* Amount Info */
.amount-info {
  display: flex;
  flex-direction: column;
}

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

/* Status Badges */
.status-badge, .payment-badge {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
}

.status-ready { background: #d4edda; color: #155724; }
.status-processing { background: #fff3cd; color: #856404; }
.status-completed { background: #d1ecf1; color: #0c5460; }
.status-late { background: #f8d7da; color: #721c24; }

.payment-unpaid { background: #f8d7da; color: #721c24; }
.payment-partial { background: #fff3cd; color: #856404; }
.payment-paid { background: #d4edda; color: #155724; }

/* Buttons */
.btn {
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.btn-primary { background: #2f70b6; color: white; }
.btn-success { background: #28a745; color: white; }
.btn-warning { background: #ffc107; color: #212529; }

.btn-info { background: #17a2b8; color: white; }
.btn-secondary { background: #6c757d; color: white; }
.btn-outline { background: transparent; color: #6c757d; border: 1px solid #6c757d; }

.btn:hover {
  transform: translateY(-1px);
  opacity: 0.9;
}

.btn-sm {
  padding: 6px 12px;
  font-size: 12px;
  min-width: 80px;
}

.btn-text {
  margin-left: 4px;
  font-weight: 500;
}

.action-buttons {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

/* No Data */
.no-data {
  text-align: center;
  padding: 60px 20px;
  color: #6c757d;
}

.no-data i {
  font-size: 48px;
  margin-bottom: 16px;
  opacity: 0.5;
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
}

.modal-content {
  background: white;
  border-radius: 12px;
  width: 90%;
  max-width: 800px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}

.modal-header {
  padding: 20px 24px;
  border-bottom: 1px solid #e9ecef;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #2f70b6;
  color: white;
  border-radius: 12px 12px 0 0;
}

.modal-header h3 {
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;
}

.modal-close {
  background: none;
  border: none;
  color: white;
  font-size: 20px;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: background-color 0.3s ease;
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
  margin: 0 0 16px 0;
  color: #2c3e50;
  font-size: 16px;
  font-weight: 600;
  border-bottom: 2px solid #e9ecef;
  padding-bottom: 8px;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid #f8f9fa;
}

.detail-item label {
  font-weight: 500;
  color: #6c757d;
  min-width: 120px;
}

.detail-item span {
  color: #2c3e50;
  text-align: right;
}

.total-amount {
  font-weight: 600;
  color: #2c3e50;
  font-size: 14px;
}

.remaining-amount {
  font-size: 12px;
  color: #dc3545;
  font-weight: 600;
  margin-top: 2px;
}

.payment-status {
  font-size: 12px;
  color: #6c757d;
  margin-top: 2px;
}

.notes-section {
  background: #f8f9fa;
  padding: 16px;
  border-radius: 8px;
  margin-top: 16px;
}

.notes-section h4 {
  margin: 0 0 12px 0;
  color: #2c3e50;
}

.notes-section p {
  margin: 0;
  color: #6c757d;
  line-height: 1.5;
}

.modal-footer {
  padding: 16px 24px;
  border-top: 1px solid #e9ecef;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

/* Responsive */
@media (max-width: 768px) {
  .checkout-management {
    padding: 12px;
  }
  
  .header-content {
    flex-direction: column;
    gap: 16px;
    text-align: center;
  }
  
  .search-filters {
    flex-direction: column;
    align-items: stretch;
  }
  
  .filter-group {
    justify-content: space-between;
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
  
  .modal-content {
    width: 95%;
    margin: 20px;
  }
  
  .detail-grid {
    grid-template-columns: 1fr;
  }
}
</style>
