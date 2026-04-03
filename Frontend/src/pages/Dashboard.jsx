import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Play, RefreshCw, Layers, Trash2 } from 'lucide-react';
import api from '../api';
import toast from 'react-hot-toast';
import { SkeletonGrid } from '../components/SkeletonLoader';

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
            toast.success("Target Successfully Initialized");
        } catch (err) {
            console.error(err);
            toast.error(err.response?.data?.message || "Failed to add target");
        }
    };

    const runTest = async (apiId) => {
        setRunningTest(apiId);
        try {
            await api.post(`/apis/${apiId}/test`);
            toast.success('Test active in Background. Waiting on Gemini...');
        } catch(err) {
            toast.error(err.response?.data?.message || 'Failed to queue test. Rate limit exceeded?');
        } finally {
            setRunningTest(null);
        }
    };

    const handleDeleteApi = async (apiId) => {
        if (!window.confirm("Are you sure you want to delete this target and all its AI reports?")) return;
        try {
            await api.delete(`/apis/${apiId}`);
            toast.success("Target wiped successfully.");
            fetchApis();
        } catch (err) {
            toast.error("Failed to delete target");
        }
    };

    if (loading) return <SkeletonGrid />;

    return (
        <div>
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
                <div className="glass-panel stagger-1" style={{ textAlign: 'center', padding: '80px 20px' }}>
                    <Layers size={56} color="var(--accent-neon)" style={{ marginBottom: '24px', filter: 'drop-shadow(0 0 10px var(--accent-neon-glow))' }} />
                    <h3 style={{ fontSize: '1.5rem' }}>No APIs Configured Yet</h3>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '32px', fontSize: '1.1rem' }}>Add your first target endpoint to initiate the AI engine.</p>
                    <button className="btn btn-primary" onClick={() => setShowModal(true)}>Deploy First Target</button>
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '32px' }}>
                    {apis.map((apiEndpoint, index) => (
                        <div key={apiEndpoint._id} className={`glass-panel genz-card stagger-${(index % 3) + 1}`} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <div>
                                    <h3 style={{ marginBottom: '12px', fontSize: '1.4rem' }}>{apiEndpoint.name}</h3>
                                    <span className={`badge badge-${apiEndpoint.method}`}>
                                        {apiEndpoint.method}
                                    </span>
                                </div>
                                <button 
                                    onClick={() => handleDeleteApi(apiEndpoint._id)} 
                                    style={{ background: 'var(--danger-glow)', border: '1px solid var(--danger)', color: 'var(--text-primary)', cursor: 'pointer', transition: 'all 0.2s', padding: '6px', borderRadius: '6px'}} 
                                    className="btn"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                            
                            <div style={{ background: 'rgba(0,0,0,0.5)', padding: '16px', borderRadius: 'var(--radius-md)', fontSize: '0.9rem', color: 'var(--text-primary)', border: '1px solid rgba(255,255,255,0.05)', letterSpacing: '0.5px' }}>
                                {apiEndpoint.url}
                            </div>
                            
                            <div style={{ display: 'flex', gap: '8px', marginTop: 'auto', flexWrap: 'wrap' }}>
                                <button 
                                    className="btn btn-primary" 
                                    style={{ flex: '1 1 100%' }}
                                    onClick={() => runTest(apiEndpoint._id)}
                                    disabled={runningTest === apiEndpoint._id}
                                >
                                    {runningTest === apiEndpoint._id ? <RefreshCw size={16} className="spin" /> : <Play size={16} />} 
                                    Run AI Test
                                </button>
                                <button className="btn btn-secondary" onClick={() => navigate(`/api/${apiEndpoint._id}/reports`)} style={{flex: 1}}>
                                    Reports
                                </button>
                                <button className="btn btn-secondary" onClick={() => navigate(`/api/${apiEndpoint._id}/docs`)} style={{ background: 'rgba(138, 43, 226, 0.1)', color: 'var(--accent-purple)', flex: 1}}>
                                    Docs
                                </button>
                                <button className="btn btn-secondary" onClick={() => navigate(`/api/${apiEndpoint._id}/analytics`)} style={{ background: 'rgba(255, 152, 0, 0.1)', color: 'var(--accent-orange)', flex: 1}}>
                                    Graph
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {showModal && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(5, 5, 8, 0.9)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000}}>
                    <div className="glass-panel stagger-1" style={{ width: '480px', border: '1px solid var(--accent-neon)', boxShadow: '0 0 50px rgba(0,255,204,0.1)' }}>
                        <h2 style={{ marginBottom: '32px', textAlign: 'center', fontSize: '1.8rem' }}>Initialize Target</h2>
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
