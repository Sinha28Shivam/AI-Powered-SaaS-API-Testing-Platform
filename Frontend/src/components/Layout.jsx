import React, { useContext } from 'react';
import { Outlet, useNavigate, Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Layout = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div style={{ display: 'flex', minHeight: '100vh', padding: '10px' }}>
            
            {/* Retro Sidebar Navigation */}
            <aside style={{ 
                width: '200px', 
                background: 'silver', 
                border: '5px ridge grey',
                marginRight: '20px',
                padding: '10px',
                height: 'calc(100vh - 20px)',
                position: 'sticky',
                top: '10px'
            }}>
                <div style={{ borderBottom: '2px solid black', paddingBottom: '10px', marginBottom: '20px', textAlign: 'center' }}>
                    <h3 style={{ color: 'red' }}>Aura API Engine</h3>
                </div>

                <ul style={{ listStyleType: 'square', paddingLeft: '20px', marginBottom: '20px' }}>
                    <li>
                        <Link to="/dashboard" style={{ fontWeight: 'bold' }}>Dashboard</Link>
                    </li>
                </ul>

                <hr />
                
                <div style={{ marginTop: '20px', fontSize: '0.9rem', color: 'black' }}>
                    <p><b>User:</b> {user.email}</p>
                    <p><b>Role:</b> {user.role}</p>
                    <button onClick={handleLogout} className="btn" style={{ width: '100%', marginTop: '10px' }}>
                        Logout Now
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <main style={{ flex: 1, border: '5px ridge grey', background: 'silver', padding: '20px', color: 'black' }}>
                <Outlet />
            </main>
        </div>
    );
};

export default Layout;
