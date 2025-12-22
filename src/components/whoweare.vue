<template>
  <div class="min-h-screen bg-white overflow-hidden">
    <!-- Hero Section -->
    <section class="relative h-[60vh] md:h-[80vh] flex items-center justify-center overflow-hidden">
      <div class="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1579871494447-9811cf80d66c?q=80&w=2070&auto=format&fit=crop" 
          alt="Professional Sushi Chef" 
          class="w-full h-full object-cover scale-105 animate-slow-zoom"
        />
        <div class="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-white/10"></div>
      </div>
      
      <div class="relative z-10 text-center px-4 max-w-4xl mx-auto" v-animate-on-scroll>
        <span class="inline-block px-4 py-1.5 rounded-full bg-red-600/20 backdrop-blur-md border border-red-600/30 text-red-500 text-xs font-bold tracking-widest uppercase mb-6 animate-fade-in">
          Notre Histoire
        </span>
        <h1 class="text-4xl md:text-7xl font-black text-white mb-6 tracking-tight leading-tight">
          L'Excellence du Sushi <span class="text-red-600">Fait Maison</span>
        </h1>
        <p class="text-lg md:text-xl text-gray-200 max-w-2xl mx-auto font-medium leading-relaxed">
          Oubliez les restaurants classiques. Savourez l'art du sushi artisanal, préparé avec amour et livré directement chez vous à <span class="font-bold">Djerba</span>.
        </p>
      </div>

      <!-- Decor element -->
      <div class="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent"></div>
    </section>

    <!-- Main Content -->
    <div class="max-w-7xl mx-auto px-6 py-20">
      
      <!-- Philosophy Section -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-32">
        <div class="space-y-8" v-animate-on-scroll="{ animation: 'slide-in-left' }">
          <div class="inline-flex items-center gap-3 text-red-600 font-bold tracking-wider text-sm uppercase">
            <span class="w-8 h-[2px] bg-red-600"></span>
            Notre Concept
          </div>
          <h2 class="text-3xl md:text-5xl font-extrabold text-gray-900 leading-tight">
            Le goût du <span class="italic text-red-600">vrai fait maison</span>, livré à votre porte.
          </h2>
          <div class="space-y-6 text-gray-600 text-lg leading-relaxed font-light">
            <p>
              Contrairement aux restaurants traditionnels, <span class="font-bold text-gray-900">DSushi</span> se concentre exclusivement sur la préparation artisanale et la livraison à domicile. 
            </p>
            <p>
              Chaque commande est une pièce unique, préparée avec soin dans notre cuisine dédiée. Nous avons choisi ce modèle pour garantir une fraîcheur absolue et un goût authentiquement fait maison pour chaque client à Djerba.
            </p>
          </div>
          <div class="grid grid-cols-2 gap-8 pt-6">
            <div>
              <p class="text-4xl font-black text-gray-900 mb-1">100%</p>
              <p class="text-sm font-semibold text-gray-500 uppercase tracking-wider">Fait Maison</p>
            </div>
            <div>
              <p class="text-4xl font-black text-gray-900 mb-1">Livré</p>
              <p class="text-sm font-semibold text-gray-500 uppercase tracking-wider">Directement Chez Vous</p>
            </div>
          </div>
        </div>
        
        <div class="relative group" v-animate-on-scroll="{ animation: 'slide-in-right' }">
          <div class="absolute -inset-4 bg-gradient-to-tr from-red-600/10 to-transparent rounded-3xl -z-10 group-hover:scale-105 transition-transform duration-500"></div>
          <img 
            src="https://images.unsplash.com/photo-1553621042-f6e147245754?q=80&w=1925&auto=format&fit=crop" 
            alt="Sushi presentation" 
            class="rounded-2xl shadow-2xl w-full h-[500px] object-cover"
          />
          <div class="absolute -bottom-8 -left-8 bg-white p-6 rounded-2xl shadow-xl border border-gray-100 hidden md:block animate-bounce-slow">
            <div class="flex items-center gap-4">
              <div class="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center text-white">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-6 h-6">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z" />
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 18a3.75 3.75 0 00.495-7.467 5.99 5.99 0 00-1.925 3.546 5.974 5.974 0 01-2.133-1.001A3.75 3.75 0 0012 18z" />
                </svg>
              </div>
              <p class="font-bold text-gray-900">Passion du Goût</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Features Grid -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div 
          v-for="(feature, index) in features" 
          :key="index"
          class="p-10 rounded-3xl bg-gray-50 border border-gray-100 hover:bg-white hover:shadow-2xl hover:border-red-100 transition-all duration-300 group"
          v-animate-on-scroll="{ delay: index * 100 }"
        >
          <div class="w-14 h-14 bg-white rounded-2xl flex items-center justify-center mb-8 shadow-sm group-hover:bg-red-600 group-hover:text-white transition-colors duration-300">
            <component :is="feature.icon" class="w-7 h-7" />
          </div>
          <h3 class="text-xl font-bold text-gray-900 mb-4">{{ feature.title }}</h3>
          <p class="text-gray-600 leading-relaxed font-light">
            {{ feature.description }}
          </p>
        </div>
      </div>

    </div>

    <!-- Call to Action -->
    <section class="bg-gray-900 py-24 relative overflow-hidden">
      <div class="absolute inset-0 opacity-10">
        <div class="grid grid-cols-8 gap-4 rotate-12 scale-150">
          <div v-for="i in 32" :key="i" class="h-20 bg-gray-400 rounded-lg"></div>
        </div>
      </div>
      
      <div class="relative z-10 max-w-4xl mx-auto text-center px-6">
        <h2 class="text-4xl md:text-5xl font-black text-white mb-8 leading-tight">
          Prêt pour un voyage culinaire <span class="text-red-600">inoubliable</span> ?
        </h2>
        <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
          <router-link to="/produits" class="px-8 py-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-full transition-all duration-300 shadow-lg shadow-red-600/30 w-full sm:w-auto text-center">
            Consulter la Carte
          </router-link>
          <router-link to="/contact" class="px-8 py-4 bg-transparent border-2 border-white/20 hover:border-white text-white font-bold rounded-full transition-all duration-300 w-full sm:w-auto text-center">
            Nous Contacter
          </router-link>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { defineComponent, h } from 'vue'

// Basic Icons as functional components
const IconChef = defineComponent(() => () => h('svg', { xmlns: 'http://www.w3.org/2000/svg', fill: 'none', viewBox: '0 0 24 24', strokeWidth: '2', stroke: 'currentColor' }, [h('path', { strokeLinecap: 'round', strokeLinejoin: 'round', d: 'M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z' })]))
const IconStar = defineComponent(() => () => h('svg', { xmlns: 'http://www.w3.org/2000/svg', fill: 'none', viewBox: '0 0 24 24', strokeWidth: '2', stroke: 'currentColor' }, [h('path', { strokeLinecap: 'round', strokeLinejoin: 'round', d: 'M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z' })]))
const IconHeart = defineComponent(() => () => h('svg', { xmlns: 'http://www.w3.org/2000/svg', fill: 'none', viewBox: '0 0 24 24', strokeWidth: '2', stroke: 'currentColor' }, [h('path', { strokeLinecap: 'round', strokeLinejoin: 'round', d: 'M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z' })]))

const features = [
  {
    icon: IconChef,
    title: 'Savoir-Faire Artisanal',
    description: 'Nos sushis sont préparés à la commande par des mains expertes, respectant le temps nécessaire pour chaque création.'
  },
  {
    icon: IconStar,
    title: 'Fraîcheur Absolue',
    description: 'Une sélection rigoureuse de poissons frais et de légumes de saison pour garantir une explosion de saveurs en bouche.'
  },
  {
    icon: IconHeart,
    title: 'Expérience Humaine',
    description: 'Un service attentionné et chaleureux pour faire de chaque repas un moment de convivialité et de partage.'
  }
]

// Simple custom directive for animation
const vAnimateOnScroll = {
  mounted: (el, binding) => {
    const animation = binding.value?.animation || 'fade-in-up'
    const delay = binding.value?.delay || 0
    el.classList.add('opacity-0')
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            el.classList.add('animate-' + animation)
            el.classList.remove('opacity-0')
          }, delay)
          observer.unobserve(el)
        }
      })
    }, { threshold: 0.1 })
    
    observer.observe(el)
  }
}
</script>

<style>
@keyframes fade-in-up {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes slide-in-left {
  from { opacity: 0; transform: translateX(-50px); }
  to { opacity: 1; transform: translateX(0); }
}

@keyframes slide-in-right {
  from { opacity: 0; transform: translateX(50px); }
  to { opacity: 1; transform: translateX(0); }
}

@keyframes slow-zoom {
  from { transform: scale(1); }
  to { transform: scale(1.1); }
}

@keyframes bounce-slow {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

.animate-fade-in-up { animation: fade-in-up 0.8s ease-out forwards; }
.animate-slide-in-left { animation: slide-in-left 0.8s ease-out forwards; }
.animate-slide-in-right { animation: slide-in-right 0.8s ease-out forwards; }
.animate-slow-zoom { animation: slow-zoom 20s ease-out forwards; }
.animate-bounce-slow { animation: bounce-slow 3s ease-in-out infinite; }
.animate-fade-in { animation: opacity 1s ease-out; }

@keyframes opacity {
  from { opacity: 0; }
  to { opacity: 1; }
}
</style>
