import { api } from '../utils/api';
import { Event } from '../types/event';

export class EventService {
    async getDashboardEvents(fundraiserId: number): Promise<Event[]> {
        return api.get<Event[]>('/events', { fundraiserId });
    }

    async createEvent(event: Omit<Event, 'id'>): Promise<Event> {
        return api.post<Event>('/events', event);
    }

    async deleteEvent(id: number): Promise<void> {
        return api.delete<void>(`/events/${id}`);
    }

    async getEventById(id: number): Promise<Event> {
        return api.get<Event>(`/events/${id}`);
    }
} 