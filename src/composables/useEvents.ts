import { ref, computed } from 'vue'
import type { Event, CreateEventRequest, UpdateEventRequest } from '@/types/EventType'

// Storage key
const EVENTS_KEY = 'admin_events'

export function useEvents() {
  const events = ref<Event[]>([])
  const isLoading = ref(false)
  const error = ref('')

  // Load events from localStorage
  const loadEvents = () => {
    try {
      isLoading.value = true
      const stored = localStorage.getItem(EVENTS_KEY)
      if (stored) {
        events.value = JSON.parse(stored).map((e: any) => ({
          ...e,
          startDate: new Date(e.startDate),
          endDate: new Date(e.endDate),
          createdAt: new Date(e.createdAt || Date.now()),
          updatedAt: new Date(e.updatedAt || Date.now()),
        }))
      } else {
        events.value = []
      }
      error.value = ''
    } catch (e) {
      error.value = 'Error cargando eventos'
      console.error('Error loading events:', e)
    } finally {
      isLoading.value = false
    }
  }

  // Save events to localStorage
  const saveEvents = () => {
    try {
      localStorage.setItem(EVENTS_KEY, JSON.stringify(events.value))
      console.log('✅ Eventos guardados en localStorage')
    } catch (e) {
      error.value = 'Error guardando eventos'
      console.error('Error saving events:', e)
    }
  }

  // Add event
  const addEvent = (eventData: CreateEventRequest) => {
    try {
      const newEvent: Event = {
        id: Date.now().toString(),
        title: eventData.title,
        description: eventData.description || '',
        startDate: eventData.startDate,
        endDate: eventData.endDate,
        location: eventData.location || '',
        category: eventData.category || 'Otro',
        images: eventData.images || [],
        status: eventData.status || 'scheduled',
        maxAttendees: eventData.maxAttendees,
        currentAttendees: 0,
        organizer: eventData.organizer || '',
        tags: eventData.tags || [],
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      events.value.push(newEvent)
      saveEvents()
      console.log('✅ Evento agregado:', newEvent)
      return newEvent
    } catch (e) {
      error.value = 'Error agregando evento'
      console.error('Error adding event:', e)
      throw e
    }
  }

  // Update event
  const updateEvent = (id: string, eventData: Partial<CreateEventRequest>) => {
    try {
      const index = events.value.findIndex((e) => e.id === id)
      if (index === -1) {
        throw new Error('Evento no encontrado')
      }

      events.value[index] = {
        ...events.value[index],
        ...eventData,
        id,
        updatedAt: new Date(),
      }
      saveEvents()
      console.log('✅ Evento actualizado:', events.value[index])
    } catch (e) {
      error.value = 'Error actualizando evento'
      console.error('Error updating event:', e)
      throw e
    }
  }

  // Delete event
  const deleteEvent = (id: string) => {
    try {
      const index = events.value.findIndex((e) => e.id === id)
      if (index === -1) {
        throw new Error('Evento no encontrado')
      }
      events.value.splice(index, 1)
      saveEvents()
      console.log('✅ Evento eliminado')
    } catch (e) {
      error.value = 'Error eliminando evento'
      console.error('Error deleting event:', e)
      throw e
    }
  }

  // Get event by ID
  const getEventById = (id: string) => {
    return events.value.find((e) => e.id === id)
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
