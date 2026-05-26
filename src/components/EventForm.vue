<template>
 <div class="event-form-container">
  <div class="form-header">
   <h2 class="form-title">{{ isEditMode ? '✏️ Editar Evento' : '➕ Crear Nuevo Evento' }}</h2>
   <button v-if="isEditMode" class="delete-btn" @click="confirmDelete">🗑️ Eliminar</button>
  </div>

  <form @submit.prevent="handleSubmit" class="event-form">
   <!-- Nombre (obligatorio) -->
   <div class="form-group">
    <label for="name" class="form-label">Nombre del Evento *</label>
    <input id="name" v-model="formData.name" type="text" class="form-input" placeholder="Ej: Torneo de Fútbol"
     required />
   </div>

   <!-- Descripción -->
   <div class="form-group">
    <label for="description" class="form-label">Descripción</label>
    <textarea id="description" v-model="formData.description" class="form-textarea" placeholder="Describe el evento..."
     rows="4"></textarea>
   </div>

   <!-- Fecha -->
   <div class="form-group">
    <label for="date" class="form-label">Fecha *</label>
    <input id="date" v-model="formData.date" type="date" class="form-input" min="2026-01-01" max="2026-12-31"
     required />
   </div>

   <!-- Hora de Inicio y Fin -->
   <div class="form-row">
    <div class="form-group">
     <label for="startTime" class="form-label">Hora de Inicio</label>
     <input id="startTime" v-model="formData.startTime" type="time" class="form-input" />
    </div>

    <div class="form-group">
     <label for="endTime" class="form-label">Hora de Fin</label>
     <input id="endTime" v-model="formData.endTime" type="time" class="form-input" />
    </div>
   </div>

   <!-- Duración -->
   <div class="form-group">
    <label for="duration" class="form-label">Duración (minutos)</label>
    <input id="duration" v-model.number="formData.duration" type="number" class="form-input" placeholder="ej: 120"
     min="0" />
   </div>

   <!-- Ubicación -->
   <div class="form-group">
    <label for="location" class="form-label">Ubicación</label>
    <input id="location" v-model="formData.location" type="text" class="form-input" placeholder="Ej: Salón Principal" />
   </div>

   <!-- Categoría -->
   <div class="form-group">
    <label for="category" class="form-label">Categoría</label>
    <select v-model="formData.category" class="form-select">
     <option value="evento">Evento</option>
     <option value="reunion">Reunión</option>
     <option value="actividad">Actividad</option>
     <option value="otro">Otro</option>
    </select>
   </div>

   <!-- Creado por (obligatorio) -->
   <div class="form-group">
    <label for="createdBy" class="form-label">Creado por *</label>
    <input id="createdBy" v-model="formData.createdBy" type="text" class="form-input" placeholder="Tu nombre"
     required />
   </div>

   <!-- Directores -->
   <div class="form-group">
    <label for="directors" class="form-label">Directores (separados por comas)</label>
    <input id="directors" v-model="formData.directors" type="text" class="form-input"
     placeholder="Ej: Juan López, María García" />
   </div>

   <!-- Capacidad -->
   <div class="form-group">
    <label for="capacity" class="form-label">Capacidad</label>
    <input id="capacity" v-model.number="formData.capacity" type="number" class="form-input"
     placeholder="Número máximo de inscritos" min="0" />
   </div>

   <!-- Adjuntos -->
   <div class="form-group">
    <label class="form-label">Documentos Adjuntos</label>
    <div class="attachments-section">
     <div v-for="(attachment, index) in formData.attachments" :key="index" class="attachment-item">
      <input v-model="attachment.title" type="text" class="form-input attachment-input"
       placeholder="Título del documento" />
      <input v-model="attachment.url" type="url" class="form-input attachment-input" placeholder="URL del documento" />
      <button type="button" class="remove-attachment-btn" @click="removeAttachment(index)">
       ✕
      </button>
     </div>

     <button type="button" class="add-attachment-btn" @click="addAttachment">
      + Agregar Documento
     </button>
    </div>
   </div>

   <!-- Botones de acción -->
   <div class="form-actions">
    <button type="submit" class="submit-btn">
     {{ isEditMode ? '💾 Actualizar' : '➕ Crear Evento' }}
    </button>
    <button type="button" class="cancel-btn" @click="$emit('close')">
     ✕ Cancelar
    </button>
   </div>
  </form>

  <!-- Confirmación de eliminación -->
  <div v-if="showDeleteConfirm" class="delete-confirm-modal">
   <div class="confirm-content">
    <h3>¿Eliminar evento?</h3>
    <p>Esta acción no se puede deshacer.</p>
    <div class="confirm-actions">
     <button class="confirm-btn" @click="handleDeleteEvent">Sí, eliminar</button>
     <button class="cancel-confirm-btn" @click="showDeleteConfirm = false">Cancelar</button>
    </div>
   </div>
  </div>
 </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useCalendarEvents } from '@/composables/useCalendarEvents'
import type { CalendarEvent, EventAttachment } from '@/types/EventType'
import './styles/EventForm.css'

const props = defineProps<{
 event?: CalendarEvent
}>()

const emit = defineEmits<{
 close: []
 save: [event: CalendarEvent]
}>()

const { createEvent, updateEvent, deleteEvent } = useCalendarEvents()

const showDeleteConfirm = ref(false)

const isEditMode = computed(() => !!props.event)

const formData = ref<Omit<CalendarEvent, 'id'>>({
 name: props.event?.name || '',
 date: props.event?.date || '',
 startTime: props.event?.startTime || '',
 endTime: props.event?.endTime || '',
 duration: props.event?.duration || undefined,
 createdBy: props.event?.createdBy || '',
 directors: props.event?.directors || '',
 description: props.event?.description || '',
 attachments: props.event?.attachments || [],
 location: props.event?.location || '',
 category: props.event?.category || 'evento',
 capacity: props.event?.capacity || undefined,
 registeredCount: props.event?.registeredCount || undefined
})

const handleSubmit = async () => {
 if (!formData.value.name || !formData.value.date || !formData.value.createdBy) {
  alert('Por favor completa los campos obligatorios')
  return
 }

 if (isEditMode.value && props.event) {
  await updateEvent(props.event.id, formData.value)
  emit('save', { ...props.event, ...formData.value })
 } else {
  const newEvent = await createEvent(formData.value)
  emit('save', newEvent)
 }

 emit('close')
}

const addAttachment = () => {
 if (!formData.value.attachments) {
  formData.value.attachments = []
 }
 formData.value.attachments.push({
  id: Date.now().toString(),
  title: '',
  url: ''
 })
}

const removeAttachment = (index: number) => {
 formData.value.attachments?.splice(index, 1)
}

const confirmDelete = () => {
 showDeleteConfirm.value = true
}

const handleDeleteEvent = async () => {
 if (props.event) {
  await deleteEvent(props.event.id)
  emit('close')
 }
}
</script>
