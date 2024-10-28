import { Pool } from 'mysql2/promise';
import { 
    Event, 
    CreateEventDTO, 
} from '../types/event.types';

export class EventService {
    constructor(private pool: Pool) {}

    async getEvents(): Promise<Event[]> {
        const connection = await this.pool.getConnection();
        const [events] = await connection.execute('SELECT * FROM events');
        return events as Event[];
    }

    async createEvent(data: CreateEventDTO): Promise<Event> {
        const connection = await this.pool.getConnection();
        try {
            await connection.beginTransaction();

            const [result] = await connection.execute(
                `INSERT INTO events (
                    name, start_time, end_time, location, 
                    description, estimate_invitation
                ) VALUES (?, ?, ?, ?, ?, ?)`,
                [
                    data.name,
                    data.start_time,
                    data.end_time,
                    data.location,
                    data.description,
                    data.estimate_invitation,
                ]
            );

            const [event] = await connection.execute(
                'SELECT * FROM events WHERE id = ?',
                [(result as any).insertId]
            );

            await connection.commit();
            return event[0] as Event;
        } catch (error) {
            await connection.rollback();
            throw new ApiError('EVENT_CREATE_FAILED', 'Failed to create event');
        } finally {
            connection.release();
        }
    }

}

