<script setup>
</script>

<template>
  <footer class="bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
    <!-- Main Footer Content -->
    <div class="mx-auto max-w-7xl px-6 py-16">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
        
        <!-- Brand Section -->
        <div class="lg:col-span-1">
          <div class="flex items-center gap-3 mb-6">
            <img src="../assets/sushilogo.png" alt="Sushi Restaurant" class="h-12 w-12 object-contain" />
            <h3 class="text-2xl font-bold text-white">DSushi</h3>
          </div>
          <p class="text-gray-300 text-sm leading-relaxed mb-6">
            Découvrez l'art authentique de la cuisine japonaise. Chaque bouchée est une expérience culinaire exceptionnelle, préparée avec passion et les ingrédients les plus frais.
          </p>
          <div class="flex space-x-4">
            <a href="https://www.instagram.com/d.sushi_djerba/" target="_blank" class="text-gray-400 hover:text-white transition-colors duration-300">
              <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.691-4.919-4.919-.058-1.265-.069-1.645-.069-4.849 0-3.205.012-3.584.069-4.849.149-3.225 1.664-4.771 4.919-4.919 1.266-.058 1.645-.07 4.849-.07zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.791-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.209-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </a>
          </div>
        </div>

        <!-- Quick Links -->
        <div>
          <h4 class="text-lg font-semibold mb-6 text-white">Navigation</h4>
          <ul class="space-y-3">
            <li><router-link to="/produits" class="text-gray-300 hover:text-white transition-colors duration-300 text-sm">Menu</router-link></li>
            <li><router-link to="/who-we-are" class="text-gray-300 hover:text-white transition-colors duration-300 text-sm">À propos</router-link></li>
            <li><router-link to="/contact" class="text-gray-300 hover:text-white transition-colors duration-300 text-sm">Réservation</router-link></li>
            <li><router-link to="/contact" class="text-gray-300 hover:text-white transition-colors duration-300 text-sm">Livraison</router-link></li>
          </ul>
        </div>

        <!-- Contact Info -->
        <div>
          <h4 class="text-lg font-semibold mb-6 text-white">Contact</h4>
          <div class="space-y-4">
            <div class="flex items-start gap-3">
              <svg class="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
              </svg>
              <div>
                <p class="text-gray-300 text-sm">Djerba</p>
              </div>
            </div>
            <div class="flex items-center gap-3">
              <svg class="h-5 w-5 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
              </svg>
              <p class="text-gray-300 text-sm">52623310</p>
            </div>
            <div class="flex items-center gap-3">
              <svg class="h-5 w-5 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
              </svg>
              <p class="text-gray-300 text-sm">d.sushiftw@gmail.com</p>
            </div>
          </div>
        </div>

        <!-- Hours -->
        <div>
          <div class="mt-0">
            <h5 class="text-sm font-semibold mb-3 text-white">Horaires</h5>
            <div class="space-y-1 text-sm text-gray-300">
              <p>Samedi: 18h - 21h</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Bottom Bar -->
    <div class="border-t border-gray-700">
      <div class="mx-auto max-w-7xl px-6 py-6">
        <div class="flex flex-col md:flex-row justify-between items-center gap-4">
          <div class="text-sm text-gray-400">
            © 2025 DSushi. Tous droits réservés.
          </div>
          <div class="flex space-x-6 text-sm">
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<style scoped>
/* Custom scrollbar for email input if needed */
input[type="email"]::-webkit-input-placeholder {
  color: #9CA3AF;
}
input[type="email"]::-moz-placeholder {
  color: #9CA3AF;
}
input[type="email"]:-ms-input-placeholder {
  color: #9CA3AF;
}
</style>
