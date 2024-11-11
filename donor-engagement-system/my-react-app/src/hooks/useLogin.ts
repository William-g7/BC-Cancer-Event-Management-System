import { useState } from 'react';
import { AuthService} from '../services/auth.ts';
import { useNavigate } from 'react-router-dom';

const useLogin = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const navigate  = useNavigate();
    const authService = new AuthService();  


    const handleLogin = async (username: string, password: string) => {
        try {
            setLoading(true);
            const response = await authService.login(username, password);
            if (response.success) {
                localStorage.setItem('user', JSON.stringify(response.user));
                // navigate to username/dashboard
                navigate('/' + username + '/dashboard'); // Redirect to the dashboard upon successful login
            } else {
                setError(response.message || 'Failed to login');
            }

        } catch (error) {
            console.error('Login error:', error);
            setError(error instanceof Error ? error.message : 'Failed to login');
        } finally {
            setLoading(false);
        }
    };

    return { loading, error, handleLogin };
}

export default useLogin;
