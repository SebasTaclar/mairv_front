<template>
  <div class="airpods-page">
    <section class="hero-banner">
      <div class="carousel-container">
        <div class="carousel-track" :style="{ transform: `translateX(-${currentSlide * 100}%)` }">
          <div v-for="product in airpodsShowcaseProducts" :key="product.id" class="carousel-slide">
            <div class="slide-content">
              <div class="slide-text">
                <h1 class="slide-title">{{ product.name }}</h1>
                <p class="slide-subtitle">{{ product.description }}</p>
                <button @click="scrollToProducts" class="shop-now-btn">
                  Compra ahora
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="m7 13 5 5 5-5"/>
                    <path d="m7 6 5 5 5-5"/>
                  </svg>
                </button>
              </div>
              <div class="slide-image">
                <img :src="product.image" :alt="product.name" loading="lazy" />
              </div>
            </div>
          </div>
        </div>

        <!-- Controles del carrusel -->
        <button class="carousel-btn prev" @click="prevSlide" aria-label="Anterior">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </button>
        <button class="carousel-btn next" @click="nextSlide" aria-label="Siguiente">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </button>

        <!-- Indicadores -->
        <div class="carousel-indicators">
          <button
            v-for="(product, index) in airpodsShowcaseProducts"
            :key="product.id"
            class="indicator"
            :class="{ active: currentSlide === index }"
            @click="goToSlide(index)"
            :aria-label="`Ir a ${product.name}`"
          ></button>
        </div>
      </div>
    </section>

    <section class="products-section">
      <div class="container">
        <div v-if="isLoadingProducts" class="loading-state">
          <div class="spinner"></div>
          <p>Cargando productos...</p>
        </div>

        <div v-else-if="airpodsProducts.length > 0" class="products-container">
          <div v-for="product in airpodsProducts" :key="product.id" class="product-card-modern" @click="handleAddToCart(product)">
            <div class="product-visual">
              <img :src="product.images[0]" :alt="product.name" loading="lazy" class="product-image" />
            </div>
            <div class="product-details">
              <h2 class="product-title">{{ product.name }}</h2>
              <p class="product-tagline">{{ product.description }}</p>
              <div class="product-pricing">
                <span class="product-price">Precio ${{ product.price.toLocaleString() }}</span>
                <span v-if="product.originalPrice" class="product-price-original">${{ product.originalPrice.toLocaleString() }}</span>
              </div>
              <button class="product-btn" @click.stop="handleAddToCart(product)">Comprar</button>
            </div>
          </div>
        </div>

        <div v-else class="empty-state">
          <p>No hay AirPods disponibles en este momento</p>
        </div>
      </div>
    </section>

    <section class="info-section">
      <div class="container">
        <div class="info-content-centered">
          <h2 class="info-title">¿Por qué elegir AirPods?</h2>
          <p class="info-text">Sonido espacial, cancelación de ruido y emparejamiento instantáneo con tu ecosistema Apple.</p>
        </div>
      </div>
    </section>

    <!-- Modal del producto -->
    <div v-if="showModal" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <button class="modal-close floating" @click="closeModal">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="m18 6-12 12"/>
            <path d="m6 6 12 12"/>
          </svg>
        </button>
        <div class="modal-body">
          <div class="modal-image">
            <div class="image-gallery">
              <img
                v-for="(image, index) in selectedProduct?.images"
                :key="index"
                :src="image"
                :alt="`${selectedProduct?.name} - ${index + 1}`"
                :class="{ active: selectedImageIndex === index }"
                @click="selectedImageIndex = index"
                loading="lazy"
                decoding="async"
              />
            </div>
            <div v-if="selectedProduct?.images && selectedProduct.images.length > 1" class="image-dots">
              <button
                v-for="(image, index) in selectedProduct.images"
                :key="index"
                :class="{ active: selectedImageIndex === index }"
                @click="selectedImageIndex = index"
              ></button>
            </div>
          </div>
          <div class="modal-info">
            <h2 class="modal-title">{{ selectedProduct?.name }}</h2>
            <div class="modal-category">
              AirPods
            </div>
            <p class="modal-description">
              {{ selectedProduct?.description }}
            </p>
            <div class="modal-price">
              <span class="modal-current-price">${{ selectedProduct?.price?.toLocaleString() }}</span>
              <span v-if="selectedProduct?.originalPrice" class="modal-original-price">
                ${{ selectedProduct?.originalPrice?.toLocaleString() }}
              </span>
            </div>

            <!-- Selector de colores en el modal -->
            <div v-if="selectedProduct?.colors && selectedProduct.colors.length > 0" class="modal-colors">
              <h4>Seleccionar color:</h4>
              <div class="color-options">
                <div
                  v-for="colorName in selectedProduct.colors"
                  :key="colorName"
                  class="color-option"
                  :class="{ active: modalSelectedColor === colorName }"
                  @click="modalSelectedColor = colorName"
                  :title="colorName"
                  :aria-label="'Color ' + colorName"
                >
                  <div
                    class="color-circle"
                    :style="{ backgroundColor: getColorHex(colorName), border: '2px solid ' + (modalSelectedColor === colorName ? '#26F7D7' : getColorHex(colorName)) }"
                  ></div>
                  <span class="color-name">{{ colorName }}</span>
                </div>
              </div>
            </div>

            <!-- Estado del producto -->
            <div class="modal-status">
              <span :class="['status-badge', getStatusClass(selectedProduct?.status || '')]">
                {{ getStatusText(selectedProduct?.status || '') }}
              </span>
            </div>

            <!-- Botón agregar al carrito -->
            <button
              @click="addToCartFromModal"
              :disabled="selectedProduct?.status !== 'available' || (selectedProduct?.colors && selectedProduct.colors.length > 0 && !modalSelectedColor)"
              class="modal-add-to-cart"
            >
              {{ selectedProduct?.status === 'available' ? 'Agregar al carrito' : 'No disponible' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Botón del carrito flotante -->
    <div v-if="totalItems > 0" class="floating-cart" @click="toggleCart">
      <div class="cart-icon">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="m5 7 1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2l1-12"/>
          <path d="M22 7H2"/>
          <path d="m9 3 2-2 2 2"/>
        </svg>
        <span class="cart-badge">{{ totalItems }}</span>
      </div>
      <div class="cart-tooltip">Ver carrito de compras</div>
    </div>

    <!-- Modal del carrito -->
    <div v-if="isCartOpen" class="cart-overlay" @click="closeCart">
      <div class="cart-modal" @click.stop>
        <div class="cart-header">
          <h3>Tu Carrito</h3>
          <button @click="closeCart" class="close-btn">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="m18 6-12 12"/>
              <path d="m6 6 12 12"/>
            </svg>
          </button>
        </div>

        <div class="cart-content">
          <div v-if="cartItems.length === 0" class="empty-cart">
            <p>Tu carrito está vacío</p>
          </div>

          <div v-else class="cart-items">
            <div
              v-for="item in cartItems"
              :key="item.id"
              class="cart-item"
            >
              <img :src="item.image" :alt="item.name" />
              <div class="item-details">
                <h4>{{ item.name }}</h4>
                <span class="item-category">{{ item.category }}</span>
                <span v-if="item.selectedColor" class="item-color">Color: {{ item.selectedColor }}</span>
                <div class="item-price">${{ item.price.toLocaleString() }}</div>
              </div>
              <div class="item-controls">
                <div class="quantity-controls">
                  <button @click="updateQuantity(item.id, item.quantity - 1, item.selectedColor)" class="quantity-btn minus">-</button>
                  <span>{{ item.quantity }}</span>
                  <button @click="updateQuantity(item.id, item.quantity + 1, item.selectedColor)" class="quantity-btn plus">+</button>
                </div>
                <button @click="removeFromCart(item.id, item.selectedColor)" class="remove-btn">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M3 6h18"/>
                    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/>
                    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
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
  </div>
</template>

<script setup lang="ts">
import './styles/AirPodsPage.css'
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useProducts } from '@/composables/useProducts'
import { useCategories } from '@/composables/useCategories'
import { useCart } from '@/composables/useCart'
import type { Product } from '@/composables/useProducts'
import { useRouter } from 'vue-router'


import { useHead } from '@vueuse/head'

useHead({
  title: 'AirPods Pro y AirPods Max y más | Apple Store Pro',
  meta: [
    {
      name: 'description',
      content: 'Descubre los AirPods Pro con cancelación de ruido y los AirPods Max. Audio de alta fidelidad y diseño premium. Tienda oficial Apple Store Pro Colombia.'
    },
    { property: 'og:title', content: 'AirPods Pro y AirPods Max | Apple Store Pro' },
    { property: 'og:description', content: 'Descubre y compra los AirPods Pro con cancelación de ruido y los AirPods Max. Audio de alta fidelidad y diseño premium. Tienda oficial Apple Store Pro Colombia.' },
    { property: 'og:image', content: 'https://www.mistorepro.com/images/airpods.jpg' },
    { property: 'og:url', content: 'https://www.mistorepro.com/airpods' },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:image', content: 'https://www.mistorepro.com/images/airpods.jpg' }
  ]
})


const router = useRouter()
const { regularProducts, loadProducts, showcaseProducts, loadShowcaseProducts } = useProducts()
const { categories, loadCategories } = useCategories()
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

const isLoadingProducts = ref(true)
const currentSlide = ref(0)
let autoplayInterval: number | null = null

// Estados para el modal
const showModal = ref(false)
const selectedProduct = ref<Product | null>(null)
const modalSelectedColor = ref('')
const selectedImageIndex = ref(0)

// Encontrar la categoría de AirPods
const airpodsCategory = computed(() => {
  // Esperar a que las categorías estén cargadas
  if (categories.value.length === 0) return null

  return categories.value.find(cat => {
    const name = cat.name.toLowerCase()
    // Buscar coincidencia exacta primero
    return name === 'airpods' || name === 'airpod' || name.startsWith('airpod')
  })
})

// Filtrar productos showcase de AirPods
const airpodsShowcaseProducts = computed(() => {
  // Si no hay productos showcase, devolver array vacío
  if (showcaseProducts.value.length === 0) return []

  // Si no encontramos la categoría, filtrar por nombre/categoría
  if (!airpodsCategory.value) {
    return showcaseProducts.value.filter(p => {
      const name = String(p.name || '').toLowerCase()
      const cat = String(p.category || '').toLowerCase()
      return cat.includes('airpod') || name.includes('airpod')
    })
  }

  // Si tenemos la categoría, filtrar por ID primero
  return showcaseProducts.value.filter(p => {
    if (p.category === airpodsCategory.value!.id) return true
    const name = String(p.name || '').toLowerCase()
    return name.includes('airpod')
  })
})

// Filtrar productos regulares de AirPods
const airpodsProducts = computed(() => {
  // Si no hay productos regulares, devolver array vacío
  if (regularProducts.value.length === 0) return []

  // Si no encontramos la categoría, filtrar por nombre/categoría
  if (!airpodsCategory.value) {
    return regularProducts.value.filter(p => {
      const name = String(p.name || '').toLowerCase()
      const cat = String(p.category || '').toLowerCase()
      return cat.includes('airpod') || name.includes('airpod')
    })
  }

  // Si tenemos la categoría, filtrar por ID primero
  return regularProducts.value.filter(p => {
    if (p.category === airpodsCategory.value!.id) return true
    const name = String(p.name || '').toLowerCase()
    return name.includes('airpod')
  })
})

const prevSlide = () => { const total = airpodsShowcaseProducts.value.length || 1; currentSlide.value = (currentSlide.value - 1 + total) % total }
const nextSlide = () => { const total = airpodsShowcaseProducts.value.length || 1; currentSlide.value = (currentSlide.value + 1) % total }
const goToSlide = (i: number) => { currentSlide.value = i }

const startAutoplay = () => { autoplayInterval = window.setInterval(() => nextSlide(), 5000) }
const stopAutoplay = () => { if (autoplayInterval) { clearInterval(autoplayInterval); autoplayInterval = null } }

const scrollToProducts = () => {
  const el = document.querySelector('.products-section')
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

// Funciones del modal
const openProductModal = (product: Product) => {
  selectedProduct.value = product
  modalSelectedColor.value = ''
  selectedImageIndex.value = 0
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  selectedProduct.value = null
  modalSelectedColor.value = ''
}

// Colores de Apple predeterminados
const appleColors: Record<string, string> = {
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
  'gold': '#ffd700'
}

// Normaliza nombres y obtiene color; fallback a gris claro
const getColorHex = (colorName: string): string => {
  if (!colorName) return '#cccccc'
  const key = colorName.trim().toLowerCase()
  return appleColors[key] || '#cccccc'
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

// Función para agregar al carrito desde el modal
const addToCartFromModal = () => {
  if (selectedProduct.value) {
    if (selectedProduct.value.colors && selectedProduct.value.colors.length > 0 && !modalSelectedColor.value) {
      return
    }

    const categoryName = categories.value.find(cat => cat.id === selectedProduct.value!.category)?.name || 'AirPods'

    const mappedProduct = {
      ...selectedProduct.value,
      inStock: selectedProduct.value.status === 'available',
      image: selectedProduct.value.images[0],
      category: categoryName
    }

    // Pasar el color seleccionado como tercer parámetro
    addToCart(mappedProduct, 1, modalSelectedColor.value)
    closeModal()
  }
}

// Función ahora abre el modal
const handleAddToCart = (product: Product) => {
  openProductModal(product)
}

// Función para ir al checkout
const goToCheckout = () => {
  closeCart()
  router.push('/checkout')
}

onMounted(async () => {
  try {
    isLoadingProducts.value = true
    // Primero cargamos las categorías
    if (categories.value.length === 0) {
      await loadCategories()
    }
    // Luego cargamos los productos en paralelo
    await Promise.all([
      loadProducts(),
      loadShowcaseProducts()
    ])
    startAutoplay()
  } catch (e) {
    console.error('Error cargando datos:', e)
  } finally {
    isLoadingProducts.value = false
  }
})

onUnmounted(() => stopAutoplay())
</script>



