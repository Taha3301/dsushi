<template>
  <div class="dashboard-container">
    <!-- Loading State -->
    <div v-if="isLoading" class="loading-overlay">
      <div class="spinner"></div>
      <p>Loading dashboard data...</p>
    </div>

    <!-- Dashboard Content -->
    <div v-else class="dashboard-content">
      <p v-if="dashboardLoadTimedOut" class="dashboard-load-warning" role="status">
        Certaines données tardent à charger. Le tableau reste disponible ; vous pouvez réessayer avec « Actualiser ».
      </p>

      <!-- Header -->
      <div class="dashboard-header">
        <div class="dashboard-heading">
          <div class="dashboard-logo">
            <img :src="sushiLogo" alt="D. Sushi">
          </div>
          <div>
            <p class="dashboard-eyebrow">D. SUSHI · ADMINISTRATION</p>
            <h1 class="dashboard-title">Admin Dashboard</h1>
            <p class="dashboard-subtitle">Gérez votre activité et vos commandes en un coup d’œil.</p>
          </div>
        </div>
        <div class="header-actions">
          <button @click="refreshData" class="refresh-btn" :disabled="isRefreshing">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
            </svg>
            {{ isRefreshing ? 'Refreshing...' : 'Refresh' }}
          </button>
        </div>
      </div>

      <section class="schedule-card">
        <div class="mb-4">
          <h2 class="text-lg font-bold text-gray-900">Créneaux de commande</h2>
          <p class="mt-1 text-sm text-gray-600">Ajoutez les jours et heures que les clients pourront choisir au checkout.</p>
        </div>

        <form class="flex flex-col gap-3 sm:flex-row sm:items-end" @submit.prevent="addOrderTimeSlot">
          <div class="flex-1">
            <label for="new-order-time-slot" class="mb-1 block text-sm font-medium text-gray-700">Jour et heure</label>
            <input
              id="new-order-time-slot"
              v-model="newOrderTimeSlot"
              type="datetime-local"
              :min="minimumOrderTimeSlot"
              required
              class="min-h-11 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20"
            >
          </div>
          <button
            type="submit"
            :disabled="isAddingOrderTimeSlot || !newOrderTimeSlot"
            class="inline-flex min-h-11 items-center justify-center rounded-lg bg-red-600 px-5 text-sm font-semibold text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {{ isAddingOrderTimeSlot ? 'Ajout...' : 'Ajouter le créneau' }}
          </button>
        </form>

        <p v-if="orderTimeSlotsError" class="mt-3 text-sm text-red-700" role="alert">{{ orderTimeSlotsError }}</p>
        <p v-else-if="isOrderTimeSlotsLoading" class="mt-4 text-sm text-gray-500">Chargement des créneaux...</p>
        <p v-else-if="!orderTimeSlots.length" class="mt-4 text-sm text-gray-500">Aucun créneau à venir.</p>
        <ul v-else class="mt-4 divide-y divide-gray-100 rounded-lg border border-gray-200">
          <li
            v-for="slot in orderTimeSlots"
            :key="slot.slotId"
            class="flex items-center justify-between gap-3 px-3 py-3"
          >
            <span class="text-sm font-medium text-gray-800">{{ formatOrderTimeSlot(slot.date, slot.time) }}</span>
            <button
              type="button"
              :disabled="deletingOrderTimeSlotId === slot.slotId"
              class="rounded-md px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
              @click="deleteOrderTimeSlot(slot.slotId)"
            >
              {{ deletingOrderTimeSlotId === slot.slotId ? 'Suppression...' : 'Supprimer' }}
            </button>
          </li>
        </ul>
      </section>

      <!-- Summary Cards -->
      <div class="summary-grid">
        <div class="stat-card revenue">
          <div class="stat-icon">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </div>
          <div class="stat-content">
            <p class="stat-label">Total Revenue</p>
            <p class="stat-value">{{ formatCurrency(summary.totalRevenue) }}</p>
          </div>
        </div>

        <div class="stat-card orders">
          <div class="stat-icon">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
            </svg>
          </div>
          <div class="stat-content">
            <p class="stat-label">Total Orders</p>
            <p class="stat-value">{{ summary.totalOrders }}</p>
            <p class="stat-sublabel">{{ summary.unpaidOrders }} unpaid</p>
          </div>
        </div>

        <div class="stat-card customers">
          <div class="stat-icon">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
            </svg>
          </div>
          <div class="stat-content">
            <p class="stat-label">Total Customers</p>
            <p class="stat-value">{{ summary.totalCustomers }}</p>
          </div>
        </div>

        <div class="stat-card products">
          <div class="stat-icon">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
            </svg>
          </div>
          <div class="stat-content">
            <p class="stat-label">Total Products</p>
            <p class="stat-value">{{ summary.totalProducts }}</p>
          </div>
        </div>

        <div class="stat-card users">
          <div class="stat-icon">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/>
            </svg>
          </div>
          <div class="stat-content">
            <p class="stat-label">Total Users</p>
            <p class="stat-value">{{ userCounts.total }}</p>
            <p class="stat-sublabel">{{ userCounts.customers }} customers, {{ userCounts.admins }} admins</p>
          </div>
        </div>
      </div>

      <!-- Main Content Grid -->
      <div class="main-grid">
        <!-- Revenue Chart -->
        <div class="chart-card">
          <div class="card-header">
            <h2>Revenue Overview</h2>
            <div class="date-range">
              <input type="date" v-model="revenueFrom" @change="loadRevenue" class="date-input" />
              <span>to</span>
              <input type="date" v-model="revenueTo" @change="loadRevenue" class="date-input" />
            </div>
          </div>
          <div class="chart-content">
            <div class="revenue-summary">
              <p class="revenue-total">Total: {{ formatCurrency(revenueData.total) }}</p>
            </div>
            <div class="bar-chart">
              <div v-for="(day, index) in revenueData.daily" :key="index" class="bar-item">
                <div class="bar-wrapper">
                  <div 
                    class="bar" 
                    :style="{ height: getBarHeight(day.revenue) + '%' }"
                    :title="`${formatDate(day.date)}: ${formatCurrency(day.revenue)}`"
                  ></div>
                </div>
                <p class="bar-label">{{ formatDateShort(day.date) }}</p>
                <p class="bar-value">{{ formatCurrency(day.revenue) }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Order Status Distribution -->
        <div class="status-card">
          <div class="card-header">
            <h2>Order Status</h2>
          </div>
          <div class="status-list">
            <div v-for="status in orderStatusCounts" :key="status.status" class="status-item">
              <div class="status-info">
                <span class="status-badge" :class="getStatusClass(status.status)">{{ status.status }}</span>
                <span class="status-count">{{ status.count }} orders</span>
              </div>
              <span class="status-revenue">{{ formatCurrency(status.revenue) }}</span>
            </div>
          </div>
        </div>

        <!-- Recent Orders -->
        <div class="orders-card">
          <div class="card-header">
            <h2>Recent Orders</h2>
            <button @click="loadRecentOrders" class="icon-btn">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
              </svg>
            </button>
          </div>
          <div class="orders-table">
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Customer</th>
                  <th>Status</th>
                  <th>Amount</th>
                  <th>Items</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="order in recentOrders" :key="order.orderId">
                  <td>{{ formatDate(order.orderDate) }}</td>
                  <td>{{ order.customerName }}</td>
                  <td><span class="status-badge" :class="getStatusClass(order.status)">{{ order.status }}</span></td>
                  <td class="amount">{{ formatCurrency(order.totalAmount) }}</td>
                  <td>{{ order.items.length }} item(s)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Top Products -->
        <div class="products-card">
          <div class="card-header">
            <h2>Top Products</h2>
          </div>
          <div class="products-list">
            <div v-for="(product, index) in topProducts" :key="product.productId" class="product-item">
              <div class="product-rank">#{{ index + 1 }}</div>
              <div class="product-info">
                <p class="product-name">{{ product.productName }}</p>
                <p class="product-stats">{{ product.quantitySold }} sold • {{ formatCurrency(product.revenue) }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Low Stock Alert -->
        <div class="low-stock-card" v-if="lowStockProducts.length > 0">
          <div class="card-header alert-header">
            <h2>⚠️ Low Stock Alert</h2>
            <span class="alert-count">{{ lowStockProducts.length }} products</span>
          </div>
          <div class="low-stock-list">
            <div v-for="product in lowStockProducts" :key="product.productId" class="low-stock-item">
              <div class="product-image">
                <img :src="resolveImage(product.imageUrl)" :alt="product.name" />
              </div>
              <div class="product-details">
                <p class="product-name">{{ product.name }}</p>
                <p class="stock-amount">Stock: <span class="stock-low">{{ product.stock }}</span></p>
              </div>
            </div>
          </div>
        </div>

        <!-- Top Customers -->
        <div class="customers-card">
          <div class="card-header">
            <h2>Top Customers</h2>
          </div>
          <div class="customers-list">
            <div v-for="(customer, index) in topCustomers" :key="customer.customerId" class="customer-item">
              <div class="customer-rank">#{{ index + 1 }}</div>
              <div class="customer-info">
                <p class="customer-name">{{ customer.customerName }}</p>
                <p class="customer-stats">{{ customer.orders }} orders • {{ formatCurrency(customer.revenue) }}</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAuth } from '../../stores/auth.js'
import { api, resolveImage } from '../../utils/api.js'
import sushiLogo from '../../assets/sushilogopc.png'

const { user } = useAuth()


const headers = () => ({ 
  'accept': '*/*', 
  'Authorization': user.value?.token ? `Bearer ${user.value.token}` : '' 
})

// State
const isLoading = ref(true)
const isRefreshing = ref(false)
const dashboardLoadTimedOut = ref(false)
const isOrderTimeSlotsLoading = ref(false)
const isAddingOrderTimeSlot = ref(false)
const deletingOrderTimeSlotId = ref(null)
const newOrderTimeSlot = ref('')
const orderTimeSlots = ref([])
const orderTimeSlotsError = ref('')
const minimumOrderTimeSlot = (() => {
  const now = new Date()
  return new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0, 16)
})()

// Data
const summary = ref({
  totalRevenue: 0,
  totalOrders: 0,
  totalCustomers: 0,
  totalProducts: 0,
  lowStockCount: 0,
  unpaidOrders: 0
})

const revenueData = ref({
  from: '',
  to: '',
  total: 0,
  daily: []
})

const recentOrders = ref([])
const orderStatusCounts = ref([])
const topProducts = ref([])
const lowStockProducts = ref([])
const topCustomers = ref([])
const userCounts = ref({
  customers: 0,
  admins: 0,
  total: 0
})

// Date range for revenue
const revenueFrom = ref(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0])
const revenueTo = ref(new Date().toISOString().split('T')[0])

// Format currency
const formatCurrency = (amount) => {
  const value = Number(amount) || 0
  return new Intl.NumberFormat('fr-TN', { 
    style: 'currency', 
    currency: 'TND', 
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value)
}

// Format date
const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('fr-FR', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const formatDateShort = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })
}

// Get bar height for chart
const getBarHeight = (value) => {
  const max = Math.max(...revenueData.value.daily.map(d => d.revenue), 1)
  return max > 0 ? (value / max) * 100 : 0
}

// Get status class
const getStatusClass = (status) => {
  const statusMap = {
    'Pending': 'status-pending',
    'Confirmed': 'status-confirmed',
    'Preparing': 'status-preparing',
    'Ready': 'status-ready',
    'Delivered': 'status-delivered',
    'Cancelled': 'status-cancelled'
  }
  return statusMap[status] || 'status-default'
}


// Load summary
const loadSummary = async () => {
  try {
    const res = await fetch(api('/api/Admin/summary'), { headers: headers() })
    if (!res.ok) throw new Error('fetch summary failed')
    summary.value = await res.json()
  } catch (e) {
    console.error('Error loading summary:', e)
  }
}

// Load revenue
const loadRevenue = async () => {
  try {
    const fromDate = new Date(revenueFrom.value).toISOString()
    const toDate = new Date(revenueTo.value)
    toDate.setHours(23, 59, 59, 999)
    const toDateISO = toDate.toISOString()
    
    const res = await fetch(api(`/api/Admin/revenue?from=${encodeURIComponent(fromDate)}&to=${encodeURIComponent(toDateISO)}`), { 
      headers: headers() 
    })
    if (!res.ok) throw new Error('fetch revenue failed')
    revenueData.value = await res.json()
  } catch (e) {
    console.error('Error loading revenue:', e)
  }
}

// Load recent orders
const loadRecentOrders = async () => {
  try {
    const res = await fetch(api('/api/Admin/orders/recent?limit=10'), { headers: headers() })
    if (!res.ok) throw new Error('fetch recent orders failed')
    recentOrders.value = await res.json()
  } catch (e) {
    console.error('Error loading recent orders:', e)
  }
}

// Load order status counts
const loadOrderStatusCounts = async () => {
  try {
    const res = await fetch(api('/api/Admin/orders/status-count'), { headers: headers() })
    if (!res.ok) throw new Error('fetch order status counts failed')
    orderStatusCounts.value = await res.json()
  } catch (e) {
    console.error('Error loading order status counts:', e)
  }
}

// Load top products
const loadTopProducts = async () => {
  try {
    const res = await fetch(api('/api/Admin/top-products?limit=10'), { headers: headers() })
    if (!res.ok) throw new Error('fetch top products failed')
    topProducts.value = await res.json()
  } catch (e) {
    console.error('Error loading top products:', e)
  }
}

// Load low stock
const loadLowStock = async () => {
  try {
    const res = await fetch(api('/api/Admin/low-stock?threshold=5'), { headers: headers() })
    if (!res.ok) throw new Error('fetch low stock failed')
    lowStockProducts.value = await res.json()
  } catch (e) {
    console.error('Error loading low stock:', e)
  }
}

// Load top customers
const loadTopCustomers = async () => {
  try {
    const res = await fetch(api('/api/Admin/customers/top?limit=10'), { headers: headers() })
    if (!res.ok) throw new Error('fetch top customers failed')
    topCustomers.value = await res.json()
  } catch (e) {
    console.error('Error loading top customers:', e)
  }
}

const loadUserCounts = async () => {
  try {
    const response = await fetch(api('/api/Users'), { headers: headers() })
    if (!response.ok) throw new Error(`fetch users failed (HTTP ${response.status})`)

    const users = await response.json()
    if (!Array.isArray(users)) throw new Error('Invalid users response')

    const admins = users.filter(user => String(user.role || '').toLowerCase() === 'admin').length
    userCounts.value = {
      customers: users.length - admins,
      admins,
      total: users.length
    }
  } catch (error) {
    console.error('Error loading user counts:', error)
  }
}

const formatOrderTimeSlot = (day, time) => {
  const date = new Date(`${day}T${time}`)
  if (!day || !time || !Number.isFinite(date.getTime())) return 'Date de créneau invalide'

  return new Intl.DateTimeFormat('fr-FR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date)
}

const loadOrderTimeSlots = async () => {
  isOrderTimeSlotsLoading.value = true
  orderTimeSlotsError.value = ''
  try {
    const response = await fetch(api('/api/CanOrder/slots'), { headers: headers() })
    if (response.status === 404) {
      orderTimeSlotsError.value = 'La gestion des créneaux n’est pas encore disponible sur le serveur. Vérifiez le déploiement du backend.'
      throw new Error('fetch order time slots failed (HTTP 404)')
    }
    if (!response.ok) throw new Error(`fetch order time slots failed (HTTP ${response.status})`)
    const slots = await response.json()
    if (!Array.isArray(slots)) throw new Error('Invalid order time slots response')
    const normalizedSlots = slots.map(slot => ({
      slotId: slot?.slotId ?? slot?.orderTimeSlotId ?? slot?.OrderTimeSlotId,
      date: slot?.date ?? slot?.Date,
      time: slot?.time ?? slot?.Time
    }))
    orderTimeSlots.value = normalizedSlots.filter(slot =>
      slot.slotId && slot.date && slot.time && Number.isFinite(new Date(`${slot.date}T${slot.time}`).getTime())
    )
    if (orderTimeSlots.value.length !== slots.length) {
      orderTimeSlotsError.value = 'Le serveur a renvoyé un créneau avec une date invalide. Les créneaux valides restent affichés.'
      console.error('Invalid order time slot data received:', slots.filter((_, index) =>
        !orderTimeSlots.value.some(validSlot => validSlot.slotId === normalizedSlots[index].slotId)
      ))
    }
  } catch (error) {
    orderTimeSlots.value = []
    if (!orderTimeSlotsError.value) {
      orderTimeSlotsError.value = 'Impossible de charger les créneaux.'
    }
    console.error('Error loading order time slots:', error)
  } finally {
    isOrderTimeSlotsLoading.value = false
  }
}

const addOrderTimeSlot = async () => {
  if (!newOrderTimeSlot.value || isAddingOrderTimeSlot.value) return
  const [date, timePart] = newOrderTimeSlot.value.split('T')
  const time = timePart ? `${timePart}:00` : ''
  const scheduledAt = new Date(`${date}T${timePart}`)
  if (!Number.isFinite(scheduledAt.getTime()) || scheduledAt <= new Date()) {
    orderTimeSlotsError.value = 'Choisissez une date et une heure dans le futur.'
    return
  }

  isAddingOrderTimeSlot.value = true
  orderTimeSlotsError.value = ''
  try {
    const response = await fetch(api('/api/CanOrder/slots'), {
      method: 'POST',
      headers: {
        ...headers(),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ date, time })
    })
    if (!response.ok) {
      const responseBody = await response.text()
      if (response.status === 409) {
        orderTimeSlotsError.value = 'Ce créneau existe déjà.'
      } else if (response.status === 401 || response.status === 403) {
        orderTimeSlotsError.value = 'Votre session administrateur a expiré ou ne permet pas cette action.'
      } else if (response.status === 404) {
        orderTimeSlotsError.value = 'Le serveur ne reconnaît pas encore la gestion des créneaux. Déployez la mise à jour du backend.'
      } else {
        let details = responseBody
        try {
          const parsedBody = JSON.parse(responseBody)
          const validationErrors = parsedBody.errors
            ? Object.values(parsedBody.errors).flat().join(' ')
            : ''
          details = parsedBody.detail || parsedBody.message || validationErrors || parsedBody.title || responseBody
        } catch {
          // The backend may return a plain-text error instead of JSON.
        }
        orderTimeSlotsError.value = details
          ? `Impossible d’ajouter le créneau (HTTP ${response.status}) : ${details}`
          : `Impossible d’ajouter le créneau (HTTP ${response.status}).`
      }
      console.error('Error adding order time slot:', response.status, responseBody)
      return
    }

    newOrderTimeSlot.value = ''
    await loadOrderTimeSlots()
  } catch (error) {
    orderTimeSlotsError.value = 'Le serveur est injoignable. Vérifiez votre connexion et réessayez.'
    console.error('Error adding order time slot:', error)
  } finally {
    isAddingOrderTimeSlot.value = false
  }
}

const deleteOrderTimeSlot = async slotId => {
  if (deletingOrderTimeSlotId.value) return
  deletingOrderTimeSlotId.value = slotId
  orderTimeSlotsError.value = ''
  try {
    const response = await fetch(api(`/api/CanOrder/slots/${slotId}`), {
      method: 'DELETE',
      headers: headers()
    })
    if (!response.ok) throw new Error('delete order time slot failed')
    orderTimeSlots.value = orderTimeSlots.value.filter(slot => slot.slotId !== slotId)
  } catch (error) {
    orderTimeSlotsError.value = 'Impossible de supprimer ce créneau.'
    console.error('Error deleting order time slot:', error)
  } finally {
    deletingOrderTimeSlotId.value = null
  }
}

// Load all data
const loadAllData = async () => {
  dashboardLoadTimedOut.value = false
  let timeoutId
  try {
    const requests = Promise.all([
      loadOrderTimeSlots(),
      loadSummary(),
      loadRevenue(),
      loadRecentOrders(),
      loadOrderStatusCounts(),
      loadTopProducts(),
      loadLowStock(),
      loadTopCustomers(),
      loadUserCounts()
    ])
    await Promise.race([
      requests,
      new Promise((_, reject) => {
        timeoutId = setTimeout(() => reject(new Error('Dashboard data loading timed out')), 12000)
      })
    ])
  } catch (e) {
    console.error('Error loading dashboard data:', e)
    if (e instanceof Error && e.message === 'Dashboard data loading timed out') {
      dashboardLoadTimedOut.value = true
    }
  } finally {
    if (timeoutId) clearTimeout(timeoutId)
    isLoading.value = false
  }
}

// Refresh data
const refreshData = async () => {
  isRefreshing.value = true
  await loadAllData()
  setTimeout(() => { isRefreshing.value = false }, 500)
}

onMounted(loadAllData)
</script>

<style scoped>
.dashboard-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 2rem;
}

.loading-overlay {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 80vh;
  color: white;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 4px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.dashboard-content {
  max-width: 1600px;
  margin: 0 auto;
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.dashboard-title {
  font-size: 2.5rem;
  font-weight: 800;
  color: white;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
}

.refresh-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: white;
  color: #667eea;
  border: none;
  border-radius: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.refresh-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
}

.refresh-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 2rem;
}

/* Summary Cards */
.summary-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.stat-card {
  background: white;
  border-radius: 1rem;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1.5rem;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s, box-shadow 0.3s;
}

.stat-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.15);
}

.stat-icon {
  width: 60px;
  height: 60px;
  border-radius: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.stat-icon svg {
  width: 32px;
  height: 32px;
}

.stat-card.revenue .stat-icon {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.stat-card.orders .stat-icon {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  color: white;
}

.stat-card.customers .stat-icon {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  color: white;
}

.stat-card.products .stat-icon {
  background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
  color: white;
}

.stat-card.users .stat-icon {
  background: linear-gradient(135deg, #30cfd0 0%, #330867 100%);
  color: white;
}

.stat-content {
  flex: 1;
  min-width: 0;
}

.stat-label {
  font-size: 0.875rem;
  color: #6b7280;
  margin-bottom: 0.25rem;
  font-weight: 500;
}

.stat-value {
  font-size: 1.875rem;
  font-weight: 800;
  color: #1f2937;
  margin: 0;
  white-space: nowrap;
}

.stat-sublabel {
  font-size: 0.75rem;
  color: #9ca3af;
  margin-top: 0.25rem;
}

.stat-sublabel.warning {
  color: #ef4444;
  font-weight: 600;
}

/* Main Grid */
.main-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 1.5rem;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #e5e7eb;
}

.card-header h2 {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0;
}

/* Chart Card */
.chart-card,
.status-card,
.orders-card,
.products-card,
.low-stock-card,
.customers-card {
  background: white;
  border-radius: 1rem;
  padding: 1.5rem;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  max-height: 600px;
  overflow: hidden;
}

.chart-content,
.status-list,
.orders-table,
.products-list,
.low-stock-list,
.customers-list {
  overflow-y: auto;
  overflow-x: hidden;
  flex: 1;
  padding-right: 0.5rem;
}

.chart-content::-webkit-scrollbar,
.status-list::-webkit-scrollbar,
.orders-table::-webkit-scrollbar,
.products-list::-webkit-scrollbar,
.low-stock-list::-webkit-scrollbar,
.customers-list::-webkit-scrollbar {
  width: 6px;
}

.chart-content::-webkit-scrollbar-track,
.status-list::-webkit-scrollbar-track,
.orders-table::-webkit-scrollbar-track,
.products-list::-webkit-scrollbar-track,
.low-stock-list::-webkit-scrollbar-track,
.customers-list::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

.chart-content::-webkit-scrollbar-thumb,
.status-list::-webkit-scrollbar-thumb,
.orders-table::-webkit-scrollbar-thumb,
.products-list::-webkit-scrollbar-thumb,
.low-stock-list::-webkit-scrollbar-thumb,
.customers-list::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 10px;
}

.chart-content::-webkit-scrollbar-thumb:hover,
.status-list::-webkit-scrollbar-thumb:hover,
.orders-table::-webkit-scrollbar-thumb:hover,
.products-list::-webkit-scrollbar-thumb:hover,
.low-stock-list::-webkit-scrollbar-thumb:hover,
.customers-list::-webkit-scrollbar-thumb:hover {
  background: #555;
}

.date-range {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: #6b7280;
}

.date-input {
  padding: 0.5rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  font-size: 0.875rem;
}

.revenue-summary {
  margin-bottom: 1.5rem;
}

.revenue-total {
  font-size: 1.25rem;
  font-weight: 700;
  color: #667eea;
}

.bar-chart {
  display: flex;
  align-items: flex-end;
  gap: 0.75rem;
  height: 200px;
  padding: 1rem 0;
}

.bar-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.bar-wrapper {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: flex-end;
}

.bar {
  width: 100%;
  background: linear-gradient(180deg, #667eea 0%, #764ba2 100%);
  border-radius: 0.5rem 0.5rem 0 0;
  transition: all 0.3s;
  cursor: pointer;
}

.bar:hover {
  opacity: 0.8;
  transform: scaleY(1.05);
}

.bar-label {
  font-size: 0.75rem;
  color: #6b7280;
  text-align: center;
}

.bar-value {
  font-size: 0.75rem;
  font-weight: 600;
  color: #1f2937;
}

/* Status Card */
.status-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.status-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: #f9fafb;
  border-radius: 0.75rem;
  transition: background 0.3s;
}

.status-item:hover {
  background: #f3f4f6;
}

.status-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.status-badge {
  padding: 0.375rem 0.75rem;
  border-radius: 0.5rem;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
}

.status-pending {
  background: #fef3c7;
  color: #92400e;
}

.status-confirmed {
  background: #dbeafe;
  color: #1e40af;
}

.status-preparing {
  background: #e0e7ff;
  color: #3730a3;
}

.status-ready {
  background: #fce7f3;
  color: #9f1239;
}

.status-delivered {
  background: #d1fae5;
  color: #065f46;
}

.status-count {
  font-size: 0.875rem;
  color: #6b7280;
}

.status-revenue {
  font-weight: 700;
  color: #1f2937;
}

/* Orders Table */
.orders-table {
  overflow-x: auto;
  overflow-y: auto;
}

.orders-table table {
  width: 100%;
  border-collapse: collapse;
}

.orders-table th {
  text-align: left;
  padding: 0.75rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: #6b7280;
  border-bottom: 2px solid #e5e7eb;
}

.orders-table td {
  padding: 1rem 0.75rem;
  border-bottom: 1px solid #e5e7eb;
  font-size: 0.875rem;
  color: #1f2937;
}

.orders-table tr:hover {
  background: #f9fafb;
}

.orders-table .amount {
  font-weight: 700;
  color: #667eea;
}

.icon-btn {
  background: none;
  border: none;
  cursor: pointer;
  color: #6b7280;
  padding: 0.5rem;
  border-radius: 0.5rem;
  transition: all 0.3s;
}

.icon-btn:hover {
  background: #f3f4f6;
  color: #1f2937;
}

/* Products List */
.products-list,
.customers-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.product-item,
.customer-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: #f9fafb;
  border-radius: 0.75rem;
  transition: background 0.3s;
}

.product-item:hover,
.customer-item:hover {
  background: #f3f4f6;
}

.product-rank,
.customer-rank {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 0.5rem;
  font-weight: 700;
  flex-shrink: 0;
}

.product-info,
.customer-info {
  flex: 1;
}

.product-name,
.customer-name {
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 0.25rem 0;
}

.product-stats,
.customer-stats {
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0;
}

/* Low Stock Card */
.alert-header {
  border-bottom-color: #fef3c7;
}

.alert-count {
  background: #fef3c7;
  color: #92400e;
  padding: 0.375rem 0.75rem;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 600;
}

.low-stock-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.low-stock-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: #fef3c7;
  border-radius: 0.75rem;
  border-left: 4px solid #f59e0b;
}

.product-image {
  width: 60px;
  height: 60px;
  border-radius: 0.5rem;
  overflow: hidden;
  flex-shrink: 0;
}

.product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.product-details {
  flex: 1;
}

.stock-amount {
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0.25rem 0 0 0;
}

.stock-low {
  color: #ef4444;
  font-weight: 700;
}

/* Responsive */
@media (max-width: 768px) {
  .dashboard-container {
    padding: 1rem;
  }

  .dashboard-title {
    font-size: 1.75rem;
  }

  .summary-grid {
    grid-template-columns: 1fr;
  }

  .main-grid {
    grid-template-columns: 1fr;
  }

  .bar-chart {
    height: 150px;
  }
}

.dashboard-container {
  min-height: 100vh;
  padding: clamp(1rem, 3vw, 2.5rem);
  background:
    radial-gradient(ellipse at 100% 0%, rgba(190, 33, 38, 0.08), transparent 34rem),
    #f6f5f2;
  color: #201d1b;
}

.dashboard-content {
  max-width: 1560px;
}

.dashboard-header {
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
  padding: clamp(1.25rem, 3vw, 2.25rem);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 1.25rem;
  background: linear-gradient(115deg, #171514 0%, #292422 72%, #3a201f 100%);
  box-shadow: 0 18px 45px rgba(44, 30, 26, 0.16);
}

.dashboard-header::after {
  position: absolute;
  right: -3rem;
  bottom: -7rem;
  width: 18rem;
  height: 18rem;
  border: 1px solid rgba(213, 54, 55, 0.24);
  border-radius: 50%;
  box-shadow: 0 0 0 2rem rgba(213, 54, 55, 0.04), 0 0 0 4rem rgba(213, 54, 55, 0.03);
  content: "";
  pointer-events: none;
}

.dashboard-heading {
  z-index: 1;
  display: flex;
  align-items: center;
  gap: 1.1rem;
  min-width: 0;
}

.dashboard-logo {
  display: grid;
  width: clamp(5.5rem, 12vw, 8rem);
  height: 4.5rem;
  flex: 0 0 auto;
  place-items: center;
  padding: 0.65rem;
  border-radius: 0.85rem;
  background: #fff;
  box-shadow: 0 8px 22px rgba(0, 0, 0, 0.2);
}

.dashboard-logo img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.dashboard-eyebrow {
  margin: 0 0 0.25rem;
  color: #f08a83;
  font-size: 0.68rem;
  font-weight: 800;
  letter-spacing: 0.18em;
}

.dashboard-title {
  color: #fff;
  font-size: clamp(1.55rem, 3.5vw, 2.25rem);
  line-height: 1.1;
  text-shadow: none;
}

.dashboard-subtitle {
  margin: 0.45rem 0 0;
  color: #d4ceca;
  font-size: 0.9rem;
}

.header-actions {
  z-index: 1;
  flex: 0 0 auto;
}

.refresh-btn {
  min-height: 2.8rem;
  padding: 0.7rem 1rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background: #c92d32;
  color: #fff;
  box-shadow: 0 8px 20px rgba(151, 26, 30, 0.28);
}

.refresh-btn:hover:not(:disabled) {
  transform: translateY(-1px);
  background: #ad2328;
  box-shadow: 0 10px 22px rgba(151, 26, 30, 0.34);
}

.schedule-card,
.stat-card,
.chart-card,
.status-card,
.orders-card,
.products-card,
.low-stock-card,
.customers-card {
  border: 1px solid #eae6e1;
  background: #fff;
  box-shadow: 0 8px 26px rgba(49, 38, 33, 0.055);
}

.schedule-card {
  margin-bottom: 1.5rem;
  padding: clamp(1rem, 2vw, 1.5rem);
  border-radius: 1rem;
}

.schedule-card h2 {
  color: #241f1d;
}

.schedule-card input[type="datetime-local"],
.date-input {
  min-height: 2.8rem;
  border: 1px solid #e2ddd7;
  border-radius: 0.65rem;
  background-color: #fffdfa;
  color: #26211f;
}

.schedule-card input[type="datetime-local"]:focus,
.date-input:focus {
  border-color: #c92d32;
  outline: 3px solid rgba(201, 45, 50, 0.12);
}

.schedule-card button[type="submit"] {
  background: #c92d32;
}

.schedule-card button[type="submit"]:hover:not(:disabled) {
  background: #ad2328;
}

.schedule-card ul {
  border-color: #eee9e4;
}

.schedule-card li + li {
  border-color: #f0ece8;
}

.summary-grid {
  grid-template-columns: repeat(auto-fit, minmax(185px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.stat-card {
  position: relative;
  overflow: hidden;
  gap: 1rem;
  min-width: 0;
  padding: 1.2rem;
  border-radius: 1rem;
  box-shadow: 0 7px 22px rgba(49, 38, 33, 0.05);
}

.stat-card::before {
  position: absolute;
  inset: 0 auto 0 0;
  width: 3px;
  background: #c92d32;
  content: "";
}

.stat-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 14px 30px rgba(49, 38, 33, 0.1);
}

.stat-icon {
  width: 3rem;
  height: 3rem;
  border-radius: 0.8rem;
  background: #f9e9e7 !important;
  color: #b52228 !important;
}

.stat-icon svg {
  width: 1.55rem;
  height: 1.55rem;
}

.stat-label {
  color: #77716d;
  font-size: 0.78rem;
  font-weight: 650;
}

.stat-value {
  overflow: hidden;
  color: #221e1c;
  font-size: clamp(1.35rem, 2.4vw, 1.75rem);
  text-overflow: ellipsis;
}

.stat-sublabel {
  color: #8c8580;
}

.main-grid {
  grid-template-columns: minmax(0, 1.3fr) minmax(0, 0.9fr);
  gap: 1rem;
}

.chart-card,
.status-card,
.orders-card,
.products-card,
.low-stock-card,
.customers-card {
  min-width: 0;
  max-height: 540px;
  padding: clamp(1rem, 2vw, 1.4rem);
  border-radius: 1rem;
  box-shadow: 0 8px 26px rgba(49, 38, 33, 0.055);
}

.orders-card {
  grid-column: 1 / -1;
}

.card-header {
  gap: 1rem;
  margin-bottom: 1rem;
  padding-bottom: 0.85rem;
  border-bottom: 1px solid #eee9e4;
}

.card-header h2 {
  color: #241f1d;
  font-size: 1.08rem;
}

.date-range {
  flex-wrap: wrap;
  justify-content: flex-end;
  color: #807873;
  font-size: 0.76rem;
}

.date-input {
  padding: 0.45rem 0.55rem;
  font-size: 0.78rem;
}

.revenue-total {
  color: #b52228;
  font-size: 1.1rem;
}

.bar-chart {
  gap: 0.55rem;
}

.bar {
  background: linear-gradient(180deg, #e05555 0%, #b52228 100%);
  border-radius: 0.45rem 0.45rem 0.15rem 0.15rem;
}

.bar-label,
.bar-value {
  font-size: 0.68rem;
}

.chart-content::-webkit-scrollbar-thumb,
.status-list::-webkit-scrollbar-thumb,
.orders-table::-webkit-scrollbar-thumb,
.products-list::-webkit-scrollbar-thumb,
.low-stock-list::-webkit-scrollbar-thumb,
.customers-list::-webkit-scrollbar-thumb {
  background: #d5cdc6;
}

.chart-content::-webkit-scrollbar-thumb:hover,
.status-list::-webkit-scrollbar-thumb:hover,
.orders-table::-webkit-scrollbar-thumb:hover,
.products-list::-webkit-scrollbar-thumb:hover,
.low-stock-list::-webkit-scrollbar-thumb:hover,
.customers-list::-webkit-scrollbar-thumb:hover {
  background: #b9aea6;
}

.status-item,
.product-item,
.customer-item {
  border: 1px solid #f0ece8;
  background: #fbfaf8;
}

.status-item:hover,
.product-item:hover,
.customer-item:hover {
  background: #f7f2ee;
}

.status-badge {
  border-radius: 999px;
}

.status-pending {
  background: #fff2d7;
  color: #8a5a0a;
}

.status-confirmed {
  background: #fce8e6;
  color: #a4252a;
}

.status-preparing {
  background: #f4e9e7;
  color: #763a36;
}

.status-ready {
  background: #fbe3e3;
  color: #9d2930;
}

.status-delivered {
  background: #e8f2e8;
  color: #3c6542;
}

.status-revenue,
.orders-table .amount {
  color: #aa2429;
}

.orders-table th {
  border-bottom: 1px solid #eae5df;
  color: #77716d;
  font-size: 0.76rem;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.orders-table td {
  border-bottom-color: #f0ece8;
}

.orders-table tr:hover {
  background: #fbf7f4;
}

.icon-btn {
  color: #b52228;
}

.icon-btn:hover {
  background: #f9e9e7;
  color: #8f191f;
}

.product-rank,
.customer-rank {
  border-radius: 0.7rem;
  background: #f9e9e7;
  color: #ae242a;
}

.low-stock-item {
  border: 1px solid #f1d9bc;
  border-left: 4px solid #cc762a;
  background: #fff8ef;
}

.alert-header {
  border-bottom-color: #f1e1d0;
}

.alert-count {
  background: #fff0dc;
  color: #8e531d;
}

.stock-low {
  color: #b52228;
}

@media (max-width: 900px) {
  .main-grid {
    grid-template-columns: minmax(0, 1fr);
  }

  .orders-card {
    grid-column: auto;
  }
}

@media (max-width: 640px) {
  .dashboard-header {
    align-items: flex-start;
    flex-direction: column;
  }

  .header-actions,
  .refresh-btn {
    width: 100%;
  }

  .refresh-btn {
    justify-content: center;
  }

  .dashboard-logo {
    width: 5rem;
    height: 3.7rem;
    padding: 0.5rem;
  }

  .dashboard-subtitle {
    font-size: 0.8rem;
  }

  .summary-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 0.7rem;
  }

  .stat-card {
    align-items: flex-start;
    flex-direction: column;
    gap: 0.75rem;
    padding: 1rem;
  }

  .stat-icon {
    width: 2.55rem;
    height: 2.55rem;
  }

  .stat-value {
    font-size: 1.35rem;
  }

  .card-header {
    align-items: flex-start;
    flex-direction: column;
  }

  .date-range {
    justify-content: flex-start;
  }
}
</style>
