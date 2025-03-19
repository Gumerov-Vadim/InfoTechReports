import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import AuthPage from './pages/AuthPage/AuthPage';
import MainPage from './pages/MainPage/MainPage';
import Header from './components/Header/Header';

const App = () => {

    const pageStyle = {
      height: `calc(100vh - var(--header-height))`,
      width: `100vw`,
    }

    return (
        <AuthProvider>
            <Router>
                <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  width: `100vw`,
                }}
                className="app">
                    <Header />
                    <Routes>
                        <Route style={pageStyle} path="/auth" element={<AuthPage />} />
                        <Route style={pageStyle} path="/" element={<MainPage />} />
                    </Routes>
                </div>
            </Router>
        </AuthProvider>
    );
};

export default App;
