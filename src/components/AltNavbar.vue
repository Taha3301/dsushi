<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../stores/auth.js'
import { api, resolveImage } from '../utils/api.js'

const router = useRouter()
const { isAuthenticated, userName, userRole, isAdmin, logout, user, userEmail } = useAuth()
const isOpen = ref(false)
const isScrolled = ref(false)
const showUserMenu = ref(false)
const showCartMenu = ref(false)
const isCartLoading = ref(false)
const cartItems = ref([])
const canOrder = ref(true)

// Search state
const searchQuery = ref('')
const searchResults = ref([])
const isSearching = ref(false)
let searchTimer = null

const toggle = () => (isOpen.value = !isOpen.value)
const close = () => (isOpen.value = false)

const handleScroll = () => {
  isScrolled.value = window.scrollY > 50
}

const navigateToLogin = () => {
  router.push('/login')
  close()
}

const navigateToCrud = () => {
  router.push('/crud')
  showUserMenu.value = false
}

const navigateToSettings = () => {
  router.push('/settings')
  showUserMenu.value = false
}

const navigateToOrders = () => {
  router.push('/orders')
  showUserMenu.value = false
}

const navigateToFactures = () => {
  router.push('/factures')
  showUserMenu.value = false
}

const handleLogout = () => {
  logout()
  router.push('/')
  showUserMenu.value = false
}

const toggleUserMenu = () => {
  showUserMenu.value = !showUserMenu.value
}

const toggleCartMenu = () => {
  showCartMenu.value = !showCartMenu.value
}


// Extract customerId from JWT (nameidentifier claim)
function getCustomerIdFromToken(token) {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    // Common claim keys
    return payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'] || payload.sub || payload.userId || null
  } catch {
    return null
  }
}

function loadCartFromLocal() {
  try {
    const raw = localStorage.getItem('cart')
    const parsed = raw ? JSON.parse(raw) : []
    cartItems.value = Array.isArray(parsed) ? parsed : []
  } catch {
    cartItems.value = []
  }
}

async function loadCartFromServer() {
  const token = user.value?.token
  const customerId = getCustomerIdFromToken(token)
  if (!token || !customerId) { loadCartFromLocal(); return }
  isCartLoading.value = true
  try {
    const res = await fetch(api(`/api/cart/${customerId}`), {
      headers: {
        'accept': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    })
    if (!res.ok) throw new Error('cart fetch failed')
    const data = await res.json()
    // Normalize to local cart item shape: { productId, name, price, quantity, image? }
    cartItems.value = (data?.items || []).map(i => ({
      productId: i.productId,
      name: i.productName,
      price: i.price,
      quantity: i.quantity,
      image: ''
    }))
  } catch (e) {
    console.error(e)
    loadCartFromLocal()
  } finally {
    isCartLoading.value = false
  }
}

const cartCount = computed(() => cartItems.value.reduce((sum, i) => sum + (Number(i.quantity) || 0), 0))
const cartTotal = computed(() => cartItems.value.reduce((sum, i) => sum + (Number(i.price) * Number(i.quantity) || 0), 0))

async function refreshCart() {
  // Strategy: if authenticated and (local empty OR local heavy >= 3 items) -> server; else local
  loadCartFromLocal()
  const localCount = cartItems.value.length
  if (isAuthenticated.value && (localCount === 0 || localCount >= 3)) {
    await loadCartFromServer()
  }
  await ensureCartImages()
}
async function removeItem(item) {
  const token = user.value?.token
  const customerId = token ? getCustomerIdFromToken(token) : null
  if (token && customerId) {
    try {
      const res = await fetch(api(`/api/cart/${customerId}/items/${item.productId}`), {
        method: 'DELETE',
        headers: {
          'accept': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      })
      if (!res.ok) throw new Error('remove from cart failed')
      await refreshCart()
      window.dispatchEvent(new Event('cart-updated'))
      return
    } catch (e) {
      console.error(e)
    }
  }
  try {
    const raw = localStorage.getItem('cart')
    const cart = raw ? JSON.parse(raw) : []
    const next = cart.filter(i => i.productId !== item.productId)
    localStorage.setItem('cart', JSON.stringify(next))
    await refreshCart()
    window.dispatchEvent(new Event('cart-updated'))
  } catch (e) {
    console.error(e)
  }
}

async function incrementItem(item) {
  const token = user.value?.token
  const customerId = token ? getCustomerIdFromToken(token) : null
  if (token && customerId) {
    try {
      const res = await fetch(api(`/api/cart/${customerId}/items`), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'accept': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ productId: item.productId, quantity: 1 })
      })
      if (!res.ok) throw new Error('increment failed')
      await refreshCart()
      window.dispatchEvent(new Event('cart-updated'))
      return
    } catch (e) { console.error(e) }
  }
  try {
    const raw = localStorage.getItem('cart')
    const cart = raw ? JSON.parse(raw) : []
    const idx = cart.findIndex(i => i.productId === item.productId)
    if (idx >= 0) cart[idx].quantity += 1; else cart.push({ ...item, quantity: 1 })
    localStorage.setItem('cart', JSON.stringify(cart))
    await refreshCart()
    window.dispatchEvent(new Event('cart-updated'))
  } catch (e) { console.error(e) }
}

async function decrementItem(item) {
  const token = user.value?.token
  const customerId = token ? getCustomerIdFromToken(token) : null
  if (token && customerId) {
    try {
      // As requested: use DELETE to remove the item entirely
      const res = await fetch(api(`/api/cart/${customerId}/items/${item.productId}`), {
        method: 'DELETE',
        headers: { 'accept': 'application/json', 'Authorization': `Bearer ${token}` }
      })
      if (!res.ok) throw new Error('delete failed')
      await refreshCart()
      window.dispatchEvent(new Event('cart-updated'))
      return
    } catch (e) { console.error(e) }
  }
  try {
    const raw = localStorage.getItem('cart')
    const cart = raw ? JSON.parse(raw) : []
    const next = cart.filter(i => i.productId !== item.productId)
    const cartChanged = JSON.stringify(next)
    localStorage.setItem('cart', cartChanged)
    localStorage.setItem('cart', JSON.stringify(cart))
    await refreshCart()
    window.dispatchEvent(new Event('cart-updated'))
  } catch (e) { console.error(e) }
}

// Delete item using /api/cart/{customerId}/products/{productId}
async function deleteItem(item) {
  const token = user.value?.token
  const customerId = token ? getCustomerIdFromToken(token) : null
  if (token && customerId) {
    try {
      const res = await fetch(api(`/api/cart/${customerId}/products/${item.productId}`), {
        method: 'DELETE',
        headers: {
          'accept': 'text/plain',
          'Authorization': `Bearer ${token}`
        }
      })
      if (!res.ok) throw new Error('delete product failed')
      await refreshCart()
      window.dispatchEvent(new Event('cart-updated'))
      return
    } catch (e) {
      console.error(e)
    }
  }
  // Fallback to local removal
  try {
    const raw = localStorage.getItem('cart')
    const cart = raw ? JSON.parse(raw) : []
    const next = cart.filter(i => i.productId !== item.productId)
    localStorage.setItem('cart', JSON.stringify(next))
    await refreshCart()
    window.dispatchEvent(new Event('cart-updated'))
  } catch (e) {
    console.error(e)
  }
}

// Ensure each cart item has an image by fetching products once
let cachedProducts = null
async function ensureCartImages() {
  try {
    const need = cartItems.value.some(i => !i.image)
    if (!need) return
    if (!cachedProducts) {
      const res = await fetch(api('/api/Product'), { headers: { 'accept': '*/*' } })
      if (!res.ok) throw new Error('products fetch failed')
      cachedProducts = await res.json()
    }
    const idToImg = new Map()
    for (const p of cachedProducts || []) {
      if (p?.productId) idToImg.set(p.productId, Array.isArray(p.imageUrls) ? p.imageUrls[0] : '')
    }
    cartItems.value = cartItems.value.map(i => ({
      ...i,
      image: i.image || idToImg.get(i.productId) || ''
    }))
  } catch (e) {
    console.error(e)
  }
}

async function fetchCanOrder() {
  try {
    const res = await fetch(api('/api/CanOrder'), { 
      headers: { 'accept': 'application/json' } 
    })
    if (!res.ok) throw new Error('CanOrder fetch failed')
    const data = await res.json()
    canOrder.value = data?.isEnabled !== false
  } catch (e) {
    console.error('Error fetching CanOrder:', e)
  }
}

// Search helpers
async function ensureProductsLoaded() {
  if (cachedProducts) return cachedProducts
  try {
    const res = await fetch(api('/api/Product'), { headers: { 'accept': '*/*' } })
    if (!res.ok) throw new Error('products fetch failed')
    cachedProducts = await res.json()
  } catch (e) {
    console.error(e)
    cachedProducts = []
  }
  return cachedProducts
}

async function performSearch(query) {
  const q = (query || '').trim().toLowerCase()
  if (!q) {
    searchResults.value = []
    isSearching.value = false
    return
  }
  isSearching.value = true
  try {
    const products = await ensureProductsLoaded()
    let matches
    if (q.length < 2) {
      // If query is short, don't show everything, just wait for more chars or show nothing
      matches = []
    } else {
      matches = (products || []).filter(p => (p?.name || '').toLowerCase().includes(q))
    }
    searchResults.value = matches.slice(0, 12)
  } catch (e) {
    console.error(e)
    searchResults.value = []
  } finally {
    isSearching.value = false
  }
}

function onSearchInput() {
  if (searchTimer) clearTimeout(searchTimer)
  searchTimer = setTimeout(() => performSearch(searchQuery.value), 200)
}

function clearSearch() {
  searchQuery.value = ''
  searchResults.value = []
}

function navigateToProduct(product) {
  if (!product?.productId) return
  router.push({ path: '/produit-details', query: { id: product.productId } })
  clearSearch()
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
  refreshCart()
  fetchCanOrder()
  window.addEventListener('cart-updated', refreshCart)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  window.removeEventListener('cart-updated', refreshCart)
})
</script>

<template>
  <header :class="[
    'sticky top-0 z-50 w-full backdrop-blur border-b border-gray-200 transition-all duration-300',
    isScrolled ? 'bg-[#E3E3E3]/70' : 'bg-[#E3E3E3]/95'
  ]">
    <div class="mx-auto max-w-7xl px-6">
      <!-- Mobile top bar: logo | search | hamburger -->
      <div class="flex h-16 items-center gap-3 md:hidden">
        <!-- Logo (no text) -->
        <router-link to="/" class="flex items-center" @click="close()">
          <img src="../assets/sushilogo.png" alt="Sushi" class="h-12 w-12 md:h-16 md:w-16 object-contain" />
        </router-link>
        <!-- Search -->
        <label class="relative flex-1" @keydown.escape="clearSearch()">
          <span class="pointer-events-none absolute inset-y-0 left-3 flex items-center text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="h-5 w-5"><path fill-rule="evenodd" d="M10.5 3.75a6.75 6.75 0 1 0 4.2 12.03l4.26 4.26a.75.75 0 1 0 1.06-1.06l-4.26-4.26A6.75 6.75 0 0 0 10.5 3.75Zm-5.25 6.75a5.25 5.25 0 1 1 10.5 0 5.25 5.25 0 0 1-10.5 0Z" clip-rule="evenodd"/></svg>
          </span>
          <input
            type="search"
            v-model="searchQuery"
            @input="onSearchInput"
            placeholder="Rechercher..."
            class="w-full rounded-full border border-gray-300 bg-white py-2 pl-10 pr-4 text-sm text-gray-900 placeholder:text-gray-400 shadow-sm focus:border-black focus:outline-none focus:ring-2 focus:ring-black/20"
          />
          <!-- Mobile search dropdown -->
          <div v-if="(searchQuery || isSearching || searchResults.length)" class="absolute left-0 right-0 top-11 z-50">
            <div class="rounded-2xl border border-gray-200 bg-white/95 backdrop-blur shadow-xl overflow-hidden ring-1 ring-black/5">
              <div class="px-3 py-2 bg-gray-50/60 border-b border-gray-100 flex items-center justify-between">
                <span class="text-xs font-semibold tracking-wide text-gray-600">Produits</span>
                <button v-if="searchQuery" @click="clearSearch" class="text-xs text-gray-500 hover:text-gray-800">Effacer</button>
              </div>
              <div v-if="isSearching" class="px-4 py-4 text-sm text-gray-500">Recherche…</div>
              <div v-else-if="!searchResults.length" class="px-4 py-4 text-sm text-gray-500">Aucun résultat</div>
              <ul v-else class="max-h-80 overflow-auto divide-y divide-gray-50">
                <li v-for="p in searchResults" :key="p.productId" @click="navigateToProduct(p)" class="px-4 py-3 cursor-pointer hover:bg-gray-50/80 flex items-center gap-3 transition-colors">
                  <div class="h-9 w-9 rounded-lg bg-gray-100 overflow-hidden shadow-sm">
                    <img :src="resolveImage((Array.isArray(p.imageUrls) ? p.imageUrls[0] : ''))" alt="img" class="w-full h-full object-cover" />
                  </div>
                  <div class="flex-1 min-w-0">
                    <div class="text-sm font-semibold text-gray-900 truncate">{{ p.name }}</div>
                    <div class="text-xs text-gray-500 truncate">{{ p.category?.name || '—' }}</div>
                  </div>
                  <div class="text-xs font-bold text-red-600 whitespace-nowrap">{{ Number(p.price).toFixed(2) }}</div>
                </li>
              </ul>
              <div class="px-3 py-2 bg-gray-50/60 border-t border-gray-100">
                <router-link to="/produits" @click.native="clearSearch" class="inline-flex items-center justify-center w-full h-9 rounded-lg bg-red-600 text-white text-xs font-semibold shadow hover:bg-red-700">Voir tous les produits</router-link>
              </div>
            </div>
          </div>
        </label>
        <!-- Cart (mobile, with dropdown like desktop) -->
        <div class="relative">
          <button
            @click="toggleCartMenu"
            class="relative inline-flex items-center justify-center rounded-full border border-gray-300 bg-white h-10 w-10 text-gray-900 shadow-sm hover:border-gray-400 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-black/10"
            aria-label="Panier"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="h-5 w-5">
              <path d="M2.25 3.75a.75.75 0 000 1.5H4.5l2.652 9.28A3 3 0 0010.057 16.5h6.693a3 3 0 002.88-2.115l1.533-5.11A.75.75 0 0021.45 8H7.302l-.6-2.1A1.5 1.5 0 005.262 4.5H2.25zM9.75 20.25a1.5 1.5 0 11-3.001 0 1.5 1.5 0 013.001 0zm9 0a1.5 1.5 0 11-3.001 0 1.5 1.5 0 013.001 0z" />
            </svg>
            <span v-if="cartCount > 0" class="absolute -top-1 -right-1 inline-flex items-center justify-center text-[10px] leading-none px-1.5 h-4 rounded-full bg-red-600 text-white">{{ cartCount }}</span>
          </button>
          <!-- Dropdown (mobile) -->
          <div v-if="showCartMenu" class="md:hidden fixed left-3 right-3 top-16 bg-white rounded-2xl shadow-2xl border border-gray-200 py-2 z-[60]">
            <div class="px-4 py-2 border-b border-gray-100 flex items-center justify-between">
              <p class="text-sm font-semibold text-gray-900">Panier</p>
              <button @click="refreshCart" class="text-xs text-gray-500 hover:text-gray-800">Rafraîchir</button>
            </div>
            <div class="max-h-[60vh] overflow-auto">
              <div v-if="isCartLoading" class="px-4 py-6 text-center text-gray-500 text-sm">Chargement…</div>
              <div v-else-if="cartItems.length === 0" class="px-4 py-6 text-center text-gray-500 text-sm">Votre panier est vide</div>
              <div v-else>
                <div v-for="item in cartItems" :key="item.productId" class="px-4 py-2 flex items-center gap-3 border-b border-gray-50">
                  <div class="h-11 w-11 rounded-lg bg-gray-100 overflow-hidden flex items-center justify-center">
                    <img :src="resolveImage(item.image)" alt="img" class="w-full h-full object-cover" />
                  </div>
                  <div class="flex-1 min-w-0">
                    <div class="text-[13px] font-medium text-gray-900 truncate">{{ item.name }}</div>
                    <div class="mt-1 inline-flex items-center gap-2">
                      <button @click="decrementItem(item)" class="h-7 w-7 inline-flex items-center justify-center rounded border border-gray-300 text-gray-700 hover:bg-gray-50" aria-label="Diminuer">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="h-4 w-4"><path d="M5 12.75a.75.75 0 010-1.5h14a.75.75 0 010 1.5H5z"/></svg>
                      </button>
                      <span class="text-xs text-gray-700 min-w-[1.25rem] text-center">{{ item.quantity }}</span>
                      <button @click="incrementItem(item)" class="h-7 w-7 inline-flex items-center justify-center rounded border border-gray-300 text-gray-700 hover:bg-gray-50" aria-label="Augmenter">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="h-4 w-4"><path d="M12.75 5a.75.75 0 00-1.5 0v6.25H5a.75.75 0 000 1.5h6.25V19a.75.75 0 001.5 0v-6.25H19a.75.75 0 000-1.5h-6.25V5z"/></svg>
                      </button>
                    </div>
                  </div>
                  <div class="flex items-center gap-2">
                    <div class="text-sm font-semibold text-gray-900 whitespace-nowrap">{{ (Number(item.price) * Number(item.quantity)).toFixed(2) }}</div>
                    <button @click="deleteItem(item)" class="h-8 w-8 inline-flex items-center justify-center rounded border border-gray-300 text-gray-700 hover:bg-gray-50" aria-label="Supprimer">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="h-4 w-4"><path d="M9 3.75A1.5 1.5 0 0 1 10.5 2.25h3A1.5 1.5 0 0 1 15 3.75V4.5h4.5a.75.75 0 0 1 0 1.5H4.5a.75.75 0 0 1 0-1.5H9V3.75ZM6.75 7.5h10.5l-.69 11.044A2.25 2.25 0 0 1 14.318 20.75H9.682a2.25 2.25 0 0 1-2.242-2.206L6.75 7.5Z"/></svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div class="px-4 pb-3 pt-3" v-if="cartItems.length > 0">
              <router-link 
                :to="canOrder ? '/passer-a-la-caisse' : '#'" 
                @click.native="canOrder ? showCartMenu = false : $event.preventDefault()" 
                :class="[
                  'inline-flex w-full items-center justify-center gap-2 rounded-full h-10 text-sm font-semibold shadow transition-all duration-200',
                  canOrder ? 'bg-red-600 text-white hover:bg-red-700' : 'bg-gray-200 text-gray-500 cursor-not-allowed pointer-events-none'
                ]"
              >
                {{ canOrder ? 'Passer à la caisse' : 'Nous serons bientôt de retour' }}
              </router-link>
              <p v-if="!canOrder" class="mt-2 text-center text-[11px] text-gray-500 italic">
                Notre service de commande en ligne sera de nouveau opérationnel très bientôt.
              </p>
            </div>
          </div>
        </div>
        <!-- Hamburger -->
        <button type="button" class="inline-flex items-center justify-center rounded-md p-2 text-gray-700 hover:bg-gray-100 hover:text-black focus:outline-none focus:ring-2 focus:ring-black/20" :aria-expanded="isOpen" aria-controls="mobile-menu" @click="toggle">
          <svg v-if="!isOpen" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5"/>
          </svg>
          <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>

      <!-- Desktop row -->
      <div class="hidden md:grid grid-cols-[auto_1fr_auto] items-center h-16">
        <!-- Left: Brand only -->
        <div class="flex items-center">
          <router-link to="/" class="flex items-center gap-2" @click="close()">
            <img src="../assets/sushilogopc.png" alt="Sushi" class="h-20 w-20 md:h-16 md:w-50 object-contain" />
          </router-link>
        </div>

        <!-- Center: Search -->
        <div class="flex justify-center px-6">
          <label class="relative w-full max-w-xl" @keydown.escape="clearSearch()">
            <span class="pointer-events-none absolute inset-y-0 left-3 flex items-center text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="h-5 w-5"><path fill-rule="evenodd" d="M10.5 3.75a6.75 6.75 0 1 0 4.2 12.03l4.26 4.26a.75.75 0 1 0 1.06-1.06l-4.26-4.26A6.75 6.75 0 0 0 10.5 3.75Zm-5.25 6.75a5.25 5.25 0 1 1 10.5 0 5.25 5.25 0 0 1-10.5 0Z" clip-rule="evenodd"/></svg>
            </span>
            <input
              type="search"
              v-model="searchQuery"
              @input="onSearchInput"
              placeholder="Rechercher des menus, articles ou guides..."
              class="w-full rounded-full border border-gray-300 bg-white py-2 pl-10 pr-4 text-sm text-gray-900 placeholder:text-gray-400 shadow-sm focus:border-black focus:outline-none focus:ring-2 focus:ring-black/20"
            />
            <!-- Desktop search dropdown -->
            <div v-if="(searchQuery || isSearching || searchResults.length)" class="absolute left-0 right-0 top-11 z-50">
              <div class="rounded-2xl border border-gray-200 bg-white/95 backdrop-blur shadow-2xl overflow-hidden ring-1 ring-black/5">
                <div class="px-4 py-2 bg-gray-50/60 border-b border-gray-100 flex items-center justify-between">
                  <span class="text-xs font-semibold tracking-wide text-gray-600">Produits</span>
                  <button v-if="searchQuery" @click="clearSearch" class="text-xs text-gray-500 hover:text-gray-800">Effacer</button>
                </div>
                <div v-if="isSearching" class="px-5 py-4 text-sm text-gray-500">Recherche…</div>
                <div v-else-if="!searchResults.length" class="px-5 py-4 text-sm text-gray-500">Aucun résultat</div>
                <ul v-else class="max-h-96 overflow-auto divide-y divide-gray-50">
                  <li v-for="p in searchResults" :key="p.productId" @click="navigateToProduct(p)" class="px-5 py-3 cursor-pointer hover:bg-gray-50/80 flex items-center gap-3 transition-colors">
                    <div class="h-10 w-10 rounded-lg bg-gray-100 overflow-hidden shadow-sm">
                      <img :src="resolveImage((Array.isArray(p.imageUrls) ? p.imageUrls[0] : ''))" alt="img" class="w-full h-full object-cover" />
                    </div>
                    <div class="flex-1 min-w-0">
                      <div class="text-sm font-semibold text-gray-900 truncate">{{ p.name }}</div>
                      <div class="text-xs text-gray-500 truncate">{{ p.category?.name || '—' }}</div>
                    </div>
                    <div class="text-sm font-bold text-red-600 whitespace-nowrap">{{ Number(p.price).toFixed(2) }}</div>
                  </li>
                </ul>
                <div class="px-4 py-2 bg-gray-50/60 border-t border-gray-100">
                  <router-link to="/produits" @click.native="clearSearch" class="inline-flex items-center justify-center w-full h-9 rounded-lg bg-red-600 text-white text-xs font-semibold shadow hover:bg-red-700">Voir tous les produits</router-link>
                </div>
              </div>
            </div>
          </label>
        </div>

        <!-- Right: Links + Actions -->
        <div class="flex items-center justify-end gap-4 md:gap-6">
          <nav class="hidden md:flex items-center gap-6">
            <router-link to="/who-we-are" class="text-sm font-medium text-gray-700 hover:text-black transition-colors" @click.native="close()">Qui sommes nous</router-link>
            <router-link to="/contact" class="text-sm font-medium text-gray-700 hover:text-black transition-colors" @click.native="close()">Contact</router-link>
          </nav>

          <!-- Cart Dropdown -->
          <div class="relative">
            <button
              @click="toggleCartMenu"
              class="inline-flex items-center justify-center rounded-full border border-gray-300 bg-white h-10 w-10 text-gray-900 shadow-sm hover:border-gray-400 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-black/10 transition-all duration-200 hover:scale-105"
              aria-label="Panier"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="h-5 w-5">
                <path d="M2.25 3.75a.75.75 0 000 1.5H4.5l2.652 9.28A3 3 0 0010.057 16.5h6.693a3 3 0 002.88-2.115l1.533-5.11A.75.75 0 0021.45 8H7.302l-.6-2.1A1.5 1.5 0 005.262 4.5H2.25zM9.75 20.25a1.5 1.5 0 11-3.001 0 1.5 1.5 0 013.001 0zm9 0a1.5 1.5 0 11-3.001 0 1.5 1.5 0 013.001 0z" />
              </svg>
              <span v-if="cartCount > 0" class="absolute -top-1 -right-1 inline-flex items-center justify-center text-[10px] leading-none px-1.5 h-4 rounded-full bg-red-600 text-white">{{ cartCount }}</span>
            </button>
            <!-- Dropdown -->
            <div v-if="showCartMenu" class="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
              <div class="px-4 py-2 border-b border-gray-100 flex items-center justify-between">
                <p class="text-sm font-semibold text-gray-900">Panier</p>
                <button @click="refreshCart" class="text-xs text-gray-500 hover:text-gray-800">Rafraîchir</button>
              </div>
              <div class="max-h-72 overflow-auto">
                <div v-if="isCartLoading" class="px-4 py-6 text-center text-gray-500 text-sm">Chargement…</div>
                <div v-else-if="cartItems.length === 0" class="px-4 py-6 text-center text-gray-500 text-sm">Votre panier est vide</div>
                <div v-else>
                  <div v-for="item in cartItems" :key="item.productId" class="px-4 py-3 flex items-center gap-3 border-b border-gray-50">
                    <div class="h-12 w-12 rounded-lg bg-gray-100 overflow-hidden flex items-center justify-center">
                      <img :src="resolveImage(item.image)" alt="img" class="w-full h-full object-cover" />
                    </div>
                    <div class="flex-1 min-w-0">
                      <div class="text-sm font-medium text-gray-900 truncate">{{ item.name }}</div>
                      <div class="mt-1 inline-flex items-center gap-2">
                        <button @click="decrementItem(item)" class="h-6 w-6 inline-flex items-center justify-center rounded border border-gray-300 text-gray-700 hover:bg-gray-50" aria-label="Diminuer">
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="h-3.5 w-3.5"><path d="M5 12.75a.75.75 0 010-1.5h14a.75.75 0 010 1.5H5z"/></svg>
                        </button>
                        <span class="text-xs text-gray-700 min-w-[1.25rem] text-center">{{ item.quantity }}</span>
                        <button @click="incrementItem(item)" class="h-6 w-6 inline-flex items-center justify-center rounded border border-gray-300 text-gray-700 hover:bg-gray-50" aria-label="Augmenter">
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="h-3.5 w-3.5"><path d="M12.75 5a.75.75 0 00-1.5 0v6.25H5a.75.75 0 000 1.5h6.25V19a.75.75 0 001.5 0v-6.25H19a.75.75 0 000-1.5h-6.25V5z"/></svg>
                        </button>
                      </div>
                    </div>
                    <div class="flex items-center gap-3">
                      <div class="text-sm font-semibold text-gray-900 whitespace-nowrap">{{ (Number(item.price) * Number(item.quantity)).toFixed(2) }}</div>
                      <button @click="deleteItem(item)" class="h-8 w-8 inline-flex items-center justify-center rounded border border-gray-300 text-gray-700 hover:bg-gray-50" aria-label="Supprimer">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="h-4 w-4"><path d="M9 3.75A1.5 1.5 0 0 1 10.5 2.25h3A1.5 1.5 0 0 1 15 3.75V4.5h4.5a.75.75 0 0 1 0 1.5H4.5a.75.75 0 0 1 0-1.5H9V3.75ZM6.75 7.5h10.5l-.69 11.044A2.25 2.25 0 0 1 14.318 20.75H9.682a2.25 2.25 0 0 1-2.242-2.206L6.75 7.5Z"/></svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div class="px-4 py-3 border-t border-gray-100 flex items-center justify-between" v-if="cartItems.length > 0">
                <span class="text-sm text-gray-600">Total estimé</span>
                <span class="text-sm font-bold text-gray-900">{{ cartTotal.toFixed(2) }}</span>
              </div>
              <div class="px-4 pb-3" v-if="cartItems.length > 0">
                <router-link 
                  :to="canOrder ? '/passer-a-la-caisse' : '#'" 
                  @click.native="canOrder ? showCartMenu = false : $event.preventDefault()" 
                  :class="[
                    'inline-flex w-full items-center justify-center gap-2 rounded-full h-10 text-sm font-semibold shadow transition-all duration-200',
                    canOrder ? 'bg-red-600 text-white hover:bg-red-700' : 'bg-gray-200 text-gray-500 cursor-not-allowed pointer-events-none'
                  ]"
                >
                  {{ canOrder ? 'Passer à la caisse' : 'Nous serons bientôt de retour' }}
                </router-link>
                <p v-if="!canOrder" class="mt-2 text-center text-[11px] text-gray-500 italic">
                  Notre service de commande en ligne sera de nouveau opérationnel très bientôt.
                </p>
              </div>
            </div>
          </div>
          
          <!-- User Menu (when logged in) -->
          <div v-if="isAuthenticated" class="relative">
            <button 
              @click="toggleUserMenu"
              class="inline-flex items-center gap-2 rounded-full border border-gray-300 bg-white px-4 h-10 text-sm font-semibold text-gray-900 shadow-sm hover:border-gray-400 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-black/10 transition-all duration-200 hover:scale-105"
            >
              <div class="w-6 h-6 bg-red-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                {{ userName.charAt(0).toUpperCase() }}
              </div>
              {{ userName }}
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </button>
            
            <!-- Dropdown Menu -->
            <div v-if="showUserMenu" class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
              <div class="px-4 py-2 border-b border-gray-100">
                <p class="text-sm font-medium text-gray-900">{{ userName }}</p>
                <p class="text-xs text-gray-500">{{ userEmail }}</p>
                <p v-if="isAdmin" class="text-xs text-red-600 font-medium">{{ userRole }}</p>
              </div>
              
              <!-- Admin Options -->
              <div v-if="isAdmin">
                <button 
                  @click="navigateToCrud"
                  class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  </svg>
                  Gestion des produits
                </button>
              </div>
              
              <!-- Orders Option -->
              <button 
                @click="navigateToOrders"
                class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
                Mes commandes
              </button>

              <!-- Factures Option -->
              <button 
                @click="navigateToFactures"
                class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17h6l3 3v-3h2V9h-2M4 4h11v8H9l-3 3v-3H4V4z"></path>
                </svg>
                Mes factures
              </button>

              <!-- Settings Option -->
              <button 
                @click="navigateToSettings"
                class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                </svg>
                Paramètres
              </button>
              
              <button 
                @click="handleLogout"
                class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Se déconnecter
              </button>
            </div>
          </div>
          
          <!-- Login Button (when not logged in) -->
          <button v-else @click="navigateToLogin" class="inline-flex select-none items-center rounded-full border border-gray-300 bg-white px-5 h-10 text-sm font-semibold text-gray-900 shadow-sm hover:border-gray-400 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-black/10 transition-all duration-200 hover:scale-105">Se connecter</button>
        </div>
      </div>
    </div>

    <!-- Mobile menu panel -->
    <div id="mobile-menu" class="md:hidden" v-show="isOpen">
      <div :class="[
        'border-t border-gray-200 backdrop-blur transition-all duration-300',
        isScrolled ? 'bg-[#E3E3E3]/70' : 'bg-[#E3E3E3]/95'
      ]">
        <div class="mx-auto max-w-7xl px-6 py-4 space-y-4">
          <router-link to="/who-we-are" @click.native="close()" class="block text-base font-medium text-gray-700 hover:text-black">Qui sommes nous</router-link>
          <router-link to="/contact" @click.native="close()" class="block text-base font-medium text-gray-700 hover:text-black">Contact</router-link>
          <div class="pt-2 flex items-center gap-3">
            <!-- User Menu (when logged in) -->
            <div v-if="isAuthenticated" class="w-full">
              <div class="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div class="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                  {{ userName.charAt(0).toUpperCase() }}
                </div>
                <div class="flex-1">
                  <p class="text-sm font-medium text-gray-900">{{ userName }}</p>
                  <p class="text-xs text-gray-500">{{ userEmail }}</p>
                  <p v-if="isAdmin" class="text-xs text-red-600 font-medium">{{ userRole }}</p>
                </div>
              </div>
              
              <!-- Admin Options -->
              <button v-if="isAdmin" 
                @click="navigateToCrud"
                class="w-full mt-2 inline-flex items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-5 h-10 text-sm font-semibold text-gray-900 shadow-sm hover:border-gray-400 hover:bg-gray-50 transition-all duration-200 hover:scale-105"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                </svg>
                Gestion des produits
              </button>
              
              <!-- Orders Option -->
              <button 
                @click="navigateToOrders"
                class="w-full mt-2 inline-flex items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-5 h-10 text-sm font-semibold text-gray-900 shadow-sm hover:border-gray-400 hover:bg-gray-50 transition-all duration-200 hover:scale-105"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
                Mes commandes
              </button>

              <!-- Factures Option -->
              <button 
                @click="navigateToFactures"
                class="w-full mt-2 inline-flex items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-5 h-10 text-sm font-semibold text-gray-900 shadow-sm hover:border-gray-400 hover:bg-gray-50 transition-all duration-200 hover:scale-105"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17h6l3 3v-3h2V9h-2M4 4h11v8H9l-3 3v-3H4V4z"></path>
                </svg>
                Mes factures
              </button>

              <!-- Settings Option -->
              <button 
                @click="navigateToSettings"
                class="w-full mt-2 inline-flex items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-5 h-10 text-sm font-semibold text-gray-900 shadow-sm hover:border-gray-400 hover:bg-gray-50 transition-all duration-200 hover:scale-105"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                </svg>
                Paramètres
              </button>
              
              <button 
                @click="handleLogout"
                class="w-full mt-2 inline-flex items-center justify-center rounded-full border border-gray-300 bg-white px-5 h-10 text-sm font-semibold text-gray-900 shadow-sm hover:border-gray-400 hover:bg-gray-50 transition-all duration-200 hover:scale-105"
              >
                Se déconnecter
              </button>
            </div>
            
            <!-- Login Button (when not logged in) -->
            <button v-else @click="navigateToLogin" class="inline-flex select-none items-center rounded-full border border-gray-300 bg-white px-5 h-10 text-sm font-semibold text-gray-900 shadow-sm hover:border-gray-400 hover:bg-gray-50 transition-all duration-200 hover:scale-105">Se connecter</button>
          </div>
        </div>
      </div>
    </div>
  </header>
  
</template>
