import { Router } from 'express';
import { EventController } from '../controllers/event.controller';
import { checkUser, errorHandler } from '../middleware/index';
import pool from '../config/database';
import { EventService } from '../service/event.service';
import { DonorService } from '../service/donor.service';
import { FundraiserService } from '../service/fundraiser.service';
import { NoteService } from '../service/note.service';

const router = Router();
const eventController = new EventController(
    pool, 
    new EventService(pool), 
    new FundraiserService(pool),
    new NoteService(pool),
    new DonorService(pool)
);

// Get events by status
router.get('/events/status', checkUser, eventController.getEventsByStatus);

// Get events for a fundraiser's dashboard
router.get('/events', checkUser, eventController.getFundraiserEvents);

// Get single event by ID
router.get('/event/:id', checkUser, eventController.getEventById);

// Get dashboard data for a fundraiser
router.get('/dashboard', checkUser, eventController.getDashboardEvents);

// Get upcoming events
router.get('/coordinators/dashboard', checkUser, eventController.getUpcomingEvents);

// Get all events
router.get('/calendar/events', checkUser, eventController.getAllEvents);

// Create a new Event
router.post('/event/new-event', checkUser, eventController.createEvent)

// find event notes
router.get("/event/note/:id",checkUser,eventController.getNoteEvents)

// add event notes
router.post('/event/note/add',checkUser,eventController.addNoteEvents)


// Get fundraiser status
router.get('/event/:id/fundraiser-status', checkUser, eventController.getFundraiserStatus);

// Apply error handler to all routes
router.use(errorHandler);

export default router;