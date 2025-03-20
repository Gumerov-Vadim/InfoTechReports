import React, { createContext, useContext, useState, useEffect } from 'react';
import { login as apiLogin, register as apiRegister } from '../api/auth';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        setIsAuthenticated(!!token);
        setIsLoading(false);
    }, []);

    const login = async (username, password) => {
        try {
            setIsLoading(true);
            setError(null);
            const response = await apiLogin({ username, password });
            localStorage.setItem('token', response.token);
            localStorage.setItem('userRole', response.role);
            setIsAuthenticated(true);
            return response;
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    const register = async (username, password) => {
        try {
            setIsLoading(true);
            setError(null);
            const response = await apiRegister({ username, password });
            localStorage.setItem('token', response.token);
            localStorage.setItem('userRole', response.role);
            setIsAuthenticated(true);
            return response;
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    const logout = () => {
        setIsLoading(true);
        localStorage.removeItem('token');
        localStorage.removeItem('userRole');
        setIsAuthenticated(false);
        setError(null);
        setIsLoading(false);
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, error, isLoading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}; 