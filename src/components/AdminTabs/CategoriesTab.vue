<template>
  <div class="categories-tab">
    <!-- Header -->
    <div class="section-header">
      <h2>Gestión de Categorías</h2>
      <button class="btn btn-primary" @click="openForm()">
        <span class="btn-icon">➕</span>
        Nueva Categoría
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
          placeholder="Buscar categorías..."
          class="search-input"
        />
        <button v-if="searchQuery" class="search-clear" @click="searchQuery = ''">X</button>
      </div>
    </div>

    <!-- Lista -->
    <div class="categories-list">
      <div v-for="category in filteredCategories" :key="category.id" class="category-item">
        <div class="category-info">
          <h3>{{ category.name }}</h3>
          <p>{{ category.description || 'Sin descripción' }}</p>
          <span class="category-count">{{ getProductsInCategory(category.id) }} productos</span>
        </div>
        <div class="category-actions">
          <button class="btn btn-sm btn-secondary" @click="openForm(category)">✏️</button>
          <button class="btn btn-sm btn-danger" @click="deleteCategory(category.id)">🗑️</button>
        </div>
      </div>
    </div>

    <!-- Vacío -->
    <div v-if="filteredCategories.length === 0" class="empty-state">
      <div class="empty-icon">🏷️</div>
      <h3>No hay categorías</h3>
      <button class="btn btn-primary" @click="openForm()">Crear Primera Categoría</button>
    </div>

    <!-- Modal -->
    <div v-if="showForm" class="modal-overlay" @click="closeForm">
      <div class="modal" @click.stop>
        <div class="modal-header">
          <h3>{{ editingCategory ? 'Editar Categoría' : 'Nueva Categoría' }}</h3>
          <button class="modal-close" @click="closeForm">✕</button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="saveCategory">
            <div class="form-group">
              <label>Nombre *</label>
              <input v-model="form.name" type="text" class="form-input" required />
            </div>
            <div class="form-group">
              <label>Descripción</label>
              <textarea v-model="form.description" class="form-input" rows="3"></textarea>
            </div>
            <div class="form-actions">
              <button type="button" class="btn btn-secondary" @click="closeForm">Cancelar</button>
              <button type="submit" class="btn btn-primary">{{ editingCategory ? 'Actualizar' : 'Crear' }}</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import './styles/CategoriesTab.css'
import { ref, computed } from 'vue'
import { useProducts } from '@/composables/useProducts'
import type { Category } from '@/types/CategoryType'

const { categories, regularProducts, addCategory, updateCategory, deleteCategory: deleteCategory_api } = useProducts()

const showForm = ref(false)
const editingCategory = ref<Category | null>(null)
const searchQuery = ref('')

const form = ref({ name: '', description: '' })

const filteredCategories = computed(() => {
  if (!searchQuery.value) return categories.value
  const q = searchQuery.value.toLowerCase()
  return categories.value.filter(c =>
    c.name.toLowerCase().includes(q) ||
    c.description?.toLowerCase().includes(q)
  )
})

const getProductsInCategory = (id: string | number) =>
  regularProducts.value.filter(p => p.category === id).length

const openForm = (category?: Category) => {
  if (category) {
    editingCategory.value = category
    form.value = { name: category.name, description: category.description || '' }
  } else {
    editingCategory.value = null
    form.value = { name: '', description: '' }
  }
  showForm.value = true
}

const closeForm = () => {
  showForm.value = false
  editingCategory.value = null
  form.value = { name: '', description: '' }
}

const saveCategory = async () => {
  if (!form.value.name.trim()) return
  try {
    if (editingCategory.value) {
      if (!confirm(`¿Actualizar "${editingCategory.value.name}"?`)) return
      await updateCategory(Number(editingCategory.value.id), form.value)
    } else {
      await addCategory(form.value)
    }
    closeForm()
  } catch (e) {
    alert('Error al guardar categoría')
    console.error(e)
  }
}

const deleteCategory = (id: string | number) => {
  const category = categories.value.find(c => c.id == id)
  if (!category) return
  const count = getProductsInCategory(id)
  const msg = count > 0
    ? `⚠️ Esta categoría tiene ${count} producto(s). ¿Continuar?`
    : `¿Eliminar "${category.name}"?`
  if (confirm(msg)) {
    deleteCategory_api(Number(id))
  }
}
</script>



