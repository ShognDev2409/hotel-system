const state = {
    token: null,
    user: null,
    isLoggedIn: false
  }
  
  const mutations = {
    SET_TOKEN(state, token) {
      state.token = token
      state.isLoggedIn = !!token
      localStorage.setItem('authToken', token)
    },
    
    SET_USER(state, user) {
      state.user = user
      localStorage.setItem('userData', JSON.stringify(user))
    },
    
    LOGOUT(state) {
      state.token = null
      state.user = null
      state.isLoggedIn = false
      localStorage.removeItem('authToken')
      localStorage.removeItem('userData')
    },
    
    LOAD_FROM_STORAGE(state) {
      const token = localStorage.getItem('authToken')
      const userData = localStorage.getItem('userData')
      
      if (token) {
        state.token = token
        state.isLoggedIn = true
      }
      
      if (userData) {
        try {
          state.user = JSON.parse(userData)
        } catch (error) {
          console.error('Error parsing user data:', error)
        }
      }
    }
  }
  
  const actions = {
    login({ commit }, { token, user }) {
      commit('SET_TOKEN', token)
      commit('SET_USER', user)
    },
    
    logout({ commit }) {
      commit('LOGOUT')
    },
    
    loadFromStorage({ commit }) {
      commit('LOAD_FROM_STORAGE')
    }
  }
  
  const getters = {
    isLoggedIn: state => state.isLoggedIn,
    currentUser: state => state.user,
    authToken: state => state.token,
    userName: state => state.user ? state.user.name : null,
    cusId: state => state.user ? state.user.c_id : null,
  }
  
  export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters
  }