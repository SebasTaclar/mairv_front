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

<style scoped>
.products-tab {
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
  margin: 0;
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
  z-index: 1;
}

.search-input {
  width: 100%;
  padding: 0.875rem 3.5rem 0.875rem 2.75rem;
  border-radius: 999px;
  border: 1px solid var(--brand-border);
  background: var(--brand-bg-end);
  font-size: 1rem;
  color: var(--brand-primary-contrast);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
}

.search-input:focus {
  background: var(--brand-surface);
  border-color: var(--brand-success);
  outline: none;
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
  font-weight: 600;
  transition: all 0.2s;
}

.search-clear:hover {
  background: rgba(16, 185, 129, 0.2);
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  margin-bottom: 40px;
}

.product-card {
  background: var(--brand-bg-end);
  border-radius: 16px;
  padding: 20px;
  border: 2px solid var(--brand-border);
  transition: all 0.3s ease;
}

.product-card:hover {
  border-color: var(--brand-success);
  box-shadow: 0 8px 25px rgba(16, 185, 129, 0.3);
  transform: translateY(-2px);
}

.product-image {
  width: 100%;
  height: 150px;
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 15px;
  background: var(--brand-border);
  display: flex;
  align-items: center;
  justify-content: center;
}

.product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.no-image {
  font-size: 3rem;
}

.product-info h3 {
  font-size: 1.2rem;
  font-weight: 600;
  color: var(--brand-primary-contrast);
  margin: 0 0 8px;
}

.product-description {
  color: var(--brand-accent-alt);
  font-size: 0.9rem;
  margin: 0 0 15px;
  line-height: 1.4;
}

.product-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.price {
  font-size: 1.3rem;
  font-weight: 700;
  color: var(--brand-success);
}

.status {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
}

.status.available {
  background: #d1fae5;
  color: #065f46;
}

.status.out-of-stock {
  background: #fee2e2;
  color: #991b1b;
}

.status.coming-soon {
  background: #dbeafe;
  color: #1e40af;
}

.product-actions {
  display: flex;
  gap: 10px;
}

.btn {
  padding: 10px 20px;
  border-radius: 8px;
  border: none;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.btn-sm {
  padding: 6px 12px;
  font-size: 0.9rem;
}

.btn-primary {
  background: var(--brand-success);
  color: var(--brand-primary-contrast);
}

.btn-secondary {
  background: var(--brand-border);
  color: var(--brand-primary-contrast);
}

.btn-danger {
  background: #e74c3c;
  color: white;
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
  color: var(--brand-primary-contrast);
}

.empty-state p {
  color: var(--brand-accent-alt);
  margin-bottom: 20px;
}

.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal {
  background: var(--brand-surface);
  border-radius: 16px;
  max-width: 700px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  padding: 25px;
  border-bottom: 1px solid var(--brand-border);
}

.modal-header h3 {
  margin: 0;
  font-size: 1.5rem;
}

.modal-close {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: var(--brand-accent-alt);
}

.modal-body {
  padding: 25px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: var(--brand-primary-contrast);
}

.form-input {
  width: 100%;
  padding: 12px;
  border: 1px solid var(--brand-border);
  border-radius: 8px;
  background: var(--brand-background);
  color: var(--brand-primary-contrast);
  font-size: 0.95rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
}

.price-input {
  display: flex;
  align-items: center;
}

.currency {
  padding-right: 8px;
  font-weight: 600;
}

.colors-selector {
  margin-top: 10px;
}

.colors-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));
  gap: 12px;
  margin-bottom: 15px;
}

.color-option {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 10px;
  border: 2px solid transparent;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s;
  background: rgba(255, 255, 255, 0.05);
}

.color-option.selected {
  border-color: #60a5fa;
  background: rgba(96, 165, 250, 0.25);
  transform: scale(1.05);
}

.color-circle {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  border: 2px solid rgba(255, 255, 255, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.check-icon {
  color: white;
  font-weight: bold;
}

.color-name {
  font-size: 0.75rem;
  font-weight: 500;
  text-align: center;
  line-height: 1.2;
}

.image-tabs {
  display: flex;
  gap: 10px;
  margin-bottom: 15px;
}

.tab-btn {
  flex: 1;
  padding: 10px;
  border: 1px solid var(--brand-border);
  background: transparent;
  color: var(--brand-primary-contrast);
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
}

.tab-btn.active {
  background: var(--brand-accent);
  color: white;
  border-color: var(--brand-accent);
}

.file-upload-area {
  border: 2px dashed var(--brand-border);
  border-radius: 8px;
  padding: 40px;
  text-align: center;
  cursor: pointer;
  background: var(--brand-background);
}

.upload-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  color: var(--brand-accent-alt);
}

.upload-placeholder svg {
  color: var(--brand-accent);
  opacity: 0.6;
}

.images-preview-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: 10px;
}

.image-preview-item {
  position: relative;
  border-radius: 8px;
  overflow: hidden;
  aspect-ratio: 1;
}

.image-preview-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.remove-single-image {
  position: absolute;
  top: 5px;
  right: 5px;
  background: rgba(0, 0, 0, 0.7);
  border: none;
  color: white;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  cursor: pointer;
  font-weight: bold;
}

.file-input {
  display: none;
}

.form-actions {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  margin-top: 25px;
}

.form-actions button {
  padding: 12px 24px;
  border-radius: 8px;
  border: none;
  font-weight: 600;
  cursor: pointer;
}
</style>
