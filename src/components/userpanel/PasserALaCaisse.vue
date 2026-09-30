<template>
  <div class="min-h-screen bg-white">
    <!-- Header -->
    <section class="bg-white/95 border-b border-gray-100">
      <div class="mx-auto max-w-7xl px-3 sm:px-4 md:px-6 lg:px-8 py-3 sm:py-4">
        <h1 class="text-xl sm:text-2xl md:text-3xl font-extrabold text-gray-900">Finaliser votre commande</h1>
      </div>
    </section>
    <!-- Content -->
    <section class="py-4 sm:py-6 md:py-8">
      <div class="mx-auto max-w-5xl px-3 sm:px-4 md:px-6 lg:px-8 space-y-4 sm:space-y-6">
        
        <!-- Section 1: User Information -->
        <div ref="personalInfoSection" class="bg-white rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl border border-gray-100 overflow-hidden">
          <div class="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-0">
            <h2 class="text-base sm:text-lg font-semibold text-gray-900">Informations personnelles</h2>
            <button @click="loadUserInfo" class="inline-flex min-h-11 items-center justify-center rounded-lg border border-gray-200 bg-white px-3 text-xs font-semibold text-gray-700 transition-colors hover:border-gray-300 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 sm:min-h-10 sm:border-0 sm:bg-transparent sm:px-0 sm:text-sm sm:font-normal sm:text-gray-500 sm:hover:text-gray-800">Rafraîchir</button>
          </div>
          <div class="px-4 sm:px-6 py-4 sm:py-5">
            <div v-if="isUserLoading" class="py-8 text-center text-gray-500">Chargement des informations...</div>
            <div v-else-if="userInfo" class="space-y-4">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                <div class="min-w-0">
                  <label class="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Nom</label>
                  <div class="min-h-12 break-words [overflow-wrap:anywhere] px-3 sm:px-4 py-2 sm:py-3 bg-gray-50 rounded-lg sm:rounded-xl text-gray-900 text-sm sm:text-base">{{ userInfo.name || '—' }}</div>
                </div>
                <div class="min-w-0">
                  <label class="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Email</label>
                  <div class="min-h-12 break-words [overflow-wrap:anywhere] px-3 sm:px-4 py-2 sm:py-3 bg-gray-50 rounded-lg sm:rounded-xl text-gray-900 text-sm sm:text-base">{{ userInfo.email || '—' }}</div>
                </div>
                <div class="min-w-0">
                  <label class="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Adresse</label>
                  <div :class="['min-h-12 break-words [overflow-wrap:anywhere] px-3 sm:px-4 py-2 sm:py-3 bg-gray-50 rounded-lg sm:rounded-xl text-sm sm:text-base', isPlaceholderValue(userInfo.address) ? 'text-amber-700 italic' : 'text-gray-900']">
                    {{ isPlaceholderValue(userInfo.address) ? 'Veuillez saisir votre adresse exacte (numéro, rue, quartier et ville).' : userInfo.address }}
                  </div>
                </div>
                <div class="min-w-0">
                  <label class="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Téléphone</label>
                  <div :class="['min-h-12 break-words [overflow-wrap:anywhere] px-3 sm:px-4 py-2 sm:py-3 bg-gray-50 rounded-lg sm:rounded-xl text-sm sm:text-base', isPlaceholderValue(userInfo.phone) ? 'text-amber-700 italic' : 'text-gray-900']">
                    {{ isPlaceholderValue(userInfo.phone) ? 'Veuillez saisir un numéro de téléphone joignable.' : userInfo.phone }}
                  </div>
                </div>
                </div>
              
              <!-- Validation Status and Actions -->
              <div class="space-y-3 pt-2">
                <!-- Warning message if info is incomplete -->
                <div v-if="!isUserInfoValid" class="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                  <div class="flex items-start">
                    <svg class="w-5 h-5 text-amber-600 mt-0.5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
                    </svg>
                    <div class="text-sm">
                      <p class="font-medium text-amber-800">Informations incomplètes</p>
                      <p class="text-amber-700 mt-1">{{ userInfoValidationMessage }}</p>
                </div>
                </div>
              </div>
              
              </div>
            </div>
            <div v-else class="py-8 text-center text-gray-500">
              <template v-if="!isAuthenticated">
                <p class="text-base font-semibold text-gray-900 mb-2">Veuillez vous connecter s'il vous plaît</p>
                <p class="text-sm text-gray-500 mb-4">Vous devez être connecté pour finaliser votre commande.</p>
                <button @click="router.push('/login')" class="inline-flex items-center justify-center rounded-lg bg-red-600 px-6 h-10 text-sm font-semibold text-white shadow-sm hover:bg-red-700 transition-all active:scale-95">Se connecter</button>
              </template>
              <template v-else>
                <p>Impossible de charger les informations utilisateur</p>
                <button @click="loadUserInfo" class="mt-2 text-red-600 hover:text-red-700 text-sm">Réessayer</button>
              </template>
            </div>
            <div class="mt-4 flex flex-col gap-3 border-t border-gray-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
              <p class="min-w-0 text-xs text-gray-600 sm:text-sm">
                Vérifiez que votre adresse de livraison et votre téléphone sont exacts.
              </p>
              <router-link
                v-if="isAuthenticated"
                ref="modifyProfileButton"
                to="/settings"
                class="inline-flex min-h-11 items-center justify-center gap-2 self-start rounded-lg border border-gray-300 bg-white px-4 text-sm font-semibold text-gray-900 shadow-sm transition-colors hover:border-gray-400 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 active:scale-[0.98] sm:min-h-10 sm:self-auto"
              >
                <svg class="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clip-rule="evenodd"/>
                </svg>
                Modifier
              </router-link>
            </div>
          </div>
        </div>

        <!-- Section 2: Cart -->
        <div class="bg-white rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl border border-gray-100 overflow-hidden">
          <div class="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0">
            <h2 class="text-base sm:text-lg font-semibold text-gray-900">Votre panier</h2>
            <div class="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3">
              <router-link 
                to="/produits" 
                class="inline-flex items-center gap-2 px-3 py-1.5 text-xs sm:text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition"
              >
                <svg class="w-3 sm:w-4 h-3 sm:h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd"/>
                </svg>
                Continuer mes achats
              </router-link>
              <button @click="refreshCart" class="inline-flex min-h-11 items-center justify-center rounded-lg border border-gray-200 bg-white px-3 text-xs font-semibold text-gray-700 transition-colors hover:border-gray-300 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 sm:min-h-10 sm:border-0 sm:bg-transparent sm:px-0 sm:text-sm sm:font-normal sm:text-gray-500 sm:hover:text-gray-800">Rafraîchir</button>
            </div>
          </div>
          <div class="max-h-80 sm:max-h-96 overflow-auto">
            <div v-if="isCartLoading" class="px-4 sm:px-6 py-8 sm:py-12 text-center text-gray-500 text-sm sm:text-base">Chargement…</div>
            <div v-else-if="cartItems.length === 0" class="px-4 sm:px-6 py-8 sm:py-12 text-center text-gray-500">
              <svg class="mx-auto h-10 sm:h-12 w-10 sm:w-12 text-gray-400 mb-3 sm:mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.1 5M7 13l-1.1 5m0 0h9.2M17 13v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6" />
              </svg>
              <p class="text-base sm:text-lg font-medium">Votre panier est vide</p>
              <p class="text-xs sm:text-sm text-gray-500 mt-1">Ajoutez des produits pour continuer</p>
              <router-link to="/produits" class="inline-flex items-center gap-2 mt-3 sm:mt-4 px-3 sm:px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-sm sm:text-base">
                Voir les produits
              </router-link>
            </div>
            <div v-else>
              <div v-for="item in cartItems" :key="item.productId" class="px-4 sm:px-6 py-3 sm:py-4 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 border-b border-gray-50">
                <div class="h-12 w-12 sm:h-16 sm:w-16 rounded-lg bg-gray-100 overflow-hidden flex items-center justify-center flex-shrink-0">
                  <img :src="resolveImage(item.image)" alt="img" class="w-full h-full object-cover" />
                </div>
                <div class="flex-1 min-w-0">
                  <h3 class="text-sm sm:text-base font-semibold text-gray-900 truncate">{{ item.name }}</h3>
                  <p class="text-xs sm:text-sm text-gray-500">Prix unitaire: {{ Number(item.price).toFixed(2) }} DT</p>
                  <p class="mt-1 text-[11px] sm:text-xs text-gray-500">
                    Stock disponible: {{ itemDisplayPieces(item) }} pièce{{ itemDisplayPieces(item) > 1 ? 's' : '' }}
                  </p>
                  <div class="mt-2 inline-flex items-center gap-2 sm:gap-3">
                    <button @click="decrementItem(item)" class="h-11 w-11 sm:h-9 sm:w-9 inline-flex items-center justify-center rounded-lg border border-gray-300 text-gray-700 transition-colors hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 active:bg-gray-100" aria-label="Diminuer">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="h-3 sm:h-4 w-3 sm:w-4"><path d="M5 12.75a.75.75 0 010-1.5h14a.75.75 0 010 1.5H5z"/></svg>
                    </button>
                    <span class="text-xs sm:text-sm text-gray-700 min-w-[1.5rem] sm:min-w-[2rem] text-center font-medium">{{ item.quantity }}</span>
                    <button @click="incrementItem(item)" class="h-11 w-11 sm:h-9 sm:w-9 inline-flex items-center justify-center rounded-lg border border-gray-300 text-gray-700 transition-colors hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 active:bg-gray-100" aria-label="Augmenter">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="h-3 sm:h-4 w-3 sm:w-4"><path d="M12.75 5a.75.75 0 00-1.5 0v6.25H5a.75.75 0 000 1.5h6.25V19a.75.75 0 001.5 0v-6.25H19a.75.75 0 000-1.5h-6.25V5z"/></svg>
                    </button>
                  </div>
                </div>
                <div class="flex items-center justify-between sm:justify-end gap-3 sm:gap-4">
                  <div class="text-right">
                    <div class="text-sm sm:text-lg font-bold text-gray-900">{{ (Number(item.price) * Number(item.quantity)).toFixed(2) }} DT</div>
                  </div>
                  <button @click="deleteItem(item)" class="h-11 w-11 sm:h-10 sm:w-10 inline-flex items-center justify-center rounded-lg border border-gray-300 text-gray-700 transition-colors hover:bg-red-50 hover:text-red-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 active:bg-red-100" aria-label="Supprimer">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="h-4 sm:h-5 w-4 sm:w-5"><path d="M9 3.75A1.5 1.5 0 0 1 10.5 2.25h3A1.5 1.5 0 0 1 15 3.75V4.5h4.5a.75.75 0 0 1 0 1.5H4.5a.75.75 0 0 1 0-1.5H9V3.75ZM6.75 7.5h10.5l-.69 11.044A2.25 2.25 0 0 1 14.318 20.75H9.682a2.25 2.25 0 0 1-2.242-2.206L6.75 7.5Z"/></svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div v-if="cartItems.length > 0" class="px-4 sm:px-6 py-3 sm:py-4 bg-gray-50 border-t border-gray-100">
            <div class="flex items-center justify-between text-base sm:text-lg font-bold text-gray-900">
              <span>Total</span>
              <span>{{ cartTotal.toFixed(2) }} DT</span>
            </div>
          </div>
        </div>

        <!-- Section 3: Payment Method -->
        <div class="bg-white rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl border border-gray-100 overflow-hidden">
          <div class="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-100">
            <h2 class="text-base sm:text-lg font-semibold text-gray-900">Méthode de paiement</h2>
          </div>
          <div class="px-4 sm:px-6 py-4">
            <div class="flex items-center">
              <input type="radio" v-model="paymentMethod" value="espece" checked class="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 flex-shrink-0">
              <span class="ml-3 text-sm sm:text-base font-medium text-gray-900">Espèce (à la livraison)</span>
            </div>
            <p class="mt-3 text-sm text-gray-600">
              <span class="font-semibold text-gray-900">NOTE* :</span> Les frais de livraison varient entre 5 DT et 10 DT selon le kilométrage.
            </p>
          </div>
        </div>

        <!-- Section 4: Comments -->
        <div class="bg-white rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl border border-gray-100 overflow-hidden">
          <div class="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-100">
            <h2 class="text-base sm:text-lg font-semibold text-gray-900">Commentaires</h2>
          </div>
          <div class="px-4 sm:px-6 py-4">
            <textarea 
              v-model="comments" 
              rows="3" 
              class="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm sm:text-base resize-none" 
              placeholder="Instructions spéciales, commentaires sur votre commande..."
            ></textarea>
          </div>
        </div>

        <!-- Action Buttons -->
        <div v-if="cartItems.length > 0" class="flex flex-col sm:flex-row gap-3">
          <router-link to="/produits" class="flex-1 inline-flex min-h-12 items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 text-sm font-semibold text-gray-900 shadow-sm transition-all hover:border-gray-400 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 active:scale-[0.98]">
            Continuer les achats
          </router-link>
          <button 
            @click="confirmOrder" 
            :disabled="isOrderProcessing || !canOrder || !isUserInfoValid"
            :class="[
              'flex-1 inline-flex min-h-12 items-center justify-center gap-2 rounded-lg px-4 text-sm font-semibold shadow transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 active:scale-[0.98]',
              (!canOrder || !isUserInfoValid || isOrderProcessing)
                ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                : 'bg-red-600 text-white hover:bg-red-700'
            ]"
          >
            <svg v-if="isOrderProcessing" class="animate-spin h-4 w-4" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
            </svg>
            <span>
              {{ 
                isOrderProcessing ? 'Traitement...' : 
                (!canOrder ? 'Commandes indisponibles' : 
                'Finaliser la commande')
              }}
            </span>
          </button>
        </div>

        <div
          v-if="showOrderConfirmationModal"
          class="fixed inset-0 z-[100] flex items-center justify-center bg-gray-950/60 px-4 py-5"
          role="presentation"
        >
          <section
            class="w-full max-w-md max-h-[calc(100dvh-2.5rem)] overflow-y-auto rounded-xl bg-white p-5 shadow-2xl sm:p-6"
            role="dialog"
            aria-modal="true"
            aria-labelledby="order-confirmation-title"
          >
            <h2 id="order-confirmation-title" class="text-lg font-bold text-gray-900 sm:text-xl">
              {{ isUserInfoValid ? 'Confirmer votre commande' : 'Informations à compléter' }}
            </h2>
            <p class="mt-1 text-sm text-gray-600">
              {{ isUserInfoValid ? 'Vérifiez les informations de livraison avant de confirmer.' : 'Complétez vos informations dans les paramètres avant de passer commande.' }}
            </p>

            <div v-if="!isUserInfoValid" class="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
              {{ userInfoValidationMessage }}
            </div>

            <dl class="mt-5 divide-y divide-gray-100 rounded-lg border border-gray-200 px-4">
              <div class="grid grid-cols-[5.5rem_minmax(0,1fr)] gap-3 py-3 text-sm">
                <dt class="font-medium text-gray-500">Nom</dt>
                <dd class="break-words text-gray-900">{{ userInfo?.name || 'Non renseigné' }}</dd>
              </div>
              <div class="grid grid-cols-[5.5rem_minmax(0,1fr)] gap-3 py-3 text-sm">
                <dt class="font-medium text-gray-500">Email</dt>
                <dd class="break-all text-gray-900">{{ userInfo?.email || 'Non renseigné' }}</dd>
              </div>
              <div class="grid grid-cols-[5.5rem_minmax(0,1fr)] gap-3 py-3 text-sm">
                <dt class="font-medium text-gray-500">Adresse</dt>
                <dd :class="['break-words', isPlaceholderValue(userInfo?.address) ? 'font-medium text-amber-800' : 'text-gray-900']">
                  {{ isPlaceholderValue(userInfo?.address) ? 'À compléter' : userInfo.address }}
                </dd>
              </div>
              <div class="grid grid-cols-[5.5rem_minmax(0,1fr)] gap-3 py-3 text-sm">
                <dt class="font-medium text-gray-500">Téléphone</dt>
                <dd :class="['break-words', isPlaceholderValue(userInfo?.phone) ? 'font-medium text-amber-800' : 'text-gray-900']">
                  {{ isPlaceholderValue(userInfo?.phone) ? 'À compléter' : userInfo.phone }}
                </dd>
              </div>
              <div class="grid grid-cols-[5.5rem_minmax(0,1fr)] gap-3 py-3 text-sm">
                <dt class="font-medium text-gray-500">Paiement</dt>
                <dd class="break-words text-gray-900">Espèce à la livraison</dd>
              </div>
            </dl>

            <div class="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <button
                type="button"
                @click="modifyOrderInfo"
                class="inline-flex min-h-12 items-center justify-center rounded-lg border border-gray-300 bg-white px-4 text-sm font-semibold text-gray-800 transition-colors hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
              >
                Modifier mes informations
              </button>
              <button
                type="button"
                @click="placeOrder"
                :disabled="isOrderProcessing || !isUserInfoValid || !canOrder"
                class="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-red-600 px-4 text-sm font-semibold text-white transition-colors hover:bg-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <svg v-if="isOrderProcessing" class="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                {{ isOrderProcessing ? 'Traitement...' : 'Confirmer la commande' }}
              </button>
            </div>
          </section>
        </div>

      </div>
    </section>

    <!-- Simple Success Notification -->
    <div v-if="showNotification" class="fixed top-4 left-4 right-4 sm:top-4 sm:right-4 sm:left-auto z-50 max-w-sm sm:w-full">
      <div class="bg-green-500 text-white px-4 sm:px-6 py-3 sm:py-4 rounded-lg shadow-lg success-notification">
        <div class="flex items-center">
          <svg class="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
          </svg>
          <div>
            <h4 class="font-semibold text-sm sm:text-base">Commande confirmée !</h4>
            <p class="text-xs sm:text-sm opacity-90">Total: {{ notificationTotal }} DT</p>
            <p class="text-xs opacity-75 mt-1">Paiement à la livraison</p>
          </div>
        </div>
      </div>
    </div>
    </div>
  </template>
  
  <script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../../stores/auth.js'
import { api, resolveImage } from '../../utils/api.js'

const router = useRouter()
const { user, isAuthenticated } = useAuth()

const isCartLoading = ref(false)
const cartItems = ref([])
const cartMutationQueues = new Map()
const personalInfoSection = ref(null)
const modifyProfileButton = ref(null)
const isUserLoading = ref(false)
const userInfo = ref(null)
const paymentMethod = ref('espece')
const comments = ref('')
const showOrderConfirmationModal = ref(false)
const isOrderProcessing = ref(false)
const showNotification = ref(false)
const notificationTotal = ref('')
const canOrder = ref(true)



// Extract customerId from JWT (nameidentifier claim)
function getCustomerIdFromToken(token) {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    return payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'] || payload.sub || payload.userId || null
  } catch {
    return null
  }
}

function loadCartFromLocal() {
  try {
    const raw = localStorage.getItem('cart')
    const parsed = raw ? JSON.parse(raw) : []
    cartItems.value = Array.isArray(parsed) ? parsed : []
  } catch {
    cartItems.value = []
  }
}

async function loadCartFromServer() {
  const token = user.value?.token
  const customerId = getCustomerIdFromToken(token)
  if (!token || !customerId) { loadCartFromLocal(); return }
  isCartLoading.value = true
  try {
    const res = await fetch(api(`/api/cart/${customerId}`), {
      headers: {
        'accept': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    })
    if (!res.ok) throw new Error('cart fetch failed')
    const data = await res.json()
    cartItems.value = (data?.items || []).map(i => ({
      productId: i.productId,
      name: i.productName,
      price: i.price,
      quantity: i.quantity,
      stock: Number(i.stock ?? i.Stock ?? 0),
      image: ''
    }))
  } catch (e) {
    console.error(e)
    loadCartFromLocal()
  } finally {
    isCartLoading.value = false
  }
}

const cartTotal = computed(() => cartItems.value.reduce((sum, i) => sum + (Number(i.price) * Number(i.quantity) || 0), 0))

function getDisplayStockPieces(item) {
  const quantity = Number(item?.quantity ?? 1)
  const stockValue = Number(item?.stock ?? item?.Stock ?? 0)
  const productStockValue = Number(item?.productStock ?? item?.product?.stock ?? item?.stock ?? 0)
  const resolvedStock = productStockValue > 0 ? productStockValue : stockValue
  const stockPieces = resolvedStock > 0 ? resolvedStock * quantity : quantity
  return Number.isFinite(stockPieces) ? stockPieces : quantity
}

function itemDisplayPieces(item) {
  return getDisplayStockPieces(item)
}

function isPlaceholderValue(value) {
  const normalizedValue = String(value ?? '').trim().toLowerCase()
  return !normalizedValue || normalizedValue === 'temp' || normalizedValue === 'string'
}

const isUserInfoValid = computed(() => {
  if (!userInfo.value) return false

  const email = String(userInfo.value.email ?? '').trim()
  const phone = String(userInfo.value.phone ?? '').trim()

  const hasValidEmail = email.length > 0 && !isPlaceholderValue(email)
  const hasValidPhone = phone.length > 0 && !isPlaceholderValue(phone)

  return hasValidEmail && hasValidPhone
})

const userInfoValidationMessage = computed(() => {
  if (!userInfo.value) return 'Impossible de charger les informations utilisateur.'

  const email = String(userInfo.value.email ?? '').trim()
  const phone = String(userInfo.value.phone ?? '').trim()
  const missing = []

  if (!email || isPlaceholderValue(email)) {
    missing.push('Email')
  }

  if (!phone || isPlaceholderValue(phone)) {
    missing.push('Téléphone')
  }

  if (missing.length === 0) return ''

  if (missing.length === 1) {
    return `Veuillez compléter votre ${missing[0].toLowerCase()}.`
  }

  return `Veuillez compléter votre ${missing[0].toLowerCase()} et votre ${missing[1].toLowerCase()}.`
})


async function refreshCart() {
  if (user.value?.token) {
    await loadCartFromServer()
  } else {
    loadCartFromLocal()
  }
  await ensureCartImages()
}

function handleCartUpdated(event) {
  if (Array.isArray(event?.detail?.items)) {
    cartItems.value = event.detail.items
    return
  }
  refreshCart()
}

function publishCartUpdate() {
  window.dispatchEvent(new CustomEvent('cart-updated', { detail: { items: cartItems.value } }))
}

function applyQuantityDelta(item, delta) {
  const existingItem = cartItems.value.find(cartItem => cartItem.productId === item.productId)
  if (!existingItem) {
    if (delta > 0) cartItems.value = [...cartItems.value, { ...item, quantity: delta }]
    return
  }

  const nextQuantity = Number(existingItem.quantity) + delta
  cartItems.value = nextQuantity > 0
    ? cartItems.value.map(cartItem => cartItem.productId === item.productId
      ? { ...cartItem, quantity: nextQuantity }
      : cartItem)
    : cartItems.value.filter(cartItem => cartItem.productId !== item.productId)
}

function queueCartMutation(productId, mutation) {
  const previousMutation = cartMutationQueues.get(productId) || Promise.resolve()
  const nextMutation = previousMutation.catch(() => {}).then(mutation)
  cartMutationQueues.set(productId, nextMutation)
  nextMutation.finally(() => {
    if (cartMutationQueues.get(productId) === nextMutation) cartMutationQueues.delete(productId)
  }).catch(() => {})
  return nextMutation
}

function changeCartQuantity(item, delta) {
  const existingItem = cartItems.value.find(cartItem => cartItem.productId === item.productId)
  if (delta < 0 && (!existingItem || Number(existingItem.quantity) <= 0)) return

  applyQuantityDelta(item, delta)
  publishCartUpdate()

  const token = user.value?.token
  const customerId = token ? getCustomerIdFromToken(token) : null
  if (!token || !customerId) {
    try {
      localStorage.setItem('cart', JSON.stringify(cartItems.value))
    } catch (error) {
      console.error('Error saving local cart:', error)
    }
    return
  }

  queueCartMutation(item.productId, async () => {
    const response = delta > 0
      ? await fetch(api(`/api/cart/${customerId}/items`), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'accept': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ productId: item.productId, quantity: 1 })
      })
      : await fetch(api(`/api/cart/${customerId}/items/${item.productId}`), {
        method: 'DELETE',
        headers: { 'accept': 'application/json', 'Authorization': `Bearer ${token}` }
      })
    if (!response.ok) throw new Error('Cart quantity update failed')
  }).catch(error => {
    console.error('Error updating cart quantity:', error)
    applyQuantityDelta(item, -delta)
    publishCartUpdate()
  })
}

function incrementItem(item) {
  changeCartQuantity(item, 1)
}

function decrementItem(item) {
  changeCartQuantity(item, -1)
}

async function deleteItem(item) {
  const token = user.value?.token
  const customerId = token ? getCustomerIdFromToken(token) : null
  if (token && customerId) {
    try {
      const res = await fetch(api(`/api/cart/${customerId}/products/${item.productId}`), {
        method: 'DELETE',
        headers: {
          'accept': 'text/plain',
          'Authorization': `Bearer ${token}`
        }
      })
      if (!res.ok) throw new Error('delete product failed')
      await refreshCart()
      window.dispatchEvent(new Event('cart-updated'))
      return
    } catch (e) {
      console.error(e)
    }
  }
  try {
    const raw = localStorage.getItem('cart')
    const cart = raw ? JSON.parse(raw) : []
    const next = cart.filter(i => i.productId !== item.productId)
    localStorage.setItem('cart', JSON.stringify(next))
    await refreshCart()
    window.dispatchEvent(new Event('cart-updated'))
  } catch (e) {
    console.error(e)
  }
}

// Load user information from API
async function loadUserInfo() {
  const token = user.value?.token
  if (!token) {
    userInfo.value = null
    return
  }

  isUserLoading.value = true
  try {
    const res = await fetch(api('/api/Users/me'), {
      method: 'GET',
      headers: {
        'accept': '*/*',
        'Authorization': `Bearer ${token}`
      },
      cache: 'no-store'
    })
    if (!res.ok) throw new Error('Failed to fetch user info')
    userInfo.value = await res.json()
  } catch (e) {
    console.error('Error loading user info:', e)
    userInfo.value = null
  } finally {
    isUserLoading.value = false
  }
}

async function fetchCanOrder() {
  try {
    const res = await fetch(api('/api/CanOrder'), { 
      headers: { 'accept': 'application/json' } 
    })
    if (!res.ok) throw new Error('CanOrder fetch failed')
    const data = await res.json()
    canOrder.value = data?.isEnabled !== false
  } catch (e) {
    console.error('Error fetching CanOrder:', e)
  }
}

function scrollToModifyButton() {
  window.setTimeout(() => {
    const target = modifyProfileButton.value?.$el || modifyProfileButton.value || personalInfoSection.value
    if (!target) return

    const bodyCanScroll = document.body.scrollHeight > document.body.clientHeight
    const scrollContainer = bodyCanScroll
      ? document.body
      : document.scrollingElement || document.documentElement
    const targetTop = target.getBoundingClientRect().top + scrollContainer.scrollTop
    const visibleOffset = Math.max(100, window.innerHeight * 0.25)
    scrollContainer.scrollTop = Math.max(0, targetTop - visibleOffset)
  }, 100)
}

// Confirm order
async function confirmOrder() {
  if (!canOrder.value) {
    alert('Désolé, les commandes sont temporairement désactivées. Veuillez réessayer plus tard.')
    return
  }
  const token = user.value?.token
  const customerId = getCustomerIdFromToken(token)
  
  if (!token || !customerId) {
    alert('Vous devez être connecté pour finaliser la commande.')
    return
  }

  await loadUserInfo()

  if (!isUserInfoValid.value) {
    showOrderConfirmationModal.value = true
    return
  }

  if (cartItems.value.length === 0) {
    alert('Votre panier est vide.')
    return
  }

  showOrderConfirmationModal.value = true
}

function modifyOrderInfo() {
  showOrderConfirmationModal.value = false
  scrollToModifyButton()
}

async function placeOrder() {
  showOrderConfirmationModal.value = false
  const token = user.value?.token
  const customerId = getCustomerIdFromToken(token)
  if (!token || !customerId) {
    alert('Vous devez être connecté pour finaliser votre commande.')
    return
  }

  isOrderProcessing.value = true

  try {
    const response = await fetch(api(`/api/order/confirm/${customerId}`), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(comments.value || '')
    })

    if (!response.ok) {
      throw new Error('Erreur lors de la confirmation de la commande')
    }

    // Success - show custom notification
    notificationTotal.value = cartTotal.value.toFixed(2)
    showNotification.value = true
    
    // Auto-hide notification after 4 seconds
    setTimeout(() => {
      showNotification.value = false
    }, 4000)

    // Clear cart and reset form
    localStorage.removeItem('cart')
    cartItems.value = []
    comments.value = ''
    window.dispatchEvent(new Event('cart-updated'))

  } catch (error) {
    console.error('Error confirming order:', error)
    alert('Une erreur est survenue lors de la confirmation de la commande. Veuillez réessayer.')
  } finally {
    isOrderProcessing.value = false
  }
}

// Ensure each cart item has an image by fetching products once
let cachedProducts = null
async function ensureCartImages() {
  try {
    const need = cartItems.value.some(i => !i.image)
    if (!need) return
    if (!cachedProducts) {
      const res = await fetch(api('/api/Product'), { headers: { 'accept': '*/*' } })
      if (!res.ok) throw new Error('products fetch failed')
      cachedProducts = await res.json()
    }
    const productMap = new Map()
    for (const p of cachedProducts || []) {
      if (p?.productId) {
        productMap.set(p.productId, {
          image: Array.isArray(p.imageUrls) ? p.imageUrls[0] : '',
          stock: Number(p.stock ?? p.Stock ?? 0)
        })
      }
    }
    cartItems.value = cartItems.value.map(i => ({
      ...i,
      image: i.image || productMap.get(i.productId)?.image || '',
      stock: Number(productMap.get(i.productId)?.stock ?? i.stock ?? i.Stock ?? 0)
    }))
  } catch (e) {
    console.error(e)
  }
}

onMounted(() => {
  refreshCart()
  loadUserInfo()
  fetchCanOrder()
  window.addEventListener('cart-updated', handleCartUpdated)
})

onUnmounted(() => {
  window.removeEventListener('cart-updated', handleCartUpdated)
})
  </script>
  
  <style scoped>
  /* Notification animations */
  .notification-enter-active {
    transition: all 0.3s ease-out;
  }
  
  .notification-leave-active {
    transition: all 0.3s ease-in;
  }
  
  .notification-enter-from {
    transform: translateX(100%);
    opacity: 0;
  }
  
  .notification-leave-to {
    transform: translateX(100%);
    opacity: 0;
  }

  /* Custom notification styles */
  .success-notification {
    animation: slideInRight 0.3s ease-out;
  }

  @keyframes slideInRight {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }

  /* Hover effect for notification */
  .success-notification:hover {
    transform: scale(1.02);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  }
  </style>
  