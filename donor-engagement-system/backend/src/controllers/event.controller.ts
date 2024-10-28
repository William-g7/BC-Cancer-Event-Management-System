// src/controllers/event.controller.ts
import { Request, Response } from 'express';
import { Pool } from 'mysql2/promise';
import {
    Event,
    CreateEventDTO,
} from '../types/event.types';
import { EventService } from '../service/event.service';

export class EventController {
    constructor(private pool: Pool, private eventService: EventService) {}
    // GET /events
    getEvents = async (req: Request, res: Response) => {
        try {
            // Controller calls service method
            const events = await this.eventService.getEvents();
    
            res.json({
                success: true,
                data: events
            });
        } catch (error) {
            console.error('Error fetching events:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to fetch events'
            });
        }
    };

    // GET /events/:id
    getEventById = async (req: Request, res: Response) => {
        try {
            

        } catch (error) {
            console.error('Error fetching event:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to fetch event'
            });
        }
    };

    // POST /events
    async createEvent(req: Request, res: Response) {
        try {
            const username = req.headers['x-user-name'] as string;
            const eventData = req.body;

            // Controller just passes data to service
            const newEvent = await this.eventService.createEvent(eventData, username);

            res.status(201).json({
                success: true,
                data: newEvent
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }
    // PUT /events/:id
    updateEvent = async (req: Request, res: Response) => {
        try {
            

        } catch (error) {
            console.error('Error updating event:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to update event'
            });
        }
    };

    // GET /events/:id/selections
    getEventSelections = async (req: Request, res: Response) => {
        try {
            

        } catch (error) {
            console.error('Error fetching event selections:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to fetch event selections'
            });
        }
    };

    // DELETE /events/:id
    deleteEvent = async (req: Request, res: Response) => {
        try {
        

        } catch (error) {
            console.error('Error deleting event:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to delete event'
            });
        }
    };
}
