import { EventRepository } from '../repositories/event.repository';
import { Pool } from 'mysql2/promise';
import {DonorNotes} from "../types/note.types";
export class NoteService {
    constructor(private pool: Pool) {}

    getDonorNote(id: number): Promise<DonorNotes[] | null> {
        const eventRepository = new EventRepository(this.pool);
        return eventRepository.findNotes(id)
    }
    async addDonorNote(donor_id:number,account_id:number,note:string): Promise<void> {
        const eventRepository = new EventRepository(this.pool);
        return eventRepository.addNotes(donor_id,account_id,note);
    }
}