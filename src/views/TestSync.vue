<!-- Página de prueba para demostrar la sincronización de productos -->
<template>
  <div class="test-page">
    <div class="container">
      <h1>🧪 Prueba de Sincronización de Productos</h1>
      <p class="description">
        Esta página demuestra cómo los productos creados en el AdminDashboard
        aparecen automáticamente en ProductStore
      </p>

      <!-- Estadísticas -->
      <div class="stats-section">
        <div class="stat-card">
          <h3>Total de Productos</h3>
          <div class="number">{{ products.length }}</div>
        </div>
        <div class="stat-card">
          <h3>Productos Disponibles</h3>
          <div class="number">{{ availableProducts.length }}</div>
        </div>
        <div class="stat-card">
          <h3>Categorías</h3>
          <div class="number">{{ categories.length }}</div>
        </div>
      </div>

      <!-- Lista de productos sincronizados -->
      <div class="sync-demonstration">
        <h2>📦 Productos Sincronizados desde Admin</h2>
        <div class="product-list">
          <div
            v-for="product in products"
            :key="product.id"
            class="sync-product-card"
          >
            <img :src="product.images[0]" :alt="product.name" class="product-img">
            <div class="product-details">
              <h4>{{ product.name }}</h4>
              <p class="category">{{ getCategoryName(product.category) }}</p>
              <p class="price">${{ product.price.toLocaleString() }}</p>
              <span
                :class="['status', product.status]"
              >
                {{ getStatusText(product.status) }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Instrucciones -->
      <div class="instructions">
        <h2>🚀 Cómo probarlo</h2>
        <ol>
          <li>Ve al <strong>AdminDashboard</strong> (sección de administración)</li>
          <li>Agrega un nuevo producto con nombre, precio, descripción e imagen</li>
          <li>Regresa a esta página y verás el producto aquí automáticamente</li>
          <li>Ve a <strong>ProductStore</strong> y verás que también aparece allí</li>
          <li>¡Los cambios son en tiempo real! 🎉</li>
        </ol>
      </div>

      <!-- Enlaces de navegación -->
      <div class="navigation-links">
        <router-link to="/" class="nav-btn primary">
          🏠 Ir al Home
        </router-link>
        <button @click="openAdmin" class="nav-btn secondary">
          ⚙️ Abrir Admin
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import './styles/TestSync.css'
import { useProducts } from '@/composables/useProducts'

// Usar el composable de productos
const { products, availableProducts, categories, getCategoryById } = useProducts()

// Función helper para obtener el nombre de la categoría
const getCategoryName = (categoryId: string) => {
  return getCategoryById(categoryId)?.name || 'Sin categoría'
}

// Función helper para el texto del estado
const getStatusText = (status: string) => {
  const statusMap: Record<string, string> = {
    'available': 'Disponible',
    'out-of-stock': 'Sin Stock',
    'coming-soon': 'Próximamente'
  }
  return statusMap[status] || status
}

// Función para abrir el admin (simulada)
const openAdmin = () => {
  alert('💡 Para acceder al AdminDashboard, ve al menú principal y selecciona la opción de administración')
}
</script>


