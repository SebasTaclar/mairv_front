<template>
  <div class="modal-overlay" @click="$emit('close')">
    <div class="modal-content" @click.stop>
      <div class="modal-header">
        <h3>{{ product ? 'Editar Producto' : 'Agregar Producto' }}</h3>
        <button @click="$emit('close')" class="close-btn">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="m18 6-12 12"/>
            <path d="m6 6 12 12"/>
          </svg>
        </button>
      </div>

      <form @submit.prevent="handleSubmit" class="modal-form">
        <!-- Información básica -->
        <div class="form-section">
          <h4>Información Básica</h4>

          <div class="form-group">
            <label for="name">Nombre del Producto *</label>
            <input
              id="name"
              v-model="formData.name"
              type="text"
              required
              placeholder="Ej: iPhone 15 Pro"
            />
          </div>

          <div class="form-group">
            <label for="description">Descripción *</label>
            <textarea
              id="description"
              v-model="formData.description"
              required
              rows="3"
              placeholder="Descripción detallada del producto..."
            ></textarea>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="category">Categoría *</label>
              <select id="category" v-model="formData.category" required>
                <option value="">Seleccionar categoría</option>
                <option v-for="cat in categories" :key="cat.id" :value="cat.name">
                  {{ cat.name }}
                </option>
              </select>
            </div>

            <div class="form-group">
              <label for="status">Estado *</label>
              <select id="status" v-model="formData.status" required>
                <option value="available">Disponible</option>
                <option value="out-of-stock">Agotado</option>
                <option value="coming-soon">Próximamente</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Precios -->
        <div class="form-section">
          <h4>Precios</h4>

          <div class="form-row">
            <div class="form-group">
              <label for="price">Precio Actual *</label>
              <div class="price-input">
                <span class="currency">$</span>
                <input
                  id="price"
                  v-model.number="formData.price"
                  type="number"
                  required
                  min="0"
                  placeholder="0"
                />
              </div>
            </div>

            <div class="form-group">
              <label for="originalPrice">Precio Original (opcional)</label>
              <div class="price-input">
                <span class="currency">$</span>
                <input
                  id="originalPrice"
                  v-model.number="formData.originalPrice"
                  type="number"
                  min="0"
                  placeholder="0"
                />
              </div>
            </div>
          </div>

          <div v-if="formData.originalPrice && formData.price" class="discount-info">
            <span class="discount-badge">
              -{{ Math.round(((formData.originalPrice - formData.price) / formData.originalPrice) * 100) }}% descuento
            </span>
          </div>
        </div>

        <!-- Imagen -->
        <div class="form-section">
          <h4>Imagen del Producto</h4>

          <div class="image-upload">
            <div v-if="formData.image" class="image-preview">
              <img :src="formData.image" alt="Preview" />
              <button type="button" @click="removeImage" class="remove-image">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="m18 6-12 12"/>
                  <path d="m6 6 12 12"/>
                </svg>
              </button>
            </div>

            <div v-else class="upload-area" @click="triggerFileInput">
              <div class="upload-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                  <circle cx="9" cy="9" r="2"/>
                  <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
                </svg>
              </div>
              <p>Haz clic para subir una imagen</p>
              <span>PNG, JPG, GIF hasta 5MB</span>
            </div>

            <input
              ref="fileInput"
              type="file"
              accept="image/*"
              @change="handleFileUpload"
              style="display: none"
            />
          </div>

          <div class="form-group">
            <label for="imageUrl">O ingresa una URL de imagen</label>
            <input
              id="imageUrl"
              v-model="formData.image"
              type="url"
              placeholder="https://ejemplo.com/imagen.jpg"
            />
          </div>
        </div>

        <!-- Botones -->
        <div class="modal-actions">
          <button type="button" @click="$emit('close')" class="btn-cancel">
            Cancelar
          </button>
          <button type="submit" class="btn-save">
            {{ product ? 'Actualizar' : 'Crear' }} Producto
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import './styles/ProductModal.css'
import { ref, reactive, watch, onMounted } from 'vue'

// Props
interface Product {
  id: string
  name: string
  description: string
  price: number
  originalPrice?: number
  image: string
  category: string
  status: 'available' | 'out-of-stock' | 'coming-soon'
}

interface Category {
  id: string
  name: string
  description: string
}

const props = defineProps<{
  product?: Product | null
  categories: Category[]
}>()

// Emits
const emit = defineEmits<{
  close: []
  save: [productData: Product]
}>()

// Refs
const fileInput = ref<HTMLInputElement>()

// Form data
const formData = reactive({
  name: '',
  description: '',
  price: 0,
  originalPrice: undefined as number | undefined,
  image: '',
  category: '',
  status: 'available' as Product['status']
})

// Métodos
const handleSubmit = () => {
  const productData = {
    id: props.product?.id || '',
    name: formData.name,
    description: formData.description,
    price: formData.price,
    originalPrice: formData.originalPrice || undefined,
    image: formData.image,
    category: formData.category,
    status: formData.status
  }

  emit('save', productData)
}

const triggerFileInput = () => {
  fileInput.value?.click()
}

const handleFileUpload = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]

  if (file) {
    // Validar tamaño del archivo (5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('El archivo es demasiado grande. Máximo 5MB.')
      return
    }

    // Validar tipo de archivo
    if (!file.type.startsWith('image/')) {
      alert('Por favor selecciona un archivo de imagen válido.')
      return
    }

    // Crear URL temporal para preview
    const reader = new FileReader()
    reader.onload = (e) => {
      formData.image = e.target?.result as string
    }
    reader.readAsDataURL(file)
  }
}

const removeImage = () => {
  formData.image = ''
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

// Watch para cargar datos del producto cuando se edita
watch(() => props.product, (newProduct) => {
  if (newProduct) {
    formData.name = newProduct.name
    formData.description = newProduct.description
    formData.price = newProduct.price
    formData.originalPrice = newProduct.originalPrice
    formData.image = newProduct.image
    formData.category = newProduct.category
    formData.status = newProduct.status
  }
}, { immediate: true })

// Limpiar formulario cuando no hay producto
onMounted(() => {
  if (!props.product) {
    Object.assign(formData, {
      name: '',
      description: '',
      price: 0,
      originalPrice: undefined,
      image: '',
      category: '',
      status: 'available'
    })
  }
})
</script>



