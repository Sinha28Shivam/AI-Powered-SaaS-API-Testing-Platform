import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../api';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const res = await api.post('/auth/login', { email, password });
            login(res.data.token);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to login');
        }
    };

    return (
        <div style={{ backgroundColor: 'black', backgroundImage: "url('https://web.archive.org/web/20091027054942im_/http://www.geocities.com/Tokyo/Towers/4417/stars.gif')", color: 'white', fontFamily: '"Times New Roman", Times, serif', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <div style={{ border: '5px ridge grey', backgroundColor: 'silver', color: 'black', padding: '20px', width: '400px' }}>
                <h2 style={{ textAlign: 'center', borderBottom: '2px solid black', paddingBottom: '10px' }}>Member Login</h2>
                
                {error && <div style={{ color: 'red', fontWeight: 'bold', border: '2px solid red', padding: '5px', margin: '10px 0', backgroundColor: 'yellow' }}>ERROR: {error}</div>}
                
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '20px' }}>
                    <div>
                        <label style={{ fontWeight: 'bold' }}>E-Mail Address:</label><br/>
                        <input type="email" value={email} onChange={e=>setEmail(e.target.value)} required style={{ border: '2px inset #fff', width: '100%', padding: '5px' }} />
                    </div>
                    <div>
                        <label style={{ fontWeight: 'bold' }}>Secret Password:</label><br/>
                        <input type="password" value={password} onChange={e=>setPassword(e.target.value)} required style={{ border: '2px inset #fff', width: '100%', padding: '5px' }} />
                    </div>
                    
                    <button type="submit" style={{ border: '4px outset white', backgroundColor: '#e0e0e0', fontWeight: 'bold', padding: '5px', cursor: 'pointer' }}>Submit Query</button>
                </form>
                
                <hr style={{ margin: '20px 0' }}/>
                <div style={{ textAlign: 'center', fontSize: '0.9rem' }}>
                    Not a member yet? <Link to="/signup" style={{ color: 'blue' }}>Click here to register!</Link>
                </div>
            </div>
        </div>
    );
};

export default Login;
