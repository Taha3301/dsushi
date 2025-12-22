<template>
  <div class="relative min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
    <!-- Background wallpaper -->
    <div class="absolute inset-0 -z-10">
      <div
        class="w-full h-full bg-center bg-cover"
        :style="{ backgroundImage: `url(${contactBg})` }"
      ></div>
      <!-- Light overlay for readability -->
      <div class="absolute inset-0 bg-white/70"></div>
    </div>
    <section class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
        <!-- Left: Intro and Info -->
        <div class="space-y-6">
          <h1 class="text-4xl font-extrabold tracking-tight text-gray-900">Contactez-nous</h1>
          <p class="text-gray-600">Une question, une demande spéciale, ou un avis à partager ? Écrivez-nous et nous vous répondrons rapidement.</p>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div class="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
              <div class="text-sm text-gray-500">Téléphone</div>
              <div class="mt-1 font-semibold text-gray-900">52623310</div>
            </div>
            <div class="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
              <div class="text-sm text-gray-500">Email</div>
              <div class="mt-1 font-semibold text-gray-900">d.sushiftw@gmail.com</div>
            </div>
            <div class="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm sm:col-span-2">
              <div class="text-sm text-gray-500">Adresse</div>
              <div class="mt-1 font-semibold text-gray-900">Djerba</div>
            </div>
          </div>
        </div>

        <!-- Right: Form -->
        <div class="bg-white rounded-2xl border border-gray-100 p-6 shadow-xl">
          <form @submit.prevent="submit" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Nom</label>
              <input v-model.trim="form.name" type="text" required class="w-full px-4 h-11 rounded-xl border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent" />
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input v-model.trim="form.email" type="email" required class="w-full px-4 h-11 rounded-xl border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent" />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
                <input v-model.trim="form.phone" type="tel" class="w-full px-4 h-11 rounded-xl border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent" />
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Sujet</label>
              <input v-model.trim="form.subject" type="text" required class="w-full px-4 h-11 rounded-xl border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Message</label>
              <textarea v-model.trim="form.message" rows="5" required class="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"></textarea>
            </div>
            <div class="pt-2">
              <button 
                type="submit" 
                :disabled="isLoading"
                class="w-full inline-flex items-center justify-center gap-2 h-11 px-6 rounded-xl bg-gradient-to-r from-red-600 to-red-700 text-white text-sm font-semibold shadow hover:from-red-700 hover:to-red-800 transition disabled:opacity-70 disabled:cursor-not-allowed"
              >
                <svg v-if="isLoading" class="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                </svg>
                <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
                </svg>
                {{ isLoading ? 'Envoi en cours...' : 'Envoyer' }}
              </button>
            </div>
            <div v-if="feedback" :class="['mt-2 text-sm px-3 py-2 rounded-xl', feedback.type==='error' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700']">{{ feedback.message }}</div>
          </form>
        </div>
      </div>
    </section>
  </div>
  
</template>

<script setup>
import { reactive, ref } from 'vue'
import contactBg from '../assets/contact.jpg'
import { api } from '../utils/api.js'

const form = reactive({ name: '', email: '', phone: '', subject: '', message: '' })
const feedback = ref('')

const isLoading = ref(false)

async function submit() {
  if (isLoading.value) return
  
  isLoading.value = true
  feedback.value = ''
  
  try {
    // Validate required fields
    if (!form.name.trim() || !form.email.trim() || !form.subject.trim() || !form.message.trim()) {
      throw new Error('Veuillez remplir tous les champs obligatoires.')
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(form.email)) {
      throw new Error('Veuillez entrer une adresse email valide.')
    }
    
    // Prepare email data
    const emailData = {
      to_email: 'd.sushiftw@gmail.com',
      from_name: form.name.trim(),
      from_email: form.email.trim(),
      phone: form.phone.trim() || 'Non renseigné',
      subject: form.subject.trim(),
      message: form.message.trim(),
      timestamp: new Date().toLocaleString('fr-FR')
    }
    
    // Send email using our backend service via centralized API utility
    await sendEmail(emailData)
    
    feedback.value = { type: 'success', message: 'Message envoyé avec succès ! Nous vous répondrons rapidement.' }
    
    // Reset form
    form.name = ''
    form.email = ''
    form.phone = ''
    form.subject = ''
    form.message = ''
    
  } catch (error) {
    console.error('Error sending email:', error)
    feedback.value = { 
      type: 'error', 
      message: error.message || 'Une erreur est survenue lors de l\'envoi. Réessayez.' 
    }
  } finally {
    isLoading.value = false
  }
}

async function sendEmail(emailData) {
  // Use centralized API utility for the email endpoint
  const url = api('/api/send-contact-email')
  
  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 10000)
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(emailData),
      signal: controller.signal
    })
    
    clearTimeout(timeoutId)
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.error || `Erreur HTTP: ${response.status}`)
    }
    
    const result = await response.json()
    console.log('Email sent successfully:', result)
    
  } catch (error) {
    console.error(`Failed to send email to ${url}:`, error)
    
    if (error.name === 'AbortError') throw new Error('Délai d\'attente dépassé (10s).')
    throw error
  }
}
</script>

<style scoped>
@keyframes fadeUp { 0% { opacity: 0; transform: translateY(6px) } 100% { opacity: 1; transform: translateY(0) } }
.animate-up { animation: fadeUp .35s ease-out both }
</style>
