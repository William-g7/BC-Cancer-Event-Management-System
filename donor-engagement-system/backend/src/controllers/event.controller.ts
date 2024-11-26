import { Pool } from 'mysql2/promise';
import { EventService } from '../service/event.service';
import e, { Request, Response } from 'express';
import { FundraiserService } from '../service/fundraiser.service';
import { CustomRequest } from '../types/custom-request';
import { NoteService } from '../service/note.service';

export class EventController {
    constructor(
        private pool: Pool, 
        private eventService: EventService, 
        private fundraiserService: FundraiserService,
        private noteService: NoteService
    ) {}

    /**
     * @route   GET /api/event/:id
     * @desc    Get a single event by ID with its relations (organizer and assigned fundraisers)
     * @param   req.params.id - Event ID
     * @returns {Object} Event data with relations
     */
    getEventById = async (req: Request, res: Response): Promise<void> => {
        try {
            const eventId = parseInt(req.params.id);
            const event = await this.eventService.getEventWithRelations(eventId);
            
            res.json({
                success: true,
                data: event
            });
        } catch (error) {
            console.error('Error fetching event:', error);
            res.status(500).json({
                success: false,
                error: error instanceof Error ? error.message : 'An unknown error occurred'
            });
        }
    };

    /**
     * @route   GET /api/events
     * @desc    Get all events associated with a specific fundraiser
     * @param   req.params.id - Fundraiser ID
     * @returns {Array} List of events with relations
     */
    getFundraiserEvents = async (req: Request, res: Response): Promise<void> => {
        try {
            const accountId = (req as CustomRequest).user?.id;

            if (!accountId) {
                res.status(401).json({
                    success: false,
                    error: 'User not authenticated'
                });
                return;
            }

            const fundraiserId = await this.fundraiserService.getFundraiserIdByAccountId(accountId);
            console.log(fundraiserId);
            const events = await this.eventService.getFundraiserEventsWithRelations(fundraiserId);
    
            res.json({
                success: true,
                data: events
            });
        } catch (error) {
            console.error('Error fetching fundraiser events:', error);
            res.status(500).json({
                success: false,
                error: error instanceof Error ? error.message : 'An unknown error occurred'
            });
        }
    }

    /**
     * @route   GET /api/dashboard
     * @desc    Get dashboard data for the authenticated fundraiser
     * @returns {Object} Dashboard events data
     */
    getDashboardEvents = async (req: Request, res: Response): Promise<void> => {
        try {
            // Get user from the request (set by checkUser middleware)
            const accountId = (req as CustomRequest).user?.id;
            
            if (!accountId) {
                res.status(401).json({
                    success: false,
                    error: 'User not authenticated'
                });
                return;
            }

            const fundraiserId = await this.fundraiserService.getFundraiserIdByAccountId(accountId);
            const dashboardData = await this.eventService.getDashboardEvents(fundraiserId)

            res.json({
                success: true,
                data: dashboardData
            });
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
            if (error instanceof Error) {
                console.error('Error stack:', error.stack);
            }
            res.status(500).json({
                success: false,
                error: error instanceof Error ? error.message : 'An unknown error occurred'
            });
        }
    }

    /**
     * @route   POST /api//event/new-event
     * @desc    Create a new event
     * @returns {Object} New event data
     */
    createEvent = async (req: CustomRequest, res: Response): Promise<void> => {
        try {

            const accountId = (req as CustomRequest).user?.id;

            if (!accountId) {
                res.status(401).json({
                    success: false,
                    error: 'User not authenticated'
                });
                return;
            }

            const fundraiserId = await this.fundraiserService.getFundraiserIdByAccountId(accountId);

            const eventData = {
                ...req.body,
                organizer_id: fundraiserId,
                deadline: req.body.end_time,
                selected_count: 0
            };

            // Validate required fields
            if (!eventData.name || !eventData.start_time || !eventData.end_time || 
                !eventData.location || !eventData.deadline || !eventData.expected_selection) {
                res.status(400).json({
                    success: false,
                    error: 'Missing required fields'
                });
                return;
            }

            const newEventId = await this.eventService.createEvent(eventData);
            const newEventWithRelations = await this.eventService.getEventWithRelations(newEventId);

            res.status(201).json({
                success: true,
                data: newEventWithRelations
            });
        } catch (error) {
            console.error('Error creating event:', error);
            res.status(500).json({
                success: false,
                error: error instanceof Error ? error.message : 'An unknown error occurred'
            });
        }
    }

    /**
     * @route   GET /api/note/:id
     * @desc    Get event note
     * @returns {Object} Note events data
     */
    getNoteEvents = async (req: Request, res: Response): Promise<void> => {
        try {
            const noteId = parseInt(req.params.id);
            const note = await this.noteService.getDonorNote(noteId);

            res.json({
                success: true,
                data: note
            });
        } catch (error) {
            console.error('Error fetching notes:', error);
            res.status(500).json({
                success: false,
                error: error instanceof Error ? error.message : 'An unknown error occurred'
            });
        }
    }
        /**
     * @route   POST /api/note/add
     * @desc    Add event note
     * @returns {void} void
     */
        addNoteEvents = async (req: Request, res: Response): Promise<void> => {
            try {
    
                const accountId = (req as CustomRequest).user?.id;
                if (!accountId) {
                    res.status(401).json({
                        success: false,
                        error: 'User not authenticated'
                    });
                    return;
                }
                const a=await this.noteService.addDonorNote(req.body.donor_id,accountId,req.body.note)
                res.status(201).json({
                    success: true,
                    data: a
                });
            } catch (error) {
                console.error('Error creating note:', error);
                res.status(500).json({
                    success: false,
                    error: error instanceof Error ? error.message : 'An unknown error occurred'
                });
            }
        }
    /**
     * @route   GET /api/coordinators/dashboard 
     * @desc    Get upcoming events
     * @returns {Array} List of upcoming events
     */
    getUpcomingEvents = async (req: Request, res: Response): Promise<void> => { 
        try {
            const upcomingEvents = await this.eventService.getUpcomingEvents();
            
            if (!upcomingEvents) {
                res.status(404).json({
                    success: false,
                    message: 'No upcoming events found'
                });
                return;
            }

            res.status(200).json({  // Explicitly set 200 status
                success: true,
                data: upcomingEvents
            });
        } catch (error) {
            console.error('Error fetching upcoming events:', error);
            
            // More specific error handling
            if (error instanceof Error) {
                if (error.message.includes('database')) {  // Adjust based on your error types
                    res.status(503).json({
                        success: false,
                        error: 'Database service unavailable'
                    });
                    return;
                }
            }

            res.status(500).json({
                success: false,
                error: error instanceof Error ? error.message : 'An unknown error occurred'
            });
        }
    }

    getAllEvents = async (req: Request, res: Response): Promise<void> => {
        try {
            const events = await this.eventService.getAllEvents();
            res.json({
                success: true,
                data: events
            });
        } catch (error) {
            console.error('Error fetching all events:', error);
            res.status(500).json({
                success: false,
                error: error instanceof Error ? error.message : 'An unknown error occurred'
            });
        }
    }


    getEventsByStatus = async (req: Request, res: Response) => {
        try {
            const events = await this.eventService.getEventsByStatus();
            res.json({
                success: true,
                data: events
            });
        } catch (error) {
            console.error('Error getting events by status:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to get events by status'
            });
        }
    }

}

