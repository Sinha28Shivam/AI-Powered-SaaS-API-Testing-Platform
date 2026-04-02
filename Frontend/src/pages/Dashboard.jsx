import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Play, RefreshCw, Layers } from 'lucide-react';
import api from '../api';

const Dashboard = () => {
    const navigate = useNavigate();
    const [apis, setApis] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    
    // Form state
    const [name, setName] = useState('');
    const [url, setUrl] = useState('');
    const [method, setMethod] = useState('GET');
    const [headers, setHeaders] = useState('{\n  "Content-Type": "application/json"\n}');
    const [body, setBody] = useState('{\n  \n}');
    const [toast, setToast] = useState(null);
    
    // Testing state
    const [runningTest, setRunningTest] = useState(null);

    const fetchApis = async () => {
        try {
            const res = await api.get('/apis');
            setApis(res.data);
        } catch (err) {
            console.error("Failed to fetch apis", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchApis();
    }, []);

    const handleAddApi = async (e) => {
        e.preventDefault();
        try {
            await api.post('/apis/add', { name, url, method, headers, body });
            setShowModal(false);
            setName('');
            setUrl('');
            setMethod('GET');
            setHeaders('{\n  "Content-Type": "application/json"\n}');
            setBody('{\n  \n}');
            fetchApis();
        } catch (err) {
            console.error(err);
        }
    };

    const runTest = async (apiId) => {
        setRunningTest(apiId);
        try {
            await api.post(`/apis/${apiId}/test`);
            setToast('Test started in background! Check reports shortly.');
            setTimeout(() => setToast(null), 3000);
        } catch(err) {
            setToast('Failed to queue test');
            setTimeout(() => setToast(null), 3000);
        } finally {
            setRunningTest(null);
        }
    };

    if (loading) return <div style={{ display: 'flex', justifyContent: 'center', marginTop: '100px'}}><RefreshCw className="spin" /></div>;

    return (
        <div>
            {toast && (
                <div style={{ position: 'fixed', top: 20, right: 32, background: 'var(--accent-neon)', color: '#000', padding: '12px 24px', borderRadius: 'var(--radius-sm)', fontWeight: 600, zIndex: 1000, boxShadow: '0 4px 12px rgba(0,0,0,0.3)', animation: 'fadeIn 0.3s ease'}}>
                    {toast}
                </div>
            )}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                <div>
                    <h1 style={{ fontSize: '2rem', marginBottom: '8px' }}>Your APIs</h1>
                    <p style={{ color: 'var(--text-secondary)' }}>Manage and test your API endpoints using AI.</p>
                </div>
                <button className="btn btn-primary" onClick={() => setShowModal(true)}>
                    <Plus size={18} /> Add New API
                </button>
            </div>

            {apis.length === 0 ? (
                <div className="glass-panel" style={{ textAlign: 'center', padding: '64px 20px' }}>
                    <Layers size={48} color="var(--text-secondary)" style={{ marginBottom: '16px' }} />
                    <h3>No APIs Confirgured Yet</h3>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>Add your first endpoint to start the AI analysis.</p>
                    <button className="btn btn-secondary" onClick={() => setShowModal(true)}>Add an API</button>
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '24px' }}>
                    {apis.map(apiEndpoint => (
                        <div key={apiEndpoint._id} className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <div>
                                    <h3 style={{ marginBottom: '4px' }}>{apiEndpoint.name}</h3>
                                    <span style={{ 
                                        display: 'inline-block', 
                                        fontSize: '0.75rem', 
                                        padding: '2px 8px', 
                                        borderRadius: '4px', 
                                        background: 'rgba(255,255,255,0.1)',
                                        color: apiEndpoint.method === 'GET' ? 'var(--accent-neon)' : 'var(--accent-purple)',
                                        fontWeight: 'bold'
                                    }}>
                                        {apiEndpoint.method}
                                    </span>
                                </div>
                            </div>
                            
                            <div style={{ background: 'rgba(0,0,0,0.3)', padding: '12px', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem', color: 'var(--text-secondary)', overflowX: 'hidden', textOverflow: 'ellipsis' }}>
                                {apiEndpoint.url}
                            </div>
                            
                            <div style={{ display: 'flex', gap: '12px', marginTop: 'auto' }}>
                                <button 
                                    className="btn btn-primary" 
                                    style={{ flex: 1 }}
                                    onClick={() => runTest(apiEndpoint._id)}
                                    disabled={runningTest === apiEndpoint._id}
                                >
                                    {runningTest === apiEndpoint._id ? <RefreshCw size={16} className="spin" /> : <Play size={16} />} 
                                    Run AI Test
                                </button>
                                <button className="btn btn-secondary" onClick={() => navigate(`/api/${apiEndpoint._id}/reports`)}>
                                    Reports
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {showModal && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000}}>
                    <div className="glass-panel" style={{ width: '400px' }}>
                        <h2 style={{ marginBottom: '24px' }}>Add New API</h2>
                        <form onSubmit={handleAddApi}>
                            <div className="input-group">
                                <label>Internal Name</label>
                                <input required placeholder="e.g., Get All Users" value={name} onChange={e=>setName(e.target.value)} />
                            </div>
                            <div className="input-group">
                                <label>Target URL</label>
                                <input required type="url" placeholder="https://api.example.com/v1/users" value={url} onChange={e=>setUrl(e.target.value)} />
                            </div>
                            <div className="input-group">
                                <label>Method</label>
                                <select value={method} onChange={e=>setMethod(e.target.value)}>
                                    <option>GET</option>
                                    <option>POST</option>
                                    <option>PUT</option>
                                    <option>DELETE</option>
                                </select>
                            </div>
                            
                            <div className="input-group">
                                <label>Headers (JSON)</label>
                                <textarea rows={3} value={headers} onChange={e=>setHeaders(e.target.value)} style={{ fontFamily: 'monospace' }} />
                            </div>

                            {['POST', 'PUT', 'PATCH'].includes(method) && (
                                <div className="input-group">
                                    <label>Body Payload (JSON)</label>
                                    <textarea rows={4} value={body} onChange={e=>setBody(e.target.value)} style={{ fontFamily: 'monospace' }} />
                                </div>
                            )}
                            <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                                <button type="button" className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setShowModal(false)}>Cancel</button>
                                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Save Target</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
