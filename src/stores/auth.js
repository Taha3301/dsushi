import { ref, computed } from 'vue'

// Reactive state
const user = ref(null)
const isAuthenticated = ref(false)

// Actions
export const useAuth = () => {
  const login = (userData, remember = false) => {
    user.value = userData
    isAuthenticated.value = true

    const storage = remember ? localStorage : sessionStorage
    storage.setItem('user', JSON.stringify(userData))
    storage.setItem('isAuthenticated', 'true')

    // If not remembering, clear any old localStorage data
    if (!remember) {
      localStorage.removeItem('user')
      localStorage.removeItem('isAuthenticated')
    }
  }

  const logout = () => {
    user.value = null
    isAuthenticated.value = false
    // Clear both
    localStorage.removeItem('user')
    localStorage.removeItem('isAuthenticated')
    sessionStorage.removeItem('user')
    sessionStorage.removeItem('isAuthenticated')
  }

  const initializeAuth = () => {
    // Check both localStorage and sessionStorage
    const storedUser = localStorage.getItem('user') || sessionStorage.getItem('user')
    const storedAuth = localStorage.getItem('isAuthenticated') || sessionStorage.getItem('isAuthenticated')

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
