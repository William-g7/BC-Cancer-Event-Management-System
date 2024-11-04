import { Request, Response } from 'express';
import { NoteService } from '../service/note.service';
import { CustomRequest } from '../types/custom-request';

export class NoteController {
    constructor(private noteService: NoteService) {}

    /**
     * @route   GET /api/notes/:donorId
     * @desc    Get all notes for a specific donor
     * @param   req.params.donorId - Donor ID
     * @returns {Array} List of notes for the donor
     */
    getNotesByDonorId = async (req: CustomRequest, res: Response): Promise<void> => {
        try {
            const donorId = parseInt(req.params.donorId);
            const notes = await this.noteService.getNotesByDonorId(donorId);

            res.json({
                success: true,
                data: notes
            });
        } catch (error) {
            console.error('Error fetching notes by donor ID:', error);
            res.status(500).json({
                success: false,
                error: error instanceof Error ? error.message : 'An unknown error occurred'
            });
        }
    };

    /**
     * @route   POST /api/notes
     * @desc    Add a new note for a specific donor and fundraiser
     * @param   req.body.donorId - Donor ID
     * @param   req.body.fundraiserId - Fundraiser ID
     * @param   req.body.noteContent - Content of the note
     * @returns {Object} Success message
     */
    addNote = async (req: CustomRequest, res: Response): Promise<void> => {
        try {
            const { donorId, fundraiserId, noteContent } = req.body;
            await this.noteService.addNote(donorId, fundraiserId, noteContent);

            res.status(201).json({
                success: true,
                message: 'Note added successfully'
            });
        } catch (error) {
            console.error('Error adding note:', error);
            res.status(500).json({
                success: false,
                error: error instanceof Error ? error.message : 'An unknown error occurred'
            });
        }
    };
}
