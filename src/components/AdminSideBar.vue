<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuth } from '../stores/auth.js'

const router = useRouter()
const route = useRoute()
const { isAuthenticated, isAdmin, userName, userEmail, logout } = useAuth()

const isOpen = ref(false)
const isDesktop = ref(false)

const handleResize = () => {
  isDesktop.value = window.innerWidth >= 768
  if (isDesktop.value) isOpen.value = true
}

onMounted(() => {
  handleResize()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})

const navItems = [
  { label: 'Dashboard', to: '/dashboard', icon: 'home' },
  { label: 'Produits', to: '/crud', icon: 'box' },
  { label: 'Catégories', to: '/categories', icon: 'tag' },
  { label: 'Ajouter produit', to: '/ajouter-produit', icon: 'plus' },
  { label: 'Orders', to: '/orders-admin', icon: 'orders' },
  { label: 'Utilisateurs', to: '/users', icon: 'users' },
  { label: 'Admins', to: '/admins', icon: 'shield' },
  { label: 'Paramètres', to: '/settings', icon: 'cog' }
]

const isActive = (to) => {
  return route.path === to || route.path.startsWith(to + '/')
}

const navigate = (to) => {
  router.push(to)
  if (!isDesktop.value) isOpen.value = false
}

const handleLogout = () => {
  logout()
  router.push('/')
  if (!isDesktop.value) isOpen.value = false
}
</script>

<template>
  <aside class="relative">
    <!-- Mobile top bar -->
    <div class="md:hidden flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-white">
      <div class="flex items-center gap-3">
        <div class="w-9 h-9 bg-red-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
          {{ userName ? userName.charAt(0).toUpperCase() : 'A' }}
        </div>
        <div>
          <p class="text-sm font-semibold text-gray-900">Panneau d'administration</p>
          <p class="text-xs text-gray-500" v-if="userEmail">{{ userEmail }}</p>
        </div>
      </div>
      <button
        type="button"
        class="inline-flex items-center justify-center rounded-md p-2 text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-black/10"
        @click="isOpen = !isOpen"
        :aria-expanded="isOpen"
        aria-controls="admin-sidebar"
      >
        <svg v-if="!isOpen" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5"/>
        </svg>
        <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
        </svg>
      </button>
    </div>

    <!-- Sidebar panel -->
    <div
      id="admin-sidebar"
      :class="[
        'fixed md:sticky inset-y-0 left-0 z-40 w-72 md:w-64 bg-white border-r border-gray-200 shadow-sm md:shadow-none transform transition-transform duration-300 ease-in-out flex flex-col md:top-0 md:h-screen',
        isOpen || isDesktop ? 'translate-x-0' : '-translate-x-full'
      ]"
    >
      <!-- Brand -->
      <div class="hidden md:flex items-center gap-3 h-16 px-4 border-b border-gray-200">
        <div class="w-10 h-10 bg-red-600 text-white rounded-full flex items-center justify-center text-sm font-bold">{{ userName ? userName.charAt(0).toUpperCase() : 'A' }}</div>
        <div>
          <p class="text-sm font-semibold text-gray-900">Admin</p>
          <p class="text-xs text-gray-500" v-if="userEmail">{{ userEmail }}</p>
        </div>
      </div>

      <!-- Nav -->
      <nav class="flex-1 overflow-y-auto no-scrollbar py-4">
        <ul class="px-2 space-y-1">
          <li v-for="item in navItems" :key="item.to">
            <button
              type="button"
              @click="navigate(item.to)"
              :class="[
                'w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                isActive(item.to)
                  ? 'bg-gray-900 text-white shadow'
                  : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
              ]"
            >
              <!-- Icons -->
              <svg v-if="item.icon === 'home'" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7m-9 2v8m-4 0h8a2 2 0 002-2v-5a2 2 0 00-2-2H5a2 2 0 00-2 2v5a2 2 0 002 2z"/></svg>
              <svg v-else-if="item.icon === 'box'" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10a2 2 0 01-2 2H6a2 2 0 01-2-2V7m10 10H8"/></svg>
              <svg v-else-if="item.icon === 'plus'" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v12m6-6H6"/></svg>
              <svg v-else-if="item.icon === 'tag'" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h4l7 7a2 2 0 11-3 3L8 10V7z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7v4"/></svg>
              <svg v-else-if="item.icon === 'orders'" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
              <svg v-else-if="item.icon === 'users'" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a4 4 0 00-5-4m-6 6H2v-2a4 4 0 014-4h6m4-8a4 4 0 11-8 0 4 4 0 018 0z"/></svg>
              <svg v-else-if="item.icon === 'shield'" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              <svg v-else-if="item.icon === 'cog'" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.983 6.75a5.25 5.25 0 105.267 5.25 5.25 5.25 0 00-5.267-5.25z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.25 12a8.25 8.25 0 11-8.267-8.25A8.25 8.25 0 0120.25 12z"/></svg>
              <span>{{ item.label }}</span>
            </button>
          </li>
        </ul>
      </nav>

      <!-- Footer actions -->
      <div class="border-t border-gray-200 p-3">
        <button
          type="button"
          @click="handleLogout"
          class="w-full inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 h-10 text-sm font-semibold text-gray-900 shadow-sm hover:border-gray-400 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-black/10 transition-all duration-200"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H7a2 2 0 01-2-2V7a2 2 0 012-2h4a2 2 0 012 2v1"/></svg>
          Se déconnecter
        </button>
      </div>
    </div>

    <!-- Scrim -->
    <div
      v-if="!isDesktop && isOpen"
      class="fixed inset-0 bg-black/30 z-30 md:hidden"
      @click="isOpen = false"
    ></div>
  </aside>
</template>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>

