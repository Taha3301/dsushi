<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 p-4 sm:p-6 lg:p-8">
    <div class="max-w-4xl mx-auto">
      <h1 class="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">Catégories</h1>

      <!-- Form -->
      <div class="bg-white rounded-2xl shadow-xl border border-gray-100 p-5 sm:p-6 mb-8">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-semibold text-gray-900">{{ isEditing ? 'Modifier la catégorie' : 'Ajouter une catégorie' }}</h2>
          <button v-if="isEditing" @click="resetForm" class="text-sm text-gray-600 hover:text-gray-900 underline">Annuler</button>
        </div>
        <form @submit.prevent="handleSubmit" class="grid grid-cols-1 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Nom</label>
            <input v-model="name" type="text" required class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent" placeholder="Nom de la catégorie" />
          </div>
          <div class="flex items-center gap-3">
            <button type="submit" :disabled="isSubmitting" class="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-red-600 to-red-700 text-white px-5 h-11 text-sm font-semibold shadow-sm hover:from-red-700 hover:to-red-800 focus:outline-none focus:ring-2 focus:ring-red-500/30 disabled:opacity-50 disabled:cursor-not-allowed">
              <svg v-if="isSubmitting" class="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
              <span>{{ isEditing ? 'Enregistrer' : 'Ajouter' }}</span>
            </button>
            <button type="button" @click="resetForm" class="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-5 h-11 text-sm font-semibold text-gray-900 shadow-sm hover:border-gray-400 hover:bg-gray-50">Réinitialiser</button>
          </div>
        </form>
        <div v-if="feedback" :class="['mt-4 px-4 py-3 rounded-xl text-sm', feedback.type === 'error' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700']">{{ feedback.message }}</div>
      </div>

      <!-- Table -->
      <div class="bg-white rounded-2xl shadow-xl border border-gray-100 p-5 sm:p-6">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-semibold text-gray-900">Liste des catégories</h2>
          <button @click="loadCategories" class="text-sm text-gray-700 hover:text-gray-900 underline">Rafraîchir</button>
        </div>
        <div class="overflow-x-auto">
          <table class="min-w-full text-left text-sm">
            <thead class="bg-gray-50 text-gray-700">
              <tr>
                <th class="px-3 py-2">Nom</th>
                <th class="px-3 py-2">ID</th>
                <th class="px-3 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="c in categories" :key="c.categoryId" class="border-t">
                <td class="px-3 py-2 font-medium text-gray-900">{{ c.name }}</td>
                <td class="px-3 py-2 text-gray-500">{{ c.categoryId }}</td>
                <td class="px-3 py-2">
                  <div class="flex gap-2">
                    <button @click="startEdit(c)" class="inline-flex items-center gap-1 rounded-lg border border-gray-300 bg-white px-3 h-9 text-xs font-semibold text-gray-900 shadow-sm hover:border-gray-400 hover:bg-gray-50">Modifier</button>
                    <button @click="confirmDelete(c)" class="inline-flex items-center gap-1 rounded-lg bg-red-600 text-white px-3 h-9 text-xs font-semibold shadow-sm hover:bg-red-700">Supprimer</button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAuth } from '../../stores/auth.js'
import { api } from '../../utils/api.js'

const { user } = useAuth()


const categories = ref([])
const name = ref('')
const isSubmitting = ref(false)
const isEditing = ref(false)
const editingId = ref(null)
const feedback = ref('')

const headers = () => ({ 'accept': '*/*', 'Authorization': user.value?.token ? `Bearer ${user.value.token}` : '' })

const loadCategories = async () => {
  try {
    const res = await fetch(api('/api/Category'), { headers: headers() })
    if (!res.ok) throw new Error('fetch categories failed')
    categories.value = await res.json()
  } catch (e) {
    console.error(e)
    categories.value = []
  }
}

const resetForm = () => {
  name.value = ''
  isEditing.value = false
  editingId.value = null
}

const handleSubmit = async () => {
  feedback.value = ''
  isSubmitting.value = true
  try {
    if (!isEditing.value) {
      const body = { name: name.value }
      const res = await fetch(api('/api/Category'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...headers() },
        body: JSON.stringify(body)
      })
      if (!res.ok) throw new Error('create failed')
      feedback.value = { type: 'success', message: 'Catégorie ajoutée.' }
    } else {
      const body = { categoryId: editingId.value, name: name.value }
      const res = await fetch(api(`/api/Category/${editingId.value}`), {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...headers() },
        body: JSON.stringify(body)
      })
      if (!res.ok) throw new Error('update failed')
      feedback.value = { type: 'success', message: 'Catégorie modifiée.' }
    }
    await loadCategories()
    resetForm()
  } catch (e) {
    console.error(e)
    feedback.value = { type: 'error', message: 'Une erreur est survenue.' }
  } finally {
    isSubmitting.value = false
  }
}

const startEdit = (c) => {
  isEditing.value = true
  editingId.value = c.categoryId
  name.value = c.name
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const confirmDelete = async (c) => {
  if (!confirm(`Supprimer "${c.name}" ?`)) return
  try {
    const res = await fetch(api(`/api/Category/${c.categoryId}`), {
      method: 'DELETE',
      headers: headers()
    })
    if (!res.ok) throw new Error('delete failed')
    await loadCategories()
  } catch (e) {
    console.error(e)
    feedback.value = { type: 'error', message: 'Suppression impossible.' }
  }
}

onMounted(loadCategories)
</script>

<style scoped>
</style>
  