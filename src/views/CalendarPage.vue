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

<style scoped>
.calendar-container {
 min-height: 100vh;
 background: linear-gradient(135deg, #000000 0%, #1a1a2e 100%);
 padding: 100px 20px 40px;
 margin-top: 0;
}

.calendar-wrapper {
 max-width: 1200px;
 margin: 0 auto;
}

.calendar-header {
 text-align: center;
 margin-bottom: 40px;
 animation: fadeInDown 0.6s ease;
}

.calendar-header h1 {
 font-size: clamp(32px, 5vw, 48px);
 color: #ffffff;
 margin: 0 0 10px 0;
 font-weight: 900;
 letter-spacing: 1px;
}

.subtitle {
 font-size: 18px;
 color: rgba(255, 255, 255, 0.7);
 margin: 0;
}

.calendar-content {
 display: grid;
 grid-template-columns: 1fr 1fr;
 gap: 40px;
 margin-top: 40px;
}

.calendar-grid {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(var(--brand-blue-rgb), 0.3);
  border-radius: 20px;
  padding: 30px;
  backdrop-filter: blur(20px);
  animation: slideInLeft 0.6s ease;
}

.month-selector {
 display: flex;
 justify-content: space-between;
 align-items: center;
 margin-bottom: 30px;
 gap: 20px;
}

.month-selector h2 {
  font-size: 24px;
  color: var(--brand-blue);
  margin: 0;
  flex: 1;
  text-align: center;
}

.nav-btn {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  border: none;
  background: var(--primary-gradient);
  color: white;
  font-size: 18px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: bold;
}

.nav-btn:hover {
  transform: scale(1.1);
  box-shadow: 0 4px 15px var(--primary-color-alpha-40);
}

.weekdays {
 display: grid;
 grid-template-columns: repeat(7, 1fr);
 gap: 10px;
 margin-bottom: 20px;
}

.weekday {
  text-align: center;
  color: var(--brand-blue);
  font-weight: 600;
  font-size: 14px;
  padding: 10px 0;
}
.day {
  aspect-ratio: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border: 2px solid rgba(var(--brand-blue-rgb), 0.2);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  background: rgba(255, 255, 255, 0.02);
  color: rgba(255, 255, 255, 0.7);
  position: relative;
  font-weight: 600;
}
.day:hover {
  background: rgba(var(--brand-blue-rgb), 0.1);
  border-color: rgba(var(--brand-blue-rgb), 0.5);
  color: var(--brand-blue);
}

.day.other-month {
 opacity: 0.3;
 cursor: not-allowed;
}

.day.today {
  background: var(--primary-gradient);
  border-color: var(--brand-blue);
  color: #000000;
  font-weight: 700;
}

.day.has-event .event-indicator {
 position: absolute;
 bottom: 3px;
 font-size: 20px;
 color: #f59e0b;
}

.day-number {
 font-size: 16px;
}

.events-section {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(var(--brand-blue-rgb), 0.3);
  border-radius: 20px;
  padding: 30px;
  backdrop-filter: blur(20px);
  animation: slideInRight 0.6s ease;
}

.events-section h3 {
  font-size: 22px;
  color: var(--brand-blue);
  margin-top: 0;
  margin-bottom: 20px;
}

.events-list {
 display: flex;
 flex-direction: column;
 gap: 15px;
 max-height: 600px;
 overflow-y: auto;
}

.event-card {
  background: linear-gradient(135deg, rgba(var(--brand-blue-rgb), 0.1) 0%, rgba(var(--brand-blue-rgb), 0.03) 100%);
  border: 1px solid rgba(var(--brand-blue-rgb), 0.3);
  border-radius: 12px;
  padding: 15px;
  transition: all 0.3s ease;
}

.event-card:hover {
  transform: translateX(5px);
  border-color: rgba(var(--brand-blue-rgb), 0.6);
  background: linear-gradient(135deg, rgba(var(--brand-blue-rgb), 0.15) 0%, rgba(var(--brand-blue-rgb), 0.06) 100%);
}

.event-date {
 font-size: 12px;
 color: #f59e0b;
 text-transform: uppercase;
 font-weight: 700;
 margin-bottom: 5px;
}

.event-details h4 {
 margin: 0 0 5px 0;
 color: #ffffff;
 font-size: 16px;
}

.event-details p {
 margin: 0;
 color: rgba(255, 255, 255, 0.6);
 font-size: 14px;
}

.no-events {
 text-align: center;
 padding: 40px 20px;
 color: rgba(255, 255, 255, 0.5);
}

@keyframes fadeInDown {
 from {
  opacity: 0;
  transform: translateY(-20px);
 }

 to {
  opacity: 1;
  transform: translateY(0);
 }
}

@keyframes slideInLeft {
 from {
  opacity: 0;
  transform: translateX(-20px);
 }

 to {
  opacity: 1;
  transform: translateX(0);
 }
}

@keyframes slideInRight {
 from {
  opacity: 0;
  transform: translateX(20px);
 }

 to {
  opacity: 1;
  transform: translateX(0);
 }
}

@media (max-width: 768px) {
 .calendar-container {
  padding: 90px 15px 30px;
 }

 .calendar-content {
  grid-template-columns: 1fr;
  gap: 30px;
 }

 .calendar-header h1 {
  font-size: 28px;
 }

 .days {
  gap: 5px;
 }

 .day {
  font-size: 12px;
 }
}
</style>
