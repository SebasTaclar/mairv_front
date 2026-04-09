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

<style scoped>
.sales-tab {
  padding-bottom: 40px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 2px solid var(--brand-border);
}

.section-header h2 {
  font-size: 1.8rem;
  font-weight: 700;
  color: var(--brand-primary-contrast);
}

.btn {
  padding: 10px 20px;
  border-radius: 8px;
  border: none;
  font-weight: 600;
  cursor: pointer;
}

.btn-primary {
  background: var(--brand-success);
  color: var(--brand-primary-contrast);
}

.btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.sales-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
  margin-bottom: 30px;
}

.stat-card {
  background: var(--brand-surface);
  border-radius: 12px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 15px;
  border: 1px solid var(--brand-border);
}

.stat-icon {
  font-size: 2rem;
}

.stat-number {
  font-size: 1.8rem;
  font-weight: 700;
  color: var(--brand-primary-contrast);
}

.stat-label {
  font-size: 0.85rem;
  color: var(--brand-accent-alt);
}

.search-bar {
  display: flex;
  justify-content: center;
  margin-bottom: 30px;
}

.search-input-wrapper {
  position: relative;
  width: 100%;
  max-width: 600px;
}

.search-icon {
  position: absolute;
  left: 14px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--brand-accent-alt);
}

.search-input {
  width: 100%;
  padding: 0.875rem 2.75rem;
  border-radius: 999px;
  border: 1px solid var(--brand-border);
  background: var(--brand-bg-end);
  color: var(--brand-primary-contrast);
}

.search-clear {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(16, 185, 129, 0.1);
  border: none;
  cursor: pointer;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  color: var(--brand-success);
}

.loading-state {
  text-align: center;
  padding: 60px 20px;
}

.spinner {
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-left-color: var(--brand-success);
  border-radius: 50%;
  width: 50px;
  height: 50px;
  animation: spin 1s linear infinite;
  margin: 0 auto 20px;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.error-state {
  text-align: center;
  padding: 60px 20px;
}

.error-icon {
  font-size: 4rem;
  margin-bottom: 20px;
}

.error-state p {
  color: var(--brand-accent-alt);
  margin-bottom: 20px;
}

.sales-table-container {
  overflow-x: auto;
  border-radius: 12px;
  border: 1px solid var(--brand-border);
  background: var(--brand-surface);
}

.sales-table {
  width: 100%;
  border-collapse: collapse;
}

.sales-table thead {
  background: var(--brand-surface-hover);
}

.sales-table th {
  padding: 15px;
  text-align: left;
  font-weight: 600;
  color: var(--brand-primary-contrast);
  font-size: 0.9rem;
  border-bottom: 2px solid var(--brand-border);
}

.sale-row {
  border-bottom: 1px solid var(--brand-border);
}

.sale-row:hover {
  background: var(--brand-surface-hover);
}

.sales-table td {
  padding: 15px;
  color: var(--brand-primary-contrast);
}

.customer-info {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.customer-name {
  font-weight: 600;
}

.customer-email {
  font-size: 0.85rem;
  color: var(--brand-accent-alt);
}

.product-info {
  font-size: 0.9rem;
}

.product-color {
  font-size: 0.8rem;
  color: var(--brand-accent-alt);
  margin-top: 3px;
}

.products-list {
  padding-left: 20px;
  margin: 8px 0 0;
  font-size: 0.85rem;
}

.amount {
  font-weight: 600;
  color: var(--brand-success);
}

.status-badge {
  display: inline-block;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  background: var(--brand-surface-hover);
}

.status-badge.completed {
  background: #d1fae5;
  color: #065f46;
}

.status-badge.pending {
  background: #fef3c7;
  color: #92400e;
}

.status-badge.cancelled {
  background: #fee2e2;
  color: #991b1b;
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 20px;
}

.empty-state h3 {
  font-size: 1.5rem;
  margin: 0 0 10px;
}

.empty-state p {
  color: var(--brand-accent-alt);
}
</style>
