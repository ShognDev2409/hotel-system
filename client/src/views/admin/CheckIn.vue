<template>
  <div class="checkin-management">
    <!-- Page Header -->
    <div class="page-header">
      <h2>ບັນທຶກການແຈ້ງເຂົ້າພັກ</h2>
       <button class="btn btn-primary" @click="openCheckInModal">
        ເພີ່ມລູກຄ້າໃໝ່
      </button>
    </div>

    <!-- Search and Filters -->
    <div class="filters-section">
      <div class="search-box">
        <input 
          type="text" 
          v-model="searchQuery" 
          placeholder="ຄົ້ນຫາເລກການຈອງ ຫຼື ຊື່ລູກຄ້າ..."
          class="search-input"
        >
      </div>
      <div class="filter-controls">
        <select v-model="statusFilter" class="filter-select">
          <option value="">ທຸກສະຖານະ</option>
          <option value="pending">ລໍຖ້າແຈ້ງເຂົ້າ</option>
          <option value="checked-in">ເຂົ້າພັກແລ້ວ</option>
          <option value="checked-out">ເຊັກເອົາທ໌ແລ້ວ</option>
        </select>
        <input 
          type="date" 
          v-model="dateFilter"
          class="filter-select"
          placeholder="ວັນທີ່ເຂົ້າພັກ"
        >
        <button class="btn btn-outline" @click="clearFilters">
          ລ້າງ
        </button>
      </div>
    </div>

    <!-- Check-ins Table -->
    <div class="table-section">
      <div class="table-container">
        <table class="staff-table">
          <thead>
            <tr>
              <th>ເລກຈອງ</th>
              <th>ລູກຄ້າ</th>
              <th>ຫ້ອງ</th>
              <th>ວັນທີ່ເຂົ້າ-ອອກ</th>
              <th>ຍອດເງິນ</th>
              <th>ສະຖານະ</th>
              <th>ການດໍາເນີນການ</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="checkin in filteredCheckIns" :key="checkin.id">
              <td class="booking-number">{{ checkin.bookingNumber }}</td>
              <td class="customer-info">
                <div class="name-container">
                  <div class="full-name">{{ checkin.customerName }}</div>
                  <div class="contact-info">{{ checkin.customerPhone }}</div>
                </div>
              </td>
              <td class="room-info">
                <div class="room-number">{{ checkin.roomNumber }}</div>
                <div class="room-type">{{ checkin.roomType }}</div>
              </td>
              <td class="dates">
                <div>ເຂົ້າ: {{ formatDate(checkin.checkInDate) }}</div>
                <div>ອອກ: {{ formatDate(checkin.checkOutDate) }}</div>
                <div v-if="checkin.actualCheckInTime" class="actual-time">
                  ເຊັກອິນແລ້ວ: {{ formatDateTime(checkin.actualCheckInTime) }}
                </div>
              </td>
              <td class="amount">
                <div class="total-amount">{{ formatCurrency(checkin.totalAmount) }}</div>
                <div class="payment-status">{{ getPaymentStatusText(checkin.paymentStatus) }}</div>
                
              </td>
              <td>
                <span class="status-badge" :class="getStatusClass(checkin.status)">
                  {{ getStatusText(checkin.status) }}
                </span>
              </td>
              <td class="actions">
                <button 
                  v-if="checkin.status === 'pending'" 
                  class="btn btn-sm btn-success" 
                  @click="processCheckIn(checkin)"
                >
                  ✓ check in
                </button>
                <button class="btn btn-sm btn-info" @click="viewDetails(checkin)">
                  👁️ ລາຍລະອຽດ
                </button>
                
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Check-in Modal -->
    <div v-if="showCheckInModal" class="modal-overlay" @click="closeModal">
      <div class="modal" @click.stop>
        <div class="modal-header">
          <h3>ບັນທຶກການແຈ້ງເຂົ້າພັກ</h3>
          <button class="close-btn" @click="closeModal">✕</button>
        </div>
        
        <div class="modal-body">
          <form @submit.prevent="saveCheckIn">
            <div class="form-row">
              <div class="form-group">
                <label>ຫມາຍເລກການຈອງ *</label>
                <input 
                  type="text" 
                  v-model="checkInForm.bookingNumber" 
                  required 
                  class="form-input"
                  placeholder="BK001"
                >
              </div>
              
              <div class="form-group">
                <label>ຫ້ອງ *</label>
                <select v-model="checkInForm.roomNumber" required class="form-input" @change="updateRoomDetails">
                  <option value="">ເລືອກຫ້ອງ</option>
                  <option v-for="room in availableRooms" :key="room.number" :value="room.number">
                    {{ room.number }} - {{ room.type }} ({{ formatCurrency(room.price) }}/ຄືນ)
                  </option>
                </select>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label>ຊື່ລູກຄ້າ *</label>
                <input 
                  type="text" 
                  v-model="checkInForm.customerName" 
                  required 
                  class="form-input"
                  placeholder="ຊື່-ນາມສະກຸນ"
                >
              </div>
              
              <div class="form-group">
                <label>ເບີໂທລະສັບ *</label>
                <input 
                  type="tel" 
                  v-model="checkInForm.customerPhone" 
                  required 
                  class="form-input"
                  placeholder="020-xxx-xxxx"
                >
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label>ອີເມວ</label>
                <input 
                  type="email" 
                  v-model="checkInForm.customerEmail" 
                  class="form-input"
                  placeholder="email@example.com"
                >
              </div>
              
              <div class="form-group">
                <label>ເລກບັດປະຊາຊົນ/ແຜນປາດ *</label>
                <input 
                  type="text" 
                  v-model="checkInForm.idCardNumber" 
                  required 
                  class="form-input"
                  placeholder="ເລກບັດປະຊາຊົນ"
                >
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label>ສັນຊາດ *</label>
                <select v-model="checkInForm.nationality" required class="form-input">
                  <option value="ລາວ">ລາວ</option>
                  <option value="ໄທ">ໄທ</option>
                  <option value="ຈີນ">ຈີນ</option>
                  <option value="ຫວຽດນາມ">ຫວຽດນາມ</option>
                  <option value="ອາເມລິກັນ">ອາເມລິກັນ</option>
                  <option value="ຝຣັ່ງ">ຝຣັ່ງ</option>
                  <option value="ເຢຍລະມັນ">ເຢຍລະມັນ</option>
                  <option value="ອື່ນໆ">ອື່ນໆ</option>
                </select>
              </div>
              
              <div class="form-group">
                <label>ເບີຕິດຕໍ່ສຸກເສີນ</label>
                <input 
                  type="tel" 
                  v-model="checkInForm.emergencyContact" 
                  class="form-input"
                  placeholder="ເບີຕິດຕໍ່ສຸກເສີນ"
                >
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label>ວັນທີ່ເຂົ້າພັກ *</label>
                <input 
                  type="date" 
                  v-model="checkInForm.checkInDate" 
                  required 
                  class="form-input"
                >
              </div>
              
              <div class="form-group">
                <label>ວັນທີ່ອອກ *</label>
                <input 
                  type="date" 
                  v-model="checkInForm.checkOutDate" 
                  required 
                  class="form-input"
                >
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label>ຈຳນວນຜູ້ໃຫຍ່ *</label>
                <input 
                  type="number" 
                  v-model="checkInForm.adultGuests" 
                  required 
                  min="1"
                  class="form-input"
                  @change="calculateTotal"
                >
              </div>
              
              <div class="form-group">
                <label>ຈຳນວນເດັກ</label>
                <input 
                  type="number" 
                  v-model="checkInForm.childGuests" 
                  min="0"
                  class="form-input"
                >
              </div>
            </div>

            <div class="form-group">
              <label>ທີ່ຢູ່</label>
              <textarea 
                v-model="checkInForm.address" 
                class="form-input"
                rows="2"
                placeholder="ທີ່ຢູ່ຂອງລູກຄ້າ"
              ></textarea>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label>ຍອດເງິນລວມ (ກີບ)</label>
                <input 
                  type="number" 
                  v-model="checkInForm.totalAmount" 
                  class="form-input"
                  readonly
                  :placeholder="formatCurrency(checkInForm.totalAmount)"
                >
              </div>
              
              <div class="form-group">
                <label>ຍອດເງິນທີ່ຊຳລະ (ກີບ)</label>
                <input 
                  type="number" 
                  v-model="checkInForm.paidAmount" 
                  class="form-input"
                  min="0"
                  @input="updatePaymentStatus"
                  placeholder="0"
                >
              </div>
            </div>

            <div class="form-group">
              <label>ຄວາມຕ້ອງການພິເສດ</label>
              <textarea 
                v-model="checkInForm.specialRequests" 
                class="form-input"
                rows="2"
                placeholder="ເຊັ່ນ ເຕຽງເສີມ, ອາຫານເຈ, ຫ້ອງງຽບ ແລະອື່ນໆ"
              ></textarea>
            </div>

            <div class="form-group">
              <label>ໝາຍເຫດ</label>
              <textarea 
                v-model="checkInForm.notes" 
                class="form-input"
                rows="2"
                placeholder="ໝາຍເຫດເພີ່ມເຕີມ..."
              ></textarea>
            </div>
            
            <div class="form-actions">
              <button type="button" class="btn btn-outline" @click="closeModal">
                ຍົກເລີກ
              </button>
              <button type="submit" class="btn btn-primary" :disabled="saving">
                {{ saving ? 'ກຳລັງບັນທຶກ...' : 'ບັນທຶກການເຂົ້າພັກ' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Details Modal -->
    <div v-if="showDetailsModal" class="modal-overlay" @click="closeDetailsModal">
      <div class="modal" @click.stop>
        <div class="modal-header">
          <h3>ລາຍລະອຽດການເຂົ້າພັກ</h3>
          <button class="close-btn" @click="closeDetailsModal">✕</button>
        </div>
        
        <div class="modal-body" v-if="selectedCheckIn">
          <div class="detail-section">
            <h4>ຂໍ້ມູນການຈອງ</h4>
            <div class="detail-row">
              <span class="detail-label">ໝາຍເລກການຈອງ:</span>
              <span class="detail-value">{{ selectedCheckIn.bookingNumber }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">ຫ້ອງ:</span>
              <span class="detail-value">{{ selectedCheckIn.roomNumber }} - {{ selectedCheckIn.roomType }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">ວັນທີ່ເຂົ້າ-ອອກ:</span>
              <span class="detail-value">{{ formatDate(selectedCheckIn.checkInDate) }} - {{ formatDate(selectedCheckIn.checkOutDate) }}</span>
            </div>
            <div class="detail-row" v-if="selectedCheckIn.actualCheckInTime">
              <span class="detail-label">ເວລາເຊັກອິນຈິງ:</span>
              <span class="detail-value">{{ formatDateTime(selectedCheckIn.actualCheckInTime) }}</span>
            </div>
            <div class="detail-row" v-if="selectedCheckIn.actualCheckOutTime">
              <span class="detail-label">ເວລາເຊັກເອົາທ໌ຈິງ:</span>
              <span class="detail-value">{{ formatDateTime(selectedCheckIn.actualCheckOutTime) }}</span>
            </div>
          </div>

          <div class="detail-section">
            <h4>ຂໍ້ມູນລູກຄ້າ</h4>
            <div class="detail-row">
              <span class="detail-label">ຊື່:</span>
              <span class="detail-value">{{ selectedCheckIn.customerName }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">ເບີໂທ:</span>
              <span class="detail-value">{{ selectedCheckIn.customerPhone }}</span>
            </div>
            <div class="detail-row" v-if="selectedCheckIn.customerEmail">
              <span class="detail-label">ອີເມວ:</span>
              <span class="detail-value">{{ selectedCheckIn.customerEmail }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">ເລກບັດປະຊາຊົນ:</span>
              <span class="detail-value">{{ selectedCheckIn.idCardNumber }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">ສັນຊາດ:</span>
              <span class="detail-value">{{ selectedCheckIn.nationality }}</span>
            </div>
            <div class="detail-row" v-if="selectedCheckIn.address">
              <span class="detail-label">ທີ່ຢູ່:</span>
              <span class="detail-value">{{ selectedCheckIn.address }}</span>
            </div>
            <div class="detail-row" v-if="selectedCheckIn.emergencyContact">
              <span class="detail-label">ເບີຕິດຕໍ່ສຸກເສີນ:</span>
              <span class="detail-value">{{ selectedCheckIn.emergencyContact }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">ຈໍານວນແຂກ:</span>
              <span class="detail-value">{{ selectedCheckIn.adultGuests }} ຜູໃຫຍ່, {{ selectedCheckIn.childGuests }} ເດັກ</span>
            </div>
          </div>

          <div class="detail-section">
            <h4>ຂໍ້ມູນການຊໍາລະເງິນ</h4>
            <div class="detail-row">
              <span class="detail-label">ຍອດເງິນລວມ:</span>
              <span class="detail-value">{{ formatCurrency(selectedCheckIn.totalAmount) }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">ຍອດທີ່ຊໍາລະແລ້ວ:</span>
              <span class="detail-value">{{ formatCurrency(selectedCheckIn.paidAmount) }}</span>
            </div>
            
            <div class="detail-row">
              <span class="detail-label">ສະຖານະການຊໍາລະ:</span>
              <span class="detail-value">
                <span class="payment-status-badge" :class="selectedCheckIn.paymentStatus">
                  {{ getPaymentStatusText(selectedCheckIn.paymentStatus) }}
                </span>
              </span>
            </div>
          </div>

          <div class="detail-section" v-if="selectedCheckIn.specialRequests">
            <h4>ຄວາມຕ້ອງການພິເສດ</h4>
            <p>{{ selectedCheckIn.specialRequests }}</p>
          </div>

          <div class="detail-section" v-if="selectedCheckIn.notes">
            <h4>ໝາຍເຫດ</h4>
            <p>{{ selectedCheckIn.notes }}</p>
          </div>

          <div class="detail-section">
            <h4>ຂໍ້ມູນລະບົບ</h4>
            <div class="detail-row">
              <span class="detail-label">ສ້າງເມື່ອ:</span>
              <span class="detail-value">{{ formatDateTime(selectedCheckIn.createdAt) }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">ອັບເດັດລ່າສຸດ:</span>
              <span class="detail-value">{{ formatDateTime(selectedCheckIn.updatedAt) }}</span>
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <button class="btn btn-outline" @click="closeDetailsModal">
            ປິດ
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
  name: 'CheckIn',
  data() {
    return {
      searchQuery: '',
      statusFilter: '',
      dateFilter: '',
      showCheckInModal: false,
      showDetailsModal: false,
      isEditing: false,
      saving: false,
      selectedCheckIn: null,
      checkInForm: {
        // ข้อมูลการจอง (Input to Process 4.1)
        bookingNumber: '',
        bookingDate: '',
        bookingStatus: 'pending',
        
        // ข้อมูลลูกค้า (from ลูกค้า entity)
        customerName: '',
        customerPhone: '',
        customerEmail: '',
        idCardNumber: '',
        nationality: 'ลาว',
        address: '',
        emergencyContact: '',
        
        // ข้อมูลห้องพัก (from D2 - ข้อมูลห้องพัก)
        roomNumber: '',
        roomType: '',
        roomPrice: 0,
        
        // ข้อมูลการเข้าพัก (Process 4.2 output)
        checkInDate: '',
        checkOutDate: '',
        actualCheckInTime: null,
        actualCheckOutTime: null,
        adultGuests: 1,
        childGuests: 0,
        totalNights: 0,
        
        // ข้อมูลการชำระเงิน (D7 - ข้อมูลการชำระเงิน)
        totalAmount: 0,
        paidAmount: 0,
        remainingAmount: 0,
        paymentStatus: 'unpaid',
        paymentMethod: '',
        
        // ข้อมูลการให้บริการ (D6 - ข้อมูลการให้บริการ)
        specialRequests: '',
        notes: '',
        serviceRequests: [],
        
        // สถานะการประมวลผล (Process 4.1 & 4.2)
        status: 'pending', // pending, confirmed, checked-in, checked-out
        processedBy: '', // พนักงานที่ดำเนินการ
        processedAt: null
      },
      checkIns: [
        {
          id: 1,
          // ข้อมูลการจอง (Process 4.1 output)
          bookingNumber: 'BK001',
          bookingDate: '2025-01-10',
          bookingStatus: 'confirmed',
          
          // ข้อมูลลูกค้า (from ลูกค้า entity)
          customerName: 'ສົມຊາຍ ໃຈດີ',
          customerPhone: '020-234-5678',
          customerEmail: 'somchai@email.com',
          idCardNumber: '1234567890123',
          nationality: 'ລາວ',
          address: 'ນະຄອນຫຼວງວຽງຈັນ',
          emergencyContact: '020-999-8888',
          
          // ข้อมูลห้องพัก (from D2)
          roomNumber: '101',
          roomType: 'Double room',
          roomPrice: 500000,
          
          // ข้อมูลการเข้าพัก (Process 4.2)
          checkInDate: '2025-01-13',
          checkOutDate: '2025-01-15',
          actualCheckInTime: null,
          actualCheckOutTime: null,
          adultGuests: 2,
          childGuests: 0,
          totalNights: 2,
          
          // ข้อมูลการชำระเงิน (D7)
          totalAmount: 1000000,
          paidAmount: 500000,
          remainingAmount: 500000,
          paymentStatus: 'partial',
          paymentMethod: 'cash',
          
          // ข้อมูลการให้บริการ (D6)
          specialRequests: 'ເຕຍງເສີມ, ບໍ່ສູບບຸຫລີ',
          notes: 'ຂໍຫ້ອງຊັ້ນລ່າງ, ມາເຖິງຊ່ວງບ່າຍ',
          serviceRequests: ['extra_bed', 'non_smoking'],
          
          // ສະຖານະການປະມວນຜົນ
          status: 'pending',
          processedBy: 'ພະນັກງານ A',
          processedAt: '2025-01-12T15:30:00Z',
          createdAt: '2025-01-10T10:00:00Z',
          updatedAt: '2025-01-12T15:30:00Z'
        },
        {
          id: 2,
          bookingNumber: 'BK002',
          bookingDate: '2025-01-08',
          bookingStatus: 'confirmed',
          customerName: 'ສົມຍິງ ຮັກງານ',
          customerPhone: '020-345-6789',
          customerEmail: 'somying@email.com',
          idCardNumber: '9876543210987',
          nationality: 'ໄທ',
          address: 'ກຸງເທບມະຫານະຄອນ',
          emergencyContact: '089-777-6666',
          roomNumber: '202',
          roomType: 'Double room (Thatluang view)',
          roomPrice: 600000,
          checkInDate: '2025-01-12',
          checkOutDate: '2025-01-16',
          actualCheckInTime: '2025-01-12T14:30:00Z',
          actualCheckOutTime: null,
          adultGuests: 2,
          childGuests: 1,
          totalNights: 4,
          totalAmount: 2400000,
          paidAmount: 2400000,
          remainingAmount: 0,
          paymentStatus: 'paid',
          paymentMethod: 'credit_card',
          specialRequests: 'ເຕຍງເດັກ, ອາຫານເຊົ້າພິເສດສໍາລັບເດັກ',
          notes: 'ຄອບຄົວມີເດັກນ້ອຍ',
          serviceRequests: ['child_bed', 'child_breakfast'],
          status: 'checked-in',
          processedBy: 'ພະນັກງານ B',
          processedAt: '2025-01-12T14:30:00Z',
          createdAt: '2025-01-08T09:15:00Z',
          updatedAt: '2025-01-12T14:30:00Z'
        },
        {
          id: 3,
          bookingNumber: 'BK003',
          bookingDate: '2025-01-05',
          bookingStatus: 'confirmed',
          customerName: 'ສົມສັກ ມີສຸກ',
          customerPhone: '020-456-7890',
          customerEmail: 'somsak@email.com',
          idCardNumber: '5555666677778',
          nationality: 'ລາວ',
          address: 'ຈໍາປາສັກ',
          emergencyContact: '020-111-2222',
          roomNumber: '301',
          roomType: 'Twin room',
          roomPrice: 500000,
          checkInDate: '2025-01-10',
          checkOutDate: '2025-01-12',
          actualCheckInTime: '2025-01-10T15:00:00Z',
          actualCheckOutTime: '2025-01-12T11:00:00Z',
          adultGuests: 2,
          childGuests: 0,
          totalNights: 2,
          totalAmount: 1000000,
          paidAmount: 1000000,
          remainingAmount: 0,
          paymentStatus: 'paid',
          paymentMethod: 'bank_transfer',
          specialRequests: 'Late check-out, ດອກໄມ້ໃນຫ້ອງ',
          notes: 'ລູກຄ້າ VIP - ບໍລິການພິເສດ',
          serviceRequests: ['late_checkout', 'room_decoration'],
          status: 'checked-out',
          processedBy: 'ພະນັກງານ C',
          processedAt: '2025-01-12T11:00:00Z',
          createdAt: '2025-01-05T16:20:00Z',
          updatedAt: '2025-01-12T11:00:00Z'
        }
      ],
      availableRooms: [
        // D2 - ข้อมูลห้องพัก (Data Store)
        { 
          number: '101', 
          type: 'Double room', 
          price: 500000, 
          floor: 1, 
          capacity: 2, 
          status: 'available',
          amenities: ['Wi-Fi', 'ແອ', 'ທີວີ'],
          lastCleaned: '2025-01-13T10:00:00Z'
        },
        { 
          number: '102', 
          type: 'Double room', 
          price: 500000, 
          floor: 1, 
          capacity: 2, 
          status: 'available',
          amenities: ['Wi-Fi', 'ແອ', 'ທີວີ'],
          lastCleaned: '2025-01-13T10:30:00Z'
        },
        { 
          number: '103', 
          type: 'Twin room', 
          price: 500000, 
          floor: 1, 
          capacity: 2, 
          status: 'maintenance',
          amenities: ['Wi-Fi', 'ແອ', 'ທີວີ'],
          lastCleaned: '2025-01-12T16:00:00Z'
        },
        { 
          number: '201', 
          type: 'Double room (Thatluang view)', 
          price: 600000, 
          floor: 2, 
          capacity: 2, 
          status: 'available',
          amenities: ['Wi-Fi', 'ແອ', 'ທີວີ', 'ວິວທາດຫຼວງ'],
          lastCleaned: '2025-01-13T09:00:00Z'
        },
        { 
          number: '202', 
          type: 'Double room (Thatluang view)', 
          price: 600000, 
          floor: 2, 
          capacity: 2, 
          status: 'occupied',
          amenities: ['Wi-Fi', 'ແອ', 'ທີວີ', 'ວິວທາດຫຼວງ'],
          lastCleaned: '2025-01-12T14:00:00Z'
        },
        { 
          number: '203', 
          type: 'Double room (Thatluang view)', 
          price: 600000, 
          floor: 2, 
          capacity: 2, 
          status: 'available',
          amenities: ['Wi-Fi', 'ແອ', 'ທີວີ', 'ວິວທາດຫຼວງ'],
          lastCleaned: '2025-01-13T11:00:00Z'
        },
        { 
          number: '301', 
          type: 'Twin room', 
          price: 500000, 
          floor: 3, 
          capacity: 2, 
          status: 'cleaning',
          amenities: ['Wi-Fi', 'ແອ', 'ທີວີ'],
          lastCleaned: '2025-01-13T08:00:00Z'
        },
        { 
          number: '302', 
          type: 'Twin room', 
          price: 500000, 
          floor: 3, 
          capacity: 2, 
          status: 'available',
          amenities: ['Wi-Fi', 'ແອ', 'ທີວີ'],
          lastCleaned: '2025-01-13T09:30:00Z'
        },
        { 
          number: '308', 
          type: 'Triple room', 
          price: 700000, 
          floor: 3, 
          capacity: 3, 
          status: 'available',
          amenities: ['Wi-Fi', 'ແອ', 'ທີວີ', 'ເຕຍງເສີມ'],
          lastCleaned: '2025-01-13T10:15:00Z'
        },
        { 
          number: '401', 
          type: 'Double Room', 
          price: 500000, 
          floor: 4, 
          capacity: 2, 
          status: 'available',
          amenities: ['Wi-Fi', 'ແອ', 'ທີວີ'],
          lastCleaned: '2025-01-13T11:30:00Z'
        }
      ],
      message: {
        show: false,
        text: '',
        type: 'success'
      }
    }
  },

  computed: {
    filteredCheckIns() {
      // DFD Process 4: ການກັ່ນຕອງຂໍ້ມູນການເຂົ້າພັກ
      // ສະແດງແຕ່ສະຖານະ "pending" (ພ້ອມເຊັກອິນ) ແລະ "checked-in" (ເຊັກອິນແລ້ວ) ເທົ່ານັ້ນ
      return this.checkIns.filter(checkin => {
        // ສະແດງແຕ່ສະຖານະທີ່ຕ້ອງການເທົ່ານັ້ນ
        const isAllowedStatus = checkin.status === 'pending' || checkin.status === 'checked-in'
        
        if (!isAllowedStatus) {
          return false
        }
        
        const matchesSearch = !this.searchQuery || 
          checkin.bookingNumber.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          checkin.customerName.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          checkin.roomNumber.toString().includes(this.searchQuery)
        
        const matchesStatus = !this.statusFilter || checkin.status === this.statusFilter
        const matchesDate = !this.dateFilter || checkin.checkInDate === this.dateFilter
        
        return matchesSearch && matchesStatus && matchesDate
      })
    },

    // DFD Dashboard Statistics from D3-D7
    pendingCheckIns() {
      return this.checkIns.filter(checkin => checkin.status === 'pending').length
    },

    todayCheckIns() {
      const today = new Date().toISOString().split('T')[0]
      return this.checkIns.filter(checkin => 
        checkin.checkInDate === today && checkin.status === 'checked-in'
      ).length
    },

    currentlyStaying() {
      return this.checkIns.filter(checkin => checkin.status === 'checked-in').length
    },

    totalRevenue() {
      // ລາຍຮັບລວມຈາກ D7 (Payment Data)
      return this.checkIns.reduce((total, checkin) => {
        return total + (checkin.paidAmount || 0)
      }, 0)
    },

    occupancyRate() {
      // ອັດຕາການເຂົ້າພັກຈາກ D2 (Room Data)
      const occupiedRooms = this.availableRooms.filter(room => room.status === 'occupied').length
      const totalRooms = this.availableRooms.length
      return totalRooms > 0 ? Math.round((occupiedRooms / totalRooms) * 100) : 0
    },

    totalCheckIns() {
      return this.checkIns.length
    }
  },

  methods: {
    openCheckInModal() {
      this.isEditing = false
      this.resetForm()
      this.showCheckInModal = true
      // Set default check-in date to today
      this.checkInForm.checkInDate = new Date().toISOString().split('T')[0]
    },

    closeModal() {
      this.showCheckInModal = false
      this.resetForm()
    },

    closeDetailsModal() {
      this.showDetailsModal = false
      this.selectedCheckIn = null
    },

    resetForm() {
      this.checkInForm = {
        bookingNumber: '',
        roomNumber: '',
        customerName: '',
        customerPhone: '',
        customerEmail: '',
        checkInDate: '',
        checkOutDate: '',
        adultGuests: 1,
        childGuests: 0,
        totalAmount: 0,
        paidAmount: 0,
        paymentStatus: 'unpaid',
        notes: '',
        specialRequests: '',
        idCardNumber: '',
        nationality: 'ลาว',
        address: '',
        emergencyContact: ''
      }
    },

    updateRoomDetails() {
      if (this.checkInForm.roomNumber) {
        const selectedRoom = this.availableRooms.find(room => room.number === this.checkInForm.roomNumber)
        if (selectedRoom) {
          this.calculateTotal()
        }
      }
    },

    calculateTotal() {
      if (this.checkInForm.roomNumber && this.checkInForm.checkInDate && this.checkInForm.checkOutDate) {
        const selectedRoom = this.availableRooms.find(room => room.number === this.checkInForm.roomNumber)
        if (selectedRoom) {
          // ใช้ DFD Process calculation
          const nights = this.calculateNights(this.checkInForm.checkInDate, this.checkInForm.checkOutDate)
          this.checkInForm.totalNights = nights
          this.checkInForm.roomPrice = selectedRoom.price
          this.checkInForm.totalAmount = selectedRoom.price * nights
          this.updatePaymentStatus()
        }
      }
    },

    updatePaymentStatus() {
      const paid = parseFloat(this.checkInForm.paidAmount) || 0
      const total = parseFloat(this.checkInForm.totalAmount) || 0
      
      if (paid === 0) {
        this.checkInForm.paymentStatus = 'unpaid'
      } else if (paid >= total) {
        this.checkInForm.paymentStatus = 'paid'
        this.checkInForm.paidAmount = total
      } else {
        this.checkInForm.paymentStatus = 'partial'
      }
    },

    async saveCheckIn() {
      this.saving = true
      try {
        // Process 4.2: ການຈັດການການແຈ້ງເຂົ້າພັກ
        if (this.validateBookingData()) {
          await new Promise(resolve => setTimeout(resolve, 1000))

          const newCheckIn = {
            ...this.checkInForm,
            id: this.checkIns.length + 1,
            roomType: this.availableRooms.find(room => room.number === this.checkInForm.roomNumber)?.type || '',
            status: 'pending',
            remainingAmount: this.checkInForm.totalAmount - this.checkInForm.paidAmount,
            actualCheckInTime: null,
            actualCheckOutTime: null,
            processedBy: 'ພະນັກງານ',
            processedAt: new Date().toISOString(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }

          // ປະມວນຜົນ Process 4.1 (Booking Control)
          this.processBookingControl(newCheckIn)
          
          this.checkIns.push(newCheckIn)
          this.showMessage('ບັນທຶກການເຂົ້າພັກສຳເລັດແລ້ວ', 'success')
          this.closeModal()
        } else {
          this.showMessage('ຂໍ້ມູນບໍ່ຄົບຖ້ວນ ກະລຸນາກວດສອບອີກຄັ້ງ', 'error')
        }
      } catch (error) {
        this.showMessage('ເກີດຂໍ້ຜິດພາດໃນການບັນທຶກຂໍ້ມູນ', 'error')
      } finally {
        this.saving = false
      }
    },

    processCheckIn(checkin) {
      if (confirm('ຢືນຢັນການເຊັກອິນສຳລັດ ' + checkin.customerName + '?')) {
        // Process 4.2: ການຈັດການການແຈ້ງເຂົ້າພັກ
        this.processCheckInManagement(checkin)
        
        checkin.status = 'checked-in'
        checkin.actualCheckInTime = new Date().toISOString()
        checkin.updatedAt = new Date().toISOString()
        checkin.processedBy = 'ພະນັກງານ'
        
        // ອັພເດດສະຖານະຫ້ອງ (D2)
        this.updateRoomStatus(checkin.roomNumber, 'occupied')
        
        this.showMessage('ເຊັກອິນສຳເລັດແລ້ວ', 'success')
      }
    },

    processCheckOut(checkin) {
      if (confirm('ຢືນຢັນການເຊັກເອົາທ໌ສຳລັດ ' + checkin.customerName + '?')) {
        // Process 4.2: ການຈັດການການແຈ້ງອອກພັກ
        this.processCheckOutManagement(checkin)
        
        checkin.status = 'checked-out'
        checkin.actualCheckOutTime = new Date().toISOString()
        checkin.updatedAt = new Date().toISOString()
        checkin.processedBy = 'ພະນັກງານ'
        
        // ອັພເດດສະຖານະຫ້ອງກັບໄປທຳຄວາມສະອາດ (D2)
        this.updateRoomStatus(checkin.roomNumber, 'cleaning')
        
        this.showMessage('ເຊັກເອົາທ໌ສຳເລັດແລ້ວ', 'success')
      }
    },

    openPaymentModal(checkin) {
      // ສຳລັບການຈ່າຍເງິນສ່ວນທີ່ເຫຼືອ - ໃຊ້ DFD D7 (Payment Data)
      this.showMessage('ລະບົບການຈ່າຍເງິນກຳລັງພັດທະນາ', 'info')
    },

    viewDetails(checkin) {
      this.selectedCheckIn = checkin
      this.showDetailsModal = true
    },

    clearFilters() {
      this.searchQuery = ''
      this.statusFilter = ''
      this.dateFilter = ''
    },

    getStatusText(status) {
      const statusMap = {
        'pending': 'ລໍເຊັກອິນ',
        'checked-in': 'ເຂົ້າພັກແລ້ວ',
        'checked-out': 'ເຊັກເອົາທ໌ແລ້ວ'
      }
      return statusMap[status] || status
    },

    getPaymentStatusText(status) {
      const statusMap = {
        'unpaid': 'ຍັງບໍ່ຈ່າຍ',
        'partial': 'ຈ່າຍບາງສ່ວນ',
        'paid': 'ຈ່າຍຄົບແລ້ວ'
      }
      return statusMap[status] || status
    },

    getStatusClass(status) {
      switch (status) {
        case 'pending': return 'status-pending';
        case 'checked-in': return 'status-checkin';
        case 'checked-out': return 'status-checkout';
        default: return 'status-default';
      }
    },

    formatDate(date) {
      if (!date) return '-'
      return new Date(date).toLocaleDateString('th-TH')
    },

    formatDateTime(datetime) {
      if (!datetime) return '-'
      return new Date(datetime).toLocaleString('th-TH')
    },

    formatCurrency(amount) {
      if (!amount) return '0 ₭'
      return new Intl.NumberFormat('lo-LA').format(amount) + ' ₭'
    },

    showMessage(text, type = 'success') {
      this.message = {
        show: true,
        text,
        type
      }
      setTimeout(() => {
        this.message.show = false
      }, 5000)
    },

    // Process 4.1: ການຄວບຄຸມການຈອງ (Booking Control)
    validateBookingData(bookingData) {
      // ຕຼວຈສອບຂໍ້ມູນການຈອງກ່ອນສົ່ງເຂົ້າລະບົບ
      const errors = []
      
      if (!bookingData.customerName) errors.push('ກະລຸນາປ້ອນຊື່ລູກຄ້າ')
      if (!bookingData.customerPhone) errors.push('ກະລຸນາປ້ອນເບີໂທລູກຄ້າ')
      if (!bookingData.roomNumber) errors.push('ກະລຸນາເລືອກຫ້ອງພັກ')
      if (!bookingData.checkInDate) errors.push('ກະລຸນາເລືອກວັນທີ່ເຂົ້າພັກ')
      if (!bookingData.checkOutDate) errors.push('ກະລຸນາເລືອກວັນທີ່ອອກ')
      
      return {
        isValid: errors.length === 0,
        errors: errors
      }
    },

    processBookingControl(bookingData) {
      // Process 4.1: ປະມວນຜົນການຄວບຄຸມການຈອງ
      console.log('Processing booking control for:', bookingData.bookingNumber)
      
      // ຕຼວຈສອບຂໍ້ມູນຫ້ອງພັກ (from D2)
      const room = this.availableRooms.find(r => r.number === bookingData.roomNumber)
      if (!room || room.status !== 'available') {
        throw new Error('ຫ້ອງບໍ່ສາມາດຈອງໄດ້')
      }
      
      // ຄິດໄລ່ຄ່າໃຊ້ຈ່າຍ
      const nights = this.calculateNights(bookingData.checkInDate, bookingData.checkOutDate)
      const totalAmount = room.price * nights
      
      // ສ້າງຂໍ້ມູນການຈອງທີ່ຄົບຖ້ວນ
      return {
        ...bookingData,
        roomPrice: room.price,
        totalNights: nights,
        totalAmount: totalAmount,
        remainingAmount: totalAmount - (bookingData.paidAmount || 0),
        bookingStatus: 'confirmed',
        processedBy: 'ພະນັກງານລະບົບ',
        processedAt: new Date().toISOString()
      }
    },

    // Process 4.2: ການຈັດການການເຂົ້າພັກ (Check-in Management)
    processCheckInManagement(checkinData) {
      // Process 4.2: ປະມວນຜົນການເຂົ້າພັກ
      console.log('Processing check-in management for:', checkinData.bookingNumber)
      
      // ອັບເດດສະຖານະຫ້ອງ (to D2)
      const roomIndex = this.availableRooms.findIndex(r => r.number === checkinData.roomNumber)
      if (roomIndex !== -1) {
        this.availableRooms[roomIndex].status = 'occupied'
      }
      
      // ບັນທຶກເວລາເຊັກອິນຈິງ
      const checkInRecord = {
        ...checkinData,
        actualCheckInTime: new Date().toISOString(),
        status: 'checked-in',
        processedBy: 'ພະນັກງານແຜນກຕ້ອນຮັບ',
        processedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      
      return checkInRecord
    },

    processCheckOutManagement(checkinData) {
      // Process 4.2: ประมวลผลการออกจากที่พัก
      console.log('Processing check-out management for:', checkinData.bookingNumber)
      
      // อัพเดทสถานะห้อง (to D2)
      const roomIndex = this.availableRooms.findIndex(r => r.number === checkinData.roomNumber)
      if (roomIndex !== -1) {
        this.availableRooms[roomIndex].status = 'cleaning'
      }
      
      // บันทึกเวลาเช็คเอาท์จริง
      const checkOutRecord = {
        ...checkinData,
        actualCheckOutTime: new Date().toISOString(),
        status: 'checked-out',
        processedBy: 'ພະນັກງານແຜນກຕ້ອນຮັບ',
        processedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      
      return checkOutRecord
    },

    updateRoomStatus(roomNumber, status) {
      // ອັພເດດສະຖານະຫ້ອງໃນ D2 (Room Data Store)
      const roomIndex = this.availableRooms.findIndex(r => r.number === roomNumber)
      if (roomIndex !== -1) {
        this.availableRooms[roomIndex].status = status
        this.availableRooms[roomIndex].lastUpdated = new Date().toISOString()
        
        if (status === 'cleaning') {
          // ຕັ້ງເວລາທຳຄວາມສະອາດ
          this.availableRooms[roomIndex].cleaningSchedule = {
            startTime: new Date().toISOString(),
            estimatedDuration: 60, // 60 ນາທີ
            assignedStaff: 'ພະນັກງານທຳຄວາມສະອາດ'
          }
        } else if (status === 'available') {
          // ລຶບຂໍ້ມູນການທຳຄວາມສະອາດ
          delete this.availableRooms[roomIndex].cleaningSchedule
        }
        
        console.log(`Room ${roomNumber} status updated to: ${status}`)
      }
    },

    calculateNights(checkInDate, checkOutDate) {
      // ຄິດໄລ່ຈໍານວນຄືນ
      const checkIn = new Date(checkInDate)
      const checkOut = new Date(checkOutDate)
      const timeDiff = checkOut.getTime() - checkIn.getTime()
      return Math.ceil(timeDiff / (1000 * 3600 * 24))
    },

    // DFD Data Store Management Methods
    updateDataStore(storeType, data) {
      // จัดการ Data Stores ตาม DFD Level 2
      switch(storeType) {
        case 'D2': // Room Data
          this.updateRoomDataStore(data)
          break
        case 'D3': // Booking Data
          this.updateBookingDataStore(data)
          break
        case 'D4': // Customer Data
          this.updateCustomerDataStore(data)
          break
        case 'D5': // Service Data
          this.updateServiceDataStore(data)
          break
        case 'D6': // Occupancy Data
          this.updateOccupancyDataStore(data)
          break
        case 'D7': // Payment Data
          this.updatePaymentDataStore(data)
          break
        default:
          console.warn('ບໍ່ພົບ Data Store:', storeType)
      }
    },

    updateRoomDataStore(roomData) {
      // D2: Room Data Store
      console.log('Updating D2 (Room Data Store):', roomData)
      // อัพเดทข้อมูลห้องพัก
    },

    updateBookingDataStore(bookingData) {
      // D3: Booking Data Store
      console.log('Updating D3 (Booking Data Store):', bookingData)
      // อัพเดทข้อมูลการจอง
    },

    updateCustomerDataStore(customerData) {
      // D4: Customer Data Store
      console.log('Updating D4 (Customer Data Store):', customerData)
      // อัพเดทข้อมูลลูกค้า
    },

    updateServiceDataStore(serviceData) {
      // D5: Service Data Store
      console.log('Updating D5 (Service Data Store):', serviceData)
      // อัพเดทข้อมูลบริการ
    },

    updateOccupancyDataStore(occupancyData) {
      // D6: Occupancy Data Store
      console.log('Updating D6 (Occupancy Data Store):', occupancyData)
      // อัพเดทข้อมูลการเข้าพัก
    },

    updatePaymentDataStore(paymentData) {
      // D7: Payment Data Store
      console.log('Updating D7 (Payment Data Store):', paymentData)
      // อัพเดทข้อมูลการชำระเงิน
    },

    // ...existing code...
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
