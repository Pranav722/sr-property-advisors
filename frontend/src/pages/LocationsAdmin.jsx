import React, { useState, useEffect } from 'react';
import AdminSidebar from '../components/AdminSidebar';
import AdminHeader from '../components/AdminHeader';
import Toast from '../components/Toast';
import api from '../services/api';
import '../dashboard.css';

const LocationsAdmin = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [locations, setLocations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAdd, setShowAdd] = useState(false);
    const [newLoc, setNewLoc] = useState('');
    const [saving, setSaving] = useState(false);
    const [toasts, setToasts] = useState([]);

    const addToast = (msg, type = 'success') => setToasts(p => [...p, { id: Date.now(), message: msg, type }]);
    const dismissToast = (id) => setToasts(p => p.filter(t => t.id !== id));

    useEffect(() => { fetchLocations(); }, []);

    const fetchLocations = async () => {
        try {
            setLoading(true);
            const { data } = await api.get('/locations');
            setLocations(Array.isArray(data) ? data : (data?.data || []));
        } catch {
            addToast('Failed to load locations', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleAdd = async (e) => {
        e.preventDefault();
        if (!newLoc.trim()) return;
        setSaving(true);
        try {
            await api.post('/locations', { name: newLoc.trim() });
            addToast(`"${newLoc.trim()}" added!`, 'success');
            setNewLoc('');
            setShowAdd(false);
            fetchLocations();
        } catch (err) {
            addToast(err?.response?.data?.message || 'Failed to add location', 'error');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div style={{ backgroundColor: 'var(--dash-bg)', minHeight: '100vh', display: 'flex', fontFamily: "'Inter', sans-serif" }}>
            <Toast messages={toasts} onDismiss={dismissToast} />
            <AdminSidebar open={sidebarOpen} />
            <main className="main-content" style={{ flex: 1, minWidth: 0, overflowY: 'auto' }}>
                <AdminHeader onMenuClick={() => setSidebarOpen(!sidebarOpen)} />

                {/* Dark Hero */}
                <div style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', padding: '2rem 2rem 1.5rem' }}>
                    <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
                        <div>
                            <h1 style={{ color: '#fff', fontSize: '1.6rem', fontWeight: 800, letterSpacing: '-0.03em', margin: 0 }}>Locations</h1>
                            <p style={{ color: '#94a3b8', marginTop: '0.35rem', fontSize: '0.9rem', margin: '0.35rem 0 0' }}>Manage property locations and market regions.</p>
                        </div>
                        <button onClick={() => setShowAdd(true)} style={{ padding: '0.6rem 1.25rem', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.875rem', flexShrink: 0 }}>
                            <i className="ri-add-line" /> New Location
                        </button>
                    </div>
                </div>

                <div style={{ maxWidth: '1200px', margin: '1.5rem auto', padding: '0 1.5rem' }}>
                    {loading ? (
                        <div style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}><i className="ri-loader-4-line" style={{ fontSize: '2rem' }} /></div>
                    ) : (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '20px' }}>
                            {locations.map(loc => (
                                <div key={loc._id} style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '20px', display: 'flex', alignItems: 'center', gap: '16px', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
                                    <div style={{ background: 'rgba(37, 99, 235, 0.1)', color: '#2563eb', width: '48px', height: '48px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', flexShrink: 0 }}>
                                        <i className="ri-map-pin-2-fill" />
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <h3 style={{ fontSize: '15px', fontWeight: 600, color: '#0f172a', marginBottom: '2px', margin: '0 0 2px' }}>{loc.name}</h3>
                                        <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>Active Market</p>
                                    </div>
                                </div>
                            ))}
                            {locations.length === 0 && (
                                <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '3rem', color: '#64748b' }}>No locations yet. Add one above!</div>
                            )}
                        </div>
                    )}
                </div>
            </main>

            {/* Add Location Modal */}
            {showAdd && (
                <div onClick={e => { if (e.target === e.currentTarget) setShowAdd(false); }} style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.6)', backdropFilter: 'blur(4px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
                    <div style={{ background: '#fff', borderRadius: '20px', padding: '2rem', maxWidth: '400px', width: '100%', boxShadow: '0 24px 64px rgba(0,0,0,0.2)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>New Location</h3>
                            <button onClick={() => setShowAdd(false)} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: '#94a3b8' }}><i className="ri-close-line" /></button>
                        </div>
                        <form onSubmit={handleAdd}>
                            <input
                                autoFocus
                                type="text"
                                value={newLoc}
                                onChange={e => setNewLoc(e.target.value)}
                                placeholder="e.g. Pune, Maharashtra"
                                style={{ width: '100%', padding: '0.75rem 1rem', border: '1.5px solid #e2e8f0', borderRadius: '10px', fontSize: '0.9rem', outline: 'none', marginBottom: '1rem', boxSizing: 'border-box' }}
                                required
                            />
                            <div style={{ display: 'flex', gap: '0.75rem' }}>
                                <button type="button" onClick={() => setShowAdd(false)} style={{ flex: 1, padding: '0.75rem', border: '1.5px solid #e2e8f0', borderRadius: '10px', background: '#fff', fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
                                <button type="submit" disabled={saving} style={{ flex: 2, padding: '0.75rem', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: 700, cursor: 'pointer', opacity: saving ? 0.7 : 1 }}>{saving ? 'Adding...' : 'Add Location'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LocationsAdmin;
