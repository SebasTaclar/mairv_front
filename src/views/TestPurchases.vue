<template>
  <div class="test-purchases">
    <h1>🧪 Test de Purchases API</h1>

    <div class="controls">
      <button @click="loadAllPurchases" class="btn-primary">
        Cargar Todas las Compras
      </button>

      <div class="email-filter">
        <input
          v-model="emailFilter"
          type="email"
          placeholder="ejemplo@email.com"
          class="input"
        >
        <button @click="loadPurchasesByEmail" class="btn-secondary">
          Buscar por Email
        </button>
      </div>
    </div>

    <div v-if="isLoading" class="loading">
      <p>⏳ Cargando...</p>
    </div>

    <div v-else-if="error" class="error">
      <p>❌ Error: {{ error }}</p>
    </div>

    <div v-else-if="purchases.length > 0" class="results">
      <h2>📦 Compras Encontradas: {{ purchases.length }}</h2>

      <div class="purchase-card" v-for="purchase in purchases" :key="purchase.id">
        <div class="purchase-header">
          <h3>Compra #{{ purchase.id }}</h3>
          <span :class="['status', purchase.status?.toLowerCase()]">
            {{ purchase.status }}
          </span>
        </div>

        <div class="purchase-info">
          <p><strong>Cliente:</strong> {{ purchase.buyerName }}</p>
          <p><strong>Email:</strong> {{ purchase.buyerEmail }}</p>
          <p v-if="purchase.buyerContactNumber">
            <strong>Teléfono:</strong> {{ purchase.buyerContactNumber }}
          </p>
          <p v-if="purchase.shippingAddress">
            <strong>Dirección:</strong> {{ purchase.shippingAddress }}
          </p>
          <p><strong>Total:</strong> ${{ purchase.amount?.toLocaleString() }} {{ purchase.currency }}</p>
          <p><strong>Fecha:</strong> {{ formatDate(purchase.createdAt) }}</p>
        </div>

        <div v-if="purchase.items && purchase.items.length > 0" class="purchase-items">
          <h4>Productos:</h4>
          <div class="item" v-for="(item, index) in purchase.items" :key="index">
            <p><strong>{{ item.productName }}</strong></p>
            <p>Cantidad: {{ item.quantity }} x ${{ item.unitPrice?.toLocaleString() }}</p>
            <p v-if="item.selectedColor">Color: {{ item.selectedColor }}</p>
            <p>Subtotal: ${{ item.totalPrice?.toLocaleString() }}</p>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="empty">
      <p>📭 No hay compras para mostrar</p>
    </div>

    <!-- Raw JSON -->
    <details class="raw-data">
      <summary>🔍 Ver JSON Completo</summary>
      <pre>{{ JSON.stringify(rawResponse, null, 2) }}</pre>
    </details>
  </div>
</template>

<script setup lang="ts">
import './styles/TestPurchases.css'
import { ref } from 'vue'
import { paymentService } from '@/services/api/paymentService'
import type { Purchase, GetPurchasesResponse } from '@/services/api/paymentService'
import type { ApiResponse } from '@/services/api/apiConfig'

const purchases = ref<Purchase[]>([])
const isLoading = ref(false)
const error = ref('')
const emailFilter = ref('')
const rawResponse = ref<ApiResponse<GetPurchasesResponse> | null>(null)

const loadAllPurchases = async () => {
  isLoading.value = true
  error.value = ''

  try {
    console.log('📤 Obteniendo todas las compras...')
    const response = await paymentService.getAllPurchases()
    console.log('📥 Respuesta:', response)

    rawResponse.value = response

    if (response.success && response.data) {
      purchases.value = response.data.purchases
      console.log('✅ Compras cargadas:', purchases.value.length)
    } else {
      error.value = response.message || 'Error al cargar compras'
    }
  } catch (err: unknown) {
    console.error('❌ Error:', err)
    error.value = err instanceof Error ? err.message : 'Error desconocido'
  } finally {
    isLoading.value = false
  }
}

const loadPurchasesByEmail = async () => {
  if (!emailFilter.value.trim()) {
    error.value = 'Por favor ingresa un email'
    return
  }

  isLoading.value = true
  error.value = ''

  try {
    console.log('📤 Buscando compras de:', emailFilter.value)
    const response = await paymentService.getPurchasesByEmail(emailFilter.value)
    console.log('📥 Respuesta:', response)

    rawResponse.value = response

    if (response.success && response.data) {
      purchases.value = response.data.purchases
      console.log('✅ Compras encontradas:', purchases.value.length)
    } else {
      error.value = response.message || 'Error al buscar compras'
    }
  } catch (err: unknown) {
    console.error('❌ Error:', err)
    error.value = err instanceof Error ? err.message : 'Error desconocido'
  } finally {
    isLoading.value = false
  }
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleString('es-CO', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}
</script>



