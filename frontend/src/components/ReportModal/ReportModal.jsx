import React, { useState } from 'react';
import styles from './ReportModal.module.css';

const ReportModal = ({ isOpen, onClose, onSubmit }) => {
    const [dateRange, setDateRange] = useState({
        startDate: '',
        endDate: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(dateRange);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                <h2>Выберите период</h2>
                <form onSubmit={handleSubmit}>
                    <div className={styles.formGroup}>
                        <label htmlFor="startDate">С</label>
                        <input
                            type="date"
                            id="startDate"
                            value={dateRange.startDate}
                            onChange={(e) => setDateRange(prev => ({ ...prev, startDate: e.target.value }))}
                            required
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label htmlFor="endDate">по</label>
                        <input
                            type="date"
                            id="endDate"
                            value={dateRange.endDate}
                            onChange={(e) => setDateRange(prev => ({ ...prev, endDate: e.target.value }))}
                            required
                        />
                    </div>
                    <div className={styles.modalButtons}>
                        <button type="submit" className={styles.submitButton}>
                            Сформировать
                        </button>
                        <button type="button" className={styles.cancelButton} onClick={onClose}>
                            Отмена
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ReportModal; 