import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import SwaggerUI from "swagger-ui-react";
import "swagger-ui-react/swagger-ui.css";
import { ArrowLeft, ExternalLink } from 'lucide-react';
import api from '../api';

const Docs = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [spec, setSpec] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDocs = async () => {
            try {
                const res = await api.get(`/apis/${id}/docs`);
                setSpec(res.data);
            } catch (err) {
                setError(err.response?.data?.message || "Documentation could not be generated cleanly.");
            } finally {
                setLoading(false);
            }
        };
        fetchDocs();
    }, [id]);

    if (loading) return <div style={{ textAlign: 'center', marginTop: '100px'}}>Building OpenAPI schemas from past backend tests...</div>;
    
    // We render Swagger in a white/light panel because it doesn't natively support Dark Mode optimally yet.
    return (
        <div style={{ background: '#f8f9fc', borderRadius: 'var(--radius-lg)', padding: '24px', minHeight: '80vh', color: '#000' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '16px', borderBottom: '1px solid #e2e8f0', marginBottom: '24px' }}>
                <button 
                    onClick={() => navigate('/dashboard')} 
                    style={{ background: '#fff', border: '1px solid #cbd5e1', padding: '8px 16px', borderRadius: '100px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', color: '#334155', fontWeight: 600 }}
                >
                    <ArrowLeft size={16} /> Back to Dashboard
                </button>
                <div style={{ fontSize: '0.85rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <ExternalLink size={16} /> OpenAPI 3.0.0 Spec
                </div>
            </div>

            {error ? (
                <div style={{ textAlign: 'center', marginTop: '64px', color: '#ef4444'}}>
                    <p style={{ fontWeight: 'bold' }}>{error}</p>
                    <p style={{ fontSize: '0.9rem', color: '#64748b' }}>Make sure you have run at least one successful AI Test in the Dashboard first!</p>
                </div>
            ) : (
                <SwaggerUI spec={spec} />
            )}
        </div>
    );
};

export default Docs;
