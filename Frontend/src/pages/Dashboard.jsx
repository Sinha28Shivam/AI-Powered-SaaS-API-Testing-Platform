import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
            toast.success('Test active in Background. Waiting on Server...');
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
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px dashed black', paddingBottom: '10px', marginBottom: '20px' }}>
                <div>
                    <h1 style={{ color: 'blue' }}>API Directory</h1>
                    <p><i>Manage and test your API endpoints using the World Wide Web.</i></p>
                </div>
                <button className="btn" onClick={() => setShowModal(true)}>
                    + Add New API URL
                </button>
            </div>

            {apis.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '50px', border: '3px inset grey', background: '#e0e0e0' }}>
                    <h3 style={{ color: 'red' }}>Error 404: No APIs Found</h3>
                    <p>Click the button above to add your first target URL.</p>
                </div>
            ) : (
                <table border="1" cellPadding="10" style={{ width: '100%', backgroundColor: 'white', borderCollapse: 'collapse', border: '3px outset grey' }}>
                    <thead>
                        <tr style={{ backgroundColor: 'silver' }}>
                            <th>Name</th>
                            <th>Method</th>
                            <th>URL</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {apis.map((apiEndpoint) => (
                            <tr key={apiEndpoint._id}>
                                <td><b>{apiEndpoint.name}</b></td>
                                <td style={{ textAlign: 'center' }}>
                                    <span className={`badge badge-${apiEndpoint.method}`}>
                                        {apiEndpoint.method}
                                    </span>
                                </td>
                                <td><code>{apiEndpoint.url}</code></td>
                                <td>
                                    <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
                                        <button 
                                            className="btn" 
                                            onClick={() => runTest(apiEndpoint._id)}
                                            disabled={runningTest === apiEndpoint._id}
                                            style={{ backgroundColor: runningTest === apiEndpoint._id ? 'yellow' : 'silver' }}
                                        >
                                            {runningTest === apiEndpoint._id ? <blink>Testing...</blink> : 'Run Test!'} 
                                        </button>
                                        <button className="btn" onClick={() => navigate(`/api/${apiEndpoint._id}/reports`)}>
                                            Reports
                                        </button>
                                        <button className="btn" onClick={() => navigate(`/api/${apiEndpoint._id}/docs`)}>
                                            Docs
                                        </button>
                                        <button className="btn" onClick={() => navigate(`/api/${apiEndpoint._id}/analytics`)}>
                                            Graph
                                        </button>
                                        <button className="btn" onClick={() => handleDeleteApi(apiEndpoint._id)} style={{ color: 'red' }}>
                                            [X]
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            {showModal && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000}}>
                    <div style={{ width: '500px', border: '5px ridge grey', background: 'silver', padding: '20px' }}>
                        <h2 style={{ textAlign: 'center', borderBottom: '2px solid black', paddingBottom: '10px' }}>Initialize New Target</h2>
                        <form onSubmit={handleAddApi}>
                            <div className="input-group">
                                <label>Internal Name:</label>
                                <input required placeholder="e.g., Get All Users" value={name} onChange={e=>setName(e.target.value)} />
                            </div>
                            <div className="input-group">
                                <label>Target URL:</label>
                                <input required type="url" placeholder="http://..." value={url} onChange={e=>setUrl(e.target.value)} />
                            </div>
                            <div className="input-group">
                                <label>HTTP Method:</label>
                                <select value={method} onChange={e=>setMethod(e.target.value)}>
                                    <option>GET</option>
                                    <option>POST</option>
                                    <option>PUT</option>
                                    <option>DELETE</option>
                                </select>
                            </div>
                            
                            <div className="input-group">
                                <label>Headers (JSON Format):</label>
                                <textarea rows={3} value={headers} onChange={e=>setHeaders(e.target.value)} style={{ fontFamily: 'monospace' }} />
                            </div>

                            {['POST', 'PUT', 'PATCH'].includes(method) && (
                                <div className="input-group">
                                    <label>Body Payload (JSON Format):</label>
                                    <textarea rows={4} value={body} onChange={e=>setBody(e.target.value)} style={{ fontFamily: 'monospace' }} />
                                </div>
                            )}
                            <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                                <button type="button" className="btn" onClick={() => setShowModal(false)}>Cancel</button>
                                <button type="submit" className="btn" style={{ fontWeight: 'bold' }}>Save Target Configuration</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
