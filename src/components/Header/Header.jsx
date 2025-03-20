import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Header.module.css';
import Container from '../Container/Container';
import AuthButton from '../AuthButton/AuthButton';

const Header = () => {
    const navigate = useNavigate();

    return (
        <header className={styles.header}>
            <Container>
                    <h1 
                        className={styles.headerTitle} 
                        onClick={() => navigate('/')}
                        style={{ cursor: 'pointer' }}
                    >
                        IT center
                    </h1>
                    <a target="_blank" href="https://icons8.com">icons by Icons8</a>
                    <a target="_blank" href="https://github.com/Gumerov-Vadim/InfoTechReports">github</a>
            </Container>
            <AuthButton />
        </header>
    );
};

export default Header;