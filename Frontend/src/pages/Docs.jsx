import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import SwaggerUI from "swagger-ui-react";
import "swagger-ui-react/swagger-ui.css";
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

    if (loading) return <div style={{ textAlign: 'center', marginTop: '50px', fontSize: '1.5rem', color: 'yellow', fontWeight: 'bold' }}><blink>Generating Docs...</blink></div>;
    
    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '10px', borderBottom: '2px dashed black', marginBottom: '20px' }}>
                <button 
                    onClick={() => navigate('/dashboard')} 
                    className="btn"
                >
                    &lt;-- Return to Dashboard
                </button>
                <div style={{ fontWeight: 'bold' }}>
                    [ OpenAPI 3.0.0 Specification ]
                </div>
            </div>

            {error ? (
                <div style={{ textAlign: 'center', padding: '50px', border: '3px inset grey', background: '#e0e0e0' }}>
                    <h3 style={{ color: 'red' }}>Error: {error}</h3>
                    <p>Make sure you have run at least one successful test!</p>
                </div>
            ) : (
                <div style={{ border: '5px ridge grey', background: 'white', padding: '10px' }}>
                    {/* Override some swagger fonts locally if needed, but it naturally handles its own styles */}
                    <div style={{ fontFamily: 'sans-serif' }}>
                        <SwaggerUI spec={spec} />
                    </div>
                </div>
            )}
        </div>
    );
};

export default Docs;
