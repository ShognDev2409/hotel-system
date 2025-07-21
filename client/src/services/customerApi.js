// client/src/services/customerApi.js
import axios from 'axios'

const API_BASE_URL = 'http://localhost:3000/api'

// สร้าง axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Interceptor สำหรับใส่ token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Interceptor สำหรับจัดการ response
api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    console.error('API Error:', error.response?.data || error.message)
    
    // ถ้า token หมดอายุ
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    
    return Promise.reject(error)
  }
)

const customerService = {
  // ดึงรายการลูกค้าทั้งหมด
  async getAllCustomers() {
    try {
      console.log('🔄 Fetching all customers...')
      const response = await api.get('/customers')
      console.log('✅ Customers fetched successfully:', response.data)
      return response.data
    } catch (error) {
      console.error('❌ Error fetching customers:', error)
      throw error
    }
  },

  // ดึงข้อมูลลูกค้าตาม ID
  async getCustomerById(id) {
    try {
      console.log(`🔄 Fetching customer ${id}...`)
      const response = await api.get(`/customers/${id}`)
      console.log('✅ Customer fetched successfully:', response.data)
      return response.data
    } catch (error) {
      console.error(`❌ Error fetching customer ${id}:`, error)
      throw error
    }
  },

  // เพิ่มลูกค้าใหม่
  async createCustomer(customerData) {
    try {
      console.log('🔄 Creating new customer:', customerData)
      
      // แปลง field names ให้ตรงกับ API
      const apiData = {
        first_name: customerData.firstName || customerData.first_name,
        last_name: customerData.lastName || customerData.last_name,
        email: customerData.email,
        phone: customerData.phone,
        address: customerData.location || customerData.address,
        id_number: customerData.id_number,
        nationality: customerData.nationality || 'Lao'
      }
      
      const response = await api.post('/customers', apiData)
      console.log('✅ Customer created successfully:', response.data)
      return response.data
    } catch (error) {
      console.error('❌ Error creating customer:', error)
      throw error
    }
  },

  // อัพเดทข้อมูลลูกค้า
  async updateCustomer(id, customerData) {
    try {
      console.log(`🔄 Updating customer ${id}:`, customerData)
      
      // แปลง field names ให้ตรงกับ API
      const apiData = {
        first_name: customerData.firstName || customerData.first_name,
        last_name: customerData.lastName || customerData.last_name,
        email: customerData.email,
        phone: customerData.phone,
        address: customerData.location || customerData.address,
        id_number: customerData.id_number,
        nationality: customerData.nationality || 'Lao'
      }
      
      const response = await api.put(`/customers/${id}`, apiData)
      console.log('✅ Customer updated successfully:', response.data)
      return response.data
    } catch (error) {
      console.error(`❌ Error updating customer ${id}:`, error)
      throw error
    }
  },

  // ลบลูกค้า
  async deleteCustomer(id) {
    try {
      console.log(`🔄 Deleting customer ${id}...`)
      const response = await api.delete(`/customers/${id}`)
      console.log('✅ Customer deleted successfully:', response.data)
      return response.data
    } catch (error) {
      console.error(`❌ Error deleting customer ${id}:`, error)
      throw error
    }
  },

  // ดึงสถิติลูกค้า (คำนวณจาก data ที่ได้)
  calculateStats(customers) {
    const stats = {
      total: customers.length,
      active: customers.filter(c => c.total_bookings > 0).length,
      pending: customers.filter(c => !c.email).length, // ลูกค้าที่ยังไม่มีอีเมล
      suspended: 0 // ยังไม่มี status field ใน DB
    }
    
    console.log('📊 Calculated customer stats:', stats)
    return stats
  },

  // ค้นหาลูกค้า (filter ใน frontend)
  searchCustomers(customers, searchQuery, statusFilter) {
    let filtered = customers
    
    // ค้นหาตามคำค้น
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(customer =>
        (customer.first_name && customer.first_name.toLowerCase().includes(query)) ||
        (customer.last_name && customer.last_name.toLowerCase().includes(query)) ||
        (customer.email && customer.email.toLowerCase().includes(query)) ||
        (customer.phone && customer.phone.includes(query))
      )
    }
    
    // กรองตาม status (ใช้ total_bookings แทน)
    if (statusFilter) {
      if (statusFilter === 'ໃຊ້ງານ') {
        filtered = filtered.filter(c => c.total_bookings > 0)
      } else if (statusFilter === 'ລໍຖ້າອະນຸມັດ') {
        filtered = filtered.filter(c => !c.email)
      } else if (statusFilter === 'ລະງັບ') {
        filtered = filtered.filter(c => c.total_bookings === 0 && c.email)
      }
    }
    
    return filtered
  },

  // แปลงข้อมูลจาก API เป็นรูปแบบที่ Frontend ใช้
  transformCustomerData(apiCustomer) {
    return {
      id: apiCustomer.id,
      firstName: apiCustomer.first_name,
      lastName: apiCustomer.last_name,
      phone: apiCustomer.phone,
      email: apiCustomer.email,
      location: apiCustomer.address,
      status: this.getCustomerStatus(apiCustomer),
      registrationDate: apiCustomer.created_at,
      totalBookings: apiCustomer.total_bookings || 0,
      lastBookingDate: apiCustomer.last_booking_date,
      idNumber: apiCustomer.id_number,
      nationality: apiCustomer.nationality
    }
  },

  // กำหนด status ตามข้อมูลที่มี
  getCustomerStatus(apiCustomer) {
    if (apiCustomer.total_bookings > 0) {
      return 'ໃຊ້ງານ' // มีการจอง
    } else if (!apiCustomer.email) {
      return 'ລໍຖ້າອະນຸມັດ' // ยังไม่มีอีเมล
    } else {
      return 'ລະງັບ' // มีอีเมลแต่ไม่มีการจอง
    }
  },

  // ตรวจสอบการเชื่อมต่อ
  async testConnection() {
    try {
      console.log('🔄 Testing API connection...')
      const response = await api.get('/health')
      console.log('✅ API connection successful:', response.data)
      return true
    } catch (error) {
      console.error('❌ API connection failed:', error)
      return false
    }
  }
}

export default customerService
