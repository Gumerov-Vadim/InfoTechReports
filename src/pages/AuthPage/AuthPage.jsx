import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import styles from './AuthPage.module.css';

const AuthPage = () => {
    const navigate = useNavigate();
    const { login, register, error, isLoading } = useAuth();
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });
    const [localError, setLocalError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLocalError('');
            if (isLogin) {
                await login(formData.username, formData.password);
            } else {
                await register(formData.username, formData.password);
            }
            navigate('/');
        } catch (err) {
            // Очищаем пароль при ошибке
            setFormData(prev => ({ ...prev, password: '' }));
            setLocalError(err.message || 'Произошла ошибка при авторизации');
            console.error('Auth error:', err);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSwitchMode = () => {
        setIsLogin(!isLogin);
        setFormData({ username: '', password: '' });
        setLocalError('');
    };

    // Функция для перевода ошибок
    const translateError = (errorMessage) => {
        if (errorMessage.includes('Неверное имя пользователя или пароль')) 
            return 'Неверное имя пользователя или пароль';
        if (errorMessage.includes('Пользователь с таким именем уже существует')) 
            return 'Пользователь с таким именем уже существует';
        if (errorMessage.includes('Необходимо указать имя пользователя и пароль')) 
            return 'Необходимо указать имя пользователя и пароль';
        return errorMessage || 'Произошла ошибка при авторизации';
    };

    // Показываем локальную ошибку или ошибку из контекста
    const displayError = localError || error;

    return (
        <div className={styles.authPage}>
            <div className={styles.authForm}>
                <h1>{isLogin ? 'Вход' : 'Регистрация'}</h1>
                {displayError && (
                    <div className={styles.error}>
                        {translateError(displayError)}
                    </div>
                )}
                <form onSubmit={handleSubmit}>
                    <div className={styles.formGroup}>
                        <label htmlFor="username">Имя пользователя:</label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            required
                            disabled={isLoading}
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label htmlFor="password">Пароль:</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            disabled={isLoading}
                        />
                    </div>
                    <button 
                        type="submit" 
                        className={styles.submitButton}
                        disabled={isLoading}
                    >
                        {isLoading ? 'Загрузка...' : (isLogin ? 'Войти' : 'Зарегистрироваться')}
                    </button>
                </form>
                <button 
                    onClick={handleSwitchMode}
                    className={styles.switchButton}
                    disabled={isLoading}
                >
                    {isLogin ? 'Создать аккаунт' : 'Уже есть аккаунт?'}
                </button>
            </div>
        </div>
    );
};

export default AuthPage;