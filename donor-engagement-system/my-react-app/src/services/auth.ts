import { api } from '../utils/api';

interface LoginResponse {
    success: boolean;
    message?: string;
    user?: {
        name: string;
    };
}

export const login = async (username: string) => {
    try {
        const response = await api.post<LoginResponse>('/auth/login', {
            username  
        });

        if (response.success && response.user) {
            // Set username for API requests
            api.setUsername(username);
            
            // Store username for persistence
            localStorage.setItem('username', username);
            
            return response.user;
        } else {
            throw new Error(response.message || 'Invalid username');
        }
    } catch (error) {
        console.error('Login error:', error);
        throw error;
    }
}; 