import { Request, Response } from 'express';
import { Pool } from 'mysql2/promise';

export class AccountController {
    constructor(private pool: Pool) {}

    // GET /accounts
    async getAccounts(req: Request, res: Response) {
        res.json({ message: 'Hello, world!' });
    }
}

export default AccountController;