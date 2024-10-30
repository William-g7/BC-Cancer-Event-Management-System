import { Pool } from 'mysql2/promise';
import { Fundraiser } from '../types/fundraiser.types';

export class FundraiserRepository {
    constructor(private pool: Pool) {}

    async findByAccountId(accountId: number): Promise<Fundraiser | null> {
        const [fundraisers] = await this.pool.execute(`
            SELECT * FROM fundraisers WHERE account_id = ?
        `, [accountId]) as [Fundraiser[], any];
        return fundraisers[0] || null;
    }   
}   