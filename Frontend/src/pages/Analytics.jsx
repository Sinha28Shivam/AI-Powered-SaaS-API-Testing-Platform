import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { ArrowLeft, Clock, Activity, Target } from 'lucide-react';
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

    if (loading) return <div style={{ display: 'flex', justifyContent: 'center', marginTop: '100px', color: 'var(--accent-neon)'}}>Crunching Prisma Analytics...</div>;
    if (error || !metrics) return <div style={{ textAlign: 'center', marginTop: '100px', color: 'var(--danger)'}}>{error}</div>;

    // Formatting data for chart
    const chartData = metrics.history.map(m => ({
        time: new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        latency: m.responseTime,
        code: m.status
    })).reverse(); // Oldest first for chart

    return (
        <div className="stagger-1">
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '40px' }}>
                <button onClick={() => navigate('/dashboard')} className="btn btn-secondary" style={{ padding: '8px', borderRadius: '50%' }}>
                    <ArrowLeft size={20} />
                </button>
                <div>
                    <h1 style={{ fontSize: '2rem', marginBottom: '4px' }}>Target Analytics Tracker</h1>
                    <p style={{ color: 'var(--text-secondary)' }}>Dual-database powered timeline monitoring via PostgreSQL & Prisma.</p>
                </div>
            </div>

            {/* Top Stat Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', marginBottom: '40px' }}>
                <div className="glass-panel" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <div style={{ background: 'var(--accent-neon-glow)', padding: '16px', borderRadius: '16px', color: 'var(--accent-neon)'}}>
                        <Target size={32} />
                    </div>
                    <div>
                        <p style={{ color: 'var(--text-secondary)', textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '1px', fontWeight: 700}}>Total Tests Run</p>
                        <h2 style={{ fontSize: '2.5rem', margin: 0}}>{metrics.totalCount}</h2>
                    </div>
                </div>

                <div className="glass-panel" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <div style={{ background: 'var(--accent-purple-glow)', padding: '16px', borderRadius: '16px', color: '#dca3ff'}}>
                        <Clock size={32} />
                    </div>
                    <div>
                        <p style={{ color: 'var(--text-secondary)', textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '1px', fontWeight: 700}}>Avg Latency</p>
                        <h2 style={{ fontSize: '2.5rem', margin: 0}}>{metrics.averageResponseTime}ms</h2>
                    </div>
                </div>

                <div className="glass-panel" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <div style={{ background: metrics.successRate > 80 ? 'rgba(0, 230, 118, 0.15)' : 'var(--danger-glow)', padding: '16px', borderRadius: '16px', color: metrics.successRate > 80 ? 'var(--success)' : 'var(--danger)'}}>
                        <Activity size={32} />
                    </div>
                    <div>
                        <p style={{ color: 'var(--text-secondary)', textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '1px', fontWeight: 700}}>Success Rate</p>
                        <h2 style={{ fontSize: '2.5rem', margin: 0}}>{metrics.successRate.toFixed(1)}%</h2>
                    </div>
                </div>
            </div>

            {/* Latency Graph */}
            <div className="glass-panel">
                <h3 style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: 'var(--accent-neon)', boxShadow: '0 0 10px var(--accent-neon)'}} />
                    Latency Timeline (ms)
                </h3>
                <div style={{ height: '350px', width: '100%' }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                            <XAxis dataKey="time" stroke="var(--text-secondary)" tick={{fontSize: 12}} />
                            <YAxis stroke="var(--text-secondary)" tick={{fontSize: 12}} />
                            <Tooltip 
                                contentStyle={{ background: 'rgba(5, 5, 8, 0.9)', border: '1px solid var(--accent-neon)', borderRadius: '8px', color: '#fff' }} 
                            />
                            <Line type="monotone" dataKey="latency" stroke="var(--accent-neon)" strokeWidth={3} dot={{r: 4, fill: 'var(--bg-primary)'}} activeDot={{r: 8, fill: 'var(--accent-neon)'}} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default Analytics;
