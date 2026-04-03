import React from 'react';

export const SkeletonGrid = () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '32px', width: '100%' }}>
        {[1,2,3,4,5,6].map(i => (
            <div key={i} className="glass-panel" style={{ height: '180px', animation: 'pulse 1.5s infinite ease-in-out', background: 'rgba(255,255,255,0.03)'}} />
        ))}
    </div>
);

export const SkeletonList = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', width: '100%' }}>
        {[1,2,3,4].map(i => (
            <div key={i} className="glass-panel" style={{ height: '200px', animation: 'pulse 1.5s infinite ease-in-out', background: 'rgba(255,255,255,0.03)'}} />
        ))}
    </div>
);
