import { Router } from 'express';
import { EventController } from '../controllers/event.controller';
import { checkUser, errorHandler } from '../middleware/index';
import pool from '../config/database';
import { EventService } from '../service/event.service';

const router = Router();
const eventController = new EventController(pool, new EventService(pool));

// Event list routes
router
    .route('/events')
    .get(checkUser, eventController.getEvents)
    .post(checkUser, eventController.createEvent);

// Single event routes
router
    .route('/events/:id')
    .get(checkUser, eventController.getEventById)
    .put(checkUser, eventController.updateEvent)
    .delete(checkUser, eventController.deleteEvent);

// Event selection routes
router
    .route('/events/:id/selections')
    .get(checkUser, eventController.getEventSelections);

// Export router
export default router;