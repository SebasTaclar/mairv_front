<template>
  <div class="mac-page">
    <!-- Hero Banner con Carrusel Dinámico -->
    <section class="hero-banner">
      <div class="carousel-container">
        <div class="carousel-track" :style="{ transform: `translateX(-${currentSlide * 100}%)` }">
          <div
            v-for="product in macShowcaseProducts"
            :key="product.id"
            class="carousel-slide"
          >
            <div class="slide-content">
              <div class="slide-text">
                <h1 class="slide-title">{{ product.name }}</h1>
                <p class="slide-description">{{ product.description }}</p>
                <button @click="scrollToProducts" class="shop-now-btn">
                  Compra ahora
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="m7 13 5 5 5-5"/>
                    <path d="m7 6 5 5 5-5"/>
                  </svg>
                </button>
              </div>
              <div class="slide-image">
                <img :src="product.image" :alt="product.name" loading="lazy" decoding="async" />
              </div>
            </div>
          </div>
        </div>

        <!-- Controles del carrusel -->
        <button class="carousel-btn prev" @click="prevSlide" aria-label="Anterior">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="m15 18-6-6 6-6"/>
          </svg>
        </button>
        <button class="carousel-btn next" @click="nextSlide" aria-label="Siguiente">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="m9 18 6-6-6-6"/>
          </svg>
        </button>

        <!-- Indicadores -->
        <div class="carousel-indicators">
          <button
            v-for="(_, index) in macShowcaseProducts"
            :key="index"
            :class="['indicator', { active: currentSlide === index }]"
            @click="goToSlide(index)"
            :aria-label="`Ir a slide ${index + 1}`"
          ></button>
        </div>
      </div>
    </section>

    <!-- Productos Disponibles Section -->
    <section class="products-section">
      <div class="container">
        <div v-if="isLoadingProducts" class="loading-state">
          <div class="spinner"></div>
          <p>Cargando productos...</p>
        </div>

        <div v-else-if="macProducts.length > 0" class="products-container">
          <div
            v-for="product in macProducts"
            :key="product.id"
            class="product-card-modern"
            @click="handleAddToCart(product)"
          >
            <!-- Imagen del producto -->
            <div class="product-visual">
              <img
                :src="product.images[0]"
                :alt="product.name"
                loading="lazy"
                decoding="async"
                class="product-image"
              />
            </div>

            <!-- Información del producto -->
            <div class="product-details">
              <h2 class="product-title">{{ product.name }}</h2>
              <p class="product-tagline">{{ product.description }}</p>

              <div class="product-pricing">
                <span class="product-price">Precio ${{ product.price.toLocaleString() }}</span>
                <span v-if="product.originalPrice" class="product-price-original">
                  ${{ product.originalPrice.toLocaleString() }}
                </span>
              </div>

              <button class="product-btn" @click.stop="handleAddToCart(product)">
                Comprar
              </button>
            </div>
          </div>
        </div>

        <div v-else class="empty-state">
          <p>No hay productos Mac disponibles en este momento</p>
        </div>
      </div>
    </section>

    <!-- Sección de Información -->
    <section class="info-section">
      <div class="container">
        <div class="info-content-centered">
          <h2 class="info-title">Por qué elegir Mac</h2>
          <p class="info-text">
            Mac combina potencia excepcional con un diseño elegante. Equipado con los revolucionarios chips de Apple Silicon,
            ofrece un rendimiento increíble para edición de video, diseño gráfico, desarrollo y más. macOS proporciona una
            experiencia fluida y segura, perfectamente integrada con tu ecosistema Apple.
          </p>
        </div>
      </div>
    </section>

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
              Mac
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
  </div>
</template>

<script setup lang="ts">
import './styles/MacPage.css'
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useProducts } from '@/composables/useProducts'
import { useCategories } from '@/composables/useCategories'
import { useCart } from '@/composables/useCart'
import type { Product } from '@/composables/useProducts'


import { useHead } from '@vueuse/head'

useHead({
  title: 'MacBook Air, MacBook Pro | Apple Store Pro',
  meta: [
    {
      name: 'description',
      content: 'Descubre la potencia del nuevo MacBook Air, MacBook Pro y mucho más. Tienda oficial Apple Store Pro Colombia.'
    },
    { property: 'og:title', content: 'MacBook Air, MacBook Pro | Apple Store Pro' },
    { property: 'og:description', content: 'Descubre la potencia del nuevo MacBook Air, MacBook Pro y mucho más. Tienda oficial Apple Store Pro Colombia.' },
    { property: 'og:image', content: 'https://www.mistorepro.com/images/macbookpro.jpg' },
    { property: 'og:url', content: 'https://www.mistorepro.com/mac' },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:image', content: 'https://www.mistorepro.com/images/macbookpro.jpg' }
  ]
})

const router = useRouter()
const { regularProducts, loadProducts, showcaseProducts, loadShowcaseProducts } = useProducts()
const { categories, loadCategories } = useCategories()

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

const isLoadingProducts = ref(true)

// Carrusel dinámico basado en productos de showcase de Mac
const currentSlide = ref(0)
let autoplayInterval: number | null = null

const macCategory = computed(() => {
  return categories.value.find(cat =>
    cat.name.toLowerCase().includes('mac') ||
    cat.name.toLowerCase().includes('macbook') ||
    cat.name.toLowerCase().includes('imac')
  )
})

// Filtrar productos showcase de Mac para el carrusel
const macShowcaseProducts = computed(() => {
  if (!macCategory.value) return []

  return showcaseProducts.value.filter(p =>
    p.category === macCategory.value!.id ||
    p.category.toLowerCase().includes('mac')
  )
})

const nextSlide = () => {
  const total = macShowcaseProducts.value.length || 1
  currentSlide.value = (currentSlide.value + 1) % total
}

const prevSlide = () => {
  const total = macShowcaseProducts.value.length || 1
  currentSlide.value = (currentSlide.value - 1 + total) % total
}

const goToSlide = (index: number) => {
  currentSlide.value = index
}

// Auto-avance del carrusel
const startAutoplay = () => {
  autoplayInterval = window.setInterval(() => {
    nextSlide()
  }, 5000) // Cambia cada 5 segundos
}

const stopAutoplay = () => {
  if (autoplayInterval) {
    clearInterval(autoplayInterval)
    autoplayInterval = null
  }
}

// Filtrar productos de Mac
const macProducts = computed(() => {
  if (!macCategory.value) return []

  return regularProducts.value
    .filter(p => {
      const categoryMatch = p.category === macCategory.value!.id
      const statusMatch = p.status === 'available' || p.status === 'coming-soon'
      return categoryMatch && statusMatch
    })
    .sort((a, b) => {
      // Ordenar por precio de mayor a menor
      return b.price - a.price
    })
})

// Estado para el modal de producto
const showModal = ref(false)
const selectedProduct = ref<Product | null>(null)
const modalSelectedColor = ref('')
const selectedImageIndex = ref(0)

// Función para abrir modal del producto
const openProductModal = (product: Product) => {
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

// Función para agregar al carrito (abre el modal)
const handleAddToCart = (product: Product) => {
  openProductModal(product)
}

// Función para ir al checkout
const goToCheckout = () => {
  closeCart()
  router.push('/checkout')
}

// Función para hacer scroll a la sección de productos
const scrollToProducts = () => {
  const productsSection = document.querySelector('.products-section')
  if (productsSection) {
    productsSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}

// Función para agregar al carrito desde el modal
const addToCartFromModal = () => {
  if (selectedProduct.value) {
    if (selectedProduct.value.colors && selectedProduct.value.colors.length > 0 && !modalSelectedColor.value) {
      // Si el producto tiene colores pero no se ha seleccionado uno, no hacer nada
      return
    }

    // Obtener el nombre de la categoría
    const categoryName = categories.value.find(cat => cat.id === selectedProduct.value!.category)?.name || 'Producto'

    // Crear el producto mapeado para el carrito
    const mappedProduct = {
      ...selectedProduct.value,
      inStock: selectedProduct.value.status === 'available',
      image: selectedProduct.value.images[0],
      category: categoryName // Reemplazar el ID por el nombre
    }

    // Pasar el color seleccionado como tercer parámetro
    addToCart(mappedProduct, 1, modalSelectedColor.value || undefined)
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

// Cargar datos al montar
onMounted(async () => {
  try {
    isLoadingProducts.value = true
    await loadCategories()
    await loadProducts()
    await loadShowcaseProducts()
    startAutoplay()
  } catch (error) {
    console.error('Error cargando datos de Mac:', error)
  } finally {
    isLoadingProducts.value = false
  }
})

// Limpiar intervalo al desmontar
onUnmounted(() => {
  stopAutoplay()
})
</script>




