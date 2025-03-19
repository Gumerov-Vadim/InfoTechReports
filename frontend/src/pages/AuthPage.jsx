import React from 'react';
import { useNavigate } from 'react-router-dom';

const AuthPage = () => {
    const navigate = useNavigate();

    const handleLogin = () => {
        // Здесь будет логика авторизации
        navigate('/');
    };

    return (
        <div className="auth-page">
            <h1>Авторизация</h1>
            {/* Здесь будет форма авторизации/регистрации */}
            <button onClick={handleLogin}>Войти</button>
        </div>
    );
};

export default AuthPage; 