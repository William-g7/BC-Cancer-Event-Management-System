import { EntityRepository, Repository } from 'typeorm';
import { Note } from '../entities/note.entity';

@EntityRepository(Note)
export class NoteRepository extends Repository<Note> {
    async findByTitle(title: string): Promise<Note | undefined> {
        return this.findOne({ where: { title } });
    }

    async createNote(noteData: Partial<Note>): Promise<Note> {
        const note = this.create(noteData);
        return this.save(note);
    }

    async updateNote(id: number, noteData: Partial<Note>): Promise<Note> {
        await this.update(id, noteData);
        return this.findOne(id);
    }

    async deleteNote(id: number): Promise<void> {
        await this.delete(id);
    }
}