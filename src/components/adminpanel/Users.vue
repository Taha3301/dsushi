<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 p-4 sm:p-6 lg:p-8">
    <div class="max-w-6xl mx-auto">
      <h1 class="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">Utilisateurs</h1>

      <div class="bg-white rounded-2xl shadow-xl border border-gray-100 p-5 sm:p-6">
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center gap-3">
            <button @click="loadUsers" class="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 h-10 text-xs font-semibold text-gray-900 shadow-sm hover:border-gray-400 hover:bg-gray-50">
              Rafraîchir
            </button>
            <span v-if="isLoading" class="text-xs text-gray-500">Chargement...</span>
          </div>
          <div v-if="errorMessage" class="px-3 py-2 rounded-lg bg-red-100 text-red-700 text-xs">{{ errorMessage }}</div>
        </div>

        <div class="overflow-x-auto">
          <table class="min-w-full text-left text-sm">
            <thead class="bg-gray-50 text-gray-700">
              <tr>
                <th class="px-3 py-2">Nom</th>
                <th class="px-3 py-2">Email</th>
                <th class="px-3 py-2">Vérifié</th>
                <th class="px-3 py-2">ID</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="u in users" :key="u.userId" class="border-t">
                <td class="px-3 py-2 font-medium text-gray-900">{{ u.name }}</td>
                <td class="px-3 py-2 text-gray-700">{{ u.email }}</td>
                <td class="px-3 py-2">
                  <span :class="['text-xs font-medium px-2.5 py-1 rounded-full', u.isVerified ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-800']">
                    {{ u.isVerified ? 'Oui' : 'Non' }}
                  </span>
                </td>
                <td class="px-3 py-2 text-gray-500 truncate max-w-[220px]">{{ u.userId }}</td>
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


const users = ref([])
const isLoading = ref(false)
const errorMessage = ref('')

const loadUsers = async () => {
  isLoading.value = true
  errorMessage.value = ''
  try {
    const res = await fetch(api('/api/Users'), {
      headers: { 'accept': '*/*', 'Authorization': user.value?.token ? `Bearer ${user.value.token}` : '' }
    })
    if (!res.ok) throw new Error('fetch users failed')
    users.value = await res.json()
  } catch (e) {
    console.error(e)
    errorMessage.value = 'Impossible de charger les utilisateurs.'
  } finally {
    isLoading.value = false
  }
}

onMounted(loadUsers)
</script>

<style scoped>
</style>
  