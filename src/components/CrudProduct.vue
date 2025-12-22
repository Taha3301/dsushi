<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 p-4 sm:p-6 lg:p-8">
    <div class="max-w-7xl mx-auto">
      <div class="flex items-center justify-between mb-6">
        <div>
          <h1 class="text-2xl sm:text-3xl font-bold text-gray-900">Produits</h1>
          <p class="text-gray-600 text-sm sm:text-base">Liste des produits disponibles</p>
        </div>
        <button @click="goToAddProduct" class="hidden sm:inline-flex items-center gap-2 rounded-lg bg-gray-900 text-white px-4 h-10 text-sm font-semibold shadow-sm hover:bg-black/90 focus:outline-none focus:ring-2 focus:ring-black/10">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v12m6-6H6"/></svg>
          Ajouter un produit
        </button>
      </div>

      <!-- States -->
      <div v-if="isLoading" class="flex items-center justify-center py-16">
        <svg class="animate-spin h-6 w-6 text-gray-600" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>
      <div v-else-if="errorMessage" class="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-xl">
        {{ errorMessage }}
      </div>

      <!-- Filters -->
      <div v-else>
        <div class="mb-6 flex flex-wrap items-center gap-3">
          <button
            @click="setFilter(null)"
            :class="['px-3 h-9 text-sm font-semibold rounded-full border', !activeCategoryId ? 'bg-gray-900 text-white border-gray-900' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50']"
          >
            Tous
          </button>
          <button
            v-for="cat in categories"
            :key="cat.id"
            @click="setFilter(cat.id)"
            :class="['px-3 h-9 text-sm font-semibold rounded-full border', activeCategoryId === cat.id ? 'bg-gray-900 text-white border-gray-900' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50']"
          >
            {{ cat.name }}
          </button>
        </div>

        <!-- Grid -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
        <div
          v-for="product in filteredProducts"
          :key="product.productId"
          class="group bg-white rounded-2xl shadow-sm hover:shadow-lg border border-gray-100 overflow-hidden transition-all duration-200"
        >
          <div class="aspect-[4/3] bg-gray-100 overflow-hidden relative">
            <img
              :src="resolveImage((product.imageUrls && product.imageUrls.length > 0) ? product.imageUrls[getSlide(product)] : null)"
              :alt="product.name"
              class="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
              @error="onImgError"
            />
            <template v-if="product.imageUrls && product.imageUrls.length > 1">
              <button
                @click.stop="prevSlide(product)"
                class="absolute left-2 top-1/2 -translate-y-1/2 inline-flex items-center justify-center w-8 h-8 rounded-full bg-white/80 text-gray-800 shadow hover:bg-white"
                aria-label="Précédente"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
              </button>
              <button
                @click.stop="nextSlide(product)"
                class="absolute right-2 top-1/2 -translate-y-1/2 inline-flex items-center justify-center w-8 h-8 rounded-full bg-white/80 text-gray-800 shadow hover:bg-white"
                aria-label="Suivante"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
              </button>
              <div class="absolute bottom-2 left-0 right-0 flex justify-center gap-1.5">
                <span
                  v-for="(u, i) in product.imageUrls"
                  :key="i"
                  :class="['h-1.5 rounded-full transition-all', getSlide(product) === i ? 'w-4 bg-white shadow' : 'w-2 bg-white/60']"
                ></span>
              </div>
            </template>
          </div>
          <div class="p-4">
            <div class="flex items-start justify-between gap-3">
              <div>
                <h3 class="text-base sm:text-lg font-semibold text-gray-900 truncate">{{ product.name }}</h3>
                <p class="text-xs text-gray-500 truncate">{{ product.category?.name || 'Sans catégorie' }}</p>
              </div>
              <div class="shrink-0 bg-gray-900 text-white text-xs font-bold px-2.5 py-1 rounded-full">{{ formatPrice(product.price) }}</div>
            </div>
            <p class="mt-2 text-sm text-gray-600 line-clamp-2">{{ product.description }}</p>
            <div class="mt-3 flex items-center justify-between">
              <span :class="['text-xs font-medium px-2.5 py-1 rounded-full', product.stock > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700']">
                {{ product.stock > 0 ? `En stock (${product.stock})` : 'Rupture' }}
              </span>
              <button @click="openDetails(product)" class="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 h-9 text-xs font-semibold text-gray-900 shadow-sm hover:border-gray-400 hover:bg-gray-50">
                Détails
              </button>
            </div>
          </div>
        </div>
      </div>
      </div>

      <!-- Details Modal -->
      <div v-if="isDetailsOpen" class="fixed inset-0 z-50">
        <div class="absolute inset-0 bg-black/40 backdrop-blur-sm animate-fade-in" @click="closeDetails"></div>
        <div class="absolute inset-0 flex items-center justify-center p-4">
          <div class="w-full max-w-3xl bg-white rounded-3xl shadow-2xl ring-1 ring-black/5 overflow-hidden animate-pop-up">
            <div class="flex flex-col sm:flex-row">
              <div class="hidden sm:block sm:w-1/2 bg-gray-100 relative overflow-hidden">
                <img
                  v-if="selectedProduct"
                  :src="resolveImage((selectedProduct?.imageUrls && selectedProduct.imageUrls.length > 0) ? selectedProduct.imageUrls[getSlide(selectedProduct)] : null)"
                  :alt="selectedProduct?.name"
                  class="h-full w-full object-cover transform-gpu transition-transform duration-500 ease-out hover:scale-105"
                  @error="onImgError"
                />
                <div class="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-500"></div>

                <template v-if="selectedProduct?.imageUrls && selectedProduct.imageUrls.length > 1">
                  <button
                    @click.stop="prevSlide(selectedProduct)"
                    class="absolute left-2 top-1/2 -translate-y-1/2 inline-flex items-center justify-center w-9 h-9 rounded-full bg-white/90 text-gray-800 shadow hover:bg-white"
                    aria-label="Précédente"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
                  </button>
                  <button
                    @click.stop="nextSlide(selectedProduct)"
                    class="absolute right-2 top-1/2 -translate-y-1/2 inline-flex items-center justify-center w-9 h-9 rounded-full bg-white/90 text-gray-800 shadow hover:bg-white"
                    aria-label="Suivante"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
                  </button>
                  <div class="absolute bottom-2 left-0 right-0 flex justify-center gap-1.5">
                    <span
                      v-for="(u, i) in selectedProduct.imageUrls"
                      :key="i"
                      :class="['h-1.5 rounded-full transition-all', getSlide(selectedProduct) === i ? 'w-4 bg-white shadow' : 'w-2 bg-white/60']"
                    ></span>
                  </div>
                </template>
              </div>
              <div class="w-full sm:w-1/2 p-5 sm:p-6 flex flex-col min-h-[360px]">
                <div class="flex items-start justify-between gap-4">
                  <div>
                    <h3 class="text-xl font-semibold text-gray-900 tracking-tight">{{ selectedProduct?.name }}</h3>
                    <p class="mt-0.5 text-xs font-medium text-gray-500">{{ selectedProduct?.category?.name || 'Sans catégorie' }}</p>
                  </div>
                  <button @click="closeDetails" class="rounded-full p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
                  </button>
                </div>
                <p class="mt-3 text-sm leading-6 text-gray-700">{{ selectedProduct?.description }}</p>
                <div class="mt-4 flex items-center justify-between">
                  <div class="bg-gray-900 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-sm animate-badge-pop">{{ formatPrice(selectedProduct?.price) }}</div>
                  <span :class="['text-xs font-medium px-2.5 py-1 rounded-full', (selectedProduct?.stock || 0) > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700']">
                    {{ (selectedProduct?.stock || 0) > 0 ? `En stock (${selectedProduct?.stock})` : 'Rupture' }}
                  </span>
                </div>
                <div class="mt-auto pt-6 flex justify-end gap-3">
                  <button
                    @click="openEdit()"
                    class="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-red-600 to-red-700 text-white px-4 h-10 text-sm font-semibold shadow-sm hover:from-red-700 hover:to-red-800 focus:outline-none focus:ring-2 focus:ring-red-500/30 transition-transform active:scale-95"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5M18.5 2.5a2.121 2.121 0 113 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                    Modifier
                  </button>
                  <button @click="closeDetails" class="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 h-10 text-sm font-semibold text-gray-900 shadow-sm hover:border-gray-400 hover:bg-gray-50 transition-transform active:scale-95">Fermer</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../stores/auth.js'
import { api, resolveImage, API_BASE } from '../utils/api.js'

const router = useRouter()
const { user } = useAuth()

const products = ref([])
const isLoading = ref(true)
const errorMessage = ref('')
const categories = ref([]) // { id, name }
const activeCategoryId = ref(null)


const fetchProducts = async () => {
  isLoading.value = true
  errorMessage.value = ''
  try {
    const response = await fetch(api('/api/Product'), {
      headers: {
        'accept': '*/*',
        'Authorization': user.value?.token ? `Bearer ${user.value.token}` : ''
      }
    })
    if (!response.ok) {
      throw new Error(`Erreur ${response.status}`)
    }
    const data = await response.json()
    products.value = Array.isArray(data) ? data : []
    
    // Initialize imageUrls array for each product if it doesn't exist
    for (const p of products.value) {
      if (!p.imageUrls) {
        p.imageUrls = []
      }
    }
    
    // Build categories list
    const map = new Map()
    for (const p of products.value) {
      const id = p.categoryId || p.category?.categoryId || 'uncategorized'
      const name = p.category?.name || 'Sans catégorie'
      if (!map.has(id)) map.set(id, { id, name })
    }
    categories.value = Array.from(map.values())
    
    // Load product images for each product
    await loadProductImages()
  } catch (err) {
    errorMessage.value = 'Impossible de charger les produits.'
    console.error('Fetch products error:', err)
  } finally {
    isLoading.value = false
  }
}

// Load product images using the API endpoint
const loadProductImages = async () => {
  const token = user.value?.token ? `Bearer ${user.value.token}` : ''
  
  // Load images for all products in parallel
  const imagePromises = products.value.map(async (product) => {
    if (!product.productId) return
    
    try {
      const response = await fetch(api(`/api/Product/${product.productId}/images`), {
        method: 'GET',
        headers: {
          'accept': '*/*',
          'Authorization': token
        }
      })
      
      if (response.ok) {
        const images = await response.json()
        console.log(`[CrudProduct] Images API response for product ${product.productId}:`, images)
        
        // API returns an array like ["/images/filename.png"] from your backend
        if (Array.isArray(images) && images.length > 0) {
          // Normalize all image paths to ensure they start with /
          product.imageUrls = images.map(imgPath => {
            if (typeof imgPath === 'string') {
              // Ensure path starts with / and normalize
              let path = imgPath.trim()
              if (!path.startsWith('/')) {
                path = `/${path}`
              }
              // Remove double slashes
              path = path.replace(/\/+/g, '/')
              console.log(`[CrudProduct] Normalized image path for product ${product.productId}:`, path)
              return path
            }
            return imgPath
          })
          console.log(`[CrudProduct] ✅ Successfully loaded ${product.imageUrls.length} image(s) for product ${product.productId}`)
        } else if (!product.imageUrls || product.imageUrls.length === 0) {
          // Keep existing imageUrls if API returns empty, otherwise set to empty array
          product.imageUrls = []
          console.warn(`[CrudProduct] ⚠️ No images found for product ${product.productId}`)
        }
      } else {
        console.warn(`[CrudProduct] ❌ Failed to load images for product ${product.productId}: HTTP ${response.status}`)
        // If API fails, keep existing imageUrls or set to empty array
        if (!product.imageUrls) {
          product.imageUrls = []
        }
      }
    } catch (error) {
      console.error(`[CrudProduct] ❌ Error loading images for product ${product.productId}:`, error)
      // On error, keep existing imageUrls or set to empty array
      if (!product.imageUrls) {
        product.imageUrls = []
      }
    }
  })
  
  await Promise.all(imagePromises)
}

const CURRENCY = (import.meta?.env?.VITE_CURRENCY || 'TND').toUpperCase()
const LOCALE = import.meta?.env?.VITE_LOCALE || 'fr-TN'

const formatPrice = (num) => {
  const value = Number(num)
  if (Number.isNaN(value)) return '—'
  try {
    return new Intl.NumberFormat(LOCALE, { style: 'currency', currency: CURRENCY, minimumFractionDigits: 2 }).format(value)
  } catch {
    const symbol = CURRENCY === 'TND' ? 'DT' : CURRENCY
    return `${value.toFixed(2)} ${symbol}`
  }
}


const onImgError = (e) => {
  const img = e.target
  if (img && !img.dataset.fallbackApplied) {
    img.dataset.fallbackApplied = '1'
    
    // Log the failed image URL for debugging
    const failedUrl = img.src
    console.warn('[CrudProduct] ⚠️ Image failed to load:', failedUrl)
    
    // If proxy failed, try direct backend URL as fallback
    const useProxy = !!(import.meta && import.meta.env && import.meta.env.DEV)
    if (useProxy && (failedUrl.includes('localhost:5173/images/') || failedUrl.includes('localhost:5173/Images/'))) {
      // Try direct backend URL
      const backendUrl = API_BASE
      const imagePath = failedUrl.replace(/^https?:\/\/localhost:5173/, '')
      const directUrl = `${backendUrl}${imagePath}`
      
      console.info('[CrudProduct] 🔄 Attempting direct backend URL:', directUrl)
      
      // Try loading from backend directly
      const testImg = new Image()
      testImg.onload = () => {
        // If direct URL works, update the image source
        img.src = directUrl
        img.dataset.fallbackApplied = '0' // Reset to allow retry
        console.info('[CrudProduct] ✅ Direct backend URL succeeded:', directUrl)
      }
      testImg.onerror = () => {
        // If direct URL also fails, use fallback SVG
        console.error('[CrudProduct] ❌ Direct backend URL also failed:', directUrl)
        console.error('[CrudProduct] 🔧 SOLUTION: Your backend ASP.NET Core must serve static files.')
        console.error('[CrudProduct] 📝 Add this to Program.cs: app.UseStaticFiles();')
        console.error('[CrudProduct] 📝 Ensure files exist in: wwwroot/images/')
        img.src = FALLBACK_IMAGE
      }
      testImg.src = directUrl
      return
    }
    
    // Use fallback image if no retry attempted
    img.src = FALLBACK_IMAGE
  }
}

onMounted(fetchProducts)

// Details modal state
const isDetailsOpen = ref(false)
const selectedProduct = ref(null)
const openDetails = (product) => {
  selectedProduct.value = product
  isDetailsOpen.value = true
}
const closeDetails = () => {
  isDetailsOpen.value = false
  selectedProduct.value = null
}
const openEdit = () => {
  goToAddProduct()
}
const onKeyDown = (e) => {
  if (e.key === 'Escape' && isDetailsOpen.value) closeDetails()
}
onMounted(() => window.addEventListener('keydown', onKeyDown))
onUnmounted(() => window.removeEventListener('keydown', onKeyDown))

// Category filter helpers
const setFilter = (id) => {
  activeCategoryId.value = id
}
const filteredProducts = computed(() => {
  if (!activeCategoryId.value) return products.value
  return products.value.filter(p => {
    const id = p.categoryId || p.category?.categoryId
    return id === activeCategoryId.value
  })
})

// Navigation
const goToAddProduct = () => {
  try {
    router.push('/ajouter-produit')
  } catch (e) {
    console.error('Navigation error:', e)
  }
}

// Simple per-product slider state stored on product object (non-persistent)
const getSlide = (product) => {
  if (!product) return 0
  if (typeof product._slideIndex !== 'number') product._slideIndex = 0
  return product._slideIndex
}
const setSlide = (product, idx) => {
  if (!product || !Array.isArray(product.imageUrls) || product.imageUrls.length === 0) return
  const len = product.imageUrls.length
  product._slideIndex = ((idx % len) + len) % len
}
const nextSlide = (product) => setSlide(product, getSlide(product) + 1)
const prevSlide = (product) => setSlide(product, getSlide(product) - 1)
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  line-clamp: 2;
  overflow: hidden;
}

@keyframes fade-in {
  from { opacity: 0 }
  to { opacity: 1 }
}
@keyframes pop-up {
  0% { opacity: 0; transform: translateY(12px) scale(0.98) }
  100% { opacity: 1; transform: translateY(0) scale(1) }
}
@keyframes badge-pop {
  0% { transform: scale(0.9); opacity: 0 }
  100% { transform: scale(1); opacity: 1 }
}
.animate-fade-in { animation: fade-in 200ms ease-out }
.animate-pop-up { animation: pop-up 240ms cubic-bezier(.21,1.02,.73,1) }
.animate-badge-pop { animation: badge-pop 260ms cubic-bezier(.21,1.02,.73,1) }
</style>