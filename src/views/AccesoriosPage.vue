<template>
  <div class="accesorios-page">
    <!-- Hero Banner Section con Carrusel -->
    <section class="hero-banner">
      <div class="carousel-container">
        <!-- Slides del carrusel dinámicos desde productos de showcase de Accesorios -->
        <div class="carousel-track" :style="{ transform: `translateX(-${currentSlide * 100}%)` }">
          <div
            v-for="product in accesoriosShowcaseProducts"
            :key="product.id"
            class="carousel-slide"
          >
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
                <img
                  :src="product.image"
                  :alt="product.name"
                  loading="lazy"
                />
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
            v-for="(product, index) in accesoriosShowcaseProducts"
            :key="product.id"
            class="indicator"
            :class="{ active: currentSlide === index }"
            @click="goToSlide(index)"
            :aria-label="`Ir a ${product.name}`"
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

        <div v-else-if="accesoriosProducts.length > 0" class="products-container">
          <div
            v-for="product in accesoriosProducts"
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
          <p>No hay Accesorioss disponibles en este momento</p>
        </div>
      </div>
    </section>

    <!-- Sección Informativa -->
    <section class="info-section">
      <div class="container">
        <div class="info-content-centered">
          <h2 class="info-title">¿Por qué elegir nuestros Accesorios?</h2>
          <p class="info-text">
            Completa tu experiencia Apple con accesorios diseñados para funcionar en perfecta armonía
            con tus dispositivos. Desde AirPods Pro con cancelación de ruido activa y audio espacial,
            hasta Magic Keyboard, Mouse y fundas protectoras Premium. Cada accesorio Apple combina
            funcionalidad excepcional con diseño elegante. Carga inalámbrica MagSafe, cables Lightning
            y USB-C certificados, y mucho más para sacar el máximo provecho de tu ecosistema Apple.
          </p>
        </div>
      </div>
    </section>

    <!-- Sección de Características Destacadas
    <section class="features-section">
      <div class="container">
        <div class="features-grid">
          <div class="feature-card">
            <div class="feature-icon">
              <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect>
                <line x1="12" y1="18" x2="12.01" y2="18"></line>
              </svg>
            </div>
            <h3 class="feature-title">Dynamic Island</h3>
            <p class="feature-text">
              Una nueva forma de interactuar con tu Accesorios. Notificaciones en vivo,
              alertas y actividades en una experiencia fluida y mágica.
            </p>
          </div>

          <div class="feature-card">
            <div class="feature-icon">
              <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"></circle>
                <path d="M12 6v6l4 2"></path>
              </svg>
            </div>
            <h3 class="feature-title">Chip A18 Pro</h3>
            <p class="feature-text">
              Rendimiento extremo. El chip más avanzado en un smartphone con
              velocidades impresionantes y eficiencia energética sin precedentes.
            </p>
          </div>

          <div class="feature-card">
            <div class="feature-icon">
              <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                <circle cx="8.5" cy="8.5" r="1.5"></circle>
                <polyline points="21 15 16 10 5 21"></polyline>
              </svg>
            </div>
            <h3 class="feature-title">Sistema de Cámaras Pro</h3>
            <p class="feature-text">
              Captura cada momento con calidad cinematográfica. Fotos de 48MP,
              modo nocturno mejorado y video 4K ProRes.
            </p>
          </div>

          <div class="feature-card">
            <div class="feature-icon">
              <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
              </svg>
            </div>
            <h3 class="feature-title">Batería de Todo el Día</h3>
            <p class="feature-text">
              Hasta 29 horas de reproducción de video. Carga rápida,
              carga inalámbrica y compatible con MagSafe.
            </p>
          </div>
        </div>
      </div>
    </section> -->

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
              Accesorios
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
import './styles/AccesoriosPage.css'
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useProducts } from '@/composables/useProducts'
import { useCategories } from '@/composables/useCategories'
import { useCart } from '@/composables/useCart'
import type { Product } from '@/composables/useProducts'
import { useHead } from '@vueuse/head'

const router = useRouter()
const { regularProducts, loadProducts, showcaseProducts, loadShowcaseProducts } = useProducts()
const { categories, loadCategories } = useCategories()




useHead({
  title: 'Accesorios Apple Originales | Apple Store Pro',
  meta: [
    {
      name: 'description',
      content: 'Compra y descubre nuestra colección de accesorios originales Apple: Apple Pencil, teclados, airtag y más. Tienda oficial Apple Store Pro Colombia.'
    },
    { property: 'og:title', content: 'Accesorios Apple Originales | Apple Store Pro' },
    { property: 'og:description', content: 'Compra y descubre nuestra colección de accesorios originales Apple: Apple Pencil, teclados, airtag y más. Tienda oficial Apple Store Pro Colombia.' },
    { property: 'og:image', content: 'https://www.mistorepro.com/images/accesorios.jpg' },
    { property: 'og:url', content: 'https://www.mistorepro.com/accesorios' },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:image', content: 'https://www.mistorepro.com/images/accesorios.jpg' }
  ]
})


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

// Carrusel dinámico basado en productos de showcase de Accesorios
const currentSlide = ref(0)
let autoplayInterval: number | null = null

// Obtener la categoría de Accesorios
const accesoriosCategory = computed(() => {
  return categories.value.find(cat =>
    cat.name.toLowerCase().includes('accesorio') ||
    cat.name.toLowerCase().includes('accessory')
  )
})

// Filtrar productos showcase de Accesorios para el carrusel
const accesoriosShowcaseProducts = computed(() => {
  if (!accesoriosCategory.value) return []

  return showcaseProducts.value.filter(p =>
    p.category === accesoriosCategory.value!.id ||
    p.category.toLowerCase().includes('accesorio')
  )
})

const nextSlide = () => {
  const total = accesoriosShowcaseProducts.value.length || 1
  currentSlide.value = (currentSlide.value + 1) % total
}

const prevSlide = () => {
  const total = accesoriosShowcaseProducts.value.length || 1
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

// Filtrar productos de Accesorios
const accesoriosProducts = computed(() => {
  if (!accesoriosCategory.value) return []

  return regularProducts.value
    .filter(p => {
      const categoryMatch = p.category === accesoriosCategory.value!.id
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

// Función obsoleta - ahora abre el modal
const handleAddToCart = (product: Product) => {
  openProductModal(product)
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
    console.error('Error cargando datos de Accesorios:', error)
  } finally {
    isLoadingProducts.value = false
  }
})

// Limpiar intervalo al desmontar
onUnmounted(() => {
  stopAutoplay()
})
</script>






