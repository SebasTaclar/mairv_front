<template>
  <section class="calendar-section section">
    <div class="container">
      <h2 class="section-title">📅 Calendario de Eventos 2026</h2>

      <!-- Año Selector -->
      <div class="calendar-controls">
        <div class="calendar-header">
          <h3 class="calendar-year">Año 2026</h3>
          <button class="month-selector-btn" @click="showMonthPicker = !showMonthPicker">
            {{ currentMonthName }} {{ currentYear }}
            <span class="chevron" :class="{ open: showMonthPicker }">▼</span>
          </button>
        </div>

        <!-- Month Picker -->
        <div v-if="showMonthPicker" class="month-picker">
          <button v-for="(monthName, index) in monthNames" :key="index" @click="selectMonth(index)" class="month-option"
            :class="{ active: currentMonth === index }">
            {{ monthName }}
          </button>
        </div>
      </div>

      <!-- View mode selector -->
      <div class="view-mode-controls">
        <label for="view-mode-select" class="view-mode-label">Vista:</label>
        <div class="view-mode-select-wrapper">
          <select id="view-mode-select" v-model="viewMode" class="view-mode-select">
            <option value="monthly">Mensual</option>
            <option value="annual">Anual</option>
          </select>
          <span class="view-mode-chevron" aria-hidden="true">▼</span>
        </div>
      </div>

      <!-- Monthly Calendar View -->
      <div v-if="viewMode === 'monthly'" class="calendar-wrapper">
        <div class="calendar-grid">
          <!-- Día semana headers -->
          <div v-for="day in dayHeaders" :key="day" class="day-header">
            {{ day }}
          </div>

          <!-- Days with events -->
          <div v-for="day in daysInMonth" :key="`day-${day}`" class="calendar-day" :class="{
            'has-events': getEventsForDay(day).length > 0,
            'today': isToday(day),
            'other-month': day === 0
          }" @click="selectDay(day)">
            <div v-if="day !== 0" class="day-number">{{ day }}</div>

            <div v-if="day !== 0" class="day-events">
              <div v-for="event in getEventsForDay(day)" :key="event.id" class="event-dot"
                :style="{ backgroundColor: getCategoryColor(event.category) }" :title="event.name"></div>
            </div>

            <div v-if="day !== 0" class="day-event-titles">
              <div v-for="(event, idx) in getEventsForDay(day).slice(0, 2)" :key="event.id" class="day-event-title"
                :title="event.name">
                {{ event.name }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Annual View - Mini months -->
      <div v-if="viewMode === 'annual'" class="annual-view">
        <h3 class="annual-title">Vista Anual 2026</h3>
        <div class="mini-calendars">
          <div v-for="month in 12" :key="`annual-${month}`" class="mini-calendar" @click="selectMonth(month - 1)">
            <h4 class="mini-month-name">{{ monthNames[month - 1] }}</h4>
            <div class="mini-grid">
              <div v-for="dayHeader in dayHeaders" :key="`mini-${month}-${dayHeader}`" class="mini-day-header">
                {{ dayHeader.charAt(0) }}
              </div>
              <div v-for="day in getMiniMonthDays(month)" :key="`mini-day-${month}-${day}`" class="mini-day" :class="{
                'has-events': getEventsForDay(day, month - 1).length > 0,
                'other': day === 0
              }"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Day events will be shown in a popup modal -->
      <DayEventsModal v-if="showDayModal" :events="selectedDayEvents" :title="formatSelectedDate()"
        @open="openEventModal" @close="showDayModal = false" />
    </div>

    <!-- Event Modal -->
    <EventModal v-if="showModal" :event="selectedEvent!" @close="showModal = false" />
  </section>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useCalendarEvents } from '@/composables/useCalendarEvents'
import type { CalendarEvent } from '@/types/EventType'
import EventModal from './EventModal.vue'
import DayEventsModal from './DayEventsModal.vue'
import './styles/CalendarSection.css'

const { getEventsByMonth, getEventsByDate, getMonthName } = useCalendarEvents()

const currentYear = ref(2026)
const currentMonth = ref(new Date().getMonth())
const showMonthPicker = ref(false)
const showModal = ref(false)
const selectedEvent = ref<CalendarEvent | null>(null)
const selectedDay = ref<number | null>(null)

const dayHeaders = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']

const monthNames = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
]

const currentMonthName = computed(() => monthNames[currentMonth.value])

// Get days in current month
const daysInMonth = computed(() => {
  const firstDay = new Date(currentYear.value, currentMonth.value, 1).getDay()
  const daysCount = new Date(currentYear.value, currentMonth.value + 1, 0).getDate()

  const days: number[] = []

  // Add empty days before month starts
  for (let i = 0; i < firstDay; i++) {
    days.push(0)
  }

  // Add days of month
  for (let i = 1; i <= daysCount; i++) {
    days.push(i)
  }

  // Fill rest with empty
  while (days.length < 42) {
    days.push(0)
  }

  return days.slice(0, 42) // Use 6-week grid to avoid overflow of last weekday
})

const selectMonth = (month: number) => {
  currentMonth.value = month
  showMonthPicker.value = false
}

const selectedDayEventsLocal = ref<CalendarEvent[]>([])
const showDayModal = ref(false)
const viewMode = ref<'monthly' | 'annual'>('monthly')

const selectDay = (day: number) => {
  if (day !== 0) {
    selectedDay.value = day
    // Set local selected day events explicitly to avoid computed timing issues
    selectedDayEventsLocal.value = getEventsForDay(day)
    // open popup modal for the day
    showDayModal.value = true
  }
}

const isToday = (day: number): boolean => {
  if (day === 0) return false
  const today = new Date()
  return (
    day === today.getDate() &&
    currentMonth.value === today.getMonth() &&
    currentYear.value === today.getFullYear()
  )
}

const getEventsForDay = (day: number, month?: number): CalendarEvent[] => {
  if (day === 0) return []

  const m = month ?? currentMonth.value
  const dateStr = `${currentYear.value}-${String(m + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`

  const eventsByMonthMap = getEventsByMonth(currentYear.value, m)
  return eventsByMonthMap.get(day) || []
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

const formatDate = (day: number): string => {
  const date = new Date(currentYear.value, currentMonth.value, day)
  return date.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })
}

const formatSelectedDate = (): string => {
  if (!selectedDay.value) return ''
  return formatDate(selectedDay.value)
}

const selectedDayEvents = computed(() => {
  if (selectedDayEventsLocal.value.length > 0) return selectedDayEventsLocal.value
  if (!selectedDay.value) return []
  return getEventsForDay(selectedDay.value)
})

const getMiniMonthDays = (month: number) => {
  const firstDay = new Date(currentYear.value, month - 1, 1).getDay()
  const daysCount = new Date(currentYear.value, month, 0).getDate()

  const days: number[] = []

  for (let i = 0; i < firstDay; i++) {
    days.push(0)
  }

  for (let i = 1; i <= daysCount; i++) {
    days.push(i)
  }

  while (days.length < 35) {
    days.push(0)
  }

  return days.slice(0, 35)
}

const openEventModal = (event: CalendarEvent) => {
  selectedEvent.value = event
  showModal.value = true
}
</script>
