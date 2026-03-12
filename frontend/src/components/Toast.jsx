import React from 'react';

const Toast = ({ messages, onDismiss }) => (
  <div style={{ position: 'fixed', bottom: '1.5rem', right: '1.5rem', zIndex: 9999, display: 'flex', flexDirection: 'column-reverse', gap: '0.75rem' }}>
    {messages.map(m => (
      <div key={m.id} style={{
        display: 'flex', alignItems: 'center', gap: '0.75rem',
        padding: '1rem 1.25rem', borderRadius: '12px',
        background: m.type === 'success' ? '#ecfdf5' : m.type === 'error' ? '#fef2f2' : '#eff6ff',
        border: `1px solid ${m.type === 'success' ? '#a7f3d0' : m.type === 'error' ? '#fecaca' : '#bfdbfe'}`,
        boxShadow: '0 4px 24px rgba(0,0,0,0.10)', minWidth: '280px', maxWidth: '380px',
        animation: 'fadeInUp 0.3s ease',
      }}>
        <i className={`ri-${m.type === 'success' ? 'check-circle' : m.type === 'error' ? 'error-warning' : 'information'}-line`}
          style={{ fontSize: '1.25rem', color: m.type === 'success' ? '#059669' : m.type === 'error' ? '#dc2626' : '#2563eb', flexShrink: 0 }} />
        <span style={{ fontSize: '0.9rem', fontWeight: 500, color: '#1e293b', flex: 1 }}>{m.message || m.text}</span>
        <button onClick={() => onDismiss(m.id)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '1.1rem' }}>
          <i className="ri-close-line" />
        </button>
      </div>
    ))}
  </div>
);

export default Toast;
