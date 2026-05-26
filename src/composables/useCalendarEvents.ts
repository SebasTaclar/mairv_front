import { ref } from 'vue'
import { eventService } from '@/services/api'
import type { CalendarEvent, EventsResponse, Event, CreateEventRequest } from '@/types/EventType'

const parseLocalDate = (dateStr: string): Date => {
  const [year, month, day] = dateStr.split('-').map(Number)
  return new Date(year, month - 1, day)
}

const events = ref<CalendarEvent[]>([])
const selectedEvent = ref<CalendarEvent | null>(null)
const isLoading = ref(false)
let loadPromise: Promise<CalendarEvent[]> | null = null

const toLocalDateParts = (value: Date | string) => {
  const date = new Date(value)
  return {
    year: date.getFullYear(),
    month: String(date.getMonth() + 1).padStart(2, '0'),
    day: String(date.getDate()).padStart(2, '0'),
  }
}

const toLocalTime = (value: Date | string) => {
  const date = new Date(value)
  return date.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit', hour12: false })
}

const toCalendarEvent = (event: Event): CalendarEvent => {
  const startDate = new Date(event.startDate)
  const endDate = new Date(event.endDate)
  const { year, month, day } = toLocalDateParts(startDate)

  return {
    id: event.id,
    name: event.title,
    date: `${year}-${month}-${day}`,
    startTime: toLocalTime(startDate),
    endTime: event.endDate ? toLocalTime(endDate) : undefined,
    duration: event.endDate
      ? Math.max(0, Math.round((endDate.getTime() - startDate.getTime()) / 60000))
      : undefined,
    createdBy: event.organizers?.[0] || 'Sistema',
    directors: event.organizers?.join(', '),
    description: event.description,
    attachments: event.attachments,
    location: event.location,
    category: event.category || 'otro',
    capacity: event.maxAttendees,
    registeredCount: event.currentAttendees,
  }
}

const fromCalendarEvent = (event: Omit<CalendarEvent, 'id'>): CreateEventRequest => {
  const startDate = event.startTime
    ? `${event.date}T${event.startTime}:00`
    : `${event.date}T00:00:00`

  const calculatedEndDate = event.endTime
    ? `${event.date}T${event.endTime}:00`
    : new Date(new Date(startDate).getTime() + (event.duration || 60) * 60000).toISOString()

  return {
    title: event.name,
    description: event.description,
    startDate: new Date(startDate).toISOString(),
    endDate: event.endTime ? new Date(calculatedEndDate).toISOString() : calculatedEndDate,
    location: event.location,
    category: event.category,
    attachments: event.attachments,
    status: 'scheduled',
    maxAttendees: event.capacity,
    organizers: event.directors
      ? event.directors.split(',').map((item) => item.trim()).filter(Boolean)
      : [event.createdBy].filter(Boolean),
    tags: [],
  }
}

export function useCalendarEvents() {
  const loadEvents = async () => {
    if (loadPromise) {
      return loadPromise
    }

    try {
      isLoading.value = true
      loadPromise = eventService
        .getEvents()
        .then((response) => {
          events.value = response.data.map(toCalendarEvent)
          return events.value
        })
        .catch((error) => {
          console.error('Error loading calendar events:', error)
          events.value = []
          return events.value
        })
        .finally(() => {
          isLoading.value = false
          loadPromise = null
        })

      return loadPromise
    } catch (error) {
      console.error('Error loading calendar events:', error)
      isLoading.value = false
      events.value = []
      return events.value
    } finally {
      isLoading.value = false
    }
  }

  void loadEvents()

  // Obtener eventos recientes (últimos 2) y próximos (próximos 2)
  const getRecentAndUpcoming = (): EventsResponse => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const sorted = [...events.value].sort(
      (a, b) => parseLocalDate(a.date).getTime() - parseLocalDate(b.date).getTime(),
    )

    const recent = sorted
      .filter((e) => parseLocalDate(e.date) < today)
      .reverse()
      .slice(0, 2)

    const upcoming = sorted.filter((e) => parseLocalDate(e.date) >= today).slice(0, 2)

    return {
      recent,
      upcoming,
      all: events.value,
    }
  }

  // Obtener eventos de un mes específico
  const getEventsByMonth = (year: number, month: number): Map<number, CalendarEvent[]> => {
    const eventsByDay = new Map<number, CalendarEvent[]>()

    events.value.forEach((event) => {
      const eventDate = parseLocalDate(event.date)
      if (eventDate.getFullYear() === year && eventDate.getMonth() === month) {
        const day = eventDate.getDate()
        if (!eventsByDay.has(day)) {
          eventsByDay.set(day, [])
        }
        eventsByDay.get(day)!.push(event)
      }
    })

    return eventsByDay
  }

  // Obtener eventos de un día específico
  const getEventsByDate = (dateStr: string): CalendarEvent[] => {
    return events.value.filter((e) => e.date === dateStr)
  }

  // Obtener eventos del año
  const getEventsByYear = (year: number): CalendarEvent[] => {
    return events.value.filter((event) => {
      const eventDate = parseLocalDate(event.date)
      return eventDate.getFullYear() === year
    })
  }

  // Crear evento (simulado)
  const createEvent = async (event: Omit<CalendarEvent, 'id'>): Promise<CalendarEvent> => {
    const response = await eventService.createEvent(fromCalendarEvent(event))
    const newEvent = toCalendarEvent(response.data)
    events.value.push(newEvent)
    console.log('✅ Evento creado:', newEvent)
    return newEvent
  }

  const updateEvent = async (id: string, updates: Partial<CalendarEvent>): Promise<void> => {
    const currentEvent = events.value.find((event) => event.id === id)
    if (!currentEvent) {
      throw new Error('Evento no encontrado')
    }

    const mergedEvent = { ...currentEvent, ...updates }
    const response = await eventService.updateEvent(id, fromCalendarEvent(mergedEvent))
    const updatedEvent = toCalendarEvent(response.data)

    const index = events.value.findIndex((event) => event.id === id)
    if (index !== -1) {
      events.value[index] = updatedEvent
      console.log('✅ Evento actualizado:', updatedEvent)
    }
  }

  const deleteEvent = async (id: string): Promise<void> => {
    await eventService.deleteEvent(id)
    const index = events.value.findIndex((event) => event.id === id)
    if (index !== -1) {
      events.value.splice(index, 1)
      console.log('✅ Evento eliminado')
    }
  }

  // Obtener evento por ID
  const getEventById = (id: string): CalendarEvent | undefined => {
    return events.value.find((e) => e.id === id)
  }

  // Buscar eventos
  const searchEvents = (query: string): CalendarEvent[] => {
    const lowerQuery = query.toLowerCase()
    return events.value.filter(
      (e) =>
        e.name.toLowerCase().includes(lowerQuery) ||
        e.description?.toLowerCase().includes(lowerQuery) ||
        e.location?.toLowerCase().includes(lowerQuery) ||
        e.createdBy.toLowerCase().includes(lowerQuery) ||
        e.directors?.toLowerCase().includes(lowerQuery),
    )
  }

  // Formatear nombre del mes
  const getMonthName = (month: number): string => {
    const months = [
      'Enero',
      'Febrero',
      'Marzo',
      'Abril',
      'Mayo',
      'Junio',
      'Julio',
      'Agosto',
      'Septiembre',
      'Octubre',
      'Noviembre',
      'Diciembre',
    ]
    return months[month]
  }

  return {
    events,
    selectedEvent,
    isLoading,
    loadEvents,
    getRecentAndUpcoming,
    getEventsByMonth,
    getEventsByDate,
    getEventsByYear,
    createEvent,
    updateEvent,
    deleteEvent,
    getEventById,
    searchEvents,
    getMonthName,
  }
}
