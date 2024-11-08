import { Pool } from 'mysql2/promise';
import { DonorNote } from '../types/note.types';

export class NoteRepository {
    constructor(private pool: Pool) {}

    // 根据捐赠者 ID 获取所有备注
    async findByDonorId(donorId: number): Promise<DonorNote[]> {
        try {
            const [notes] = await this.pool.execute(`
                SELECT id, donor_id, fundraiser_id, note, created_at FROM Notes WHERE donor_id = ?
            `, [donorId]) as [DonorNote[], any];
            return notes;
        } catch (error) {
            console.error('Error fetching notes by donor ID:', error);
            throw new Error('Database query failed');
        }
    }

    // 为特定捐赠者添加备注
    async addNoteForDonor(donorId: number, fundraiserId: number, note: string): Promise<void> {
        try {
            await this.pool.execute(`
                INSERT INTO Notes (donor_id, fundraiser_id, note, created_at) VALUES (?, ?, ?, NOW())
            `, [donorId, fundraiserId, note]);
        } catch (error) {
            console.error('Error adding note for donor:', error);
            throw new Error('Database query failed');
        }
    }
}
