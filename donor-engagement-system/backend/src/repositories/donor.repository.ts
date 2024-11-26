import { Pool } from 'mysql2/promise';
import { Donor } from '../types/donor.types';
import { SelectionStatus } from '../types/selection';
import { RowDataPacket, FieldPacket } from 'mysql2';
import { FundraiserStatus } from '../types/fundraiser.types';

interface DonorSelectionRow {
    donor_id: number;
}

export class DonorRepository {
    constructor(private pool: Pool) {}

    async findById(id: number): Promise<Donor | null> {
        const [result] = await this.pool.execute(`
            SELECT * FROM Donors WHERE id = ?
        `, [id]) as [any[], any];
        return result[0] || null;
    }

    async findDonorsByEvent(eventId: number, eventFundraiserId: number): Promise<Donor[]> {
        const [rows] = await this.pool.execute<RowDataPacket[]>(`
            SELECT 
                d.id,
                d.first_name,
                d.last_name,
                d.total_donations,
                d.last_gift_date,
                d.city,
                s.state
            FROM Donors d
            LEFT JOIN Selections s ON d.id = s.donor_id 
                AND s.event_id = ? 
                AND s.event_fundraiser_id = ?
            WHERE d.id IN (
                SELECT donor_id 
                FROM Selections 
                WHERE event_id = ?
            )
            ORDER BY d.id
        `, [eventId, eventFundraiserId, eventId]);

        return rows as Donor[];
    }

    async saveSelections(eventId: number, donorIds: number[], eventFundraiserId: number): Promise<void> {
        const connection = await this.pool.getConnection();
        try {
            await connection.beginTransaction();

            for (const donorId of donorIds) {
                await connection.execute(`
                    UPDATE Selections 
                    SET state = 'selected'
                    WHERE event_id = ? 
                    AND donor_id = ? 
                    AND event_fundraiser_id = ?
                `, [eventId, donorId, eventFundraiserId]);
            }

            await connection.commit();
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }

    async confirmSelections(eventId: number, donorIds: number[], eventFundraiserId: number): Promise<void> {
        const connection = await this.pool.getConnection();
        try {
            await connection.beginTransaction();

            for (const donorId of donorIds) {
                await connection.execute(`
                    UPDATE Selections 
                    SET state = 'confirmed'
                    WHERE event_id = ? 
                    AND donor_id = ? 
                    AND event_fundraiser_id = ?
                `, [eventId, donorId, eventFundraiserId]);
            }

            await connection.commit();
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }

    async findOtherFundraisersSelections(eventId: number, currentFundraiserId: number): Promise<(Donor & { fundraiser_name: string; state: string; })[]> {
        const [rows] = await this.pool.execute<RowDataPacket[]>(`
            SELECT 
                d.*,
                s.state,
                a.name as fundraiser_name
            FROM Selections s
            INNER JOIN Donors d ON d.id = s.donor_id
            INNER JOIN Event_Fundraisers ef ON s.event_fundraiser_id = ef.id
            INNER JOIN Fundraisers f ON ef.fundraiser_id = f.id
            INNER JOIN Accounts a ON f.account_id = a.id
            WHERE s.event_id = ? 
            AND ef.fundraiser_id != ?
            AND s.state = ?
            ORDER BY s.ID
        `, [eventId, currentFundraiserId, SelectionStatus.CONFIRMED]);

        return rows as (Donor & { fundraiser_name: string; state: string; })[];
    }

    async unselectDonors(eventId: number, donorIds: number[], eventFundraiserId: number): Promise<void> {
        const connection = await this.pool.getConnection();
        try {
            await connection.beginTransaction();

            for (const donorId of donorIds) {
                const [result] = await connection.execute(`
                    UPDATE Selections 
                    SET state = ?
                    WHERE event_id = ? 
                    AND donor_id = ? 
                    AND event_fundraiser_id = ?
                    AND state = ?
                `, [SelectionStatus.UNSELECTED, eventId, donorId, eventFundraiserId, SelectionStatus.SELECTED]);

                // Log the affected rows for debugging
                console.log(`Donor ID ${donorId}: Affected rows:`, (result as any).affectedRows);
            }

            await connection.commit();
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }
    
    async findDonorsByEventFundraiser(eventId: number, fundraiserId: number): Promise<(Donor & { state: string })[]> {
        const [eventFundraiserId] = await this.pool.execute(`
            SELECT id FROM Event_Fundraisers 
            WHERE event_id = ? AND fundraiser_id = ?
        `, [eventId, fundraiserId]) as [any[], any];
    
        if (!eventFundraiserId.length) {
            return [];
        }
    
        const [donors] = await this.pool.execute(`
            SELECT 
                d.*,
                s.state
            
            FROM Donors d
            INNER JOIN Selections s ON 
                s.donor_id = d.id AND 
                s.event_id = ? AND 
                s.event_fundraiser_id = ?
            ORDER BY d.ID
        `, [eventId, eventFundraiserId[0].id]) as [any[], any];
    
        return donors;
    }

    async getConfirmedDonorsByEvent(eventId: number): Promise<Donor[]> {
        try {
            console.log('DonorRepository: Starting findConfirmedDonorsByEvent');
            console.log('DonorRepository: Event ID:', eventId);
            console.log('DonorRepository: SelectionStatus.CONFIRMED =', SelectionStatus.CONFIRMED);
            
            const query = `
                SELECT 
                    d.*,
                    s.state,
                    a.name as fundraiser_name
                FROM Selections s
                INNER JOIN Donors d ON d.id = s.donor_id
                INNER JOIN Event_Fundraisers ef ON s.event_fundraiser_id = ef.id
                INNER JOIN Fundraisers f ON ef.fundraiser_id = f.id
                INNER JOIN Accounts a ON f.account_id = a.id
                WHERE s.event_id = ? 
                AND s.state = ?
                ORDER BY s.ID
            `;
            
            console.log('DonorRepository: Executing query:', query);
            console.log('DonorRepository: Parameters:', [eventId, SelectionStatus.CONFIRMED]);
            
            const [rows] = await this.pool.execute<RowDataPacket[]>(query, 
                [eventId, SelectionStatus.CONFIRMED]);
            
            console.log('DonorRepository: Query completed');
            console.log('DonorRepository: Number of rows returned:', rows.length);
            console.log('DonorRepository: First row:', rows[0]);
            
            return rows as (Donor & { fundraiser_name: string; state: string; })[];
        } catch (error) {
            console.error('DonorRepository: Error in findConfirmedDonorsByEvent:', error);
            throw error;
        }

    async getFundraiserSelectionStatus(eventId: number): Promise<FundraiserStatus[]> {
        // First, let's check if there are any confirmed selections
        const [confirmedSelections] = await this.pool.execute(`
            SELECT s.id, s.event_fundraiser_id, s.state
            FROM Selections s
            JOIN Event_Fundraisers ef ON s.event_fundraiser_id = ef.id
            WHERE ef.event_id = ? AND s.state = 'confirmed'
        `, [eventId]) as [any[], any];
        
        console.log('Confirmed selections:', confirmedSelections);

        // Then get the fundraiser status
        const [results] = await this.pool.execute(`
            SELECT 
                ef.id as event_fundraiser_id,
                ef.fundraiser_id as fundraiserId,
                CASE 
                    WHEN EXISTS (
                        SELECT 1 
                        FROM Selections s2 
                        WHERE s2.event_fundraiser_id = ef.id 
                        AND s2.state = 'confirmed'
                    ) THEN 'confirmed'
                    ELSE 'in_progress'
                END as status
            FROM Event_Fundraisers ef
            WHERE ef.event_id = ?
            GROUP BY ef.fundraiser_id, ef.id
        `, [eventId]) as [any[], any];

        console.log('Fundraiser status results:', results);
        return results;

    }
}
    

