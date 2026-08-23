import React from 'react';
import MunicipalMap from '../../components/officer/MunicipalMap';

export default function FieldMap() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      <div>
        <div style={{ fontSize: '0.8rem', color: '#10B981', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.35rem' }}>
          GEOSPATIAL NAVIGATION
        </div>
        <h1 style={{ fontSize: '2.1rem', fontWeight: 800 }}>Field Dispatch Map</h1>
      </div>

      <MunicipalMap />
    </div>
  );
}

