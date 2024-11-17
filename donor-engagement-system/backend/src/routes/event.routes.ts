import { Router } from 'express';
import { EventController } from '../controllers/event.controller';
import { checkUser, errorHandler } from '../middleware/index';
import pool from '../config/database';
import { EventService } from '../service/event.service';
import { FundraiserService } from '../service/fundraiser.service';
import { NoteService } from '../service/note.service';

const router = Router();
const eventController = new EventController(
    pool, 
    new EventService(pool), 
    new FundraiserService(pool),
    new NoteService(pool)
);

// Get events for a fundraiser's dashboard
router.get('/events', checkUser, eventController.getFundraiserEvents);

// Get single event by ID
router.get('/event/:id', checkUser, eventController.getEventById);

// Get dashboard data for a fundraiser
router.get('/dashboard', checkUser, eventController.getDashboardEvents);

// Create a new Event
router.post('/event/new-event', checkUser, eventController.createEvent);

// Find event notes
router.get('/event/note/:id', checkUser, eventController.getNoteEvents);

// Apply error handler to all routes
router.use(errorHandler);

export default router;
