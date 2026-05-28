import { ref, computed } from 'vue'
import { eventService } from '@/services/api'
import type { Event, CreateEventRequest } from '@/types/EventType'

const parseBackendDateTime = (value: Date | string): Date => {
  const raw = typeof value === 'string' ? value : value.toISOString()
  const [datePart, timePart = '00:00:00'] = raw.split('T')
  const [year, month, day] = datePart.split('-').map(Number)
  const timeMatch = timePart.match(/^(\d{2}):(\d{2})(?::(\d{2}))?/)

  const hour = timeMatch ? Number(timeMatch[1]) : 0
  const minute = timeMatch ? Number(timeMatch[2]) : 0
  const second = timeMatch?.[3] ? Number(timeMatch[3]) : 0

  return new Date(year, month - 1, day, hour, minute, second)
}

const normalizeEvent = (event: Event): Event => ({
  ...event,
  id: String(event.id),
  startDate: event.startDate,
  endDate: event.endDate,
  createdAt: event.createdAt,
  updatedAt: event.updatedAt,
})

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

const events = ref<Event[]>([])
const isLoading = ref(false)
const error = ref('')
let loadPromise: Promise<void> | null = null

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

const startOfDay = (date: Date) => {
  const normalized = new Date(date)
  normalized.setHours(0, 0, 0, 0)
  return normalized
}

const getEventDay = (value: Date | string | null | undefined) => {
  const parsed = value ? parseBackendDateTime(value) : null
  return parsed ? startOfDay(parsed) : null
}

export function useEvents() {
  const loadEvents = async () => {
    if (loadPromise) {
      return loadPromise
    }

    try {
      isLoading.value = true
      loadPromise = eventService
        .getEvents()
        .then(async (response) => {
          events.value = extractEventsList(response.data).map(normalizeEvent)
          error.value = ''

          await wait(1000)
        })
        .catch((e) => {
          error.value = 'Error cargando eventos'
          console.error('Error loading events:', e)
        })
        .finally(() => {
          isLoading.value = false
          loadPromise = null
        })

      return loadPromise
    } catch (e) {
      error.value = 'Error cargando eventos'
      console.error('Error loading events:', e)
    } finally {
      isLoading.value = false
    }
  }

  const addEvent = async (eventData: CreateEventRequest) => {
    try {
      const response = await eventService.createEvent(eventData)
      const newEvent = normalizeEvent(response.data)
      events.value.push(newEvent)
      console.log('✅ Evento agregado:', newEvent)
      return newEvent
    } catch (e) {
      error.value = 'Error agregando evento'
      console.error('Error adding event:', e)
      throw e
    }
  }

  const updateEvent = async (id: string, eventData: Partial<CreateEventRequest>) => {
    try {
      const response = await eventService.updateEvent(id, eventData)
      const updatedEvent = normalizeEvent(response.data)
      const index = events.value.findIndex((event) => String(event.id) === String(id))
      if (index !== -1) {
        events.value[index] = updatedEvent
      }
      console.log('✅ Evento actualizado:', updatedEvent)
    } catch (e) {
      error.value = 'Error actualizando evento'
      console.error('Error updating event:', e)
      throw e
    }
  }

  const deleteEvent = async (id: string) => {
    try {
      await eventService.deleteEvent(id)
      const index = events.value.findIndex((event) => String(event.id) === String(id))
      if (index !== -1) {
        events.value.splice(index, 1)
      }
      console.log('✅ Evento eliminado')
    } catch (e) {
      error.value = 'Error eliminando evento'
      console.error('Error deleting event:', e)
      throw e
    }
  }

  // Get event by ID
  const getEventById = (id: string) => {
    return events.value.find((e) => String(e.id) === String(id))
  }

  // Computed properties
  const upcomingEvents = computed(() => {
    const today = startOfDay(new Date())
    return events.value
      .filter((e) => {
        const eventDay = getEventDay(e.startDate)
        return eventDay !== null && eventDay > today
      })
      .sort(
        (a, b) =>
          parseBackendDateTime(a.startDate).getTime() - parseBackendDateTime(b.startDate).getTime(),
      )
  })

  const ongoingEvents = computed(() => {
    const today = startOfDay(new Date())

    return events.value.filter((e) => {
      const eventDay = getEventDay(e.startDate)
      return eventDay !== null && eventDay.getTime() === today.getTime()
    })
  })

  const pastEvents = computed(() => {
    const today = startOfDay(new Date())
    return events.value
      .filter((e) => {
        const eventDay = getEventDay(e.startDate)
        return eventDay !== null && eventDay < today
      })
      .sort(
        (a, b) =>
          parseBackendDateTime(b.endDate).getTime() - parseBackendDateTime(a.endDate).getTime(),
      )
  })

  const eventsByStatus = computed(() => {
    return {
      scheduled: events.value.filter((e) => e.status === 'scheduled').length,
      ongoing: events.value.filter((e) => e.status === 'ongoing').length,
      completed: events.value.filter((e) => e.status === 'completed').length,
      cancelled: events.value.filter((e) => e.status === 'cancelled').length,
    }
  })

  const eventsByCategory = computed(() => {
    const categories: Record<string, number> = {}
    events.value.forEach((e) => {
      const cat = e.category || 'Otro'
      categories[cat] = (categories[cat] || 0) + 1
    })
    return categories
  })

  return {
    events,
    isLoading,
    error,
    loadEvents,
    addEvent,
    updateEvent,
    deleteEvent,
    getEventById,
    upcomingEvents,
    ongoingEvents,
    pastEvents,
    eventsByStatus,
    eventsByCategory,
  }
}
