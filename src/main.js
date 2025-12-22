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
import Factures from './components/userpanel/Factures.vue'

import OrdersAdmin from './components/adminpanel/OrdersAdmin.vue'
// Define routes
const routes = [
  { path: '/', component: LandingPage },
  { path: '/login', component: LoginPage },
  { path: '/signup', component: SignUpPage },
  { path: '/crud', component: CrudProduct },
  { path: '/settings', component: Settings },
  { path: '/admin-sidebar', component: AdminSideBar },
  { path: '/admins', component: Admins },
  { path: '/users', component: Users },
  { path: '/dashboard', component: Dashboard },
  { path: '/ajouter-produit', component: AjouterProduit },
  { path: '/categories', component: Categories },
  { path: '/produits', component: Produits },
  { path: '/produit-details', component: ProduitDetails },
  { path: '/contact', component: Contact },
  { path: '/passer-a-la-caisse', component: PasserALaCaisse },
  { path: '/orders', component: Orders },
  { path: '/factures', component: Factures },
  { path: '/orders-admin', component: OrdersAdmin },
  { path: '/who-we-are', component: WhoWeAre }
]

// Create router instance
const router = createRouter({
  history: createWebHashHistory(),
  routes
})

// Create and mount the app
const app = createApp(App)
app.use(router)

// Initialize authentication
const { initializeAuth } = useAuth()
initializeAuth()

app.mount('#app')
