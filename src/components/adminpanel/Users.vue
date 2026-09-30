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
                <th class="px-3 py-2">ID</th>
                <th class="px-3 py-2">Permission</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="u in visibleUsers" :key="u.userId" class="border-t">
                <td class="px-3 py-2 font-medium text-gray-900">{{ u.name }}</td>
                <td class="px-3 py-2 text-gray-700">{{ u.email }}</td>
                <td class="px-3 py-2 text-gray-500 truncate max-w-[220px]">{{ u.userId }}</td>
                <td class="px-3 py-2">
                  <label class="permission-toggle inline-flex items-center gap-2 whitespace-nowrap">
                    <input
                      type="checkbox"
                      :checked="Boolean(u.permission)"
                      :disabled="updatingUserIds.includes(u.userId)"
                      class="permission-toggle-input"
                      :aria-label="`Permission pour ${u.name}`"
                      @change="updatePermission(u, $event.target.checked)"
                    />
                    <span class="permission-toggle-track" aria-hidden="true"></span>
                    <span class="text-xs text-gray-600">
                      {{ updatingUserIds.includes(u.userId) ? 'Mise à jour...' : u.permission ? 'Activée' : 'Désactivée' }}
                    </span>
                  </label>
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
import { ref, computed, onMounted } from 'vue'
import { useAuth } from '../../stores/auth.js'
import { api } from '../../utils/api.js'

const { user } = useAuth()


const users = ref([])
const isLoading = ref(false)
const errorMessage = ref('')
const updatingUserIds = ref([])

const currentUserId = computed(() => {
  if (user.value?.userId || user.value?.id) return String(user.value.userId || user.value.id)
  try {
    const encodedPayload = user.value?.token?.split('.')[1]
    if (!encodedPayload) return ''
    const normalizedPayload = encodedPayload.replace(/-/g, '+').replace(/_/g, '/')
    const payload = JSON.parse(atob(normalizedPayload))
    const id = payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'] || payload.sub || payload.userId
    return id ? String(id) : ''
  } catch {
    return ''
  }
})

const visibleUsers = computed(() => users.value.filter((listedUser) => {
  if (currentUserId.value && String(listedUser.userId).toLowerCase() === currentUserId.value.toLowerCase()) return false
  const currentEmail = user.value?.email?.trim().toLowerCase()
  return !currentEmail || listedUser.email?.trim().toLowerCase() !== currentEmail
}))

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

const updatePermission = async (targetUser, permission) => {
  if (updatingUserIds.value.includes(targetUser.userId)) return

  errorMessage.value = ''
  updatingUserIds.value.push(targetUser.userId)
  try {
    const res = await fetch(api(`/api/Users/${targetUser.userId}/permission`), {
      method: 'PUT',
      headers: {
        'accept': '*/*',
        'Content-Type': 'application/json',
        'Authorization': user.value?.token ? `Bearer ${user.value.token}` : ''
      },
      body: JSON.stringify({ permission })
    })
    if (!res.ok) throw new Error('update permission failed')

    const data = await res.json()
    targetUser.permission = data.permission
  } catch (e) {
    console.error(e)
    errorMessage.value = 'Impossible de modifier la permission.'
  } finally {
    updatingUserIds.value = updatingUserIds.value.filter(id => id !== targetUser.userId)
  }
}

onMounted(loadUsers)
</script>

<style scoped>
.permission-toggle {
  cursor: pointer;
}

.permission-toggle-input {
  position: absolute;
  width: 1px;
  height: 1px;
  opacity: 0;
}

.permission-toggle-track {
  position: relative;
  width: 42px;
  height: 24px;
  flex: 0 0 auto;
  border-radius: 999px;
  background: #d1d5db;
  transition: background-color 0.2s ease;
}

.permission-toggle-track::before {
  position: absolute;
  top: 3px;
  left: 3px;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: #fff;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
  content: '';
  transition: transform 0.2s ease;
}

.permission-toggle-input:checked + .permission-toggle-track {
  background: #dc2626;
}

.permission-toggle-input:checked + .permission-toggle-track::before {
  transform: translateX(18px);
}

.permission-toggle-input:focus-visible + .permission-toggle-track {
  outline: 2px solid #dc2626;
  outline-offset: 2px;
}

.permission-toggle-input:disabled + .permission-toggle-track {
  cursor: wait;
  opacity: 0.6;
}
</style>
  