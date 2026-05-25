import { ref, computed } from 'vue'
import type { Event, CreateEventRequest } from '@/types/EventType'

// Storage key
const EVENTS_KEY = 'admin_events'

type StoredEvent = Omit<
  Partial<Event>,
  'id' | 'attachments' | 'organizers' | 'startDate' | 'endDate' | 'createdAt' | 'updatedAt'
> & {
  id?: unknown
  attachments?: unknown[]
  images?: unknown[]
  organizers?: unknown[]
  organizer?: unknown
  startDate?: string | Date
  endDate?: string | Date
  createdAt?: string | Date
  updatedAt?: string | Date
}

const isRecord = (value: unknown): value is Record<string, unknown> => {
  return typeof value === 'object' && value !== null
}

const normalizeAttachments = (event: StoredEvent) => {
  if (Array.isArray(event.attachments)) {
    return event.attachments
      .filter(
        (attachment): attachment is { id?: unknown; title?: unknown; url: string } =>
          isRecord(attachment) &&
          typeof attachment.url === 'string' &&
          attachment.url.trim().length > 0,
      )
      .map((attachment, index: number) => ({
        id:
          typeof attachment.id === 'string' && attachment.id.trim().length > 0
            ? attachment.id
            : `${Date.now()}-${index}`,
        title:
          typeof attachment.title === 'string' && attachment.title.trim().length > 0
            ? attachment.title
            : `Adjunto ${index + 1}`,
        url: attachment.url.trim(),
      }))
  }

  if (Array.isArray(event.images)) {
    return event.images
      .filter((url): url is string => typeof url === 'string' && url.trim().length > 0)
      .map((url: string, index: number) => ({
        id: `${Date.now()}-${index}`,
        title: `Adjunto ${index + 1}`,
        url: url.trim(),
      }))
  }

  return []
}

const normalizeOrganizers = (event: StoredEvent) => {
  if (Array.isArray(event.organizers)) {
    return event.organizers
      .filter(
        (organizer): organizer is string =>
          typeof organizer === 'string' && organizer.trim().length > 0,
      )
      .map((organizer) => organizer.trim())
  }

  if (typeof event.organizer === 'string' && event.organizer.trim()) {
    return [event.organizer.trim()]
  }

  return []
}

const normalizeEvent = (event: StoredEvent): Event => {
  const id =
    typeof event.id === 'string' && event.id.trim().length > 0 ? event.id : Date.now().toString()

  return {
    id,
    title: typeof event.title === 'string' ? event.title : '',
    description: typeof event.description === 'string' ? event.description : '',
    startDate: new Date(event.startDate || Date.now()),
    endDate: new Date(event.endDate || Date.now()),
    location: typeof event.location === 'string' ? event.location : '',
    category: typeof event.category === 'string' ? event.category : 'Otro',
    attachments: normalizeAttachments(event),
    status:
      event.status === 'ongoing' || event.status === 'completed' || event.status === 'cancelled'
        ? event.status
        : 'scheduled',
    maxAttendees: typeof event.maxAttendees === 'number' ? event.maxAttendees : undefined,
    currentAttendees: typeof event.currentAttendees === 'number' ? event.currentAttendees : 0,
    organizers: normalizeOrganizers(event),
    tags: Array.isArray(event.tags)
      ? event.tags.filter((tag): tag is string => typeof tag === 'string')
      : [],
    createdAt: new Date(event.createdAt || Date.now()),
    updatedAt: new Date(event.updatedAt || Date.now()),
  }
}

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
        events.value = JSON.parse(stored).map(normalizeEvent)
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
        attachments: eventData.attachments || [],
        status: eventData.status || 'scheduled',
        maxAttendees: eventData.maxAttendees,
        currentAttendees: 0,
        organizers: eventData.organizers || [],
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
