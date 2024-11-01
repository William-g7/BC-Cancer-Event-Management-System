import { Donor } from 'src/types/donor.types';
import { DonorRepository } from '../repositories/donor.repository';
import { Pool } from 'mysql2/promise';
export class DonorService {
    constructor(private pool: Pool) {}

    getDonorById(id: number): Promise<Donor | null> {
        const donorRepository = new DonorRepository(this.pool);
        return donorRepository.findById(id);
    }

    getDonorsByEventFundraiser(eventId: number, fundraiserId: number): Promise<Donor[]> {
        const donorRepository = new DonorRepository(this.pool);
        return donorRepository.findDonorsByEventFundraiser(eventId, fundraiserId);
    }
}
