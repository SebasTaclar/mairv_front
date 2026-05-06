<template>
  <section class="product-store">
    <div class="container">
      <!-- Header de la sección -->
      <div class="store-header">
        <h2 class="store-title">
          🛍️ Nuestra Tienda
        </h2>
        <p class="store-subtitle">
          Lleva contigo el mensaje de fe con nuestros productos exclusivos MAIRV
        </p>
      </div>

      <!-- Barra de búsqueda mejorada -->
      <div class="search-bar">
        <div class="search-input-wrapper">
          <svg class="search-icon" viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
            <path fill="currentColor"
              d="M10 2a8 8 0 1 1 0 16 8 8 0 0 1 0-16zm8.707 17.293-4.387-4.387a9 9 0 1 0-1.414 1.414l4.387 4.387a1 1 0 0 0 1.414-1.414z" />
          </svg>

          <input type="search" v-model="searchTerm" placeholder="Buscar por Nombre del Producto..."
            aria-label="Buscar productos por título" class="search-input" />

          <button v-if="searchTerm" class="search-clear" @click.prevent="searchTerm = ''"
            aria-label="Limpiar búsqueda">X</button>
        </div>
      </div>

      <!-- Filtros de categoría -->
      <div class="category-filters">
        <button v-for="category in categoryOptions" :key="category" @click="selectedCategory = category"
          :class="['filter-btn', { 'active': selectedCategory === category }]">
          {{ category }}
        </button>
      </div>

      <!-- Grid de productos -->
      <div class="products-grid">
        <div v-for="product in filteredProducts" :key="product.id" class="product-card"
          @click="openProductModal(product)">
          <!-- Categoría encima de la imagen -->
          <span class="product-category-top">{{ product.category }}</span>

          <!-- Imagen del producto -->
          <div class="product-image">
            <img :src="product.images[0]" :alt="product.name" loading="lazy" decoding="async" />
            <div v-if="product.originalPrice" class="discount-badge">
              -{{ Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) }}%
            </div>
            <div v-if="!product.inStock" class="out-of-stock-overlay">
              <span>Agotado</span>
            </div>
            <!-- Estado del producto en esquina inferior izquierda -->
            <span :class="['product-status-image', getStatusClass(product.status)]">
              {{ getStatusText(product.status) }}
            </span>
          </div>

          <!-- Información del producto -->
          <div class="product-info">
            <h3 class="product-name">{{ product.name }}</h3>
            <div class="product-description">
              <p class="truncated">
                {{ product.description }}
              </p>
              <button v-if="shouldShowReadMore(product.description)" @click.stop="openProductModal(product)"
                class="read-more-btn">
                Ver más
              </button>
            </div>

            <!-- Precios -->
            <div class="price-section">
              <span class="current-price">${{ product.price.toLocaleString() }}</span>
              <span v-if="product.originalPrice" class="original-price">
                ${{ product.originalPrice.toLocaleString() }}
              </span>
            </div>
          </div>
        </div>
      </div> <!-- Botón del carrito flotante -->
      <div v-if="totalItems > 0" class="floating-cart" @click="toggleCart">
        <div class="cart-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="m5 7 1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2l1-12" />
            <path d="M22 7H2" />
            <path d="m9 3 2-2 2 2" />
          </svg>
          <span class="cart-badge">{{ totalItems }}</span>
        </div>
        <div class="cart-tooltip">Ver carrito de compras</div>
      </div>
    </div>

    <!-- Modal del carrito -->
    <div v-if="isCartOpen" class="cart-overlay" @click="closeCart">
      <div class="cart-modal" @click.stop>
        <div class="cart-header">
          <h3>Tu Carrito</h3>
          <button @click="closeCart" class="close-btn">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="m18 6-12 12" />
              <path d="m6 6 12 12" />
            </svg>
          </button>
        </div>

        <div class="cart-content">
          <div v-if="cartItems.length === 0" class="empty-cart">
            <p>Tu carrito está vacío</p>
          </div>

          <div v-else class="cart-items">
            <div v-for="item in cartItems" :key="item.id" class="cart-item">
              <img :src="item.image" :alt="item.name" />
              <div class="item-details">
                <h4>{{ item.name }}</h4>
                <span class="item-category">{{ item.category }}</span>
                <span v-if="item.selectedColor" class="item-color">Color: {{ item.selectedColor }}</span>
                <div class="item-price">${{ item.price.toLocaleString() }}</div>
              </div>
              <div class="item-controls">
                <div class="quantity-controls">
                  <button @click="updateQuantity(item.id, item.quantity - 1, item.selectedColor)"
                    class="quantity-btn minus">-</button>
                  <span>{{ item.quantity }}</span>
                  <button @click="updateQuantity(item.id, item.quantity + 1, item.selectedColor)"
                    class="quantity-btn plus">+</button>
                </div>
                <button @click="removeFromCart(item.id, item.selectedColor)" class="remove-btn">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M3 6h18" />
                    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div v-if="cartItems.length > 0" class="cart-footer">
          <div class="cart-total-display">
            <strong>Total: ${{ totalPrice.toLocaleString() }}</strong>
          </div>
          <div class="cart-actions">
            <button @click="clearCart" class="btn-clear">
              Limpiar carrito
            </button>
            <button @click="goToCheckout" class="btn-checkout">
              Finalizar Pedido
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal del producto -->
    <div v-if="showModal" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <button class="modal-close floating" @click="closeModal">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="m18 6-12 12" />
            <path d="m6 6 12 12" />
          </svg>
        </button>
        <div class="modal-body">
          <div class="modal-image">
            <div class="image-gallery">
              <img v-for="(image, index) in selectedProduct?.images" :key="index" :src="image"
                :alt="`${selectedProduct?.name} - ${index + 1}`" :class="{ active: selectedImageIndex === index }"
                @click="selectedImageIndex = index" loading="lazy" decoding="async" />
            </div>
            <div v-if="selectedProduct?.images && selectedProduct.images.length > 1" class="image-dots">
              <button v-for="(image, index) in selectedProduct.images" :key="index"
                :class="{ active: selectedImageIndex === index }" @click="selectedImageIndex = index"></button>
            </div>
          </div>

          <div class="modal-info">
            <h2 class="modal-title">{{ selectedProduct?.name }}</h2>
            <div class="modal-category">
              {{ selectedProduct?.category }}
            </div>
            <p class="modal-description">
              {{ selectedProduct?.description }}
            </p>

            <div class="modal-price">
              <span class="modal-current-price">${{ selectedProduct?.price?.toLocaleString() }}</span>
              <span v-if="selectedProduct?.originalPrice" class="modal-original-price">${{
                selectedProduct?.originalPrice?.toLocaleString() }}</span>
            </div>

            <div v-if="selectedProduct?.colors && selectedProduct.colors.length > 0" class="modal-colors">
              <h4>Seleccionar color:</h4>
              <div class="color-options">
                <div v-for="colorName in selectedProduct.colors" :key="colorName" class="color-option"
                  :class="{ active: modalSelectedColor === colorName }" @click="modalSelectedColor = colorName">
                  <div class="color-circle"
                    :style="{ backgroundColor: getColorHex(colorName), border: '2px solid ' + (modalSelectedColor === colorName ? '#26F7D7' : getColorHex(colorName)) }">
                  </div>
                  <span class="color-name">{{ colorName }}</span>
                </div>
              </div>
            </div>

            <div class="modal-status">
              <span :class="['status-badge', getStatusClass(selectedProduct?.status || '')]">
                {{ getStatusText(selectedProduct?.status || '') }}
              </span>
            </div>

            <button @click="addToCartFromModal"
              :disabled="selectedProduct?.status !== 'available' || (selectedProduct?.colors && selectedProduct.colors.length > 0 && !modalSelectedColor)"
              class="modal-add-to-cart">
              {{ selectedProduct?.status === 'available' ? 'Agregar al carrito' : 'No disponible' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>


<script setup lang="ts">
import './styles/ProductStore.css'
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useCart } from '@/composables/useCart'
import { useProducts, type Product as ProductType } from '@/composables/useProducts'

// Router
const router = useRouter()
const route = useRoute()

// Usar el composable del carrito
const {
  cartItems,
  isCartOpen,
  totalItems,
  totalPrice,
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
  toggleCart,
  closeCart
} = useCart()

// Usar el composable de productos
const {
  availableProducts,
  categories,
  getCategoryById,
  loadProducts,
  loadCategories
} = useProducts()

// Productos locales de merchandising (iglesia MAIRV)
const localChurchProducts = ref<ProductType[]>([
  {
    id: 'church-tshirt-1',
    name: 'Camiseta MAIRV - Edición Fe',
    description: 'Camiseta 100% algodón con diseño exclusivo MAIRV. Mensaje: "Fe que mueve montañas". Disponible en varios colores.',
    price: 45000,
    originalPrice: 60000,
    images: ['https://via.placeholder.com/400x400/22d3ee/ffffff?text=Camiseta+MAIRV'],
    category: 'merchandising',
    status: 'available',
    colors: ['Blanco', 'Negro', 'Azul', 'Gris'],
    createdAt: new Date()
  },
  {
    id: 'church-cap-1',
    name: 'Gorra MAIRV - Clásica',
    description: 'Gorra bordada con logo MAIRV. Ajustable, perfecta para eventos al aire libre.',
    price: 35000,
    originalPrice: 45000,
    images: ['https://via.placeholder.com/400x400/22d3ee/ffffff?text=Gorra+MAIRV'],
    category: 'merchandising',
    status: 'available',
    colors: ['Negro', 'Azul', 'Blanco'],
    createdAt: new Date()
  },
  {
    id: 'church-hoodie-1',
    name: 'Sudadera MAIRV - Premium',
    description: 'Sudadera con capucha, material de alta calidad. Diseño "Juntos en Cristo". Ideal para clima frío.',
    price: 85000,
    originalPrice: 110000,
    images: ['https://via.placeholder.com/400x400/22d3ee/ffffff?text=Sudadera+MAIRV'],
    category: 'merchandising',
    status: 'available',
    colors: ['Negro', 'Gris', 'Azul marino'],
    createdAt: new Date()
  },
  {
    id: 'church-tshirt-2',
    name: 'Camiseta MAIRV - Edición Esperanza',
    description: 'Camiseta con diseño "Esperanza Viva". Material transpirable y cómodo para uso diario.',
    price: 45000,
    images: ['https://via.placeholder.com/400x400/22d3ee/ffffff?text=Camiseta+Esperanza'],
    category: 'merchandising',
    status: 'available',
    colors: ['Blanco', 'Rosa', 'Celeste'],
    createdAt: new Date()
  },
  {
    id: 'church-bag-1',
    name: 'Bolso MAIRV - Estudio Bíblico',
    description: 'Bolso de lona resistente con múltiples compartimentos. Perfecto para llevar tu Biblia y materiales de estudio.',
    price: 55000,
    images: ['https://via.placeholder.com/400x400/22d3ee/ffffff?text=Bolso+MAIRV'],
    category: 'merchandising',
    status: 'available',
    colors: ['Beige', 'Negro', 'Azul'],
    createdAt: new Date()
  },
  {
    id: 'church-mug-1',
    name: 'Taza MAIRV - Café con Cristo',
    description: 'Taza cerámica de 350ml con diseño inspirador. Apta para lavavajillas y microondas.',
    price: 25000,
    images: ['https://via.placeholder.com/400x400/22d3ee/ffffff?text=Taza+MAIRV'],
    category: 'merchandising',
    status: 'available',
    createdAt: new Date()
  },
  {
    id: 'church-notebook-1',
    name: 'Libreta MAIRV - Devocional',
    description: 'Libreta de notas con tapa dura y 200 páginas. Ideal para tus devocionales diarios.',
    price: 30000,
    images: ['https://via.placeholder.com/400x400/22d3ee/ffffff?text=Libreta+MAIRV'],
    category: 'merchandising',
    status: 'available',
    createdAt: new Date()
  },
  {
    id: 'church-bracelet-1',
    name: 'Pulsera MAIRV - Fe y Amor',
    description: 'Pulsera tejida con mensaje "Fe y Amor". Ajustable, unisex.',
    price: 15000,
    images: ['https://via.placeholder.com/400x400/22d3ee/ffffff?text=Pulsera+MAIRV'],
    category: 'merchandising',
    status: 'available',
    colors: ['Multicolor', 'Azul', 'Rojo'],
    createdAt: new Date()
  }
])

// Cargar productos y categorías al montar el componente
onMounted(async () => {
  console.log('🏪 [ProductStore] onMounted - Iniciando carga...')
  console.log('🏪 [ProductStore] Productos locales de merchandising:', localChurchProducts.value.length)

  await loadCategories()
  console.log('🏪 [ProductStore] Categorías cargadas:', categories.value.length)

  await loadProducts()
  console.log('🏪 [ProductStore] Productos del backend cargados:', availableProducts.value.length)
  console.log('🏪 [ProductStore] Total productos (backend + merchandising):', products.value.length)

  // Si la ruta incluye query `q`, inicializar el término de búsqueda
  const q = (route.query.q as string) || ''
  if (q) {
    searchTerm.value = q
  }

  // Registrar listener global para búsquedas desde el header
  const globalSearchHandler = (e: Event) => {
    const payload = (e as CustomEvent).detail
    if (payload && payload.term !== undefined) {
      searchTerm.value = String(payload.term)
    }
  }
  window.addEventListener('global-search', globalSearchHandler)

  // Limpiar listener cuando el componente se desmonta
  onUnmounted(() => {
    window.removeEventListener('global-search', globalSearchHandler)
  })
})

// Estado local
const selectedCategory = ref('Todos')
// Término de búsqueda libre
const searchTerm = ref('')

// Estado para el modal
const showModal = ref(false)
const selectedProduct = ref<ProductType | null>(null)
const modalSelectedColor = ref('')
const selectedImageIndex = ref(0)

// Combinar productos del backend con productos locales de merchandising
const products = computed(() => [...availableProducts.value, ...localChurchProducts.value])

// Función para determinar si la descripción es lo suficientemente larga (más de 4 líneas aprox 150 caracteres)
const shouldShowReadMore = (description: string) => {
  // Considerando que cada línea tiene aproximadamente 35-40 caracteres en el ancho de tarjeta
  // 4 líneas = aproximadamente 150 caracteres
  return description.length > 150
}

// Computada para mapear el producto con inStock e image (para compatibilidad con useCart)
const mappedSelectedProduct = computed(() => {
  if (!selectedProduct.value) return null
  return {
    ...selectedProduct.value,
    inStock: selectedProduct.value.status === 'available',
    image: selectedProduct.value.images[0] // Usar la primera imagen para el carrito
  }
})

// Función para abrir modal del producto
const openProductModal = (product: ProductType) => {
  selectedProduct.value = product
  modalSelectedColor.value = ''
  selectedImageIndex.value = 0
  showModal.value = true
}

// Función para cerrar modal
const closeModal = () => {
  showModal.value = false
  selectedProduct.value = null
  modalSelectedColor.value = ''
}

// Función para ir al checkout
const goToCheckout = () => {
  closeCart()
  router.push('/checkout')
}

// Función para agregar al carrito desde el modal
const addToCartFromModal = () => {
  if (selectedProduct.value) {
    if (selectedProduct.value.colors && selectedProduct.value.colors.length > 0 && !modalSelectedColor.value) {
      // Si el producto tiene colores pero no se ha seleccionado uno, no hacer nada
      return
    }
    // Pasar el color seleccionado como tercer parámetro
    addToCart(mappedSelectedProduct.value!, 1, modalSelectedColor.value || undefined)
    closeModal()
  }
}

// Función para obtener el texto del estado del producto
const getStatusText = (status: string) => {
  switch (status) {
    case 'available':
      return 'Disponible'
    case 'coming-soon':
      return 'Próximamente'
    case 'out-of-stock':
      return 'Agotado'
    default:
      return 'No disponible'
  }
}

// Función para obtener la clase CSS del estado
const getStatusClass = (status: string) => {
  switch (status) {
    case 'available':
      return 'status-available'
    case 'coming-soon':
      return 'status-coming-soon'
    case 'out-of-stock':
      return 'status-out-of-stock'
    default:
      return 'status-unavailable'
  }
}

// Categorías disponibles para filtrado
const categoryOptions = computed(() => {
  const categoryNames = ['Todos', 'Merchandising']
  categories.value.forEach(cat => {
    const categoryName = cat.name
    if (!categoryNames.includes(categoryName)) {
      categoryNames.push(categoryName)
    }
  })
  return categoryNames
})

// Colores predeterminados (incluye variantes en inglés y español)
const appleColors: Record<string, string> = {
  // Paleta original
  'naranja cósmico': '#ff5e00',
  'naranja cosmico': '#ff5e00',
  'azul profundo': '#003d5c',
  'plata': '#c0c0c0',
  'silver': '#c0c0c0',
  'azul': '#1976d2',
  'blue': '#1976d2',
  'negro': '#000000',
  'black': '#000000',
  'blanco': '#ffffff',
  'white': '#ffffff',
  'azul neblina': '#a8c7dd',
  'dorado claro': '#f7e7a1',
  'azul cielo': '#87ceeb',
  'rosa': '#ff69b4',
  'pink': '#ff69b4',
  'amarillo': '#ffeb3b',
  'yellow': '#ffeb3b',
  'verde': '#4caf50',
  'green': '#4caf50',
  'púrpura': '#9c27b0',
  'purpura': '#9c27b0',
  'purple': '#9c27b0',
  'morado': '#9c27b0',
  'oro': '#ffd700',
  'gold': '#ffd700',
  // Colores adicionales para merchandising
  'gris': '#808080',
  'gray': '#808080',
  'azul marino': '#000080',
  'navy': '#000080',
  'celeste': '#87ceeb',
  'beige': '#f5f5dc',
  'rojo': '#ff0000',
  'red': '#ff0000',
  'multicolor': 'linear-gradient(90deg, #ff0000, #00ff00, #0000ff)'
}

// Normaliza nombres y obtiene color; fallback a gris claro
const getColorHex = (colorName: string): string => {
  if (!colorName) return '#cccccc'
  const key = colorName.trim().toLowerCase()
  return appleColors[key] || '#cccccc'
}

// Productos filtrados
const filteredProducts = computed(() => {
  const term = searchTerm.value.trim().toLowerCase()

  const mapAndEnhance = (list: ProductType[]) => list
    .map((p: ProductType) => {
      // Para productos locales (merchandising), usar category directamente
      // Para productos del backend, obtener el nombre de la categoría
      const categoryName = p.category === 'merchandising'
        ? 'Merchandising'
        : (getCategoryById(p.category)?.name || 'Sin categoría')

      return {
        ...p,
        category: categoryName,
        inStock: p.status === 'available'
      }
    })
    .sort((a: ProductType, b: ProductType) => {
      // Primero los disponibles (available), luego los próximamente (coming-soon)
      if (a.status === 'available' && b.status !== 'available') return -1
      if (a.status !== 'available' && b.status === 'available') return 1
      return 0
    })

  let baseList = []
  if (selectedCategory.value === 'Todos') {
    baseList = products.value.filter(p => p.status === 'available' || p.status === 'coming-soon')
  } else if (selectedCategory.value === 'Merchandising') {
    // Filtrar solo productos de merchandising
    baseList = products.value.filter(p => p.category === 'merchandising' && (p.status === 'available' || p.status === 'coming-soon'))
  } else {
    baseList = products.value.filter(p => getCategoryById(p.category)?.name === selectedCategory.value && (p.status === 'available' || p.status === 'coming-soon'))
  }

  // Si hay término de búsqueda, filtrar SÓLO por el nombre (título)
  if (term) {
    baseList = baseList.filter(p => {
      const name = String(p.name || '').toLowerCase()
      return name.includes(term)
    })
  }

  return mapAndEnhance(baseList)
})
</script>



