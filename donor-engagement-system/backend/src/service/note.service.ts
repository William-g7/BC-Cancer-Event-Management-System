import { Pool } from 'mysql2/promise';
import { DonorNote } from '../types/note.types';
import { NoteRepository } from '../repositories/note.repository';

export class NoteService {
    constructor(private pool: Pool) {}

    async getNotesByDonorId(donorId: number): Promise<DonorNote[]> {
        const noteRepository = new NoteRepository(this.pool);
        return await noteRepository.findByDonorId(donorId);
    }

    async addNote(donorId: number, fundraiserId: number, noteContent: string): Promise<void> {
        const noteRepository = new NoteRepository(this.pool);
        await noteRepository.addNoteForDonor(donorId, fundraiserId, noteContent);
    }
}
