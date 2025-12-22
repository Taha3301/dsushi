<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
    <div class="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8">
      <button @click="goBack" class="inline-flex items-center gap-2 rounded-full border border-gray-300 bg-white px-4 h-10 text-sm font-medium text-gray-900 shadow-sm hover:border-gray-400 hover:bg-gray-50">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="h-4 w-4"><path fill-rule="evenodd" d="M15.78 4.22a.75.75 0 010 1.06L9.06 12l6.72 6.72a.75.75 0 11-1.06 1.06l-7.25-7.25a.75.75 0 010-1.06l7.25-7.25a.75.75 0 011.06 0z" clip-rule="evenodd"/></svg>
        Retour
      </button>

      <div v-if="isLoading" class="py-24 text-center text-gray-600">Chargement...</div>
      <div v-else-if="!product" class="py-24 text-center text-gray-600">Produit introuvable.</div>
      <div v-else class="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-8 animate-page">
        <!-- Images -->
        <div class="relative bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div class="aspect-square bg-gray-50">
            <img :src="resolveImage(activeImage)" :alt="product.name" class="w-full h-full object-cover" @error="onImgError" />
          </div>
          <div class="p-3 grid grid-cols-4 sm:grid-cols-6 gap-3">
            <button v-for="(img, i) in product.imageUrls" :key="i" @click="activeImage = img" class="relative aspect-square rounded-lg overflow-hidden border" :class="activeImage === img ? 'border-red-500' : 'border-gray-200'">
              <img :src="resolveImage(img)" class="w-full h-full object-cover" @error="onImgError" />
            </button>
          </div>
        </div>

        <!-- Details -->
        <div class="space-y-5">
          <div>
            <div class="inline-flex items-center rounded-full bg-black/70 text-white text-xs px-2 py-1">
              {{ product.category?.name || categoryNameById(product.categoryId) || '—' }}
            </div>
            <h1 class="mt-2 text-3xl font-bold text-gray-900">{{ product.name }}</h1>
            <p class="mt-2 text-gray-600">{{ product.description }}</p>
          </div>
          <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div class="text-2xl font-extrabold text-red-600">{{ formatPrice(product.price) }}</div>
            <div class="text-sm font-semibold" :class="product.disponible ? 'text-green-600' : 'text-red-600'">
              {{ product.disponible ? 'Disponible' : 'Indisponible' }}
            </div>
          </div>
          <div class="flex items-center gap-3 pt-2">
            <button
              @click="addToCart(product)"
              :disabled="!product.disponible"
              class="inline-flex items-center gap-2 h-11 px-6 rounded-xl text-sm font-semibold shadow transition"
              :class="product.disponible ? 'bg-gradient-to-r from-red-600 to-red-700 text-white hover:from-red-700 hover:to-red-800' : 'bg-gray-200 text-gray-500 cursor-not-allowed'"
            >
              Ajouter au panier
            </button>
            <button @click="removeFromCart(product)" class="inline-flex items-center gap-2 h-11 px-6 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 text-sm font-semibold transition">
              Retirer
            </button>
            <button @click="goToProduits" class="inline-flex items-center gap-2 h-11 px-6 rounded-xl border border-gray-300 hover:bg-gray-50 text-sm font-medium text-gray-900 transition">
              Continuer vos achats
            </button>
          </div>

          <!-- Info cards -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div class="bg-white rounded-2xl border border-gray-100 p-4">
              <div class="text-sm text-gray-500">Catégorie</div>
              <div class="mt-1 font-semibold">{{ product.category?.name || categoryNameById(product.categoryId) || '—' }}</div>
            </div>
            <div class="bg-white rounded-2xl border border-gray-100 p-4">
              <div class="text-sm text-gray-500">Disponibilité</div>
              <div class="mt-1 font-semibold" :class="product.disponible ? 'text-green-600' : 'text-red-600'">
                {{ product.disponible ? 'Disponible' : 'Indisponible' }}
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
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuth } from '../../stores/auth.js'
import { api, resolveImage } from '../../utils/api.js'

const route = useRoute()
const router = useRouter()
const { user } = useAuth()

const isBrowser = typeof window !== 'undefined'

// Extract customerId from JWT (nameidentifier claim)
function getCustomerIdFromToken(token) {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    return payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'] || payload.sub || payload.userId || null
  } catch {
    return null
  }
}

async function removeFromCart(p) {
  const token = user.value?.token
  const customerId = token ? getCustomerIdFromToken(token) : null
  if (token && customerId) {
    try {
      const res = await fetch(api(`/api/cart/${customerId}/items/${p.productId}`), {
        method: 'DELETE',
        headers: {
          'accept': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      })
      if (!res.ok) throw new Error('remove from cart failed')
      showToast('Supprimé du panier')
      window.dispatchEvent(new Event('cart-updated'))
      return
    } catch (e) {
      console.error(e)
    }
  }
  try {
    const raw = localStorage.getItem('cart')
    const cart = raw ? JSON.parse(raw) : []
    const next = cart.filter(i => i.productId !== p.productId)
    localStorage.setItem('cart', JSON.stringify(next))
    showToast('Supprimé du panier')
    window.dispatchEvent(new Event('cart-updated'))
  } catch (e) {
    console.error(e)
    showToast('Impossible de retirer')
  }
}

const CURRENCY = (import.meta?.env?.VITE_CURRENCY || 'TND').toUpperCase()
const LOCALE = import.meta?.env?.VITE_LOCALE || 'fr-TN'
const formatPrice = (num) => {
  const value = Number(num)
  if (Number.isNaN(value)) return '—'
  try { return new Intl.NumberFormat(LOCALE, { style: 'currency', currency: CURRENCY, minimumFractionDigits: 2 }).format(value) } catch { return `${value.toFixed(2)} ${CURRENCY}` }
}

const isLoading = ref(true)
const product = ref(null)
const categories = ref([])
const activeImage = ref('')
const toastMessage = ref('')

const categoryNameById = (id) => categories.value.find(c => c.categoryId === id)?.name


const onImgError = (e) => {
  const img = e.target
  if (img && !img.dataset.fallbackApplied) {
    img.dataset.fallbackApplied = '1'
    console.warn('[ProduitDetails] ⚠️ Image failed to load:', img.src)
    img.src = FALLBACK_IMAGE
  }
}

async function loadProduct() {
  const id = route.query.id
  if (!id) { isLoading.value = false; return }
  try {
    const res = await fetch(api('/api/Product'), { headers: { 'accept': '*/*', 'Authorization': user.value?.token ? `Bearer ${user.value.token}` : '' } })
    if (!res.ok) throw new Error('fetch failed')
    const all = await res.json()
    product.value = all.find(p => p.productId === id) || null
    if (product.value) {
      await loadProductImages(product.value)
      activeImage.value = product.value.imageUrls?.[0] || ''
    } else {
      activeImage.value = ''
    }
  } catch (e) {
    console.error(e)
    product.value = null
  } finally {
    isLoading.value = false
  }
}

async function loadProductImages(prod) {
  if (!prod?.productId) return
  try {
    const res = await fetch(api(`/api/Product/${prod.productId}/images`), {
      method: 'GET',
      headers: { 'accept': '*/*' }
    })
    if (!res.ok) {
      console.warn('[ProduitDetails] Unable to load product images:', res.status)
      prod.imageUrls = prod.imageUrls || []
      return
    }
    const images = await res.json()
    if (Array.isArray(images) && images.length > 0) {
      prod.imageUrls = images.map(imgPath => {
        if (typeof imgPath === 'string') {
          let path = imgPath.trim()
          if (!path.startsWith('/')) path = `/${path}`
          return path.replace(/\/+/g, '/')
        }
        return imgPath
      })
    } else if (!prod.imageUrls) {
      prod.imageUrls = []
    }
  } catch (error) {
    console.error('[ProduitDetails] Error loading product images:', error)
    if (!prod.imageUrls) prod.imageUrls = []
  }
}

async function loadCategories() {
  try {
    const res = await fetch(api('/api/Category'), { headers: { 'accept': '*/*', 'Authorization': user.value?.token ? `Bearer ${user.value.token}` : '' } })
    if (!res.ok) throw new Error('fetch categories failed')
    categories.value = await res.json()
  } catch (e) {
    console.error(e)
    categories.value = []
  }
}

async function addToCart(p) {
  if (!p?.disponible) {
    showToast('Produit indisponible')
    return
  }
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
        body: JSON.stringify({ productId: p.productId, quantity: 1 })
      })
      if (!res.ok) throw new Error('add to cart failed')
      showToast('Ajouté au panier')
      window.dispatchEvent(new Event('cart-updated'))
      return
    } catch (e) {
      console.error(e)
    }
  }
  try {
    const raw = localStorage.getItem('cart')
    const cart = raw ? JSON.parse(raw) : []
    const idx = cart.findIndex(i => i.productId === p.productId)
    if (idx >= 0) cart[idx].quantity += 1; else cart.push({ productId: p.productId, name: p.name, price: p.price, image: p.imageUrls?.[0] || '', quantity: 1 })
    localStorage.setItem('cart', JSON.stringify(cart))
    showToast('Ajouté au panier')
    window.dispatchEvent(new Event('cart-updated'))
  } catch (e) {
    console.error(e)
    showToast("Impossible d'ajouter au panier")
  }
}

function goBack() { router.back() }
function goToProduits() { router.push('/produits') }

function showToast(msg) { toastMessage.value = msg; setTimeout(() => { toastMessage.value = '' }, 1500) }

onMounted(async () => {
  await Promise.all([loadProduct(), loadCategories()])
})
</script>

<style scoped>
@keyframes page-pop { 0% { opacity: 0; transform: translateY(8px) scale(.98) } 100% { opacity: 1; transform: translateY(0) scale(1) } }
.animate-page { animation: page-pop .3s ease-out both }

@keyframes toast-pop { 0% { transform: translate(-50%, 6px); opacity: 0 } 100% { transform: translate(-50%, 0); opacity: 1 } }
.animate-toast { animation: toast-pop .2s ease-out both }
</style>

