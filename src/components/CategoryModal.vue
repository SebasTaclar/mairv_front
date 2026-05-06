<template>
  <div class="modal-overlay" @click="$emit('close')">
    <div class="modal-content" @click.stop>
      <div class="modal-header">
        <h3>{{ category ? 'Editar Categoría' : 'Agregar Categoría' }}</h3>
        <button @click="$emit('close')" class="close-btn">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="m18 6-12 12"/>
            <path d="m6 6 12 12"/>
          </svg>
        </button>
      </div>

      <form @submit.prevent="handleSubmit" class="modal-form">
        <div class="form-group">
          <label for="name">Nombre de la Categoría *</label>
          <input
            id="name"
            v-model="formData.name"
            type="text"
            required
            placeholder="Ej: iPhone, iPad, Mac..."
          />
        </div>

        <div class="form-group">
          <label for="description">Descripción *</label>
          <textarea
            id="description"
            v-model="formData.description"
            required
            rows="3"
            placeholder="Descripción de la categoría..."
          ></textarea>
        </div>

        <div class="modal-actions">
          <button type="button" @click="$emit('close')" class="btn-cancel">
            Cancelar
          </button>
          <button type="submit" class="btn-save">
            {{ category ? 'Actualizar' : 'Crear' }} Categoría
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import './styles/CategoryModal.css'
import { reactive, watch, onMounted } from 'vue'

// Props
interface Category {
  id: string
  name: string
  description: string
}

const props = defineProps<{
  category?: Category | null
}>()

// Emits
const emit = defineEmits<{
  close: []
  save: [categoryData: Category]
}>()

// Form data
const formData = reactive({
  name: '',
  description: ''
})

// Métodos
const handleSubmit = () => {
  const categoryData = {
    id: props.category?.id || '',
    name: formData.name,
    description: formData.description
  }

  emit('save', categoryData)
}

// Watch para cargar datos de la categoría cuando se edita
watch(() => props.category, (newCategory) => {
  if (newCategory) {
    formData.name = newCategory.name
    formData.description = newCategory.description
  }
}, { immediate: true })

// Limpiar formulario cuando no hay categoría
onMounted(() => {
  if (!props.category) {
    Object.assign(formData, {
      name: '',
      description: ''
    })
  }
})
</script>



