import { Router } from 'express';
import { DonorController } from '../controllers/donor.controller';
import pool from '../config/database';
import { DonorService } from '../service/donor.service';
import { checkUser } from '../middleware';
import { FundraiserService } from '../service/fundraiser.service';

const router = Router();
const donorController = new DonorController(new DonorService(pool), new FundraiserService(pool));

// Get donor by ID
router.get('/event/:id/selections/:donorId', checkUser, donorController.getDonorById);

// Get donors by event and fundraiser
router.get('/event/:id/selections', checkUser, donorController.getDonorsByEventFundraiser);

export default router;
