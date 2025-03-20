import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5119',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Интерцептор для добавления токена к запросам
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        const userRole = localStorage.getItem('userRole');
        
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
            
            // Добавляем роль пользователя в заголовок для мокового API
            if (userRole) {
                config.headers['X-User-Role'] = userRole;
            }
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Интерцептор для обработки ошибок
axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Очищаем токен и перенаправляем на страницу авторизации
            localStorage.removeItem('token');
            localStorage.removeItem('userRole');
        }
        return Promise.reject(error);
    }
);

export default axiosInstance; 