import React, { useState, useEffect } from 'react';
import { getReports, updateInspectionResult, generateReport } from '../../api/reports';
import { getViolationTypes } from '../../api/reports';
import styles from './ReportsTable.module.css';
import ReportModal from '../ReportModal/ReportModal';
import { useAuth } from '../../context/AuthContext';

const ReportsTable = () => {
    const { userRole } = useAuth();
    const [selectedReports, setSelectedReports] = useState([]);
    const [reports, setReports] = useState([]);
    const [violationTypes, setViolationTypes] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleReportClick = (element) => { 
        const reportId = +element.target.closest('tr').dataset.id;
        if (selectedReports.includes(reportId)) {
            setSelectedReports((prev) => prev.filter((id) => id !== reportId));
        } else {
            setSelectedReports((prev) => [...prev, reportId]);
        }
    };

    const fetchData = async () => {
        try {
            setLoading(true);
            // Параллельно получаем отчеты и типы нарушений
            const [reportsData, typesData] = await Promise.all([
                getReports(),
                getViolationTypes()
            ]);
            
            // Преобразуем массив типов в объект для быстрого доступа
            const typesMap = {};
            typesData.forEach(type => {
                typesMap[type.id] = type.name;
            });
            
            setViolationTypes(typesMap);
            setReports(reportsData);
            setError(null);
        } catch (err) {
            console.error('Ошибка при загрузке данных:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const inseptionButtonHandler = async () => {
        try {
            await Promise.all(selectedReports.map(async (reportId) => {
                const report = reports.find(report => report.id === reportId);
                if (report.inspectionResult === 'Выявлено') return;
                await updateInspectionResult(reportId, 'Выявлено');
            }));
            await fetchData();
        } catch (error) {
            console.error('Ошибка при обновлении отчета:', error);
            if (error.message.includes('403')) {
                setError('У вас нет прав для выполнения этого действия');
            } else {
                setError('Ошибка при обновлении отчета: ' + error.message);
            }
        }
    }

    const nonInspectionButtonHandler = async () => {
        try {
            await Promise.all(selectedReports.map(async (reportId) => {
                const report = reports.find(report => report.id === reportId);
                if (report.inspectionResult === 'Не выявлено') return;
                await updateInspectionResult(reportId, 'Не выявлено');
            }));
            await fetchData();
        } catch (error) {
            console.error('Ошибка при обновлении отчета:', error);
            if (error.message.includes('403')) {
                setError('У вас нет прав для выполнения этого действия');
            } else {
                setError('Ошибка при обновлении отчета: ' + error.message);
            }
        }
    }

    const handleGenerateReport = async (dateRange) => {
        try {
            const startDate = new Date(dateRange.startDate);
            const endDate = new Date(dateRange.endDate);
            
            // Устанавливаем время на конец дня для endDate
            endDate.setHours(23, 59, 59, 999);
            
            await generateReport(startDate, endDate);
        } catch (error) {
            if (error.message.includes('403')) {
                setError('У вас нет прав для формирования отчета');
            } else {
                console.error('Ошибка при формировании отчета:', error);
                setError('Ошибка при формировании отчета');
            }
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    if (loading) {
        return <div className={styles.loading}>Загрузка...</div>;
    }

    if (error) {
        return <div className={styles.error}>{error}</div>;
    }

    return (
        <div className={styles.tableContainer}>
            {reports.length > 0 ? (<>
            <div className={styles.tableHeader}>
                <h2>Список обращений</h2>
                <div className={styles.tableHeaderButtons}>
                    <button 
                        className={`${styles.tableHeaderButton} ${styles.getReport}`}
                        onClick={() => setIsModalOpen(true)}
                    >
                        <span>Сформировать отчет</span>
                    </button>
                    <button
                        className={`${styles.tableHeaderButton} ${styles.inspection}`}
                        onClick={inseptionButtonHandler}
                        disabled={selectedReports.length === 0}
                    >
                        <span>➕</span>
                    </button>
                    <button
                        className={`${styles.tableHeaderButton} ${styles.nonInspection}`}
                        onClick={nonInspectionButtonHandler}
                        disabled={selectedReports.length === 0}
                    >
                        <span>➖</span>
                    </button>
                </div>
            </div>
            <table className={styles.table}>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Характер выявленного нарушения</th>
                        <th>Результат проверки</th>
                        <th>Дата обращения</th>
                    </tr>
                </thead>
                <tbody
                className={styles.tableBody}
                onClick={handleReportClick}>
                    {reports.sort((a,b)=>a.id-b.id).map((report) => (
                        <tr
                        key={report.id}
                        data-id={report.id}
                        className={selectedReports.includes(report.id) ? styles.selected : ''}>
                            <td>{report.id}</td>
                            <td>{violationTypes[report.violationType] || `Тип ${report.violationType}`}</td>
                            <td>{report.inspectionResult}</td>
                            <td>{new Date(report.applicationDate).toLocaleDateString()}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <ReportModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleGenerateReport}
            />
            </>
            ) : (
                <div className={styles.noReports}>
                    <p>Они будут появляться здесь</p>
                    <p>Пока что обращений нет.</p>
                </div>
            )}
        </div>
    );
};

export default ReportsTable; 