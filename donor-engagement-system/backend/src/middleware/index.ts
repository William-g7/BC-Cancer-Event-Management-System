import { Request, Response, NextFunction } from 'express';
import { CustomRequest } from '../types/custom-request';
import pool from '../config/database';
import { Account } from '../types/account.types';

// Check user from header
export const checkUser = async (req: CustomRequest, res: Response, next: NextFunction) => {
    const startTime = process.hrtime();
    console.log(`\n[${new Date().toISOString()}] Middleware: checkUser started`);
    console.log('Request URL:', req.url);
    console.log('Request headers:', req.headers);
    
    const username = req.headers['x-user-name'] as string;

    if (!username) {
        console.log('Authentication failed: No username provided');
        return res.status(401).json({ 
            success: false, 
            message: 'Username is required' 
        });
    }
    
    try {
        console.log('Attempting database query for user:', username);
        
        // Find user in database using MySQL pool
        const [users] = await pool.query(
            'SELECT id, name, role FROM Accounts WHERE name = ?',
            [username]
        ) as [Account[], any];

        const user = users[0] as Account | undefined;

        if (!user) {
            console.log('Authentication failed: User not found in database');
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
        
        const endTime = process.hrtime(startTime);
        const duration = (endTime[0] * 1000 + endTime[1] / 1000000).toFixed(2);
        console.log(`User authenticated: ${JSON.stringify(req.user)}`);
        console.log(`Middleware execution time: ${duration}ms`);

        next();
    } catch (error) {
        const endTime = process.hrtime(startTime);
        const duration = (endTime[0] * 1000 + endTime[1] / 1000000).toFixed(2);
        console.error('Database error after', duration, 'ms:', error);
        console.error('Stack trace:', error instanceof Error ? error.stack : 'No stack trace');
        
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