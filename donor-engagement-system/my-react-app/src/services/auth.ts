import { api } from '../utils/api.ts';
import { useNavigate } from 'react-router-dom';

interface LoginResponse {
    success: boolean;
    message?: string;
    user?: {
        name: string;
    };
}

export class AuthService {
    async login(username: string, password: string): Promise<LoginResponse> {
        try {
            api.setUsername(username);
            console.log('Attempting to log in with:', { username, password }); // Debugging log
            const response = await api.post<LoginResponse>('/login', { username, password });
            console.log('Login response:', response); // Debugging log
            if (response.success) {
                return response;
            } 
        } catch (error) {
            console.error('Login failed:', error);
            return { success: false, message: 'Invalid User or Invalid Password! Please try it again!' };
        }
    }
}
   