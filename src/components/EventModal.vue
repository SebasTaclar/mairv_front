<template>
 <Teleport to="body">
  <div class="event-modal-overlay" @click="handleBackdropClick">
   <div class="event-modal" @click.stop>
    <!-- Header -->
    <div class="modal-header">
     <h2 class="modal-title">{{ event.name }}</h2>
     <button class="close-button" @click="$emit('close')">×</button>
    </div>

    <!-- Content -->
    <div class="modal-content">
     <!-- Categoría y Estado -->
     <div class="modal-badges">
      <span class="badge category" :style="{ backgroundColor: getCategoryColor(event.category) }">
       {{ getCategoryLabel(event.category) }}
      </span>
     </div>

     <!-- Descripción -->
     <div v-if="event.description" class="modal-section">
      <h3 class="section-label">📝 Descripción</h3>
      <p class="description-text">{{ event.description }}</p>
     </div>

     <!-- Información de Fecha y Hora -->
     <div class="modal-section">
      <h3 class="section-label">🗓️ Detalles de Fecha y Hora</h3>
      <div class="info-grid">
       <div class="info-item">
        <span class="info-label">Fecha</span>
        <span class="info-value">{{ formatDate(event.date) }}</span>
       </div>
       <div v-if="event.startTime" class="info-item">
        <span class="info-label">Hora de Inicio</span>
        <span class="info-value">{{ event.startTime }}</span>
       </div>
       <div v-if="event.endTime" class="info-item">
        <span class="info-label">Hora de Fin</span>
        <span class="info-value">{{ event.endTime }}</span>
       </div>
       <div v-if="event.duration" class="info-item">
        <span class="info-label">Duración</span>
        <span class="info-value">{{ event.duration }} minutos</span>
       </div>
      </div>
     </div>

     <!-- Ubicación -->
     <div v-if="event.location" class="modal-section">
      <h3 class="section-label">📍 Ubicación</h3>
      <p class="location-text">{{ event.location }}</p>
     </div>

     <!-- Organizadores -->
     <div class="modal-section">
      <h3 class="section-label">👥 Organizadores</h3>
      <div class="organizer-grid">
       <div class="organizer-item">
        <span class="organizer-role">Creador:</span>
        <span class="organizer-name">{{ event.createdBy }}</span>
       </div>
       <div v-if="event.directors" class="organizer-item">
        <span class="organizer-role">Directores:</span>
        <span class="organizer-name">{{ event.directors }}</span>
       </div>
      </div>
     </div>

     <!-- Capacidad -->
     <div v-if="event.capacity" class="modal-section">
      <h3 class="section-label">👤 Capacidad</h3>
      <div class="capacity-info">
       <div class="capacity-bar">
        <div class="capacity-fill" :style="{ width: calculateCapacityPercentage() + '%' }"></div>
       </div>
       <div class="capacity-text">
        {{ event.registeredCount || 0 }} / {{ event.capacity }} inscritos
       </div>
      </div>
     </div>

     <!-- Adjuntos -->
     <div v-if="event.attachments && event.attachments.length > 0" class="modal-section">
      <h3 class="section-label">📎 Documentos Adjuntos</h3>
      <div class="attachments-list">
       <a v-for="attachment in event.attachments" :key="attachment.id" :href="attachment.url" target="_blank"
        rel="noopener noreferrer" class="attachment-link">
        <span class="attachment-icon">📄</span>
        <span class="attachment-title">{{ attachment.title }}</span>
        <span class="external-icon">↗</span>
       </a>
      </div>
     </div>
    </div>

    <!-- Footer -->
    <div class="modal-footer">
     <button class="close-btn" @click="$emit('close')">Cerrar</button>
    </div>
   </div>
  </div>
 </Teleport>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { CalendarEvent } from '@/types/EventType'
import './styles/EventModal.css'

const props = defineProps<{
 event: CalendarEvent
}>()

defineEmits<{
 close: []
}>()

const handleBackdropClick = (e: MouseEvent) => {
 if ((e.target as HTMLElement).classList.contains('event-modal-overlay')) {
  // Cierra el modal
 }
}

const formatDate = (dateStr: string): string => {
 const date = new Date(dateStr)
 const options: Intl.DateTimeFormatOptions = {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  weekday: 'long'
 }
 return date.toLocaleDateString('es-ES', options)
}

const getCategoryColor = (category?: string): string => {
 const colors: Record<string, string> = {
  'evento': '#FF6B6B',
  'reunion': '#4ECDC4',
  'actividad': '#45B7D1',
  'otro': '#95A5A6'
 }
 return colors[category || 'otro']
}

const getCategoryLabel = (category?: string): string => {
 const labels: Record<string, string> = {
  'evento': 'Evento',
  'reunion': 'Reunión',
  'actividad': 'Actividad',
  'otro': 'Otro'
 }
 return labels[category || 'otro']
}

const calculateCapacityPercentage = (): number => {
 if (!props.event?.capacity) return 0
 const registered = props.event?.registeredCount || 0
 return Math.min((registered / props.event.capacity) * 100, 100)
}
</script>
