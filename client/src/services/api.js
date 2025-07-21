import axios from 'axios'

// Create axios instance
const apiClient = axios.create({
  baseURL: 'http://localhost:3000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Request interceptor to add token
apiClient.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  error => {
    console.error('Request error:', error)
    return Promise.reject(error)
  }
)

// Response interceptor for error handling
apiClient.interceptors.response.use(
  response => {
    return response
  },
  error => {
    console.error('Response error:', error)
    
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      // Don't redirect here, let components handle it
    }
    
    return Promise.reject(error)
  }
)

// API methods
const api = {
  // Authentication
  async register(userData) {
    console.log('📤 Sending registration request:', {
      ...userData,
      password: '[HIDDEN]'
    })
    
    try {
      const response = await apiClient.post('/auth/register', userData)
      console.log('📥 Registration response:', response.data)
      return response
    } catch (error) {
      console.error('💥 Registration error:', error.response?.data || error.message)
      throw error
    }
  },

  async login(credentials) {
    console.log('📤 Sending login request for:', credentials.email)
    
    try {
      const response = await apiClient.post('/auth/user-login', credentials)
      console.log('📥 Login response:', response.data)
      return response
    } catch (error) {
      console.error('💥 Login error:', error.response?.data || error.message)
      throw error
    }
  },

  async adminLogin(credentials) {
    console.log('📤 Sending admin login request for:', credentials.username)
    
    try {
      const response = await apiClient.post('/auth/login', credentials)
      console.log('📥 Admin login response:', response.data)
      return response
    } catch (error) {
      console.error('💥 Admin login error:', error.response?.data || error.message)
      throw error
    }
  },

  async getProfile() {
    try {
      const response = await apiClient.get('/auth/profile')
      return response
    } catch (error) {
      console.error('💥 Get profile error:', error.response?.data || error.message)
      throw error
    }
  },

  // Rooms
  async getRooms() {
    try {
      const response = await apiClient.get('/rooms')
      return response
    } catch (error) {
      console.error('💥 Get rooms error:', error.response?.data || error.message)
      throw error
    }
  },

  async getRoomTypes() {
    try {
      const response = await apiClient.get('/room-types')
      return response
    } catch (error) {
      console.error('💥 Get room types error:', error.response?.data || error.message)
      throw error
    }
  },

  // Bookings
  async createBooking(bookingData) {
    try {
      const response = await apiClient.post('/bookings', bookingData)
      return response
    } catch (error) {
      console.error('💥 Create booking error:', error.response?.data || error.message)
      throw error
    }
  },

  async getUserBookings() {
    try {
      const response = await apiClient.get('/bookings/my-bookings')
      return response
    } catch (error) {
      console.error('💥 Get user bookings error:', error.response?.data || error.message)
      throw error
    }
  },

  // Test connection
  async testConnection() {
    try {
      const response = await apiClient.get('/health')
      console.log('🔗 Server connection test:', response.data)
      return response
    } catch (error) {
      console.error('💥 Connection test failed:', error.message)
      throw error
    }
  },

  // Helper methods
  isAuthenticated() {
    return !!localStorage.getItem('token')
  },

  getCurrentUser() {
    const userStr = localStorage.getItem('user')
    if (userStr) {
      try {
        return JSON.parse(userStr)
      } catch (error) {
        console.error('Error parsing user data:', error)
        return null
      }
    }
    return null
  },

  logout() {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }
}

export default api
