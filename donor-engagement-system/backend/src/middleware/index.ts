import { Request, Response, NextFunction } from 'express';
import { CustomRequest } from '../types/custom-request';
import pool from '../config/database';
import { Account } from '../types/account.types';

// Check user from header
export const checkUser = async (req: CustomRequest, res: Response, next: NextFunction) => {
    const username = req.headers['x-user-name'] as string;
     console.log('username:', username);


    if (!username) {
        return res.status(401).json({ 
            success: false, 
            message: 'Username is required' 
        });
    }
    
    try {
        // Find user in database using MySQL pool
        const [users] = await pool.query(
            'SELECT id, name, role FROM Accounts WHERE name = ?',
            [username]
        ) as [Account[], any];

        const user = users[0] as Account | undefined;
        console.log('user:', user);

        if (!user) {
            return res.status(401).json({ 
                success: false, 
                message: 'Invalid user' 
            });
        }

        // Add user info to request
        req.user = {
            id: user.id,
            name: user.name,
            role: user.role
        };

        next();
    } catch (error) {
        console.error('Database error details:', error);
        return res.status(500).json({ 
            success: false, 
            message: 'Database error',
            details: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};

// Basic error handler
export const errorHandler = (
    err: Error, 
    req: Request, 
    res: Response, 
    next: NextFunction
) => {
    console.error('Error:', err);
    res.status(500).json({ 
        success: false, 
        message: 'Internal Server Error' 
    });
};