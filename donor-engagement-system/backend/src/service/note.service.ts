import { EventRepository } from '../repositories/event.repository';
import { Pool } from 'mysql2/promise';
import {DonorNotes} from "../types/note.types";
export class NoteService {
    constructor(private pool: Pool) {}

    getDonorNote(id: number): Promise<DonorNotes[] | null> {
        const eventRepository = new EventRepository(this.pool);
        return eventRepository.findNotes(id)
    }
}