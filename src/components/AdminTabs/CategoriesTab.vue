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
          <button class="btn btn-sm btn-secondary" @click="editCategory(category)">✏️</button>
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

<style scoped>
.categories-tab {
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
}

.search-input {
  width: 100%;
  padding: 0.875rem 2.75rem;
  border-radius: 999px;
  border: 1px solid var(--brand-border);
  background: var(--brand-bg-end);
  color: var(--brand-primary-contrast);
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
}

.categories-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.category-item {
  background: var(--brand-bg-end);
  border-radius: 12px;
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: 2px solid var(--brand-border);
  transition: all 0.3s;
}

.category-item:hover {
  border-color: var(--brand-success);
}

.category-info h3 {
  font-size: 1.2rem;
  font-weight: 600;
  color: var(--brand-primary-contrast);
  margin: 0 0 5px;
}

.category-info p {
  color: var(--brand-accent-alt);
  margin: 0 0 5px;
  font-size: 0.9rem;
}

.category-count {
  font-size: 0.8rem;
  color: var(--brand-success);
  font-weight: 600;
}

.category-actions {
  display: flex;
  gap: 10px;
}

.btn {
  padding: 10px 20px;
  border-radius: 8px;
  border: none;
  font-weight: 600;
  cursor: pointer;
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
  margin: 0 0 30px;
  color: var(--brand-primary-contrast);
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
  max-width: 600px;
  width: 90%;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
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
