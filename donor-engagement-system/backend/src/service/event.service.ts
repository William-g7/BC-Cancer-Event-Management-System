import { Pool } from 'mysql2/promise';
import { Event } from '../types/event.types';
import { Fundraiser } from '../types/fundraiser.types';
import { EventRepository } from '../repositories/event.repository';
import { FundraiserRepository } from '../repositories/fundraiser.repository';
import { DateTime } from 'luxon';

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
            const organizer = await fundraiserRepository.findByAccountId(event.organizer_id);
            
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
        const fundraiserRepository = new FundraiserRepository(this.pool);
        const events = await eventRepository.getFundraiserEvents(fundraiserId);
        const today = DateTime.now();
        const filteredEvents = events.filter(event => event.start_time > today);
        
        // Map filtered events to include relations
        const eventsWithRelations = await Promise.all(filteredEvents.map(async (event) => {
            const assignedFundraisers = await eventRepository.getEventFundraisers(event.id);
            const organizer = await fundraiserRepository.findByAccountId(event.organizer_id);
            
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

    async createEvent(event: Event): Promise<number> {
        const eventRepository = new EventRepository(this.pool);
        // insert event into Events table
        const newEventId = await eventRepository.createEvent(event);

        // find the event with the new id
        const newEvent = await eventRepository.findById(newEventId);

        if (!newEvent) {
            throw new Error(`Event with id ${newEventId} not found`);
        }

        // get the city from the location
        const city = newEvent.location.split(',')
            .map(part => part.trim())
            .pop() || ''; // Get the last part after splitting by comma
        
        // select donors for the event
        const donorIds = await eventRepository.selectDonorIdsForEvent(city, newEvent.expected_selection);
        // find the fundraiser for each donor
        for (const donorId of donorIds) {   
            const fundraiserId = await eventRepository.findFundraiserIdFromDonorId(donorId);
            if (!fundraiserId) {
                throw new Error(`Fundraiser with id ${fundraiserId} not found`);
            }
            // assign the fundraiser to the event
            const eventFundraiserId = await eventRepository.insertEventFundraiser(newEventId, fundraiserId);

            // create the Selections table
            await eventRepository.createSelections(donorId, newEventId, eventFundraiserId);
        }

        return newEventId;
    }
}
