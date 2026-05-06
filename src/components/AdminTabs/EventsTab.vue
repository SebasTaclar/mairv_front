<template>
  <div class="events-tab">
    <!-- Header -->
    <div class="section-header">
      <h2>Gestión de Eventos</h2>
      <button class="btn btn-primary" @click="openEventForm()">
        <span class="btn-icon">➕</span>
        Nuevo Evento
      </button>
    </div>

    <!-- Estadísticas rápidas -->
    <div class="events-stats">
      <div class="stat-card">
        <div class="stat-icon">📅</div>
        <div class="stat-content">
          <div class="stat-number">{{ upcomingEvents.length }}</div>
          <div class="stat-label">Próximos</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">🔴</div>
        <div class="stat-content">
          <div class="stat-number">{{ eventsByStatus.ongoing }}</div>
          <div class="stat-label">En Curso</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">✅</div>
        <div class="stat-content">
          <div class="stat-number">{{ eventsByStatus.completed }}</div>
          <div class="stat-label">Completados</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">📊</div>
        <div class="stat-content">
          <div class="stat-number">{{ events.length }}</div>
          <div class="stat-label">Total</div>
        </div>
      </div>
    </div>

    <!-- Búsqueda y Filtros -->
    <div class="search-bar">
      <div class="search-input-wrapper">
        <svg class="search-icon" viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
          <path fill="currentColor" d="M10 2a8 8 0 1 1 0 16 8 8 0 0 1 0-16zm8.707 17.293-4.387-4.387a9 9 0 1 0-1.414 1.414l4.387 4.387a1 1 0 0 0 1.414-1.414z"/>
        </svg>
        <input
          type="search"
          v-model="searchQuery"
          placeholder="Buscar eventos por título o ubicación..."
          aria-label="Buscar eventos"
          class="search-input"
        />
        <button v-if="searchQuery" class="search-clear" @click.prevent="searchQuery = ''" aria-label="Limpiar búsqueda">X</button>
      </div>
      <select v-model="filterStatus" class="filter-select">
        <option value="">Todos los estados</option>
        <option value="scheduled">Programados</option>
        <option value="ongoing">En Curso</option>
        <option value="completed">Completados</option>
        <option value="cancelled">Cancelados</option>
      </select>
    </div>

    <!-- Tabla de Eventos -->
    <div class="events-table-container" v-if="filteredEvents.length > 0">
      <table class="events-table">
        <thead>
          <tr>
            <th>Título</th>
            <th>Fecha Inicio</th>
            <th>Ubicación</th>
            <th>Categoría</th>
            <th>Estado</th>
            <th>Asistentes</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="event in filteredEvents" :key="event.id" class="event-row">
            <td>
              <div class="event-title">
                <strong>{{ event.title }}</strong>
                <p v-if="event.description" class="event-desc">{{ truncate(event.description, 60) }}</p>
              </div>
            </td>
            <td>
              <div class="date-cell">
                <span class="date">{{ formatDate(event.startDate) }}</span>
                <span class="time">{{ formatTime(event.startDate) }}</span>
              </div>
            </td>
            <td>
              <span class="location">{{ event.location || 'Sin especificar' }}</span>
            </td>
            <td>
              <span class="category-badge" :style="{ backgroundColor: getCategoryColor(event.category) }">
                {{ getCategoryIcon(event.category) }} {{ event.category || 'Otro' }}
              </span>
            </td>
            <td>
              <span :class="['status-badge', event.status]">
                {{ getStatusLabel(event.status) }}
              </span>
            </td>
            <td>
              <span class="attendees">
                <span v-if="event.maxAttendees">{{ event.currentAttendees || 0 }}/{{ event.maxAttendees }}</span>
                <span v-else>-</span>
              </span>
            </td>
            <td>
              <div class="action-buttons">
                <button class="btn btn-sm btn-secondary" @click="openEventForm(event)" title="Editar">
                  ✏️
                </button>
                <button class="btn btn-sm btn-danger" @click="confirmDelete(event.id)" title="Eliminar">
                  🗑️
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Estado vacío -->
    <div v-else class="empty-state">
      <div class="empty-icon">📅</div>
      <h3>No hay eventos</h3>
      <p v-if="searchQuery || filterStatus">Intenta cambiar los filtros o búsqueda</p>
      <p v-else>Comienza creando tu primer evento</p>
      <button class="btn btn-primary" @click="openEventForm()">
        Crear Primer Evento
      </button>
    </div>

    <!-- Modal de Evento -->
    <div v-if="showEventForm" class="modal-overlay" @click="closeEventForm">
      <div class="modal" @click.stop>
        <div class="modal-header">
          <h3>{{ editingEvent ? 'Editar Evento' : 'Nuevo Evento' }}</h3>
          <button class="modal-close" @click="closeEventForm">✕</button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="saveEvent">
            <!-- Título -->
            <div class="form-group">
              <label>Título del Evento *</label>
              <input
                v-model="eventForm.title"
                type="text"
                class="form-input"
                required
                placeholder="Ej: Torneo de Fut Todos vs Noobis"
              />
            </div>

            <!-- Descripción -->
            <div class="form-group">
              <label>Descripción</label>
              <textarea
                v-model="eventForm.description"
                class="form-input"
                rows="3"
                placeholder="Describe el evento en detalle..."
              ></textarea>
            </div>

            <!-- Fila: Fecha inicio y fin -->
            <div class="form-row">
              <div class="form-group">
                <label>Fecha de Inicio *</label>
                <input
                  v-model="eventForm.startDate"
                  type="datetime-local"
                  class="form-input"
                  required
                />
              </div>
              <div class="form-group">
                <label>Fecha de Fin *</label>
                <input
                  v-model="eventForm.endDate"
                  type="datetime-local"
                  class="form-input"
                  required
                />
              </div>
            </div>

            <!-- Ubicación y Categoría -->
            <div class="form-row">
              <div class="form-group">
                <label>Ubicación</label>
                <input
                  v-model="eventForm.location"
                  type="text"
                  class="form-input"
                  placeholder="Ej: Estadio Central, Bogotá"
                />
              </div>
              <div class="form-group">
                <label>Categoría *</label>
                <select v-model="eventForm.category" class="form-input" required>
                  <option value="">Seleccionar categoría</option>
                  <option value="Torneo">🏆 Torneo</option>
                  <option value="Evento Social">🎉 Evento Social</option>
                  <option value="Capacitación">📚 Capacitación</option>
                  <option value="Mantenimiento">🔧 Mantenimiento</option>
                  <option value="Otro">📌 Otro</option>
                </select>
              </div>
            </div>

            <!-- Estado y Máximo de Asistentes -->
            <div class="form-row">
              <div class="form-group">
                <label>Estado *</label>
                <select v-model="eventForm.status" class="form-input" required>
                  <option value="scheduled">📅 Programado</option>
                  <option value="ongoing">🔴 En Curso</option>
                  <option value="completed">✅ Completado</option>
                  <option value="cancelled">❌ Cancelado</option>
                </select>
              </div>
              <div class="form-group">
                <label>Máximo de Asistentes</label>
                <input
                  v-model.number="eventForm.maxAttendees"
                  type="number"
                  class="form-input"
                  min="0"
                  placeholder="Dejar vacío para ilimitado"
                />
              </div>
            </div>

            <!-- Organizador -->
            <div class="form-group">
              <label>Organizador</label>
              <input
                v-model="eventForm.organizer"
                type="text"
                class="form-input"
                placeholder="Nombre del organizador"
              />
            </div>

            <!-- Imágenes -->
            <div class="form-group">
              <label>Imágenes</label>
              <div class="image-tabs">
                <button
                  type="button"
                  class="tab-btn"
                  :class="{ active: imageUploadMethod === 'url' }"
                  @click="imageUploadMethod = 'url'"
                >
                  URL
                </button>
                <button
                  type="button"
                  class="tab-btn"
                  :class="{ active: imageUploadMethod === 'file' }"
                  @click="imageUploadMethod = 'file'"
                >
                  Subir Archivo
                </button>
              </div>

              <!-- URL -->
              <div v-if="imageUploadMethod === 'url'" class="image-input-section">
                <input
                  v-model="imageUrlInput"
                  type="url"
                  class="form-input"
                  placeholder="https://ejemplo.com/imagen.jpg"
                />
                <button type="button" class="btn btn-secondary" @click="addImageFromUrl">
                  Agregar URL
                </button>
              </div>

              <!-- Archivo -->
              <div v-if="imageUploadMethod === 'file'" class="image-input-section">
                <input
                  ref="imageFileInput"
                  type="file"
                  class="file-input"
                  accept="image/*"
                  multiple
                  @change="handleImageFileSelect"
                />
                <div class="file-upload-area" @click="imageFileInput?.click()">
                  <div v-if="eventForm.images.length === 0" class="upload-placeholder">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                      <circle cx="9" cy="9" r="2"/>
                      <path d="M21 15l-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
                    </svg>
                    <p>Haz clic para seleccionar imágenes</p>
                  </div>
                  <div v-if="eventForm.images.length > 0" class="images-preview-grid">
                    <div v-for="(image, index) in eventForm.images" :key="index" class="image-preview-item">
                      <img :src="image" :alt="`Preview ${index}`" />
                      <button
                        type="button"
                        class="remove-image"
                        @click.stop="removeImage(index)"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Imágenes agregadas -->
              <div v-if="eventForm.images.length > 0" class="images-info">
                <span class="images-badge">{{ eventForm.images.length }} imagen(es)</span>
              </div>
            </div>

            <!-- Botones de acción -->
            <div class="form-actions">
              <button type="button" class="btn btn-secondary" @click="closeEventForm">Cancelar</button>
              <button type="submit" class="btn btn-primary" :disabled="!isEventFormValid">
                {{ editingEvent ? 'Actualizar Evento' : 'Crear Evento' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import './styles/EventsTab.css'
import { ref, computed } from 'vue'
import { useEvents } from '@/composables/useEvents'
import type { Event, CreateEventRequest } from '@/types/EventType'
import { EVENT_CATEGORIES, EVENT_STATUSES } from '@/types/EventType'

const {
  events,
  addEvent,
  updateEvent,
  deleteEvent,
  upcomingEvents,
  eventsByStatus
} = useEvents()

// Estado reactivo
const showEventForm = ref(false)
const editingEvent = ref<Event | null>(null)
const searchQuery = ref('')
const filterStatus = ref('')
const imageUploadMethod = ref('url')
const imageUrlInput = ref('')
const imageFileInput = ref<HTMLInputElement | null>(null)

// Formulario
const eventForm = ref<CreateEventRequest & { images: string[] }>({
  title: '',
  description: '',
  startDate: '',
  endDate: '',
  location: '',
  category: '',
  status: 'scheduled',
  maxAttendees: undefined,
  organizer: '',
  images: [],
  tags: []
})

// Validación
const isEventFormValid = computed(() => {
  return (
    eventForm.value.title.trim().length > 0 &&
    eventForm.value.startDate &&
    eventForm.value.endDate &&
    new Date(eventForm.value.startDate) < new Date(eventForm.value.endDate)
  )
})

// Filtrado
const filteredEvents = computed(() => {
  let result = [...events.value]

  if (filterStatus.value) {
    result = result.filter(e => e.status === filterStatus.value)
  }

  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase()
    result = result.filter(e =>
      e.title.toLowerCase().includes(q) ||
      e.description?.toLowerCase().includes(q) ||
      e.location?.toLowerCase().includes(q)
    )
  }

  return result.sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
})

// Helpers
const truncate = (text: string = '', length: number) => {
  if (text.length <= length) return text
  return text.substring(0, length) + '...'
}

const formatDate = (date: Date | string) => {
  return new Date(date).toLocaleDateString('es-CO', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const formatTime = (date: Date | string) => {
  return new Date(date).toLocaleTimeString('es-CO', {
    hour: '2-digit',
    minute: '2-digit'
  })
}

const getCategoryIcon = (category?: string) => {
  const categoryMap: Record<string, string> = {
    'Torneo': '🏆',
    'Evento Social': '🎉',
    'Capacitación': '📚',
    'Mantenimiento': '🔧',
    'Otro': '📌'
  }
  return categoryMap[category || 'Otro'] || '📌'
}

const getCategoryColor = (category?: string) => {
  const categoryMap: Record<string, string> = {
    'Torneo': '#ff6b6b',
    'Evento Social': '#4ecdc4',
    'Capacitación': '#45b7d1',
    'Mantenimiento': '#ffd93d',
    'Otro': '#95a5a6'
  }
  return categoryMap[category || 'Otro'] || '#95a5a6'
}

const getStatusLabel = (status: string) => {
  const statusMap: Record<string, string> = {
    'scheduled': '📅 Programado',
    'ongoing': '🔴 En Curso',
    'completed': '✅ Completado',
    'cancelled': '❌ Cancelado'
  }
  return statusMap[status] || status
}

// Acciones
const openEventForm = (event?: Event) => {
  if (event) {
    editingEvent.value = event
    eventForm.value = {
      title: event.title,
      description: event.description || '',
      startDate: formatDateTimeInput(event.startDate),
      endDate: formatDateTimeInput(event.endDate),
      location: event.location || '',
      category: event.category || '',
      status: event.status as any,
      maxAttendees: event.maxAttendees,
      organizer: event.organizer || '',
      images: event.images || [],
      tags: event.tags || []
    }
  } else {
    editingEvent.value = null
    eventForm.value = {
      title: '',
      description: '',
      startDate: '',
      endDate: '',
      location: '',
      category: '',
      status: 'scheduled',
      maxAttendees: undefined,
      organizer: '',
      images: [],
      tags: []
    }
  }
  showEventForm.value = true
}

const closeEventForm = () => {
  showEventForm.value = false
  editingEvent.value = null
  eventForm.value = {
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    location: '',
    category: '',
    status: 'scheduled',
    maxAttendees: undefined,
    organizer: '',
    images: [],
    tags: []
  }
  imageUrlInput.value = ''
  if (imageFileInput.value) {
    imageFileInput.value.value = ''
  }
}

const saveEvent = () => {
  if (!isEventFormValid.value) return

  try {
    if (editingEvent.value) {
      if (!confirm(`¿Estás seguro de actualizar el evento "${editingEvent.value.title}"?`)) {
        return
      }
      updateEvent(editingEvent.value.id, eventForm.value)
    } else {
      addEvent(eventForm.value)
    }
    closeEventForm()
  } catch (e) {
    alert('Error al guardar el evento')
    console.error(e)
  }
}

const confirmDelete = (id: string) => {
  const event = events.value.find(e => e.id === id)
  if (!event) return

  if (confirm(`¿Estás seguro de eliminar el evento "${event.title}"?`)) {
    try {
      deleteEvent(id)
    } catch (e) {
      alert('Error al eliminar el evento')
      console.error(e)
    }
  }
}

const addImageFromUrl = () => {
  if (!imageUrlInput.value.trim()) {
    alert('Por favor ingresa una URL de imagen válida')
    return
  }

  // Validar que sea una URL válida
  try {
    new URL(imageUrlInput.value)
    eventForm.value.images.push(imageUrlInput.value)
    imageUrlInput.value = ''
  } catch {
    alert('Por favor ingresa una URL válida')
  }
}

const handleImageFileSelect = (event: any) => {
  const target = event.target as HTMLInputElement
  const files = target.files
  if (files) {
    handleImageFiles(files)
  }
}

const handleImageFiles = (files: FileList) => {
  const promises: Promise<string>[] = []

  for (let i = 0; i < Math.min(files.length, 5); i++) {
    const file = files[i]

    if (file.size > 5 * 1024 * 1024) {
      alert(`${file.name} es demasiado grande. Máximo 5MB.`)
      continue
    }

    if (!file.type.startsWith('image/')) {
      alert(`${file.name} no es una imagen válida.`)
      continue
    }

    const promise = new Promise<string>((resolve) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        resolve(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    })

    promises.push(promise)
  }

  Promise.all(promises).then((images) => {
    eventForm.value.images.push(...images)
  })
}

const removeImage = (index: number) => {
  eventForm.value.images.splice(index, 1)
}

const formatDateTimeInput = (date: Date | string): string => {
  const d = new Date(date)
  return d.toISOString().slice(0, 16)
}
</script>



