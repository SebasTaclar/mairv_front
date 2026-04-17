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

<style scoped>
/* Variables de tema MAIRV */
:root {
  --primary-cyan: var(--brand-blue);
  --dark-cyan: var(--brand-blue-dark);
  --black: #000000;
  --white: #ffffff;
}

/* Animaciones */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }

  to {
    opacity: 1;
    transform: translateX(0);
  }
}

/* Contenedor principal - ESTILO OSCURO */
.showcase-section {
  width: 100%;
  background: linear-gradient(180deg, #0a0a0a 0%, #1a1a2e 100%);
  padding: 5rem 0;
  position: relative;
  overflow: hidden;
}

.showcase-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(circle at 50% 0%, rgba(var(--brand-blue-rgb), 0.15) 0%, transparent 60%);
  pointer-events: none;
}

.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 2rem;
  position: relative;
  z-index: 1;
}

/* Títulos */
.showcase-title {
  font-size: 3rem;
  font-weight: 800;
  text-align: center;
  margin-bottom: 0.5rem;
  color: var(--white);
  letter-spacing: -0.02em;
  animation: fadeIn 0.8s ease-out;
}

.showcase-subtitle {
  font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.6);
  text-align: center;
  margin-bottom: 4rem;
  animation: fadeIn 1s ease-out;
}

/* Sección de categoría */
.category-section {
  margin-bottom: 4rem;
  animation: slideIn 0.8s ease-out;
}

.category-title {
  font-size: 2rem;
  font-weight: 700;
  color: var(--primary-cyan);
  margin-bottom: 2rem;
  padding-left: 1rem;
  border-left: 4px solid var(--primary-cyan);
  text-shadow: 0 2px 10px rgba(var(--brand-blue-rgb), 0.3);
}

/* Carrusel de eventos */
.events-carousel {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 2rem;
  padding: 0 1rem;
}

/* Tarjeta de evento */
.event-card {
  background: rgba(30, 30, 40, 0.8);
  border-radius: 16px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid rgba(var(--brand-blue-rgb), 0.2);
  backdrop-filter: blur(10px);
  display: flex;
  gap: 1rem;
  padding: 1.5rem;
}

.event-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 20px 40px rgba(34, 211, 238, 0.3),
    0 0 0 1px rgba(34, 211, 238, 0.5);
  border-color: var(--primary-cyan);
  background: rgba(34, 211, 238, 0.08);
}

.event-card.highlighted {
  border-color: var(--primary-cyan);
  background: rgba(34, 211, 238, 0.12);
}

.event-card.highlighted:hover {
  box-shadow: 0 20px 40px rgba(34, 211, 238, 0.4),
    0 0 0 2px rgba(34, 211, 238, 0.6);
}

.event-date {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--primary-cyan) 0%, var(--dark-cyan) 100%);
  border-radius: 12px;
  min-width: 70px;
  min-height: 70px;
  font-weight: 700;
  text-align: center;
}

.event-date .month {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.8);
  letter-spacing: 1px;
}

.event-date .day {
  font-size: 1.75rem;
  color: var(--white);
}

.event-info {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 0.5rem;
}

.event-name {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--white);
  margin: 0;
  line-height: 1.3;
}

.event-time {
  font-size: 0.9rem;
  color: var(--primary-cyan);
  margin: 0;
  font-weight: 500;
}

.event-category {
  display: inline-block;
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.7);
  background: rgba(34, 211, 238, 0.15);
  padding: 0.3rem 0.6rem;
  border-radius: 8px;
  font-weight: 500;
  width: fit-content;
  border: 1px solid rgba(34, 211, 238, 0.3);
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  backdrop-filter: blur(10px);
  animation: fadeIn 0.3s ease;
}

.modal-content {
  background: #1a1a2e;
  border-radius: 24px;
  max-width: 600px;
  width: 90%;
  max-height: 90vh;
  overflow: auto;
  border: 1px solid rgba(34, 211, 238, 0.3);
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.5);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 2rem;
  border-bottom: 1px solid rgba(34, 211, 238, 0.2);
  background: rgba(10, 10, 20, 0.8);
}

.modal-header-left {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.modal-icon {
  font-size: 2.5rem;
}

.modal-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--white);
  margin: 0;
}

.modal-close {
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.6);
  cursor: pointer;
  font-size: 2rem;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.3s ease;
}

.modal-close:hover {
  background: rgba(34, 211, 238, 0.2);
  color: var(--primary-cyan);
  transform: rotate(90deg);
}

.modal-body {
  padding: 2rem;
}

.modal-details {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: rgba(34, 211, 238, 0.08);
  border-radius: 12px;
  border: 1px solid rgba(34, 211, 238, 0.2);
}

.detail-item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.detail-label {
  font-size: 0.9rem;
  color: var(--primary-cyan);
  font-weight: 600;
}

.detail-value {
  font-size: 1rem;
  color: var(--white);
  font-weight: 500;
}

.modal-description {
  background: rgba(34, 211, 238, 0.05);
  padding: 1.5rem;
  border-radius: 12px;
  border-left: 3px solid var(--primary-cyan);
}

.modal-description h4 {
  margin: 0 0 1rem 0;
  color: var(--primary-cyan);
  font-size: 1.1rem;
}

.modal-description p {
  margin: 0;
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.6;
}

/* Responsive Design */
@media (max-width: 1024px) {
  .events-carousel {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 1.5rem;
  }
}

@media (max-width: 768px) {
  .showcase-section {
    padding: 3rem 0;
  }

  .container {
    padding: 0 1rem;
  }

  .showcase-title {
    font-size: 2.25rem;
  }

  .showcase-subtitle {
    font-size: 1rem;
    margin-bottom: 3rem;
  }

  .category-section {
    margin-bottom: 3rem;
  }

  .category-title {
    font-size: 1.5rem;
  }

  .event-card {
    flex-direction: column;
    align-items: center;
    text-align: center;
    padding: 1.25rem;
  }

  .event-info {
    align-items: center;
  }

  .modal-details {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 480px) {
  .showcase-title {
    font-size: 1.75rem;
  }

  .category-title {
    font-size: 1.25rem;
  }

  .events-carousel {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .modal-content {
    width: 95%;
  }

  .modal-header {
    padding: 1.5rem;
  }

  .modal-body {
    padding: 1.5rem;
  }
}
</style>
