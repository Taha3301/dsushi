<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useAuth } from './stores/auth.js'
import AltNavbar from './components/AltNavbar.vue';
import Footer from './components/Footer.vue';
import AdminSideBar from './components/AdminSideBar.vue';

const route = useRoute()
const { isAdmin } = useAuth()

// Hide navbar and footer on login/signup. When admin is connected, hide navbar and show sidebar.
const hideForAuthPages = computed(() => route.path === '/login' || route.path === '/signup' || route.path === '/forgot-password' || route.path === '/reset-password')
const showNavbar = computed(() => !hideForAuthPages.value && !isAdmin.value)
const showSidebar = computed(() => !hideForAuthPages.value && isAdmin.value)
const showFooter = computed(() => !hideForAuthPages.value && !isAdmin.value)

</script>

<template>
  <AltNavbar v-if="showNavbar" />

  <!-- Admin layout with sidebar -->
  <div v-if="showSidebar" class="min-h-screen w-full md:grid md:grid-cols-[16rem_minmax(0,1fr)]">
    <AdminSideBar />
    <main class="min-w-0 w-full">
      <router-view />
    </main>
  </div>

  <!-- Default layout without sidebar -->
  <div v-else :class="[showNavbar ? 'pb-24 md:pb-0' : '', 'min-w-0 w-full']">
    <router-view />
  </div>
  <Footer v-if="showFooter" />
</template>

<style>
html, body {
  overflow-x: hidden;
  width: 100%;
  position: relative;
}
</style>
