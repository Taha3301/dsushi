import { ref, computed } from 'vue'

// Reactive state
const user = ref(null)
const isAuthenticated = ref(false)

// Actions
export const useAuth = () => {
  const login = (userData) => {
    user.value = userData
    isAuthenticated.value = true
    // Store in localStorage for persistence
    localStorage.setItem('user', JSON.stringify(userData))
    localStorage.setItem('isAuthenticated', 'true')
  }

  const logout = () => {
    user.value = null
    isAuthenticated.value = false
    // Clear localStorage
    localStorage.removeItem('user')
    localStorage.removeItem('isAuthenticated')
  }

  const initializeAuth = () => {
    // Check localStorage on app start
    const storedUser = localStorage.getItem('user')
    const storedAuth = localStorage.getItem('isAuthenticated')
    
    if (storedUser && storedAuth === 'true') {
      user.value = JSON.parse(storedUser)
      isAuthenticated.value = true
    }
  }

  // Computed properties
  const userName = computed(() => {
    return user.value?.name || user.value?.email || 'Utilisateur'
  })

  const userEmail = computed(() => {
    return user.value?.email || ''
  })

  const userRole = computed(() => {
    return user.value?.role || ''
  })

  const isAdmin = computed(() => {
    return user.value?.role === 'Admin'
  })

  return {
    // State
    user: computed(() => user.value),
    isAuthenticated: computed(() => isAuthenticated.value),
    userName,
    userEmail,
    userRole,
    isAdmin,
    
    // Actions
    login,
    logout,
    initializeAuth
  }
}
