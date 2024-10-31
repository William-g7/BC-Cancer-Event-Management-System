import { Router } from 'express';
import createNote from '../controllers/note.controller';
import getNotes from '../controllers/note.controller';
import getNoteById from '../controllers/note.controller';
import updateNote from '../controllers/note.controller';
import deleteNote from '../controllers/note.controller';

const router = Router();

// Create a new note
router.post('/notes', createNote);

// Get all notes
router.get('/notes', getNotes);

// Get a note by ID
router.get('/notes/:id', getNoteById);

// Update a note by ID
router.put('/notes/:id', updateNote);

// Delete a note by ID
router.delete('/notes/:id', deleteNote);

export default router;