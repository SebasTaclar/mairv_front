<template>
 <section class="recent-events-section section">
  <div class="container">
   <h2 class="section-title">Eventos Recientes y Próximos</h2>

   <div class="events-container">
    <!-- Eventos Recientes -->
    <div class="events-column">
     <div class="column-header">
      <h3 class="column-title">📅 Eventos Recientes</h3>
     </div>
     <div class="events-list">
      <div v-if="recentAndUpcoming.recent.length === 0" class="empty-state">
       <p>No hay eventos recientes</p>
      </div>
      <div v-for="event in recentAndUpcoming.recent" :key="event.id" class="event-card" @click="openEventModal(event)">
       <div class="event-date">
        <div class="date-badge">
         {{ formatDate(event.date) }}
        </div>
       </div>
       <div class="event-content">
        <h4 class="event-title">{{ event.name }}</h4>
        <div class="event-meta">
         <span v-if="event.startTime" class="meta-item">
          ⏰ {{ event.startTime }}
         </span>
         <span class="meta-item">
          👤 {{ event.createdBy }}
         </span>
        </div>
        <p v-if="event.location" class="event-location">
         📍 {{ event.location }}
        </p>
       </div>
       <div class="event-badge" :style="{ backgroundColor: getCategoryColor(event.category) }">
        {{ getCategoryLabel(event.category) }}
       </div>
      </div>
     </div>
    </div>

    <!-- Eventos Próximos -->
    <div class="events-column">
     <div class="column-header">
      <h3 class="column-title">🚀 Próximos Eventos</h3>
     </div>
     <div class="events-list">
      <div v-if="recentAndUpcoming.upcoming.length === 0" class="empty-state">
       <p>No hay eventos próximos</p>
      </div>
      <div v-for="event in recentAndUpcoming.upcoming" :key="event.id" class="event-card"
       @click="openEventModal(event)">
       <div class="event-date">
        <div class="date-badge upcoming">
         {{ formatDate(event.date) }}
        </div>
       </div>
       <div class="event-content">
        <h4 class="event-title">{{ event.name }}</h4>
        <div class="event-meta">
         <span v-if="event.startTime" class="meta-item">
          ⏰ {{ event.startTime }}
         </span>
         <span class="meta-item">
          👤 {{ event.createdBy }}
         </span>
        </div>
        <p v-if="event.location" class="event-location">
         📍 {{ event.location }}
        </p>
       </div>
       <div class="event-badge" :style="{ backgroundColor: getCategoryColor(event.category) }">
        {{ getCategoryLabel(event.category) }}
       </div>
      </div>
     </div>
    </div>
   </div>
  </div>

  <!-- Event Modal -->
  <EventModal v-if="showModal" :event="selectedEvent!" @close="showModal = false" />
 </section>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useCalendarEvents } from '@/composables/useCalendarEvents'
import type { CalendarEvent, EventsResponse } from '@/types/EventType'
import EventModal from './EventModal.vue'
import './styles/RecentEventsSection.css'

const { getRecentAndUpcoming, getEventById } = useCalendarEvents()

const recentAndUpcoming = ref<EventsResponse>({
 recent: [],
 upcoming: [],
 all: []
})

const showModal = ref(false)
const selectedEvent = ref<CalendarEvent | null>(null)

onMounted(() => {
 recentAndUpcoming.value = getRecentAndUpcoming()
})

const openEventModal = (event: CalendarEvent) => {
 selectedEvent.value = event
 showModal.value = true
}

const parseLocalDate = (dateStr: string): Date => {
 const [year, month, day] = dateStr.split('-').map(Number)
 return new Date(year, month - 1, day)
}

const formatDate = (dateStr: string): string => {
 const date = parseLocalDate(dateStr)
 const options: Intl.DateTimeFormatOptions = {
  day: '2-digit',
  month: 'short',
  weekday: 'short'
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
</script>
