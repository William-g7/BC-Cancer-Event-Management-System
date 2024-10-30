import { Pool } from 'mysql2/promise';
import { FundraiserRepository } from '../repositories/fundraiser.repository';

export class FundraiserService {
    constructor(private pool: Pool) {}

    async getFundraiserIdByAccountId(accountId: number): Promise<number> {
        const fundraiserRepository = new FundraiserRepository(this.pool);
        const fundraiser = await fundraiserRepository.findByAccountId(accountId);
        return fundraiser?.id || 0;
    }
}
