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
const hideForAuthPages = computed(() => route.path === '/login' || route.path === '/signup')
const showNavbar = computed(() => !hideForAuthPages.value && !isAdmin.value)
const showSidebar = computed(() => !hideForAuthPages.value && isAdmin.value)
const showFooter = computed(() => !hideForAuthPages.value && !isAdmin.value)

</script>

<template>
  <AltNavbar v-if="showNavbar" />

  <!-- Admin layout with sidebar -->
  <div v-if="showSidebar" class="md:grid md:grid-cols-[16rem_1fr] min-h-screen">
    <AdminSideBar />
    <div>
      <router-view />
    </div>
  </div>

  <!-- Default layout without sidebar -->
  <router-view v-else />
  <Footer v-if="showFooter" />
</template>

