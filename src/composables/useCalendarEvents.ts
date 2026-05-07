import { ref, computed } from 'vue'
import type { CalendarEvent, EventsResponse } from '@/types/EventType'

const parseLocalDate = (dateStr: string): Date => {
  const [year, month, day] = dateStr.split('-').map(Number)
  return new Date(year, month - 1, day)
}

// Función para generar eventos de iglesia realista
function generateChurchEvents(): CalendarEvent[] {
  const events: CalendarEvent[] = []
  let eventId = 1

  const getSundaysInMonth = (year: number, month: number): Date[] => {
    const sundays: Date[] = []
    const firstDay = new Date(year, month, 1)
    const firstSundayOffset = (7 - firstDay.getDay()) % 7
    let current = new Date(year, month, 1 + firstSundayOffset)

    while (current.getMonth() === month) {
      sundays.push(new Date(current))
      current.setDate(current.getDate() + 7)
    }

    return sundays
  }

  const seminarThemes = [
    'Discernimiento Espiritual',
    'Liderazgo Cristiano',
    'Santidad y Transformación',
    'Servicio y Ministerio',
    'Oración Efectiva',
    'Testimonio y Evangelismo',
    'Fe y Confianza en Dios',
    'Familia Cristiana',
    'Mayordomía Cristiana',
    'Dones Espirituales',
    'Gratitud y Acción de Gracias',
    'Esperanza en Cristo',
  ]

  for (let month = 0; month < 12; month++) {
    const sundays = getSundaysInMonth(2026, month)
    const seminarSunday = sundays[1] ?? sundays[0]
    const seminarDate = seminarSunday.toISOString().slice(0, 10)

    sundays.forEach((sundayDate) => {
      const date = sundayDate.toISOString().slice(0, 10)

      events.push({
        id: eventId.toString(),
        name: '⛪ Culto de Adoración (9:00 AM)',
        date,
        startTime: '09:00',
        endTime: '10:30',
        duration: 90,
        createdBy: 'Liderazgo de Iglesia',
        directors: 'Pastor Principal',
        description: 'Culto dominical - Adoración y predicación de la Palabra de Dios',
        location: 'Templo Principal',
        category: 'evento',
        capacity: 500,
        registeredCount: 350,
      })
      eventId++

      events.push({
        id: eventId.toString(),
        name: '⛪ Culto de Adoración (11:00 AM)',
        date,
        startTime: '11:00',
        endTime: '12:30',
        duration: 90,
        createdBy: 'Liderazgo de Iglesia',
        directors: 'Pastor Principal',
        description: 'Culto dominical - Adoración y predicación de la Palabra de Dios',
        location: 'Templo Principal',
        category: 'evento',
        capacity: 500,
        registeredCount: 380,
      })
      eventId++

      if (date !== seminarDate) {
        events.push({
          id: eventId.toString(),
          name: '📖 Discipulado (6:00 PM)',
          date,
          startTime: '18:00',
          endTime: '19:30',
          duration: 90,
          createdBy: 'Liderazgo de Iglesia',
          directors: 'Coordinador de Discipulado',
          description: 'Grupos pequeños de discipulado y crecimiento espiritual',
          location: 'Salones de Estudio',
          category: 'actividad',
          capacity: 250,
          registeredCount: 180,
        })
        eventId++
      }
    })

    events.push({
      id: eventId.toString(),
      name: `🎓 Seminario Mensual - ${seminarThemes[month]}`,
      date: seminarDate,
      startTime: '14:00',
      endTime: '17:00',
      duration: 180,
      createdBy: 'Departamento de Formación',
      directors: 'Coordinador General, Facilitadores',
      description: `Seminario mensual: "${seminarThemes[month]}" - Enseñanza profunda y participación interactiva`,
      location: 'Auditorio Principal',
      category: 'reunion',
      capacity: 300,
      registeredCount: 245,
    })
    eventId++
  }

  return events
}

// Mock data de eventos para el calendario
const mockCalendarEvents: CalendarEvent[] = generateChurchEvents()

export function useCalendarEvents() {
  const events = ref<CalendarEvent[]>(mockCalendarEvents)
  const selectedEvent = ref<CalendarEvent | null>(null)
  const isLoading = ref(false)

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
  const createEvent = (event: Omit<CalendarEvent, 'id'>): CalendarEvent => {
    const newEvent: CalendarEvent = {
      ...event,
      id: Date.now().toString(),
    }
    events.value.push(newEvent)
    console.log('✅ Evento creado:', newEvent)
    return newEvent
  }

  // Actualizar evento (simulado)
  const updateEvent = (id: string, updates: Partial<CalendarEvent>): void => {
    const index = events.value.findIndex((e) => e.id === id)
    if (index !== -1) {
      events.value[index] = { ...events.value[index], ...updates }
      console.log('✅ Evento actualizado:', events.value[index])
    }
  }

  // Eliminar evento (simulado)
  const deleteEvent = (id: string): void => {
    const index = events.value.findIndex((e) => e.id === id)
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
