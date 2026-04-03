import React, { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Layout from './components/Layout';
import Reports from './pages/Reports';
import Docs from './pages/Docs';
import Analytics from './pages/Analytics';
import { Toaster } from 'react-hot-toast';

const ProtectedRoute = ({ children }) => {
    const { user } = useContext(AuthContext);
    if (!user) return <Navigate to="/login" replace />;
    return children;
};

const App = () => {
    return (
        <>
            <Toaster 
                position="top-right" 
                toastOptions={{ 
                    style: { background: 'var(--bg-panel)', color: 'var(--text-primary)', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)' } 
                }} 
            />
            <Routes>
                <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                    
                    <Route path="/" element={
                        <ProtectedRoute>
                            <Layout />
                        </ProtectedRoute>
                    }>
                        <Route index element={<Navigate to="/dashboard" replace />} />
                        <Route path="dashboard" element={<Dashboard />} />
                        <Route path="api/:id/reports" element={<Reports />} />
                        <Route path="api/:id/docs" element={<Docs />} />
                        <Route path="api/:id/analytics" element={<Analytics />} />
                    </Route>

                <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
        </>
    );
};

export default App;
