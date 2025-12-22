<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <section class="bg-white border-b border-gray-200 shadow-sm">
      <div class="mx-auto max-w-7xl px-3 sm:px-4 md:px-6 lg:px-8 py-6 sm:py-8">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2">Gestion des commandes</h1>
            <p class="text-sm sm:text-base text-gray-600">Surveillez et gérez toutes les commandes de votre restaurant</p>
          </div>
          <div class="hidden sm:flex items-center space-x-4">
            <div class="text-right">
              <div class="text-2xl font-bold text-red-600">{{ orders.length }}</div>
              <div class="text-xs text-gray-500 uppercase tracking-wide">Commandes</div>
            </div>
            <div class="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Content -->
    <section class="py-4 sm:py-6 md:py-8">
      <div class="mx-auto max-w-7xl px-3 sm:px-4 md:px-6 lg:px-8 space-y-4 sm:space-y-6">
        
        <!-- Filter Section -->
        <div class="bg-white rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl border border-gray-100 overflow-hidden">
          <div class="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-100">
            <h2 class="text-base sm:text-lg font-semibold text-gray-900">Filtres et tri</h2>
          </div>
          <div class="px-4 sm:px-6 py-4 space-y-6">
            <!-- Status Filter -->
            <div>
              <h3 class="text-sm font-medium text-gray-700 mb-3">Filtrer par statut</h3>
              <div class="flex flex-wrap gap-2 sm:gap-3">
                <button 
                  v-for="status in orderStatuses" 
                  :key="status.value"
                  @click="selectedStatus = status.value"
                  :class="[
                    'px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors',
                    selectedStatus === status.value 
                      ? 'bg-red-600 text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  ]"
                >
                  {{ status.label }}
                </button>
              </div>
            </div>
            
            <!-- Date Sort Filter -->
            <div>
              <h3 class="text-sm font-medium text-gray-700 mb-3">Trier par date</h3>
              <div class="flex flex-wrap gap-2 sm:gap-3">
                <button 
                  v-for="dateFilter in dateFilters" 
                  :key="dateFilter.value"
                  @click="selectedDateFilter = dateFilter.value"
                  :class="[
                    'px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors',
                    selectedDateFilter === dateFilter.value 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  ]"
                >
                  {{ dateFilter.label }}
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Orders List -->
        <div class="bg-white rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl border border-gray-100 overflow-hidden">
          <div class="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0">
            <h2 class="text-base sm:text-lg font-semibold text-gray-900">Toutes les commandes</h2>
            <button @click="loadOrders" class="text-xs sm:text-sm text-gray-500 hover:text-gray-800 self-start sm:self-auto">Rafraîchir</button>
          </div>
          
          <div v-if="isLoading" class="px-4 sm:px-6 py-8 sm:py-12 text-center text-gray-500 text-sm sm:text-base">
            <svg class="animate-spin h-8 w-8 mx-auto mb-4 text-gray-400" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
            </svg>
            Chargement des commandes...
          </div>
          
          <div v-else-if="filteredOrders.length === 0" class="px-4 sm:px-6 py-8 sm:py-12 text-center text-gray-500">
            <svg class="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p class="text-base sm:text-lg font-medium">Aucune commande trouvée</p>
            <p class="text-xs sm:text-sm text-gray-500 mt-1">
              {{ selectedStatus === 'all' ? 'Aucune commande dans le système' : `Aucune commande avec le statut "${getStatusLabel(selectedStatus)}"` }}
            </p>
          </div>
          
          <div v-else class="p-6">
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div v-for="order in paginatedOrders" :key="order.orderId" class="bg-white rounded-xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-all duration-300">
              <!-- Order Header -->
              <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 mb-4">
                <div>
                  <h3 class="text-sm sm:text-base font-semibold text-gray-900">Commande #{{ order.orderId.slice(-8) }}</h3>
                  <p class="text-xs sm:text-sm text-gray-500">{{ formatDate(order.orderDate) }}</p>
                  <div class="text-xs sm:text-sm text-gray-600 mt-1">
                    <span class="text-gray-500">Client:</span>
                    <span class="client-name-animation ml-1 font-medium text-blue-600">{{ order.customerName }}</span>
                  </div>
                </div>
                <div class="flex flex-col sm:items-end gap-2">
                  <span :class="getStatusBadgeClass(order.status)" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium">
                    {{ getStatusLabel(order.status) }}
                  </span>
                  <span class="text-sm sm:text-base font-bold text-gray-900">{{ order.totalAmount }} DT</span>
                </div>
              </div>

              <!-- Order Items -->
              <div class="mb-4">
                <h4 class="text-xs sm:text-sm font-medium text-gray-700 mb-3">Articles commandés:</h4>
                <div class="order-items-container">
                  <div class="space-y-3">
                    <div v-for="item in order.items" :key="item.orderItemId" class="flex items-center gap-3 py-3 px-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <!-- Product Image -->
                      <div class="flex-shrink-0">
                        <div class="w-12 h-12 rounded-lg overflow-hidden bg-gray-200">
                          <img 
                            :src="getProductImageUrl(item.productImage)" 
                            :alt="item.productName"
                            class="w-full h-full object-cover"
                            @error="handleImageError"
                            loading="lazy"
                          />
                        </div>
                      </div>
                      
                      <!-- Product Info -->
                      <div class="flex-1 min-w-0">
                        <p class="text-sm font-medium text-gray-900 truncate">{{ item.productName }}</p>
                        <p class="text-xs text-gray-500">Quantité: {{ item.quantity }} × {{ item.price }} DT</p>
                      </div>
                      
                      <!-- Price -->
                      <div class="flex-shrink-0 text-right">
                        <span class="text-sm font-semibold text-gray-900">{{ (item.quantity * item.price).toFixed(2) }} DT</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Comments -->
              <div v-if="order.comments" class="mb-4 p-3 bg-blue-50 rounded-lg">
                <h4 class="text-xs sm:text-sm font-medium text-blue-800 mb-1">Commentaires:</h4>
                <p class="text-xs sm:text-sm text-blue-700">{{ order.comments }}</p>
              </div>

              <!-- Status Management -->
              <div class="flex flex-col sm:flex-row gap-3 pt-3 border-t border-gray-100">
                <div class="flex-1">
                  <label class="block text-xs sm:text-sm font-medium text-gray-700 mb-2">Modifier le statut:</label>
                  <select 
                    :value="order.status" 
                    @change="updateOrderStatus(order.orderId, $event.target.value)"
                    :disabled="isUpdatingStatus[order.orderId]"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm"
                  >
                    <option value="Pending">En attente</option>
                    <option value="Confirmed">Confirmée</option>
                    <option value="Preparing">En préparation</option>
                    <option value="Ready">Prête</option>
                    <option value="Delivering">En livraison</option>
                    <option value="Delivered">Livrée</option>
                    <option value="Cancelled">Annulée</option>
                  </select>
                </div>
                <div class="flex items-end gap-2">
                  <button 
                    @click="deleteOrder(order.orderId)"
                    :disabled="isDeletingOrder[order.orderId]"
                    class="inline-flex items-center justify-center gap-2 px-3 py-2 text-xs sm:text-sm font-medium text-red-700 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    {{ isDeletingOrder[order.orderId] ? 'Suppression...' : 'Supprimer' }}
                  </button>
                </div>
              </div>
            </div>
            </div>
            
            <!-- Pagination Controls -->
            <div v-if="totalPages > 1" class="mt-8 flex items-center justify-between">
              <div class="flex items-center space-x-2">
                <span class="text-sm text-gray-700">
                  Page {{ currentPage }} sur {{ totalPages }}
                </span>
                <span class="text-sm text-gray-500">
                  ({{ filteredOrders.length }} commande{{ filteredOrders.length > 1 ? 's' : '' }})
                </span>
              </div>
              
              <div class="flex items-center space-x-2">
                <!-- Previous Button -->
                <button 
                  @click="goToPreviousPage"
                  :disabled="!hasPrevPage"
                  :class="[
                    'flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors',
                    hasPrevPage 
                      ? 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400' 
                      : 'bg-gray-100 border border-gray-200 text-gray-400 cursor-not-allowed'
                  ]"
                >
                  <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
                  </svg>
                  Précédent
                </button>
                
                <!-- Page Numbers -->
                <div class="flex items-center space-x-1">
                  <button 
                    v-for="page in getVisiblePages()" 
                    :key="page"
                    @click="goToPage(page)"
                    :class="[
                      'px-3 py-2 text-sm font-medium rounded-lg transition-colors',
                      page === currentPage 
                        ? 'bg-red-600 text-white' 
                        : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                    ]"
                  >
                    {{ page }}
                  </button>
                </div>
                
                <!-- Next Button -->
                <button 
                  @click="goToNextPage"
                  :disabled="!hasNextPage"
                  :class="[
                    'flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors',
                    hasNextPage 
                      ? 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400' 
                      : 'bg-gray-100 border border-gray-200 text-gray-400 cursor-not-allowed'
                  ]"
                >
                  Suivant
                  <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Status Change Confirmation Modal -->
    <div v-if="showStatusModal" class="fixed inset-0 z-50 overflow-y-auto modal-overlay">
      <div class="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <!-- Background overlay -->
        <div class="fixed inset-0 transition-all duration-300 bg-gray-500 bg-opacity-75 modal-backdrop" @click="closeStatusModal"></div>
        
        <!-- Modal panel -->
        <div class="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all duration-300 transform bg-white shadow-2xl rounded-2xl modal-panel">
          <!-- Modal header -->
          <div class="flex items-center justify-center w-12 h-12 mx-auto bg-blue-100 rounded-full">
            <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 0V6a2 2 0 012-2h4a2 2 0 012 2v1m-6 0h6m-6 0l-1 1a2 2 0 01-2 2H6a2 2 0 01-2-2l-1-1m8 0l1 1a2 2 0 002 2h2a2 2 0 002-2l1-1m-8 0V9a2 2 0 012-2h4a2 2 0 012 2v1" />
            </svg>
          </div>
          
          <!-- Modal content -->
          <div class="mt-4 text-center">
            <h3 class="text-lg font-medium text-gray-900">
              Modifier le statut de la commande
            </h3>
            <div class="mt-2">
              <p class="text-sm text-gray-500">
                Voulez-vous vraiment changer le statut de cette commande ?
              </p>
              <div class="mt-4 p-4 bg-gray-50 rounded-lg">
                <div class="flex items-center justify-between">
                  <span class="text-sm text-gray-600">De:</span>
                  <span :class="getStatusBadgeClass(statusChangeData.oldStatus)" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium">
                    {{ getStatusLabel(statusChangeData.oldStatus) }}
                  </span>
                </div>
                <div class="flex items-center justify-center my-2">
                  <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-sm text-gray-600">Vers:</span>
                  <span :class="getStatusBadgeClass(statusChangeData.newStatus)" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium">
                    {{ getStatusLabel(statusChangeData.newStatus) }}
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Modal actions -->
          <div class="flex flex-col sm:flex-row gap-3 mt-6">
            <button
              @click="closeStatusModal"
              class="flex-1 inline-flex justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
            >
              Annuler
            </button>
            <button
              @click="confirmStatusChange"
              :disabled="isUpdatingStatus[statusChangeData.orderId]"
              class="flex-1 inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <svg v-if="isUpdatingStatus[statusChangeData.orderId]" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
              </svg>
              {{ isUpdatingStatus[statusChangeData.orderId] ? 'Mise à jour...' : 'Confirmer le changement' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteModal" class="fixed inset-0 z-50 overflow-y-auto modal-overlay">
      <div class="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <!-- Background overlay -->
        <div class="fixed inset-0 transition-all duration-300 bg-gray-500 bg-opacity-75 modal-backdrop" @click="closeDeleteModal"></div>
        
        <!-- Modal panel -->
        <div class="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all duration-300 transform bg-white shadow-2xl rounded-2xl modal-panel">
          <!-- Modal header -->
          <div class="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full">
            <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          
          <!-- Modal content -->
          <div class="mt-4 text-center">
            <h3 class="text-lg font-medium text-gray-900">
              Supprimer la commande
            </h3>
            <div class="mt-2">
              <p class="text-sm text-gray-500">
                Êtes-vous sûr de vouloir supprimer définitivement cette commande ?
              </p>
              <p class="text-sm text-red-600 font-medium mt-2">
                Cette action est irréversible et supprimera tous les éléments de la commande.
              </p>
            </div>
          </div>
          
          <!-- Modal actions -->
          <div class="flex flex-col sm:flex-row gap-3 mt-6">
            <button
              @click="closeDeleteModal"
              class="flex-1 inline-flex justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
            >
              Annuler
            </button>
            <button
              @click="confirmDelete"
              :disabled="isDeletingOrder[orderToDelete]"
              class="flex-1 inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <svg v-if="isDeletingOrder[orderToDelete]" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
              </svg>
              {{ isDeletingOrder[orderToDelete] ? 'Suppression...' : 'Supprimer définitivement' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Notification -->
    <div v-if="showNotification" class="fixed top-4 left-4 right-4 sm:top-4 sm:right-4 sm:left-auto z-50 max-w-sm sm:w-full notification-container">
      <div class="bg-green-500 text-white px-4 sm:px-6 py-3 sm:py-4 rounded-lg shadow-lg success-notification">
        <div class="flex items-center">
          <div class="notification-icon">
            <svg class="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          <div class="notification-content">
            <p class="text-sm sm:text-base font-medium notification-text">{{ notificationMessage }}</p>
          </div>
          <button 
            @click="showNotification = false"
            class="ml-2 sm:ml-3 flex-shrink-0 p-1 rounded-full hover:bg-green-600 transition-colors duration-200"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
    </div>
  </template>
  
  <script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { useAuth } from '../../stores/auth.js'
import { api, resolveImage } from '../../utils/api.js'

const { user } = useAuth()

// Orders data
const orders = ref([])
const isLoading = ref(false)
const selectedStatus = ref('all')
const selectedDateFilter = ref('recent')
const showNotification = ref(false)
const notificationMessage = ref('')
const isUpdatingStatus = ref({})
const isDeletingOrder = ref({})

// Delete modal state
const showDeleteModal = ref(false)
const orderToDelete = ref(null)

// Status change confirmation state
const showStatusModal = ref(false)
const statusChangeData = ref({ orderId: null, oldStatus: '', newStatus: '' })

// Pagination
const currentPage = ref(1)
const ordersPerPage = 4

// Order statuses for filtering
const orderStatuses = [
  { value: 'all', label: 'Toutes' },
  { value: 'Pending', label: 'En attente' },
  { value: 'Confirmed', label: 'Confirmée' },
  { value: 'Preparing', label: 'En préparation' },
  { value: 'Ready', label: 'Prête' },
  { value: 'Delivering', label: 'En livraison' },
  { value: 'Delivered', label: 'Livrée' },
  { value: 'Cancelled', label: 'Annulée' }
]

// Date filters for sorting
const dateFilters = [
  { value: 'recent', label: 'Plus récentes' },
  { value: 'oldest', label: 'Plus anciennes' }
]


// Filtered and sorted orders
const filteredOrders = computed(() => {
  let filtered = orders.value
  
  // Filter by status
  if (selectedStatus.value !== 'all') {
    filtered = filtered.filter(order => order.status === selectedStatus.value)
  }
  
  // Sort by date
  filtered = [...filtered].sort((a, b) => {
    const dateA = new Date(a.orderDate)
    const dateB = new Date(b.orderDate)
    
    if (selectedDateFilter.value === 'recent') {
      return dateB - dateA // Most recent first
    } else {
      return dateA - dateB // Oldest first
    }
  })
  
  return filtered
})

// Paginated orders
const paginatedOrders = computed(() => {
  const start = (currentPage.value - 1) * ordersPerPage
  const end = start + ordersPerPage
  return filteredOrders.value.slice(start, end)
})

// Pagination info
const totalPages = computed(() => {
  return Math.ceil(filteredOrders.value.length / ordersPerPage)
})

const hasNextPage = computed(() => {
  return currentPage.value < totalPages.value
})

const hasPrevPage = computed(() => {
  return currentPage.value > 1
})

// Load orders from API
async function loadOrders() {
  const token = user.value?.token
  
  if (!token) {
    console.error('No token available')
    showNotificationMessage('Vous devez être connecté pour voir les commandes')
    return
  }
  
  isLoading.value = true
  try {
    const response = await fetch(api('/api/order'), {
      method: 'GET',
      headers: {
        'accept': '*/*',
        'Authorization': `Bearer ${token}`
      }
    })
    
    if (!response.ok) {
      throw new Error('Failed to fetch orders')
    }
    
    const data = await response.json()
    orders.value = Array.isArray(data) ? data : []
    
    // Load product images for each order item
    await loadProductImages()
  } catch (error) {
    console.error('Error loading orders:', error)
    orders.value = []
    showNotificationMessage('Erreur lors du chargement des commandes')
  } finally {
    isLoading.value = false
  }
}

// Load product images for all order items
async function loadProductImages() {
  const token = user.value?.token
  if (!token) return
  
  for (const order of orders.value) {
    for (const item of order.items) {
      try {
        const response = await fetch(api(`/api/Product/${item.productId}/images`), {
          method: 'GET',
          headers: {
            'accept': '*/*'
          }
        })
        
        if (response.ok) {
          const images = await response.json()
          if (images && images.length > 0) {
            item.productImage = images[0] // Use the first image
            console.log(`Loaded image for product ${item.productId}:`, images[0])
          } else {
            console.log(`No images found for product ${item.productId}`)
          }
        } else {
          console.log(`Failed to load images for product ${item.productId}:`, response.status)
        }
      } catch (error) {
        console.error(`Error loading image for product ${item.productId}:`, error)
      }
    }
  }
}

function getProductImageUrl(imagePath) {
  return resolveImage(imagePath)
}

// Handle image loading errors
function handleImageError(event) {
  console.log('Image failed to load:', event.target.src)
  // The getProductImageUrl function already provides a fallback SVG
  // so we don't need to do anything special here
}

// Show status change confirmation modal
function updateOrderStatus(orderId, newStatus) {
  const order = orders.value.find(o => o.orderId === orderId)
  if (!order) return
  
  statusChangeData.value = {
    orderId: orderId,
    oldStatus: order.status,
    newStatus: newStatus
  }
  showStatusModal.value = true
}

// Close status change modal
function closeStatusModal() {
  showStatusModal.value = false
  statusChangeData.value = { orderId: null, oldStatus: '', newStatus: '' }
}

// Confirm status change
async function confirmStatusChange() {
  const { orderId, newStatus } = statusChangeData.value
  const token = user.value?.token
  
  if (!token) {
    showNotificationMessage('Vous devez être connecté pour modifier le statut')
    closeStatusModal()
    return
  }
  
  isUpdatingStatus.value[orderId] = true
  
  try {
    const response = await fetch(api(`/api/order/${orderId}/status`), {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'accept': '*/*',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(newStatus)
    })
    
    if (!response.ok) {
      throw new Error('Failed to update order status')
    }
    
    // Update the order status in the local array
    const orderIndex = orders.value.findIndex(order => order.orderId === orderId)
    if (orderIndex !== -1) {
      orders.value[orderIndex].status = newStatus
    }
    
    showNotificationMessage(`Statut de la commande mis à jour vers "${getStatusLabel(newStatus)}"`)
    closeStatusModal()
  } catch (error) {
    console.error('Error updating order status:', error)
    showNotificationMessage('Erreur lors de la mise à jour du statut')
  } finally {
    isUpdatingStatus.value[orderId] = false
  }
}

// Show delete confirmation modal
function deleteOrder(orderId) {
  orderToDelete.value = orderId
  showDeleteModal.value = true
}

// Close delete modal
function closeDeleteModal() {
  showDeleteModal.value = false
  orderToDelete.value = null
}

// Confirm delete order
async function confirmDelete() {
  const orderId = orderToDelete.value
  
  if (!orderId) return
  
  const token = user.value?.token
  
  if (!token) {
    showNotificationMessage('Vous devez être connecté pour supprimer une commande')
    closeDeleteModal()
    return
  }
  
  isDeletingOrder.value[orderId] = true
  
  try {
    const response = await fetch(api(`/api/order/${orderId}`), {
      method: 'DELETE',
      headers: {
        'accept': '*/*',
        'Authorization': `Bearer ${token}`
      }
    })
    
    if (!response.ok) {
      throw new Error('Failed to delete order')
    }
    
    const result = await response.json()
    console.log('Order deleted:', result)
    
    // Remove the order from the local array
    const orderIndex = orders.value.findIndex(order => order.orderId === orderId)
    if (orderIndex !== -1) {
      orders.value.splice(orderIndex, 1)
    }
    
    showNotificationMessage('Commande supprimée avec succès')
    closeDeleteModal()
  } catch (error) {
    console.error('Error deleting order:', error)
    showNotificationMessage('Erreur lors de la suppression de la commande')
  } finally {
    isDeletingOrder.value[orderId] = false
  }
}

// Format date for display
function formatDate(dateString) {
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  } catch {
    return dateString
  }
}

// Get status label in French
function getStatusLabel(status) {
  const statusMap = {
    'Pending': 'En attente',
    'Confirmed': 'Confirmée',
    'Preparing': 'En préparation',
    'Ready': 'Prête',
    'Delivering': 'En livraison',
    'Delivered': 'Livrée',
    'Cancelled': 'Annulée'
  }
  return statusMap[status] || status
}

// Get status badge class
function getStatusBadgeClass(status) {
  const statusClasses = {
    'Pending': 'bg-yellow-100 text-yellow-800',
    'Confirmed': 'bg-blue-100 text-blue-800',
    'Preparing': 'bg-orange-100 text-orange-800',
    'Ready': 'bg-green-100 text-green-800',
    'Delivering': 'bg-purple-100 text-purple-800',
    'Delivered': 'bg-green-100 text-green-800',
    'Cancelled': 'bg-red-100 text-red-800'
  }
  return statusClasses[status] || 'bg-gray-100 text-gray-800'
}


// Show notification message
function showNotificationMessage(message) {
  notificationMessage.value = message
  showNotification.value = true
  setTimeout(() => {
    showNotification.value = false
  }, 4000)
}

// Pagination functions
function goToPage(page) {
  currentPage.value = page
}

function goToNextPage() {
  if (hasNextPage.value) {
    currentPage.value++
  }
}

function goToPreviousPage() {
  if (hasPrevPage.value) {
    currentPage.value--
  }
}

function getVisiblePages() {
  const total = totalPages.value
  const current = currentPage.value
  const pages = []
  
  if (total <= 7) {
    // Show all pages if 7 or fewer
    for (let i = 1; i <= total; i++) {
      pages.push(i)
    }
  } else {
    // Show smart pagination
    if (current <= 4) {
      // Show first 5 pages + ... + last page
      for (let i = 1; i <= 5; i++) {
        pages.push(i)
      }
      pages.push('...')
      pages.push(total)
    } else if (current >= total - 3) {
      // Show first page + ... + last 5 pages
      pages.push(1)
      pages.push('...')
      for (let i = total - 4; i <= total; i++) {
        pages.push(i)
      }
    } else {
      // Show first + ... + current-1, current, current+1 + ... + last
      pages.push(1)
      pages.push('...')
      for (let i = current - 1; i <= current + 1; i++) {
        pages.push(i)
      }
      pages.push('...')
      pages.push(total)
    }
  }
  
  return pages
}

// Reset pagination when filters change
watch([selectedStatus, selectedDateFilter], () => {
  currentPage.value = 1
})

onMounted(() => {
  loadOrders()
})
  </script>
  
  <style scoped>
/* Enhanced notification animations and styling */
.notification-container {
  animation: notificationSlideIn 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

.success-notification {
  position: relative;
  overflow: hidden;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  box-shadow: 0 10px 25px rgba(16, 185, 129, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
}

/* Notification entrance animation */
@keyframes notificationSlideIn {
  0% {
    transform: translateX(100%) scale(0.8);
    opacity: 0;
  }
  50% {
    transform: translateX(-10%) scale(1.05);
    opacity: 0.8;
  }
  100% {
    transform: translateX(0) scale(1);
    opacity: 1;
  }
}

/* Icon animation */
.notification-icon {
  animation: iconBounce 0.6s ease-out 0.2s both;
}

@keyframes iconBounce {
  0% {
    transform: scale(0);
    opacity: 0;
  }
  50% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

/* Text animation */
.notification-text {
  animation: textSlideUp 0.5s ease-out 0.3s both;
}

@keyframes textSlideUp {
  0% {
    transform: translateY(10px);
    opacity: 0;
  }
  100% {
    transform: translateY(0);
    opacity: 1;
  }
}

/* Content animation */
.notification-content {
  animation: contentFadeIn 0.4s ease-out 0.4s both;
}

@keyframes contentFadeIn {
  0% {
    opacity: 0;
    transform: translateX(-10px);
  }
  100% {
    opacity: 1;
    transform: translateX(0);
  }
}

/* Hover effects */
.success-notification:hover {
  transform: translateY(-2px) scale(1.02);
  box-shadow: 0 15px 35px rgba(16, 185, 129, 0.4);
  background: linear-gradient(135deg, #059669 0%, #047857 100%);
}

/* Close button animation */
.success-notification button {
  transition: all 0.2s ease-in-out;
  opacity: 0.7;
}

.success-notification button:hover {
  opacity: 1;
  transform: scale(1.1);
  background-color: rgba(255, 255, 255, 0.2);
}

.success-notification button:active {
  transform: scale(0.95);
}

/* Pulsing effect for attention */
.success-notification::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(45deg, transparent 30%, rgba(255, 255, 255, 0.1) 50%, transparent 70%);
  animation: shimmer 2s infinite;
  pointer-events: none;
}

@keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

/* Progress bar animation */
.success-notification::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  height: 3px;
  background: linear-gradient(90deg, #ffffff 0%, rgba(255, 255, 255, 0.5) 100%);
  animation: progressBar 4s linear forwards;
}

@keyframes progressBar {
  0% {
    width: 100%;
  }
  100% {
    width: 0%;
  }
}

/* Mobile responsiveness */
@media (max-width: 640px) {
  .notification-container {
    left: 1rem;
    right: 1rem;
    max-width: none;
  }
  
  .success-notification {
    padding: 0.75rem 1rem;
  }
  
  .notification-icon svg {
    width: 1.25rem;
    height: 1.25rem;
  }
  
  .notification-text {
    font-size: 0.875rem;
  }
}

/* Auto-dismiss animation */
.notification-container.leaving {
  animation: notificationSlideOut 0.3s ease-in forwards;
}

@keyframes notificationSlideOut {
  0% {
    transform: translateX(0) scale(1);
    opacity: 1;
  }
  100% {
    transform: translateX(100%) scale(0.8);
    opacity: 0;
  }
}

/* Success state variations */
.success-notification.success {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
}

.success-notification.error {
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  box-shadow: 0 10px 25px rgba(239, 68, 68, 0.3);
}

.success-notification.warning {
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  box-shadow: 0 10px 25px rgba(245, 158, 11, 0.3);
}

/* Modal animations and styling */
.modal-overlay {
  animation: modalFadeIn 0.3s ease-out;
}

.modal-backdrop {
  backdrop-filter: blur(8px);
  animation: backdropFadeIn 0.3s ease-out;
}

.modal-panel {
  animation: modalSlideIn 0.3s ease-out;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
}

/* Keyframe animations */
@keyframes modalFadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes backdropFadeIn {
  from {
    opacity: 0;
    backdrop-filter: blur(0px);
  }
  to {
    opacity: 1;
    backdrop-filter: blur(8px);
  }
}

@keyframes modalSlideIn {
  from {
    opacity: 0;
    transform: scale(0.9) translateY(-20px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

/* Modal header icon animation */
.modal-panel .w-12 {
  animation: iconPulse 0.6s ease-out 0.2s both;
}

@keyframes iconPulse {
  from {
    transform: scale(0);
    opacity: 0;
  }
  50% {
    transform: scale(1.1);
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

/* Button hover effects */
.modal-panel button {
  transition: all 0.2s ease-in-out;
  position: relative;
  overflow: hidden;
}

.modal-panel button:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.modal-panel button:active {
  transform: translateY(0);
}

/* Delete button special effects */
.modal-panel button[class*="bg-red-600"]:hover {
  background-color: #dc2626;
  box-shadow: 0 4px 12px rgba(220, 38, 38, 0.3);
}

.modal-panel button[class*="bg-red-600"]:disabled {
  background-color: #ef4444;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

/* Loading spinner animation */
.modal-panel .animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* Modal content animations */
.modal-panel h3 {
  animation: textSlideUp 0.4s ease-out 0.1s both;
}

.modal-panel p {
  animation: textSlideUp 0.4s ease-out 0.2s both;
}

.modal-panel .flex.flex-col {
  animation: textSlideUp 0.4s ease-out 0.3s both;
}

@keyframes textSlideUp {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Responsive modal adjustments */
@media (max-width: 640px) {
  .modal-panel {
    margin: 1rem;
    max-width: calc(100% - 2rem);
  }
  
  .modal-panel .flex.flex-col {
    flex-direction: column;
    gap: 0.75rem;
  }
  
  .modal-panel button {
    width: 100%;
  }
}

/* Mobile image fixes */
@media (max-width: 640px) {
  .w-12.h-12 {
    min-width: 3rem;
    min-height: 3rem;
    width: 3rem;
    height: 3rem;
  }
  
  .w-12.h-12 img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }
  
  .w-12.h-12 svg {
    width: 1.5rem;
    height: 1.5rem;
  }
}

/* Image loading states */
.w-12.h-12 img {
  transition: opacity 0.3s ease-in-out;
}

.w-12.h-12 img[src=""] {
  opacity: 0;
}

.w-12.h-12 img:not([src=""]) {
  opacity: 1;
}

/* Client name animation */
.client-name-animation {
  position: relative;
  display: inline-block;
  animation: clientNameSlideIn 0.6s ease-out 0.2s both;
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-size: 200% 200%;
  animation: clientNameSlideIn 0.6s ease-out 0.2s both, clientNameShimmer 3s ease-in-out infinite 1s;
}

@keyframes clientNameSlideIn {
  0% {
    opacity: 0;
    transform: translateX(-20px) scale(0.8);
  }
  50% {
    opacity: 0.7;
    transform: translateX(5px) scale(1.05);
  }
  100% {
    opacity: 1;
    transform: translateX(0) scale(1);
  }
}

@keyframes clientNameShimmer {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

/* Hover effect for client name */
.client-name-animation:hover {
  transform: scale(1.05);
  filter: drop-shadow(0 2px 4px rgba(59, 130, 246, 0.3));
  transition: all 0.3s ease-in-out;
}

/* Pulse effect for attention */
.client-name-animation::before {
  content: '';
  position: absolute;
  top: -2px;
  left: -2px;
  right: -2px;
  bottom: -2px;
  background: linear-gradient(45deg, transparent, rgba(59, 130, 246, 0.2), transparent);
  border-radius: 4px;
  opacity: 0;
  animation: clientNamePulse 2s ease-in-out infinite;
  z-index: -1;
}

@keyframes clientNamePulse {
  0%, 100% {
    opacity: 0;
    transform: scale(1);
  }
  50% {
    opacity: 1;
    transform: scale(1.1);
  }
}

/* Mobile adjustments */
@media (max-width: 640px) {
  .client-name-animation {
    font-size: 0.75rem;
  }
}

/* Order items scrollable container */
.order-items-container {
  max-height: 200px;
  overflow-y: auto;
  overflow-x: hidden;
  padding-right: 8px;
  margin-right: -8px;
}

.order-items-container::-webkit-scrollbar {
  width: 6px;
}

.order-items-container::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 3px;
}

.order-items-container::-webkit-scrollbar-thumb {
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  border-radius: 3px;
  transition: background 0.3s ease;
}

.order-items-container::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(135deg, #1d4ed8 0%, #1e40af 100%);
}

/* Firefox scrollbar styling */
.order-items-container {
  scrollbar-width: thin;
  scrollbar-color: #3b82f6 #f1f5f9;
}

/* Smooth scrolling */
.order-items-container {
  scroll-behavior: smooth;
}

/* Mobile scrollbar adjustments */
@media (max-width: 640px) {
  .order-items-container {
    max-height: 180px;
  }
  
  .order-items-container::-webkit-scrollbar {
    width: 4px;
  }
  }
  </style>
  