import { Donor } from 'src/types/donor.types';
import { DonorRepository } from '../repositories/donor.repository';
import { Pool } from 'mysql2/promise';
import { FundraiserRepository } from '../repositories/fundraiser.repository';

export class DonorService {
    constructor(private pool: Pool) {}

    /**
     * Get donor by ID
     */
    getDonorById(id: number): Promise<Donor | null> {
        const donorRepository = new DonorRepository(this.pool);
        return donorRepository.findById(id);
    }

    /**
     * Get donors by event and fundraiser
     */
    getDonorsByEventFundraiser(eventId: number, fundraiserId: number): Promise<Donor[]> {
        const donorRepository = new DonorRepository(this.pool);
        return donorRepository.findDonorsByEventFundraiser(eventId, fundraiserId);
    }

    /**
     * Private method to get event fundraiser ID by event ID and account ID
     */
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

    /**
     * Save donor selections
     */
    async saveSelections(eventId: number, donorIds: number[], accountId: number): Promise<void> {
        const donorRepository = new DonorRepository(this.pool);
        const eventFundraiserId = await this.getEventFundraiserId(eventId, accountId);
        await donorRepository.saveSelections(eventId, donorIds, eventFundraiserId);
    }

    /**
     * Confirm donor selections
     */
    async confirmSelections(eventId: number, donorIds: number[], accountId: number): Promise<void> {
        const donorRepository = new DonorRepository(this.pool);
        const eventFundraiserId = await this.getEventFundraiserId(eventId, accountId);
        await donorRepository.confirmSelections(eventId, donorIds, eventFundraiserId);
    }

    /**
     * Private method to get fundraiser ID by account ID
     */
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

    /**
     * Get selections from other fundraisers
     */
    async getOtherFundraisersSelections(eventId: number, accountId: number): Promise<(Donor & { fundraiser_name: string; state: string; })[]> {
        const donorRepository = new DonorRepository(this.pool);
        const fundraiserId = await this.getFundraiserIdByAccountId(accountId);
        return donorRepository.findOtherFundraisersSelections(eventId, fundraiserId);
    }

    /**
     * Unselect donors
     */
    async unselectDonors(eventId: number, donorIds: number[], accountId: number): Promise<void> {
        const donorRepository = new DonorRepository(this.pool);
        const eventFundraiserId = await this.getEventFundraiserId(eventId, accountId);
        await donorRepository.unselectDonors(eventId, donorIds, eventFundraiserId);
    }
}
