import { Donor } from 'src/types/donor.types';
import { DonorRepository } from '../repositories/donor.repository';
import { Pool } from 'mysql2/promise';

import { FundraiserRepository } from '../repositories/fundraiser.repository';
import { FundraiserStatus } from '../types/fundraiser.types';

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

    private async getEventFundraiserId(eventId: number, accountId: number): Promise<number> {
        const [fundraiser] = await this.pool.execute(
            'SELECT id FROM Fundraisers WHERE account_id = ?',
            [accountId]
        ) as [any[], any];

        if (!fundraiser.length) {
            throw new Error('Fundraiser not found');
        }

        const [eventFundraiser] = await this.pool.execute(
            'SELECT id FROM Event_Fundraisers WHERE event_id = ? AND fundraiser_id = ?',
            [eventId, fundraiser[0].id]
        ) as [any[], any];

        if (!eventFundraiser.length) {
            throw new Error('Event fundraiser not found');
        }

        return eventFundraiser[0].id;
    }

    async saveSelections(eventId: number, donorIds: number[], accountId: number): Promise<void> {
        const donorRepository = new DonorRepository(this.pool);
        const eventFundraiserId = await this.getEventFundraiserId(eventId, accountId);
        await donorRepository.saveSelections(eventId, donorIds, eventFundraiserId);
    }

    async confirmSelections(eventId: number, donorIds: number[], accountId: number): Promise<void> {
        const donorRepository = new DonorRepository(this.pool);
        const eventFundraiserId = await this.getEventFundraiserId(eventId, accountId);
        await donorRepository.confirmSelections(eventId, donorIds, eventFundraiserId);
    }

    private async getFundraiserIdByAccountId(accountId: number): Promise<number> {
        const [fundraiser] = await this.pool.execute(
            'SELECT id FROM Fundraisers WHERE account_id = ?',
            [accountId]
        ) as [any[], any];

        if (!fundraiser.length) {
            throw new Error('Fundraiser not found');
        }

        return fundraiser[0].id;
    }

    async getOtherFundraisersSelections(eventId: number, accountId: number): Promise<(Donor & { fundraiser_name: string; state: string; })[]> {
        const donorRepository = new DonorRepository(this.pool);
        const fundraiserId = await this.getFundraiserIdByAccountId(accountId);
        return donorRepository.findOtherFundraisersSelections(eventId, fundraiserId);
    }

    async unselectDonors(eventId: number, donorIds: number[], accountId: number): Promise<void> {
        const donorRepository = new DonorRepository(this.pool);
        const eventFundraiserId = await this.getEventFundraiserId(eventId, accountId);
        await donorRepository.unselectDonors(eventId, donorIds, eventFundraiserId);

    } 

    async getConfirmedDonorsByEvent(eventId: number): Promise<Donor[]> {
        try {
            console.log('DonorService: Starting getConfirmedDonorsByEvent');
            console.log('DonorService: Event ID:', eventId);
            
            const donorRepository = new DonorRepository(this.pool);
            console.log('DonorService: Repository initialized');
            
            const donors = await donorRepository.getConfirmedDonorsByEvent(eventId);
            console.log('DonorService: Query completed');
            console.log('DonorService: Found donors:', donors);
            
            return donors;
        } catch (error) {
            console.error('DonorService: Error in getConfirmedDonorsByEvent:', error);
            throw error;
        }

    }

    async getFundraiserSelectionStatus(eventId: number): Promise<FundraiserStatus[]> {
        const donorRepository = new DonorRepository(this.pool);
        return await donorRepository.getFundraiserSelectionStatus(eventId);

    }
}

