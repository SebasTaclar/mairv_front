import { ref } from 'vue'
import { eventService } from '@/services/api'
import type { CalendarEvent, EventsResponse, Event, CreateEventRequest } from '@/types/EventType'

const parseLocalDate = (dateStr: string): Date => {
  const [year, month, day] = dateStr.split('-').map(Number)
  return new Date(year, month - 1, day)
}

const parseBackendDateTime = (value: Date | string | null | undefined) => {
  if (!value) {
    return null
  }

  const raw = typeof value === 'string' ? value : value.toISOString()
  const [datePart, timePart = '00:00:00'] = raw.split('T')
  const [year, month, day] = datePart.split('-').map(Number)
  const timeMatch = timePart.match(/^(\d{2}):(\d{2})(?::(\d{2}))?/)

  const hour = timeMatch ? Number(timeMatch[1]) : 0
  const minute = timeMatch ? Number(timeMatch[2]) : 0
  const second = timeMatch?.[3] ? Number(timeMatch[3]) : 0

  const parsedDate = new Date(year, month - 1, day, hour, minute, second)

  return Number.isNaN(parsedDate.getTime()) ? null : parsedDate
}

const formatBackendDateTime = (value: Date | string | null | undefined) => {
  if (!value) return ''

  const date = typeof value === 'string' ? parseBackendDateTime(value) : value

  if (!date) return ''

  return (
    [
      date.getFullYear(),
      String(date.getMonth() + 1).padStart(2, '0'),
      String(date.getDate()).padStart(2, '0'),
    ].join('-') +
    `T${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}:${String(date.getSeconds()).padStart(2, '0')}`
  )
}

const events = ref<CalendarEvent[]>([])
const selectedEvent = ref<CalendarEvent | null>(null)
const isLoading = ref(false)
let loadPromise: Promise<CalendarEvent[]> | null = null

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

const toLocalDateParts = (value: Date | string | null | undefined) => {
  const date = parseBackendDateTime(value)
  if (!date) return null

  return {
    year: date.getFullYear(),
    month: String(date.getMonth() + 1).padStart(2, '0'),
    day: String(date.getDate()).padStart(2, '0'),
  }
}

const toLocalTime = (value: Date | string | null | undefined) => {
  if (!value) return ''

  const raw = typeof value === 'string' ? value : value.toISOString()
  const timePart = raw.split('T')[1] || ''
  const match = timePart.match(/^(\d{2}):(\d{2})/)

  return match ? `${match[1]}:${match[2]}` : ''
}

const toCalendarEvent = (event: Event): CalendarEvent => {
  const startDate = parseBackendDateTime(event.startDate)
  const endDate = parseBackendDateTime(event.endDate)

  if (!startDate) {
    throw new Error(`Event ${event.id} is missing a valid startDate`)
  }

  const startDateParts = toLocalDateParts(event.startDate)

  if (!startDateParts) {
    throw new Error(`Event ${event.id} is missing a valid startDate`)
  }

  const { year, month, day } = startDateParts

  return {
    id: String(event.id),
    name: event.title,
    date: `${year}-${month}-${day}`,
    startTime: toLocalTime(event.startDate),
    endTime: event.endDate ? toLocalTime(event.endDate) : undefined,
    duration: endDate
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
    : formatBackendDateTime(
        new Date(parseBackendDateTime(startDate).getTime() + (event.duration || 60) * 60000),
      )

  return {
    title: event.name,
    description: event.description,
    startDate,
    endDate: event.endTime ? calculatedEndDate : calculatedEndDate,
    location: event.location,
    category: event.category,
    attachments: event.attachments,
    status: 'scheduled',
    maxAttendees: event.capacity,
    organizers: event.directors
      ? event.directors
          .split(',')
          .map((item) => item.trim())
          .filter(Boolean)
      : [event.createdBy].filter(Boolean),
    tags: [],
  }
}

export function useCalendarEvents() {
  const extractEventsList = (payload: unknown): Event[] => {
    if (Array.isArray(payload)) {
      return payload as Event[]
    }

    if (payload && typeof payload === 'object' && 'events' in payload) {
      const events = (payload as { events?: unknown }).events
      return Array.isArray(events) ? (events as Event[]) : []
    }

    return []
  }

  const loadEvents = async () => {
    if (loadPromise) {
      return loadPromise
    }

    try {
      isLoading.value = true
      loadPromise = eventService
        .getEvents()
        .then(async (response) => {
          events.value = extractEventsList(response.data)
            .map((event) => {
              try {
                return toCalendarEvent(event)
              } catch (error) {
                console.warn('Skipping malformed calendar event:', error)
                return null
              }
            })
            .filter((event): event is CalendarEvent => event !== null)
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
    const currentEvent = events.value.find((event) => String(event.id) === String(id))
    if (!currentEvent) {
      throw new Error('Evento no encontrado')
    }

    const mergedEvent = { ...currentEvent, ...updates }
    const response = await eventService.updateEvent(id, fromCalendarEvent(mergedEvent))
    const updatedEvent = toCalendarEvent(response.data)

    const index = events.value.findIndex((event) => String(event.id) === String(id))
    if (index !== -1) {
      events.value[index] = updatedEvent
      console.log('✅ Evento actualizado:', updatedEvent)
    }
  }

  const deleteEvent = async (id: string): Promise<void> => {
    await eventService.deleteEvent(id)
    const index = events.value.findIndex((event) => String(event.id) === String(id))
    if (index !== -1) {
      events.value.splice(index, 1)
      console.log('✅ Evento eliminado')
    }
  }

  // Obtener evento por ID
  const getEventById = (id: string): CalendarEvent | undefined => {
    return events.value.find((e) => String(e.id) === String(id))
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
