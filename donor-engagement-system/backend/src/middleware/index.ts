import { Request, Response, NextFunction } from 'express';

// Types
export interface CustomRequest extends Request {
    user?: {
        name: string;
        role: 'FUNDRAISER' | 'COORDINATOR';
    };
}

// Simple user role mapping
const USER_ROLES: Record<string, 'FUNDRAISER' | 'COORDINATOR'> = {
    'john': 'FUNDRAISER',
    'emma': 'COORDINATOR',
    'sarah': 'FUNDRAISER'
};

// Check user from header
export const checkUser = (req: CustomRequest, res: Response, next: NextFunction) => {
    const username = req.headers['x-user-name'] as string;

    if (!username || !USER_ROLES[username]) {
        return res.status(401).json({ 
            success: false, 
            message: 'Invalid user' 
        });
    }

    // Add user info to request
    req.user = {
        name: username,
        role: USER_ROLES[username]
    };

    next();
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
