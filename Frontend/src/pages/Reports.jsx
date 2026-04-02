import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, ServerCrash, CheckCircle, AlertTriangle } from 'lucide-react';
import api from '../api';

const Reports = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchReports = async () => {
            try {
                const res = await api.get(`/apis/${id}/reports`);
                setReports(res.data);
            } catch (err) {
                console.error("Failed to load reports", err);
            } finally {
                setLoading(false);
            }
        };
        fetchReports();
    }, [id]);

    if (loading) return <div style={{ textAlign: 'center', marginTop: '100px'}}>Loading amazing insights...</div>;

    return (
        <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
                <button onClick={() => navigate('/dashboard')} className="btn btn-secondary" style={{ padding: '8px', border: 'none' }}>
                    <ArrowLeft size={20} />
                </button>
                <div>
                    <h1 style={{ fontSize: '2rem', marginBottom: '4px' }}>AI Test Reports</h1>
                    <p style={{ color: 'var(--text-secondary)' }}>Detailed Gemini analysis for your API endpoint.</p>
                </div>
            </div>

            {reports.length === 0 ? (
                <div className="glass-panel" style={{ textAlign: 'center' }}>
                    <p>No tests have been completed yet for this endpoint.</p>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    {reports.map((report) => (
                        <div key={report._id} className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '16px', borderLeft: report.success ? '4px solid var(--success)' : '4px solid var(--danger)' }}>
                            
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '16px' }}>
                                <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                                    {report.success ? <CheckCircle color="var(--success)" /> : <ServerCrash color="var(--danger)" />}
                                    <h3 style={{ margin: 0 }}>HTTP {report.status}</h3>
                                </div>
                                <div style={{ display: 'flex', gap: '8px', color: 'var(--text-secondary)', fontSize: '0.9rem', alignItems: 'center' }}>
                                    <Clock size={16} /> {report.responseTime}ms
                                </div>
                            </div>

                            <div>
                                <h4 style={{ color: 'var(--accent-neon)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <AlertTriangle size={18} /> Gemini's Insight
                                </h4>
                                <p style={{ lineHeight: '1.6', fontSize: '0.95rem' }}>
                                    {report.aiInsights || "No AI insight captured."}
                                </p>
                            </div>

                            <div style={{ background: 'rgba(0,0,0,0.4)', borderRadius: 'var(--radius-sm)', padding: '16px' }}>
                                <h5 style={{ marginBottom: '8px', color: 'var(--text-secondary)' }}>Raw Payload:</h5>
                                <pre style={{ margin: 0, fontSize: '0.8rem', whiteSpace: 'pre-wrap', wordBreak: 'break-word', color: 'var(--text-primary)' }}>
                                    {JSON.stringify(report.responseData, null, 2)}
                                </pre>
                            </div>

                            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textAlign: 'right' }}>
                                Tested at: {new Date(report.createdAt).toLocaleString()}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Reports;
