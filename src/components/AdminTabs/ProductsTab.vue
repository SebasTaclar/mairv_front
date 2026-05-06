<template>
  <div class="products-tab">
    <!-- Header -->
    <div class="section-header">
      <h2>Gestión de Productos</h2>
      <button class="btn btn-primary" @click="editProduct(null)">
        <span class="btn-icon">➕</span>
        Nuevo Producto
      </button>
    </div>

    <!-- Barra de búsqueda -->
    <div class="search-bar">
      <div class="search-input-wrapper">
        <svg class="search-icon" viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
          <path fill="currentColor" d="M10 2a8 8 0 1 1 0 16 8 8 0 0 1 0-16zm8.707 17.293-4.387-4.387a9 9 0 1 0-1.414 1.414l4.387 4.387a1 1 0 0 0 1.414-1.414z"/>
        </svg>
        <input
          type="search"
          v-model="searchProducts"
          placeholder="Buscar productos por nombre..."
          aria-label="Buscar productos"
          class="search-input"
        />
        <button v-if="searchProducts" class="search-clear" @click.prevent="searchProducts = ''" aria-label="Limpiar búsqueda">X</button>
      </div>
    </div>

    <!-- Grid de productos -->
    <div class="products-grid">
      <div v-for="product in filteredProducts" :key="product.id" class="product-card">
        <div class="product-image">
          <img v-if="product.images && product.images.length > 0" :src="product.images[0]" :alt="product.name" />
          <div v-else class="no-image">📷</div>
        </div>
        <div class="product-info">
          <h3>{{ product.name }}</h3>
          <p class="product-description">{{ product.description }}</p>
          <div class="product-meta">
            <span class="price">${{ product.price.toLocaleString() }}</span>
            <span :class="['status', product.status]">{{ getStatusText(product.status) }}</span>
          </div>
          <div class="product-actions">
            <button class="btn btn-sm btn-secondary" @click="editProduct(product)">✏️ Editar</button>
            <button class="btn btn-sm btn-danger" @click="deleteProductConfirm(product.id)">🗑️ Eliminar</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Estado vacío -->
    <div v-if="filteredProducts.length === 0 && !searchProducts" class="empty-state">
      <div class="empty-icon">📦</div>
      <h3>No hay productos</h3>
      <p>Comienza agregando tu primer producto</p>
      <button class="btn btn-primary" @click="editProduct(null)">
        Crear Primer Producto
      </button>
    </div>
    <div v-else-if="filteredProducts.length === 0 && searchProducts" class="empty-state">
      <div class="empty-icon">🔍</div>
      <h3>No se encontraron resultados</h3>
      <p>No hay productos que coincidan con "{{ searchProducts }}"</p>
      <button class="btn btn-secondary" @click="searchProducts = ''">
        Limpiar búsqueda
      </button>
    </div>

    <!-- Modal de Producto -->
    <div v-if="showForm" class="modal-overlay" @click="closeForm">
      <div class="modal" @click.stop>
        <div class="modal-header">
          <h3>{{ editingProduct ? 'Editar Producto' : 'Nuevo Producto' }}</h3>
          <button class="modal-close" @click="closeForm">✕</button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="saveProduct">
            <div class="form-group">
              <label>Nombre del Producto *</label>
              <input v-model="form.name" type="text" class="form-input" required placeholder="Ej: iPhone 15 Pro" />
            </div>

            <div class="form-group">
              <label>Descripción</label>
              <textarea v-model="form.description" class="form-input" rows="3" placeholder="Describe las características principales del producto"></textarea>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label>Precio *</label>
                <div class="price-input">
                  <span class="currency">$</span>
                  <input v-model.number="form.price" type="number" class="form-input" step="1000" min="0" required placeholder="0" />
                </div>
              </div>
              <div class="form-group">
                <label>Precio Original (descuento)</label>
                <div class="price-input">
                  <span class="currency">$</span>
                  <input v-model.number="form.originalPrice" type="number" class="form-input" step="1000" min="0" placeholder="0" />
                </div>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label>Categoría *</label>
                <select v-model="form.category" class="form-input" required>
                  <option value="">Seleccionar categoría</option>
                  <option v-for="category in categories" :key="category.id" :value="category.id">
                    {{ category.name }}
                  </option>
                </select>
              </div>
              <div class="form-group">
                <label>Estado de Disponibilidad *</label>
                <select v-model="form.status" class="form-input" required>
                  <option value="available">✅ Disponible</option>
                  <option value="out-of-stock">❌ Sin Stock</option>
                  <option value="coming-soon">🔜 Próximamente</option>
                </select>
              </div>
            </div>

            <!-- Selector de Colores -->
            <div class="form-group">
              <label>Colores Disponibles</label>
              <div class="colors-selector">
                <div class="colors-grid">
                  <div
                    v-for="color in appleColors"
                    :key="color.name"
                    class="color-option"
                    :class="{ selected: isColorSelected(color.name) }"
                    @click="toggleProductColor(color.name)"
                  >
                    <div class="color-circle" :style="{ background: color.hex }">
                      <span v-if="isColorSelected(color.name)" class="check-icon">✓</span>
                    </div>
                    <span class="color-name">{{ color.name }}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Imagen -->
            <div class="form-group">
              <label>Imagen del Producto *</label>
              <div class="image-tabs">
                <button
                  type="button"
                  class="tab-btn"
                  :class="{ active: uploadMethod === 'url' }"
                  @click="uploadMethod = 'url'"
                >
                  URL de Imagen
                </button>
                <button
                  type="button"
                  class="tab-btn"
                  :class="{ active: uploadMethod === 'file' }"
                  @click="uploadMethod = 'file'"
                >
                  Subir Archivo
                </button>
              </div>

              <div v-if="uploadMethod === 'url'" class="image-input-section">
                <input
                  :value="form.images[0] || ''"
                  @input="(e) => { form.images = [(e.target as HTMLInputElement).value] }"
                  type="url"
                  class="form-input"
                  required
                  placeholder="https://ejemplo.com/imagen.jpg"
                />
              </div>

              <div v-if="uploadMethod === 'file'" class="image-input-section">
                <input
                  ref="fileInput"
                  type="file"
                  class="file-input"
                  accept="image/*"
                  multiple
                  @change="handleFileSelect"
                />
                <div class="file-upload-area" @click="fileInput?.click()">
                  <div v-if="form.images.length === 0" class="upload-placeholder">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                      <circle cx="9" cy="9" r="2"/>
                      <path d="M21 15l-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
                    </svg>
                    <p>Haz clic para seleccionar imágenes</p>
                  </div>
                  <div v-if="form.images.length > 0" class="images-preview-grid">
                    <div v-for="(image, index) in form.images" :key="index" class="image-preview-item">
                      <img :src="image" :alt="`Preview ${index + 1}`" />
                      <button
                        type="button"
                        class="remove-single-image"
                        @click.stop="removeSingleImage(index)"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="form-actions">
              <button type="button" class="btn btn-secondary" @click="closeForm">Cancelar</button>
              <button type="submit" class="btn btn-primary" :disabled="!isFormValid">
                {{ editingProduct ? 'Actualizar Producto' : 'Crear Producto' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import './styles/ProductsTab.css'
import { ref, computed } from 'vue'
import { useProducts } from '@/composables/useProducts'
import type { Product } from '@/types/ProductType'

const { regularProducts, categories, updateProduct, addProduct, deleteProduct } = useProducts()

const products = regularProducts

const showForm = ref(false)
const editingProduct = ref<Product | null>(null)
const searchProducts = ref('')
const uploadMethod = ref('url')
const fileInput = ref<HTMLInputElement | null>(null)

const appleColors = ref([
  { name: 'Naranja Cósmico', hex: '#ff5e00' },
  { name: 'Azul Profundo', hex: '#003d5c' },
  { name: 'Plata', hex: '#c0c0c0' },
  { name: 'Azul', hex: '#1976d2' },
  { name: 'Negro', hex: '#000000' },
  { name: 'Blanco', hex: '#ffffff' },
  { name: 'Azul Neblina', hex: '#a8c7dd' },
  { name: 'Dorado Claro', hex: '#f7e7a1' },
  { name: 'Azul Cielo', hex: '#87ceeb' },
  { name: 'Rosa', hex: '#ff69b4' },
  { name: 'Amarillo', hex: '#ffeb3b' },
  { name: 'Verde', hex: '#4caf50' },
  { name: 'Púrpura', hex: '#9c27b0' },
  { name: 'Oro', hex: '#ffd700' }
])

const form = ref({
  name: '',
  description: '',
  price: 0,
  originalPrice: 0,
  images: [] as string[],
  category: '',
  status: 'available' as 'available' | 'out-of-stock' | 'coming-soon',
  colors: [] as string[]
})

const filteredProducts = computed(() => {
  if (!searchProducts.value.trim()) return products.value
  const q = searchProducts.value.toLowerCase()
  return products.value.filter(p =>
    p.name.toLowerCase().includes(q) ||
    p.description?.toLowerCase().includes(q)
  )
})

const isFormValid = computed(() =>
  form.value.name.trim() &&
  form.value.price > 0 &&
  form.value.category &&
  form.value.images.length > 0
)

const getStatusText = (status: string) => {
  const map: Record<string, string> = {
    'available': 'Disponible',
    'out-of-stock': 'Sin Stock',
    'coming-soon': 'Próximamente'
  }
  return map[status] || status
}

const normalizeString = (str: string) =>
  str.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim()

const isColorSelected = (colorName: string) => {
  const normalized = normalizeString(colorName)
  return form.value.colors.some(c => normalizeString(c) === normalized)
}

const toggleProductColor = (colorName: string) => {
  const normalized = normalizeString(colorName)
  const index = form.value.colors.findIndex(c => normalizeString(c) === normalized)
  if (index > -1) {
    form.value.colors.splice(index, 1)
  } else {
    form.value.colors.push(colorName)
  }
}

const editProduct = (product: Product | null) => {
  if (product) {
    editingProduct.value = product
    form.value = {
      name: product.name,
      description: product.description,
      price: product.price,
      originalPrice: product.originalPrice || 0,
      images: [...(product.images || [])],
      category: product.category,
      status: product.status,
      colors: [...(product.colors || [])]
    }
    uploadMethod.value = product.images?.[0]?.startsWith('http') ? 'url' : 'file'
  } else {
    editingProduct.value = null
    form.value = {
      name: '',
      description: '',
      price: 0,
      originalPrice: 0,
      images: [],
      category: '',
      status: 'available',
      colors: []
    }
    uploadMethod.value = 'url'
  }
  showForm.value = true
}

const closeForm = () => {
  showForm.value = false
  editingProduct.value = null
  form.value = {
    name: '',
    description: '',
    price: 0,
    originalPrice: 0,
    images: [],
    category: '',
    status: 'available',
    colors: []
  }
  if (fileInput.value) fileInput.value.value = ''
}

const saveProduct = () => {
  if (!isFormValid.value) return
  if (editingProduct.value) {
    if (!confirm(`¿Actualizar "${editingProduct.value.name}"?`)) return
    updateProduct(editingProduct.value.id, form.value)
  } else {
    addProduct(form.value)
  }
  closeForm()
}

const deleteProductConfirm = (id: string) => {
  if (confirm('¿Eliminar este producto?')) {
    deleteProduct(id)
  }
}

const handleFileSelect = (event: Event) => {
  const files = (event.target as HTMLInputElement).files
  if (!files) return

  const promises: Promise<string>[] = []
  for (let i = 0; i < Math.min(files.length, 5); i++) {
    const file = files[i]
    if (file.size > 5 * 1024 * 1024) {
      alert(`${file.name} es demasiado grande`)
      continue
    }
    if (!file.type.startsWith('image/')) {
      alert(`${file.name} no es una imagen`)
      continue
    }

    promises.push(
      new Promise<string>(resolve => {
        const reader = new FileReader()
        reader.onload = e => resolve(e.target?.result as string)
        reader.readAsDataURL(file)
      })
    )
  }

  Promise.all(promises).then(images => {
    form.value.images = images
  })
}

const removeSingleImage = (index: number) => {
  form.value.images.splice(index, 1)
}
</script>



