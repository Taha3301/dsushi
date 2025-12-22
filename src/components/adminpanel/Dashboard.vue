<template>
  <div class="dashboard-container">
    <!-- Loading State -->
    <div v-if="isLoading" class="loading-overlay">
      <div class="spinner"></div>
      <p>Loading dashboard data...</p>
    </div>

    <!-- Dashboard Content -->
    <div v-else class="dashboard-content">
      <!-- Header -->
      <div class="dashboard-header">
        <h1 class="dashboard-title">Admin Dashboard</h1>
        <div class="header-actions">
          <!-- CanOrder Toggle Switch -->
          <div class="can-order-toggle" :class="{ 'is-loading': isCanOrderLoading }">
            <span class="toggle-label">Accepting Orders</span>
            <label class="switch">
              <input 
                type="checkbox" 
                :checked="canOrderData?.isEnabled" 
                @change="toggleCanOrderStatus"
                :disabled="isCanOrderLoading"
              >
              <span class="slider round">
                <span class="slider-icon on">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
                </span>
                <span class="slider-icon off">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
                </span>
              </span>
            </label>
            <span class="status-indicator" :class="canOrderData?.isEnabled ? 'active' : 'inactive'">
              {{ canOrderData?.isEnabled ? 'Active' : 'Paused' }}
            </span>
          </div>

          <button @click="refreshData" class="refresh-btn" :disabled="isRefreshing">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
            </svg>
            {{ isRefreshing ? 'Refreshing...' : 'Refresh' }}
          </button>
        </div>
      </div>

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

        <div class="stat-card invoices">
          <div class="stat-icon">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
            </svg>
          </div>
          <div class="stat-content">
            <p class="stat-label">Total Invoices</p>
            <p class="stat-value">{{ summary.totalInvoices }}</p>
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

        <!-- Recent Invoices -->
        <div class="invoices-card">
          <div class="card-header">
            <h2>Recent Invoices</h2>
          </div>
          <div class="invoices-list">
            <div v-for="invoice in invoiceSummary.recent" :key="invoice.invoiceId" class="invoice-item">
              <div class="invoice-info">
                <p class="invoice-number">{{ invoice.invoiceNumber }}</p>
                <p class="invoice-date">{{ formatDate(invoice.invoiceDate) }}</p>
              </div>
              <div class="invoice-actions">
                <span class="invoice-amount">{{ formatCurrency(invoice.amount) }}</span>
                <a v-if="invoice.pdfUrl" :href="api(invoice.pdfUrl)" target="_blank" class="download-btn">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuth } from '../../stores/auth.js'
import { api, resolveImage, API_BASE, useProxy } from '../../utils/api.js'

const { user } = useAuth()


const headers = () => ({ 
  'accept': '*/*', 
  'Authorization': user.value?.token ? `Bearer ${user.value.token}` : '' 
})

// State
const isLoading = ref(true)
const isRefreshing = ref(false)
const isCanOrderLoading = ref(false)

// Data
const canOrderData = ref(null)
const summary = ref({
  totalRevenue: 0,
  totalOrders: 0,
  totalCustomers: 0,
  totalProducts: 0,
  lowStockCount: 0,
  totalInvoices: 0,
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
const invoiceSummary = ref({
  count: 0,
  totalAmount: 0,
  recent: []
})
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
    minimumFractionDigits: 2 
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

// Load invoice summary
const loadInvoiceSummary = async () => {
  try {
    const res = await fetch(api('/api/Admin/invoices/summary'), { headers: headers() })
    if (!res.ok) throw new Error('fetch invoice summary failed')
    invoiceSummary.value = await res.json()
  } catch (e) {
    console.error('Error loading invoice summary:', e)
  }
}

// Load CanOrder status
const loadCanOrder = async () => {
  try {
    isCanOrderLoading.value = true
    const res = await fetch(api('/api/CanOrder'), { headers: headers() })
    if (!res.ok) throw new Error('fetch CanOrder failed')
    canOrderData.value = await res.json()
  } catch (e) {
    console.error('Error loading CanOrder status:', e)
  } finally {
    isCanOrderLoading.value = false
  }
}

// Toggle CanOrder status
const toggleCanOrderStatus = async () => {
  if (!canOrderData.value || isCanOrderLoading.value) return

  const newStatus = !canOrderData.value.isEnabled
  try {
    isCanOrderLoading.value = true
    const res = await fetch(api('/api/CanOrder'), {
      method: 'PUT',
      headers: {
        ...headers(),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        isEnabled: newStatus,
        onDate: new Date().toISOString(),
        offDate: new Date().toISOString()
      })
    })

    if (!res.ok) throw new Error('Update CanOrder failed')
    
    // Refresh data after update
    await loadCanOrder()
  } catch (e) {
    console.error('Error toggling CanOrder status:', e)
    // Revert UI on failure if we had optimistic UI (not used here for safety)
  } finally {
    isCanOrderLoading.value = false
  }
}

// Load all data
const loadAllData = async () => {
  isLoading.value = true
  try {
    await Promise.all([
      loadCanOrder(),
      loadSummary(),
      loadRevenue(),
      loadRecentOrders(),
      loadOrderStatusCounts(),
      loadTopProducts(),
      loadLowStock(),
      loadTopCustomers(),
      loadInvoiceSummary(),
      loadUserCounts()
    ])
  } catch (e) {
    console.error('Error loading dashboard data:', e)
  } finally {
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

/* CanOrder Toggle */
.header-actions {
  display: flex;
  align-items: center;
  gap: 2rem;
}

.can-order-toggle {
  display: flex;
  align-items: center;
  gap: 1rem;
  background: rgba(255, 255, 255, 0.1);
  padding: 0.5rem 1rem;
  border-radius: 1rem;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;
}

.can-order-toggle:hover {
  background: rgba(255, 255, 255, 0.15);
}

.toggle-label {
  color: white;
  font-weight: 600;
  font-size: 0.9rem;
}

.status-indicator {
  font-size: 0.75rem;
  font-weight: 700;
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  text-transform: uppercase;
  transition: all 0.3s ease;
}

.status-indicator.active {
  background: #10b981;
  color: white;
  box-shadow: 0 0 10px rgba(16, 185, 129, 0.4);
}

.status-indicator.inactive {
  background: #ef4444;
  color: white;
  box-shadow: 0 0 10px rgba(239, 68, 68, 0.4);
}

/* Switch Styles */
.switch {
  position: relative;
  display: inline-block;
  width: 50px;
  height: 28px;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #4b5563;
  transition: .4s;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 5px;
}

.slider:before {
  position: absolute;
  content: "";
  height: 20px;
  width: 20px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  transition: .4s;
  z-index: 2;
  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
}

input:checked + .slider {
  background-color: #10b981;
}

input:focus + .slider {
  box-shadow: 0 0 1px #10b981;
}

input:checked + .slider:before {
  transform: translateX(22px);
}

.slider.round {
  border-radius: 34px;
}

.slider.round:before {
  border-radius: 50%;
}

.slider-icon {
  width: 14px;
  height: 14px;
  color: white;
  z-index: 1;
}

.slider-icon.on {
  opacity: 0;
  transition: opacity 0.3s ease;
}

.slider-icon.off {
  opacity: 1;
  transition: opacity 0.3s ease;
}

input:checked + .slider .slider-icon.on {
  opacity: 1;
}

input:checked + .slider .slider-icon.off {
  opacity: 0;
}

.is-loading {
  opacity: 0.7;
  pointer-events: none;
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

.stat-card.invoices .stat-icon {
  background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
  color: white;
}

.stat-card.users .stat-icon {
  background: linear-gradient(135deg, #30cfd0 0%, #330867 100%);
  color: white;
}

.stat-content {
  flex: 1;
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
.customers-card,
.invoices-card {
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
.customers-list,
.invoices-list {
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
.customers-list::-webkit-scrollbar,
.invoices-list::-webkit-scrollbar {
  width: 6px;
}

.chart-content::-webkit-scrollbar-track,
.status-list::-webkit-scrollbar-track,
.orders-table::-webkit-scrollbar-track,
.products-list::-webkit-scrollbar-track,
.low-stock-list::-webkit-scrollbar-track,
.customers-list::-webkit-scrollbar-track,
.invoices-list::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

.chart-content::-webkit-scrollbar-thumb,
.status-list::-webkit-scrollbar-thumb,
.orders-table::-webkit-scrollbar-thumb,
.products-list::-webkit-scrollbar-thumb,
.low-stock-list::-webkit-scrollbar-thumb,
.customers-list::-webkit-scrollbar-thumb,
.invoices-list::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 10px;
}

.chart-content::-webkit-scrollbar-thumb:hover,
.status-list::-webkit-scrollbar-thumb:hover,
.orders-table::-webkit-scrollbar-thumb:hover,
.products-list::-webkit-scrollbar-thumb:hover,
.low-stock-list::-webkit-scrollbar-thumb:hover,
.customers-list::-webkit-scrollbar-thumb:hover,
.invoices-list::-webkit-scrollbar-thumb:hover {
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

/* Invoices List */
.invoices-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.invoice-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: #f9fafb;
  border-radius: 0.75rem;
  transition: background 0.3s;
}

.invoice-item:hover {
  background: #f3f4f6;
}

.invoice-info {
  flex: 1;
}

.invoice-number {
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 0.25rem 0;
}

.invoice-date {
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0;
}

.invoice-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.invoice-amount {
  font-weight: 700;
  color: #667eea;
}

.download-btn {
  color: #667eea;
  padding: 0.5rem;
  border-radius: 0.5rem;
  transition: all 0.3s;
}

.download-btn:hover {
  background: #e0e7ff;
  color: #4f46e5;
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
</style>
