import { Note } from '../models/note.model';
import { NoteRepository } from '../repositories/note.repository';

export class NoteService {
    private noteRepository: NoteRepository;

    constructor(noteRepository: NoteRepository) {
        this.noteRepository = noteRepository;
    }

    async createNote(note: Note): Promise<Note> {
        return this.noteRepository.create(note);
    }

    async getNoteById(noteId: string): Promise<Note | null> {
        return this.noteRepository.findById(noteId);
    }

    async updateNote(noteId: string, note: Partial<Note>): Promise<Note | null> {
        return this.noteRepository.update(noteId, note);
    }

    async deleteNote(noteId: string): Promise<boolean> {
        return this.noteRepository.delete(noteId);
    }

    async getAllNotes(): Promise<Note[]> {
        return this.noteRepository.findAll();
    }
}