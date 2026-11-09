<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <section class="bg-white border-b border-gray-200 shadow-sm">
      <div class="mx-auto max-w-7xl px-3 sm:px-4 md:px-6 lg:px-8 py-6 sm:py-8">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2">Gestion des commandes</h1>
            <p class="text-sm sm:text-base text-gray-600">Surveillez et gérez toutes les commandes de votre restaurant</p>
          </div>
          <div class="hidden sm:flex items-center space-x-4">
            <div class="text-right">
              <div class="text-2xl font-bold text-red-600">{{ orders.length }}</div>
              <div class="text-xs text-gray-500 uppercase tracking-wide">Commandes</div>
            </div>
            <div class="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Stock Requirements Dashboard -->
    <section v-if="stockData" class="bg-indigo-900 text-white py-8">
      <div class="mx-auto max-w-7xl px-3 sm:px-4 md:px-6 lg:px-8">
        <div class="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h2 class="text-2xl font-bold">Besoins de Stock (Temps Réel)</h2>
            <p class="text-indigo-200 text-sm mt-1">Estimations basées sur {{ stockData.totalPendingOrders }} commande(s) non livrée(s)</p>
          </div>
          <button @click="refreshAllData" class="self-start md:self-auto bg-indigo-800 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
            Actualiser
          </button>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <!-- KPI Cards -->
          <div class="lg:col-span-3 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div class="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10">
              <div class="text-indigo-200 text-xs uppercase tracking-wider font-semibold mb-1">Rouleaux Totaux</div>
              <div class="text-3xl font-bold">{{ stockData.totalRollouts }}</div>
            </div>
            <div class="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10">
              <div class="text-indigo-200 text-xs uppercase tracking-wider font-semibold mb-1">CA en Attente</div>
              <div class="text-3xl font-bold" v-if="pendingTotalData">{{ pendingTotalData.totalPendingAmount }} DT</div>
              <div class="text-3xl font-bold" v-else>...</div>
            </div>
             <div class="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10">
              <div class="text-indigo-200 text-xs uppercase tracking-wider font-semibold mb-1">Groupes Complets ({{ stockData.preciseGroups.toFixed(2) }})</div>
              <div class="text-3xl font-bold">{{ stockData.fullGroups }}</div>
              <div class="text-xs text-indigo-300 mt-1">+ Reste: {{ stockData.remainder }}</div>
            </div>
            <div class="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10">
              <div class="text-indigo-200 text-xs uppercase tracking-wider font-semibold mb-1">Articles Commandés</div>
              <div class="text-3xl font-bold">{{ stockData.totalItemsOrdered }}</div>
            </div>
            <div class="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10">
              <div class="text-indigo-200 text-xs uppercase tracking-wider font-semibold mb-1">Commandes non livrées</div>
              <div class="text-3xl font-bold">{{ stockData.totalPendingOrders }}</div>
            </div>
          </div>

          <!-- Ingredients Table -->
          <div class="lg:col-span-2 bg-white rounded-xl shadow-lg overflow-hidden text-gray-900 flex flex-col">
            <div class="px-6 py-4 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
              <h3 class="font-bold text-lg">Ingrédients Requis</h3>
              <span class="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full font-medium">Valeurs API divisées par 8</span>
            </div>
            <div class="p-6 grid grid-cols-2 sm:grid-cols-3 gap-6 flex-1">
              <div v-for="(data, name) in stockData.ingredientsRoundedUp" :key="name" class="flex flex-col">
                <span class="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">{{ translateIngredient(name) }}</span>
                <span class="text-2xl font-bold text-gray-800">
                  {{ stockData.ingredientsPrecise[name]?.amount }} 
                  <span class="text-sm font-normal text-gray-600">{{ stockData.ingredientsPrecise[name]?.unit }}</span>
                </span>
                <span class="text-xs text-green-600 font-bold mt-1">Arrondi / 8: {{ data.amount }} {{ data.unit }}</span>
              </div>
            </div>
          </div>

          <!-- Products Breakdown -->
          <div class="bg-white rounded-xl shadow-lg overflow-hidden text-gray-900 flex flex-col">
             <div class="px-6 py-4 bg-gray-50 border-b border-gray-100">
              <h3 class="font-bold text-lg">Détail par Produit</h3>
            </div>
            <div class="overflow-y-auto max-h-[300px] divide-y divide-gray-100">
              <div v-for="p in stockData.perProduct" :key="p.productId" class="px-6 py-3 hover:bg-gray-50 transition-colors flex justify-between items-center">
                <div>
                  <div class="font-medium text-gray-900">{{ p.productName }}</div>
                  <div class="text-xs text-gray-500">{{ p.totalQuantity }} article(s)</div>
                </div>
                <div class="text-right">
                   <div class="font-bold text-indigo-600">{{ p.totalRollouts }}</div>
                   <div class="text-[10px] uppercase text-gray-400 font-bold">Rouleaux</div>
                </div>
              </div>
              <div v-if="stockData.perProduct.length === 0" class="px-6 py-8 text-center text-gray-500 text-sm">
                Aucun produit à préparer
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Content -->
    <section class="py-4 sm:py-6 md:py-8">
      <div class="mx-auto max-w-7xl px-3 sm:px-4 md:px-6 lg:px-8 space-y-4 sm:space-y-6">
        
        <!-- Filter Section -->
        <div class="order-filters bg-white rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl border border-gray-100 overflow-hidden">
          <div class="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-100">
            <h2 class="text-base sm:text-lg font-semibold text-gray-900">Filtres et tri</h2>
          </div>
          <div class="px-4 sm:px-6 py-4 space-y-6">
            <div class="order-search">
              <label for="order-search" class="sr-only">Rechercher une commande</label>
              <div class="relative">
                <svg class="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <circle cx="11" cy="11" r="7" stroke-width="2" />
                  <path stroke-linecap="round" stroke-width="2" d="m16 16 4 4" />
                </svg>
                <input
                  id="order-search"
                  v-model="searchQuery"
                  type="search"
                  autocomplete="off"
                  placeholder="Rechercher par numéro, client, téléphone ou produit..."
                  class="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-400 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-100"
                />
              </div>
            </div>
            <!-- Status Filter -->
            <div>
              <h3 class="text-sm font-medium text-gray-700 mb-3">Filtrer par statut</h3>
              <div class="status-filter-list flex flex-nowrap gap-2 overflow-x-auto pb-1 sm:flex-wrap sm:overflow-visible">
                <button 
                  v-for="status in orderStatuses" 
                  :key="status.value"
                  @click="selectedStatus = status.value"
                  :aria-pressed="selectedStatus === status.value"
                  :class="[
                    'min-h-11 shrink-0 rounded-xl px-4 py-2 text-xs font-semibold transition-colors sm:text-sm',
                    selectedStatus === status.value 
                      ? 'bg-red-600 text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  ]"
                >
                  {{ status.label }}
                </button>
              </div>
            </div>
            
            <!-- Date Sort Filter -->
            <div>
              <h3 class="text-sm font-medium text-gray-700 mb-3">Trier par date</h3>
              <div class="flex flex-wrap gap-2 sm:gap-3">
                <button 
                  v-for="dateFilter in dateFilters" 
                  :key="dateFilter.value"
                  @click="selectedDateFilter = dateFilter.value"
                  :aria-pressed="selectedDateFilter === dateFilter.value"
                  :class="[
                    'min-h-11 rounded-xl px-4 py-2 text-xs font-semibold transition-colors sm:text-sm',
                    selectedDateFilter === dateFilter.value 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  ]"
                >
                  {{ dateFilter.label }}
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Orders List -->
        <div class="bg-white rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl border border-gray-100 overflow-hidden">
          <div class="order-list-heading px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0">
            <div class="flex min-w-0 items-center gap-3">
              <h2 class="text-base sm:text-lg font-semibold text-gray-900">Toutes les commandes</h2>
              <span class="shrink-0 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-600">{{ filteredOrders.length }}</span>
            </div>
            <button
              @click="loadOrders"
              :disabled="isLoading"
              class="refresh-orders-button inline-flex min-h-11 items-center justify-center gap-2 self-stretch rounded-xl border border-slate-200 px-4 text-sm font-semibold text-slate-700 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700 disabled:cursor-wait disabled:opacity-60 sm:self-auto"
            >
              <svg :class="{ 'animate-spin': isLoading }" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              {{ isLoading ? 'Actualisation...' : 'Actualiser les commandes' }}
            </button>
          </div>
          
          <div v-if="isLoading" class="px-4 sm:px-6 py-8 sm:py-12 text-center text-gray-500 text-sm sm:text-base">
            <svg class="animate-spin h-8 w-8 mx-auto mb-4 text-gray-400" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
            </svg>
            Chargement des commandes...
          </div>
          
          <div v-else-if="filteredOrders.length === 0" class="px-4 sm:px-6 py-8 sm:py-12 text-center text-gray-500">
            <svg class="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p class="text-base sm:text-lg font-medium">Aucune commande trouvée</p>
            <p class="text-xs sm:text-sm text-gray-500 mt-1">
            {{ searchQuery ? 'Essayez un autre nom, numéro ou produit.' : selectedStatus === 'all' ? 'Aucune commande dans le système' : 'Aucune commande avec le statut "' + getStatusLabel(selectedStatus) + '"' }}
            </p>
          </div>
          
          <div v-else class="p-3 sm:p-5 lg:p-6">
            <div class="grid grid-cols-1 gap-5 xl:grid-cols-2 xl:gap-6">
              <div v-for="order in paginatedOrders" :key="order.orderId" class="order-admin-card rounded-2xl border border-slate-200 bg-white p-4 shadow-md transition-all duration-300 sm:rounded-3xl sm:p-6">
              <!-- Order Header -->
              <div class="order-card-header mb-5 flex flex-col justify-between gap-3 border-b border-slate-100 pb-4 sm:flex-row sm:items-center">
                <div class="min-w-0">
                  <h3 class="text-base font-bold tracking-tight text-slate-900 sm:text-lg">Commande #{{ order.orderId.slice(-8) }}</h3>
                  <p class="mt-1 text-xs font-medium text-slate-500 sm:text-sm">{{ formatDate(order.orderDate) }}</p>
                  <div class="text-xs sm:text-sm text-gray-600 mt-1">
                    <span class="text-gray-500">Client:</span>
                    <span class="client-name-animation ml-1 font-medium text-blue-600">{{ order.customerName }}</span>
                  </div>
                  <div class="text-xs sm:text-sm text-gray-600 mt-1">
                    <span class="text-gray-500">Téléphone:</span>
                    <a
                      v-if="getCustomerPhone(order)"
                      :href="`tel:${getCustomerPhone(order).replace(/[^\d+]/g, '')}`"
                      class="ml-1 inline-flex items-center gap-1.5 rounded-lg border border-green-200 bg-green-50 px-2.5 py-1 font-semibold text-green-700 shadow-sm transition-colors hover:border-green-300 hover:bg-green-100 hover:text-green-800 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-1"
                    >
                      <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498A1 1 0 0121 15.72V19a2 2 0 01-2 2h-1C9.163 21 3 14.837 3 7V5z" />
                      </svg>
                      {{ getCustomerPhone(order) }}
                    </a>
                    <span v-else class="ml-1 text-gray-500">Non renseigné</span>
                  </div>
                </div>
                <div class="flex flex-row items-center justify-between gap-3 sm:flex-col sm:items-end">
                  <span :class="getStatusBadgeClass(order.status)" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium">
                    {{ getStatusLabel(order.status) }}
                  </span>
                  <span class="text-base font-extrabold text-slate-900 sm:text-lg">{{ Number(order.totalAmount || 0).toFixed(2) }} DT</span>
                </div>
              </div>

              <section class="customer-details-panel mb-5" :aria-label="`Informations client de la commande ${order.orderId.slice(-8)}`">
                <div class="mb-3 flex items-center gap-2">
                  <span class="flex h-8 w-8 items-center justify-center rounded-xl bg-white text-indigo-600 shadow-sm" aria-hidden="true">
                    <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M16 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2m16 0v-2a4 4 0 00-3-3.87M14 3.13a4 4 0 010 7.75M14 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </span>
                  <h4 class="text-sm font-bold text-slate-800">Adresse et autres coordonnées</h4>
                </div>
                <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div class="customer-detail">
                    <span class="customer-detail-label">E-mail</span>
                    <a v-if="getCustomerEmail(order)" :href="`mailto:${getCustomerEmail(order)}`" class="customer-detail-value customer-detail-link break-all">{{ getCustomerEmail(order) }}</a>
                    <span v-else class="customer-detail-value text-slate-400">Non renseigné</span>
                  </div>
                  <div class="customer-detail sm:col-span-2">
                    <span class="customer-detail-label">Adresse de livraison</span>
                    <span class="customer-detail-value">{{ getCustomerAddress(order) || 'Non renseignée' }}</span>
                  </div>
                </div>
              </section>

              <!-- Order Items -->
              <div class="mb-4">
                <h4 class="mb-3 text-xs font-bold uppercase tracking-wider text-slate-600 sm:text-sm">Articles commandés <span class="ml-1 font-medium normal-case tracking-normal text-slate-400">({{ order.items?.length || 0 }})</span></h4>
                <div class="order-items-container">
                  <div class="space-y-3">
                    <div v-for="item in order.items" :key="item.orderItemId" class="order-admin-item flex items-center gap-3 rounded-xl border border-slate-100 px-3 py-3 transition-colors sm:px-4">
                      <!-- Product Image -->
                      <div class="flex-shrink-0">
                        <div class="w-12 h-12 rounded-lg overflow-hidden bg-gray-200">
                          <img 
                            :src="getProductImageUrl(item.productImage)" 
                            :alt="item.productName"
                            class="w-full h-full object-cover"
                            @error="handleImageError"
                            loading="lazy"
                          />
                        </div>
                      </div>
                      
                      <!-- Product Info -->
                      <div class="flex-1 min-w-0">
                        <p class="truncate text-sm font-semibold text-slate-900">{{ item.productName }}</p>
                        <span class="product-category-badge mt-1 inline-flex max-w-full items-center rounded-full px-2.5 py-1 text-[10px] font-bold">{{ getProductCategory(item) }}</span>
                        <p class="mt-1 text-xs text-slate-500">Quantité: {{ item.quantity }} × {{ Number(item.price || 0).toFixed(2) }} DT</p>
                      </div>
                      
                      <!-- Price -->
                      <div class="order-item-price flex-shrink-0 text-right">
                        <span class="text-sm font-bold text-slate-900">{{ (Number(item.quantity || 0) * Number(item.price || 0)).toFixed(2) }} DT</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="delivery-fee-field mb-4 max-w-xs">
                <label :for="`delivery-fee-${order.orderId}`" class="mb-1 block text-xs sm:text-sm font-medium text-gray-700">Frais de livraison (DT)</label>
                <input
                  :id="`delivery-fee-${order.orderId}`"
                  type="number"
                  min="0"
                  step="0.5"
                  :value="deliveryFees[order.orderId] ?? ''"
                  @input="saveDeliveryFee(order.orderId, $event.target.value)"
                  placeholder="0.00"
                  class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              <!-- Comments -->
              <div class="order-comment-panel mb-5 rounded-2xl border p-3 sm:p-4">
                <label :for="`order-comment-${order.orderId}`" class="mb-2 block text-xs sm:text-sm font-medium text-blue-800">Commentaire:</label>
                <textarea
                  :id="`order-comment-${order.orderId}`"
                  v-model="commentDrafts[order.orderId]"
                  rows="2"
                  class="w-full rounded-lg border border-blue-200 bg-white px-3 py-2 text-sm text-gray-800 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ajouter un commentaire"
                ></textarea>
                <div class="mt-2 flex justify-end">
                  <button
                    @click="saveOrderComment(order)"
                    :disabled="isSavingComment[order.orderId]"
                    class="rounded-lg bg-blue-600 px-3 py-2 text-xs font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {{ isSavingComment[order.orderId] ? 'Enregistrement...' : 'Enregistrer le commentaire' }}
                  </button>
                </div>
              </div>

              <!-- Status Management -->
              <div class="order-actions flex flex-col gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:items-end">
                <div class="flex-1">
                  <label class="block text-xs sm:text-sm font-medium text-gray-700 mb-2">Modifier le statut:</label>
                  <select 
                    :value="order.status" 
                    @change="updateOrderStatus(order.orderId, $event.target.value)"
                    :disabled="isUpdatingStatus[order.orderId]"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm"
                  >
                    <option value="Pending">En attente</option>
                    <option value="Confirmed">Confirmée</option>
                    <option value="Preparing">En préparation</option>
                    <option value="Ready">Prête</option>
                    <option value="Delivering">En livraison</option>
                    <option value="Delivered">Livrée</option>
                    <option value="Cancelled">Annulée</option>
                  </select>
                </div>
                <div class="order-action-buttons grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
                  <button 
                    @click="downloadInvoice(order)"
                    :disabled="isGeneratingInvoice[order.orderId]"
                    class="inline-flex items-center justify-center gap-2 px-3 py-2 text-xs sm:text-sm font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors disabled:opacity-50"
                  >
                    <svg v-if="!isGeneratingInvoice[order.orderId]" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <svg v-else class="animate-spin h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                    </svg>
                    {{ isGeneratingInvoice[order.orderId] ? 'Détails...' : 'Facture' }}
                  </button>
                  <button 
                    @click="deleteOrder(order.orderId)"
                    :disabled="isDeletingOrder[order.orderId]"
                    class="inline-flex items-center justify-center gap-2 px-3 py-2 text-xs sm:text-sm font-medium text-red-700 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    {{ isDeletingOrder[order.orderId] ? 'Suppression...' : 'Supprimer' }}
                  </button>
                </div>
              </div>
            </div>
            </div>
            
            <!-- Pagination Controls -->
            <div v-if="totalPages > 1" class="order-pagination mt-8 flex items-center justify-between">
              <div class="flex items-center space-x-2">
                <span class="text-sm text-gray-700">
                  Page {{ currentPage }} sur {{ totalPages }}
                </span>
                <span class="text-sm text-gray-500">
                  ({{ filteredOrders.length }} commande{{ filteredOrders.length > 1 ? 's' : '' }})
                </span>
              </div>
              
              <div class="order-pagination-controls flex items-center space-x-2">
                <!-- Previous Button -->
                <button 
                  @click="goToPreviousPage"
                  :disabled="!hasPrevPage"
                  :class="[
                    'flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors',
                    hasPrevPage 
                      ? 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400' 
                      : 'bg-gray-100 border border-gray-200 text-gray-400 cursor-not-allowed'
                  ]"
                >
                  <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
                  </svg>
                  Précédent
                </button>
                
                <!-- Page Numbers -->
                <div class="flex items-center space-x-1">
                  <button 
                    v-for="page in getVisiblePages()" 
                    :key="page"
                    @click="goToPage(page)"
                    :class="[
                      'px-3 py-2 text-sm font-medium rounded-lg transition-colors',
                      page === currentPage 
                        ? 'bg-red-600 text-white' 
                        : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                    ]"
                  >
                    {{ page }}
                  </button>
                </div>
                
                <!-- Next Button -->
                <button 
                  @click="goToNextPage"
                  :disabled="!hasNextPage"
                  :class="[
                    'flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors',
                    hasNextPage 
                      ? 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400' 
                      : 'bg-gray-100 border border-gray-200 text-gray-400 cursor-not-allowed'
                  ]"
                >
                  Suivant
                  <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Status Change Confirmation Modal -->
    <div v-if="showStatusModal" class="fixed inset-0 z-50 overflow-y-auto modal-overlay">
      <div class="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <!-- Background overlay -->
        <div class="fixed inset-0 transition-all duration-300 bg-gray-500 bg-opacity-75 modal-backdrop" @click="closeStatusModal"></div>
        
        <!-- Modal panel -->
        <div class="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all duration-300 transform bg-white shadow-2xl rounded-2xl modal-panel">
          <!-- Modal header -->
          <div class="flex items-center justify-center w-12 h-12 mx-auto bg-blue-100 rounded-full">
            <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 0V6a2 2 0 012-2h4a2 2 0 012 2v1m-6 0h6m-6 0l-1 1a2 2 0 01-2 2H6a2 2 0 01-2-2l-1-1m8 0l1 1a2 2 0 002 2h2a2 2 0 002-2l1-1m-8 0V9a2 2 0 012-2h4a2 2 0 012 2v1" />
            </svg>
          </div>
          
          <!-- Modal content -->
          <div class="mt-4 text-center">
            <h3 class="text-lg font-medium text-gray-900">
              Modifier le statut de la commande
            </h3>
            <div class="mt-2">
              <p class="text-sm text-gray-500">
                Voulez-vous vraiment changer le statut de cette commande ?
              </p>
              <div class="mt-4 p-4 bg-gray-50 rounded-lg">
                <div class="flex items-center justify-between">
                  <span class="text-sm text-gray-600">De:</span>
                  <span :class="getStatusBadgeClass(statusChangeData.oldStatus)" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium">
                    {{ getStatusLabel(statusChangeData.oldStatus) }}
                  </span>
                </div>
                <div class="flex items-center justify-center my-2">
                  <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-sm text-gray-600">Vers:</span>
                  <span :class="getStatusBadgeClass(statusChangeData.newStatus)" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium">
                    {{ getStatusLabel(statusChangeData.newStatus) }}
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Modal actions -->
          <div class="flex flex-col sm:flex-row gap-3 mt-6">
            <button
              @click="closeStatusModal"
              class="flex-1 inline-flex justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
            >
              Annuler
            </button>
            <button
              @click="confirmStatusChange"
              :disabled="isUpdatingStatus[statusChangeData.orderId]"
              class="flex-1 inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <svg v-if="isUpdatingStatus[statusChangeData.orderId]" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
              </svg>
              {{ isUpdatingStatus[statusChangeData.orderId] ? 'Mise à jour...' : 'Confirmer le changement' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteModal" class="fixed inset-0 z-50 overflow-y-auto modal-overlay">
      <div class="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <!-- Background overlay -->
        <div class="fixed inset-0 transition-all duration-300 bg-gray-500 bg-opacity-75 modal-backdrop" @click="closeDeleteModal"></div>
        
        <!-- Modal panel -->
        <div class="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all duration-300 transform bg-white shadow-2xl rounded-2xl modal-panel">
          <!-- Modal header -->
          <div class="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full">
            <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          
          <!-- Modal content -->
          <div class="mt-4 text-center">
            <h3 class="text-lg font-medium text-gray-900">
              Supprimer la commande
            </h3>
            <div class="mt-2">
              <p class="text-sm text-gray-500">
                Êtes-vous sûr de vouloir supprimer définitivement cette commande ?
              </p>
              <p class="text-sm text-red-600 font-medium mt-2">
                Cette action est irréversible et supprimera tous les éléments de la commande.
              </p>
            </div>
          </div>
          
          <!-- Modal actions -->
          <div class="flex flex-col sm:flex-row gap-3 mt-6">
            <button
              @click="closeDeleteModal"
              class="flex-1 inline-flex justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
            >
              Annuler
            </button>
            <button
              @click="confirmDelete"
              :disabled="isDeletingOrder[orderToDelete]"
              class="flex-1 inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <svg v-if="isDeletingOrder[orderToDelete]" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
              </svg>
              {{ isDeletingOrder[orderToDelete] ? 'Suppression...' : 'Supprimer définitivement' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Notification -->
    <div v-if="showNotification" class="fixed top-4 left-4 right-4 sm:top-4 sm:right-4 sm:left-auto z-50 max-w-sm sm:w-full notification-container">
      <div class="bg-green-500 text-white px-4 sm:px-6 py-3 sm:py-4 rounded-lg shadow-lg success-notification">
        <div class="flex items-center">
          <div class="notification-icon">
            <svg class="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          <div class="notification-content">
            <p class="text-sm sm:text-base font-medium notification-text">{{ notificationMessage }}</p>
          </div>
          <button 
            @click="showNotification = false"
            class="ml-2 sm:ml-3 flex-shrink-0 p-1 rounded-full hover:bg-green-600 transition-colors duration-200"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
    </div>
  </template>
  
  <script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { useAuth } from '../../stores/auth.js'
import { api, resolveImage } from '../../utils/api.js'

const { user } = useAuth()

// Orders data
const orders = ref([])
const isLoading = ref(false)
const selectedStatus = ref('all')
const selectedDateFilter = ref('recent')
const searchQuery = ref('')
const showNotification = ref(false)
const notificationMessage = ref('')
const isUpdatingStatus = ref({})
const isDeletingOrder = ref({})
const isGeneratingInvoice = ref({})
const deliveryFees = ref({})
const commentDrafts = ref({})
const isSavingComment = ref({})
const deliveryFeesStorageKey = 'dsushi-admin-delivery-fees'

// Delete modal state
const showDeleteModal = ref(false)
const orderToDelete = ref(null)

// Stock Data
const stockData = ref(null)
const pendingTotalData = ref(null)
const piecesPerRoll = 8

const divideByPiecesPerRoll = value => {
  const amount = Number(value)
  return Number.isFinite(amount) ? Number((amount / piecesPerRoll).toFixed(2)) : 0
}

const normalizeStockData = data => {
  const totalRollouts = divideByPiecesPerRoll(data.totalRollouts)
  const originalGroupSize = data.preciseGroups > 0
    ? Math.round(Number(data.totalRollouts) / Number(data.preciseGroups))
    : 0
  const preciseGroups = originalGroupSize > 0 ? totalRollouts / originalGroupSize : 0

  return {
    ...data,
    totalRollouts,
    preciseGroups,
    fullGroups: originalGroupSize > 0 ? Math.floor(preciseGroups) : 0,
    remainder: originalGroupSize > 0
      ? Number((totalRollouts % originalGroupSize).toFixed(2))
      : divideByPiecesPerRoll(data.remainder),
    perProduct: (data.perProduct || []).map(product => ({
      ...product,
      totalRollouts: divideByPiecesPerRoll(product.totalRollouts)
    })),
    ingredientsPrecise: Object.fromEntries(
      Object.entries(data.ingredientsPrecise || {}).map(([name, ingredient]) => [name, {
        ...ingredient,
        amount: divideByPiecesPerRoll(ingredient.amount)
      }])
    ),
    ingredientsRoundedUp: Object.fromEntries(
      Object.entries(data.ingredientsRoundedUp || {}).map(([name, ingredient]) => [name, {
        ...ingredient,
        amount: divideByPiecesPerRoll(ingredient.amount)
      }])
    )
  }
}

const fetchStockRequirements = async ordersToInclude => {
    const token = user.value?.token
    if (!token) return

    try {
        const nonDeliveredOrders = ordersToInclude.filter(order =>
          String(order.status || '').toLowerCase() !== 'delivered'
        )
        const productsResponse = await fetch(api('/api/Product'), {
            headers: {
                'accept': '*/*',
                'Authorization': user.value?.token ? `Bearer ${user.value.token}` : ''
            }
        })
        if (!productsResponse.ok) {
          throw new Error(`Failed to fetch products for stock requirements: HTTP ${productsResponse.status}`)
        }

        const products = await productsResponse.json()
        if (!Array.isArray(products)) {
          throw new Error('Invalid products response for stock requirements')
        }
        const productsById = new Map(products.map(product => [
          String(product.productId ?? product.ProductId),
          product
        ]))
        const perProduct = new Map()

        for (const order of ordersToInclude) {
          for (const item of Array.isArray(order.items) ? order.items : []) {
            const product = productsById.get(String(item.productId ?? item.ProductId))
            const category = product?.categoryName || product?.CategoryName ||
              product?.category?.name || product?.Category?.Name
            if (category) item.categoryName = category
          }
        }

        for (const order of nonDeliveredOrders) {
          for (const item of Array.isArray(order.items) ? order.items : []) {
            const productId = String(item.productId ?? item.ProductId)
            const product = productsById.get(productId)
            const productStock = Number(product?.stock ?? product?.Stock)
            const quantity = Number(item.quantity ?? item.Quantity)

            if (!product || !Number.isFinite(productStock) || !Number.isFinite(quantity)) {
              throw new Error(`Missing valid product stock or quantity for product ${productId}`)
            }

            const existing = perProduct.get(productId) || {
              productId,
              productName: item.productName || item.ProductName || product.name || product.Name,
              totalQuantity: 0,
              totalRollouts: 0
            }
            existing.totalQuantity += quantity
            existing.totalRollouts += quantity * productStock
            perProduct.set(productId, existing)
          }
        }

        const productTotals = [...perProduct.values()]
        const totalRollouts = productTotals.reduce((total, product) => total + product.totalRollouts, 0)
        const totalItemsOrdered = productTotals.reduce((total, product) => total + product.totalQuantity, 0)
        const preciseGroups = totalRollouts / 7
        const roundedGroups = Math.ceil(preciseGroups)
        const ingredientAmounts = {
          rice: { precise: preciseGroups * 300, rounded: roundedGroups * 300, unit: 'g' },
          water: { precise: preciseGroups * 400, rounded: roundedGroups * 400, unit: 'ml' },
          vinegar: { precise: preciseGroups * 60, rounded: roundedGroups * 60, unit: 'ml' },
          sugar: { precise: preciseGroups * 15, rounded: roundedGroups * 15, unit: 'g' },
          salt: { precise: preciseGroups * 5, rounded: roundedGroups * 5, unit: 'g' }
        }

        stockData.value = normalizeStockData({
          totalRollouts,
          preciseGroups,
          fullGroups: Math.floor(preciseGroups),
          remainder: totalRollouts % 7,
          totalItemsOrdered,
          totalPendingOrders: nonDeliveredOrders.length,
          perProduct: productTotals,
          ingredientsPrecise: Object.fromEntries(Object.entries(ingredientAmounts).map(([name, amount]) => [
            name,
            { amount: amount.precise, unit: amount.unit }
          ])),
          ingredientsRoundedUp: Object.fromEntries(Object.entries(ingredientAmounts).map(([name, amount]) => [
            name,
            { amount: amount.rounded, unit: amount.unit }
          ]))
        })
    } catch (error) {
        console.error('Error fetching stock requirements:', error)
        showNotificationMessage('Impossible de calculer les besoins de stock')
    }
}

const fetchPendingTotal = async () => {
    const token = user.value?.token
    if (!token) return

    try {
        const res = await fetch(api('/api/Admin/orders/pending/total'), {
            headers: { 
                'accept': '*/*',
                'Authorization': `Bearer ${token}`
            }
        })
        if (res.ok) {
            pendingTotalData.value = await res.json()
        }
    } catch (e) {
        console.error('Error fetching pending total:', e)
    }
}

const refreshAllData = async ({ refreshOrders = true, refreshStock = true } = {}) => {
    const [ordersLoaded] = await Promise.all([
      refreshOrders ? loadOrders() : Promise.resolve(true),
      fetchPendingTotal()
    ])
    if (refreshStock && ordersLoaded) {
      await fetchStockRequirements(orders.value)
    }
}

onMounted(() => {
    refreshAllData()
})

// Status change confirmation state
const showStatusModal = ref(false)
const statusChangeData = ref({ orderId: null, oldStatus: '', newStatus: '' })

// Pagination
const currentPage = ref(1)
const ordersPerPage = 4

// Order statuses for filtering
const orderStatuses = [
  { value: 'all', label: 'Toutes' },
  { value: 'Pending', label: 'En attente' },
  { value: 'Confirmed', label: 'Confirmée' },
  { value: 'Preparing', label: 'En préparation' },
  { value: 'Ready', label: 'Prête' },
  { value: 'Delivering', label: 'En livraison' },
  { value: 'Delivered', label: 'Livrée' },
  { value: 'Cancelled', label: 'Annulée' }
]

// Date filters for sorting
const dateFilters = [
  { value: 'recent', label: 'Plus récentes' },
  { value: 'oldest', label: 'Plus anciennes' }
]


// Filtered and sorted orders
const filteredOrders = computed(() => {
  let filtered = orders.value

  const query = searchQuery.value.trim().toLocaleLowerCase('fr')
  if (query) {
    filtered = filtered.filter(order => {
      const searchableValues = [
        order.orderId,
        order.customerName,
        getCustomerPhone(order),
        getCustomerEmail(order),
        getCustomerAddress(order),
        ...(Array.isArray(order.items) ? order.items.map(item => item.productName) : [])
      ]
      return searchableValues.some(value =>
        String(value ?? '').toLocaleLowerCase('fr').includes(query)
      )
    })
  }
  
  // Filter by status
  if (selectedStatus.value !== 'all') {
    filtered = filtered.filter(order => order.status === selectedStatus.value)
  }
  
  // Sort by date
  filtered = [...filtered].sort((a, b) => {
    const dateA = new Date(a.orderDate)
    const dateB = new Date(b.orderDate)
    
    if (selectedDateFilter.value === 'recent') {
      return dateB - dateA // Most recent first
    } else {
      return dateA - dateB // Oldest first
    }
  })
  
  return filtered
})

// Paginated orders
const paginatedOrders = computed(() => {
  const start = (currentPage.value - 1) * ordersPerPage
  const end = start + ordersPerPage
  return filteredOrders.value.slice(start, end)
})

// Pagination info
const totalPages = computed(() => {
  return Math.ceil(filteredOrders.value.length / ordersPerPage)
})

const hasNextPage = computed(() => {
  return currentPage.value < totalPages.value
})

const hasPrevPage = computed(() => {
  return currentPage.value > 1
})

// Load orders from API
async function loadOrders() {
  const token = user.value?.token
  
  if (!token) {
    console.error('No token available')
    showNotificationMessage('Vous devez être connecté pour voir les commandes')
    return false
  }
  
  isLoading.value = true
  let loadedOrders
  try {
    const response = await fetch(api('/api/order'), {
      method: 'GET',
      headers: {
        'accept': '*/*',
        'Authorization': `Bearer ${token}`
      }
    })
    
    if (!response.ok) {
      throw new Error(`Failed to fetch orders: HTTP ${response.status}`)
    }
    
    const data = await response.json()
    if (!Array.isArray(data)) {
      throw new Error('Invalid orders response: expected an array')
    }
    loadedOrders = data
  } catch (error) {
    console.error('Error loading orders:', error)
    const detail = error instanceof Error && error.message.includes('HTTP ')
      ? ` (${error.message.match(/HTTP \d+/)?.[0]})`
      : ''
    showNotificationMessage(`Erreur lors du chargement des commandes${detail}`)
    return false
  } finally {
    isLoading.value = false
  }

  orders.value = loadedOrders
  commentDrafts.value = Object.fromEntries(orders.value.map(order => [
    order.orderId,
    order.comments || ''
  ]))

  let savedDeliveryFees = {}
  try {
    const storedDeliveryFees = JSON.parse(localStorage.getItem(deliveryFeesStorageKey) || '{}')
    if (!storedDeliveryFees || typeof storedDeliveryFees !== 'object' || Array.isArray(storedDeliveryFees)) {
      throw new Error('Invalid saved delivery fees')
    }
    savedDeliveryFees = storedDeliveryFees
  } catch (error) {
    console.error('Error loading saved delivery fees:', error)
  }
  deliveryFees.value = Object.fromEntries(orders.value.map(order => [
    order.orderId,
    savedDeliveryFees[order.orderId] ?? order.deliveryFee ?? order.DeliveryFee ?? ''
  ]))

  try {
    await loadCustomerDetails(orders.value)
    await loadProductImages()
  } catch (error) {
    console.error('Error loading supplementary order data:', error)
  }
  return true
}

// Load product images for all order items
async function loadProductImages() {
  const token = user.value?.token
  if (!token) return
  
  for (const order of orders.value) {
    for (const item of Array.isArray(order.items) ? order.items : []) {
      try {
        const response = await fetch(api(`/api/Product/${item.productId}/images`), {
          method: 'GET',
          headers: {
            'accept': '*/*'
          }
        })
        
        if (response.ok) {
          const images = await response.json()
          if (images && images.length > 0) {
            item.productImage = images[0] // Use the first image
            console.log(`Loaded image for product ${item.productId}:`, images[0])
          } else {
            console.log(`No images found for product ${item.productId}`)
          }
        } else {
          console.log(`Failed to load images for product ${item.productId}:`, response.status)
        }
      } catch (error) {
        console.error(`Error loading image for product ${item.productId}:`, error)
      }
    }
  }
}

async function saveOrderComment(order) {
  const token = user.value?.token
  if (!token) {
    showNotificationMessage('Vous devez être connecté pour modifier le commentaire')
    return
  }

  isSavingComment.value[order.orderId] = true
  try {
    const response = await fetch(api(`/api/order/${order.orderId}/comments`), {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'accept': '*/*',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(commentDrafts.value[order.orderId] || '')
    })

    if (!response.ok) throw new Error(`Failed to update order comment: ${response.status}`)

    order.comments = commentDrafts.value[order.orderId] || ''
    showNotificationMessage('Commentaire mis à jour avec succès')
  } catch (error) {
    console.error('Error updating order comment:', error)
    showNotificationMessage('Erreur lors de la mise à jour du commentaire')
  } finally {
    isSavingComment.value[order.orderId] = false
  }
}

function getProductImageUrl(imagePath) {
  return resolveImage(imagePath)
}

function saveDeliveryFee(orderId, value) {
  deliveryFees.value[orderId] = value
  const savedDeliveryFees = JSON.parse(localStorage.getItem(deliveryFeesStorageKey) || '{}')
  savedDeliveryFees[orderId] = value
  localStorage.setItem(deliveryFeesStorageKey, JSON.stringify(savedDeliveryFees))
}

function getCustomerPhone(order) {
  const customer = order.customer || order.Customer || {}
  const phone = [
    order.customerPhone, order.CustomerPhone,
    order.customerPhoneNumber, order.CustomerPhoneNumber,
    order.phone, order.Phone,
    order.phoneNumber, order.PhoneNumber,
    order.mobile, order.Mobile,
    order.mobilePhone, order.MobilePhone,
    order.telephone, order.Telephone,
    order.tel, order.Tel,
    order.contactNumber, order.ContactNumber,
    customer.phone, customer.Phone,
    customer.phoneNumber, customer.PhoneNumber,
    customer.mobile, customer.Mobile,
    customer.mobilePhone, customer.MobilePhone,
    customer.telephone, customer.Telephone,
    customer.tel, customer.Tel,
    customer.contactNumber, customer.ContactNumber
  ].map(value => String(value ?? '').trim())
    .find(value => value && value.toLowerCase() !== 'string')

  return phone || ''
}

function getCustomerEmail(order) {
  const customer = order.customer || order.Customer || {}
  return [
    order.customerEmail, order.CustomerEmail, order.email, order.Email,
    customer.email, customer.Email
  ].map(value => String(value ?? '').trim())
    .find(value => value && value.toLowerCase() !== 'string') || ''
}

function getCustomerAddress(order) {
  const customer = order.customer || order.Customer || {}
  return [
    order.customerAddress, order.CustomerAddress,
    order.deliveryAddress, order.DeliveryAddress,
    order.shippingAddress, order.ShippingAddress,
    order.address, order.Address,
    customer.address, customer.Address,
    customer.deliveryAddress, customer.DeliveryAddress,
    customer.shippingAddress, customer.ShippingAddress
  ].map(value => String(value ?? '').trim())
    .find(value => value && value.toLowerCase() !== 'string') || ''
}

function getProductCategory(item) {
  const category = item.categoryName || item.CategoryName ||
    item.category?.name || item.Category?.Name
  return category || 'Catégorie non renseignée'
}

function getCustomerProfiles(data) {
  const profile = data?.user || data?.User || data?.profile || data?.Profile || data?.data || data?.Data || data
  return (Array.isArray(profile) ? profile : [profile])
    .filter(candidate => candidate && typeof candidate === 'object')
}

async function loadCustomerDetails(ordersToLoad) {
  const token = user.value?.token
  if (!token) return

  await Promise.all(ordersToLoad.map(async order => {
    if (getCustomerPhone(order) && getCustomerEmail(order) && getCustomerAddress(order)) return

    const customer = order.customer || order.Customer || {}
    const customerId = [
      order.customerId, order.CustomerId, order.userId, order.UserId,
      customer.userId, customer.UserId, customer.id, customer.Id
    ].map(value => String(value ?? '').trim())
      .find(value => value && value.toLowerCase() !== 'string')
    const customerName = [
      order.customerName, order.CustomerName,
      customer.name, customer.Name, customer.userName, customer.UserName
    ].map(value => String(value ?? '').trim())
      .find(value => value && value.toLowerCase() !== 'string')

    const profileRequests = []
    if (customerId) {
      profileRequests.push({
        url: api(`/api/Users/${encodeURIComponent(customerId)}`),
        kind: 'id'
      })
    }
    if (customerName) {
      profileRequests.push({
        url: api(`/api/Users/info?name=${encodeURIComponent(customerName)}`),
        kind: 'name'
      })
    }
    if (!profileRequests.length) return

    const results = await Promise.allSettled(profileRequests.map(async ({ url }) => {
      const response = await fetch(url, {
        headers: {
          accept: '*/*',
          Authorization: `Bearer ${token}`
        },
        cache: 'no-store'
      })
      if (!response.ok) return ''
      return await response.json()
    }))

    for (let index = 0; index < results.length; index += 1) {
      const result = results[index]
      if (result.status === 'rejected') {
        console.error(`Error loading phone for order ${order.orderId} (${profileRequests[index].kind} lookup):`, result.reason)
      } else if (result.value) {
        const profiles = getCustomerProfiles(result.value)
        const matchingProfile = profiles.find(profile =>
          String(profile.name || profile.Name || profile.userName || profile.UserName || '')
            .trim().toLowerCase() === (customerName || '').toLowerCase()
        ) || (profileRequests[index].kind === 'id' && profiles.length === 1 ? profiles[0] : null)
        if (!matchingProfile) continue

        order.customerPhone ||= getCustomerPhone({ customer: matchingProfile })
        order.customerEmail ||= matchingProfile.email || matchingProfile.Email || ''
        order.customerAddress ||= matchingProfile.address || matchingProfile.Address ||
          matchingProfile.deliveryAddress || matchingProfile.DeliveryAddress ||
          matchingProfile.shippingAddress || matchingProfile.ShippingAddress || ''
        order.customerName ||= matchingProfile.name || matchingProfile.Name ||
          matchingProfile.userName || matchingProfile.UserName || ''

        if (getCustomerPhone(order) && getCustomerEmail(order) && getCustomerAddress(order)) return
      }
    }
  }))
}

// Handle image loading errors
function handleImageError(event) {
  console.log('Image failed to load:', event.target.src)
  // The getProductImageUrl function already provides a fallback SVG
  // so we don't need to do anything special here
}

async function downloadInvoice(order) {
  isGeneratingInvoice.value[order.orderId] = true;
  const deliveryFee = Math.max(0, Number(deliveryFees.value[order.orderId]) || 0);
  const invoiceTotal = Number(order.totalAmount) + deliveryFee;

  const firstAvailableValue = (...values) => values
    .map(value => String(value ?? '').trim())
    .find(value => value && value.toLowerCase() !== 'string');
  const orderCustomer = order.customer || order.Customer || {};
  const customerDisplayName = (() => {
    return firstAvailableValue(order.customerName, order.CustomerName, orderCustomer.name, orderCustomer.Name) || 'Client';
  })();
  const orderAddress = order.customerAddress || order.CustomerAddress || order.deliveryAddress || order.DeliveryAddress || order.shippingAddress || order.ShippingAddress || orderCustomer.address || orderCustomer.Address;
  const orderPhone = order.customerPhone || order.CustomerPhone || order.customerPhoneNumber || order.CustomerPhoneNumber || order.phone || order.Phone || order.phoneNumber || order.PhoneNumber || order.telephone || order.Telephone || order.tel || orderCustomer.phone || orderCustomer.Phone || orderCustomer.phoneNumber || orderCustomer.PhoneNumber;

  let customerDetails = {
    name: customerDisplayName,
    email: firstAvailableValue(order.customerEmail, order.CustomerEmail, order.email, order.Email, orderCustomer.email, orderCustomer.Email) || 'Non spécifié',
    address: firstAvailableValue(orderAddress, order.address, order.Address) || 'Non spécifiée',
    phone: firstAvailableValue(orderPhone) || 'Non spécifié',
    paymentMethod: firstAvailableValue(order.paymentMethod, order.PaymentMethod, order.paymentType, order.PaymentType) || 'Espèce à la livraison'
  };

  try {
    const token = user.value?.token;
    const customerId = firstAvailableValue(order.customerId, order.CustomerId, order.userId, order.UserId, orderCustomer.userId, orderCustomer.UserId, orderCustomer.id, orderCustomer.Id);
    if (token && (customerId || customerDisplayName !== 'Client')) {
      const response = await fetch(api('/api/Users'), {
        method: 'GET',
        headers: {
          'accept': '*/*',
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const users = await response.json();
        const userList = Array.isArray(users) ? users : [];
        const matchedUser = (customerId && userList.find(candidate =>
          String(candidate?.userId || candidate?.UserId || candidate?.id || candidate?.Id || '').toLowerCase() === customerId.toLowerCase()
        )) || userList.find(candidate =>
          String(candidate?.name || candidate?.Name || candidate?.userName || candidate?.UserName || '').trim().toLowerCase() === customerDisplayName.toLowerCase()
        );

        if (matchedUser) {
          const matchedUserId = firstAvailableValue(matchedUser.userId, matchedUser.UserId, matchedUser.id, matchedUser.Id) || customerId;
          const profileCandidates = [matchedUser];
          const profileRequests = [];

          if (matchedUserId) {
            profileRequests.push({
              kind: 'id',
              request: fetch(api(`/api/Users/${encodeURIComponent(matchedUserId)}`), {
                headers: { 'accept': '*/*', 'Authorization': `Bearer ${token}` },
                cache: 'no-store'
              })
            });
          }
          if (customerDisplayName !== 'Client') {
            profileRequests.push({
              kind: 'name',
              request: fetch(api(`/api/Users/info?name=${encodeURIComponent(customerDisplayName)}`), {
                headers: { 'accept': '*/*', 'Authorization': `Bearer ${token}` },
                cache: 'no-store'
              })
            });
          }

          const profileResponses = await Promise.allSettled(profileRequests.map(async ({ kind, request }) => {
            const response = await request;
            if (!response.ok) return null;
            return { kind, data: await response.json() };
          }));

          for (const result of profileResponses) {
            if (result.status !== 'fulfilled' || !result.value?.data) continue;
            const { kind, data } = result.value;
            const unwrapped = data.user || data.User || data.profile || data.Profile || data.data || data.Data || data;
            const candidates = Array.isArray(unwrapped) ? unwrapped : [unwrapped];
            const matchedProfile = candidates.find(candidate =>
              String(candidate?.name || candidate?.Name || candidate?.userName || candidate?.UserName || '').trim().toLowerCase() === customerDisplayName.toLowerCase()
            ) || (kind === 'id' && candidates.length === 1 ? candidates[0] : null);
            if (matchedProfile && typeof matchedProfile === 'object') profileCandidates.push(matchedProfile);
          }

          const profileValue = (...keys) => firstAvailableValue(...profileCandidates.flatMap(candidate => keys.map(key => candidate?.[key])));

          customerDetails.name = profileValue('name', 'Name', 'userName', 'UserName') || customerDetails.name;
          customerDetails.email = profileValue('email', 'Email') || customerDetails.email;
          customerDetails.address = profileValue('address', 'Address', 'deliveryAddress', 'DeliveryAddress', 'shippingAddress', 'ShippingAddress', 'fullAddress', 'FullAddress', 'adresse', 'Adresse') || customerDetails.address;
          customerDetails.phone = profileValue('phone', 'Phone', 'phoneNumber', 'PhoneNumber', 'mobile', 'Mobile', 'mobilePhone', 'MobilePhone', 'telephone', 'Telephone', 'tel', 'Tel', 'contactNumber', 'ContactNumber') || customerDetails.phone;
        }
      }
    }
  } catch (error) {
    console.error('Error fetching customer details for invoice:', error);
  } finally {
    isGeneratingInvoice.value[order.orderId] = false;
  }

  const invoiceHtml = `
    <!DOCTYPE html>
    <html lang="fr">
    <head>
      <meta charset="UTF-8">
      <title>Facture #${order.orderId.slice(-8)}</title>
      <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #333; margin: 0; padding: 40px; line-height: 1.6; }
        .header { display: flex; justify-content: space-between; border-bottom: 2px solid #ef4444; padding-bottom: 20px; margin-bottom: 30px; }
        .logo { font-size: 28px; font-weight: bold; color: #ef4444; }
        .invoice-title { font-size: 24px; color: #111; margin: 0; }
        .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; margin-bottom: 40px; }
        .info-block h3 { font-size: 14px; text-transform: uppercase; color: #667; margin-bottom: 10px; border-bottom: 1px solid #eee; padding-bottom: 5px; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
        th { background-color: #f9fafb; text-align: left; padding: 12px; border-bottom: 2px solid #eee; font-size: 14px; }
        td { padding: 12px; border-bottom: 1px solid #eee; font-size: 14px; }
        .text-right { text-align: right; }
        .totals { margin-left: auto; width: 300px; }
        .total-row { display: flex; justify-content: space-between; padding: 10px 0; }
        .grand-total { font-size: 20px; font-weight: bold; color: #ef4444; border-top: 2px solid #ef4444; margin-top: 10px; padding-top: 10px; }
        .footer { margin-top: 60px; text-align: center; color: #99a; font-size: 12px; }
        @media print {
          body { padding: 20px; }
          .no-print { display: none; }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="logo">DSushi</div>
        <div>
          <h1 class="invoice-title">FACTURE</h1>
          <p style="margin: 5px 0; color: #667;">Numéro: #${order.orderId.slice(-8)}</p>
          <p style="margin: 5px 0; color: #667;">Date: ${formatDate(order.orderDate)}</p>
        </div>
      </div>

      <div class="info-grid">
        <div class="info-block">
          <h3>Emetteur</h3>
          <p><strong>DSushi Restaurant</strong><br>Djerba Erriadh<br>Tunisie<br>Contact: +216 24 335 305</p>
        </div>
        <div class="info-block">
          <h3>Client</h3>
          <p>
            <strong>${customerDetails.name}</strong><br>
            Email: ${customerDetails.email}<br>
            Adresse: ${customerDetails.address}<br>
            Tél: ${customerDetails.phone}<br>
            Mode de paiement: ${customerDetails.paymentMethod}
          </p>
        </div>
      </div>

      <table>
        <thead>
          <tr>
            <th>Produit</th>
            <th class="text-right">Prix Unit.</th>
            <th class="text-right">Quantité</th>
            <th class="text-right">Total</th>
          </tr>
        </thead>
        <tbody>
          ${order.items.map(item => `
            <tr>
              <td>${item.productName}</td>
              <td class="text-right">${Number(item.price).toFixed(2)} DT</td>
              <td class="text-right">${item.quantity}</td>
              <td class="text-right">${(item.quantity * item.price).toFixed(2)} DT</td>
            </tr>
          `).join('')}
        </tbody>
      </table>

      <div class="totals">
        <div class="total-row">
          <span>Sous-total</span>
          <span>${Number(order.totalAmount).toFixed(2)} DT</span>
        </div>
        <div class="total-row">
          <span>Frais de livraison</span>
          <span>${deliveryFee.toFixed(2)} DT</span>
        </div>
        <div class="total-row grand-total">
          <span>TOTAL</span>
          <span>${invoiceTotal.toFixed(2)} DT</span>
        </div>
      </div>

      <div class="footer">
        <p>Merci pour votre confiance ! À bientôt chez DSushi.</p>
        <p>DSushi - Cuisine Japonaise Artisanale</p>
      </div>

      <script>
        window.onload = function() {
          setTimeout(() => {
            window.print();
            // Optional: window.close();
          }, 500);
        };
      <\/script>
    </body>
    </html>
  `;

  const printWindow = window.open('', '_blank');
  printWindow.document.write(invoiceHtml);
  printWindow.document.close();
}

// Show status change confirmation modal
function updateOrderStatus(orderId, newStatus) {
  const order = orders.value.find(o => o.orderId === orderId)
  if (!order) return
  
  statusChangeData.value = {
    orderId: orderId,
    oldStatus: order.status,
    newStatus: newStatus
  }
  showStatusModal.value = true
}

// Close status change modal
function closeStatusModal() {
  showStatusModal.value = false
  statusChangeData.value = { orderId: null, oldStatus: '', newStatus: '' }
}

// Confirm status change
async function confirmStatusChange() {
  const { orderId, newStatus } = statusChangeData.value
  const token = user.value?.token
  
  if (!token) {
    showNotificationMessage('Vous devez être connecté pour modifier le statut')
    closeStatusModal()
    return
  }
  
  isUpdatingStatus.value[orderId] = true
  
  try {
    const response = await fetch(api(`/api/order/${orderId}/status`), {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'accept': '*/*',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(newStatus)
    })
    
    if (!response.ok) {
      throw new Error('Failed to update order status')
    }
    
    // Update the order status in the local array
    const orderIndex = orders.value.findIndex(order => order.orderId === orderId)
    if (orderIndex !== -1) {
      orders.value[orderIndex].status = newStatus
    }
    
    showNotificationMessage(`Statut de la commande mis à jour vers "${getStatusLabel(newStatus)}"`)
    closeStatusModal()
    refreshAllData({ refreshOrders: false, refreshStock: newStatus === 'Delivered' })
  } catch (error) {
    console.error('Error updating order status:', error)
    showNotificationMessage('Erreur lors de la mise à jour du statut')
  } finally {
    isUpdatingStatus.value[orderId] = false
  }
}

// Show delete confirmation modal
function deleteOrder(orderId) {
  orderToDelete.value = orderId
  showDeleteModal.value = true
}

// Close delete modal
function closeDeleteModal() {
  showDeleteModal.value = false
  orderToDelete.value = null
}

// Confirm delete order
async function confirmDelete() {
  const orderId = orderToDelete.value
  
  if (!orderId) return
  
  const token = user.value?.token
  
  if (!token) {
    showNotificationMessage('Vous devez être connecté pour supprimer une commande')
    closeDeleteModal()
    return
  }
  
  isDeletingOrder.value[orderId] = true
  
  try {
    const response = await fetch(api(`/api/order/${orderId}`), {
      method: 'DELETE',
      headers: {
        'accept': '*/*',
        'Authorization': `Bearer ${token}`
      }
    })
    
    if (!response.ok) {
      throw new Error('Failed to delete order')
    }
    
    const result = await response.json()
    console.log('Order deleted:', result)
    
    // Remove the order from the local array
    const orderIndex = orders.value.findIndex(order => order.orderId === orderId)
    if (orderIndex !== -1) {
      orders.value.splice(orderIndex, 1)
    }
    
    showNotificationMessage('Commande supprimée avec succès')
    closeDeleteModal()
    refreshAllData() // Refresh dashboard after deletion
  } catch (error) {
    console.error('Error deleting order:', error)
    showNotificationMessage('Erreur lors de la suppression de la commande')
  } finally {
    isDeletingOrder.value[orderId] = false
  }
}

// Format date for display
function formatDate(dateString) {
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  } catch {
    return dateString
  }
}

// Get status label in French
function getStatusLabel(status) {
  const statusMap = {
    'Pending': 'En attente',
    'Confirmed': 'Confirmée',
    'Preparing': 'En préparation',
    'Ready': 'Prête',
    'Delivering': 'En livraison',
    'Delivered': 'Livrée',
    'Cancelled': 'Annulée'
  }
  return statusMap[status] || status
}

function translateIngredient(name) {
  const map = {
    'rice': 'Riz',
    'water': 'Eau',
    'vinegar': 'Vinaigre',
    'sugar': 'Sucre',
    'salt': 'Sel',
    'salmon': 'Saumon',
    'tuna': 'Thon',
    'avocado': 'Avocat',
    'cucumber': 'Concombre',
    'nori': 'Feuille Nori',
    'sesame': 'Sésame',
    'ginger': 'Gingembre',
    'wasabi': 'Wasabi',
    'soy_sauce': 'Sauce Soja'
  }
  return map[name.toLowerCase()] || name
}

// Get status badge class
function getStatusBadgeClass(status) {
  const statusClasses = {
    'Pending': 'bg-yellow-100 text-yellow-800',
    'Confirmed': 'bg-blue-100 text-blue-800',
    'Preparing': 'bg-orange-100 text-orange-800',
    'Ready': 'bg-green-100 text-green-800',
    'Delivering': 'bg-purple-100 text-purple-800',
    'Delivered': 'bg-green-100 text-green-800',
    'Cancelled': 'bg-red-100 text-red-800'
  }
  return statusClasses[status] || 'bg-gray-100 text-gray-800'
}


// Show notification message
function showNotificationMessage(message) {
  notificationMessage.value = message
  showNotification.value = true
  setTimeout(() => {
    showNotification.value = false
  }, 4000)
}

// Pagination functions
function goToPage(page) {
  currentPage.value = page
}

function goToNextPage() {
  if (hasNextPage.value) {
    currentPage.value++
  }
}

function goToPreviousPage() {
  if (hasPrevPage.value) {
    currentPage.value--
  }
}

function getVisiblePages() {
  const total = totalPages.value
  const current = currentPage.value
  const pages = []
  
  if (total <= 7) {
    // Show all pages if 7 or fewer
    for (let i = 1; i <= total; i++) {
      pages.push(i)
    }
  } else {
    // Show smart pagination
    if (current <= 4) {
      // Show first 5 pages + ... + last page
      for (let i = 1; i <= 5; i++) {
        pages.push(i)
      }
      pages.push('...')
      pages.push(total)
    } else if (current >= total - 3) {
      // Show first page + ... + last 5 pages
      pages.push(1)
      pages.push('...')
      for (let i = total - 4; i <= total; i++) {
        pages.push(i)
      }
    } else {
      // Show first + ... + current-1, current, current+1 + ... + last
      pages.push(1)
      pages.push('...')
      for (let i = current - 1; i <= current + 1; i++) {
        pages.push(i)
      }
      pages.push('...')
      pages.push(total)
    }
  }
  
  return pages
}

// Reset pagination when filters change
watch([selectedStatus, selectedDateFilter, searchQuery], () => {
  currentPage.value = 1
})

// Initial load is handled in the consolidated refreshAllData onMounted call
  </script>
  
  <style scoped>
/* Enhanced notification animations and styling */
.notification-container {
  animation: notificationSlideIn 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

.success-notification {
  position: relative;
  overflow: hidden;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  box-shadow: 0 10px 25px rgba(16, 185, 129, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
}

/* Notification entrance animation */
@keyframes notificationSlideIn {
  0% {
    transform: translateX(100%) scale(0.8);
    opacity: 0;
  }
  50% {
    transform: translateX(-10%) scale(1.05);
    opacity: 0.8;
  }
  100% {
    transform: translateX(0) scale(1);
    opacity: 1;
  }
}

/* Icon animation */
.notification-icon {
  animation: iconBounce 0.6s ease-out 0.2s both;
}

@keyframes iconBounce {
  0% {
    transform: scale(0);
    opacity: 0;
  }
  50% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

/* Text animation */
.notification-text {
  animation: textSlideUp 0.5s ease-out 0.3s both;
}

@keyframes textSlideUp {
  0% {
    transform: translateY(10px);
    opacity: 0;
  }
  100% {
    transform: translateY(0);
    opacity: 1;
  }
}

/* Content animation */
.notification-content {
  animation: contentFadeIn 0.4s ease-out 0.4s both;
}

@keyframes contentFadeIn {
  0% {
    opacity: 0;
    transform: translateX(-10px);
  }
  100% {
    opacity: 1;
    transform: translateX(0);
  }
}

/* Hover effects */
.success-notification:hover {
  transform: translateY(-2px) scale(1.02);
  box-shadow: 0 15px 35px rgba(16, 185, 129, 0.4);
  background: linear-gradient(135deg, #059669 0%, #047857 100%);
}

/* Close button animation */
.success-notification button {
  transition: all 0.2s ease-in-out;
  opacity: 0.7;
}

.success-notification button:hover {
  opacity: 1;
  transform: scale(1.1);
  background-color: rgba(255, 255, 255, 0.2);
}

.success-notification button:active {
  transform: scale(0.95);
}

/* Pulsing effect for attention */
.success-notification::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(45deg, transparent 30%, rgba(255, 255, 255, 0.1) 50%, transparent 70%);
  animation: shimmer 2s infinite;
  pointer-events: none;
}

@keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

/* Progress bar animation */
.success-notification::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  height: 3px;
  background: linear-gradient(90deg, #ffffff 0%, rgba(255, 255, 255, 0.5) 100%);
  animation: progressBar 4s linear forwards;
}

@keyframes progressBar {
  0% {
    width: 100%;
  }
  100% {
    width: 0%;
  }
}

/* Mobile responsiveness */
@media (max-width: 640px) {
  .notification-container {
    left: 1rem;
    right: 1rem;
    max-width: none;
  }
  
  .success-notification {
    padding: 0.75rem 1rem;
  }
  
  .notification-icon svg {
    width: 1.25rem;
    height: 1.25rem;
  }
  
  .notification-text {
    font-size: 0.875rem;
  }
}

/* Auto-dismiss animation */
.notification-container.leaving {
  animation: notificationSlideOut 0.3s ease-in forwards;
}

@keyframes notificationSlideOut {
  0% {
    transform: translateX(0) scale(1);
    opacity: 1;
  }
  100% {
    transform: translateX(100%) scale(0.8);
    opacity: 0;
  }
}

/* Success state variations */
.success-notification.success {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
}

.success-notification.error {
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  box-shadow: 0 10px 25px rgba(239, 68, 68, 0.3);
}

.success-notification.warning {
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  box-shadow: 0 10px 25px rgba(245, 158, 11, 0.3);
}

/* Modal animations and styling */
.modal-overlay {
  animation: modalFadeIn 0.3s ease-out;
}

.modal-backdrop {
  backdrop-filter: blur(8px);
  animation: backdropFadeIn 0.3s ease-out;
}

.modal-panel {
  animation: modalSlideIn 0.3s ease-out;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
}

/* Keyframe animations */
@keyframes modalFadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes backdropFadeIn {
  from {
    opacity: 0;
    backdrop-filter: blur(0px);
  }
  to {
    opacity: 1;
    backdrop-filter: blur(8px);
  }
}

@keyframes modalSlideIn {
  from {
    opacity: 0;
    transform: scale(0.9) translateY(-20px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

/* Modal header icon animation */
.modal-panel .w-12 {
  animation: iconPulse 0.6s ease-out 0.2s both;
}

@keyframes iconPulse {
  from {
    transform: scale(0);
    opacity: 0;
  }
  50% {
    transform: scale(1.1);
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

/* Button hover effects */
.modal-panel button {
  transition: all 0.2s ease-in-out;
  position: relative;
  overflow: hidden;
}

.modal-panel button:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.modal-panel button:active {
  transform: translateY(0);
}

/* Delete button special effects */
.modal-panel button[class*="bg-red-600"]:hover {
  background-color: #dc2626;
  box-shadow: 0 4px 12px rgba(220, 38, 38, 0.3);
}

.modal-panel button[class*="bg-red-600"]:disabled {
  background-color: #ef4444;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

/* Loading spinner animation */
.modal-panel .animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* Modal content animations */
.modal-panel h3 {
  animation: textSlideUp 0.4s ease-out 0.1s both;
}

.modal-panel p {
  animation: textSlideUp 0.4s ease-out 0.2s both;
}

.modal-panel .flex.flex-col {
  animation: textSlideUp 0.4s ease-out 0.3s both;
}

@keyframes textSlideUp {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Responsive modal adjustments */
@media (max-width: 640px) {
  .modal-panel {
    margin: 1rem;
    max-width: calc(100% - 2rem);
  }
  
  .modal-panel .flex.flex-col {
    flex-direction: column;
    gap: 0.75rem;
  }
  
  .modal-panel button {
    width: 100%;
  }
}

/* Mobile image fixes */
@media (max-width: 640px) {
  .w-12.h-12 {
    min-width: 3rem;
    min-height: 3rem;
    width: 3rem;
    height: 3rem;
  }
  
  .w-12.h-12 img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }
  
  .w-12.h-12 svg {
    width: 1.5rem;
    height: 1.5rem;
  }
}

/* Image loading states */
.w-12.h-12 img {
  transition: opacity 0.3s ease-in-out;
}

.w-12.h-12 img[src=""] {
  opacity: 0;
}

.w-12.h-12 img:not([src=""]) {
  opacity: 1;
}

/* Client name animation */
.client-name-animation {
  position: relative;
  display: inline-block;
  animation: clientNameSlideIn 0.6s ease-out 0.2s both;
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-size: 200% 200%;
  animation: clientNameSlideIn 0.6s ease-out 0.2s both, clientNameShimmer 3s ease-in-out infinite 1s;
}

@keyframes clientNameSlideIn {
  0% {
    opacity: 0;
    transform: translateX(-20px) scale(0.8);
  }
  50% {
    opacity: 0.7;
    transform: translateX(5px) scale(1.05);
  }
  100% {
    opacity: 1;
    transform: translateX(0) scale(1);
  }
}

@keyframes clientNameShimmer {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

/* Hover effect for client name */
.client-name-animation:hover {
  transform: scale(1.05);
  filter: drop-shadow(0 2px 4px rgba(59, 130, 246, 0.3));
  transition: all 0.3s ease-in-out;
}

/* Pulse effect for attention */
.client-name-animation::before {
  content: '';
  position: absolute;
  top: -2px;
  left: -2px;
  right: -2px;
  bottom: -2px;
  background: linear-gradient(45deg, transparent, rgba(59, 130, 246, 0.2), transparent);
  border-radius: 4px;
  opacity: 0;
  animation: clientNamePulse 2s ease-in-out infinite;
  z-index: -1;
}

@keyframes clientNamePulse {
  0%, 100% {
    opacity: 0;
    transform: scale(1);
  }
  50% {
    opacity: 1;
    transform: scale(1.1);
  }
}

/* Mobile adjustments */
@media (max-width: 640px) {
  .client-name-animation {
    font-size: 0.75rem;
  }
}

.order-admin-card {
  position: relative;
  overflow: hidden;
  background:
    radial-gradient(ellipse at top right, rgba(224, 231, 255, 0.38), transparent 38%),
    linear-gradient(160deg, #ffffff 0%, #fbfcff 100%);
  box-shadow: 0 8px 24px -18px rgba(15, 23, 42, 0.4);
}

.order-admin-card:hover {
  border-color: #c7d2fe;
  box-shadow: 0 22px 44px -28px rgba(30, 41, 59, 0.5);
  transform: translateY(-3px);
}

.order-card-header h3 {
  overflow-wrap: anywhere;
}

.order-card-header > div:first-child > div {
  margin-top: 0.5rem;
  line-height: 1.5;
}

.order-card-header > div:first-child > div > span:first-child {
  color: #64748b;
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.order-card-header > div:last-child > span:first-child {
  border: 1px solid rgba(148, 163, 184, 0.18);
  padding: 0.35rem 0.75rem;
  font-weight: 700;
}

.customer-details-panel {
  border: 1px solid #e1e7ff;
  border-radius: 1.15rem;
  background: linear-gradient(135deg, #f4f6ff 0%, #fafbff 100%);
  padding: 1rem;
  box-shadow: inset 0 1px rgba(255, 255, 255, 0.9);
}

.customer-detail {
  display: flex;
  min-width: 0;
  flex-direction: column;
  gap: 0.25rem;
  border: 1px solid rgba(226, 232, 240, 0.8);
  border-radius: 0.75rem;
  background: rgba(255, 255, 255, 0.8);
  padding: 0.65rem 0.75rem;
}

.customer-detail-label {
  color: #64748b;
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.customer-detail-value {
  overflow-wrap: anywhere;
  color: #1e293b;
  font-size: 0.875rem;
  font-weight: 600;
}

.customer-detail-link {
  color: #4f46e5;
  text-decoration: none;
}

.customer-detail-link:hover {
  color: #3730a3;
  text-decoration: underline;
}

.order-admin-item {
  background: linear-gradient(120deg, #f8fafc 0%, #ffffff 100%);
  box-shadow: 0 2px 5px rgba(15, 23, 42, 0.025);
}

.order-admin-item:hover {
  border-color: #c7d2fe;
  background: #eef2ff;
}

.order-admin-item img {
  transition: transform 0.25s ease;
}

.order-admin-item:hover img {
  transform: scale(1.06);
}

.product-category-badge {
  width: fit-content;
  border: 1px solid #e0e7ff;
  background: #eef2ff;
  color: #4338ca;
  line-height: 1.2;
}

.delivery-fee-field input,
.order-actions select,
.order-comment-panel textarea {
  min-height: 2.75rem;
  border-radius: 0.8rem;
  transition: border-color 0.18s ease, box-shadow 0.18s ease;
}

.delivery-fee-field input:focus,
.order-actions select:focus,
.order-comment-panel textarea:focus {
  border-color: #818cf8;
  box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.12);
}

.order-comment-panel {
  border-color: #dbeafe;
  background: linear-gradient(135deg, #f4f8ff 0%, #f8fbff 100%);
}

.order-comment-panel button,
.order-action-buttons button {
  min-height: 2.65rem;
  border-radius: 0.8rem;
  font-weight: 700;
  transition: transform 0.18s ease, box-shadow 0.18s ease, background-color 0.18s ease;
}

.order-comment-panel button:hover:not(:disabled),
.order-action-buttons button:hover:not(:disabled) {
  box-shadow: 0 7px 16px -10px currentColor;
  transform: translateY(-1px);
}

@media (max-width: 639px) {
  .customer-details-panel {
    padding: 0.8rem;
  }

  .order-admin-item {
    align-items: flex-start;
  }

  .order-admin-item > div:first-child {
    width: 3rem;
    height: 3rem;
  }

  .order-admin-item > div:last-child {
    max-width: 5.5rem;
    padding-top: 0.25rem;
  }

  .order-action-buttons button {
    width: 100%;
    padding-left: 0.5rem;
    padding-right: 0.5rem;
  }
}

@media (prefers-reduced-motion: reduce) {
  .order-admin-card,
  .order-admin-item img,
  .order-comment-panel button,
  .order-action-buttons button {
    transition: none;
  }

  .order-admin-card:hover,
  .order-admin-item:hover img,
  .order-comment-panel button:hover:not(:disabled),
  .order-action-buttons button:hover:not(:disabled) {
    transform: none;
  }
}

/* Order items scrollable container */
.order-items-container {
  max-height: 200px;
  overflow-y: auto;
  overflow-x: hidden;
  padding-right: 8px;
  margin-right: -8px;
}

.order-items-container::-webkit-scrollbar {
  width: 6px;
}

.order-items-container::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 3px;
}

.order-items-container::-webkit-scrollbar-thumb {
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  border-radius: 3px;
  transition: background 0.3s ease;
}

.order-items-container::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(135deg, #1d4ed8 0%, #1e40af 100%);
}

/* Firefox scrollbar styling */
.order-items-container {
  scrollbar-width: thin;
  scrollbar-color: #3b82f6 #f1f5f9;
}

/* Smooth scrolling */
.order-items-container {
  scroll-behavior: smooth;
}

/* Mobile scrollbar adjustments */
@media (max-width: 640px) {
  .order-items-container {
    max-height: 180px;
  }
  
  .order-items-container::-webkit-scrollbar {
    width: 4px;
  }
  }

.order-admin-card {
  min-width: 0;
}

.status-filter-list {
  -webkit-overflow-scrolling: touch;
  overscroll-behavior-inline: contain;
  scrollbar-width: thin;
  scrollbar-color: #cbd5e1 transparent;
}

.order-search input::-webkit-search-cancel-button {
  cursor: pointer;
}

.refresh-orders-button,
.order-actions select,
.delivery-fee-field input,
.order-comment-panel textarea,
.order-comment-panel button,
.order-action-buttons button,
.order-pagination button {
  min-height: 2.75rem;
}

.order-item-price {
  max-width: 7.5rem;
  overflow-wrap: anywhere;
}

.order-pagination-controls {
  min-width: 0;
}

@media (max-width: 639px) {
  .order-filters > div:last-child {
    gap: 1.25rem;
  }

  .order-admin-card {
    padding: 1rem;
    border-radius: 1.15rem;
  }

  .order-card-header {
    align-items: stretch;
  }

  .order-card-header > div:last-child {
    padding-top: 0.75rem;
    border-top: 1px solid #e2e8f0;
  }

  .order-card-header > div:last-child > span:last-child {
    font-size: 1.1rem;
  }

  .order-card-header a[href^="tel:"] {
    min-height: 2.5rem;
  }

  .order-admin-item {
    gap: 0.65rem;
    padding: 0.65rem;
  }

  .order-admin-item > div:last-child {
    max-width: 7rem;
  }

  .order-item-price {
    max-width: 6.25rem;
    font-size: 0.8rem;
  }

  .delivery-fee-field {
    max-width: none;
  }

  .order-comment-panel button,
  .order-action-buttons button {
    min-height: 2.85rem;
  }

  .order-pagination {
    flex-direction: column;
    align-items: stretch;
    gap: 0.75rem;
  }

  .order-pagination > div:first-child {
    justify-content: center;
    flex-wrap: wrap;
  }

  .order-pagination-controls {
    justify-content: space-between;
  }

  .order-pagination-controls > div {
    overflow-x: auto;
    scrollbar-width: none;
  }

  .order-pagination-controls > div::-webkit-scrollbar {
    display: none;
  }
}

@media (max-width: 360px) {
  .order-admin-card {
    padding: 0.8rem;
  }

  .order-pagination-controls > div {
    display: none;
  }
}

@media (prefers-reduced-motion: reduce) {
  .status-filter-list {
    scroll-behavior: auto;
  }
}
  </style>
  