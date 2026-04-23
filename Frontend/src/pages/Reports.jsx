import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px', borderBottom: '2px dashed black', paddingBottom: '10px' }}>
                <button onClick={() => navigate('/dashboard')} className="btn">
                    &lt;-- Go Back
                </button>
                <div>
                    <h1 style={{ color: 'blue' }}>AI Test Reports Log</h1>
                    <p><i>View the raw data from the server tests.</i></p>
                </div>
            </div>

            {loading ? <SkeletonList /> : data.reports.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '50px', border: '3px inset grey', background: '#e0e0e0' }}>
                    <h3 style={{ color: 'red' }}>Warning: No Data Found</h3>
                    <p>Launch an AI Test to generate your first technical report.</p>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {data.reports.map((report) => (
                        <div key={report._id} style={{ 
                            background: 'white', 
                            color: 'black', 
                            border: '3px outset grey',
                            borderLeft: report.success ? '10px solid green' : '10px solid red',
                            padding: '15px'
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid silver', paddingBottom: '10px', marginBottom: '10px' }}>
                                <div>
                                    <h3 style={{ margin: 0, color: report.success ? 'green' : 'red' }}>
                                        HTTP {report.status} - {report.success ? 'SUCCESS' : 'FAILED'}
                                    </h3>
                                </div>
                                <div>
                                    <b>Time:</b> {report.responseTime}ms
                                </div>
                            </div>

                            <div style={{ marginBottom: '15px' }}>
                                <h4 style={{ color: 'purple', textDecoration: 'underline' }}>
                                    Gemini's Insight:
                                </h4>
                                <p style={{ marginTop: '5px' }}>
                                    {report.aiInsights || "No AI insight captured."}
                                </p>
                            </div>

                            <div style={{ background: 'black', color: 'lime', padding: '10px', border: '2px inset grey' }}>
                                <h5 style={{ marginBottom: '5px', color: 'white' }}>Raw Payload Data:</h5>
                                <pre style={{ margin: 0, fontSize: '14px', whiteSpace: 'pre-wrap', wordBreak: 'break-word', fontFamily: 'monospace' }}>
                                    {JSON.stringify(report.responseData, null, 2)}
                                </pre>
                            </div>

                            <div style={{ fontSize: '12px', textAlign: 'right', marginTop: '10px' }}>
                                <i>Recorded on: {new Date(report.createdAt).toLocaleString()}</i>
                            </div>
                        </div>
                    ))}
                    
                    {/* Pagination Controls */}
                    {data.totalPages > 1 && (
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', alignItems: 'center', marginTop: '20px', padding: '10px', background: 'silver', border: '3px ridge grey' }}>
                            <button 
                                className="btn" 
                                disabled={data.currentPage === 1}
                                onClick={() => fetchReports(data.currentPage - 1)}
                            >
                                &lt;&lt; Prev Page
                            </button>
                            <b>Page {data.currentPage} of {data.totalPages}</b>
                            <button 
                                className="btn" 
                                disabled={data.currentPage === data.totalPages}
                                onClick={() => fetchReports(data.currentPage + 1)}
                            >
                                Next Page &gt;&gt;
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Reports;
