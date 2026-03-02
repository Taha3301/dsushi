<template>
  <div class="produits-page">


    <section class="content-section">
      <div class="content-inner">

        <!-- Search bar -->
        <div class="search-wrapper">
          <div class="search-box">
            <svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.3-4.3"/>
            </svg>
            <input
              v-model.trim="searchQuery"
              type="text"
              placeholder="Rechercher un produit..."
              class="search-input"
            />
            <span v-if="searchQuery" class="search-clear" @click="searchQuery = ''">✕</span>
          </div>
        </div>

        <!-- Category pills -->
        <div class="categories-bar">
          <button
            @click="selectedCategory = ''"
            :class="['cat-pill', selectedCategory === '' ? 'cat-pill--active' : '']"
          >
            <span class="cat-icon">🍽️</span> Tout
          </button>
          <button
            v-for="category in categories"
            :key="category.categoryId"
            @click="selectedCategory = category.categoryId"
            :class="['cat-pill', selectedCategory === category.categoryId ? 'cat-pill--active' : '']"
          >
            {{ category.name }}
          </button>
        </div>

        <!-- Loading -->
        <div v-if="isLoading" class="loader-state">
          <div class="spinner"></div>
          <p>Chargement des produits...</p>
        </div>

        <!-- Categories with products -->
        <div v-else class="categories-list">
          <div
            v-for="category in categoriesWithProducts"
            :key="category.categoryId"
            class="category-block"
          >
            <!-- Category header -->
            <div class="cat-header">
              <div class="cat-line"></div>
              <h2 class="cat-name">{{ category.name }}</h2>
              <div class="cat-count">{{ category.products.length }} items</div>
            </div>

            <!-- Products: slider if > 4, grid otherwise -->
            <template v-if="category.products.length > 4">
              <!-- Slider wrapper -->
              <div class="slider-outer">
                <!-- Prev button -->
                <button class="slider-nav slider-nav--prev" @click="scrollSlider(category.categoryId, -1)" aria-label="Précédent">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7"/></svg>
                </button>

                <!-- Scrollable track -->
                <div
                  class="slider-track"
                  :ref="el => { if (el) sliderRefs[category.categoryId] = el }"
                >
                  <div
                    v-for="(p, i) in category.products"
                    :key="p.productId"
                    class="product-card slider-card"
                    :style="{ '--delay': `${i * 0.06}s` }"
                  >
                    <!-- Image -->
                    <div class="card-image-wrap">
                      <img :src="resolveImage(p.imageUrls?.[0])" :alt="p.name" class="card-image" />
                      <div class="card-image-overlay"></div>
                      <div v-if="!p.disponible" class="badge badge--unavailable">Épuisé</div>
                      <button v-if="p.disponible" class="quick-add" @click.stop="addToCart(p)" aria-label="Ajouter au panier">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="quick-add-icon">
                          <path d="M2.25 3.75a.75.75 0 000 1.5H4.5l2.652 9.28A3 3 0 0010.057 16.5h6.693a3 3 0 002.88-2.115l1.533-5.11A.75.75 0 0021.45 8H7.302l-.6-2.1A1.5 1.5 0 005.262 4.5H2.25zM9.75 20.25a1.5 1.5 0 11-3.001 0 1.5 1.5 0 013.001 0zm9 0a1.5 1.5 0 11-3.001 0 1.5 1.5 0 013.001 0z"/>
                        </svg>
                        Ajouter
                      </button>
                    </div>
                    <!-- Card body -->
                    <div class="card-body">
                      <h3 class="card-name">{{ p.name }}</h3>
                      <p v-if="p.description" class="card-desc">{{ p.description }}</p>
                      <div class="card-footer">
                        <span class="card-price">{{ formatPrice(p.price) }}</span>
                        <button class="details-btn" @click="goToDetails(p)">
                          Voir
                          <svg class="details-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/></svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Next button -->
                <button class="slider-nav slider-nav--next" @click="scrollSlider(category.categoryId, 1)" aria-label="Suivant">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/></svg>
                </button>
              </div>
            </template>

            <!-- Grid for ≤ 4 items-->
            <template v-else>
              <div
                class="products-grid"
                :ref="el => { if (el) gridRefs[category.categoryId] = el }"
              >
                <div
                  v-for="(p, i) in category.products"
                  :key="p.productId"
                  class="product-card"
                  :style="{ '--delay': `${i * 0.06}s` }"
                >
                  <!-- Image -->
                  <div class="card-image-wrap">
                    <img :src="resolveImage(p.imageUrls?.[0])" :alt="p.name" class="card-image" />
                    <div class="card-image-overlay"></div>
                    <div v-if="!p.disponible" class="badge badge--unavailable">Épuisé</div>
                    <button v-if="p.disponible" class="quick-add" @click.stop="addToCart(p)" aria-label="Ajouter au panier">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="quick-add-icon">
                        <path d="M2.25 3.75a.75.75 0 000 1.5H4.5l2.652 9.28A3 3 0 0010.057 16.5h6.693a3 3 0 002.88-2.115l1.533-5.11A.75.75 0 0021.45 8H7.302l-.6-2.1A1.5 1.5 0 005.262 4.5H2.25zM9.75 20.25a1.5 1.5 0 11-3.001 0 1.5 1.5 0 013.001 0zm9 0a1.5 1.5 0 11-3.001 0 1.5 1.5 0 013.001 0z"/>
                      </svg>
                      Ajouter
                    </button>
                  </div>
                  <!-- Card body -->
                  <div class="card-body">
                    <h3 class="card-name">{{ p.name }}</h3>
                    <p v-if="p.description" class="card-desc">{{ p.description }}</p>
                    <div class="card-footer">
                      <span class="card-price">{{ formatPrice(p.price) }}</span>
                      <button class="details-btn" @click="goToDetails(p)">
                        Voir
                        <svg class="details-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                          <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/>
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </template>
          </div>

          <!-- Empty state -->
          <div v-if="categoriesWithProducts.length === 0" class="empty-state">
            <div class="empty-icon">🔍</div>
            <p class="empty-title">Aucun produit trouvé</p>
            <p class="empty-sub">Essayez d'autres mots-clés</p>
          </div>
        </div>

      </div>
    </section>

    <!-- Details Modal -->
    <div v-if="detailsProduct" class="modal-backdrop" @click.self="closeDetails">
      <div class="modal-card animate-modal">
        <div class="modal-image-col">
          <img :src="resolveImage(detailsProduct.imageUrls?.[0])" :alt="detailsProduct.name" class="modal-image" />
          <div class="modal-cat-badge">
            {{ detailsProduct.category?.name || categoryNameById(detailsProduct.categoryId) || '—' }}
          </div>
        </div>
        <div class="modal-body">
          <button class="modal-close" @click="closeDetails" aria-label="Fermer">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="h-5 w-5">
              <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
            </svg>
          </button>
          <h3 class="modal-title">{{ detailsProduct.name }}</h3>
          <p class="modal-desc">{{ detailsProduct.description }}</p>
          <span class="modal-price">{{ formatPrice(detailsProduct.price) }}</span>
          <div class="modal-actions">
            <button
              @click="addToCart(detailsProduct)"
              :disabled="!detailsProduct.disponible"
              class="modal-add-btn"
              :class="{ 'disabled': !detailsProduct.disponible }"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="h-5 w-5">
                <path d="M2.25 3.75a.75.75 0 000 1.5H4.5l2.652 9.28A3 3 0 0010.057 16.5h6.693a3 3 0 002.88-2.115l1.533-5.11A.75.75 0 0021.45 8H7.302l-.6-2.1A1.5 1.5 0 005.262 4.5H2.25zM9.75 20.25a1.5 1.5 0 11-3.001 0 1.5 1.5 0 013.001 0zm9 0a1.5 1.5 0 11-3.001 0 1.5 1.5 0 013.001 0z"/>
              </svg>
              Ajouter au panier
            </button>
            <button class="modal-close-btn" @click="closeDetails">Fermer</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Toast -->
    <transition name="toast">
      <div v-if="toastMessage" class="toast">
        <span>✓</span> {{ toastMessage }}
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useAuth } from '../../stores/auth.js'
import { api, resolveImage } from '../../utils/api.js'
import { useRoute } from 'vue-router'

const { user } = useAuth()
const route = useRoute()

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
const showHeaderTitle = ref(true)
let lastScrollY = 0
function onScroll() {
  const y = window.scrollY || 0
  showHeaderTitle.value = y < 10
  lastScrollY = y
}

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

const categoriesWithProducts = computed(() => {
  let filtered = [...products.value]
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    filtered = filtered.filter(p =>
      (p.name || '').toLowerCase().includes(q) ||
      (p.description || '').toLowerCase().includes(q)
    )
  }
  if (selectedCategory.value) {
    filtered = filtered.filter(p =>
      p.categoryId === selectedCategory.value ||
      p.category?.categoryId === selectedCategory.value
    )
  }
  const categoryMap = new Map()
  const categoriesToShow = selectedCategory.value
    ? categories.value.filter(cat => cat.categoryId === selectedCategory.value)
    : categories.value
  categoriesToShow.forEach(cat => {
    categoryMap.set(cat.categoryId, { categoryId: cat.categoryId, name: cat.name, products: [] })
  })
  filtered.forEach(product => {
    const categoryId = product.categoryId || product.category?.categoryId
    if (categoryId && categoryMap.has(categoryId)) {
      categoryMap.get(categoryId).products.push(product)
    } else if (categoryId && !selectedCategory.value) {
      categoryMap.set(categoryId, {
        categoryId,
        name: product.category?.name || categoryNameById(categoryId) || 'Autre',
        products: [product]
      })
    }
  })
  return Array.from(categoryMap.values())
    .filter(cat => cat.products.length > 0)
    .sort((a, b) => (a.name || '').localeCompare(b.name || ''))
    .map(cat => ({ ...cat, products: cat.products.sort((a, b) => (a.name || '').localeCompare(b.name || '')) }))
})

const sliderRefs = {}
function scrollSlider(categoryId, direction) {
  const track = sliderRefs[categoryId]
  if (!track) return
  const cardWidth = track.querySelector('.slider-card')?.offsetWidth || 260
  track.scrollBy({ left: direction * (cardWidth + 20) * 2, behavior: 'smooth' })
}

const gridRefs = {}
function scrollGrid(categoryId, direction) {
  const track = gridRefs[categoryId]
  if (!track) return
  const cardWidth = track.querySelector('.product-card')?.offsetWidth || 200
  track.scrollBy({ left: direction * (cardWidth + 16) * 2, behavior: 'smooth' })
}

function closeDetails() { detailsProduct.value = null }

import { useRouter } from 'vue-router'
const router = useRouter()
function goToDetails(p) {
  router.push({ path: '/produit-details', query: { id: p.productId } })
}

async function addToCart(product) {
  if (!product?.disponible) { showToast('Produit indisponible'); return }
  const token = user.value?.token
  const customerId = token ? getCustomerIdFromToken(token) : null
  if (token && customerId) {
    try {
      const res = await fetch(api(`/api/cart/${customerId}/items`), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'accept': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ productId: product.productId, quantity: 1 })
      })
      if (!res.ok) throw new Error('add to cart failed')
      showToast('Ajouté au panier !')
      window.dispatchEvent(new Event('cart-updated'))
      return
    } catch (e) { console.error(e) }
  }
  try {
    const raw = localStorage.getItem('cart')
    const cart = raw ? JSON.parse(raw) : []
    const idx = cart.findIndex(i => i.productId === product.productId)
    if (idx >= 0) { cart[idx].quantity += 1 } else {
      cart.push({ productId: product.productId, name: product.name, price: product.price, image: product.imageUrls?.[0] || '', quantity: 1 })
    }
    localStorage.setItem('cart', JSON.stringify(cart))
    showToast('Ajouté au panier !')
    window.dispatchEvent(new Event('cart-updated'))
  } catch (e) { console.error(e); showToast("Impossible d'ajouter au panier") }
}

function showToast(msg) {
  toastMessage.value = msg
  setTimeout(() => { toastMessage.value = '' }, 2000)
}

onMounted(async () => {
  await Promise.all([loadProducts(), loadCategories()])
  if (route.query.q) searchQuery.value = String(route.query.q)
  window.addEventListener('scroll', onScroll, { passive: true })
  onScroll()
})

onUnmounted(() => { window.removeEventListener('scroll', onScroll) })
</script>

<style scoped>
/* ============================================
   BASE
============================================ */
.produits-page {
  min-height: 100vh;
  background: #f8f8f6;
  font-family: 'Inter', system-ui, sans-serif;
}



/* ============================================
   CONTENT
============================================ */
.content-section {
  padding: 32px 0 64px;
}

.content-inner {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 24px;
}

/* ============================================
   SEARCH
============================================ */
.search-wrapper {
  margin-bottom: 24px;
}

.search-box {
  position: relative;
  max-width: 600px;
  margin: 0 auto;
}

.search-icon {
  position: absolute;
  left: 18px;
  top: 50%;
  transform: translateY(-50%);
  width: 20px;
  height: 20px;
  color: #9ca3af;
  pointer-events: none;
}

.search-input {
  width: 100%;
  padding: 16px 48px 16px 52px;
  border-radius: 16px;
  border: 2px solid #e5e7eb;
  background: #fff;
  font-size: 1rem;
  color: #111;
  outline: none;
  box-shadow: 0 4px 20px rgba(0,0,0,0.06);
  transition: border-color 0.2s, box-shadow 0.2s;
  box-sizing: border-box;
}

.search-input:focus {
  border-color: #dc2626;
  box-shadow: 0 0 0 4px rgba(220, 38, 38, 0.1), 0 4px 20px rgba(0,0,0,0.08);
}

.search-input::placeholder {
  color: #9ca3af;
}

.search-clear {
  position: absolute;
  right: 18px;
  top: 50%;
  transform: translateY(-50%);
  color: #9ca3af;
  cursor: pointer;
  font-size: 14px;
  line-height: 1;
  padding: 4px;
  border-radius: 50%;
  transition: color 0.2s, background 0.2s;
}

.search-clear:hover {
  color: #374151;
  background: #f3f4f6;
}

/* ============================================
   CATEGORY PILLS
============================================ */
.categories-bar {
  display: flex;
  gap: 10px;
  overflow-x: auto;
  padding-bottom: 8px;
  margin-bottom: 40px;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.categories-bar::-webkit-scrollbar { display: none; }

.cat-pill {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 10px 20px;
  border-radius: 999px;
  font-size: 0.875rem;
  font-weight: 600;
  white-space: nowrap;
  cursor: pointer;
  border: 2px solid #e5e7eb;
  background: #fff;
  color: #374151;
  transition: all 0.2s ease;
  box-shadow: 0 1px 4px rgba(0,0,0,0.06);
}

.cat-pill:hover {
  border-color: #dc2626;
  color: #dc2626;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(220,38,38,0.15);
}

.cat-pill--active {
  background: linear-gradient(135deg, #dc2626, #b91c1c);
  border-color: transparent;
  color: #fff;
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(220,38,38,0.35);
}

.cat-pill--active:hover {
  color: #fff;
  border-color: transparent;
  box-shadow: 0 8px 24px rgba(220,38,38,0.4);
}

.cat-icon { font-size: 1rem; }

/* ============================================
   LOADER
============================================ */
.loader-state {
  text-align: center;
  padding: 80px 0;
  color: #6b7280;
  font-weight: 500;
}

.spinner {
  width: 48px;
  height: 48px;
  border: 4px solid #f3f4f6;
  border-top-color: #dc2626;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin: 0 auto 16px;
}

@keyframes spin { to { transform: rotate(360deg); } }

/* ============================================
   CATEGORY BLOCKS
============================================ */
.categories-list {
  display: flex;
  flex-direction: column;
  gap: 56px;
}

.category-block {
  animation: fadeInUp 0.5s ease-out both;
}

.cat-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
}

.cat-line {
  flex: 1;
  height: 2px;
  background: linear-gradient(to right, #dc2626, #fca5a5, transparent);
  border-radius: 999px;
}

.cat-name {
  font-size: clamp(1.4rem, 3vw, 2rem);
  font-weight: 800;
  color: #111;
  letter-spacing: -0.02em;
  white-space: nowrap;
  margin: 0;
}

.cat-count {
  background: #fef2f2;
  color: #dc2626;
  font-size: 0.78rem;
  font-weight: 700;
  padding: 4px 12px;
  border-radius: 999px;
  white-space: nowrap;
  border: 1px solid #fecaca;
}

/* ============================================
   PRODUCT GRID
============================================ */
.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 20px;
}

/* ============================================
   PRODUCT CARD
============================================ */
.product-card {
  background: #fff;
  border-radius: 20px;
  overflow: hidden;
  border: 1px solid #f0f0f0;
  box-shadow: 0 2px 12px rgba(0,0,0,0.06);
  transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.3s ease, border-color 0.3s ease;
  animation: cardIn 0.5s ease-out var(--delay, 0s) both;
  cursor: pointer;
  position: relative;
}

.product-card:hover {
  transform: translateY(-6px) scale(1.01);
  box-shadow: 0 20px 50px rgba(0,0,0,0.12);
  border-color: rgba(220,38,38,0.2);
}

/* Image container */
.card-image-wrap {
  position: relative;
  aspect-ratio: 4 / 3;
  overflow: hidden;
  background: linear-gradient(135deg, #f3f4f6, #e5e7eb);
}

.card-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
  display: block;
}

.product-card:hover .card-image {
  transform: scale(1.08);
}

.card-image-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0) 50%);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.product-card:hover .card-image-overlay {
  opacity: 1;
}

/* Badge */
.badge {
  position: absolute;
  top: 12px;
  right: 12px;
  font-size: 0.7rem;
  font-weight: 700;
  padding: 4px 10px;
  border-radius: 999px;
  letter-spacing: 0.03em;
}

.badge--unavailable {
  background: #dc2626;
  color: #fff;
}

/* Quick add button */
.quick-add {
  position: absolute;
  bottom: 12px;
  left: 50%;
  transform: translateX(-50%) translateY(60px);
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: rgba(255,255,255,0.95);
  color: #dc2626;
  font-size: 0.8rem;
  font-weight: 700;
  padding: 8px 18px;
  border-radius: 999px;
  border: none;
  cursor: pointer;
  box-shadow: 0 4px 20px rgba(0,0,0,0.2);
  transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), background 0.2s, color 0.2s;
  white-space: nowrap;
  backdrop-filter: blur(8px);
  opacity: 0;
}

.product-card:hover .quick-add {
  transform: translateX(-50%) translateY(0);
  opacity: 1;
}

.quick-add:hover {
  background: #dc2626;
  color: #fff;
}

.quick-add-icon {
  width: 16px;
  height: 16px;
}

/* Card body */
.card-body {
  padding: 16px;
}

.card-name {
  font-size: 1rem;
  font-weight: 700;
  color: #111;
  margin: 0 0 6px;
  line-height: 1.3;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-desc {
  font-size: 0.8rem;
  color: #6b7280;
  margin: 0 0 12px;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  min-height: 2.4rem;
}

.card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid #f3f4f6;
}

.card-price {
  font-size: 1.1rem;
  font-weight: 800;
  color: #dc2626;
  letter-spacing: -0.02em;
}

.details-btn {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 0.8rem;
  font-weight: 600;
  color: #374151;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 6px 12px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.details-btn:hover {
  background: #fef2f2;
  border-color: #fecaca;
  color: #dc2626;
}

.details-arrow {
  width: 14px;
  height: 14px;
  transition: transform 0.2s;
}

.details-btn:hover .details-arrow {
  transform: translateX(3px);
}

/* ============================================
   EMPTY STATE
============================================ */
.empty-state {
  text-align: center;
  padding: 80px 20px;
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 16px;
}

.empty-title {
  font-size: 1.3rem;
  font-weight: 700;
  color: #374151;
  margin: 0 0 8px;
}

.empty-sub {
  font-size: 0.9rem;
  color: #9ca3af;
  margin: 0;
}

/* ============================================
   MODAL
============================================ */
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.65);
  backdrop-filter: blur(6px);
  z-index: 50;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
}

.modal-card {
  background: #fff;
  border-radius: 24px;
  width: 100%;
  max-width: 860px;
  overflow: hidden;
  box-shadow: 0 30px 80px rgba(0,0,0,0.3);
  display: grid;
  grid-template-columns: 1fr 1fr;
}

@media (max-width: 640px) {
  .modal-card { grid-template-columns: 1fr; }
}

.modal-image-col {
  position: relative;
  background: #f3f4f6;
  min-height: 300px;
}

.modal-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.modal-cat-badge {
  position: absolute;
  top: 12px;
  left: 12px;
  background: rgba(0,0,0,0.7);
  color: #fff;
  font-size: 0.75rem;
  font-weight: 600;
  padding: 4px 12px;
  border-radius: 999px;
}

.modal-body {
  padding: 28px;
  position: relative;
  display: flex;
  flex-direction: column;
}

.modal-close {
  position: absolute;
  top: 16px;
  right: 16px;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: none;
  background: #f3f4f6;
  color: #6b7280;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.2s, color 0.2s;
}

.modal-close:hover {
  background: #fee2e2;
  color: #dc2626;
}

.modal-title {
  font-size: 1.5rem;
  font-weight: 800;
  color: #111;
  margin: 0 0 12px;
  padding-right: 40px;
  letter-spacing: -0.02em;
}

.modal-desc {
  font-size: 0.9rem;
  color: #6b7280;
  line-height: 1.6;
  flex: 1;
  margin: 0 0 20px;
}

.modal-price {
  font-size: 2rem;
  font-weight: 900;
  color: #dc2626;
  letter-spacing: -0.03em;
  display: block;
  margin-bottom: 24px;
}

.modal-actions {
  display: flex;
  gap: 12px;
}

.modal-add-btn {
  flex: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 20px;
  border-radius: 14px;
  background: linear-gradient(135deg, #dc2626, #b91c1c);
  color: #fff;
  font-weight: 700;
  font-size: 0.9rem;
  border: none;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  box-shadow: 0 4px 16px rgba(220,38,38,0.35);
}

.modal-add-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(220,38,38,0.45);
}

.modal-add-btn.disabled {
  background: #e5e7eb;
  color: #9ca3af;
  box-shadow: none;
  cursor: not-allowed;
  transform: none;
}

.modal-close-btn {
  padding: 12px 20px;
  border-radius: 14px;
  border: 2px solid #e5e7eb;
  background: transparent;
  color: #374151;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.modal-close-btn:hover {
  background: #f3f4f6;
  border-color: #d1d5db;
}

/* ============================================
   TOAST
============================================ */
.toast {
  position: fixed;
  bottom: 28px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 60;
  background: #111;
  color: #fff;
  font-size: 0.9rem;
  font-weight: 600;
  padding: 12px 24px;
  border-radius: 999px;
  box-shadow: 0 8px 30px rgba(0,0,0,0.25);
  display: flex;
  align-items: center;
  gap: 8px;
  white-space: nowrap;
}

.toast-enter-active, .toast-leave-active {
  transition: opacity 0.3s ease, transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.toast-enter-from, .toast-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(16px);
}

/* ============================================
   ANIMATIONS
============================================ */
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(24px); }
  to   { opacity: 1; transform: translateY(0); }
}

@keyframes cardIn {
  from { opacity: 0; transform: translateY(20px) scale(0.96); }
  to   { opacity: 1; transform: translateY(0) scale(1); }
}

@keyframes modal-pop {
  from { opacity: 0; transform: scale(0.92) translateY(20px); }
  to   { opacity: 1; transform: scale(1) translateY(0); }
}

.animate-modal { animation: modal-pop 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) both; }

.fade-title-enter-active, .fade-title-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}
.fade-title-enter-from, .fade-title-leave-to {
  opacity: 0;
  transform: translateY(4px);
}

/* ============================================
   RESPONSIVE
============================================ */
@media (max-width: 640px) {
  /* Grid on mobile → horizontal touch slider showing 2 items + peek of 3rd */
  .products-grid {
    display: flex !important;
    flex-direction: row;
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    -webkit-overflow-scrolling: touch;
    gap: 12px;
    padding: 12px 16px 12px;
    /* Custom thin red scrollbar as scroll indicator */
    scrollbar-width: thin;
    scrollbar-color: #dc2626 #f3f4f6;
  }

  .products-grid::-webkit-scrollbar {
    height: 4px;
  }

  .products-grid::-webkit-scrollbar-track {
    background: #f3f4f6;
    border-radius: 999px;
  }

  .products-grid::-webkit-scrollbar-thumb {
    background: #dc2626;
    border-radius: 999px;
  }

  /* 2 cards visible + peek of 3rd (~30px peek) */
  .products-grid .product-card {
    flex: 0 0 calc((100vw - 32px - 24px - 30px) / 2);
    scroll-snap-align: start;
    min-width: 0;
    animation: none !important;
  }

  /* Hide nav arrows on mobile - touch only */
  .slider-nav {
    display: none !important;
  }

  /* Slider track on mobile: same styling */
  .slider-track {
    overflow-x: auto;
    gap: 12px;
    padding: 12px 16px 12px;
    scrollbar-width: thin;
    scrollbar-color: #dc2626 #f3f4f6;
  }

  .slider-track::-webkit-scrollbar {
    height: 4px;
  }

  .slider-track::-webkit-scrollbar-track {
    background: #f3f4f6;
    border-radius: 999px;
  }

  .slider-track::-webkit-scrollbar-thumb {
    background: #dc2626;
    border-radius: 999px;
  }

  .card-body { padding: 10px; }
  .card-name { font-size: 0.82rem; }
  .card-price { font-size: 0.95rem; }
  .cat-pill { padding: 8px 14px; font-size: 0.8rem; }
  .cat-name { font-size: 1.2rem; }
  .cat-count { font-size: 0.72rem; }
}

@media (max-width: 380px) {
  .products-grid .product-card {
    flex: 0 0 calc((100vw - 32px - 24px - 30px) / 2);
  }
}

/* ============================================
   SLIDER
============================================ */
.slider-outer {
  position: relative;
  display: flex;
  align-items: center;
  gap: 0;
}

.slider-track {
  display: flex;
  gap: 20px;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
  -ms-overflow-style: none;
  padding: 12px 4px 20px;
  flex: 1;
  /* Fade edges */
  -webkit-mask-image: linear-gradient(to right, transparent 0%, black 5%, black 92%, transparent 100%);
  mask-image: linear-gradient(to right, transparent 0%, black 5%, black 92%, transparent 100%);
}

.slider-track::-webkit-scrollbar {
  display: none;
}

.slider-card {
  flex: 0 0 260px;
  scroll-snap-align: start;
  min-width: 0;
}

@media (max-width: 640px) {
  /* Slider cards on mobile: 2 visible + peek of 3rd */
  .slider-card {
    flex: 0 0 calc((100vw - 32px - 24px - 30px) / 2);
  }
}

/* Nav buttons */
.slider-nav {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: 2px solid #e5e7eb;
  background: #fff;
  box-shadow: 0 4px 16px rgba(0,0,0,0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  flex-shrink: 0;
  z-index: 2;
  transition: all 0.2s ease;
  color: #374151;
}

.slider-nav svg {
  width: 20px;
  height: 20px;
}

.slider-nav:hover {
  background: #dc2626;
  border-color: #dc2626;
  color: #fff;
  box-shadow: 0 6px 20px rgba(220,38,38,0.35);
  transform: scale(1.08);
}

.slider-nav--prev {
  margin-right: 8px;
}

.slider-nav--next {
  margin-left: 8px;
}
</style>