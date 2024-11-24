import { api } from '../utils/api.ts';
import { EventData, CreateEventData, DonorNotes } from '../types/event.ts';
import { Fundraiser } from '../types/fundraiser.ts';
import { EventRepository } from '../repositories/event.repository.ts';
import { FundraiserRepository } from '../repositories/fundraiser.repository.ts';
import { DateTime } from 'luxon';
import { Pool } from 'mysql2/promise';

export class EventService {
    constructor(private pool: Pool) {}

    async getEventWithRelations(eventId: number): Promise<Event & { 
        assigned_fundraisers: Fundraiser[], 
        organizer: Fundraiser 
    }> {
        const eventRepository = new EventRepository(this.pool);
        const fundraiserRepository = new FundraiserRepository(this.pool);
        // Get base event
        const event = await eventRepository.findById(eventId);
        if (!event) {
            throw new Error(`Get Event Relations: Event with id ${eventId} not found`);
        }

        // Get assigned fundraisers
        const assignedFundraisers = await eventRepository.getEventFundraisers(eventId);

        // Get organizer
        const organizer = await fundraiserRepository.findByFundraiserId(event.organizer_id);
        if (!organizer) {
            throw new Error(`Get Event Relations: Organizer with id ${event.organizer_id} not found`);
        }

        // Combine the data
        return {
            ...event,
            assigned_fundraisers: assignedFundraisers,
            organizer: organizer
        };
    }

    async getFundraiserEventsWithRelations(fundraiserId: number): Promise<(Event & {
        assigned_fundraisers: Fundraiser[],
        organizer: Fundraiser
    })[]> {
        const eventRepository = new EventRepository(this.pool);
        const fundraiserRepository = new FundraiserRepository(this.pool);
        // Get base events
        const events = await eventRepository.getFundraiserEvents(fundraiserId);

        // Map each event to include relations
        const eventsWithRelations = await Promise.all(events.map(async (event) => {
            const assignedFundraisers = await eventRepository.getEventFundraisers(event.id);
            const organizer = await fundraiserRepository.findByFundraiserId(event.organizer_id);
            
            if (!organizer) {
                throw new Error(`getFundraiserEventsWithRelations Error: Organizer with id ${event.organizer_id} not found`);
            }

            return {
                ...event,
                assigned_fundraisers: assignedFundraisers,
                organizer: organizer
            };
        }));

        return eventsWithRelations;
    }
    
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

    async getUpcomingEvents(): Promise<EventData[]> {
        const response = await api.get<{success: boolean, data: EventData[]}>('/coordinators/dashboard');
        return response.data || [];
    }

    async getAllEvents(): Promise<EventData[]> {
        const response = await api.get<{success: boolean, data: EventData[]}>('/calendar/events');
        return response.data || [];
    }
} 