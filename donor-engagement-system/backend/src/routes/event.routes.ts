import { Router } from 'express';
import { EventController } from '../controllers/event.controller';
import { checkUser, errorHandler } from '../middleware/index';
import pool from '../config/database';
import { EventService } from '../service/event.service';
import { FundraiserService } from '../service/fundraiser.service';

const router = Router();
const eventController = new EventController(
    pool, 
    new EventService(pool), 
    new FundraiserService(pool)
);

// Event list routes
router
    .route('/events')
    .get(checkUser, eventController.getFundraiserEvents);

// Export router
export default router;