<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 p-4 sm:p-6 lg:p-8">
    <div class="max-w-6xl mx-auto">
      <h1 class="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">Gestion des produits</h1>

      <!-- Form Card -->
      <div class="bg-white rounded-2xl shadow-xl border border-gray-100 p-5 sm:p-6 mb-8">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-semibold text-gray-900">{{ isEditing ? 'Modifier le produit' : 'Ajouter un produit' }}</h2>
          <button v-if="isEditing" @click="resetForm" class="text-sm text-gray-600 hover:text-gray-900 underline">Annuler la modification</button>
        </div>

        <form @submit.prevent="handleSubmit" class="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Nom</label>
            <input v-model="form.name" type="text" required class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent" placeholder="Nom du produit" />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Prix</label>
            <input v-model.number="form.price" type="number" min="0" step="0.01" required class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent" placeholder="0.00" />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Stock</label>
            <input v-model.number="form.stock" type="number" min="0" required class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent" placeholder="0" />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Catégorie</label>
            <select v-model="form.categoryId" required class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white">
              <option value="" disabled>Choisir une catégorie</option>
              <option v-for="c in categories" :key="c.categoryId" :value="c.categoryId">{{ c.name }}</option>
            </select>
            <p class="mt-1 text-xs text-gray-500" v-if="categories.length === 0">Aucune catégorie trouvée.</p>
          </div>

          <div class="md:col-span-2">
            <label class="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea v-model="form.description" rows="3" class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent" placeholder="Description du produit"></textarea>
          </div>

          <div class="md:col-span-2">
            <label class="block text-sm font-medium text-gray-700 mb-2">Images</label>
            <input type="file" accept="image/*" multiple @change="onFilesChange" class="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-gray-900 file:text-white hover:file:bg-black/90" />
            <p class="mt-1 text-xs text-gray-500">Vous pouvez sélectionner plusieurs images.</p>

            <!-- Previews -->
            <div class="mt-3 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
              <template v-if="previewUrls.length > 0">
                <div v-for="(src, i) in previewUrls" :key="'new-'+i" class="relative aspect-square rounded-lg overflow-hidden border border-gray-200 bg-gray-50">
                  <img :src="src" alt="preview" class="w-full h-full object-cover" />
                  <button type="button" @click="removeSelectedImage(i)" class="absolute top-1 right-1 inline-flex items-center justify-center h-7 w-7 rounded-md bg-white/90 hover:bg-white text-gray-700 hover:text-red-600 border border-gray-200 shadow-sm" aria-label="Supprimer cette image">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="h-4 w-4">
                      <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                    </svg>
                  </button>
                </div>
              </template>
              <template v-else-if="isEditing && editingExistingImages.length">
                <div v-for="(src, i) in editingExistingImages" :key="'old-'+i" class="relative aspect-square rounded-lg overflow-hidden border border-gray-200 bg-gray-50">
                  <img :src="resolveImage(src)" alt="image" class="w-full h-full object-cover" @error="onImgError" />
                </div>
              </template>
            </div>
          </div>

          <div class="md:col-span-2 flex items-center gap-3 pt-2">
            <button type="submit" :disabled="isSubmitting" class="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-red-600 to-red-700 text-white px-5 h-11 text-sm font-semibold shadow-sm hover:from-red-700 hover:to-red-800 focus:outline-none focus:ring-2 focus:ring-red-500/30 disabled:opacity-50 disabled:cursor-not-allowed">
              <svg v-if="isSubmitting" class="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
              <span>{{ isEditing ? 'Enregistrer les modifications' : 'Ajouter le produit' }}</span>
            </button>
            <button type="button" @click="resetForm" class="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-5 h-11 text-sm font-semibold text-gray-900 shadow-sm hover:border-gray-400 hover:bg-gray-50">Réinitialiser</button>
          </div>
        </form>

        <div v-if="feedback" :class="['mt-4 px-4 py-3 rounded-xl text-sm', feedback.type === 'error' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700']">{{ feedback.message }}</div>
      </div>

      <!-- Table Card -->
      <div class="bg-white rounded-2xl shadow-xl border border-gray-100 p-5 sm:p-6">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-semibold text-gray-900">Produits</h2>
          <button @click="loadProducts" class="text-sm text-gray-700 hover:text-gray-900 underline">Rafraîchir</button>
        </div>
        <div class="overflow-x-auto">
          <table class="min-w-full text-left text-sm">
            <thead class="bg-gray-50 text-gray-700">
              <tr>
                <th class="px-3 py-2">Nom</th>
                <th class="px-3 py-2">Prix</th>
                <th class="px-3 py-2">Stock</th>
                <th class="px-3 py-2">Catégorie</th>
                <th class="px-3 py-2">Disponibilité</th>
                <th class="px-3 py-2">Image</th>
                <th class="px-3 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="p in products" :key="p.productId" class="border-t">
                <td class="px-3 py-2 font-medium text-gray-900">{{ p.name }}</td>
                <td class="px-3 py-2">{{ formatPrice(p.price) }}</td>
                <td class="px-3 py-2">{{ p.stock }}</td>
                <td class="px-3 py-2">{{ p.category?.name || p.categoryId }}</td>
                <td class="px-3 py-2">
                  <button
                    @click="confirmToggleDisponible(p)"
                    :disabled="togglingProductId === p.productId"
                    :class="[
                      'relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2',
                      p.disponible !== false ? 'bg-green-500' : 'bg-gray-300',
                      togglingProductId === p.productId ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                    ]"
                  >
                    <span
                      :class="[
                        'inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200',
                        p.disponible !== false ? 'translate-x-6' : 'translate-x-1'
                      ]"
                    ></span>
                  </button>
                </td>
                <td class="px-3 py-2">
                  <div class="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
                    <img :src="resolveImage(p.imageUrls?.[0])" alt="img" class="w-full h-full object-cover" @error="onImgError" />
                  </div>
                </td>
                <td class="px-3 py-2">
                  <div class="flex gap-2">
                    <button @click="startEdit(p)" class="inline-flex items-center gap-1 rounded-lg border border-gray-300 bg-white px-3 h-9 text-xs font-semibold text-gray-900 shadow-sm hover:border-gray-400 hover:bg-gray-50">Modifier</button>
                    <button @click="confirmDelete(p)" class="inline-flex items-center gap-1 rounded-lg bg-red-600 text-white px-3 h-9 text-xs font-semibold shadow-sm hover:bg-red-700">Supprimer</button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Disponible Toggle Confirmation Modal -->
      <div v-if="showDisponibleModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-black/50 backdrop-blur-sm animate-modal-backdrop" @click="closeDisponibleModal"></div>
        <div class="relative bg-white rounded-2xl shadow-2xl max-w-md w-full mx-auto animate-modal-slide">
          <div class="p-6">
            <div class="flex items-center justify-center w-12 h-12 mx-auto mb-4 rounded-full bg-blue-100">
              <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 class="text-lg font-semibold text-gray-900 text-center mb-2">
              {{ productToToggle && productToToggle.disponible !== false ? 'Désactiver le produit ?' : 'Activer le produit ?' }}
            </h3>
            <p class="text-sm text-gray-600 text-center mb-6">
              Êtes-vous sûr de vouloir {{ productToToggle && productToToggle.disponible !== false ? 'désactiver' : 'activer' }} le produit <strong>"{{ productToToggle?.name }}"</strong> ?
            </p>
            <div class="flex items-center gap-3">
              <button
                @click="closeDisponibleModal"
                class="flex-1 px-4 h-10 rounded-xl border border-gray-300 bg-white text-gray-700 text-sm font-semibold hover:bg-gray-50 transition-colors"
              >
                Annuler
              </button>
              <button
                @click="toggleDisponible"
                :disabled="isTogglingDisponible"
                class="flex-1 px-4 h-10 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 text-white text-sm font-semibold shadow-sm hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <span v-if="isTogglingDisponible" class="inline-flex items-center gap-2">
                  <svg class="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
                  En cours...
                </span>
                <span v-else>Confirmer</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  </template>
  
  <script setup>
import { ref, reactive, onMounted } from 'vue'
import { useAuth } from '../../stores/auth.js'
import { api, resolveImage } from '../../utils/api.js'

const { user } = useAuth()


const CURRENCY = (import.meta?.env?.VITE_CURRENCY || 'TND').toUpperCase()
const LOCALE = import.meta?.env?.VITE_LOCALE || 'fr-TN'
const formatPrice = (num) => {
  const value = Number(num)
  if (Number.isNaN(value)) return '—'
  try { return new Intl.NumberFormat(LOCALE, { style: 'currency', currency: CURRENCY, minimumFractionDigits: 2 }).format(value) } catch { return `${value.toFixed(2)} ${CURRENCY}` }
}

const products = ref([])
const categories = ref([])
const isSubmitting = ref(false)
const isEditing = ref(false)
const editingId = ref(null)
const feedback = ref('')
const files = ref([])
const previewUrls = ref([])
const editingExistingImages = ref([])
const showDisponibleModal = ref(false)
const productToToggle = ref(null)
const isTogglingDisponible = ref(false)
const togglingProductId = ref(null)

const form = reactive({
  name: '',
  description: '',
  price: 0,
  stock: 0,
  categoryId: ''
})

const resetForm = () => {
  form.name = ''
  form.description = ''
  form.price = 0
  form.stock = 0
  form.categoryId = ''
  files.value = []
  for (const url of previewUrls.value) URL.revokeObjectURL(url)
  previewUrls.value = []
  isEditing.value = false
  editingId.value = null
  editingExistingImages.value = []
}

const onFilesChange = (e) => {
  files.value = Array.from(e.target.files || [])
  for (const url of previewUrls.value) URL.revokeObjectURL(url)
  previewUrls.value = files.value.map(f => URL.createObjectURL(f))
}

const removeSelectedImage = (index) => {
  const urlToRevoke = previewUrls.value[index]
  if (urlToRevoke) {
    try { URL.revokeObjectURL(urlToRevoke) } catch {}
  }
  files.value.splice(index, 1)
  previewUrls.value.splice(index, 1)
}

const loadProducts = async () => {
  try {
    const res = await fetch(api('/api/Product'), {
      headers: { 'accept': '*/*', 'Authorization': user.value?.token ? `Bearer ${user.value.token}` : '' }
    })
    if (!res.ok) throw new Error('fetch list failed')
    products.value = await res.json()
    
    // Load images for each product
    await loadProductImages()
  } catch (e) {
    console.error('[AjouterProduit] Error loading products:', e)
  }
}

// Load product images using the API endpoint
const loadProductImages = async () => {
  const token = user.value?.token ? `Bearer ${user.value.token}` : ''
  
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
        if (Array.isArray(images) && images.length > 0) {
          product.imageUrls = images.map(imgPath => {
            if (typeof imgPath === 'string') {
              let path = imgPath.trim()
              if (!path.startsWith('/')) path = `/${path}`
              path = path.replace(/\/+/g, '/')
              return path
            }
            return imgPath
          })
        } else if (!product.imageUrls || product.imageUrls.length === 0) {
          product.imageUrls = []
        }
      } else {
        console.warn(`[AjouterProduit] Failed to load images for product ${product.productId}:`, response.status)
        if (!product.imageUrls) product.imageUrls = []
      }
    } catch (error) {
      console.error(`[AjouterProduit] Error loading images for product ${product.productId}:`, error)
      if (!product.imageUrls) product.imageUrls = []
    }
  })
  
  await Promise.all(imagePromises)
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

const handleSubmit = async () => {
  feedback.value = ''
  isSubmitting.value = true
  try {
    if (!isEditing.value) {
      // Validate form
      if (!form.name || !form.name.trim()) {
        feedback.value = { type: 'error', message: 'Le nom du produit est requis.' }
        isSubmitting.value = false
        return
      }
      if (!form.categoryId) {
        feedback.value = { type: 'error', message: 'Veuillez sélectionner une catégorie.' }
        isSubmitting.value = false
        return
      }
      if (files.value.length === 0) {
        feedback.value = { type: 'error', message: 'Veuillez sélectionner au moins une image.' }
        isSubmitting.value = false
        return
      }

      const fd = new FormData()
      fd.append('name', form.name.trim())
      fd.append('description', form.description?.trim() || '')
      fd.append('price', String(form.price))
      fd.append('stock', String(form.stock))
      fd.append('categoryId', form.categoryId)
      
      // Append all image files
      for (const f of files.value) {
        fd.append('images', f)
      }

      const res = await fetch(api('/api/Product'), {
        method: 'POST',
        headers: { 
          'accept': '*/*',
          'Authorization': user.value?.token ? `Bearer ${user.value.token}` : '' 
        },
        body: fd
      })
      
      if (!res.ok) {
        const errorText = await res.text()
        console.error('[AjouterProduit] POST failed:', res.status, errorText)
        throw new Error(`Erreur ${res.status}: ${errorText || 'Échec de la création'}`)
      }
      
      const createdProduct = await res.json()
      console.log('[AjouterProduit] ✅ Product created:', createdProduct)
      feedback.value = { type: 'success', message: `Produit "${form.name}" ajouté avec succès.` }
      
      // Reload products to show the new one
      await loadProducts()
      resetForm()
    } else {
      // Update existing product
      const body = {
        productId: editingId.value,
        name: form.name.trim(),
        description: form.description?.trim() || '',
        price: form.price,
        stock: form.stock,
        categoryId: form.categoryId,
        category: null,
        imageUrls: []
      }
      const res = await fetch(api(`/api/Product/${editingId.value}`), {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'accept': '*/*',
          'Authorization': user.value?.token ? `Bearer ${user.value.token}` : '' 
        },
        body: JSON.stringify(body)
      })
      if (!res.ok) {
        const errorText = await res.text()
        console.error('[AjouterProduit] PUT failed:', res.status, errorText)
        throw new Error(`Erreur ${res.status}: ${errorText || 'Échec de la modification'}`)
      }
      feedback.value = { type: 'success', message: `Produit "${form.name}" modifié avec succès.` }
      await loadProducts()
      resetForm()
    }
  } catch (e) {
    console.error('[AjouterProduit] Submit error:', e)
    feedback.value = { 
      type: 'error', 
      message: e.message || 'Une erreur est survenue lors de l\'enregistrement.' 
    }
  } finally {
    isSubmitting.value = false
  }
}

const startEdit = (p) => {
  isEditing.value = true
  editingId.value = p.productId
  form.name = p.name || ''
  form.description = p.description || ''
  form.price = p.price || 0
  form.stock = p.stock || 0
  form.categoryId = p.categoryId || p.category?.categoryId || ''
  files.value = []
  for (const url of previewUrls.value) URL.revokeObjectURL(url)
  previewUrls.value = []
  editingExistingImages.value = Array.isArray(p.imageUrls) ? p.imageUrls : []
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const confirmDelete = async (p) => {
  if (!confirm(`Supprimer "${p.name}" ?`)) return
  try {
    const res = await fetch(api(`/api/Product/${p.productId}`), {
      method: 'DELETE',
      headers: { 'Authorization': user.value?.token ? `Bearer ${user.value.token}` : '' }
    })
    if (!res.ok) throw new Error('delete failed')
    await loadProducts()
  } catch (e) {
    console.error(e)
    feedback.value = { type: 'error', message: 'Suppression impossible.' }
  }
}

const confirmToggleDisponible = (p) => {
  productToToggle.value = p
  showDisponibleModal.value = true
}

const closeDisponibleModal = () => {
  showDisponibleModal.value = false
  productToToggle.value = null
}

const toggleDisponible = async () => {
  if (!productToToggle.value) return
  
  isTogglingDisponible.value = true
  togglingProductId.value = productToToggle.value.productId
  
  try {
    const res = await fetch(api(`/api/Product/${productToToggle.value.productId}/disponible`), {
      method: 'PUT',
      headers: {
        'accept': 'application/json',
        'Authorization': user.value?.token ? `Bearer ${user.value.token}` : ''
      }
    })
    
    if (!res.ok) {
      const errorText = await res.text()
      console.error('[AjouterProduit] Toggle disponible failed:', res.status, errorText)
      throw new Error(`Erreur ${res.status}: ${errorText || 'Échec de la modification'}`)
    }
    
    const result = await res.json()
    console.log('[AjouterProduit] ✅ Toggle disponible success:', result)
    
    // Update the product in the local array
    const productIndex = products.value.findIndex(p => p.productId === productToToggle.value.productId)
    if (productIndex !== -1) {
      products.value[productIndex].disponible = result.disponible
    }
    
    feedback.value = {
      type: 'success',
      message: `Produit "${productToToggle.value.name}" ${result.disponible ? 'activé' : 'désactivé'} avec succès.`
    }
    
    closeDisponibleModal()
  } catch (e) {
    console.error('[AjouterProduit] Toggle disponible error:', e)
    feedback.value = {
      type: 'error',
      message: e.message || 'Impossible de modifier la disponibilité du produit.'
    }
  } finally {
    isTogglingDisponible.value = false
    togglingProductId.value = null
  }
}

onMounted(loadProducts)
onMounted(loadCategories)

  </script>
  
  <style scoped>
/* Subtle reveal animation for the form card */
@keyframes card-pop { 0% { opacity: 0; transform: translateY(8px) scale(.98) } 100% { opacity: 1; transform: translateY(0) scale(1) } }
.animate-card { animation: card-pop .25s ease-out both }

/* Modal animations */
@keyframes modal-backdrop {
  0% { opacity: 0; }
  100% { opacity: 1; }
}
.animate-modal-backdrop {
  animation: modal-backdrop 0.2s ease-out;
}

@keyframes modal-slide {
  0% { opacity: 0; transform: translateY(-20px) scale(0.95); }
  100% { opacity: 1; transform: translateY(0) scale(1); }
}
.animate-modal-slide {
  animation: modal-slide 0.3s cubic-bezier(0.21, 1.02, 0.73, 1);
}
  </style>
  