<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { api } from '../utils/api.js'

const router = useRouter()

// Step 1 state
const email = ref('')
const step = ref(1) // 1 = email, 2 = code + new password

// Step 2 state
const code = ref('')
const newPassword = ref('')
const confirmPassword = ref('')
const showPassword = ref(false)

const isLoading = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

// Step 1: Send code
const handleSendCode = async () => {
  errorMessage.value = ''
  successMessage.value = ''
  isLoading.value = true

  try {
    const response = await fetch(api('/api/Auth/send-code'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({ email: email.value })
    })

    if (response.ok) {
      step.value = 2
      successMessage.value = 'Un code de vérification a été envoyé à votre adresse email.'
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
    console.error('Send code error:', error)
  } finally {
    isLoading.value = false
  }
}

// Step 2: Reset password
const handleResetPassword = async () => {
  errorMessage.value = ''
  successMessage.value = ''

  if (newPassword.value !== confirmPassword.value) {
    errorMessage.value = 'Les mots de passe ne correspondent pas.'
    return
  }

  if (newPassword.value.length < 6) {
    errorMessage.value = 'Le mot de passe doit contenir au moins 6 caractères.'
    return
  }

  isLoading.value = true

  try {
    const response = await fetch(api('/api/Auth/reset-password'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        email: email.value,
        code: code.value,
        newPassword: newPassword.value
      })
    })

    const data = await response.json()

    if (response.ok && data.success) {
      successMessage.value = data.message || 'Mot de passe réinitialisé avec succès.'
      errorMessage.value = ''
      setTimeout(() => {
        router.push('/login')
      }, 2000)
    } else {
      errorMessage.value = data.message || 'Erreur lors de la réinitialisation.'
    }
  } catch (error) {
    errorMessage.value = 'Erreur de connexion. Veuillez réessayer.'
    console.error('Reset password error:', error)
  } finally {
    isLoading.value = false
  }
}

const goBackToStep1 = () => {
  step.value = 1
  code.value = ''
  newPassword.value = ''
  confirmPassword.value = ''
  errorMessage.value = ''
  successMessage.value = ''
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
        <p class="text-gray-600">
          <span v-if="step === 1">Entrez votre email pour recevoir un code de vérification</span>
          <span v-else>Entrez le code reçu et votre nouveau mot de passe</span>
        </p>

        <!-- Step indicator -->
        <div class="flex items-center justify-center mt-4 gap-2">
          <div class="flex items-center gap-2">
            <div :class="['w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300', step >= 1 ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-500']">1</div>
            <div :class="['h-1 w-12 rounded transition-all duration-300', step >= 2 ? 'bg-red-600' : 'bg-gray-200']"></div>
            <div :class="['w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300', step >= 2 ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-500']">2</div>
          </div>
        </div>
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

        <!-- STEP 1: Email -->
        <form v-if="step === 1" @submit.prevent="handleSendCode" class="space-y-6">
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
            <span v-if="!isLoading">Recevoir le code</span>
            <span v-else class="flex items-center justify-center">
              <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Envoi...
            </span>
          </button>

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

        <!-- STEP 2: Code + New Password -->
        <form v-else @submit.prevent="handleResetPassword" class="space-y-5">
          <!-- Code -->
          <div>
            <label for="code" class="block text-sm font-medium text-gray-700 mb-2">
              Code de vérification
            </label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                </svg>
              </div>
              <input
                id="code"
                v-model="code"
                type="text"
                inputmode="numeric"
                maxlength="10"
                required
                class="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 tracking-widest text-center font-mono text-lg"
                placeholder="_ _ _ _ _ _"
              />
            </div>
          </div>

          <!-- New Password -->
          <div>
            <label for="newPassword" class="block text-sm font-medium text-gray-700 mb-2">
              Nouveau mot de passe
            </label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"/>
                </svg>
              </div>
              <input
                id="newPassword"
                v-model="newPassword"
                :type="showPassword ? 'text' : 'password'"
                required
                class="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
                placeholder="Nouveau mot de passe"
              />
              <button type="button" @click="showPassword = !showPassword" class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600">
                <svg v-if="!showPassword" class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                </svg>
                <svg v-else class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/>
                </svg>
              </button>
            </div>
          </div>

          <!-- Confirm Password -->
          <div>
            <label for="confirmPassword" class="block text-sm font-medium text-gray-700 mb-2">
              Confirmer le mot de passe
            </label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"/>
                </svg>
              </div>
              <input
                id="confirmPassword"
                v-model="confirmPassword"
                :type="showPassword ? 'text' : 'password'"
                required
                class="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
                placeholder="Confirmer le mot de passe"
              />
            </div>
          </div>

          <button
            type="submit"
            :disabled="isLoading"
            class="w-full py-3 px-4 rounded-xl text-white bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 font-medium transition-all duration-200 transform hover:scale-[1.02] shadow-lg disabled:opacity-50"
          >
            <span v-if="!isLoading">Réinitialiser le mot de passe</span>
            <span v-else class="flex items-center justify-center">
              <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Réinitialisation...
            </span>
          </button>

          <div class="flex items-center justify-between">
            <button
              type="button"
              @click="goBackToStep1"
              class="font-medium text-gray-500 hover:text-gray-700 transition-colors duration-200 text-sm flex items-center gap-1"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
              </svg>
              Renvoyer le code
            </button>
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
