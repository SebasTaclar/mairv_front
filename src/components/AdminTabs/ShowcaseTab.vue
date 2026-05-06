<template>
  <div class="showcase-tab">
    <!-- Header -->
    <div class="section-header">
      <h2>Gestión de Novedades</h2>
      <button class="btn btn-primary" @click="openForm()">
        <span class="btn-icon">✨</span>
        Nueva Novedad
      </button>
    </div>

    <!-- Búsqueda -->
    <div class="search-bar">
      <div class="search-input-wrapper">
        <svg class="search-icon" viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
          <path fill="currentColor" d="M10 2a8 8 0 1 1 0 16 8 8 0 0 1 0-16zm8.707 17.293-4.387-4.387a9 9 0 1 0-1.414 1.414l4.387 4.387a1 1 0 0 0 1.414-1.414z"/>
        </svg>
        <input
          type="search"
          v-model="searchQuery"
          placeholder="Buscar novedades..."
          class="search-input"
        />
        <button v-if="searchQuery" class="search-clear" @click="searchQuery = ''">X</button>
      </div>
    </div>

    <!-- Grid -->
    <div class="showcase-grid">
      <div v-for="product in filteredShowcase" :key="product.id" class="showcase-card">
        <div class="showcase-image">
          <img :src="product.image" :alt="product.name" />
        </div>
        <div class="showcase-info">
          <h3>{{ product.name }}</h3>
          <p>{{ product.description }}</p>
          <span class="category-name">{{ getCategoryName(product.category) }}</span>
        </div>
        <div class="showcase-actions">
          <button class="btn btn-sm btn-secondary" @click="openForm(product)">✏️</button>
          <button class="btn btn-sm btn-danger" @click="deleteProduct(product.id)">🗑️</button>
        </div>
      </div>
    </div>

    <!-- Vacío -->
    <div v-if="filteredShowcase.length === 0" class="empty-state">
      <div class="empty-icon">✨</div>
      <h3>No hay novedades</h3>
      <button class="btn btn-primary" @click="openForm()">Crear Primera Novedad</button>
    </div>

    <!-- Modal -->
    <div v-if="showForm" class="modal-overlay" @click="closeForm">
      <div class="modal" @click.stop>
        <div class="modal-header">
          <h3>{{ editingProduct ? 'Editar Novedad' : 'Nueva Novedad' }}</h3>
          <button class="modal-close" @click="closeForm">✕</button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="saveProduct">
            <div class="form-group">
              <label>Nombre *</label>
              <input v-model="form.name" type="text" class="form-input" required />
            </div>
            <div class="form-group">
              <label>Descripción *</label>
              <textarea v-model="form.description" class="form-input" rows="3" required></textarea>
            </div>
            <div class="form-group">
              <label>Categoría *</label>
              <select v-model="form.category" class="form-input" required>
                <option value="">Seleccionar</option>
                <option v-for="cat in categories" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
              </select>
            </div>
            <div class="form-group">
              <label>Imagen *</label>
              <div class="image-tabs">
                <button
                  type="button"
                  class="tab-btn"
                  :class="{ active: uploadMethod === 'url' }"
                  @click="uploadMethod = 'url'"
                >
                  URL
                </button>
                <button
                  type="button"
                  class="tab-btn"
                  :class="{ active: uploadMethod === 'file' }"
                  @click="uploadMethod = 'file'"
                >
                  Archivo
                </button>
              </div>
              <div v-if="uploadMethod === 'url'">
                <input v-model="form.image" type="url" class="form-input" required/>
              </div>
              <div v-if="uploadMethod === 'file'">
                <input
                  ref="fileInput"
                  type="file"
                  accept="image/*"
                  @change="handleFileSelect"
                  class="file-input"
                />
                <div class="file-upload-area" @click="fileInput?.click()">
                  <div v-if="!form.image" class="upload-placeholder">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                      <circle cx="9" cy="9" r="2"/>
                      <path d="M21 15l-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
                    </svg>
                    <p>Haz clic para seleccionar</p>
                  </div>
                  <div v-if="form.image" class="image-preview">
                    <img :src="form.image" alt="Preview" />
                    <button type="button" class="remove-image" @click.stop="form.image = ''">✕</button>
                  </div>
                </div>
              </div>
            </div>
            <div class="form-actions">
              <button type="button" class="btn btn-secondary" @click="closeForm">Cancelar</button>
              <button type="submit" class="btn btn-primary" :disabled="!isFormValid">{{ editingProduct ? 'Actualizar' : 'Crear' }}</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import './styles/ShowcaseTab.css'
import { ref, computed, onMounted } from 'vue'
import { useProducts, type ShowcaseProduct } from '@/composables/useProducts'

const { showcaseProducts, categories, addShowcaseProduct, updateShowcaseProduct, deleteShowcaseProduct, getCategoryById, loadShowcaseProducts } = useProducts()

const showForm = ref(false)
const editingProduct = ref<ShowcaseProduct | null>(null)
const searchQuery = ref('')
const uploadMethod = ref('url')
const fileInput = ref<HTMLInputElement | null>(null)

const form = ref({
  name: '',
  description: '',
  image: '',
  price: 0,
  category: ''
})

onMounted(() => {
  loadShowcaseProducts()
})

const filteredShowcase = computed(() => {
  if (!searchQuery.value) return showcaseProducts.value
  const q = searchQuery.value.toLowerCase()
  return showcaseProducts.value.filter(p =>
    p.name.toLowerCase().includes(q) ||
    p.description.toLowerCase().includes(q)
  )
})

const isFormValid = computed(() =>
  form.value.name.trim() &&
  form.value.description.trim() &&
  form.value.image.trim() &&
  form.value.category.trim()
)

const getCategoryName = (id: string | number) =>
  getCategoryById(String(id))?.name || 'Sin categoría'

const openForm = (product?: ShowcaseProduct) => {
  if (product) {
    editingProduct.value = product
    form.value = { ...product }
    uploadMethod.value = product.image.startsWith('http') ? 'url' : 'file'
  } else {
    editingProduct.value = null
    form.value = { name: '', description: '', image: '', price: 0, category: '' }
    uploadMethod.value = 'url'
  }
  showForm.value = true
}

const closeForm = () => {
  showForm.value = false
  editingProduct.value = null
  form.value = { name: '', description: '', image: '', price: 0, category: '' }
  if (fileInput.value) fileInput.value.value = ''
}

const saveProduct = async () => {
  if (!isFormValid.value) return
  try {
    if (editingProduct.value) {
      if (!confirm(`¿Actualizar "${editingProduct.value.name}"?`)) return
      await updateShowcaseProduct(editingProduct.value.id, form.value)
    } else {
      await addShowcaseProduct(form.value)
    }
    closeForm()
  } catch (e) {
    alert('Error al guardar')
    console.error(e)
  }
}

const deleteProduct = (id: string) => {
  const product = showcaseProducts.value.find(p => p.id === id)
  if (!product) return
  if (confirm(`¿Eliminar "${product.name}"?`)) {
    deleteShowcaseProduct(id)
  }
}

const handleFileSelect = (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file) return

  if (file.size > 5 * 1024 * 1024) {
    alert('Archivo muy grande')
    return
  }

  const reader = new FileReader()
  reader.onload = e => {
    form.value.image = e.target?.result as string
  }
  reader.readAsDataURL(file)
}
</script>



