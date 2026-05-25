export interface EventAttachment {
  id: string
  title: string
  url: string
}

export interface CalendarEvent {
  id: string
  name: string
  date: string // YYYY-MM-DD
  startTime?: string // HH:mm
  endTime?: string // HH:mm
  duration?: number // en minutos
  createdBy: string
  directors?: string // nombres separados por comas
  description?: string
  attachments?: EventAttachment[]
  location?: string
  category?: 'evento' | 'reunion' | 'actividad' | 'otro'
  capacity?: number
  registeredCount?: number
}

export interface EventsResponse {
  recent: CalendarEvent[] // últimos 2
  upcoming: CalendarEvent[] // próximos 2
  all: CalendarEvent[]
}

export interface Event {
  id: string
  title: string
  description?: string
  startDate: Date | string
  endDate: Date | string
  location?: string
  category?: string
  attachments?: EventAttachment[]
  status: 'scheduled' | 'ongoing' | 'completed' | 'cancelled'
  maxAttendees?: number
  currentAttendees?: number
  organizers?: string[]
  tags?: string[]
  createdAt?: Date | string
  updatedAt?: Date | string
}

export interface CreateEventRequest {
  title: string
  description?: string
  startDate: string | Date
  endDate: string | Date
  location?: string
  category?: string
  attachments?: EventAttachment[]
  status?: 'scheduled' | 'ongoing' | 'completed' | 'cancelled'
  maxAttendees?: number
  organizers?: string[]
  tags?: string[]
}

export interface UpdateEventRequest extends Partial<CreateEventRequest> {
  id: string
}

export interface EventCategory {
  name: string
  color: string
  icon: string
}

export const EVENT_CATEGORIES: EventCategory[] = [
  { name: 'Torneo', color: '#ff6b6b', icon: '🏆' },
  { name: 'Evento Social', color: '#4ecdc4', icon: '🎉' },
  { name: 'Capacitación', color: '#45b7d1', icon: '📚' },
  { name: 'Mantenimiento', color: '#ffd93d', icon: '🔧' },
  { name: 'Otro', color: '#95a5a6', icon: '📌' },
]

export const EVENT_STATUSES = {
  scheduled: { label: 'Programado', icon: '📅', color: '#3498db' },
  ongoing: { label: 'En Curso', icon: '🔴', color: '#e74c3c' },
  completed: { label: 'Completado', icon: '✅', color: '#2ecc71' },
  cancelled: { label: 'Cancelado', icon: '❌', color: '#95a5a6' },
} as const
