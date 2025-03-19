import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './AuthButton.module.css';
import { useAuth } from '../../context/AuthContext';

const AuthButton = () => {
    const navigate = useNavigate();
    const { isAuthenticated, isLoading, logout } = useAuth();

    const handleClick = () => {
        if (isAuthenticated) {
            logout();
            navigate('/auth');
        } else {
            navigate('/auth');
        }
    };

    return (
        <button 
            className={`${styles.authButton} ${isLoading ? styles.loading : ''}`} 
            onClick={handleClick}
            disabled={isLoading}
        >
            {isLoading ? (
                <span className={styles.loadingSpinner}></span>
            ) : (
                isAuthenticated ? 'Выход' : 'Вход'
            )}
        </button>
    );
};

export default AuthButton;
