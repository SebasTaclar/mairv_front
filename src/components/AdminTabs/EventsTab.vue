<template>
  <div class="events-tab">
    <ConfirmationModal v-if="showConfirmationModal" :title="confirmationConfig.title"
      :message="confirmationConfig.message" :confirmText="confirmationConfig.confirmText"
      :cancelText="confirmationConfig.cancelText" @confirm="handleConfirmation" @cancel="closeConfirmationModal" />

    <div class="section-header">
      <h2>Gestion de Eventos</h2>
      <button class="btn btn-primary" @click="openEventForm()">
        <span class="btn-icon">+</span>
        Nuevo Evento
      </button>
    </div>

    <div v-if="actionNotice" :class="['action-notice', actionNoticeType]">
      {{ actionNotice }}
    </div>

    <div class="events-stats">
      <div class="stat-card">
        <div class="stat-icon">📅</div>
        <div class="stat-content">
          <div class="stat-number">{{ upcomingEvents.length }}</div>
          <div class="stat-label">Proximos</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">🔴</div>
        <div class="stat-content">
          <div class="stat-number">{{ ongoingEvents.length }}</div>
          <div class="stat-label">En Curso</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">✅</div>
        <div class="stat-content">
          <div class="stat-number">{{ pastEvents.length }}</div>
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

    <div class="search-bar">
      <div class="search-input-wrapper">
        <input v-model="searchQuery" type="search" class="search-input"
          placeholder="Buscar eventos por titulo o ubicacion..." />
        <button v-if="searchQuery" class="search-clear" @click.prevent="searchQuery = ''">X</button>
      </div>
      <select v-model="filterStatus" class="filter-select">
        <option value="">Todos los estados</option>
        <option value="scheduled">Programados</option>
        <option value="ongoing">En Curso</option>
        <option value="completed">Completados</option>
        <option value="cancelled">Cancelados</option>
      </select>
    </div>

    <div v-if="filteredEvents.length > 0" class="events-table-container">
      <table class="events-table">
        <thead>
          <tr>
            <th>Titulo</th>
            <th>Fecha Inicio</th>
            <th>Ubicacion</th>
            <th>Estado</th>
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
              <span :class="['status-badge', event.status]">{{ getStatusLabel(event.status) }}</span>
            </td>
            <td>
              <div class="action-buttons">
                <button class="btn btn-sm btn-secondary" @click="openEventForm(event)" title="Editar">✏️</button>
                <button class="btn btn-sm btn-danger" @click="requestDeleteConfirmation(event.id)"
                  title="Eliminar">🗑️</button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="filteredEvents.length > 0" class="events-cards-mobile">
      <article v-for="event in filteredEvents" :key="event.id" class="event-mobile-card">
        <div class="event-mobile-card__header">
          <div class="event-mobile-card__title">
            <strong>{{ event.title }}</strong>
            <p v-if="event.description" class="event-mobile-card__desc">{{ truncate(event.description, 90) }}</p>
          </div>
          <span :class="['status-badge', event.status]">{{ getStatusLabel(event.status) }}</span>
        </div>

        <div class="event-mobile-card__meta">
          <div class="date-cell">
            <span class="date">{{ formatDate(event.startDate) }}</span>
            <span class="time">{{ formatTime(event.startDate) }}</span>
          </div>
          <div class="event-mobile-card__location">
            <span class="meta-label">Ubicacion</span>
            <span class="location">{{ event.location || 'Sin especificar' }}</span>
          </div>
        </div>

        <div class="action-buttons event-mobile-card__actions">
          <button class="btn btn-sm btn-secondary" @click="openEventForm(event)" title="Editar">✏️ Editar</button>
          <button class="btn btn-sm btn-danger" @click="requestDeleteConfirmation(event.id)" title="Eliminar">🗑️
            Eliminar</button>
        </div>
      </article>
    </div>

    <div v-else class="empty-state">
      <div class="empty-icon">📅</div>
      <h3>No hay eventos</h3>
      <p v-if="searchQuery || filterStatus">Intenta cambiar los filtros o la busqueda</p>
      <p v-else>Comienza creando tu primer evento</p>
      <button class="btn btn-primary" @click="openEventForm()">Crear Primer Evento</button>
    </div>

    <div v-if="showEventForm" class="modal-overlay" @click="closeEventForm">
      <div class="modal" @click.stop>
        <div class="modal-header">
          <h3>{{ editingEvent ? 'Editar Evento' : 'Nuevo Evento' }}</h3>
          <button class="modal-close" @click="closeEventForm">X</button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="requestSaveConfirmation">
            <div class="form-group">
              <label>Titulo del Evento *</label>
              <input v-model="eventForm.title" type="text" class="form-input" required
                placeholder="Ej: Evento de Presentacion" />
            </div>

            <div class="form-group">
              <label>Descripcion</label>
              <textarea v-model="eventForm.description" class="form-input" rows="3"
                placeholder="Describe el evento en detalle..."></textarea>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label>Fecha de Inicio *</label>
                <input v-model="eventForm.startDate" type="datetime-local" class="form-input" required />
              </div>
              <div class="form-group">
                <label>Fecha de Fin</label>
                <input v-model="eventForm.endDate" type="datetime-local" class="form-input" />
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label>Ubicacion</label>
                <input v-model="eventForm.location" type="text" class="form-input"
                  placeholder="Ej: Estadio Central, Bogota" />
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label>Estado *</label>
                <select v-model="eventForm.status" class="form-input" required>
                  <option value="scheduled">Programado</option>
                  <option value="ongoing">En Curso</option>
                  <option value="completed">Completado</option>
                  <option value="cancelled">Cancelado</option>
                </select>
              </div>
            </div>

            <div class="form-group">
              <label>Organizadores</label>
              <p class="field-help">Puedes agregar varios responsables y se enviaran como lista al backend.</p>
              <div v-for="(organizer, index) in eventForm.organizers" :key="`organizer-${index}`" class="dynamic-row">
                <input v-model="eventForm.organizers[index]" type="text" class="form-input"
                  :placeholder="`Organizador ${index + 1}`" />
                <button v-if="eventForm.organizers.length > 1" type="button" class="btn btn-sm btn-danger"
                  @click="removeOrganizer(index)">X</button>
              </div>
              <button type="button" class="btn btn-secondary" @click="addOrganizer">+ Agregar organizador</button>
            </div>

            <div class="form-group">
              <label>Adjuntos por enlace</label>
              <p class="field-help">Solo enlaces. Sirve para imagenes, PDF, Excel, Drive o cualquier recurso accesible
                por URL.
              </p>
              <div v-for="(attachment, index) in eventForm.attachments" :key="attachment.id" class="attachment-row">
                <input v-model="attachment.title" type="text" class="form-input attachment-title"
                  placeholder="Titulo del adjunto" />
                <input v-model="attachment.url" type="url" class="form-input attachment-url"
                  placeholder="https://..." />
                <button type="button" class="btn btn-sm btn-danger" @click="removeAttachment(index)">X</button>
              </div>
              <button type="button" class="btn btn-secondary" @click="addAttachment">+ Agregar adjunto</button>
              <div v-if="eventForm.attachments.length > 0" class="images-info">
                <span class="images-badge">{{ eventForm.attachments.length }} adjunto(s)</span>
              </div>
            </div>

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
import { computed, ref } from 'vue'
import { useEvents } from '@/composables/useEvents'
import type { CreateEventRequest, Event, EventAttachment } from '@/types/EventType'
import ConfirmationModal from '../ConfirmationModal.vue'

const { events, addEvent, updateEvent, deleteEvent, upcomingEvents, ongoingEvents, pastEvents } = useEvents()

const showEventForm = ref(false)
const editingEvent = ref<Event | null>(null)
const searchQuery = ref('')
const filterStatus = ref('')
const showConfirmationModal = ref(false)
const pendingAction = ref<'create' | 'update' | 'delete' | null>(null)
const pendingEventId = ref<string | null>(null)
const actionNotice = ref('')
const actionNoticeType = ref<'success' | 'error'>('success')

type EventFormData = CreateEventRequest & {
  organizers: string[]
  attachments: EventAttachment[]
}

const createAttachment = (): EventAttachment => ({
  id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
  title: '',
  url: '',
})

const createEmptyEventForm = (): EventFormData => ({
  title: '',
  description: '',
  startDate: '',
  endDate: '',
  location: '',
  category: '',
  status: 'scheduled',
  maxAttendees: undefined,
  organizers: [''],
  attachments: [],
  tags: [],
})

const confirmationConfig = computed(() => {
  if (pendingAction.value === 'delete') {
    return {
      title: 'Confirmar eliminación',
      message: '¿Estás seguro de que deseas eliminar este evento? Esta acción no se puede deshacer.',
      confirmText: 'Eliminar',
      cancelText: 'Cancelar',
    }
  }

  if (pendingAction.value === 'update') {
    return {
      title: 'Confirmar actualización',
      message: '¿Deseas guardar los cambios de este evento?',
      confirmText: 'Actualizar',
      cancelText: 'Cancelar',
    }
  }

  return {
    title: 'Confirmar creación',
    message: '¿Deseas crear este nuevo evento?',
    confirmText: 'Crear',
    cancelText: 'Cancelar',
  }
})

const closeConfirmationModal = () => {
  showConfirmationModal.value = false
  pendingAction.value = null
  pendingEventId.value = null
}

const setActionNotice = (message: string, type: 'success' | 'error') => {
  actionNotice.value = message
  actionNoticeType.value = type
}

const clearActionNotice = () => {
  actionNotice.value = ''
}

const eventForm = ref<EventFormData>(createEmptyEventForm())

const isEventFormValid = computed(() => {
  const startDate = eventForm.value.startDate
  const endDate = eventForm.value.endDate

  if (!endDate) {
    return eventForm.value.title.trim().length > 0 && !!startDate
  }

  return eventForm.value.title.trim().length > 0 && !!startDate && new Date(startDate) < new Date(endDate)
})

const parseBackendDateTime = (value: Date | string | null | undefined): Date | null => {
  if (!value) return null

  const raw = typeof value === 'string' ? value : value.toISOString()
  const [datePart, timePart = '00:00:00'] = raw.split('T')
  const [year, month, day] = datePart.split('-').map(Number)
  const timeMatch = timePart.match(/^(\d{2}):(\d{2})(?::(\d{2}))?/)

  const hour = timeMatch ? Number(timeMatch[1]) : 0
  const minute = timeMatch ? Number(timeMatch[2]) : 0
  const second = timeMatch?.[3] ? Number(timeMatch[3]) : 0

  return new Date(year, month - 1, day, hour, minute, second)
}

const getDateTimeValue = (value: Date | string | null | undefined): number => {
  return parseBackendDateTime(value)?.getTime() ?? Number.POSITIVE_INFINITY
}

const filteredEvents = computed(() => {
  let result = [...events.value]

  if (filterStatus.value) {
    result = result.filter((event) => event.status === filterStatus.value)
  }

  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter((event) =>
      event.title.toLowerCase().includes(query) ||
      event.description?.toLowerCase().includes(query) ||
      event.location?.toLowerCase().includes(query) ||
      event.organizers?.some((organizer) => organizer.toLowerCase().includes(query)),
    )
  }

  return result.sort((a, b) => getDateTimeValue(a.startDate) - getDateTimeValue(b.startDate))
})

const truncate = (text: string = '', length: number) => {
  if (text.length <= length) return text
  return `${text.substring(0, length)}...`
}

const formatDate = (date: Date | string | null | undefined) => {
  if (!date) return ''

  const raw = typeof date === 'string' ? date : date.toISOString()
  const [datePart] = raw.split('T')
  const [year, month, day] = datePart.split('-').map(Number)

  if (!year || !month || !day) return raw

  return new Date(year, month - 1, day).toLocaleDateString('es-CO', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

const formatTime = (date: Date | string | null | undefined) => {
  if (!date) return ''

  const raw = typeof date === 'string' ? date : date.toISOString()
  const timePart = raw.split('T')[1] || ''
  const match = timePart.match(/^(\d{2}):(\d{2})/)

  return match ? `${match[1]}:${match[2]}` : timePart
}

const getStatusLabel = (status: string) => {
  const statusMap: Record<string, string> = {
    scheduled: 'Programado',
    ongoing: 'En Curso',
    completed: 'Completado',
    cancelled: 'Cancelado',
  }

  return statusMap[status] || status
}

const formatDateTimeInput = (date: Date | string | null | undefined): string => {
  if (!date) return ''

  const raw = typeof date === 'string' ? date : date.toISOString()
  const [datePart, timePart = '00:00:00'] = raw.split('T')
  const [year, month, day] = datePart.split('-')
  const timeMatch = timePart.match(/^(\d{2}):(\d{2})/)

  if (!year || !month || !day || !timeMatch) {
    return ''
  }

  return `${year}-${month}-${day}T${timeMatch[1]}:${timeMatch[2]}`
}

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
      status: event.status,
      maxAttendees: event.maxAttendees,
      organizers: event.organizers && event.organizers.length > 0 ? [...event.organizers] : [''],
      attachments: event.attachments
        ? event.attachments.map((attachment, index) => ({
          id: attachment.id || `${Date.now()}-${index}`,
          title: attachment.title || `Adjunto ${index + 1}`,
          url: attachment.url,
        }))
        : [],
      tags: event.tags || [],
    }
  } else {
    editingEvent.value = null
    eventForm.value = createEmptyEventForm()
  }

  showEventForm.value = true
  clearActionNotice()
}

const closeEventForm = () => {
  showEventForm.value = false
  editingEvent.value = null
  eventForm.value = createEmptyEventForm()
}

const requestSaveConfirmation = () => {
  if (!isEventFormValid.value) return

  pendingAction.value = editingEvent.value ? 'update' : 'create'
  showConfirmationModal.value = true
}

const buildPayload = (): CreateEventRequest => {
  const { endDate, ...basePayload } = eventForm.value
  const payload: CreateEventRequest = {
    ...basePayload,
    organizers: eventForm.value.organizers.map((organizer) => organizer.trim()).filter(Boolean),
    attachments: eventForm.value.attachments
      .map((attachment) => ({
        ...attachment,
        title: attachment.title.trim(),
        url: attachment.url.trim(),
      }))
      .filter((attachment) => attachment.url.length > 0),
  }

  if (endDate) {
    payload.endDate = endDate
  }

  return payload
}

const performSave = async () => {
  if (!isEventFormValid.value) return

  const payload = buildPayload()

  try {
    if (editingEvent.value) {
      await updateEvent(editingEvent.value.id, payload)
      setActionNotice('Evento actualizado correctamente.', 'success')
    } else {
      await addEvent(payload)
      setActionNotice('Evento creado correctamente.', 'success')
    }
    closeEventForm()
    closeConfirmationModal()
  } catch (error) {
    setActionNotice('No se pudo guardar el evento. Intenta nuevamente.', 'error')
    console.error(error)
    closeConfirmationModal()
  }
}

const requestDeleteConfirmation = (id: string) => {
  pendingAction.value = 'delete'
  pendingEventId.value = id
  showConfirmationModal.value = true
}

const handleConfirmation = async () => {
  if (pendingAction.value === 'delete') {
    const id = pendingEventId.value
    if (!id) {
      closeConfirmationModal()
      return
    }

    const event = events.value.find((item) => item.id === id)
    if (!event) {
      closeConfirmationModal()
      return
    }

    try {
      await deleteEvent(id)
      setActionNotice(`Evento "${event.title}" eliminado correctamente.`, 'success')
    } catch (error) {
      setActionNotice('No se pudo eliminar el evento. Intenta nuevamente.', 'error')
      console.error(error)
    } finally {
      closeConfirmationModal()
    }
    return
  }

  await performSave()
}

const addOrganizer = () => {
  eventForm.value.organizers.push('')
}

const removeOrganizer = (index: number) => {
  if (eventForm.value.organizers.length <= 1) {
    eventForm.value.organizers = ['']
    return
  }

  eventForm.value.organizers.splice(index, 1)
}

const addAttachment = () => {
  eventForm.value.attachments.push(createAttachment())
}

const removeAttachment = (index: number) => {
  eventForm.value.attachments.splice(index, 1)
}
</script>
