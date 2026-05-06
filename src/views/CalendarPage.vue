<template>
 <div class="calendar-container">
  <div class="calendar-wrapper">
   <header class="calendar-header">
    <h1>📅 Calendario de Eventos</h1>
    <p class="subtitle">Mantente actualizado con todos nuestros eventos</p>
   </header>

   <div class="calendar-content">
    <div class="calendar-grid">
     <div class="month-selector">
      <button @click="prevMonth" class="nav-btn">←</button>
      <h2>{{ monthName }} {{ currentYear }}</h2>
      <button @click="nextMonth" class="nav-btn">→</button>
     </div>

     <div class="weekdays">
      <div v-for="day in ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sab']" :key="day" class="weekday">
       {{ day }}
      </div>
     </div>

     <div class="days">
      <div v-for="day in calendarDays" :key="day.date"
       :class="['day', { 'other-month': !day.currentMonth, 'today': day.isToday, 'has-event': day.hasEvent }]"
       @click="selectDate(day)">
       <span class="day-number">{{ day.date }}</span>
       <span v-if="day.hasEvent" class="event-indicator">•</span>
      </div>
     </div>
    </div>

    <div class="events-section">
     <h3>Próximos Eventos</h3>
     <div class="events-list">
      <div v-if="upcomingEvents.length > 0">
       <div v-for="event in upcomingEvents" :key="event.id" class="event-card">
        <div class="event-date">{{ formatEventDate(event.date) }}</div>
        <div class="event-details">
         <h4>{{ event.title }}</h4>
         <p>{{ event.description }}</p>
        </div>
       </div>
      </div>
      <div v-else class="no-events">
       <p>No hay eventos próximos</p>
      </div>
     </div>
    </div>
   </div>
  </div>
 </div>
</template>

<script setup lang="ts">
import './styles/CalendarPage.css'
import { ref, computed } from 'vue'

interface CalendarEvent {
 id: string
 date: Date
 title: string
 description: string
}

interface CalendarDay {
 date: number
 currentMonth: boolean
 isToday: boolean
 hasEvent: boolean
 fullDate: Date
}

const currentMonth = ref(new Date().getMonth())
const currentYear = ref(new Date().getFullYear())

const monthNames = [
 'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
]

const events = ref<CalendarEvent[]>([
 {
  id: '1',
  date: new Date(2026, 2, 15),
  title: 'Torneo de Juegos',
  description: 'Gran torneo con premios sorpresa'
 },
 {
  id: '2',
  date: new Date(2026, 2, 20),
  title: 'Evento Especial',
  description: 'Celebración con la comunidad'
 },
 {
  id: '3',
  date: new Date(2026, 3, 10),
  title: 'Actualización de Juegos',
  description: 'Nuevas características disponibles'
 }
])

const monthName = computed(() => monthNames[currentMonth.value])

const calendarDays = computed(() => {
 const days: CalendarDay[] = []
 const firstDay = new Date(currentYear.value, currentMonth.value, 1).getDay()
 const daysInMonth = new Date(currentYear.value, currentMonth.value + 1, 0).getDate()
 const daysInPrevMonth = new Date(currentYear.value, currentMonth.value, 0).getDate()

 // Días del mes anterior
 for (let i = firstDay - 1; i >= 0; i--) {
  days.push({
   date: daysInPrevMonth - i,
   currentMonth: false,
   isToday: false,
   hasEvent: false,
   fullDate: new Date(currentYear.value, currentMonth.value - 1, daysInPrevMonth - i)
  })
 }

 // Días del mes actual
 const today = new Date()
 for (let i = 1; i <= daysInMonth; i++) {
  const fullDate = new Date(currentYear.value, currentMonth.value, i)
  const hasEvent = events.value.some(
   e => e.date.toDateString() === fullDate.toDateString()
  )
  days.push({
   date: i,
   currentMonth: true,
   isToday: fullDate.toDateString() === today.toDateString(),
   hasEvent,
   fullDate
  })
 }

 // Días del mes siguiente
 const remainingDays = 42 - days.length
 for (let i = 1; i <= remainingDays; i++) {
  days.push({
   date: i,
   currentMonth: false,
   isToday: false,
   hasEvent: false,
   fullDate: new Date(currentYear.value, currentMonth.value + 1, i)
  })
 }

 return days
})

const upcomingEvents = computed(() => {
 return events.value
  .filter(e => e.date >= new Date())
  .sort((a, b) => a.date.getTime() - b.date.getTime())
  .slice(0, 5)
})

const prevMonth = () => {
 if (currentMonth.value === 0) {
  currentMonth.value = 11
  currentYear.value--
 } else {
  currentMonth.value--
 }
}

const nextMonth = () => {
 if (currentMonth.value === 11) {
  currentMonth.value = 0
  currentYear.value++
 } else {
  currentMonth.value++
 }
}

const selectDate = (day: CalendarDay) => {
 if (day.currentMonth) {
  console.log('Fecha seleccionada:', day.fullDate)
 }
}

const formatEventDate = (date: Date) => {
 return date.toLocaleDateString('es-ES', {
  weekday: 'short',
  year: 'numeric',
  month: 'short',
  day: 'numeric'
 })
}
</script>



