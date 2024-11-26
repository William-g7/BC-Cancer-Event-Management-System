import { api } from '../utils/api.ts';

interface LoginResponse {
    success: boolean;
    message?: string;
    data?: {
        id: number;
        name: string;
        password_hash: string;
        role: string;
        created_at: string;
    };
}

export class AuthService {
    async login(username: string, password: string): Promise<LoginResponse> {
        try {
            api.setUsername(username);
            const response = await api.post<LoginResponse>('/login', { username, password });
            if (response.success) {
                return { success: true, data: response.data };
            } else {
                return { success: false, message: 'Invalid response data' };
            }
        
        } catch (error) {
            console.error('Login failed:', error);
            return { success: false, message: 'Invalid User or Invalid Password! Please try it again!' };
        }
    }
}
   