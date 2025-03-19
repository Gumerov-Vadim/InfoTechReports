import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AuthPage from './pages/AuthPage';
import MainPage from './pages/MainPage';
import './App.css';

const App = () => {
    return (
        <Router>
            <div className="app">
                <Routes>
                    <Route path="/auth" element={<AuthPage />} />
                    <Route path="/" element={<MainPage />} />
                </Routes>
            </div>
        </Router>
    );
};

export default App;
