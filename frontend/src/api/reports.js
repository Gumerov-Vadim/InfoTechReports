import axiosInstance from './axiosInstance';

/**
 * Типы данных
 * @typedef {Object} Report
 * @property {number} id - ID отчета
 * @property {string} violationType - Тип нарушения
 * @property {string} inspectionResult - Результат проверки
 * @property {Date} applicationDate - Дата заявки
 */

/**
 * Обработка ошибок API
 * @param {Error} error - Ошибка
 * @returns {Error} Обработанная ошибка
 */
const handleApiError = (error) => {
    if (error.response?.status === 403) {
        return new Error('403');
    }
    return new Error(error.response?.data || 'Произошла ошибка при выполнении запроса');
};

/**
 * Получение списка всех отчетов
 * @returns {Promise<Report[]>} - Список отчетов
 */
export const getReports = async () => {
    try {
        const response = await axiosInstance.get('/api/reports');
        return response.data;
    } catch (error) {
        throw handleApiError(error);
    }
};

/**
 * Получение отчета по ID
 * @param {number} id - ID отчета
 * @returns {Promise<Report>} - Данные отчета
 */
export const getReport = async (id) => {
    try {
        const response = await axiosInstance.get(`/api/reports/${id}`);
        return response.data;
    } catch (error) {
        throw handleApiError(error);
    }
};

/**
 * Создание нового отчета
 * @param {Omit<Report, 'id'>} reportData - Данные для создания отчета
 * @returns {Promise<Report>} - Созданный отчет
 */
export const createReport = async (reportData) => {
    try {
        const response = await axiosInstance.post('/api/reports', reportData);
        return response.data;
    } catch (error) {
        throw handleApiError(error);
    }
};

/**
 * Обновление результата проверки
 * @param {number} id - ID отчета
 * @param {string} newResult - Новый результат проверки
 * @returns {Promise<Report>} - Обновленный отчет
 */
export const updateInspectionResult = async (id, newResult) => {
    try {
        const response = await axiosInstance.put(`/api/reports/${id}/inspection-result`, newResult);
        return response.data;
    } catch (error) {
        throw handleApiError(error);
    }
};

/**
 * Удаление отчета
 * @param {number} id - ID отчета
 * @returns {Promise<void>}
 */
export const deleteReport = async (id) => {
    try {
        await axiosInstance.delete(`/api/reports/${id}`);
    } catch (error) {
        throw handleApiError(error);
    }
};

/**
 * Генерация отчета за период
 * @param {Date} startDate - Начальная дата
 * @param {Date} endDate - Конечная дата
 * @returns {Promise<Blob>} - Сгенерированный документ Word
 */
export const generateReport = async (startDate, endDate) => {
    try {
        const response = await axiosInstance.get('/api/reports/generate-report', {
            params: {
                startDate: startDate.toISOString(),
                endDate: endDate.toISOString()
            },
            responseType: 'blob'
        });
        
        // Проверяем, является ли ответ ошибкой
        if (response.data instanceof Blob && response.data.type === 'application/json') {
            const errorText = await response.data.text();
            throw new Error(errorText || 'Ошибка при генерации отчета');
        }
        
        // Создаем URL для скачивания файла
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `Отчет_${startDate.toISOString().split('T')[0]}_${endDate.toISOString().split('T')[0]}.docx`);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
        
        return response.data;
    } catch (error) {
        throw handleApiError(error);
    }
}; 