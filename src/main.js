import { createApp } from 'vue'
import { createRouter, createWebHashHistory } from 'vue-router'
import './style.css'
import App from './App.vue'
import './assets/main.css'
import { useAuth } from './stores/auth.js'

// Import components
import LandingPage from './components/landingpage.vue'
import LoginPage from './components/LoginPage.vue'
import SignUpPage from './components/SignUpPage.vue'
import CrudProduct from './components/CrudProduct.vue'
import Settings from './components/Settings.vue'
import AdminSideBar from './components/AdminSideBar.vue'
import ForgotPassword from './components/ForgotPassword.vue'
import ResetPassword from './components/ResetPassword.vue'

import Admins from './components/adminpanel/Admins.vue'
import Users from './components/adminpanel/Users.vue'
import Dashboard from './components/adminpanel/Dashboard.vue'
import AjouterProduit from './components/adminpanel/AjouterProduit.vue'
import Categories from './components/adminpanel/CrudCategory.vue'
import Produits from './components/userpanel/Produits.vue'
import ProduitDetails from './components/userpanel/ProduitDetails.vue'
import Contact from './components/Contact.vue'
import WhoWeAre from './components/whoweare.vue'
import PasserALaCaisse from './components/userpanel/PasserALaCaisse.vue'

import Orders from './components/userpanel/Orders.vue'


import OrdersAdmin from './components/adminpanel/OrdersAdmin.vue'
// Define routes
const routes = [
  { path: '/', component: LandingPage },
  { path: '/login', component: LoginPage },
  { path: '/signup', component: SignUpPage },
  { path: '/crud', component: CrudProduct, meta: { requiresAdmin: true } },
  { path: '/settings', component: Settings, meta: { requiresAuth: true } },
  { path: '/admin-sidebar', component: AdminSideBar, meta: { requiresAdmin: true } },
  { path: '/admins', component: Admins, meta: { requiresAdmin: true } },
  { path: '/users', component: Users, meta: { requiresAdmin: true } },
  { path: '/dashboard', component: Dashboard, meta: { requiresAdmin: true } },
  { path: '/ajouter-produit', component: AjouterProduit, meta: { requiresAdmin: true } },
  { path: '/categories', component: Categories, meta: { requiresAdmin: true } },
  { path: '/produits', component: Produits },
  { path: '/produit-details', component: ProduitDetails },
  { path: '/contact', component: Contact },
  { path: '/passer-a-la-caisse', component: PasserALaCaisse, meta: { requiresAuth: true } },
  { path: '/orders', component: Orders, meta: { requiresAuth: true } },

  { path: '/orders-admin', component: OrdersAdmin, meta: { requiresAdmin: true } },
  { path: '/who-we-are', component: WhoWeAre },
  { path: '/forgot-password', component: ForgotPassword },
  { path: '/reset-password', component: ResetPassword }
]

// Create router instance
const router = createRouter({
  history: createWebHashHistory(),
  routes
})

// Navigation Guard
router.beforeEach((to, from, next) => {
  const { isAdmin, isAuthenticated } = useAuth()

  // Handle Admin routes
  if (to.meta.requiresAdmin) {
    if (!isAuthenticated.value) {
      next('/login')
    } else if (!isAdmin.value) {
      next('/')
    } else {
      next()
    }
  }
  // Handle Authenticated-only routes
  else if (to.meta.requiresAuth) {
    if (!isAuthenticated.value) {
      next('/login')
    } else {
      next()
    }
  }
  else {
    // Public route
    next()
  }
})

// Create and mount the app
const app = createApp(App)
app.use(router)

// Initialize authentication
const { initializeAuth } = useAuth()
initializeAuth()

app.mount('#app')
