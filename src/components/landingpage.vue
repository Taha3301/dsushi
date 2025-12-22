
<template>
  <!-- Hero Section -->
  <section class="relative min-h-screen flex items-center justify-center overflow-hidden" style="background-color: #E3E3E3;">
    <!-- Sushi Background Elements -->
    <div class="absolute inset-0 overflow-hidden">
      <!-- Large Sushi Roll -->
      <div class="absolute top-20 right-10 animate-sushi-float-1">
        <svg width="120" height="80" viewBox="0 0 120 80" class="opacity-20">
          <ellipse cx="60" cy="40" rx="50" ry="25" fill="#8B4513" />
          <ellipse cx="60" cy="35" rx="45" ry="20" fill="#FFE4B5" />
          <circle cx="45" cy="30" r="3" fill="#FF6B6B" />
          <circle cx="60" cy="30" r="3" fill="#4ECDC4" />
          <circle cx="75" cy="30" r="3" fill="#45B7D1" />
          <rect x="20" y="35" width="80" height="8" fill="#8B4513" />
        </svg>
      </div>
      
      <!-- Sushi Nigiri -->
      <div class="absolute top-40 left-16 animate-sushi-float-2">
        <svg width="60" height="40" viewBox="0 0 60 40" class="opacity-25">
          <ellipse cx="30" cy="20" rx="25" ry="15" fill="#FFE4B5" />
          <ellipse cx="30" cy="15" rx="20" ry="10" fill="#FF6B6B" />
          <rect x="10" y="20" width="40" height="6" fill="#8B4513" />
        </svg>
      </div>
      
      <!-- Sashimi -->
      <div class="absolute bottom-32 right-20 animate-sushi-float-3">
        <svg width="80" height="50" viewBox="0 0 80 50" class="opacity-20">
          <ellipse cx="40" cy="25" rx="35" ry="20" fill="#FF6B6B" />
          <ellipse cx="40" cy="20" rx="30" ry="15" fill="#FFB6C1" />
          <rect x="15" y="25" width="50" height="8" fill="#8B4513" />
        </svg>
      </div>
      
      <!-- Small Sushi Pieces -->
      <div class="absolute top-60 left-1/4 animate-sushi-float-4">
        <svg width="40" height="30" viewBox="0 0 40 30" class="opacity-30">
          <ellipse cx="20" cy="15" rx="18" ry="12" fill="#4ECDC4" />
          <ellipse cx="20" cy="12" rx="15" ry="8" fill="#FFE4B5" />
          <rect x="8" y="15" width="24" height="4" fill="#8B4513" />
        </svg>
      </div>
      
      <!-- Sushi Roll Slice -->
      <div class="absolute bottom-40 left-10 animate-sushi-float-5">
        <svg width="50" height="35" viewBox="0 0 50 35" class="opacity-25">
          <ellipse cx="25" cy="17" rx="22" ry="15" fill="#8B4513" />
          <ellipse cx="25" cy="14" rx="18" ry="10" fill="#FFE4B5" />
          <circle cx="18" cy="12" r="2" fill="#FF6B6B" />
          <circle cx="25" cy="12" r="2" fill="#4ECDC4" />
          <circle cx="32" cy="12" r="2" fill="#45B7D1" />
          <rect x="10" y="17" width="30" height="5" fill="#8B4513" />
        </svg>
      </div>
      
      <!-- Floating Sushi -->
      <div class="absolute top-1/3 left-1/3 animate-sushi-float-6">
        <svg width="35" height="25" viewBox="0 0 35 25" class="opacity-20">
          <ellipse cx="17" cy="12" rx="15" ry="10" fill="#45B7D1" />
          <ellipse cx="17" cy="10" rx="12" ry="7" fill="#FFE4B5" />
          <rect x="7" y="12" width="20" height="3" fill="#8B4513" />
        </svg>
      </div>
      
      <!-- Decorative Sushi -->
      <div class="absolute bottom-20 right-1/3 animate-sushi-float-7">
        <svg width="45" height="30" viewBox="0 0 45 30" class="opacity-15">
          <ellipse cx="22" cy="15" rx="20" ry="12" fill="#8B4513" />
          <ellipse cx="22" cy="12" rx="16" ry="8" fill="#FFE4B5" />
          <circle cx="16" cy="10" r="1.5" fill="#FF6B6B" />
          <circle cx="22" cy="10" r="1.5" fill="#4ECDC4" />
          <circle cx="28" cy="10" r="1.5" fill="#45B7D1" />
          <rect x="8" y="15" width="28" height="4" fill="#8B4513" />
        </svg>
      </div>
    </div>

    <div class="mx-auto max-w-7xl px-6 text-center relative z-10">
      <div class="space-y-8">
        <!-- Animated Title -->
        <h1 class="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 animate-fade-in-up">
          <span class="block">Découvrez</span>
          <span class="block text-red-600 animate-pulse">D.Sushi</span>
          <span class="block text-3xl md:text-4xl lg:text-5xl font-normal text-gray-700 mt-4 animate-fade-in-delay">
            L'art authentique de la cuisine japonaise
          </span>
        </h1>
        
        <!-- Subtitle -->
        <p class="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto animate-fade-in-up-delay">
          Savourez des sushis préparés avec passion, des ingrédients frais et une expertise traditionnelle. 
          Chaque bouchée est une expérience culinaire exceptionnelle.
        </p>
        
        <!-- CTA Buttons -->
        <div class="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in-up-delay-2">
          <button @click="goToProduits" class="bg-red-600 hover:bg-red-700 text-white font-bold py-4 px-8 rounded-full text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
            Commander Maintenant
          </button>
          <button  @click="openMenuPopup" class="border-2 border-gray-700 hover:border-red-600 text-gray-700 hover:text-red-600 font-semibold py-4 px-8 rounded-full text-lg transition-all duration-300 transform hover:scale-105">
            Voir le Menu
          </button>
          
        </div>
        
        <!-- Floating Elements for Visual Appeal -->
        <div class="absolute top-20 left-10 animate-float">
          <div class="w-16 h-16 bg-red-100 rounded-full opacity-60"></div>
        </div>
        <div class="absolute top-40 right-20 animate-float-delay">
          <div class="w-12 h-12 bg-gray-300 rounded-full opacity-40"></div>
        </div>
        <div class="absolute bottom-20 left-20 animate-float-delay-2">
          <div class="w-20 h-20 bg-red-200 rounded-full opacity-30"></div>
        </div>
        <div class="absolute bottom-40 right-10 animate-float">
          <div class="w-14 h-14 bg-gray-400 rounded-full opacity-50"></div>
        </div>
      </div>
    </div>
  </section>
    
  <!-- Section 1: only video sishi2.mp4 -->
  <section class="py-16 md:py-24 relative overflow-hidden">
    <!-- Background Elements -->
    <div class="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-gray-100"></div>
    <div class="absolute top-0 left-0 w-full h-full">
      <div class="absolute top-20 right-20 w-32 h-32 bg-red-100 rounded-full opacity-20 animate-pulse"></div>
      <div class="absolute bottom-20 left-20 w-24 h-24 bg-gray-200 rounded-full opacity-30 animate-bounce"></div>
    </div>
    
    <div class="mx-auto max-w-7xl px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
      <div class="order-2 lg:order-1 space-y-8">
        <div class="space-y-6">
          <div class="inline-flex items-center px-4 py-2 rounded-full bg-red-100 text-red-700 text-sm font-medium">
            <span class="w-2 h-2 bg-red-500 rounded-full mr-2 animate-pulse"></span>
            Innovation Culinaire
          </div>
          <h2 class="text-4xl md:text-5xl font-bold tracking-tight text-gray-900 leading-tight">
            Optimiser les 
            <span class="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-red-800">
              Opérations
            </span>
          </h2>
          <p class="text-lg text-gray-600 leading-relaxed max-w-2xl">
            Optimisez le flux de votre cuisine, gérez les stocks et suivez chaque commande avec des tableaux de bord en temps réel. 
            <span class="text-red-600 font-semibold">Une efficacité maximale pour une qualité exceptionnelle.</span>
        </p>
      </div>
        
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div class="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
            <div class="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
              <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
              </svg>
            </div>
            <h3 class="font-semibold text-gray-900 mb-2">Rapidité</h3>
            <p class="text-sm text-gray-600">Commandes traitées en temps réel</p>
          </div>
          
          <div class="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
            <div class="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
              <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
              </svg>
            </div>
            <h3 class="font-semibold text-gray-900 mb-2">Analytics</h3>
            <p class="text-sm text-gray-600">Données en temps réel</p>
          </div>
          
          <div class="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
            <div class="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
              <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"/>
              </svg>
            </div>
            <h3 class="font-semibold text-gray-900 mb-2">Gestion</h3>
            <p class="text-sm text-gray-600">Stocks optimisés</p>
          </div>
        </div>
      </div>
      
      <div class="order-1 lg:order-2 relative">
        <div class="relative group">
          <div class="absolute -inset-4 bg-gradient-to-r from-red-600 to-red-800 rounded-3xl blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
          <div class="relative bg-white p-2 rounded-3xl shadow-2xl">
            <video class="w-full aspect-[11/16] rounded-2xl object-cover" autoplay muted loop playsinline poster="../assets/images/sushi1.jpg">
          <source src="../assets/images/sishi2.mp4" type="video/mp4" />
        </video>
          </div>
          <div class="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-lg">
            <svg class="w-6 h-6 text-red-600" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z"/>
            </svg>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Section 2: only image sushi1.jpg -->
  <section class="py-16 md:py-24 relative overflow-hidden">
    <!-- Background Pattern -->
    <div class="absolute inset-0 bg-gradient-to-br from-red-50 via-white to-gray-50"></div>
    <div class="absolute inset-0 opacity-5">
      <div class="absolute top-10 left-10 w-20 h-20 border border-red-200 rounded-full"></div>
      <div class="absolute top-32 right-16 w-16 h-16 border border-red-200 rounded-full"></div>
      <div class="absolute bottom-20 left-1/4 w-12 h-12 border border-red-200 rounded-full"></div>
      <div class="absolute bottom-32 right-1/3 w-24 h-24 border border-red-200 rounded-full"></div>
    </div>
    
    <div class="mx-auto max-w-7xl px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
      <div class="relative group">
        <div class="absolute -inset-6 bg-gradient-to-r from-red-500 to-red-700 rounded-3xl blur opacity-20 group-hover:opacity-30 transition duration-1000"></div>
        <div class="relative">
          <div class="absolute -top-4 -left-4 w-8 h-8 bg-red-500 rounded-full opacity-60 animate-ping"></div>
          <div class="absolute -bottom-4 -right-4 w-6 h-6 bg-red-400 rounded-full opacity-80 animate-pulse"></div>
          <img src="../assets/images/sushi1.jpg" alt="Sushi" class="w-full max-w-sm mx-auto aspect-[11/16] rounded-3xl object-cover shadow-2xl transform group-hover:scale-105 transition duration-700" />
        </div>
        <div class="absolute top-6 left-6 bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-lg">
          <div class="flex items-center space-x-2">
            <div class="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <span class="text-sm font-medium text-gray-700">En direct</span>
          </div>
        </div>
      </div>
      
      <div class="space-y-8">
        <div class="space-y-6">
          <div class="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-red-100 to-red-200 text-red-700 text-sm font-medium">
            <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
            Expérience Premium
          </div>
          <h2 class="text-4xl md:text-5xl font-bold tracking-tight text-gray-900 leading-tight">
            Ravir les 
            <span class="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-red-800">
              Clients
            </span>
          </h2>
          <p class="text-lg text-gray-600 leading-relaxed max-w-2xl">
            Des menus magnifiques, des commandes rapides et des mises à jour en temps réel font revenir vos invités. 
            <span class="text-red-600 font-semibold">Chaque interaction est une expérience mémorable.</span>
          </p>
        </div>
        
        <div class="space-y-6">
          <div class="flex items-start space-x-4">
            <div class="flex-shrink-0 w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
              <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
              </svg>
            </div>
            <div>
              <h3 class="text-lg font-semibold text-gray-900 mb-2">Satisfaction Client</h3>
              <p class="text-gray-600">Interface intuitive et expérience utilisateur exceptionnelle</p>
            </div>
          </div>
          
          <div class="flex items-start space-x-4">
            <div class="flex-shrink-0 w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
              <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
              </svg>
            </div>
      <div>
              <h3 class="text-lg font-semibold text-gray-900 mb-2">Performance</h3>
              <p class="text-gray-600">Temps de réponse optimisés pour une fluidité parfaite</p>
            </div>
          </div>
          
          <div class="flex items-start space-x-4">
            <div class="flex-shrink-0 w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
              <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
      </div>
      <div>
              <h3 class="text-lg font-semibold text-gray-900 mb-2">Qualité</h3>
              <p class="text-gray-600">Standards élevés pour chaque commande et interaction</p>
            </div>
          </div>
        </div>
        
        <div class="pt-4">
          <button class="inline-flex items-center px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white font-semibold rounded-full hover:from-red-700 hover:to-red-800 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
            Découvrir l'expérience
            <svg class="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  </section>

  <!-- Section 3: only video sushi3.mp4 -->
  <section class="py-16 md:py-24 relative overflow-hidden">
    <!-- Background Elements -->
    <div class="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-black"></div>
    <div class="absolute inset-0 opacity-10">
      <div class="absolute top-20 left-20 w-32 h-32 bg-red-500 rounded-full blur-3xl"></div>
      <div class="absolute bottom-20 right-20 w-40 h-40 bg-red-600 rounded-full blur-3xl"></div>
      <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-red-400 rounded-full blur-3xl"></div>
    </div>
    
    <div class="mx-auto max-w-7xl px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
      <div class="order-2 lg:order-1 space-y-8">
        <div class="space-y-6">
          <div class="inline-flex items-center px-4 py-2 rounded-full bg-red-600/20 backdrop-blur-sm text-red-400 text-sm font-medium border border-red-500/30">
            <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
              <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
            </svg>
            Intelligence Data
          </div>
          <h2 class="text-4xl md:text-5xl font-bold tracking-tight text-white leading-tight">
            Analyses & 
            <span class="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-red-600">
              Croissance
            </span>
          </h2>
          <p class="text-lg text-gray-300 leading-relaxed max-w-2xl">
            Prenez des décisions plus intelligentes avec les analyses de ventes, les performances du menu et les insights clients en un seul endroit. 
            <span class="text-red-400 font-semibold">L'avenir de votre restaurant commence ici.</span>
        </p>
      </div>
        
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div class="bg-white/10 backdrop-blur-sm p-6 rounded-2xl border border-white/20 hover:bg-white/20 transition-all duration-300">
            <div class="flex items-center justify-between mb-4">
              <div class="w-12 h-12 bg-red-500/20 rounded-xl flex items-center justify-center">
                <svg class="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                </svg>
              </div>
              <span class="text-2xl font-bold text-white">+127%</span>
            </div>
            <h3 class="text-white font-semibold mb-2">Ventes</h3>
            <p class="text-gray-300 text-sm">Croissance mensuelle</p>
          </div>
          
          <div class="bg-white/10 backdrop-blur-sm p-6 rounded-2xl border border-white/20 hover:bg-white/20 transition-all duration-300">
            <div class="flex items-center justify-between mb-4">
              <div class="w-12 h-12 bg-red-500/20 rounded-xl flex items-center justify-center">
                <svg class="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"/>
                </svg>
              </div>
              <span class="text-2xl font-bold text-white">4.9★</span>
            </div>
            <h3 class="text-white font-semibold mb-2">Satisfaction</h3>
            <p class="text-gray-300 text-sm">Note moyenne clients</p>
          </div>
          
          <div class="bg-white/10 backdrop-blur-sm p-6 rounded-2xl border border-white/20 hover:bg-white/20 transition-all duration-300">
            <div class="flex items-center justify-between mb-4">
              <div class="w-12 h-12 bg-red-500/20 rounded-xl flex items-center justify-center">
                <svg class="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/>
                </svg>
              </div>
              <span class="text-2xl font-bold text-white">+89%</span>
            </div>
            <h3 class="text-white font-semibold mb-2">Efficacité</h3>
            <p class="text-gray-300 text-sm">Amélioration opérationnelle</p>
          </div>
          
          <div class="bg-white/10 backdrop-blur-sm p-6 rounded-2xl border border-white/20 hover:bg-white/20 transition-all duration-300">
            <div class="flex items-center justify-between mb-4">
              <div class="w-12 h-12 bg-red-500/20 rounded-xl flex items-center justify-center">
                <svg class="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
                </svg>
              </div>
              <span class="text-2xl font-bold text-white">+156%</span>
            </div>
            <h3 class="text-white font-semibold mb-2">Clients</h3>
            <p class="text-gray-300 text-sm">Fidélisation</p>
          </div>
        </div>
        
        <div class="pt-4">
          <button class="inline-flex items-center px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white font-semibold rounded-full hover:from-red-700 hover:to-red-800 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-red-500/25">
            Voir les analyses
            <svg class="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
            </svg>
          </button>
        </div>
      </div>
      
      <div class="order-1 lg:order-2 relative">
        <div class="relative group">
          <div class="absolute -inset-4 bg-gradient-to-r from-red-600 to-red-800 rounded-3xl blur opacity-30 group-hover:opacity-50 transition duration-1000"></div>
          <div class="relative bg-black/20 backdrop-blur-sm p-2 rounded-3xl border border-white/20">
            <video class="w-full aspect-[11/16] rounded-2xl object-cover" autoplay muted loop playsinline poster="../assets/images/sushi1.jpg">
          <source src="../assets/images/sushi3.mp4" type="video/mp4" />
        </video>
          </div>
          <div class="absolute top-4 right-4 bg-red-600/90 backdrop-blur-sm rounded-full p-2 shadow-lg">
            <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z"/>
            </svg>
          </div>
          <div class="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-2xl p-3 shadow-lg">
            <div class="flex items-center space-x-2">
              <div class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span class="text-xs font-medium text-gray-700">Analytics Live</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Modal Slider for Menu Images -->
  <div v-if="isMenuModalOpen" class="fixed inset-0 z-50 flex items-center justify-center">
    <!-- Backdrop -->
    <div class="absolute inset-0 bg-black/60" @click.self="closeMenuPopup"></div>

    <!-- Modal Card -->
    <div class="relative bg-white rounded-2xl shadow-2xl w-[90vw] max-w-4xl mx-auto overflow-hidden">
      <!-- Header -->
      <div class="flex items-center justify-between px-4 py-3 border-b border-gray-100">
        <h3 class="text-lg font-semibold text-gray-800">Menu</h3>
        <button @click="closeMenuPopup" aria-label="Close" class="p-2 rounded-full hover:bg-gray-100 text-gray-600 hover:text-gray-900 transition">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5">
            <path fill-rule="evenodd" d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z" clip-rule="evenodd" />
          </svg>
        </button>
      </div>

      <!-- Slider Area -->
      <div class="relative bg-gray-50">
        <img :src="slides[currentSlideIndex]" alt="Menu Slide" class="w-full max-h-[70vh] object-contain select-none" draggable="false" />

        <!-- Prev -->
        <button @click="prevSlide" class="absolute left-3 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/90 hover:bg-white shadow border border-gray-200 text-gray-800 hover:scale-105 transition">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
        </button>
        <!-- Next -->
        <button @click="nextSlide" class="absolute right-3 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/90 hover:bg-white shadow border border-gray-200 text-gray-800 hover:scale-105 transition">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
          </svg>
        </button>
        <!-- Index pill -->
        <div class="absolute bottom-3 right-3 px-2 py-1 text-xs rounded-full bg-black/60 text-white">
          {{ currentSlideIndex + 1 }} / {{ slides.length }}
        </div>
      </div>

      <!-- Footer Actions -->
      <div class="flex items-center justify-between gap-3 px-4 py-3 border-t border-gray-100">
        <a :href="slides[currentSlideIndex]" :download="`menu-${currentSlideIndex + 1}.png`" class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-600 text-white font-medium hover:bg-red-700 transition">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M7.5 12l4.5 4.5m0 0l4.5-4.5M12 16.5V3" />
          </svg>
          Télécharger
        </a>
        <div class="flex items-center gap-2">
          <button @click="closeMenuPopup" class="px-4 py-2 rounded-full bg-gray-800 text-white hover:bg-black">Fermer</button>
        </div>
      </div>
    </div>
  </div>
</template>


<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'

const isMenuModalOpen = ref(false)
const currentSlideIndex = ref(0)
const router = useRouter()

// Update these paths to where your 1.png and 2.png actually live
// Example expected location: src/assets/images/1.png and src/assets/images/2.png
const slides = [
  new URL('../assets/images/menu/Sushi cravings 🍣We take orders all week, but spots are limited – first come, first served! Orde.jpg', import.meta.url).href,
  new URL('../assets/images/menu/Sushi cravings 🍣We take orders all week, but spots are limited – first come, first served! Orde (1).jpg', import.meta.url).href,
  new URL('../assets/images/menu/Sushi cravings 🍣We take orders all week, but spots are limited – first come, first served! Orde (2).jpg', import.meta.url).href,
  new URL('../assets/images/menu/Sushi cravings 🍣We take orders all week, but spots are limited – first come, first served! Orde (3).jpg', import.meta.url).href,
  new URL('../assets/images/menu/Sushi cravings 🍣We take orders all week, but spots are limited – first come, first served! Orde (4).jpg', import.meta.url).href,
  new URL('../assets/images/menu/Sushi cravings 🍣We take orders all week, but spots are limited – first come, first served! Orde (5).jpg', import.meta.url).href,
]

function openMenuPopup() {
  isMenuModalOpen.value = true
  currentSlideIndex.value = 0
}

function closeMenuPopup() {
  isMenuModalOpen.value = false
}

function nextSlide() {
  currentSlideIndex.value = (currentSlideIndex.value + 1) % slides.length
}

function prevSlide() {
  currentSlideIndex.value = (currentSlideIndex.value - 1 + slides.length) % slides.length
}

function goToProduits() {
  router.push('/produits')
}

function handleKeydown(event) {
  if (!isMenuModalOpen.value) return
  if (event.key === 'Escape') closeMenuPopup()
  if (event.key === 'ArrowRight') nextSlide()
  if (event.key === 'ArrowLeft') prevSlide()
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeydown)
})
</script>

<style scoped>
/* Animation Keyframes */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes float {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-20px);
  }
}

@keyframes sushiFloat1 {
  0%, 100% {
    transform: translate(0, 0) rotate(0deg);
  }
  25% {
    transform: translate(20px, -15px) rotate(5deg);
  }
  50% {
    transform: translate(-10px, -25px) rotate(-3deg);
  }
  75% {
    transform: translate(15px, -10px) rotate(2deg);
  }
}

@keyframes sushiFloat2 {
  0%, 100% {
    transform: translate(0, 0) rotate(0deg);
  }
  33% {
    transform: translate(-15px, 10px) rotate(-4deg);
  }
  66% {
    transform: translate(10px, -20px) rotate(3deg);
  }
}

@keyframes sushiFloat3 {
  0%, 100% {
    transform: translate(0, 0) rotate(0deg);
  }
  50% {
    transform: translate(25px, -15px) rotate(6deg);
  }
}

@keyframes sushiFloat4 {
  0%, 100% {
    transform: translate(0, 0) rotate(0deg);
  }
  25% {
    transform: translate(12px, -8px) rotate(2deg);
  }
  75% {
    transform: translate(-8px, -12px) rotate(-2deg);
  }
}

@keyframes sushiFloat5 {
  0%, 100% {
    transform: translate(0, 0) rotate(0deg);
  }
  40% {
    transform: translate(18px, -10px) rotate(4deg);
  }
  80% {
    transform: translate(-12px, -18px) rotate(-3deg);
  }
}

@keyframes sushiFloat6 {
  0%, 100% {
    transform: translate(0, 0) rotate(0deg);
  }
  30% {
    transform: translate(8px, -6px) rotate(1deg);
  }
  70% {
    transform: translate(-6px, -8px) rotate(-1deg);
  }
}

@keyframes sushiFloat7 {
  0%, 100% {
    transform: translate(0, 0) rotate(0deg);
  }
  20% {
    transform: translate(10px, -5px) rotate(2deg);
  }
  60% {
    transform: translate(-5px, -10px) rotate(-2deg);
  }
  80% {
    transform: translate(7px, -7px) rotate(1deg);
  }
}

/* Animation Classes */
.animate-fade-in-up {
  animation: fadeInUp 1s ease-out;
}

.animate-fade-in-delay {
  animation: fadeInUp 1s ease-out 0.3s both;
}

.animate-fade-in-up-delay {
  animation: fadeInUp 1s ease-out 0.6s both;
}

.animate-fade-in-up-delay-2 {
  animation: fadeInUp 1s ease-out 0.9s both;
}

.animate-float {
  animation: float 3s ease-in-out infinite;
}

.animate-float-delay {
  animation: float 3s ease-in-out infinite 1s;
}

.animate-float-delay-2 {
  animation: float 3s ease-in-out infinite 2s;
}

.animate-sushi-float-1 {
  animation: sushiFloat1 12s ease-in-out infinite;
}

.animate-sushi-float-2 {
  animation: sushiFloat2 10s ease-in-out infinite;
}

.animate-sushi-float-3 {
  animation: sushiFloat3 14s ease-in-out infinite;
}

.animate-sushi-float-4 {
  animation: sushiFloat4 8s ease-in-out infinite;
}

.animate-sushi-float-5 {
  animation: sushiFloat5 11s ease-in-out infinite;
}

.animate-sushi-float-6 {
  animation: sushiFloat6 9s ease-in-out infinite;
}

.animate-sushi-float-7 {
  animation: sushiFloat7 13s ease-in-out infinite;
}

/* Hover effects for buttons */
button:hover {
  transform: translateY(-2px);
}

/* Responsive text sizing */
@media (max-width: 640px) {
  .animate-fade-in-up h1 {
    font-size: 2.5rem;
  }
}
</style>
