import { Request, Response } from 'express';
import { LoginService } from '../service/loginService';
import { Pool } from 'mysql2/promise';



export class LoginController {
    constructor(
        private pool: Pool, 
        private loginService: LoginService, 
        
    ) {}


    /**
     * @route   POST /api/login
     * @desc    Login user
     * @param   req.body.username - Username
     * @param   req.body.password - Password
     * @returns {Object} User data
     */

    login = async (req: Request, res: Response): Promise<void> => {
        try {
            const { username, password } = req.body;
            console.log('username:', username);
            console.log('password:', password);
            const account = await this.loginService.login(username, password);


            if (!account) {
                res.status(401).json({
                    success: false,
                    error: 'Invalid username or password'
                });
                return;
            }

            res.json({
                success: true,
                data: account
            });
        } catch (error) {
            console.error('Error logging in:', error);
            res.status(500).json({
                success: false,
                error: error instanceof Error ? error.message : 'An unknown error occurred'
            });
        }
    }
}
