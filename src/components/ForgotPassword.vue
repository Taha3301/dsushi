<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { api } from '../utils/api.js'

const router = useRouter()
const email = ref('')
const isLoading = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

const handleForgotPassword = async () => {
  errorMessage.value = ''
  successMessage.value = ''
  isLoading.value = true

  try {
    const response = await fetch(api('/api/Auth/send-code'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: email.value })
    })

    if (response.ok) {
      successMessage.value = 'Un lien de réinitialisation a été envoyé à votre adresse email. Veuillez vérifier votre boîte de réception.'
    } else {
      let errorText = 'Erreur lors de la demande'
      try {
        const errorData = await response.json()
        errorText = errorData.message || errorText
      } catch (jsonError) {
        errorText = response.statusText || errorText
      }
      errorMessage.value = errorText
    }
  } catch (error) {
    errorMessage.value = 'Erreur de connexion. Veuillez réessayer.'
    console.error('Forgot password error:', error)
  } finally {
    isLoading.value = false
  }
}

const navigateToLogin = () => {
  router.push('/login')
}
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative">
    <!-- Background Elements -->
    <div class="absolute inset-0 overflow-hidden">
      <div class="absolute top-20 left-20 w-32 h-32 bg-red-100 rounded-full opacity-20 animate-pulse"></div>
      <div class="absolute bottom-20 right-20 w-24 h-24 bg-gray-200 rounded-full opacity-30 animate-bounce"></div>
      <div class="absolute top-1/2 left-1/4 w-16 h-16 bg-red-200 rounded-full opacity-25 animate-ping"></div>
    </div>

    <div class="max-w-md w-full space-y-8 relative z-10">
      <!-- Header -->
      <div class="text-center">
        <h2 class="text-3xl font-bold text-gray-900 mb-2">
          Mot de passe 
          <span class="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-red-800">
            oublié ?
          </span>
        </h2>
        <p class="text-gray-600">Entrez votre email pour recevoir un lien de réinitialisation</p>
      </div>

      <!-- Form Card -->
      <div class="bg-white py-8 px-6 shadow-2xl rounded-3xl border border-gray-100">
        <!-- Messages -->
        <div v-if="errorMessage" class="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
          {{ errorMessage }}
        </div>
        <div v-if="successMessage" class="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-lg">
          {{ successMessage }}
        </div>

        <form @submit.prevent="handleForgotPassword" class="space-y-6">
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700 mb-2">
              Adresse email
            </label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"/>
                </svg>
              </div>
              <input
                id="email"
                v-model="email"
                type="email"
                name="email"
                autocomplete="username"
                required
                class="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
                placeholder="votre@email.com"
              />
            </div>
          </div>

          <button
            type="submit"
            :disabled="isLoading"
            class="w-full py-3 px-4 rounded-xl text-white bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 font-medium transition-all duration-200 transform hover:scale-[1.02] shadow-lg disabled:opacity-50"
          >
            <span v-if="!isLoading">Recevoir le lien</span>
            <span v-else class="flex items-center justify-center">
              <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Envoi...
            </span>
          </button>

          <!-- Back to Login -->
          <div class="text-center">
            <button 
              type="button"
              @click="navigateToLogin" 
              class="font-medium text-red-600 hover:text-red-500 transition-colors duration-200 text-sm"
            >
              Retour à la connexion
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}
.animate-pulse { animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite; }

@keyframes bounce {
  0%, 100% { transform: translateY(-25%); animation-timing-function: cubic-bezier(0.8, 0, 1, 1); }
  50% { transform: translateY(0); animation-timing-function: cubic-bezier(0, 0, 0.2, 1); }
}
.animate-bounce { animation: bounce 1s infinite; }

@keyframes ping {
  0% { transform: scale(1); opacity: 1; }
  75%, 100% { transform: scale(2); opacity: 0; }
}
.animate-ping { animation: ping 1s cubic-bezier(0, 0, 0.2, 1) infinite; }

input:focus {
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
.animate-spin { animation: spin 1s linear infinite; }
</style>
