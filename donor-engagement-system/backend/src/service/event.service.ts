import { Pool } from 'mysql2/promise';
import { Event } from '../types/event.types';
import { Fundraiser } from '../types/fundraiser.types';
import { EventRepository } from '../repositories/event.repository';
import { DateTime } from 'luxon';

export class EventService {
    constructor(private pool: Pool) {}

    async getEventWithRelations(eventId: number): Promise<Event & { 
        assigned_fundraisers: Fundraiser[], 
        organizer: Fundraiser 
    }> {
        const eventRepository = new EventRepository(this.pool);
        
        // Get base event
        const event = await eventRepository.findById(eventId);
        if (!event) {
            throw new Error(`Event with id ${eventId} not found`);
        }

        // Get assigned fundraisers
        const assignedFundraisers = await eventRepository.getEventFundraisers(eventId);

        // Get organizer
        const organizer = await eventRepository.getEventOrganizer(event.organizer_id);
        if (!organizer) {
            throw new Error(`Organizer with id ${event.organizer_id} not found`);
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
        
        // Get base events
        const events = await eventRepository.getFundraiserEvents(fundraiserId);

        // Map each event to include relations
        const eventsWithRelations = await Promise.all(events.map(async (event) => {
            const assignedFundraisers = await eventRepository.getEventFundraisers(event.id);
            const organizer = await eventRepository.getEventOrganizer(event.organizer_id);
            
            if (!organizer) {
                throw new Error(`Organizer with id ${event.organizer_id} not found`);
            }

            return {
                ...event,
                assigned_fundraisers: assignedFundraisers,
                organizer: organizer
            };
        }));

        return eventsWithRelations;
    }

    async getDashboardEvents(fundraiserId: number): Promise<(Event & {
        assigned_fundraisers: Fundraiser[],
        organizer: Fundraiser
    })[]> {
        const eventRepository = new EventRepository(this.pool);
        const events = await eventRepository.getFundraiserEvents(fundraiserId);
        const today = DateTime.now();
        const filteredEvents = events.filter(event => event.start_time > today);
        
        // Map filtered events to include relations
        const eventsWithRelations = await Promise.all(filteredEvents.map(async (event) => {
            const assignedFundraisers = await eventRepository.getEventFundraisers(event.id);
            const organizer = await eventRepository.getEventOrganizer(event.organizer_id);
            
            if (!organizer) {
                throw new Error(`Organizer with id ${event.organizer_id} not found`);
            }

            return {
                ...event,
                assigned_fundraisers: assignedFundraisers,
                organizer: organizer
            };
        }));

        return eventsWithRelations;
    }
}