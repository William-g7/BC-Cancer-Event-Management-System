import { Pool } from 'mysql2/promise';
import { Role, Account } from '../types/account.types';

export class AccountRepository {
    constructor(private pool: Pool) {}

    async findByUsername(username: string): Promise<Account | null> {
        try {
            const [accounts] = await this.pool.execute(`
                SELECT * FROM Accounts WHERE name = ?
            `, [username]) as [Account[], any];
            return accounts[0] || null;
        } catch (error) {
            console.error('Error fetching account by username:', error);
            throw new Error('Database query failed');
        }
    }


    async findByRole(role: Role): Promise<Account[]> {
        const [accounts] = await this.pool.execute(`
            SELECT * FROM Accounts WHERE role = ?
        `, [role]) as [Account[], any];
        return accounts;
    }
}
