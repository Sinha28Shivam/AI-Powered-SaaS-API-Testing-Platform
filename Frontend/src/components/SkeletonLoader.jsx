import React from 'react';

export const SkeletonGrid = () => (
    <div style={{ textAlign: 'center', marginTop: '50px', fontSize: '1.5rem', color: 'yellow', fontWeight: 'bold' }}>
        <blink>Loading Please Wait...</blink>
    </div>
);

export const SkeletonList = () => (
    <div style={{ textAlign: 'center', marginTop: '50px', fontSize: '1.5rem', color: 'yellow', fontWeight: 'bold' }}>
        <blink>Loading Please Wait...</blink>
    </div>
);
