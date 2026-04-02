import React, { useContext } from 'react';
import { Outlet, useNavigate, Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Activity, LogOut, User, LayoutDashboard, BarChart2 } from 'lucide-react';

const Layout = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const isActive = (path) => location.pathname === path;

    return (
        <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-primary)' }}>
            
            {/* Sidebar Navigation */}
            <aside style={{ 
                width: '260px', 
                background: 'var(--bg-secondary)', 
                borderRight: '1px solid rgba(255, 255, 255, 0.05)', 
                display: 'flex',
                flexDirection: 'column',
                position: 'sticky',
                top: 0,
                height: '100vh',
                zIndex: 100
            }}>
                <div style={{ padding: '32px 24px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <Link to="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--text-primary)', textDecoration: 'none' }}>
                        <div style={{ background: 'var(--accent-neon-glow)', padding: '8px', borderRadius: '8px' }}>
                            <Activity size={24} color="var(--accent-neon)" />
                        </div>
                        <span style={{ fontWeight: 800, fontSize: '1.2rem', letterSpacing: '-0.02em', textTransform: 'uppercase' }}>AI Test Engine</span>
                    </Link>
                </div>

                <div style={{ padding: '24px 16px', flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <p style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '8px', paddingLeft: '8px' }}>Main Menu</p>
                    
                    <Link 
                        to="/dashboard" 
                        style={{ 
                            display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', borderRadius: 'var(--radius-sm)',
                            background: isActive('/dashboard') ? 'rgba(0,255,204,0.1)' : 'transparent',
                            color: isActive('/dashboard') ? 'var(--accent-neon)' : 'var(--text-secondary)',
                            fontWeight: isActive('/dashboard') ? 600 : 500,
                            transition: 'all var(--transition-fast)'
                        }}
                    >
                        <LayoutDashboard size={18} /> Target APIs
                    </Link>
                </div>

                <div style={{ padding: '24px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                    <div style={{ background: 'rgba(0,0,0,0.3)', padding: '16px', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(255,255,255,0.05)', marginBottom: '16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                            <User size={16} color="var(--text-secondary)" />
                            <span style={{ fontSize: '0.85rem', color: 'var(--text-primary)' }}>{user.email}</span>
                        </div>
                        <span style={{ 
                            background: user.role === 'admin' ? 'var(--accent-purple-glow)' : 'rgba(255,255,255,0.1)', 
                            color: user.role === 'admin' ? '#dca3ff' : 'var(--text-secondary)',
                            padding: '4px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px'
                        }}>
                            {user.role}
                        </span>
                    </div>
                    
                    <button onClick={handleLogout} className="btn btn-secondary" style={{ width: '100%', justifyContent: 'center' }}>
                        <LogOut size={16} /> Logout
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <main style={{ flex: 1, padding: '40px 48px', width: '100%' }}>
                <Outlet />
            </main>
        </div>
    );
};

export default Layout;
