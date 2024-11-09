import { Pool, ResultSetHeader } from 'mysql2/promise';
import { Event, CreateEventDTO} from '../types/event.types';   
import { Fundraiser } from '../types/fundraiser.types';
import { DateTime } from 'luxon';

export class EventRepository {
    constructor(private pool: Pool) {}

    // Pure database operations
    async findById(eventId: number): Promise<Event | null> {
        const [events] = await this.pool.execute(`
            SELECT * FROM Events WHERE id = ?
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
            SELECT f.id, f.account_id, a.name, a.role
            FROM Fundraisers f
            INNER JOIN Event_Fundraisers ef ON f.id = ef.fundraiser_id
            INNER JOIN Accounts a ON f.account_id = a.id
            WHERE ef.event_id = ?
        `, [eventId]) as [Fundraiser[], any];
        
        return fundraisers;
    }

    // create event
    //create one row of event data
    async createEvent(event: CreateEventDTO): Promise<number> {
        const query = `
        INSERT INTO Events (
            name,
            start_time,
            end_time,
            location,
            description,
            organizer_id,
            deadline,
            expected_selection,
            selected_count
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

        const formatDateForMySQL = (date: string | DateTime) => {
            const jsDate = typeof date === 'string' ? new Date(date) : date.toJSDate();
            return jsDate.toISOString().slice(0, 19).replace('T', ' ');
        }

        // Convert dates to MySQL datetime format
        const values = [
            event.name,
            formatDateForMySQL(event.start_time),
            formatDateForMySQL(event.end_time),
            event.location,
            event.description || null,
            event.organizer_id,
            formatDateForMySQL(event.deadline),
            event.expected_selection,
            event.selected_count || 0
        ];

        const [result] = await this.pool.execute(query, values) as [ResultSetHeader, any];
        return result.insertId;
    }


    // assign fundraiser to event
    async assignFundraiserToEvent(eventId: number, fundraiserId: number): Promise<void> {
        await this.pool.execute(`
            INSERT INTO Event_Fundraisers (
                event_id, 
                fundraiser_id, 
                assigned_at
            ) VALUES (?, ?, NOW())
        `, [eventId, fundraiserId]);
    }

    // select donor_ids for event parameters: city, number_of_donors
    async selectDonorIdsForEvent(city: string, number_of_donors: number): Promise<number[]> {
        const [donors] = await this.pool.execute(`
            SELECT * FROM Donors WHERE city = ? ORDER BY RAND() LIMIT ?
        `, [city, number_of_donors]) as [any[], any];
        return donors.map((donor: any) => donor.id);
    }

    // find the fundraiser id from a donor id
    async findFundraiserIdFromDonorId(donorId: number): Promise<number | null> {
        const [donor] = await this.pool.execute(`
            SELECT pmm FROM Donors WHERE id = ?
        `, [donorId]) as [any[], any];

        if (!donor) return null;
        
        const [fundraiserId] = await this.pool.execute(`
            SELECT f.id 
            FROM Fundraisers f
            INNER JOIN Accounts a ON f.account_id = a.id
            WHERE a.name = ?
        `, [donor[0].pmm]) as [any[], any];

        return fundraiserId[0].id;
    }

    // assign fundraiser to event_fundraisers
    async insertEventFundraiser(eventId: number, fundraiserId: number): Promise<number> {
        const [result] = await this.pool.execute(`
            INSERT INTO Event_Fundraisers (
                event_id, 
                fundraiser_id, 
                assigned_at
            ) VALUES (?, ?, NOW())
        `, [eventId, fundraiserId]) as [ResultSetHeader, any];

        return result.insertId;
    }

    //create Selections table
    async createSelections(donor_id: number,  eventId: number, event_fundraiserId: number): Promise<void> {
        await this.pool.execute(`
            INSERT INTO Selections (
                event_id, 
                event_fundraiser_id, 
                donor_id,
                status
            ) VALUES (?, ?, ?, "unselect")
        `, [eventId, event_fundraiserId, donor_id]);
    }
}