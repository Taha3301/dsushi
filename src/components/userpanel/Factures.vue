<template>
    <div class="min-h-screen bg-white">
      <!-- Header -->
    <section class="bg-white border-b border-gray-200 shadow-sm">
      <div class="mx-auto max-w-7xl px-3 sm:px-4 md:px-6 lg:px-8 py-6 sm:py-8">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2">Mes factures</h1>
            <p class="text-sm sm:text-base text-gray-600">Téléchargez vos factures de commande</p>
          </div>
          <div class="hidden sm:flex items-center space-x-4" v-if="invoices.length">
            <div class="text-right">
              <div class="text-2xl font-bold text-red-600">{{ invoices.length }}</div>
              <div class="text-xs text-gray-500 uppercase tracking-wide">Factures</div>
            </div>
            <div class="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17h6l3 3v-3h2V9h-2M4 4h11v8H9l-3 3v-3H4V4z"/>
              </svg>
            </div>
          </div>
        </div>
        </div>
      </section>
  
      <!-- Content -->
      <section class="py-4 sm:py-6 md:py-8">
      <div class="mx-auto max-w-6xl px-3 sm:px-4 md:px-6 lg:px-8">
          <div class="bg-white rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl border border-gray-100 overflow-hidden">
          <div class="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 class="text-base sm:text-lg font-semibold text-gray-900">Historique des factures</h2>
            <button @click="loadInvoices" class="text-xs sm:text-sm text-gray-500 hover:text-gray-800">Rafraîchir</button>
                </div>
                
          <div v-if="isLoading" class="px-4 sm:px-6 py-8 sm:py-12 text-center text-gray-500 text-sm sm:text-base">
            <svg class="animate-spin h-8 w-8 mx-auto mb-4 text-gray-400" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                      </svg>
            Chargement des factures...
                  </div>
                  
          <div v-else-if="invoices.length === 0" class="px-4 sm:px-6 py-12 text-center text-gray-500">
            <svg class="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17h6l3 3v-3h2V9h-2M4 4h11v8H9l-3 3v-3H4V4z" />
                      </svg>
            <p class="text-base sm:text-lg font-medium">Aucune facture trouvée</p>
            <p class="text-xs sm:text-sm text-gray-500 mt-1">Vous n'avez pas encore de factures disponibles</p>
          </div>
  
          <div v-else class="p-6">
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div 
                v-for="invoice in invoices" 
                :key="invoice.invoiceId" 
                class="bg-white rounded-xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-all duration-300"
              >
                <!-- Invoice Header -->
                <div class="flex items-start justify-between gap-4">
                  <div>
                    <h3 class="text-sm sm:text-base font-semibold text-gray-900">Facture {{ invoice.invoiceNumber }}</h3>
                    <p class="text-xs sm:text-sm text-gray-500">{{ formatDate(invoice.invoiceDate) }}</p>
                  </div>
                    <div class="text-right">
                    <div class="text-sm sm:text-base font-bold text-gray-900">{{ Number(invoice.amount).toFixed(2) }} DT</div>
            </div>
          </div>
  
                <!-- Linked Order -->
                <div class="mt-4 p-3 bg-gray-50 rounded-lg">
                  <div class="flex items-center justify-between text-xs sm:text-sm">
                    <div class="text-gray-600">Commande</div>
                    <div class="font-medium text-gray-900">#{{ (invoice.order?.orderId || '').slice(-8) }}</div>
            </div>
                  <div class="text-xs text-gray-500 mt-1">Statut: <span class="font-medium text-gray-700">{{ getStatusLabel(invoice.order?.status) }}</span></div>
          </div>
  
                <!-- Actions -->
                <div class="flex flex-col sm:flex-row gap-2 sm:gap-3 mt-5">
                  <a 
                    v-if="getPdfUrl(invoice)"
                    :href="getPdfUrl(invoice)"
                    target="_blank"
                    rel="noopener"
                    class="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-3 py-2 text-xs sm:text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v8m0 0l-3-3m3 3l3-3M4 12a8 8 0 1116 0 8 8 0 01-16 0z" />
                    </svg>
                    Télécharger PDF
                  </a>
            <button 
                    v-else
                    disabled
                    class="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-3 py-2 text-xs sm:text-sm font-medium text-gray-500 bg-gray-100 rounded-lg cursor-not-allowed"
                  >
                    PDF indisponible
            </button>
          </div>
            </div>
          </div>
        </div>
      </div>
      </div>
    </section>
      </div>
    </template>
    
    <script setup>
  import { ref, onMounted } from 'vue'
  import { useAuth } from '../../stores/auth.js'
import { api, resolveImage } from '../../utils/api.js'
  
  const { user } = useAuth()
  
  const invoices = ref([])
  const isLoading = ref(false)
  
  // Extract customerId from JWT (nameidentifier claim)
  function getCustomerIdFromToken(token) {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]))
      return payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'] || payload.sub || payload.userId || null
    } catch {
      return null
    }
  }
  
  async function loadInvoices() {
    const token = user.value?.token
    const customerId = getCustomerIdFromToken(token)
    if (!token || !customerId) {
      invoices.value = []
      return
    }
  
    isLoading.value = true
    try {
      const res = await fetch(api(`/api/order/invoices/customer/${customerId}`), {
        method: 'GET',
        headers: {
          'accept': '*/*',
          'Authorization': `Bearer ${token}`
        }
      })
      if (!res.ok) throw new Error('Failed to fetch invoices')
      const data = await res.json()
      invoices.value = Array.isArray(data) ? data : []
    } catch (e) {
      console.error('Error loading invoices:', e)
      invoices.value = []
    } finally {
      isLoading.value = false
    }
  }

  function getPdfUrl(invoice) {
    if (invoice?.pdfUrlAbsolute) return invoice.pdfUrlAbsolute
    if (invoice?.pdfUrl) {
      return resolveImage(invoice.pdfUrl)
    }
    return ''
  }

  function formatDate(dateString) {
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString('fr-FR', {
        year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
      })
    } catch {
      return dateString
    }
  }

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
    return statusMap[status] || status || '—'
  }
  
  onMounted(() => {
    loadInvoices()
  })
    </script>
    
    <style scoped>
    </style>
    