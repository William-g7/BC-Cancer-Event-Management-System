import { api } from '../utils/api.ts';
import { Event } from '../types/event.ts';

export class EventService {
    async getDashboardEvents(): Promise<Event[]> {
        const response = await api.get<{success: boolean, data: Event[]}>('/dashboard');
        return response.data || [];
    }

    async getEventById(id: number): Promise<Event> {
        const response = await api.get<{success: boolean, data: Event}>(`/events/${id}`);
        return response.data;
    }

    async getEvents(): Promise<Event[]> {
        const response = await api.get<{success: boolean, data: Event[]}>('/events');
        return response.data || [];
    }
} 