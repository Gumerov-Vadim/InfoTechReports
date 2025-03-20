import axiosInstance from './axiosInstance';

/**
 * Типы ответов от API
 * @typedef {Object} LoginResponse
 * @property {string} token - JWT токен
 * @property {string} role - Роль пользователя
 */

/**
 * Типы запросов к API
 * @typedef {Object} LoginRequest
 * @property {string} username - Имя пользователя
 * @property {string} password - Пароль
 */

/**
 * Авторизация пользователя
 * @param {LoginRequest} credentials - Данные для входа
 * @returns {Promise<LoginResponse>} - Ответ с токеном и ролью
 */
export const login = async (credentials) => {
    try {
        const response = await axiosInstance.post('/api/auth/login', credentials);
        const { token, role } = response.data;
        localStorage.setItem('token', token);
        localStorage.setItem('userRole', role);
        return response.data;
    } catch (error) {
        console.error('Ошибка авторизации:', error);
        if (error.response && error.response.data && error.response.data.error) {
            throw new Error(error.response.data.error);
        } else {
            throw new Error('Ошибка при входе в систему');
        }
    }
};

/**
 * Регистрация нового пользователя
 * @param {LoginRequest} userData - Данные для регистрации
 * @returns {Promise<LoginResponse>} - Ответ с токеном и ролью
 */
export const register = async (userData) => {
    try {
        const response = await axiosInstance.post('/api/auth/register', userData);
        const { token, role } = response.data;
        localStorage.setItem('token', token);
        localStorage.setItem('userRole', role);
        return response.data;
    } catch (error) {
        console.error('Ошибка регистрации:', error);
        if (error.response && error.response.data && error.response.data.error) {
            throw new Error(error.response.data.error);
        } else {
            throw new Error('Ошибка при регистрации');
        }
    }
};

/**
 * Выход из системы
 */
export const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
};

/**
 * Проверка авторизации пользователя
 * @returns {boolean} - Статус авторизации
 */
export const isAuthenticated = () => {
    return !!localStorage.getItem('token');
};

/**
 * Получение роли пользователя
 * @returns {string|null} - Роль пользователя
 */
export const getUserRole = () => {
    return localStorage.getItem('userRole');
}; 