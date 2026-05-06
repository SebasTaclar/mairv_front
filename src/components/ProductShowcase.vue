<template>
  <section class="showcase-section">
    <div class="container">
      <h2 class="showcase-title">📅 Próximos Eventos</h2>
      <p class="showcase-subtitle">Acompáñanos en nuestras actividades espirituales</p>

      <!-- Sección: Eventos Destacados -->
      <div v-if="highlightedEvents.length > 0" class="category-section">
        <h3 class="category-title">✨ Eventos Destacados</h3>
        <div class="events-carousel">
          <div v-for="event in highlightedEvents" :key="event.id" class="event-card highlighted"
            @click="showEventDetail(event)">
            <div class="event-date">
              <span class="month">{{ formatMonth(event.date) }}</span>
              <span class="day">{{ formatDay(event.date) }}</span>
            </div>
            <div class="event-info">
              <h4 class="event-name">{{ event.name }}</h4>
              <p class="event-time">⏰ {{ event.time }}</p>
              <span class="event-category">{{ event.icon }} {{ event.category }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Sección: Bautizos -->
      <div v-if="baptismEvents.length > 0" class="category-section">
        <h3 class="category-title">💧 Bautizos</h3>
        <div class="events-carousel">
          <div v-for="event in baptismEvents" :key="event.id" class="event-card" @click="showEventDetail(event)">
            <div class="event-date">
              <span class="month">{{ formatMonth(event.date) }}</span>
              <span class="day">{{ formatDay(event.date) }}</span>
            </div>
            <div class="event-info">
              <h4 class="event-name">{{ event.name }}</h4>
              <p class="event-time">⏰ {{ event.time }}</p>
              <span class="event-category">{{ event.icon }} {{ event.category }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Sección: Salidas de Campo -->
      <div v-if="fieldTripEvents.length > 0" class="category-section">
        <h3 class="category-title">🚌 Salidas de Campo</h3>
        <div class="events-carousel">
          <div v-for="event in fieldTripEvents" :key="event.id" class="event-card" @click="showEventDetail(event)">
            <div class="event-date">
              <span class="month">{{ formatMonth(event.date) }}</span>
              <span class="day">{{ formatDay(event.date) }}</span>
            </div>
            <div class="event-info">
              <h4 class="event-name">{{ event.name }}</h4>
              <p class="event-time">⏰ {{ event.time }}</p>
              <span class="event-category">{{ event.icon }} {{ event.category }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Sección: Retiros Espirituales -->
      <div v-if="retreatEvents.length > 0" class="category-section">
        <h3 class="category-title">🏔️ Retiros Espirituales</h3>
        <div class="events-carousel">
          <div v-for="event in retreatEvents" :key="event.id" class="event-card" @click="showEventDetail(event)">
            <div class="event-date">
              <span class="month">{{ formatMonth(event.date) }}</span>
              <span class="day">{{ formatDay(event.date) }}</span>
            </div>
            <div class="event-info">
              <h4 class="event-name">{{ event.name }}</h4>
              <p class="event-time">⏰ {{ event.time }}</p>
              <span class="event-category">{{ event.icon }} {{ event.category }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Sección: Otros Eventos -->
      <div v-if="otherEvents.length > 0" class="category-section">
        <h3 class="category-title">🎉 Otros Eventos</h3>
        <div class="events-carousel">
          <div v-for="event in otherEvents" :key="event.id" class="event-card" @click="showEventDetail(event)">
            <div class="event-date">
              <span class="month">{{ formatMonth(event.date) }}</span>
              <span class="day">{{ formatDay(event.date) }}</span>
            </div>
            <div class="event-info">
              <h4 class="event-name">{{ event.name }}</h4>
              <p class="event-time">⏰ {{ event.time }}</p>
              <span class="event-category">{{ event.icon }} {{ event.category }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de detalle del evento -->
    <div v-if="showModal" class="modal-overlay" @click.self="showModal = false">
      <div class="modal-content">
        <div class="modal-header">
          <div class="modal-header-left">
            <span class="modal-icon">{{ selectedEvent?.icon }}</span>
            <h3 class="modal-title">{{ selectedEvent?.name }}</h3>
          </div>
          <button class="modal-close" @click="showModal = false">✕</button>
        </div>
        <div class="modal-body">
          <div class="modal-details">
            <div class="detail-item">
              <span class="detail-label">📅 Fecha:</span>
              <span class="detail-value">{{ formatFullDate(selectedEvent?.date) }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">⏰ Hora:</span>
              <span class="detail-value">{{ selectedEvent?.time }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">📍 Ubicación:</span>
              <span class="detail-value">{{ selectedEvent?.location }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">👥 Categoría:</span>
              <span class="detail-value">{{ selectedEvent?.category }}</span>
            </div>
          </div>
          <div class="modal-description">
            <h4>Descripción</h4>
            <p>{{ selectedEvent?.description }}</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import './styles/ProductShowcase.css'
import { computed, ref } from 'vue'

interface Event {
  id: number
  name: string
  date: Date
  time: string
  location: string
  category: string
  icon: string
  description: string
  type: 'baptism' | 'fieldTrip' | 'retreat' | 'highlighted' | 'other'
}

// Estado para el modal
const showModal = ref(false)
const selectedEvent = ref<Event | null>(null)

// Próximos eventos de la iglesia
const events = ref<Event[]>([
  {
    id: 1,
    name: 'Bautizo Comunitario',
    date: new Date(2026, 2, 15),
    time: '10:00 AM',
    location: 'Río Principal - Centro',
    category: 'Bautizos',
    icon: '💧',
    description: 'Celebración especial de bautizos. Acompáñanos en este momento significativo de fe.',
    type: 'baptism'
  },
  {
    id: 2,
    name: 'Salida de Campo - Naturaleza',
    date: new Date(2026, 2, 22),
    time: '8:00 AM',
    location: 'Parque Nacional Los Nevados',
    category: 'Salidas de Campo',
    icon: '🚌',
    description: 'Convivencia en la naturaleza para conocernos mejor y fortalecer nuestros lazos comunitarios.',
    type: 'fieldTrip'
  },
  {
    id: 3,
    name: 'Retiro Espiritual',
    date: new Date(2026, 3, 10),
    time: '6:00 PM',
    location: 'Hacienda El Descanso',
    category: 'Retiros Espirituales',
    icon: '🏔️',
    description: 'Fin de semana de reflexión, oración y crecimiento espiritual profundo.',
    type: 'retreat'
  },
  {
    id: 4,
    name: 'Conferencia Especial',
    date: new Date(2026, 2, 18),
    time: '7:00 PM',
    location: 'Templo Principal',
    category: 'Eventos Destacados',
    icon: '✨',
    description: 'Conferencia magistral con un orador invitado sobre liderazgo cristiano.',
    type: 'highlighted'
  },
  {
    id: 5,
    name: 'Bautizo de Niños',
    date: new Date(2026, 3, 5),
    time: '11:00 AM',
    location: 'Iglesia Central',
    category: 'Bautizos',
    icon: '💧',
    description: 'Ceremonia especial de dedicación de niños. Momento especial para las familias.',
    type: 'baptism'
  },
  {
    id: 6,
    name: 'Caminata Misionera',
    date: new Date(2026, 3, 20),
    time: '9:00 AM',
    location: 'Zona Rural de Tolimá',
    category: 'Salidas de Campo',
    icon: '🚌',
    description: 'Salida de campo para llevar ayuda y compartir el evangelio en zonas rurales.',
    type: 'fieldTrip'
  },
  {
    id: 7,
    name: 'Noche de Alabanza',
    date: new Date(2026, 2, 28),
    time: '7:30 PM',
    location: 'Templo Principal',
    category: 'Otros Eventos',
    icon: '🎉',
    description: 'Noche especial de música, alabanza y adoración colectiva.',
    type: 'other'
  }
])

// Filtrar eventos por categoría
const highlightedEvents = computed(() => {
  return events.value.filter(e => e.type === 'highlighted').slice(0, 4)
})

const baptismEvents = computed(() => {
  return events.value.filter(e => e.type === 'baptism').slice(0, 4)
})

const fieldTripEvents = computed(() => {
  return events.value.filter(e => e.type === 'fieldTrip').slice(0, 4)
})

const retreatEvents = computed(() => {
  return events.value.filter(e => e.type === 'retreat').slice(0, 4)
})

const otherEvents = computed(() => {
  return events.value.filter(e => e.type === 'other').slice(0, 4)
})

// Funciones de formato de fecha
const formatMonth = (date: Date) => {
  const months = ['ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN', 'JUL', 'AGO', 'SEP', 'OCT', 'NOV', 'DIC']
  return months[date.getMonth()]
}

const formatDay = (date: Date) => {
  return date.getDate().toString().padStart(2, '0')
}

const formatFullDate = (date: Date | undefined) => {
  if (!date) return ''
  return date.toLocaleDateString('es-CO', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

// Funciones para el modal
const showEventDetail = (event: Event) => {
  selectedEvent.value = event
  showModal.value = true
}
</script>



