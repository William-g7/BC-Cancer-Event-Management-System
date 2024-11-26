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

    async getEventsByStatus(): Promise<{ finishedEvents: EventData[], waitingEvents: EventData[] }> {
        try {
          const response = await api.get<{
            success: boolean,
            data: { finishedEvents: EventData[], waitingEvents: EventData[] }
          }>('/events/status');
    
          if (!response.success) {
            throw new Error('Failed to fetch events by status');
          }
    
          return response.data;
        } catch (error) {
          console.error('Error fetching events by status:', error);
          throw error;
        }
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
    async addEventNote(donor_id:number,note:string):Promise<void>{
        const response = await api.post<{success: boolean}>('/event/note/add', {donor_id,note})
        if (!response.success) {
            throw new Error('Failed to get notes');
        }
    }
    async getUpcomingEvents(): Promise<EventData[]> {
        const response = await api.get<{success: boolean, data: EventData[]}>('/coordinators/dashboard');
        return response.data || [];
    }

    async getAllEvents(): Promise<EventData[]> {
        const response = await api.get<{success: boolean, data: EventData[]}>('/calendar/events');
        return response.data || [];
    }

    async getFundraiserStatus(eventId: number): Promise<{ 
        fundraiserId: number;
        status: 'confirmed' | 'in_progress';
    }[]> {
        try {
            const response = await api.get<{
                success: boolean,
                data: { fundraiserId: number; status: 'confirmed' | 'in_progress' }[]
            }>(`/event/${eventId}/fundraiser-status`);
    
            if (!response.success) {
                throw new Error('Failed to fetch fundraiser status');
            }
    
            return response.data;
        } catch (error) {
            console.error('Error fetching fundraiser status:', error);
            throw error;
        }
    }
      
} 