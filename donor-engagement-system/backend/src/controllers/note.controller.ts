import { Request, Response } from 'express';
import Note from '../models/note.model';
import { EventService } from '../service/event.service';
import { FundraiserService } from '../service/fundraiser.service';
import { CustomRequest } from '../types/custom-request';

class NoteController {
    private eventService: EventService;
    private fundraiserService: FundraiserService;

    constructor() {
        this.eventService = new EventService(pool);
        this.fundraiserService = new FundraiserService();
    }

    // Get all notes
    public async getAllNotes(req: Request, res: Response): Promise<void> {
        try {
            const notes = await Note.find();
            res.status(200).json(notes);
        } catch (error) {
            res.status(500).json({ message: 'Error fetching notes', error });
        }
    }

    // Get a single note by ID
    public async getNoteById(req: Request, res: Response): Promise<void> {
        try {
            const note = await Note.findById(req.params.id);
            if (note) {
                res.status(200).json(note);
            } else {
                res.status(404).json({ message: 'Note not found' });
            }
        } catch (error) {
            res.status(500).json({ message: 'Error fetching note', error });
        }
    }

    // Create a new note
    public async createNote(req: Request, res: Response): Promise<void> {
        try {
            const newNote = new Note(req.body);
            const savedNote = await newNote.save();
            res.status(201).json(savedNote);
        } catch (error) {
            res.status(500).json({ message: 'Error creating note', error });
        }
    }

    // Update an existing note
    public async updateNote(req: Request, res: Response): Promise<void> {
        try {
            const updatedNote = await Note.findByIdAndUpdate(req.params.id, req.body, { new: true });
            if (updatedNote) {
                res.status(200).json(updatedNote);
            } else {
                res.status(404).json({ message: 'Note not found' });
            }
        } catch (error) {
            res.status(500).json({ message: 'Error updating note', error });
        }
    }

    // Delete a note
    public async deleteNote(req: Request, res: Response): Promise<void> {
        try {
            const deletedNote = await Note.findByIdAndDelete(req.params.id);
            if (deletedNote) {
                res.status(200).json({ message: 'Note deleted successfully' });
            } else {
                res.status(404).json({ message: 'Note not found' });
            }
        } catch (error) {
            res.status(500).json({ message: 'Error deleting note', error });
        }
    }
}

export default new NoteController();