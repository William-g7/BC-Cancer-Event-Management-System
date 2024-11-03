import { api } from '../utils/api.ts';
import { EventData } from '../types/event.ts';

export class EventService {
    async getDashboardEvents(): Promise<EventData[]> {
        const response = await api.get<{success: boolean, data: EventData[]}>('/dashboard');
        return response.data || [];
    }

    async getEventById(id: number): Promise<EventData> {
        const response = await api.get<{success: boolean, data: EventData}>(`/event/${id}`);
        return response.data;
    }

    async getEvents(): Promise<EventData[]> {
        const response = await api.get<{success: boolean, data: EventData[]}>('/events');
        return response.data || [];
    }
} 