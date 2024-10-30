import { Request, Response } from 'express';
import pool from '../config/database';
import { Account } from '../types/account.types';

export const login = async (req: Request, res: Response) => {
    const { username } = req.body;

    try {
        console.log(username);
        // check if the username is in the database
        const [users] = await pool.query(
            'SELECT name FROM account WHERE name = ?',
            [username]
        ) as [Account[], any];

        const user = users[0];

        if (user) {
            return res.json({
                success: true,
                user: {
                    name: user.name,
                }
            });
        }

        return res.status(401).json({
            success: false,
            message: 'Invalid username'
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
}; 