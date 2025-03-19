import React from 'react';
import styles from './MainPage.module.css';
import ReportsTable from '../../components/ReportsTable/ReportsTable';

const MainPage = () => {

    return (
        <div className={styles.mainPage}>
            <main className={styles.content}>
                <ReportsTable />
            </main>
        </div>
    );
};

export default MainPage; 