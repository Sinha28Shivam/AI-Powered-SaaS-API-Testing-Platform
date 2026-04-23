import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import api from '../api';

const Analytics = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [metrics, setMetrics] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const res = await api.get(`/apis/${id}/analytics`);
                setMetrics(res.data);
            } catch (err) {
                setError("Analytics data not available yet. Please run some AI tests.");
            } finally {
                setLoading(false);
            }
        };
        fetchAnalytics();
    }, [id]);

    if (loading) return <div style={{ textAlign: 'center', marginTop: '50px', fontSize: '1.5rem', color: 'yellow', fontWeight: 'bold' }}><blink>Loading Database...</blink></div>;
    if (error || !metrics) return <div style={{ textAlign: 'center', marginTop: '50px', color: 'red', fontWeight: 'bold', border: '3px inset grey', padding: '20px', background: 'white' }}>{error}</div>;

    const chartData = metrics.history.map(m => ({
        time: new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        latency: m.responseTime,
        code: m.status
    })).reverse(); 

    return (
        <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px', borderBottom: '2px dashed black', paddingBottom: '10px' }}>
                <button onClick={() => navigate('/dashboard')} className="btn">
                    &lt;-- Go Back
                </button>
                <div>
                    <h1 style={{ color: 'blue' }}>Site Analytics Tracker</h1>
                    <p><i>View the latency and success rates.</i></p>
                </div>
            </div>

            <table border="1" cellPadding="15" style={{ width: '100%', marginBottom: '20px', backgroundColor: 'white', borderCollapse: 'collapse', border: '3px outset grey', textAlign: 'center' }}>
                <tbody>
                    <tr>
                        <td style={{ backgroundColor: 'silver' }}>
                            <b>Total Hits</b>
                            <h2 style={{ color: 'black' }}>{metrics.totalCount}</h2>
                        </td>
                        <td style={{ backgroundColor: 'silver' }}>
                            <b>Avg Latency</b>
                            <h2 style={{ color: 'blue' }}>{metrics.averageResponseTime}ms</h2>
                        </td>
                        <td style={{ backgroundColor: metrics.successRate > 80 ? '#90EE90' : '#FFB6C1' }}>
                            <b>Success Rate</b>
                            <h2 style={{ color: 'black' }}>{metrics.successRate.toFixed(1)}%</h2>
                        </td>
                    </tr>
                </tbody>
            </table>

            <div style={{ border: '5px ridge grey', background: 'white', padding: '15px' }}>
                <h3 style={{ textDecoration: 'underline', marginBottom: '15px', color: 'black' }}>Latency Over Time Graph (ms)</h3>
                <div style={{ height: '350px', width: '100%', border: '2px inset grey', background: 'black' }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                            <XAxis dataKey="time" stroke="white" />
                            <YAxis stroke="white" />
                            <Tooltip contentStyle={{ background: 'silver', border: '2px outset white', color: 'black' }} />
                            <Line type="monotone" dataKey="latency" stroke="lime" strokeWidth={2} dot={{r: 4, fill: 'black'}} activeDot={{r: 6, fill: 'red'}} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default Analytics;
