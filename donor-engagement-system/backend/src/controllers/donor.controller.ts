import { CustomRequest } from 'src/types/custom-request';
import { DonorService } from 'src/service/donor.service';
import { FundraiserService } from '../service/fundraiser.service';
import { Request, Response } from 'express';

export class DonorController {
    constructor(
        private donorService: DonorService,
        private fundraiserService: FundraiserService
    ) {}

    /**
     * @route   GET /api/events/:id/selections/:donorId
     * @desc    Get a donor by ID
     * @param   req.params.id - Event ID
     * @param   req.params.donorId - Donor ID
     * @returns {Object} Donor
     */
    getDonorById = async (req: CustomRequest, res: Response) => {
        const donorId = parseInt(req.params.donorId);
        const donor = await this.donorService.getDonorById(donorId);
    }
    
    /**
     * @route   GET /api/events/:id/selections
     * @desc    Get all donors associated with a specific event and fundraiser
     * @param   req.params.id - Event ID
     * @returns {Array} List of donors
     */
    getDonorsByEventFundraiser = async (req: CustomRequest, res: Response) => {
        const eventId = parseInt(req.params.id);
        const accountId = (req as CustomRequest).user?.id;

        if (!accountId) {
            res.status(401).json({
                success: false,
                error: 'User not authenticated'
            });
            return;
        }

        const fundraiserId = await this.fundraiserService.getFundraiserIdByAccountId(accountId);
        const donors = await this.donorService.getDonorsByEventFundraiser(eventId, fundraiserId);
        console.log('Donors fetched successfully');
        res.json({
            success: true,
            data: donors
        });
    }
}
