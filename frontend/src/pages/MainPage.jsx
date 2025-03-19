import React from 'react';
import { useNavigate } from 'react-router-dom';

const MainPage = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        // Здесь будет логика выхода
        navigate('/auth');
    };

    return (
        <div className="main-page">
            <h1>Главная страница</h1>
            <button onClick={handleLogout}>Выйти</button>
            {/* Здесь будет основной контент приложения */}
        </div>
    );
};

export default MainPage; 