import { ref, computed } from 'vue'
import { eventService } from '@/services/api'
import type { Event, CreateEventRequest } from '@/types/EventType'

const normalizeEvent = (event: Event): Event => ({
  ...event,
  id: String(event.id),
  startDate: new Date(event.startDate),
  endDate: new Date(event.endDate),
  createdAt: event.createdAt ? new Date(event.createdAt) : undefined,
  updatedAt: event.updatedAt ? new Date(event.updatedAt) : undefined,
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

export function useEvents() {
  const loadEvents = async () => {
    if (loadPromise) {
      return loadPromise
    }

    try {
      isLoading.value = true
      loadPromise = eventService
        .getEvents()
        .then((response) => {
          events.value = extractEventsList(response.data).map(normalizeEvent)
          error.value = ''
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
    const now = new Date()
    return events.value
      .filter((e) => new Date(e.startDate) > now && e.status !== 'cancelled')
      .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
  })

  const pastEvents = computed(() => {
    const now = new Date()
    return events.value
      .filter((e) => new Date(e.endDate) < now || e.status === 'completed')
      .sort((a, b) => new Date(b.endDate).getTime() - new Date(a.endDate).getTime())
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
    pastEvents,
    eventsByStatus,
    eventsByCategory,
  }
}
