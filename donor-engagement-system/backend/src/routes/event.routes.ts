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

// Get events for a fundraiser's dashboard
router.get('/api/events', checkUser, eventController.getFundraiserEvents);

// Get single event by ID
router.get('/api/events/:id', checkUser, eventController.getEventById);

// Get dashboard data for a fundraiser
router.get('/api/dashboard', checkUser, eventController.getDashboardEvents);

// Apply error handler to all routes
router.use(errorHandler);

export default router;