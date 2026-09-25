<template>
  <!-- Hero Section -->
  <section class="hero-section relative min-h-[auto] md:min-h-[85vh] flex flex-col items-center justify-start py-4 md:py-6 overflow-hidden" style="background-color: #E3E3E3;">
    <!-- Sushi Background Elements (Hidden on Mobile to prevent overflow) -->
    <div class="hero-decorations absolute inset-0 overflow-hidden">
      <!-- Large Sushi Roll -->
      <div class="absolute top-10 right-4 md:top-20 md:right-10 animate-sushi-float-1">
        <svg width="120" height="80" viewBox="0 0 120 80" class="opacity-20">
          <ellipse cx="60" cy="40" rx="50" ry="25" fill="#8B4513" />
          <ellipse cx="60" cy="35" rx="45" ry="20" fill="#FFE4B5" />
          <circle cx="45" cy="30" r="3" fill="#FF6B6B" />
          <circle cx="60" cy="30" r="3" fill="#4ECDC4" />
          <circle cx="75" cy="30" r="3" fill="#45B7D1" />
          <rect x="20" y="35" width="80" height="8" fill="#8B4513" />
        </svg>
      </div>
      
      <!-- Sushi Nigiri (Hidden on mobile to reduce clutter) -->
      <div class="absolute top-20 left-4 md:top-40 md:left-16 animate-sushi-float-2 hidden md:block">
        <svg width="60" height="40" viewBox="0 0 60 40" class="opacity-25">
          <ellipse cx="30" cy="20" rx="25" ry="15" fill="#FFE4B5" />
          <ellipse cx="30" cy="15" rx="20" ry="10" fill="#FF6B6B" />
          <rect x="10" y="20" width="40" height="6" fill="#8B4513" />
        </svg>
      </div>
      
      <!-- Sashimi -->
      <div class="absolute bottom-20 right-6 md:bottom-32 md:right-20 animate-sushi-float-3 opacity-10 md:opacity-20">
        <svg width="80" height="50" viewBox="0 0 80 50" class="opacity-20">
          <ellipse cx="40" cy="25" rx="35" ry="20" fill="#FF6B6B" />
          <ellipse cx="40" cy="20" rx="30" ry="15" fill="#FFB6C1" />
          <rect x="15" y="25" width="50" height="8" fill="#8B4513" />
        </svg>
      </div>
      
      <!-- Small Sushi Pieces -->
      <div class="absolute top-40 left-10 md:top-60 md:left-1/4 animate-sushi-float-4">
        <svg width="40" height="30" viewBox="0 0 40 30" class="opacity-30">
          <ellipse cx="20" cy="15" rx="18" ry="12" fill="#4ECDC4" />
          <ellipse cx="20" cy="12" rx="15" ry="8" fill="#FFE4B5" />
          <rect x="8" y="15" width="24" height="4" fill="#8B4513" />
        </svg>
      </div>
      
      <!-- Sushi Roll Slice -->
      <div class="absolute bottom-40 left-4 md:bottom-40 md:left-10 animate-sushi-float-5">
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

    <div class="w-full max-w-7xl mx-auto px-4 md:px-6 text-center relative z-10 pt-2 md:pt-2">
      <div class="space-y-4 md:space-y-6">
        <!-- Animated Title -->
        <h1 class="text-3xl md:text-5xl lg:text-7xl font-bold text-gray-900 animate-fade-in-up px-4 flex flex-col md:flex-row items-center justify-center gap-2 md:gap-4 leading-tight">
          <span>Sushis maison à</span>
          <span class="text-red-600 animate-pulse">Djerba</span>
        </h1>
        <p class="mobile-hero-tagline">Le goût du fait maison</p>

        <!-- High-Impact CTA Buttons (Now higher up) -->
        <div class="flex flex-row gap-4 justify-center items-center animate-fade-in-up-delay mt-2">
          <button @click="goToProduits" class="hidden md:block bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-full text-sm md:text-base transition-all duration-300 transform hover:scale-105 shadow-lg">
            Commander Maintenant
          </button>
          <button @click="openMenuPopup" class="border-2 border-gray-700 hover:border-red-600 text-gray-700 hover:text-red-600 font-semibold py-3 px-8 rounded-full text-sm md:text-base transition-all duration-300 transform hover:scale-105">
            Voir le Menu
          </button>
        </div>
        
        <!-- Category Filter -->
        <div class="flex items-center md:justify-center gap-3 overflow-x-auto pb-4 no-scrollbar px-4 animate-fade-in-up-delay">
          <button 
            class="showcase-cat-pill" 
            :class="{ active: !selectedCategory }"
            @click="selectedCategory = ''"
          >
            Tous
          </button>
          <button 
            v-for="cat in categories" 
            :key="cat.categoryId"
            class="showcase-cat-pill"
            :class="{ active: selectedCategory === cat.categoryId }"
            @click="selectedCategory = cat.categoryId"
          >
            {{ categoryLabel(cat.name) }}
          </button>
        </div>

        <!-- Product Slider -->
        <div class="showcase-slider-wrapper relative group mt-8 w-full overflow-hidden">
          <!-- Navigation Buttons -->
          <button 
            class="showcase-nav-btn showcase-nav-btn--prev" 
            @click="scrollShowcase(-1)"
            aria-label="Previous"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7"/></svg>
          </button>

          <div class="showcase-track" ref="showcaseTrackRef">
            <div 
              v-for="(p, i) in filteredProducts" 
              :key="p.productId"
              class="showcase-card animate-fade-in-up"
              :style="{ animationDelay: `${0.2 + i * 0.1}s` }"
              @click="goToProduct(p)"
            >
              <div class="showcase-card-img-wrap relative overflow-hidden">
                <img 
                  v-if="p.imageUrls?.[0]"
                  :src="resolveImage(p.imageUrls?.[0], 400)" 
                  alt="" 
                  class="showcase-card-img" 
                  loading="lazy"
                  @error="$event.target.src = 'data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22200%22 height=%22200%22><rect width=%22100%%22 height=%22100%%22 fill=%22%23f3f4f6%22/><text x=%2250%%22 y=%2250%%22 dominant-baseline=%22middle%22 text-anchor=%22middle%22 font-family=%22Arial%22 font-size=%2224%22 fill=%22%239ca3af%22>🍣</text></svg>'"
                />
                <div v-else class="showcase-card-img showcase-card-img--placeholder">🍣</div>
                
                <!-- Quick Add to Cart (On Image for Premium Look) -->
                <button 
                  @click.stop="addToCart(p, $event)"
                  class="absolute bottom-3 right-3 w-10 h-10 bg-white/90 backdrop-blur-sm text-red-600 rounded-full flex items-center justify-center shadow-xl hover:bg-red-600 hover:text-white active:scale-90 transition-all duration-300 z-20 group/btn"
                  title="Ajouter au panier"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="3" stroke="currentColor" class="w-5 h-5 group-hover/btn:rotate-90 transition-transform">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                  </svg>
                </button>

                <div class="showcase-card-overlay">
                  <span class="view-btn">Découvrir</span>
                </div>
              </div>
              <div class="showcase-card-info">
                <h3 class="showcase-card-name truncate">{{ p.name }}</h3>
                <p class="showcase-card-price">{{ formatPrice(p.price) }}</p>
              </div>
            </div>
          </div>

          <button 
            class="showcase-nav-btn showcase-nav-btn--next" 
            @click="scrollShowcase(1)"
            aria-label="Next"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/></svg>
          </button>
        </div>



        <!-- Floating Elements for Visual Appeal (Hidden on Mobile) -->
        <div class="absolute top-10 left-4 md:top-20 md:left-10 animate-float opacity-40 hidden md:block">
          <div class="w-10 h-10 md:w-16 md:h-16 bg-red-100 rounded-full opacity-60"></div>
        </div>
        <div class="absolute top-20 right-10 md:top-40 md:right-20 animate-float-delay opacity-30 hidden md:block">
          <div class="w-8 h-8 md:w-12 md:h-12 bg-gray-300 rounded-full opacity-40"></div>
        </div>
        <div class="absolute bottom-10 left-10 md:bottom-20 md:left-20 animate-float-delay-2 opacity-20 hidden md:block">
          <div class="w-14 h-14 md:w-20 md:h-20 bg-red-200 rounded-full opacity-30"></div>
        </div>
        <div class="absolute bottom-30 right-4 md:bottom-40 md:right-10 animate-float opacity-40 hidden md:block">
          <div class="w-10 h-10 md:w-14 md:h-14 bg-gray-400 rounded-full opacity-50"></div>
        </div>
      </div>
    </div>

  </section>


  <!-- Section 1: La cuisine D.Sushi -->
  <section class="py-12 md:py-24 relative overflow-hidden">
    <!-- Background Elements -->
    <div class="absolute inset-0 bg-[#E3E3E3]"></div>
    <div class="absolute top-0 left-0 w-full h-full">
      <div class="absolute top-20 right-20 w-32 h-32 bg-red-100 rounded-full opacity-20 animate-pulse"></div>
      <div class="absolute bottom-20 left-20 w-24 h-24 bg-gray-200 rounded-full opacity-30 animate-bounce"></div>
    </div>
    
    <div class="mx-auto max-w-7xl px-4 md:px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-16 items-center relative z-10">
      <div class="order-2 lg:order-1 space-y-8">
        <div class="space-y-6 text-center lg:text-left">
          <div class="inline-flex items-center px-4 py-2 rounded-full bg-red-100 text-red-700 text-sm font-medium">
            <span class="w-2 h-2 bg-red-500 rounded-full mr-2 animate-pulse"></span>
            Sushis maison à Djerba
          </div>
          <h2 class="text-3xl md:text-5xl font-bold tracking-tight text-gray-900 leading-tight">
            Le goût du 
            <span class="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-red-800">
              fait maison
            </span>
          </h2>
          <p class="text-lg text-gray-600 leading-relaxed max-w-2xl mx-auto lg:mx-0">
            Des sushis maison faits avec amour, préparés pour vous à Djerba. 
            <span class="text-red-600 font-semibold">Rendez-vous chaque samedi de 18h à 21h.</span>
        </p>
      </div>
        
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          <div class="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
            <div class="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
              <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
              </svg>
            </div>
              <h3 class="font-semibold text-gray-900 mb-2">Commande en ligne</h3>
            <p class="text-sm text-gray-600">Découvrez le menu du samedi</p>
          </div>
          
          <div class="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
            <div class="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
              <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
              </svg>
            </div>
            <h3 class="font-semibold text-gray-900 mb-2">Menu varié</h3>
            <p class="text-sm text-gray-600">Des sushis maison faits avec amour</p>
          </div>
          
          <div class="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
            <div class="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
              <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"/>
              </svg>
            </div>
            <h3 class="font-semibold text-gray-900 mb-2">Chaque samedi</h3>
            <p class="text-sm text-gray-600">Service de 18h à 21h à Houmt Souk</p>
          </div>
        </div>
      </div>
      
      <div class="order-1 lg:order-2 relative px-4 md:px-0">
        <div class="relative group max-w-md mx-auto lg:max-w-none">
          <div class="absolute -inset-4 bg-gradient-to-r from-red-600 to-red-800 rounded-3xl blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
          <div class="relative bg-white p-2 rounded-3xl shadow-2xl">
            <video class="w-full aspect-[11/16] rounded-2xl object-cover" muted loop playsinline poster="../assets/images/sushi1.jpg" preload="metadata">
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

  <!-- Section 2: Commander chez D.Sushi -->
  <section class="py-12 md:py-24 relative overflow-hidden">
    <!-- Background Pattern -->
    <div class="absolute inset-0 bg-[#E3E3E3]"></div>
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
          <img src="../assets/images/sushi1.jpg" alt="Sushi" class="w-full max-w-sm mx-auto aspect-[11/16] rounded-3xl object-cover shadow-2xl transform group-hover:scale-105 transition duration-700" loading="lazy" />
        </div>
        <div class="absolute top-6 left-6 bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-lg">
          <div class="flex items-center space-x-2">
            <div class="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <span class="text-sm font-medium text-gray-700">En direct</span>
          </div>
        </div>
      </div>
      
      <div class="space-y-8">
        <div class="space-y-6 text-center lg:text-left">
          <div class="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-red-100 to-red-200 text-red-700 text-sm font-medium">
            <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
            D.Sushi
          </div>
          <h2 class="text-4xl md:text-5xl font-bold tracking-tight text-gray-900 leading-tight">
            Savourer le 
            <span class="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-red-800">
              goût maison
            </span>
          </h2>
          <p class="text-base md:text-lg text-gray-600 leading-relaxed max-w-2xl mx-auto lg:mx-0">
            Pas de restaurant, mais des sushis maison qui ont encore plus de goût. Découvrez notre sélection et préparez votre commande. 
            <span class="text-red-600 font-semibold">Nous vous retrouvons chaque samedi à Houmt Souk, Djerba.</span>
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
              <h3 class="text-lg font-semibold text-gray-900 mb-2">Sushis maison</h3>
              <p class="text-gray-600">Faits avec amour pour chaque commande</p>
            </div>
          </div>
          
          <div class="flex items-start space-x-4">
            <div class="flex-shrink-0 w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
              <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
              </svg>
            </div>
      <div>
              <h3 class="text-lg font-semibold text-gray-900 mb-2">Le samedi</h3>
              <p class="text-gray-600">Commandes et service de 18h à 21h</p>
            </div>
          </div>
          
          <div class="flex items-start space-x-4">
            <div class="flex-shrink-0 w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
              <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
      </div>
      <div>
              <h3 class="text-lg font-semibold text-gray-900 mb-2">Houmt Souk</h3>
              <p class="text-gray-600">D.Sushi vous retrouve à Djerba</p>
            </div>
          </div>
        </div>
        
        <div class="pt-4">
          <button @click="goToProduits" class="inline-flex items-center px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white font-semibold rounded-full hover:from-red-700 hover:to-red-800 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
            Voir le menu du samedi
            <svg class="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  </section>

  <!-- Section 3: L'expérience D.Sushi -->
  <section class="py-12 md:py-24 relative overflow-hidden">
    <!-- Background Elements -->
    <div class="absolute inset-0 bg-[#E3E3E3]"></div>
    <div class="absolute inset-0 opacity-10">
      <div class="absolute top-20 left-20 w-32 h-32 bg-red-500 rounded-full blur-3xl"></div>
      <div class="absolute bottom-20 right-20 w-40 h-40 bg-red-600 rounded-full blur-3xl"></div>
      <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-red-400 rounded-full blur-3xl"></div>
    </div>
    
    <div class="mx-auto max-w-7xl px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
      <div class="order-2 lg:order-1 space-y-8">
        <div class="space-y-6 text-center lg:text-left">
          <div class="inline-flex items-center px-4 py-2 rounded-full bg-red-600/20 backdrop-blur-sm text-red-400 text-sm font-medium border border-red-500/30">
            <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
              <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
            </svg>
            L'expérience D.Sushi
          </div>
          <h2 class="text-4xl md:text-5xl font-bold tracking-tight text-white leading-tight">
            Préparez votre 
            <span class="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-red-600">
              commande
            </span>
          </h2>
          <p class="text-base md:text-lg text-gray-300 leading-relaxed max-w-2xl mx-auto lg:mx-0">
            Découvrez le menu, choisissez vos préférés et préparez votre commande pour le prochain service. 
            <span class="text-red-400 font-semibold">Samedi, de 18h à 21h à Houmt Souk.</span>
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
              <span class="text-2xl font-bold text-white">18h</span>
            </div>
            <h3 class="text-white font-semibold mb-2">Samedi</h3>
            <p class="text-gray-300 text-sm">Le rendez-vous D.Sushi</p>
          </div>
          
          <div class="bg-white/10 backdrop-blur-sm p-6 rounded-2xl border border-white/20 hover:bg-white/20 transition-all duration-300">
            <div class="flex items-center justify-between mb-4">
              <div class="w-12 h-12 bg-red-500/20 rounded-xl flex items-center justify-center">
                <svg class="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"/>
                </svg>
              </div>
              <span class="text-2xl font-bold text-white">Maison</span>
            </div>
            <h3 class="text-white font-semibold mb-2">Fait avec amour</h3>
            <p class="text-gray-300 text-sm">Des sushis maison</p>
          </div>
          
          <div class="bg-white/10 backdrop-blur-sm p-6 rounded-2xl border border-white/20 hover:bg-white/20 transition-all duration-300">
            <div class="flex items-center justify-between mb-4">
              <div class="w-12 h-12 bg-red-500/20 rounded-xl flex items-center justify-center">
                <svg class="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/>
                </svg>
              </div>
              <span class="text-2xl font-bold text-white">21h</span>
            </div>
            <h3 class="text-white font-semibold mb-2">Fin du service</h3>
            <p class="text-gray-300 text-sm">Jusqu'à 21h le samedi</p>
          </div>
          
          <div class="bg-white/10 backdrop-blur-sm p-6 rounded-2xl border border-white/20 hover:bg-white/20 transition-all duration-300">
            <div class="flex items-center justify-between mb-4">
              <div class="w-12 h-12 bg-red-500/20 rounded-xl flex items-center justify-center">
                <svg class="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
                </svg>
              </div>
              <span class="text-2xl font-bold text-white">4180</span>
            </div>
            <h3 class="text-white font-semibold mb-2">Houmt Souk</h3>
            <p class="text-gray-300 text-sm">Djerba, Tunisie</p>
          </div>
        </div>
        
        <div class="pt-4">
          <button @click="goToProduits" class="inline-flex items-center px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white font-semibold rounded-full hover:from-red-700 hover:to-red-800 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-red-500/25">
            Découvrir le menu
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
            <video class="w-full aspect-[11/16] rounded-2xl object-cover" muted loop playsinline poster="../assets/images/sushi1.jpg" preload="metadata">
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
              <span class="text-xs font-medium text-gray-700">Samedi 18h–21h</span>
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

  <!-- Fixed Bottom FAB for Mobile (Only visible on Landing Page) -->
  <div class="landing-fab fixed bottom-20 right-6 z-[60] block md:hidden">
    <button 
      @click="goToProduits" 
      class="w-14 h-14 bg-red-600 active:bg-red-700 text-white rounded-full shadow-2xl flex items-center justify-center active:scale-90 transition-all border-4 border-white"
      aria-label="Commander"
    >
      <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/>
      </svg>
    </button>
  </div>
</template>


<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../stores/auth.js'
import { api, resolveImage } from '../utils/api.js'

const CURRENCY = (import.meta?.env?.VITE_CURRENCY || 'TND').toUpperCase()
const LOCALE   = import.meta?.env?.VITE_LOCALE || 'fr-TN'
const formatPrice = (num) => {
  const v = Number(num)
  if (Number.isNaN(v)) return ''
  try { return new Intl.NumberFormat(LOCALE, { style: 'currency', currency: CURRENCY, minimumFractionDigits: 2 }).format(v) }
  catch { return `${v.toFixed(2)} ${CURRENCY}` }
}

const isMenuModalOpen = ref(false)
const currentSlideIndex = ref(0)
const router = useRouter()
const { isAuthenticated, user } = useAuth()
const allProducts = ref([])
const categories = ref([])
const selectedCategory = ref('')
const showcaseTrackRef = ref(null)

// Helper: Extract customerId from JWT (shared logic from AltNavbar)
function getCustomerIdFromToken(token) {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    return payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'] || payload.sub || payload.userId || null
  } catch { return null }
}

async function addToCart(p, e) {
  if (e) e.stopPropagation()
  
  const token = user.value?.token
  const customerId = token ? getCustomerIdFromToken(token) : null
  
  if (token && customerId) {
    try {
      const res = await fetch(api(`/api/cart/${customerId}/items`), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'accept': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ productId: p.productId, quantity: 1 })
      })
      if (!res.ok) throw new Error('sync failed')
      window.dispatchEvent(new Event('cart-updated'))
      return
    } catch (err) { console.error(err) }
  }

  // Local fallback
  try {
    const raw = localStorage.getItem('cart')
    const cart = raw ? JSON.parse(raw) : []
    const idx = cart.findIndex(i => i.productId === p.productId)
    if (idx >= 0) cart[idx].quantity += 1; else cart.push({ ...p, quantity: 1 })
    localStorage.setItem('cart', JSON.stringify(cart))
    window.dispatchEvent(new Event('cart-updated'))
  } catch (err) { console.error(err) }
}

const filteredProducts = computed(() => {
  if (!selectedCategory.value) return allProducts.value.slice(0, 20)
  return allProducts.value.filter(p => 
    p.categoryId === selectedCategory.value || 
    p.category?.categoryId === selectedCategory.value
  ).slice(0, 20)
})

function categoryLabel(name) {
  const value = String(name || '').toLowerCase()
  if (value.includes('crunchy')) return 'Crunchy'
  if (value.includes('california')) return 'California'
  if (value.includes('maki')) return 'Makis'
  if (value.includes('cru')) return 'Sushi Crus'
  if (value.includes('box')) return 'Boxs'
  return name
}

async function loadProducts() {
  try {
    const res = await fetch(api('/api/Product'), { headers: { accept: '*/*' } })
    if (res.ok) allProducts.value = await res.json()
  } catch { /* silent */ }
}

async function loadCategories() {
  try {
    const res = await fetch(api('/api/Category'), { headers: { accept: '*/*' } })
    if (res.ok) categories.value = await res.json()
  } catch { /* silent */ }
}

function scrollShowcase(direction) {
  if (!showcaseTrackRef.value) return
  const scrollAmount = showcaseTrackRef.value.offsetWidth * 0.8
  showcaseTrackRef.value.scrollBy({ left: direction * scrollAmount, behavior: 'smooth' })
}

function goToProduct(p) {
  router.push({ path: '/produit-details', query: { id: p.productId } })
}


const menuImages = import.meta.glob('../assets/images/menu/*.{jpg,jpeg,png,webp}', {
  eager: true,
  query: '?url',
  import: 'default'
})
const slides = Object.values(menuImages)

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
  loadProducts()
  loadCategories()
  window.addEventListener('keydown', handleKeydown)
  
  // Intersection Observer for Videos
  const videoObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const video = entry.target
      if (entry.isIntersecting) {
        video.play().catch(() => {}) // Handle potential play() errors/blocking
      } else {
        video.pause()
      }
    })
  }, { threshold: 0.1 })

  const videos = document.querySelectorAll('video')
  videos.forEach(v => videoObserver.observe(v))
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
  will-change: transform, opacity;
}

.animate-fade-in-delay {
  animation: fadeInUp 1s ease-out 0.3s both;
  will-change: transform, opacity;
}

.animate-fade-in-up-delay {
  animation: fadeInUp 1s ease-out 0.6s both;
  will-change: transform, opacity;
}

.animate-fade-in-up-delay-2 {
  animation: fadeInUp 1s ease-out 0.9s both;
  will-change: transform, opacity;
}

.animate-float {
  animation: float 3s ease-in-out infinite;
  will-change: transform;
}

.animate-float-delay {
  animation: float 3s ease-in-out infinite 1s;
  will-change: transform;
}

.animate-float-delay-2 {
  animation: float 3s ease-in-out infinite 2s;
  will-change: transform;
}

.animate-sushi-float-1 {
  animation: sushiFloat1 12s ease-in-out infinite;
  will-change: transform;
}

.animate-sushi-float-2 {
  animation: sushiFloat2 10s ease-in-out infinite;
  will-change: transform;
}

.animate-sushi-float-3 {
  animation: sushiFloat3 14s ease-in-out infinite;
  will-change: transform;
}

.animate-sushi-float-4 {
  animation: sushiFloat4 8s ease-in-out infinite;
  will-change: transform;
}

.animate-sushi-float-5 {
  animation: sushiFloat5 11s ease-in-out infinite;
  will-change: transform;
}

.animate-sushi-float-6 {
  animation: sushiFloat6 9s ease-in-out infinite;
  will-change: transform;
}

.animate-sushi-float-7 {
  animation: sushiFloat7 13s ease-in-out infinite;
  will-change: transform;
}

/* ============================================
   HERO SEARCH
============================================ */
.hero-search-wrapper {
  margin-top: 32px;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  z-index: 50;
  width: 100%;
  max-width: 520px;
  margin-left: auto;
  margin-right: auto;
}

.hero-search-box {
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-radius: 999px;
  border: 2px solid rgba(255, 255, 255, 0.6);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
  padding: 6px 6px 6px 20px;
  width: 100%;
  max-width: 520px;
  transition: box-shadow 0.2s, border-color 0.2s;
}

@media (max-width: 480px) {
  .hero-search-box {
    padding: 2px 2px 2px 14px;
    border-radius: 20px;
  }
  .hero-search-input {
    font-size: 0.9rem;
  }
}

/* Dropdown */
.search-dropdown {
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  right: 0;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 16px 48px rgba(0, 0, 0, 0.16);
  border: 1px solid #f0f0f0;
  overflow: hidden;
  z-index: 100;
  list-style: none;
  margin: 0;
  padding: 6px;
}

.search-dropdown--empty {
  padding: 20px;
  text-align: center;
  color: #6b7280;
  font-size: 0.9rem;
}

.search-dropdown-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
  border-radius: 10px;
  cursor: pointer;
  transition: background 0.15s;
}

.search-dropdown-item:hover {
  background: #fef2f2;
}

.search-dropdown-img {
  width: 44px;
  height: 44px;
  border-radius: 10px;
  object-fit: cover;
  flex-shrink: 0;
  background: #f3f4f6;
}

.search-dropdown-img--placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.4rem;
  background: #fef2f2;
}

.search-dropdown-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
  text-align: left;
}

.search-dropdown-name {
  font-size: 0.92rem;
  font-weight: 600;
  color: #111;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.search-dropdown-price {
  font-size: 0.8rem;
  color: #dc2626;
  font-weight: 600;
}

.search-dropdown-arrow {
  width: 16px;
  height: 16px;
  color: #9ca3af;
  flex-shrink: 0;
}

/* Dropdown transition */
.dropdown-fade-enter-active,
.dropdown-fade-leave-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}

.dropdown-fade-enter-from,
.dropdown-fade-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}

.hero-search-box:focus-within {
  border-color: #dc2626;
  box-shadow: 0 0 0 4px rgba(220, 38, 38, 0.12), 0 8px 32px rgba(0, 0, 0, 0.14);
}

.hero-search-icon {
  flex-shrink: 0;
  width: 20px;
  height: 20px;
  color: #9ca3af;
  pointer-events: none;
  margin-right: 10px;
}

.hero-search-input {
  flex: 1;
  border: none;
  background: transparent;
  font-size: 1rem;
  color: #111;
  outline: none;
  min-width: 0;
}

.hero-search-input::placeholder {
  color: #9ca3af;
}

.hero-search-clear {
  flex-shrink: 0;
  color: #9ca3af;
  cursor: pointer;
  font-size: 14px;
  padding: 4px 10px;
  border-radius: 50%;
  transition: color 0.2s;
}

.hero-search-clear:hover {
  color: #374151;
}

/* Hover effects for buttons */
button:hover {
  transform: translateY(-2px);
}

/* Responsive text sizing */
@media (max-width: 640px) {
  .animate-fade-in-up h1 {
    font-size: 2.2rem;
  }
}
/* ============================================
   SHOWCASE SECTION
============================================ */
.showcase-section {
  position: relative;
  z-index: 20;
  border-top: 1px solid #f0f0f0;
  border-bottom: 1px solid #f0f0f0;
}

.showcase-cat-pill {
  padding: 10px 24px;
  border-radius: 99px;
  background: #f3f4f6;
  color: #4b5563;
  font-weight: 600;
  font-size: 0.9rem;
  transition: all 0.3s ease;
  border: 1px solid transparent;
}

.showcase-cat-pill:hover {
  background: #e5e7eb;
  color: #111;
  transform: translateY(-2px);
}

.showcase-cat-pill.active {
  background: #dc2626;
  color: #fff;
  box-shadow: 0 10px 20px rgba(220, 38, 38, 0.2);
}

.showcase-slider-wrapper {
  position: relative;
  padding: 0 12px;
}

@media (min-width: 768px) {
  .showcase-slider-wrapper {
    padding: 0 50px;
  }
}

.showcase-track {
  display: flex;
  gap: 24px;
  overflow-x: auto;
  padding: 20px 0;
  scroll-snap-type: x mandatory;
  scroll-behavior: smooth;
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none;  /* IE and Edge */
}

.showcase-track::-webkit-scrollbar {
  display: none; /* Chrome, Safari and Opera */
}

.showcase-card {
  flex: 0 0 calc(50% - 6px);
  max-width: calc(50% - 6px);
  background: #fff;
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
  transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
  border: 1px solid rgba(0, 0, 0, 0.03);
  scroll-snap-align: start;
  position: relative;
}

@media (min-width: 1024px) {
  .showcase-card {
    flex: 0 0 calc(25% - 18px);
    max-width: calc(25% - 18px);
  }
}

.showcase-card:hover {
  transform: translateY(-10px) scale(1.02);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
}

.showcase-card-img-wrap {
  position: relative;
  aspect-ratio: 16/10;
  overflow: hidden;
}

.showcase-card-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s ease;
}

.showcase-card:hover .showcase-card-img {
  transform: scale(1.1);
}

.showcase-card-img--placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.5rem;
  background: #f9fafb;
}

.showcase-card-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.showcase-card:hover .showcase-card-overlay {
  opacity: 1;
}

.view-btn {
  background: #fff;
  color: #111;
  padding: 8px 16px;
  border-radius: 99px;
  font-weight: 700;
  font-size: 0.8rem;
  transform: translateY(20px);
  transition: all 0.4s ease;
}

.showcase-card:hover .view-btn {
  transform: translateY(0);
}

.showcase-card-info {
  padding: 16px;
  text-align: center;
}

.showcase-card-name {
  font-weight: 700;
  color: #111;
  font-size: 1rem;
  margin-bottom: 4px;
}

.showcase-card-price {
  color: #dc2626;
  font-weight: 800;
  font-size: 1.1rem;
}

.showcase-nav-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 44px;
  height: 44px;
  background: #fff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  z-index: 10;
  color: #111;
  transition: all 0.3s ease;
  border: 1px solid #f0f0f0;
}

.showcase-nav-btn:hover {
  background: #dc2626;
  color: #fff;
  transform: translateY(-50%) scale(1.1);
}

.showcase-nav-btn--prev { left: 0; }
.showcase-nav-btn--next { right: 0; }

.showcase-nav-btn svg {
  width: 20px;
  height: 20px;
}

.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

/* Responsive adjustments */
@media (max-width: 1024px) {
  .showcase-card {
    flex: 0 0 260px;
  }
}

@media (max-width: 768px) {
  .showcase-cat-pill {
    padding: 8px 18px;
    font-size: 0.8rem;
  }
  .showcase-slider-wrapper {
    padding: 0 20px;
  }
  .showcase-track {
    gap: 16px;
    padding: 10px 0;
  }
  .showcase-nav-btn {
    display: none;
  }
  .showcase-card {
    flex: 0 0 220px;
    border-radius: 16px;
  }
}

@media (max-width: 480px) {
  .showcase-cat-pill {
    white-space: nowrap;
    padding: 6px 14px;
  }
  .showcase-card {
    flex: 0 0 calc(50% - 10px);
    border-radius: 12px;
  }
  .showcase-track {
    gap: 12px;
  }
  .showcase-card-info {
    padding: 10px;
  }
  .showcase-card-name {
    font-size: 0.8rem;
    line-height: 1.2;
    min-height: 2.2rem; /* Fix for 2 lines */
  }
  .showcase-card-price {
    font-size: 0.9rem;
  }
}

/* Mobile landing layout */
@media (max-width: 640px) {
  .hero-section {
    padding: 18px 0 104px !important;
    background: #E3E3E3 !important;
  }

  .hero-decorations {
    display: block;
    opacity: 0.22;
    pointer-events: none;
  }

  .hero-section > .w-full {
    padding-top: 0;
  }

  .hero-section h1 {
    margin-top: 4px;
    font-size: 2.45rem;
    line-height: 1.08;
    letter-spacing: -0.04em;
  }

  .hero-section h1 span:last-child {
    margin-top: 2px;
    font-size: 2.65rem;
  }

  .hero-section .flex.flex-row button {
    padding: 11px 30px;
    font-size: 0.95rem;
    background: rgba(255, 255, 255, 0.72);
  }

  .hero-section .flex.items-center.md\:justify-center {
    margin-top: 24px;
    padding-bottom: 0;
    gap: 10px;
  }

  .showcase-slider-wrapper {
    margin-top: 12px !important;
    padding: 0 16px;
  }

  .showcase-track {
    gap: 14px;
    padding: 10px 0 18px;
  }

  .showcase-card {
    display: flex;
    flex-direction: column;
    flex-basis: calc(82% - 7px);
    max-width: calc(82% - 7px);
    min-height: 440px;
    border-radius: 18px;
    box-shadow: 0 8px 24px rgba(17, 24, 39, 0.1);
  }

  .showcase-card-img-wrap {
    aspect-ratio: 1 / 1.18;
  }

  .showcase-card-info {
    display: flex;
    min-height: 108px;
    flex: 1;
    flex-direction: column;
    justify-content: center;
    gap: 7px;
    padding: 11px 12px 13px;
  }

  .showcase-card-name {
    min-height: auto;
    font-size: 0.82rem;
  }

  .showcase-card-price {
    font-size: 0.95rem;
    font-weight: 800;
  }

  .mobile-menu-link {
    margin-top: 4px !important;
  }

  .mobile-menu-link button {
    padding: 10px 24px;
    border-color: #cbd5e1;
    background: rgba(255, 255, 255, 0.65);
    box-shadow: 0 4px 14px rgba(15, 23, 42, 0.06);
  }

  .landing-fab {
    right: 16px;
    bottom: 84px;
  }

  .landing-fab button {
    width: 58px;
    height: 58px;
    border-width: 3px;
  }
}

/* Editorial home refresh */
.hero-section {
  background: #E3E3E3 !important;
}

.hero-kicker {
  margin: 8px 0 0;
  color: #b4534b;
  font-size: 0.72rem;
  font-weight: 800;
  letter-spacing: 0.16em;
  text-transform: uppercase;
}

.showcase-heading {
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 16px;
  max-width: 1120px;
  margin: 30px auto 0;
  padding: 0 4px;
  text-align: left;
}

.showcase-eyebrow {
  margin: 0 0 4px;
  color: #9a6b64;
  font-size: 0.72rem;
  font-weight: 800;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.showcase-heading h2 {
  margin: 0;
  color: #172033;
  font-size: clamp(1.35rem, 3vw, 2rem);
  font-weight: 850;
  letter-spacing: -0.03em;
}

.showcase-heading-mark {
  flex-shrink: 0;
  color: #b4534b;
  font-size: 0.75rem;
  font-weight: 800;
  white-space: nowrap;
}

.hero-decorations {
  opacity: 0.3;
  z-index: 1;
  pointer-events: none;
}

.showcase-card {
  border-color: rgba(23, 32, 51, 0.06);
  box-shadow: 0 12px 30px rgba(23, 32, 51, 0.08);
}

.showcase-card-info {
  background: rgba(255, 255, 255, 0.94);
}

@media (max-width: 640px) {
  .hero-section {
    padding-top: 14px !important;
    padding-bottom: 96px !important;
  }

  .hero-kicker {
    margin-top: 2px;
    font-size: 0.62rem;
    letter-spacing: 0.12em;
  }

  .hero-section h1 {
    margin-top: 8px;
    display: flex;
    flex-direction: row !important;
    flex-wrap: nowrap;
    gap: 8px;
    white-space: nowrap;
    font-size: 1.95rem;
    letter-spacing: -0.05em;
  }

  .hero-section h1 span:last-child {
    margin-top: 0;
    font-size: 2.05rem;
  }

  .hero-section .flex.flex-row {
    margin-top: 14px;
  }

  .showcase-heading {
    align-items: center;
    justify-content: center;
    margin-top: 26px;
    padding: 0 8px;
    text-align: center;
  }

  .showcase-eyebrow {
    font-size: 0.6rem;
    letter-spacing: 0.1em;
  }

  .showcase-heading h2 {
    font-size: 1.3rem;
  }

  .showcase-heading-mark {
    padding: 6px 9px;
    border: 1px solid #f0b7b0;
    border-radius: 999px;
    background: #fff7f5;
    font-size: 0.66rem;
  }

  .showcase-slider-wrapper {
    margin-top: 4px !important;
    padding: 0 12px;
  }

  .showcase-track {
    gap: 12px;
    padding: 10px 4px 18px;
    scroll-snap-type: x mandatory;
    scroll-padding-left: 4px;
  }

  .showcase-card {
    display: flex;
    flex-direction: column;
    flex-basis: calc(50% - 6px);
    max-width: calc(50% - 6px);
    min-height: 0;
    border-radius: 16px;
    scroll-snap-align: start;
  }

  .showcase-card-img-wrap {
    min-height: 0;
    aspect-ratio: 1 / 1.02;
  }

  .showcase-card-info {
    min-height: 82px;
    gap: 5px;
    padding: 10px 10px 12px;
    text-align: center;
  }

  .showcase-card-name {
    font-size: 0.78rem;
    font-weight: 800;
  }

  .showcase-card-price {
    font-size: 0.88rem;
  }


  .showcase-card .absolute.bottom-3 {
    right: 8px;
    bottom: 8px;
    width: 36px;
    height: 36px;
  }

  .showcase-card .absolute.bottom-3 svg {
    width: 18px;
    height: 18px;
  }
}

/* Mobile reference layout: image-led hero with compact menu browsing. */
.mobile-hero-tagline {
  display: none;
}

@media (max-width: 640px) {
  .hero-section {
    min-height: 0 !important;
    padding: 18px 0 34px !important;
    color: #172033;
    background-color: #E3E3E3 !important;
    background-image: none;
  }

  .hero-section::before {
    position: absolute;
    top: 92px;
    right: -42px;
    z-index: 0;
    width: 62%;
    height: 245px;
    content: '';
    background: url('../assets/images/sushi1.jpg') center / cover no-repeat;
    border-radius: 42% 0 0 42%;
    opacity: 0.92;
    pointer-events: none;
  }

  .hero-decorations {
    display: none !important;
  }

  .hero-section > .w-full {
    padding: 0 18px;
  }

  .hero-section h1 {
    display: block !important;
    margin: 30px 0 0;
    color: #172033 !important;
    font-size: 2.05rem !important;
    line-height: 1.05;
    letter-spacing: -0.04em;
    text-align: left;
  }

  .hero-section h1 span {
    display: block;
  }

  .hero-section h1 span:last-child {
    margin-top: 4px;
    color: #dc2626 !important;
    font-size: 2.05rem !important;
  }

  .mobile-hero-tagline {
    display: block;
    margin: 7px 0 0;
    color: #374151;
    font-size: 0.85rem;
    font-weight: 600;
    text-align: left;
  }

  .hero-section .flex.flex-row {
    justify-content: flex-start;
    gap: 10px;
    margin-top: 22px;
  }

  .hero-section .flex.flex-row button {
    min-height: 40px;
    padding: 9px 18px;
    border-radius: 999px;
    font-size: 0.72rem;
  }

  .hero-section .flex.flex-row button:first-child {
    display: inline-flex !important;
    background: #dc2626;
    color: #fff;
    border: 1px solid #dc2626;
  }

  .hero-section .flex.flex-row button:last-child {
    border-color: rgba(23, 32, 51, 0.72);
    color: #172033;
    background: rgba(255, 255, 255, 0.42);
  }

  .hero-section .flex.items-center.md\:justify-center {
    justify-content: flex-start;
    gap: 8px;
    margin: 26px -18px 0;
    padding: 0 18px 4px;
  }

  .showcase-cat-pill {
    padding: 7px 13px;
    border: 1px solid rgba(23, 32, 51, 0.28);
    background: rgba(255, 255, 255, 0.42);
    color: #172033;
    font-size: 0.7rem;
    white-space: nowrap;
  }

  .showcase-cat-pill:hover {
    background: rgba(255, 255, 255, 0.72);
    color: #172033;
  }

  .showcase-cat-pill.active {
    background: #dc2626;
    border-color: #dc2626;
    color: #fff;
    box-shadow: none;
  }

  .showcase-slider-wrapper {
    margin: 8px -18px 0 !important;
    padding: 0 18px;
  }

  .showcase-nav-btn {
    display: none;
  }

  .showcase-track {
    gap: 12px;
    padding: 10px 0 18px;
  }

  .showcase-card {
    flex: 0 0 84%;
    max-width: 84%;
    border: 1px solid rgba(23, 32, 51, 0.12);
    border-radius: 14px;
    background: #e5e5e5;
    box-shadow: 0 12px 28px rgba(23, 32, 51, 0.16);
  }

  .showcase-card-img-wrap {
    aspect-ratio: 1.55 / 1;
  }

  .showcase-card-info {
    min-height: 76px;
    padding: 11px 14px 13px;
    background: transparent;
    text-align: left;
  }

  .showcase-card-name {
    color: #172033;
    font-size: 0.9rem;
  }

  .showcase-card-price {
    color: #dc2626;
    font-size: 0.95rem;
  }

  .showcase-card .absolute.bottom-3 {
    background: #dc2626;
    color: #fff;
  }
}
</style>
