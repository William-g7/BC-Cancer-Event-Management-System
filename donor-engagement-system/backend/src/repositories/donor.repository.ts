import { Pool } from 'mysql2/promise';
import { Donor } from '../types/donor.types';
import { SelectionStatus } from '../types/selection';
import { RowDataPacket, FieldPacket } from 'mysql2';

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
            AND s.state IN (?, ?, ?)
            ORDER BY s.ID
        `, [eventId, currentFundraiserId, SelectionStatus.CONFIRMED, SelectionStatus.SELECTED, SelectionStatus.UNSELECTED]);

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
    
}
