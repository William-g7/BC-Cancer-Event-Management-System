import { Pool, ResultSetHeader } from 'mysql2/promise';
import { Event, CreateEventDTO} from '../types/event.types';   
import { Fundraiser } from '../types/fundraiser.types';
import { DateTime } from 'luxon';
import {DonorNotes, Fundraisers} from '../types/note.types';

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
                SELECT DISTINCT e.*
                FROM Events e
                LEFT JOIN Event_Fundraisers ef ON e.id = ef.event_id
                WHERE e.organizer_id = ? OR ef.fundraiser_id = ?
            `, [fundraiserId, fundraiserId]) as [Event[], any];
            return events;
        } catch (error) {
            console.error('Error fetching fundraiser events:', error);
            throw error;
        }
    }

    async getDashboardEvents(fundraiserId: number): Promise<Event[]> {
        try {
            const [events] = await this.pool.execute(`
                SELECT DISTINCT e.* 
                FROM Events e
                LEFT JOIN Event_Fundraisers ef ON e.id = ef.event_id
                WHERE (ef.fundraiser_id = ? OR e.organizer_id = ?) 
                AND e.start_time > NOW()
                ORDER BY e.start_time DESC
            `, [fundraiserId, fundraiserId]) as [Event[], any];
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
            selected_count,
            participant_goal    
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
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
            0,
            event.participant_goal
        ];

        console.log('Event data in Repository:', values);

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
    // for now, add 20 to the number of donors to account for further selections
    async selectDonorIdsForEvent(city: string, number_of_donors: number): Promise<number[]> {
        const [donors] = await this.pool.execute(
            `SELECT * FROM Donors 
            WHERE LOWER(city) = LOWER(?) 
            ORDER BY RAND()
            LIMIT ${number_of_donors + 30}`,
            [city]
        ) as [any[], any];
        console.log('Donors:', donors);
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

        // Return null if no fundraiser found
        return fundraiserId[0]?.id || null;
    }

    // assign fundraiser to event_fundraisers
    async insertEventFundraiser(eventId: number, fundraiserId: number): Promise<number> {
        try {
            // First check if the assignment already exists
            const [existing] = await this.pool.execute(`
                SELECT id FROM Event_Fundraisers 
                WHERE event_id = ? AND fundraiser_id = ?
            `, [eventId, fundraiserId]) as [any[], any];

            if (existing.length > 0) {
                // If already assigned, return existing ID
                return existing[0].id;
            }

            // If not assigned, create new assignment
            const [result] = await this.pool.execute(`
                INSERT INTO Event_Fundraisers (
                    event_id, 
                    fundraiser_id, 
                    assigned_at
                ) VALUES (?, ?, NOW())
            `, [eventId, fundraiserId]) as [ResultSetHeader, any];

            return result.insertId;
        } catch (error) {
            console.error('Error in insertEventFundraiser:', error);
            throw new Error('Failed to assign fundraiser to event');
        }
    }

    //create Selections table
    async createSelections(donorId: number, eventId: number, eventFundraiserId: number): Promise<void> {
        const query = `
            INSERT INTO Selections (
                event_id, 
                event_fundraiser_id, 
                donor_id,
                state
            ) VALUES (?, ?, ?, "unselect")
        `;

        await this.pool.execute(query, [
            eventId,
            eventFundraiserId,
            donorId
        ]);
    }

    // find notes
    async findNotes(notesId: number): Promise<DonorNotes[]> {
        const [notes] = await this.pool.execute(`
            SELECT Donor_Notes.id,Donor_Notes.donor_id,Donor_Notes.note,Donor_Notes.created_at,Accounts.name AS fundraiser_name 
            FROM Donor_Notes 
            JOIN Fundraisers ON Donor_Notes.fundraiser_id = Fundraisers.id 
            JOIN Accounts ON Fundraisers.account_id = Accounts.id 
            WHERE Donor_Notes.donor_id = ?
        `, [notesId]) as [DonorNotes[], any];
        return notes
    }
    async addNotes(donor_id:number,account_id:number,note:string):Promise<void>{
        // 查询 account_id 对应的 fundraiser_id
        const query = `
        SELECT * FROM Fundraisers WHERE account_id=?
        `
        const [fundraisers] =await this.pool.execute(query, [account_id])as[Fundraisers[],any]
        // 添加note
        const querys = `
        INSERT INTO Donor_Notes (
                donor_id, 
                fundraiser_id, 
                note
            ) VALUES (?, ?, ?)
        `
        try {
            await this.pool.execute(querys,[donor_id,fundraisers[0].id,note])
        }catch(error){
            console.error(error)
        }
    }

    // get upcoming events  
    async getUpcomingEvents(): Promise<Event[]> {
        const [events] = await this.pool.execute(`
            SELECT * FROM Events WHERE start_time > NOW()
        `) as [Event[], any];
        return events;
    }

    // get all events
    async getAllEvents(): Promise<Event[]> {
        const [events] = await this.pool.execute(`
            SELECT * FROM Events
        `) as [Event[], any];
        return events;
    }
}