import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, ServerCrash, CheckCircle, AlertTriangle, ChevronLeft, ChevronRight, Ban } from 'lucide-react';
import api from '../api';
import { SkeletonList } from '../components/SkeletonLoader';

const Reports = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [data, setData] = useState({ reports: [], currentPage: 1, totalPages: 1 });
    const [loading, setLoading] = useState(true);

    const fetchReports = async (page = 1) => {
        setLoading(true);
        try {
            const res = await api.get(`/apis/${id}/reports?page=${page}&limit=5`);
            setData(res.data);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReports(1);
    }, [id]);

    return (
        <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
                <button onClick={() => navigate('/dashboard')} className="btn btn-secondary" style={{ padding: '8px', borderRadius: '50%' }}>
                    <ArrowLeft size={20} />
                </button>
                <div>
                    <h1 style={{ fontSize: '2rem', marginBottom: '4px' }}>AI Test Reports</h1>
                    <p style={{ color: 'var(--text-secondary)' }}>Detailed Gemini analysis for your API endpoint.</p>
                </div>
            </div>

            {loading ? <SkeletonList /> : data.reports.length === 0 ? (
                <div className="glass-panel stagger-1" style={{ textAlign: 'center', padding: '64px' }}>
                    <Ban size={48} color="var(--text-secondary)" style={{ marginBottom: '16px' }} />
                    <h3>No Intelligence Captured Yet</h3>
                    <p style={{ color: 'var(--text-secondary)' }}>Launch an AI Test to generate your first technical report.</p>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    {data.reports.map((report, index) => (
                        <div key={report._id} className={`glass-panel stagger-${(index % 3) + 1}`} style={{ display: 'flex', flexDirection: 'column', gap: '16px', borderLeft: report.success ? '4px solid var(--success)' : '4px solid var(--danger)' }}>
                            
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
                                <h4 style={{ color: 'var(--accent-neon)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px', textShadow: '0 0 10px var(--accent-neon-glow)' }}>
                                    <AlertTriangle size={18} /> Gemini's Insight
                                </h4>
                                <p style={{ lineHeight: '1.6', fontSize: '0.95rem' }}>
                                    {report.aiInsights || "No AI insight captured."}
                                </p>
                            </div>

                            <div style={{ background: 'var(--bg-primary)', borderRadius: 'var(--radius-sm)', padding: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                <h5 style={{ marginBottom: '8px', color: 'var(--text-secondary)' }}>Raw Payload:</h5>
                                <pre style={{ margin: 0, fontSize: '0.8rem', whiteSpace: 'pre-wrap', wordBreak: 'break-word', color: 'var(--text-primary)', fontFamily: 'monospace' }}>
                                    {JSON.stringify(report.responseData, null, 2)}
                                </pre>
                            </div>

                            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textAlign: 'right', fontWeight: 600 }}>
                                {new Date(report.createdAt).toLocaleString()}
                            </div>
                        </div>
                    ))}
                    
                    {/* Pagination Controls */}
                    {data.totalPages > 1 && (
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', alignItems: 'center', marginTop: '24px' }}>
                            <button 
                                className="btn btn-secondary" 
                                disabled={data.currentPage === 1}
                                onClick={() => fetchReports(data.currentPage - 1)}
                            >
                                <ChevronLeft size={16} /> Prev
                            </button>
                            <span style={{ fontWeight: 'bold' }}>Page {data.currentPage} of {data.totalPages}</span>
                            <button 
                                className="btn btn-secondary" 
                                disabled={data.currentPage === data.totalPages}
                                onClick={() => fetchReports(data.currentPage + 1)}
                            >
                                Next <ChevronRight size={16} />
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Reports;
