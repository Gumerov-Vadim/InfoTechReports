import React, { useState, useEffect } from 'react';
import { getReports, updateInspectionResult, generateReport } from '../../api/reports';
import styles from './ReportsTable.module.css';
import ReportModal from '../ReportModal/ReportModal';

const ReportsTable = () => {

    const [selectedReports, setSelectedReports] = useState([]);

    const [reports, setReports] = useState([]);
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
    const inseptionButtonHandler = async () => {
        try {
            await Promise.all(selectedReports.map(async (reportId) => {
                const report = reports.find(report => report.id === reportId);
                if (report.inspectionResult === 'Выявлено') return;
                await updateInspectionResult(reportId, 'Выявлено');
            }));
            await fetchReports();
        } catch (error) {
            console.error('Ошибка при обновлении отчета:', error);
        }
    }
    const nonInspectionButtonHandler = async () => {
        try {
            await Promise.all(selectedReports.map(async (reportId) => {
                const report = reports.find(report => report.id === reportId);
                if (report.inspectionResult === 'Не выявлено') return;
                await updateInspectionResult(reportId, 'Не выявлено');
            }));
            await fetchReports();
        } catch (error) {
            console.error('Ошибка при обновлении отчета:', error);
        }
    }

    const fetchReports = async () => {
        try {
            setLoading(true);
            const data = await getReports();
            setReports(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleGenerateReport = async (dateRange) => {
        try {
            await generateReport(dateRange.startDate, dateRange.endDate);
            // Здесь можно добавить обработку успешного формирования отчета
            console.log('Отчет успешно сформирован');
        } catch (error) {
            console.error('Ошибка при формировании отчета:', error);
        }
    };

    useEffect(() => {
        fetchReports();
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
                        >
                            <span>➕</span>
                        </button>
                        <button
                        className={`${styles.tableHeaderButton} ${styles.nonInspection}`}
                        onClick={nonInspectionButtonHandler}
                        >
                            <span>➖</span>
                        </button>
                </div>
            </div><table className={styles.table}>
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
                            <td>{report.violationType}</td>
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