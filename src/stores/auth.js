import { ref, computed } from 'vue'

const user = ref(null)
const isAuthenticated = ref(false)

let expiryTimer = null
let routerInstance = null
let fetchGuardInstalled = false
let visibilityWatchInstalled = false

const AUTH_BYPASS = /\/api\/Auth\/(login|register|signup|forgot|reset)/i
const SESSION_EXPIRED_KEY = 'sessionExpired'

const decodeJwtPayload = (token) => {
  try {
    const payload = token.split('.')[1]
    const json = atob(payload.replace(/-/g, '+').replace(/_/g, '/'))
    return JSON.parse(decodeURIComponent(escape(json)))
  } catch {
    try {
      const payload = token.split('.')[1]
      return JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')))
    } catch {
      return null
    }
  }
}

export const getTokenExpiryMs = (userData = user.value) => {
  if (!userData) return null

  if (userData.expires) {
    const parsed = Date.parse(userData.expires)
    if (!Number.isNaN(parsed)) return parsed
    const numeric = Number(userData.expires)
    if (!Number.isNaN(numeric)) return numeric > 1e12 ? numeric : numeric * 1000
  }

  if (!userData.token) return null
  const payload = decodeJwtPayload(userData.token)
  if (payload?.exp) return payload.exp * 1000
  return null
}

export const isSessionExpired = (userData = user.value) => {
  if (!userData?.token) return true
  const expiry = getTokenExpiryMs(userData)
  if (!expiry) return false
  return Date.now() >= expiry - 1000
}

const clearExpiryTimer = () => {
  if (expiryTimer) {
    clearTimeout(expiryTimer)
    expiryTimer = null
  }
}

const redirectToLogin = () => {
  if (!routerInstance) return
  const current = routerInstance.currentRoute.value
  if (current.path === '/login') return
  routerInstance.replace({ path: '/login', query: { session: 'expired' } })
}

export const expireSession = (redirect = true) => {
  const wasAuthenticated = isAuthenticated.value || !!user.value
  clearExpiryTimer()
  user.value = null
  isAuthenticated.value = false
  localStorage.removeItem('user')
  localStorage.removeItem('isAuthenticated')
  sessionStorage.removeItem('user')
  sessionStorage.removeItem('isAuthenticated')

  if (!wasAuthenticated) return

  sessionStorage.setItem(SESSION_EXPIRED_KEY, '1')
  if (redirect) redirectToLogin()
}

const scheduleExpiryWatch = () => {
  clearExpiryTimer()
  if (!isAuthenticated.value) return
  const expiry = getTokenExpiryMs()
  if (!expiry) return
  const delay = Math.min(Math.max(0, expiry - Date.now() - 2000), 2147483647)
  expiryTimer = setTimeout(() => expireSession(true), delay)
}

export const bindAuthRouter = (router) => {
  routerInstance = router
}

export const consumeSessionExpiredFlag = () => {
  const flagged = sessionStorage.getItem(SESSION_EXPIRED_KEY) === '1'
  if (flagged) sessionStorage.removeItem(SESSION_EXPIRED_KEY)
  return flagged
}

export const handleUnauthorizedResponse = (url) => {
  const href = typeof url === 'string' ? url : ''
  if (AUTH_BYPASS.test(href)) return
  if (!isAuthenticated.value) return
  expireSession(true)
}

export const installAuthFetchGuard = () => {
  if (typeof window === 'undefined' || fetchGuardInstalled) return
  fetchGuardInstalled = true
  const originalFetch = window.fetch.bind(window)

  window.fetch = async (input, init) => {
    const url = typeof input === 'string' ? input : input?.url || ''

    if (isAuthenticated.value && isSessionExpired()) {
      expireSession(true)
    }

    const response = await originalFetch(input, init)
    if (response.status === 401) {
      handleUnauthorizedResponse(url)
    }
    return response
  }
}

export const installSessionVisibilityWatch = () => {
  if (typeof document === 'undefined' || visibilityWatchInstalled) return
  visibilityWatchInstalled = true

  const check = () => {
    if (isAuthenticated.value && isSessionExpired()) {
      expireSession(true)
    }
  }

  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') check()
  })
  window.addEventListener('focus', check)
}

export const useAuth = () => {
  const login = (userData, remember = false) => {
    user.value = userData
    isAuthenticated.value = true

    const storage = remember ? localStorage : sessionStorage
    storage.setItem('user', JSON.stringify(userData))
    storage.setItem('isAuthenticated', 'true')

    if (!remember) {
      localStorage.removeItem('user')
      localStorage.removeItem('isAuthenticated')
    } else {
      sessionStorage.removeItem('user')
      sessionStorage.removeItem('isAuthenticated')
    }

    scheduleExpiryWatch()
  }

  const logout = () => {
    clearExpiryTimer()
    user.value = null
    isAuthenticated.value = false
    localStorage.removeItem('user')
    localStorage.removeItem('isAuthenticated')
    sessionStorage.removeItem('user')
    sessionStorage.removeItem('isAuthenticated')
  }

  const initializeAuth = () => {
    const storedUser = localStorage.getItem('user') || sessionStorage.getItem('user')
    const storedAuth = localStorage.getItem('isAuthenticated') || sessionStorage.getItem('isAuthenticated')

    if (storedUser && storedAuth === 'true') {
      try {
        const parsed = JSON.parse(storedUser)
        if (isSessionExpired(parsed)) {
          expireSession(false)
          return
        }
        user.value = parsed
        isAuthenticated.value = true
        scheduleExpiryWatch()
      } catch {
        logout()
      }
    }
  }

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
    user: computed(() => user.value),
    isAuthenticated: computed(() => isAuthenticated.value),
    userName,
    userEmail,
    userRole,
    isAdmin,
    login,
    logout,
    initializeAuth
  }
}
