import { api } from '../utils/api.ts';
import { EventData, CreateEventData, DonorNotes } from '../types/event.ts';

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

    async createEvent(event: CreateEventData): Promise<EventData> {
        const response = await api.post<{success: boolean, data: EventData}>('/event/new-event', event);
        if (!response.success) {
            throw new Error('Failed to create event');
        }
        return response.data;
    }

    async getEventNote(id:number):Promise<DonorNotes[]> {
        const response = await api.get<{success: boolean, data: DonorNotes[]}>(`/event/note/${id}`);
        if (!response.success) {
            throw new Error('Failed to get notes');
        }
        return response.data;
    }
} 