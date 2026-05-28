<template>
  <section class="calendar-section section">
    <Spinner v-if="isLoading" />

    <div class="container">
      <h2 class="section-title">CALENDARIO DE EVENTOS</h2>
      <div class="calendar-card-header">
        <div class="month-pill-group">
          <button class="pill-arrow-btn" @click="prevMonth" aria-label="Mes anterior">‹</button>
          <div class="month-pill" @click="showMonthPicker = !showMonthPicker">
            <span class="pill-label">{{ currentMonthName.toUpperCase() }}, {{ currentYear }}</span>
          </div>
          <button class="pill-arrow-btn" @click="nextMonth" aria-label="Mes siguiente">›</button>
        </div>
      </div>
      <div class="calendar-layout">
        <!-- Left: Large calendar -->
        <div class="calendar-main">
          <div class="calendar-card">


            <!-- Month Picker (small) -->
            <div v-if="showMonthPicker" class="month-picker small">
              <button v-for="(monthName, index) in monthNames" :key="index" @click="selectMonth(index)"
                class="month-option" :class="{ active: currentMonth === index }">
                {{ monthName }}
              </button>
            </div>

            <div v-if="viewMode === 'monthly'" class="calendar-wrapper large">
              <div class="calendar-grid">
                <div v-for="day in dayHeaders" :key="day" class="day-header">{{ day }}</div>
                <div v-for="(day, index) in daysInMonth" :key="`day-${currentMonth}-${currentYear}-${index}`"
                  class="calendar-day" :class="{
                    'has-events': getEventsForDay(day).length > 0,
                    'today': isToday(day),
                    'other-month': day === 0
                  }" @click="selectDay(day)">
                  <div v-if="day !== 0" class="day-number">{{ day }}</div>
                  <div v-if="day !== 0 && getEventsForDay(day).length > 0" class="day-events"
                    aria-label="Días con eventos">
                    <span v-for="(event, idx) in getEventsForDay(day).slice(0, 4)" :key="`${event.id}-${idx}`"
                      class="event-dot" :style="{ background: getCategoryColor(event.category) }"
                      :title="event.name"></span>
                  </div>
                </div>
              </div>
            </div>

            <DayEventsModal v-if="showDayModal" :events="selectedDayEvents" :title="formatSelectedDate()"
              @open="openEventModal" @close="showDayModal = false" />
          </div>
        </div>

        <!-- Right: Sidebar with event cards -->
        <aside class="calendar-aside">
          <div class="aside-cards">
            <div v-for="event in upcomingList" :key="event.id" class="aside-card">
              <div class="aside-date-badge">
                <span class="aside-date-day">{{ formatDayFromString(event.date) }}</span>
                <span class="aside-date-month">{{ formatShortMonthFromString(event.date) }}</span>
              </div>

              <div class="aside-body">
                <div class="aside-title">{{ event.name }}</div>
                <div class="aside-meta">{{ formatDateFromString(event.date) }} • {{ event.startTime }}</div>
                <div class="aside-location">{{ event.location }}</div>
              </div>
            </div>
          </div>

          <button class="full-agenda-btn" @click="goToFullCalendar">VER AGENDA COMPLETA</button>
        </aside>
      </div>
    </div>

    <EventModal v-if="showModal" :event="selectedEvent!" @close="showModal = false" />
  </section>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useCalendarEvents } from '@/composables/useCalendarEvents'
import type { CalendarEvent } from '@/types/EventType'
import Spinner from '@/components/Spinner.vue'
import EventModal from './EventModal.vue'
import DayEventsModal from './DayEventsModal.vue'

const { getEventsByMonth, isLoading } = useCalendarEvents()

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
  // Reset selected day state to prevent showing events from previous month
  selectedDay.value = null
  selectedDayEventsLocal.value = []
  showDayModal.value = false
}

const prevMonth = () => {
  if (currentMonth.value === 0) {
    currentMonth.value = 11
    currentYear.value = currentYear.value - 1
  } else {
    currentMonth.value = currentMonth.value - 1
  }
  // close picker and reset day selection
  showMonthPicker.value = false
  selectedDay.value = null
}

const nextMonth = () => {
  if (currentMonth.value === 11) {
    currentMonth.value = 0
    currentYear.value = currentYear.value + 1
  } else {
    currentMonth.value = currentMonth.value + 1
  }
  showMonthPicker.value = false
  selectedDay.value = null
}

const handleMiniCalendarClick = (month: number, event: MouseEvent) => {
  // Only change month if clicking on the mini-calendar header/container, not on a mini-day
  const target = event.target as HTMLElement
  if (!target.classList.contains('mini-day')) {
    selectMonth(month)
  }
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

const selectDayFromAnnual = (day: number, month: number) => {
  if (day !== 0) {
    // Change to the selected month first
    currentMonth.value = month
    selectedDay.value = day

    // Get events specifically from this month and day
    const eventsForThisDay = getEventsForDay(day, month)

    // Update selected day events
    selectedDayEventsLocal.value = eventsForThisDay

    // Always open modal when clicking on a day (even if empty to show feedback)
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

// Upcoming events for the sidebar (next 3 chronologically)
const upcomingList = computed(() => {
  const all = getEventsByMonth(currentYear.value, currentMonth.value)
  // flatten and sort by date/time
  const flattened: CalendarEvent[] = []
  all.forEach((arr) => arr.forEach((e) => flattened.push(e)))
  flattened.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  return flattened.slice(0, 3)
})

const formatDateFromString = (dateStr: string) => {
  const [year, month, day] = dateStr.split('-').map(Number)
  const d = new Date(year, month - 1, day)
  return d.toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric', month: 'short' })
}

const formatDayFromString = (dateStr: string) => {
  const [year, month, day] = dateStr.split('-').map(Number)
  const d = new Date(year, month - 1, day)
  return String(d.getDate()).padStart(2, '0')
}

const formatShortMonthFromString = (dateStr: string) => {
  const [year, month, day] = dateStr.split('-').map(Number)
  const d = new Date(year, month - 1, day)
  return d.toLocaleDateString('es-ES', { month: 'short' }).replace('.', '')
}

const goToFullCalendar = () => {
  // already on full calendar page; ensure user is there
  // If using a page anchor or different route, adapt here
  // For now, scroll to top of calendar
  const el = document.querySelector('.calendar-section') as HTMLElement | null
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
}
</script>

<style scoped>
.calendar-section {
  padding: 108px 0 64px 0;
  background: #f7f9fc;
  color: #0b2138;
}

.container {
  max-width: 1300px;
  margin: 0 auto;
}

.section-title {
  text-align: center;
  font-size: 2.25rem;
  margin-bottom: 1.25rem;
  color: #0f2246;
  font-weight: 900;
  letter-spacing: 1px;
}

.calendar-layout {
  display: grid;
  grid-template-columns: 1fr 340px;
  gap: 28px;
  align-items: start;
}

.calendar-main {
  display: block;
}

.calendar-card {
  background: #ffffff;
  border-radius: 22px;
  padding: 28px 28px 20px 28px;
  box-shadow: 0 8px 24px rgba(16, 32, 58, 0.06);
  border: 3px solid #0f2246;
  /* navy border like image */
}

.calendar-card-header {
  display: flex;
  justify-content: left;
  margin-bottom: 12px;
}

.month-pill-group {
  display: inline-flex;
  align-items: center;
  gap: 12px;
}

.pill-arrow-btn {
  background: transparent;
  border: 2px solid #0f2246;
  color: #0f2246;
  width: 44px;
  height: 44px;
  border-radius: 10px;
  font-size: 20px;
  font-weight: 800;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}

.month-pill {
  background: #fff;
  border-radius: 24px;
  padding: 12px 22px;
  border: 2px solid #0f2246;
  font-weight: 800;
  color: #0f2246;
  display: inline-flex;
  align-items: center;
  box-shadow: none;
}

.month-pill .pill-label {
  font-size: 0.95rem;
  letter-spacing: 0.6px;
}

/* View mode selector styling to ensure good contrast */
.calendar-wrapper.large {
  margin-top: 8px;
}

.view-mode-select-wrapper {
  position: relative;
  display: inline-flex;
  align-items: center;
}

.view-mode-label {
  font-weight: 800;
  color: #e6eefc;
}

.view-mode-select {
  padding: 0.55rem 2.2rem 0.55rem 0.85rem;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.06);
  background: rgba(255, 255, 255, 0.02);
  color: #e6eefc;
  font-weight: 700;
  cursor: pointer;
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  color-scheme: dark;
  min-width: 130px;
  line-height: 1.2;
}

.view-mode-select option {
  background: #051428;
  color: #e6eefc;
}

.view-mode-select:focus {
  outline: none;
  border-color: rgba(255, 209, 102, 0.35);
  box-shadow: 0 0 0 3px rgba(255, 209, 102, 0.12);
}

.view-mode-chevron {
  position: absolute;
  right: 0.8rem;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
  font-size: 0.72rem;
  color: #e6eefc;
  opacity: 0.9;
}

.calendar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}

.calendar-year {
  margin: 0;
  font-size: 1.3rem;
  font-weight: 800;
  color: #e6eefc;
}

.month-selector-btn {
  padding: 0.8rem 1.5rem;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.03), rgba(255, 255, 255, 0.02));
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 700;
  font-size: 1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.8rem;
  transition: all 0.3s ease;
}

.month-selector-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(2, 6, 23, 0.45);
}

.chevron {
  font-size: 0.8rem;
  transition: transform 0.3s ease;
}

.chevron.open {
  transform: rotate(180deg);
}

.month-picker {
  position: absolute;
  top: 100%;
  right: 1.5rem;
  background: rgba(2, 6, 23, 0.85);
  border-radius: 8px;
  padding: 1rem;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.5rem;
  margin-top: 0.5rem;
  box-shadow: 0 12px 30px rgba(2, 6, 23, 0.6);
  z-index: 100;
}

.month-option {
  padding: 0.8rem;
  border: 1px solid rgba(255, 255, 255, 0.04);
  background: transparent;
  border-radius: 6px;
  font-weight: 600;
  color: #e6eefc;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.9rem;
}

.month-option:hover {
  border-color: rgba(255, 209, 102, 0.18);
  background: rgba(255, 255, 255, 0.02);
}

.month-option.active {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.04), rgba(255, 255, 255, 0.02));
  color: #ffffff;
  border-color: rgba(255, 255, 255, 0.06);
}

.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  grid-auto-rows: 120px;
  gap: 12px;
}


.day-header {
  font-weight: 800;
  text-align: center;
  padding: 6px 8px;
  color: #0f2246;
  font-size: 0.9rem;
  text-transform: uppercase;
}


.calendar-day {
  background: #ffffff;
  border: 1px solid rgba(15, 34, 70, 0.08);
  border-radius: 8px;
  padding: 10px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  gap: 8px;
  cursor: pointer;
  box-sizing: border-box;
  position: relative;
}

.calendar-day.other-month {
  opacity: 0.45;
}

/* Highlight days that have events */
.calendar-day.has-events {
  border-color: rgba(255, 193, 7, 0.95);
  /* accent gold */
  box-shadow: 0 6px 18px rgba(255, 193, 7, 0.08);
}

.calendar-day.has-events::after {
  content: '';
  position: absolute;
  right: 8px;
  bottom: 8px;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: linear-gradient(90deg, rgba(255, 193, 7, 1), rgba(34, 38, 93, 0.9));
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.12);
}

/* Highlight today's date */
.calendar-day.today {
  border-color: rgba(15, 34, 70, 0.08);
}

.calendar-day.today .day-number {
  display: inline-flex;
  align-items: center;
  justify-content: left;
  width: 32px;
  height: 30px;
  padding: 0 8px;
  border-radius: 999px;
  background: var(--brand-blue, #0f2246);
  color: #fff;
}


.day-number {
  font-weight: 800;
  color: #0f2246;
  font-size: 0.95rem;
}

.day-events {
  display: flex;
  gap: 0.3rem;
  flex-wrap: wrap;
  justify-content: center;
}

.day-events {
  display: flex;
  gap: 0.25rem;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  min-height: 10px;
  margin-top: auto;
  padding-bottom: 2px;
}

.event-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  flex: 0 0 auto;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.18);
}

.calendar-day.today .event-dot {
  box-shadow: 0 1px 3px rgba(15, 34, 70, 0.25);
}

.mini-day {
  aspect-ratio: 1;
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.03);
  border-radius: 4px;
  font-size: 0.6rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.mini-day.has-events {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.03), rgba(255, 255, 255, 0.02));
  border-color: rgba(255, 255, 255, 0.06);
}

.mini-day.other {
  background: rgba(255, 255, 255, 0.01);
  border-color: rgba(255, 255, 255, 0.02);
}

/* Annual View */
.calendar-aside {
  position: relative;
}

.aside-cards {
  display: flex;
  flex-direction: column;
  gap: 14px;
  margin-bottom: 18px;
}

.aside-card {
  display: flex;
  gap: 14px;
  align-items: center;
  background: #ffffff;
  border-radius: 12px;
  padding: 14px;
  box-shadow: 0 6px 18px rgba(16, 32, 58, 0.06);
  border: 1px solid rgba(15, 34, 70, 0.06);
}

.aside-date-badge {
  width: 58px;
  min-width: 58px;
  height: 58px;
  border-radius: 14px;
  background: linear-gradient(180deg, #0f2246 0%, #1e3a72 100%);
  color: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  line-height: 1;
  box-shadow: 0 8px 18px rgba(15, 34, 70, 0.16);
}

.aside-date-day {
  font-size: 1.05rem;
  font-weight: 900;
}

.aside-date-month {
  margin-top: 2px;
  font-size: 0.68rem;
  font-weight: 800;
  text-transform: uppercase;
  opacity: 0.9;
}

.aside-icon {
  width: 56px;
  height: 56px;
  border-radius: 12px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.aside-body {
  display: flex;
  flex-direction: column;
}

.aside-title {
  font-weight: 800;
  color: #0f2246;
}

.aside-meta,
.aside-location {
  font-size: 13px;
  color: #50677f;
}

.full-agenda-btn {
  width: 100%;
  padding: 12px 16px;
  border-radius: 10px;
  border: 2px solid #0f2246;
  background: transparent;
  color: #0f2246;
  font-weight: 800;
  cursor: pointer;
}

.annual-title {
  text-align: center;
  font-size: 1.8rem;
  margin: 0 0 2rem 0;
  color: #e6eefc;
  font-weight: 800;
}

.mini-calendars {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
}

.mini-calendar {
  background: rgba(255, 255, 255, 0.02);
  border-radius: 12px;
  padding: 1rem;
  border: 1px solid rgba(255, 255, 255, 0.03);
  cursor: pointer;
  transition: all 0.3s ease;
}

.mini-calendar:hover {
  border-color: rgba(255, 255, 255, 0.06);
  background: rgba(255, 255, 255, 0.03);
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(2, 6, 23, 0.35);
}

.mini-month-name {
  margin: 0 0 1rem 0;
  text-align: center;
  font-size: 0.95rem;
  font-weight: 800;
  color: #e6eefc;
}

.mini-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 0.3rem;
}

.mini-day-header {
  text-align: center;
  font-size: 0.65rem;
  font-weight: 700;
  color: #999;
  padding: 0.3rem;
}

.mini-day {
  aspect-ratio: 1;
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.03);
  border-radius: 4px;
  font-size: 0.6rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.6rem;
}

.mini-day.has-events {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.03), rgba(255, 255, 255, 0.02));
  border-color: rgba(255, 255, 255, 0.06);
}

.mini-day.other {
  background: rgba(255, 255, 255, 0.01);
  border-color: rgba(255, 255, 255, 0.02);
}

/* Selected Day Events */
.selected-day-events {
  background: rgba(2, 6, 23, 0.7);
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 12px 40px rgba(2, 6, 23, 0.45);
  border: 1px solid rgba(255, 255, 255, 0.03);
}

.events-title {
  margin: 0 0 1.5rem 0;
  font-size: 1.5rem;
  font-weight: 800;
  color: #e6eefc;
}

.events-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}

.event-preview {
  background: rgba(255, 255, 255, 0.03);
  border-radius: 12px;
  padding: 1.2rem;
  line-height: 1.1;
  border-left: 4px solid rgba(255, 209, 102, 0.18);
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.event-preview:hover {
  transform: translateY(-6px);
  box-shadow: 0 12px 32px rgba(2, 6, 23, 0.45);
}

.event-preview-header {
  display: flex;
  justify-content: space-between;
  align-items: start;
  margin-bottom: 0.8rem;
  gap: 1rem;
}

.event-preview-title {
  margin: 0;
  font-size: 1.1rem;
  font-weight: 800;
  color: #e6eefc;
}

.event-preview-badge {
  padding: 0.4rem 0.8rem;
  border-radius: 6px;
  color: white;
  font-size: 0.7rem;
  font-weight: 700;
  white-space: nowrap;
}

.event-preview-meta {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  margin-bottom: 0.8rem;
}

.meta {
  font-size: 0.85rem;
  color: #cbd5e1;
}

.event-preview-desc {
  margin: 0;
  font-size: 0.85rem;
  color: #c7d2e9;
  line-height: 1.4;
}

@media (max-width: 900px) {
  .calendar-layout {
    grid-template-columns: 1fr;
  }

  .calendar-wrapper {
    padding: 1rem;
  }

  .calendar-card {
    padding: 20px 18px 16px;
    border-radius: 18px;
  }

  .calendar-card-header {
    justify-content: center;
  }

  .calendar-grid {
    gap: 0.3rem;
  }

  .calendar-aside {
    width: 100%;
  }

  .calendar-day {
    padding: 0.4rem;
    font-size: 0.85rem;
  }

  .day-number {
    font-size: 0.8rem;
  }

  .mini-calendars {
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  }
}

@media (max-width: 600px) {
  .calendar-section {
    padding: calc(70px + env(safe-area-inset-top) + 1rem) 0 2.25rem;
  }

  .container {
    overflow-x: hidden;
  }

  .section-title {
    font-size: 1.6rem;
    margin-bottom: 1rem;
  }

  .calendar-header {
    flex-direction: column;
  }

  .month-pill-group {
    width: 100%;
    justify-content: space-between;
    gap: 8px;
  }

  .pill-arrow-btn {
    width: 40px;
    height: 40px;
    border-radius: 12px;
  }

  .month-pill {
    flex: 1;
    justify-content: center;
    padding: 10px 14px;
  }

  .month-pill .pill-label {
    font-size: 0.82rem;
    letter-spacing: 0.3px;
  }

  .calendar-card {
    padding: 16px 14px 14px;
    overflow: hidden;
  }

  .calendar-grid {
    gap: 0.25rem;
    grid-template-rows: auto repeat(6, minmax(64px, 1fr));
    grid-auto-rows: minmax(64px, 1fr);
    grid-template-columns: repeat(7, minmax(0, 1fr));
    width: 100%;
    min-width: 0;
  }

  .calendar-day {
    padding: 0.3rem;
    font-size: 0.75rem;
    height: 100%;
    min-width: 0;
    overflow: hidden;
  }

  .day-header {
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .day-number {
    font-size: 0.7rem;
  }

  .mini-calendars {
    grid-template-columns: 1fr;
  }

  .events-grid {
    grid-template-columns: 1fr;
  }
}

/* Mobile-specific: improve compactness and prevent overflow */
@media (max-width: 480px) {
  .container {
    padding: 0 12px;
  }

  .calendar-controls {
    padding: 10px;
    border-radius: 12px;
  }

  .month-selector-btn {
    width: 100%;
    justify-content: space-between;
  }

  .month-picker {
    position: static;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 0.4rem;
    margin-top: 0.6rem;
    padding: 0.6rem;
    background: rgba(2, 6, 23, 0.85);
    border-radius: 8px;
    right: auto;
  }

  /* Reduce row heights so calendar fits vertically */
  .calendar-grid {
    grid-template-rows: auto repeat(6, 52px);
    gap: 0.18rem;
  }

  /* Allow days to grow vertically but remove fixed aspect ratio */
  .calendar-day {
    aspect-ratio: auto;
    height: 100%;
    width: 100%;
    min-width: 0;
    padding: 0.28rem 0.28rem;
    align-items: flex-start;
    justify-content: flex-start;
  }

  .day-header {
    font-size: 0.7rem;
    padding: 0.35rem 0.2rem 0.45rem;
  }

  /* Make selected-day events and previews stack nicely */
  .events-grid {
    grid-template-columns: 1fr;
  }

  .calendar-wrapper {
    padding: 0.55rem;
    overflow: hidden;
  }

  .calendar-card {
    padding: 14px 10px 12px;
  }

  .aside-cards {
    gap: 10px;
  }

  .aside-card {
    padding: 12px;
    gap: 12px;
  }

  .aside-date-badge {
    width: 50px;
    min-width: 50px;
    height: 50px;
    border-radius: 12px;
  }

  .aside-title {
    font-size: 0.95rem;
  }

  .aside-meta,
  .aside-location {
    font-size: 12px;
  }

  .full-agenda-btn {
    padding: 10px 12px;
    font-size: 0.84rem;
  }

  .calendar-aside,
  .aside-card,
  .aside-body {
    min-width: 0;
  }
}

/* Annual view: show small centered dots inside mini days to indicate events */
.annual-view .mini-day {
  position: relative;
  cursor: default;
  transition: all 0.2s ease;
  border: 1px solid rgba(255, 255, 255, 0.03);
  border-radius: 4px;
  aspect-ratio: 1;
  background: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
}

.annual-view .mini-day.has-events {
  cursor: pointer;
  border-color: rgba(255, 209, 102, 0.2);
}

.annual-view .mini-day.has-events:hover {
  border-color: rgba(255, 209, 102, 0.5);
  background: rgba(255, 209, 102, 0.12);
  transform: scale(1.12);
}

.annual-view .mini-day.has-events:active {
  transform: scale(0.98);
}

.annual-view .mini-day.has-events::after {
  content: '';
  position: absolute;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  background: linear-gradient(90deg, rgba(255, 209, 102, 1), rgba(255, 255, 255, 0.6));
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.25);
}
</style>
