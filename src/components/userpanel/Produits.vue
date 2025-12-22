<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
    <!-- Top header with title -->
    <section class="sticky top-[64px] md:top-[64px] z-30 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
        <transition name="fade-title">
          <h1 v-show="showHeaderTitle" class="text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent">
            Food delivery in Tunis
          </h1>
        </transition>
      </div>
    </section>

    <!-- Content: Categories with Products -->
    <section class="py-8">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <!-- Search bar -->
        <div class="mb-6">
          <div class="relative max-w-2xl mx-auto">
            <input 
              v-model.trim="searchQuery" 
              type="text" 
              placeholder="Search products..." 
              class="w-full px-6 py-4 pl-14 rounded-2xl border-2 border-gray-200 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-red-500/20 focus:border-red-500 transition-all shadow-sm hover:shadow-md" 
            />
            <svg class="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="8"/>
              <path d="M21 21l-4.3-4.3"/>
            </svg>
          </div>
        </div>

        <!-- Category filter bar -->
        <div class="mb-8">
          <div class="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
            <button
              @click="selectedCategory = ''"
              :class="selectedCategory === '' 
                ? 'bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg scale-105' 
                : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-red-300 hover:bg-red-50'"
              class="px-6 py-3 rounded-xl font-semibold text-sm whitespace-nowrap transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-sm"
            >
              All Categories
            </button>
            <button
              v-for="category in categories"
              :key="category.categoryId"
              @click="selectedCategory = category.categoryId"
              :class="selectedCategory === category.categoryId 
                ? 'bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg scale-105' 
                : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-red-300 hover:bg-red-50'"
              class="px-6 py-3 rounded-xl font-semibold text-sm whitespace-nowrap transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-sm"
            >
              {{ category.name }}
            </button>
          </div>
        </div>

        <!-- Loading state -->
        <div v-if="isLoading" class="py-20 text-center">
          <div class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-red-600"></div>
          <p class="mt-4 text-gray-600 font-medium">Loading products...</p>
        </div>

        <!-- Categories sections -->
        <div v-else class="space-y-16">
          <div v-for="category in categoriesWithProducts" :key="category.categoryId" class="category-section">
            <!-- Category header -->
            <div class="mb-8 flex items-center gap-4">
              <div class="h-1 flex-1 bg-gradient-to-r from-red-600 to-transparent rounded-full"></div>
              <h2 class="text-3xl sm:text-4xl font-bold text-gray-900 whitespace-nowrap">
                {{ category.name }}
              </h2>
              <div class="h-1 flex-1 bg-gradient-to-l from-red-600 to-transparent rounded-full"></div>
            </div>

            <!-- Products grid for this category -->
            <div v-if="category.products.length === 0" class="text-center py-12 text-gray-500">
              <p class="text-lg">No products found in this category.</p>
            </div>
            <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              <div 
                v-for="p in category.products" 
                :key="p.productId" 
                class="product-card group bg-white rounded-3xl border border-gray-200 shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden transform hover:-translate-y-2"
              >
                <!-- Product image -->
                <div class="relative aspect-[4/3] bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
                  <img 
                    :src="resolveImage(p.imageUrls?.[0])" 
                    :alt="p.name" 
                    class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                  />
                  <div class="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <!-- Availability badge -->
                  <div v-if="!p.disponible" class="absolute top-3 right-3 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                    Out of Stock
                  </div>
                </div>

                <!-- Product info -->
                <div class="p-5">
                  <div class="flex items-start justify-between gap-3 mb-3">
                    <h3 class="text-lg font-bold text-gray-900 leading-tight line-clamp-2 flex-1">
                      {{ p.name }}
                    </h3>
                    <span class="text-2xl font-extrabold text-red-600 whitespace-nowrap ml-2">
                      {{ formatPrice(p.price) }}
                    </span>
                  </div>

                  <!-- Description preview -->
                  <p v-if="p.description" class="text-sm text-gray-600 line-clamp-2 mb-4 min-h-[2.5rem]">
                    {{ p.description }}
                  </p>

                  <!-- Action buttons -->
                  <div class="flex items-center gap-3 mt-5">
                    <button 
                      @click="goToDetails(p)" 
                      class="flex-1 inline-flex items-center justify-center gap-2 h-11 px-4 rounded-xl border-2 border-gray-300 hover:border-gray-400 hover:bg-gray-50 text-sm font-semibold text-gray-900 transition-all duration-200"
                    >
                      <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                      </svg>
                      Details
                    </button>
                    <button
                      @click="addToCart(p)"
                      aria-label="Add to cart"
                      :disabled="!p.disponible"
                      class="flex-1 inline-flex items-center justify-center gap-2 h-11 px-4 rounded-xl text-sm font-bold shadow-lg transition-all duration-200 transform hover:scale-105 disabled:transform-none disabled:cursor-not-allowed"
                      :class="p.disponible ? 'bg-gradient-to-r from-red-600 to-red-700 text-white hover:from-red-700 hover:to-red-800 hover:shadow-xl' : 'bg-gray-200 text-gray-500'"
                    >
                      <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M2.25 3.75a.75.75 0 000 1.5H4.5l2.652 9.28A3 3 0 0010.057 16.5h6.693a3 3 0 002.88-2.115l1.533-5.11A.75.75 0 0021.45 8H7.302l-.6-2.1A1.5 1.5 0 005.262 4.5H2.25zM9.75 20.25a1.5 1.5 0 11-3.001 0 1.5 1.5 0 013.001 0zm9 0a1.5 1.5 0 11-3.001 0 1.5 1.5 0 013.001 0z"/>
                      </svg>
                      <span class="hidden sm:inline">Add</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- No results message -->
          <div v-if="categoriesWithProducts.length === 0" class="text-center py-20">
            <div class="inline-block p-6 bg-gray-100 rounded-full mb-4">
              <svg class="h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
            </div>
            <p class="text-xl font-semibold text-gray-700 mb-2">No products found</p>
            <p class="text-gray-500">Try adjusting your search terms</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Details Modal -->
    <div v-if="detailsProduct" class="fixed inset-0 z-50 flex items-center justify-center">
      <div class="absolute inset-0 bg-black/60" @click.self="closeDetails"></div>
      <div class="relative bg-white rounded-2xl shadow-2xl w-[92vw] max-w-4xl mx-auto overflow-hidden animate-modal">
        <div class="grid grid-cols-1 md:grid-cols-2">
          <div class="relative bg-gray-50">
            <img :src="resolveImage(detailsProduct.imageUrls?.[0])" :alt="detailsProduct.name" class="w-full h-full object-cover">
            <div class="absolute top-3 left-3 inline-flex items-center rounded-full bg-black/70 text-white text-xs px-2 py-1">
              {{ detailsProduct.category?.name || categoryNameById(detailsProduct.categoryId) || '—' }}
            </div>
          </div>
          <div class="p-5">
            <div class="flex items-start justify-between gap-4">
              <h3 class="text-xl font-bold text-gray-900">{{ detailsProduct.name }}</h3>
              <button @click="closeDetails" class="rounded-full p-2 hover:bg-gray-100 text-gray-600" aria-label="Fermer">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="h-5 w-5"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" /></svg>
              </button>
            </div>
            <p class="mt-2 text-gray-600">{{ detailsProduct.description }}</p>
            <div class="mt-4">
              <span class="text-2xl font-extrabold text-red-600">{{ formatPrice(detailsProduct.price) }}</span>
            </div>
            <div class="mt-5 flex items-center gap-3">
              <button 
                @click="addToCart(detailsProduct)" 
                :disabled="!detailsProduct.disponible"
                class="inline-flex items-center gap-2 h-11 px-5 rounded-xl text-sm font-semibold shadow transition disabled:cursor-not-allowed disabled:opacity-50"
                :class="detailsProduct.disponible ? 'bg-gradient-to-r from-red-600 to-red-700 text-white hover:from-red-700 hover:to-red-800' : 'bg-gray-200 text-gray-500'"
              >
                Ajouter au panier
              </button>
              <button @click="closeDetails" class="inline-flex items-center gap-2 h-11 px-5 rounded-xl border border-gray-300 hover:bg-gray-50 text-sm font-medium text-gray-900 transition">
                Fermer
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Toast -->
    <div v-if="toastMessage" class="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
      <div class="px-4 py-2 rounded-xl bg-black/85 text-white shadow-lg animate-toast">{{ toastMessage }}</div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useAuth } from '../../stores/auth.js'
import { api, resolveImage } from '../../utils/api.js'

const { user } = useAuth()

// Resolve background image
const bgUrl = new URL('../../assets/bp.jpg', import.meta.url).href


// Extract customerId from JWT (nameidentifier claim)
function getCustomerIdFromToken(token) {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    return payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'] || payload.sub || payload.userId || null
  } catch {
    return null
  }
}

const CURRENCY = (import.meta?.env?.VITE_CURRENCY || 'TND').toUpperCase()
const LOCALE = import.meta?.env?.VITE_LOCALE || 'fr-TN'
const formatPrice = (num) => {
  const value = Number(num)
  if (Number.isNaN(value)) return '—'
  try { return new Intl.NumberFormat(LOCALE, { style: 'currency', currency: CURRENCY, minimumFractionDigits: 2 }).format(value) } catch { return `${value.toFixed(2)} ${CURRENCY}` }
}

const products = ref([])
const categories = ref([])
const isLoading = ref(true)
const toastMessage = ref('')
const detailsProduct = ref(null)
// removed extra filter UI state

// Hide title on scroll down
const showHeaderTitle = ref(true)
let lastScrollY = 0
function onScroll() {
  const y = window.scrollY || 0
  // Hide when scrolled down beyond 10px
  showHeaderTitle.value = y < 10
  lastScrollY = y
}

// Search and filters
const searchQuery = ref('')
const selectedCategory = ref('')

const categoryNameById = (id) => categories.value.find(c => c.categoryId === id)?.name


const loadProducts = async () => {
  try {
    const res = await fetch(api('/api/Product'), {
      headers: { 'accept': '*/*', 'Authorization': user.value?.token ? `Bearer ${user.value.token}` : '' }
    })
    if (!res.ok) throw new Error('fetch products failed')
    products.value = await res.json()
  } catch (e) {
    console.error(e)
    products.value = []
  } finally {
    isLoading.value = false
  }
}

const loadCategories = async () => {
  try {
    const res = await fetch(api('/api/Category'), {
      headers: { 'accept': '*/*', 'Authorization': user.value?.token ? `Bearer ${user.value.token}` : '' }
    })
    if (!res.ok) throw new Error('fetch categories failed')
    categories.value = await res.json()
  } catch (e) {
    console.error(e)
    categories.value = []
  }
}

// Group products by category
const categoriesWithProducts = computed(() => {
  let filtered = [...products.value]
  
  // Apply search filter
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    filtered = filtered.filter(p => 
      (p.name || '').toLowerCase().includes(q) || 
      (p.description || '').toLowerCase().includes(q)
    )
  }

  // Apply category filter
  if (selectedCategory.value) {
    filtered = filtered.filter(p => 
      p.categoryId === selectedCategory.value || 
      p.category?.categoryId === selectedCategory.value
    )
  }

  // Group by category
  const categoryMap = new Map()
  
  // Initialize all categories (or just the selected one)
  const categoriesToShow = selectedCategory.value 
    ? categories.value.filter(cat => cat.categoryId === selectedCategory.value)
    : categories.value
  
  categoriesToShow.forEach(cat => {
    categoryMap.set(cat.categoryId, {
      categoryId: cat.categoryId,
      name: cat.name,
      products: []
    })
  })

  // Add products to their categories
  filtered.forEach(product => {
    const categoryId = product.categoryId || product.category?.categoryId
    if (categoryId && categoryMap.has(categoryId)) {
      categoryMap.get(categoryId).products.push(product)
    } else if (categoryId && !selectedCategory.value) {
      // Category exists in product but not in categories list (only when showing all)
      categoryMap.set(categoryId, {
        categoryId: categoryId,
        name: product.category?.name || categoryNameById(categoryId) || 'Uncategorized',
        products: [product]
      })
    }
  })

  // Convert to array and filter out empty categories, sort by category name
  return Array.from(categoryMap.values())
    .filter(cat => cat.products.length > 0)
    .sort((a, b) => (a.name || '').localeCompare(b.name || ''))
    .map(cat => ({
      ...cat,
      products: cat.products.sort((a, b) => (a.name || '').localeCompare(b.name || ''))
    }))
})

function openDetails(p) { detailsProduct.value = p }
function closeDetails() { detailsProduct.value = null }

import { useRouter } from 'vue-router'
const router = useRouter()
function goToDetails(p) {
  router.push({ path: '/produit-details', query: { id: p.productId } })
}

async function addToCart(product) {
  if (!product?.disponible) {
    showToast('Produit indisponible')
    return
  }
  const token = user.value?.token
  const customerId = token ? getCustomerIdFromToken(token) : null
  // Try server first if authenticated
  if (token && customerId) {
    try {
      const res = await fetch(api(`/api/cart/${customerId}/items`), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'accept': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ productId: product.productId, quantity: 1 })
      })
      if (!res.ok) throw new Error('add to cart failed')
      showToast('Ajouté au panier')
      window.dispatchEvent(new Event('cart-updated'))
      return
    } catch (e) {
      console.error(e)
      // Fallback to local storage
    }
  }
  try {
    const raw = localStorage.getItem('cart')
    const cart = raw ? JSON.parse(raw) : []
    const idx = cart.findIndex(i => i.productId === product.productId)
    if (idx >= 0) {
      cart[idx].quantity += 1
    } else {
      cart.push({ productId: product.productId, name: product.name, price: product.price, image: product.imageUrls?.[0] || '', quantity: 1 })
    }
    localStorage.setItem('cart', JSON.stringify(cart))
    showToast('Ajouté au panier')
    window.dispatchEvent(new Event('cart-updated'))
  } catch (e) {
    console.error(e)
    showToast("Impossible d'ajouter au panier")
  }
}

function showToast(msg) {
  toastMessage.value = msg
  setTimeout(() => { toastMessage.value = '' }, 1500)
}

onMounted(async () => {
  await Promise.all([loadProducts(), loadCategories()])
  window.addEventListener('scroll', onScroll, { passive: true })
  onScroll()
})

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
})
</script>

<style scoped>
/* Smooth fade for the header title */
.fade-title-enter-active, .fade-title-leave-active { 
  transition: opacity .3s ease, transform .3s ease; 
}
.fade-title-enter-from, .fade-title-leave-to { 
  opacity: 0; 
  transform: translateY(4px); 
}

/* Category section animations */
.category-section {
  animation: fadeInUp 0.6s ease-out both;
}

.category-section:nth-child(1) { animation-delay: 0.1s; }
.category-section:nth-child(2) { animation-delay: 0.2s; }
.category-section:nth-child(3) { animation-delay: 0.3s; }
.category-section:nth-child(4) { animation-delay: 0.4s; }
.category-section:nth-child(5) { animation-delay: 0.5s; }
.category-section:nth-child(n+6) { animation-delay: 0.6s; }

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Product card animations */
.product-card {
  animation: cardSlideIn 0.5s ease-out both;
}

.product-card:nth-child(1) { animation-delay: 0.05s; }
.product-card:nth-child(2) { animation-delay: 0.1s; }
.product-card:nth-child(3) { animation-delay: 0.15s; }
.product-card:nth-child(4) { animation-delay: 0.2s; }
.product-card:nth-child(n+5) { animation-delay: 0.25s; }

@keyframes cardSlideIn {
  from {
    opacity: 0;
    transform: translateY(20px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* Enhanced product card hover effects */
.product-card:hover {
  border-color: rgba(220, 38, 38, 0.3);
}

.product-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border-radius: 1.5rem;
  padding: 2px;
  background: linear-gradient(135deg, rgba(220, 38, 38, 0.1), rgba(239, 68, 68, 0.05));
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  mask-composite: exclude;
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
}

.product-card:hover::before {
  opacity: 1;
}

/* Modal animations */
@keyframes modal-pop { 
  0% { 
    opacity: 0; 
    transform: translateY(20px) scale(.95); 
  } 
  100% { 
    opacity: 1; 
    transform: translateY(0) scale(1); 
  } 
}
.animate-modal { 
  animation: modal-pop .3s cubic-bezier(0.34, 1.56, 0.64, 1) both; 
}

/* Toast animations */
@keyframes toast-pop { 
  0% { 
    transform: translate(-50%, 10px); 
    opacity: 0; 
  } 
  100% { 
    transform: translate(-50%, 0); 
    opacity: 1; 
  } 
}
.animate-toast { 
  animation: toast-pop .3s cubic-bezier(0.34, 1.56, 0.64, 1) both; 
}

/* Smooth transitions for interactive elements */
button {
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

button:active {
  transform: scale(0.98);
}

/* Loading spinner enhancement */
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* Gradient text enhancement */
h1, h2 {
  letter-spacing: -0.02em;
}

/* Scrollbar hide for category filter */
.scrollbar-hide {
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */
}

.scrollbar-hide::-webkit-scrollbar {
  display: none;  /* Chrome, Safari and Opera */
}

/* Category filter button animations */
@keyframes filterButtonActive {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1.05);
  }
}

/* Responsive adjustments */
@media (max-width: 640px) {
  .category-section {
    animation-delay: 0s !important;
  }
  
  .product-card {
    animation-delay: 0s !important;
  }
}
</style>
  