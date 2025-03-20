import { useState, useEffect } from 'react';
import { login as apiLogin, register as apiRegister } from '../api/auth';

export const useAuth = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Проверяем наличие токена при загрузке
        const token = localStorage.getItem('token');
        setIsAuthenticated(!!token);
    }, []);

    const login = async (username, password) => {
        try {
            setError(null);
            const response = await apiLogin({ username, password });
            localStorage.setItem('token', response.token);
            localStorage.setItem('userRole', response.role);
            setIsAuthenticated(true);
            return response;
        } catch (err) {
            setError(err.message);
            throw err;
        }
    };

    const register = async (username, password) => {
        try {
            setError(null);
            const response = await apiRegister({ username, password });
            localStorage.setItem('token', response.token);
            localStorage.setItem('userRole', response.role);
            setIsAuthenticated(true);
            return response;
        } catch (err) {
            setError(err.message);
            throw err;
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userRole');
        setIsAuthenticated(false);
        setError(null);
    };

    return { isAuthenticated, error, login, register, logout };
}; 