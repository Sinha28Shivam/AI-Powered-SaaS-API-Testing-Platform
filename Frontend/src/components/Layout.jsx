import React, { useContext } from 'react';
import { Outlet, useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Activity, LogOut, User } from 'lucide-react';

const Layout = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            {/* Top Navbar */}
            <nav style={{ 
                background: 'rgba(10, 10, 12, 0.8)', 
                backdropFilter: 'blur(12px)',
                borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                padding: '16px 32px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                position: 'sticky',
                top: 0,
                zIndex: 100
            }}>
                <Link to="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-primary)', textDecoration: 'none' }}>
                    <Activity size={24} color="var(--accent-neon)" />
                    <span style={{ fontWeight: 600, fontSize: '1.2rem', letterSpacing: '-0.02em' }}>AI Test Engine</span>
                </Link>

                <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                        
                        {/* Dynamic Role Badge */}
                        <span style={{ 
                            background: user.role === 'admin' ? 'var(--accent-purple-glow)' : 'rgba(255,255,255,0.1)', 
                            color: user.role === 'admin' ? '#dca3ff' : 'var(--text-primary)',
                            padding: '4px 8px', 
                            borderRadius: '4px', 
                            fontSize: '0.75rem', 
                            fontWeight: 'bold',
                            textTransform: 'uppercase',
                            letterSpacing: '1px'
                        }}>
                            {user.role}
                        </span>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <User size={16} />
                            <span>{user.email}</span>
                        </div>
                    </div>
                    
                    {/* Render Admin-Only button as an example */}
                    {user.role === 'admin' && (
                        <button className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '0.85rem' }}>
                            View Admin Panel
                        </button>
                    )}
                    
                    <button onClick={handleLogout} className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '0.85rem' }}>
                        <LogOut size={16} /> Logout
                    </button>
                </div>
            </nav>

            {/* Main Content Area */}
            <main style={{ flex: 1, padding: '40px 32px', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
                <Outlet />
            </main>
        </div>
    );
};

export default Layout;
