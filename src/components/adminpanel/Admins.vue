<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 p-4 sm:p-6 lg:p-8">
    <div class="max-w-xl mx-auto">
      <h1 class="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">Ajouter un administrateur</h1>

      <div class="bg-white rounded-2xl shadow-xl border border-gray-100 p-5 sm:p-6">
        <form @submit.prevent="registerAdmin" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Nom</label>
            <input v-model="form.name" type="text" required class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent" placeholder="Nom complet" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input v-model="form.email" type="email" required class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent" placeholder="email@exemple.com" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Mot de passe</label>
            <input v-model="form.password" type="password" minlength="6" required class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent" placeholder="••••••••" />
          </div>

          <div class="pt-2 flex items-center gap-3">
            <button type="submit" :disabled="isSubmitting" class="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-red-600 to-red-700 text-white px-5 h-11 text-sm font-semibold shadow-sm hover:from-red-700 hover:to-red-800 focus:outline-none focus:ring-2 focus:ring-red-500/30 disabled:opacity-50 disabled:cursor-not-allowed">
              <svg v-if="isSubmitting" class="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
              <span>Créer l'admin</span>
            </button>
            <button type="button" @click="resetForm" class="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-5 h-11 text-sm font-semibold text-gray-900 shadow-sm hover:border-gray-400 hover:bg-gray-50">Réinitialiser</button>
          </div>
        </form>

        <div v-if="feedback" :class="['mt-4 px-4 py-3 rounded-xl text-sm', feedback.type === 'error' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700']">{{ feedback.message }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useAuth } from '../../stores/auth.js'
import { api } from '../../utils/api.js'

const { user } = useAuth()


const form = reactive({ name: '', email: '', password: '' })
const isSubmitting = ref(false)
const feedback = ref('')

const resetForm = () => {
  form.name = ''
  form.email = ''
  form.password = ''
}

const registerAdmin = async () => {
  feedback.value = ''
  isSubmitting.value = true
  try {
    const res = await fetch(api('/api/Auth/register-admin'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': user.value?.token ? `Bearer ${user.value.token}` : ''
      },
      body: JSON.stringify({ name: form.name, email: form.email, password: form.password })
    })
    if (!res.ok) throw new Error('register failed')
    feedback.value = { type: 'success', message: "Administrateur créé avec succès." }
    resetForm()
  } catch (e) {
    console.error(e)
    feedback.value = { type: 'error', message: "Création impossible. Vérifiez les champs et réessayez." }
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style scoped>
</style>
  