import { Pool } from 'mysql2/promise';
import { Event, CreateEventDTO} from '../types/event.types';   
import { Fundraiser } from '../types/fundraiser.types';

export class EventRepository {
    constructor(private pool: Pool) {}

    // Pure database operations
    async findById(eventId: number): Promise<Event | null> {
        const [events] = await this.pool.execute(`
            SELECT * FROM events WHERE event_id = ?
        `, [eventId]) as [Event[], any];
        return events[0] || null;
    }

    async getFundraiserEvents(fundraiserId: number): Promise<Event[]> {
        try {
            const [events] = await this.pool.execute(`
                SELECT e.* 
                FROM Events e
                INNER JOIN Event_Fundraisers ef ON e.id = ef.event_id
                WHERE ef.fundraiser_id = ?
            `, [fundraiserId]) as [Event[], any];
            return events;
        } catch (error) {
            console.error('Error fetching fundraiser events:', error);
            throw error;
        }
    }

    async getDashboardEvents(fundraiserId: number): Promise<Event[]> {
        try {
            const [events] = await this.pool.execute(`
                SELECT e.* 
                FROM Events e
                INNER JOIN Event_Fundraisers ef ON e.id = ef.event_id
                WHERE ef.fundraiser_id = ? AND e.start_time > NOW()
            `, [fundraiserId]) as [Event[], any];
            return events;
        } catch (error) {
            console.error('Error fetching dashboard events:', error);
            throw error;
        }
    }

    async getOrganizerEvents(fundraiserId: number): Promise<Event[]> {
        const [events] = await this.pool.execute(`
            SELECT id as event_id, * FROM events WHERE organizer_id = ?
        `, [fundraiserId]) as [Event[], any];
        return events;
    }

    async getEventFundraisers(eventId: number): Promise<Fundraiser[]> {
        const [fundraisers] = await this.pool.execute(`
            SELECT f.id, f.account_id
            FROM Fundraisers f
            INNER JOIN Event_Fundraisers ef ON f.id = ef.fundraiser_id
            WHERE ef.event_id = ?
        `, [eventId]) as [Fundraiser[], any];
        
        return fundraisers;
    }

    async getEventOrganizer(organizerId: number): Promise<Fundraiser | null> {
        const [fundraisers] = await this.pool.execute(`
            SELECT id, account_id
            FROM Fundraisers
            WHERE id = ?
        `, [organizerId]) as [Fundraiser[], any];
        
        return fundraisers[0] || null;
    }
}
