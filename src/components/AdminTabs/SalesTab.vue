<template>
  <div class="sales-tab">
    <!-- Header -->
    <div class="section-header">
      <h2>Resumen de Compras</h2>
      <button @click="loadPurchases" class="btn btn-primary" :disabled="isLoading">
        {{ isLoading ? 'Cargando...' : 'Actualizar' }}
      </button>
    </div>

    <!-- Estadísticas -->
    <div v-if="!isLoading && !error && sales.length > 0" class="sales-stats">
      <div class="stat-card">
        <div class="stat-icon">💰</div>
        <div class="stat-content">
          <div class="stat-number">${{ totalRevenue.toLocaleString() }}</div>
          <div class="stat-label">Ingresos Totales</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">⏳</div>
        <div class="stat-content">
          <div class="stat-number">{{ pendingSales }}</div>
          <div class="stat-label">Pendientes</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">📈</div>
        <div class="stat-content">
          <div class="stat-number">{{ sales.length }}</div>
          <div class="stat-label">Total Ventas</div>
        </div>
      </div>
    </div>

    <!-- Búsqueda -->
    <div v-if="!isLoading && !error && sales.length > 0" class="search-bar">
      <div class="search-input-wrapper">
        <svg class="search-icon" viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
          <path fill="currentColor" d="M10 2a8 8 0 1 1 0 16 8 8 0 0 1 0-16zm8.707 17.293-4.387-4.387a9 9 0 1 0-1.414 1.414l4.387 4.387a1 1 0 0 0 1.414-1.414z"/>
        </svg>
        <input
          type="search"
          v-model="searchQuery"
          placeholder="Buscar por cliente o producto..."
          class="search-input"
        />
        <button v-if="searchQuery" class="search-clear" @click="searchQuery = ''">X</button>
      </div>
    </div>

    <!-- Carga -->
    <div v-if="isLoading" class="loading-state">
      <div class="spinner"></div>
      <p>Cargando compras...</p>
    </div>

    <!-- Error -->
    <div v-else-if="error" class="error-state">
      <div class="error-icon">⚠️</div>
      <p>{{ error }}</p>
      <button @click="loadPurchases" class="btn btn-primary">Reintentar</button>
    </div>

    <!-- Tabla -->
    <div v-else-if="filteredSales.length > 0" class="sales-table-container">
      <table class="sales-table">
        <thead>
          <tr>
            <th>Cliente</th>
            <th>Productos</th>
            <th>Cantidad</th>
            <th>Total</th>
            <th>Estado</th>
            <th>Fecha</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="sale in filteredSales" :key="sale.id" class="sale-row">
            <td>
              <div class="customer-info">
                <div class="customer-name">{{ sale.customerName }}</div>
                <div class="customer-email">{{ sale.customerEmail }}</div>
              </div>
            </td>
            <td>
              <div v-if="sale.items && sale.items.length === 1" class="product-info">
                <div>{{ sale.items[0].productName }}</div>
                <div v-if="sale.items[0].selectedColor" class="product-color">
                  {{ sale.items[0].selectedColor }}
                </div>
              </div>
              <div v-else-if="sale.items && sale.items.length > 1" class="product-info">
                <details>
                  <summary>{{ sale.items.length }} productos</summary>
                  <ul class="products-list">
                    <li v-for="(item, idx) in sale.items" :key="idx">
                      {{ item.productName }} x{{ item.quantity }}
                    </li>
                  </ul>
                </details>
              </div>
              <div v-else>{{ sale.productName }}</div>
            </td>
            <td>{{ sale.quantity }}</td>
            <td class="amount">${{ sale.totalAmount.toLocaleString() }}</td>
            <td>
              <span :class="['status-badge', sale.status]">
                {{ getStatusText(sale.status) }}
              </span>
            </td>
            <td>{{ formatDate(sale.date) }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Vacío -->
    <div v-else class="empty-state">
      <div class="empty-icon">📊</div>
      <h3>{{ searchQuery ? 'Sin resultados' : 'No hay ventas' }}</h3>
      <p v-if="!searchQuery">Las compras aparecerán aquí</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import './styles/SalesTab.css'
import { ref, computed, onMounted } from 'vue'
import { paymentService } from '@/services/api/paymentService'
import type { Purchase, ProductPaymentItem } from '@/services/api/paymentService'

interface Sale {
  id: string
  productName: string
  customerName: string
  customerEmail: string
  quantity: number
  totalAmount: number
  status: 'completed' | 'pending' | 'cancelled'
  date: Date
  items?: ProductPaymentItem[]
}

const isLoading = ref(false)
const error = ref('')
const sales = ref<Sale[]>([])
const searchQuery = ref('')

const totalRevenue = computed(() =>
  sales.value
    .filter(s => s.status === 'completed')
    .reduce((sum, s) => sum + s.totalAmount, 0)
)

const pendingSales = computed(() =>
  sales.value.filter(s => s.status === 'pending').length
)

const filteredSales = computed(() => {
  if (!searchQuery.value) return sales.value
  const q = searchQuery.value.toLowerCase()
  return sales.value.filter(s =>
    s.customerName.toLowerCase().includes(q) ||
    s.customerEmail.toLowerCase().includes(q) ||
    s.productName.toLowerCase().includes(q) ||
    (s.items && s.items.some(item =>
      item.productName.toLowerCase().includes(q)
    ))
  )
})

const mapPurchaseStatus = (status: string): 'completed' | 'pending' | 'cancelled' => {
  const upper = status.toUpperCase()
  if (upper === 'COMPLETED' || upper === 'APPROVED') return 'completed'
  if (upper === 'CANCELLED' || upper === 'REJECTED') return 'cancelled'
  return 'pending'
}

const transformPurchase = (purchase: Purchase): Sale => {
  const firstItem = purchase.items?.[0]
  const itemCount = purchase.items?.length || 0
  const totalQuantity = purchase.items?.reduce((sum, item) => sum + item.quantity, 0) || 0

  let productName = 'Múltiples productos'
  if (itemCount === 1) {
    productName = firstItem?.productName || 'Desconocido'
  } else if (itemCount > 1) {
    productName = `${itemCount} productos`
  }

  return {
    id: purchase.id.toString(),
    productName,
    customerName: purchase.buyerName,
    customerEmail: purchase.buyerEmail,
    quantity: totalQuantity,
    totalAmount: purchase.amount,
    status: mapPurchaseStatus(purchase.status),
    date: new Date(purchase.createdAt),
    items: purchase.items
  }
}

const loadPurchases = async () => {
  isLoading.value = true
  error.value = ''
  try {
    const response = await paymentService.getAllPurchases()
    if (response.success && response.data) {
      sales.value = response.data.purchases.map(transformPurchase)
    } else {
      error.value = 'No se pudieron cargar las compras'
    }
  } catch (e) {
    error.value = 'Error cargando compras'
    console.error(e)
  } finally {
    isLoading.value = false
  }
}

const getStatusText = (status: string) => {
  const map: Record<string, string> = {
    'completed': '✅ Completada',
    'pending': '⏳ Pendiente',
    'cancelled': '❌ Cancelada'
  }
  return map[status] || status
}

const formatDate = (date: Date) => {
  return new Date(date).toLocaleDateString('es-CO', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

onMounted(() => {
  loadPurchases()
})
</script>



