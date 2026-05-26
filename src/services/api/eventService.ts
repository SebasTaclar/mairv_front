import { apiClient, type ApiResponse } from './apiConfig'
import type { Event, CreateEventRequest } from '@/types/EventType'

export interface GetEventsQuery {
  category?: string
  status?: string
}

class EventService {
  async getEvents(params?: GetEventsQuery): Promise<ApiResponse<Event[]>> {
    let endpoint = '/events'

    if (params) {
      const queryParams = new URLSearchParams()
      if (params.category) queryParams.append('category', params.category)
      if (params.status) queryParams.append('status', params.status)

      const queryString = queryParams.toString()
      if (queryString) {
        endpoint += `?${queryString}`
      }
    }

    return apiClient.get<Event[]>(endpoint)
  }

  async getEventById(id: string): Promise<ApiResponse<Event>> {
    return apiClient.get<Event>(`/events/${id}`)
  }

  async createEvent(eventData: CreateEventRequest): Promise<ApiResponse<Event>> {
    return apiClient.post<Event>('/events', eventData)
  }

  async updateEvent(id: string, eventData: Partial<CreateEventRequest>): Promise<ApiResponse<Event>> {
    return apiClient.put<Event>(`/events/${id}`, eventData)
  }

  async deleteEvent(id: string): Promise<ApiResponse<{ message: string }>> {
    return apiClient.delete<{ message: string }>(`/events/${id}`)
  }
}

export const eventService = new EventService()