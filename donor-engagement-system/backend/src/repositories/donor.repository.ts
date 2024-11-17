import { Pool } from 'mysql2/promise';
import { Donor } from '../types/donor.types';

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

    async findDonorsByEventFundraiser(eventId: number, fundraiserId: number): Promise<Donor[]> {
        const [eventFundraiserId] = await this.pool.execute(`
            SELECT id FROM Event_Fundraisers WHERE event_id = ? AND fundraiser_id = ?
        `, [eventId, fundraiserId]) as [any[], any];

        if (!eventFundraiserId.length) {
            return [];
        }

        const [donorIds] = await this.pool.execute(`
            SELECT donor_id FROM Selections WHERE event_id = ? AND event_fundraiser_id = ?
        `, [eventId, eventFundraiserId[0].id]) as [DonorSelectionRow[], any];
        
        const donors = await Promise.all(donorIds.map(donorId => this.findById(donorId.donor_id)));
        return donors.filter((donor): donor is Donor => donor !== null);
    }
}
