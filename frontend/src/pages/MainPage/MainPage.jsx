import React from 'react';
import { useNavigate } from 'react-router-dom';
import Container from '../../components/Container/Container';
import styles from './MainPage.module.css';
import ReportsTable from '../../components/ReportsTable/ReportsTable';

const MainPage = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        // Здесь будет логика выхода
        navigate('/auth');
    };

    return (
        <div className={styles.mainPage}>
            <main className={styles.content}>
                <ReportsTable />
            </main>
        </div>
    );
};

export default MainPage; 