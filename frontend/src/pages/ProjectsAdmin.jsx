import React, { useState, useEffect } from 'react';
import AdminSidebar from '../components/AdminSidebar';
import AdminHeader from '../components/AdminHeader';
import Toast from '../components/Toast';
import api from '../services/api';
import '../dashboard.css';

const PAGE_HERO_STYLE = {
    background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
    padding: '2rem 2rem 1.5rem',
    marginBottom: '0',
};

const ProjectsAdmin = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [editingProject, setEditingProject] = useState(null);
    const [projects, setProjects] = useState([]);
    const [locations, setLocations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [toasts, setToasts] = useState([]);
    const [search, setSearch] = useState('');

    const addToast = (msg, type = 'success') => setToasts(p => [...p, { id: Date.now(), message: msg, type }]);
    const dismissToast = (id) => setToasts(p => p.filter(t => t.id !== id));

    const [form, setForm] = useState({
        title: '', location: '', type: 'Apartment', status: 'Available', description: '', mapEmbedLink: ''
    });

    useEffect(() => {
        fetchProjects();
        fetchLocations();
    }, []);

    const fetchProjects = async () => {
        try {
            setLoading(true);
            const { data } = await api.get('/projects');
            setProjects(Array.isArray(data) ? data : (data?.data || []));
        } catch {
            addToast('Failed to load projects', 'error');
        } finally {
            setLoading(false);
        }
    };

    const fetchLocations = async () => {
        try {
            const { data } = await api.get('/locations');
            setLocations(Array.isArray(data) ? data : (data?.data || []));
        } catch {
            // silently ignore — locations filter won't work but page is still usable
        }
    };

    const openNew = () => {
        setForm({ title: '', location: '', type: 'Apartment', status: 'Available', description: '', mapEmbedLink: '' });
        setEditingProject(null);
        setModalOpen(true);
    };

    const openEdit = (p) => {
        setForm({
            title: p.title || '',
            location: p.location?._id || p.location || '',
            type: p.type || 'Apartment',
            status: p.status || 'Available',
            description: p.description || '',
            mapEmbedLink: p.mapEmbedLink || '',
        });
        setEditingProject(p);
        setModalOpen(true);
    };

    const handleSave = async (e) => {
        e.preventDefault();
        if (!form.title.trim()) return addToast('Project title is required', 'error');
        if (!form.location) return addToast('Please select a location', 'error');
        setSaving(true);
        try {
            if (editingProject) {
                await api.put(`/projects/${editingProject._id}`, form);
                addToast('Project updated!', 'success');
            } else {
                await api.post('/projects', form);
                addToast('Project created!', 'success');
            }
            setModalOpen(false);
            fetchProjects();
        } catch (err) {
            addToast(err?.response?.data?.message || 'Failed to save project', 'error');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (p) => {
        if (!window.confirm(`Delete "${p.title}"? This cannot be undone.`)) return;
        try {
            await api.delete(`/projects/${p._id}`);
            addToast(`"${p.title}" deleted`, 'success');
            setProjects(ps => ps.filter(x => x._id !== p._id));
        } catch {
            addToast('Delete failed', 'error');
        }
    };

    const STATUS_COLORS = {
        Available: { bg: '#ecfdf5', color: '#059669' },
        Upcoming: { bg: '#eff6ff', color: '#2563eb' },
        'Sold Out': { bg: '#fef2f2', color: '#dc2626' },
    };

    const filtered = projects.filter(p =>
        (p.title || '').toLowerCase().includes(search.toLowerCase()) ||
        (p.location?.name || '').toLowerCase().includes(search.toLowerCase())
    );

    const inp = {
        width: '100%', padding: '0.75rem 1rem', border: '1.5px solid #e2e8f0',
        borderRadius: '10px', fontFamily: 'Inter, sans-serif', fontSize: '0.9rem',
        outline: 'none', marginBottom: '1rem', display: 'block', boxSizing: 'border-box',
    };

    return (
        <div style={{ backgroundColor: 'var(--dash-bg)', minHeight: '100vh', display: 'flex', fontFamily: "'Inter', sans-serif", color: 'var(--dash-text-main)' }}>
            <Toast messages={toasts} onDismiss={dismissToast} />
            <AdminSidebar open={sidebarOpen} />

            <main className="main-content" style={{ flex: 1, minWidth: 0, overflowY: 'auto' }}>
                <AdminHeader onMenuClick={() => setSidebarOpen(!sidebarOpen)} />

                {/* ─── Dark Hero Header ─── */}
                <div style={PAGE_HERO_STYLE}>
                    <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
                        <div>
                            <h1 style={{ color: '#fff', fontSize: '1.6rem', fontWeight: 800, letterSpacing: '-0.03em', margin: 0 }}>Projects</h1>
                            <p style={{ color: '#94a3b8', marginTop: '0.35rem', fontSize: '0.9rem', margin: '0.35rem 0 0' }}>Manage property developments, layouts, and listings.</p>
                        </div>
                        <div style={{ display: 'flex', gap: '10px', flexShrink: 0 }}>
                            <button onClick={openNew} style={{ padding: '0.6rem 1.25rem', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.875rem' }}>
                                <i className="ri-add-line" /> New Project
                            </button>
                        </div>
                    </div>

                    {/* Search Bar inside Hero */}
                    <div style={{ maxWidth: '1200px', margin: '1.25rem auto 0' }}>
                        <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '10px', padding: '0.5rem 1rem', maxWidth: '360px' }}>
                            <i className="ri-search-line" style={{ color: '#94a3b8', marginRight: '8px' }} />
                            <input
                                type="text"
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                placeholder="Search projects..."
                                style={{ background: 'transparent', border: 'none', outline: 'none', color: '#fff', fontSize: '0.875rem', width: '100%' }}
                            />
                        </div>
                    </div>
                </div>

                {/* ─── Table ─── */}
                <div style={{ maxWidth: '1200px', margin: '1.5rem auto', padding: '0 1.5rem' }}>
                    <div style={{ background: '#fff', borderRadius: '14px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
                                <thead>
                                    <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                                        {['Title', 'Location', 'Type', 'Status', 'Actions'].map(h => (
                                            <th key={h} style={{ padding: '1rem 1.25rem', textAlign: h === 'Actions' ? 'right' : 'left', fontWeight: 600, color: '#64748b', fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {loading ? (
                                        <tr><td colSpan={5} style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}><i className="ri-loader-4-line" style={{ fontSize: '1.5rem' }} /></td></tr>
                                    ) : filtered.length === 0 ? (
                                        <tr><td colSpan={5} style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
                                            <i className="ri-building-line" style={{ fontSize: '2.5rem', opacity: 0.3, display: 'block', marginBottom: '0.5rem' }} />
                                            {search ? 'No matching projects.' : <span>No projects yet. <button onClick={openNew} style={{ color: '#2563eb', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}>Add your first →</button></span>}
                                        </td></tr>
                                    ) : filtered.map((p, i) => {
                                        const sc = STATUS_COLORS[p.status] || { bg: '#f1f5f9', color: '#64748b' };
                                        return (
                                            <tr key={p._id} style={{ borderTop: i === 0 ? 'none' : '1px solid #f1f5f9', background: i % 2 === 0 ? '#fff' : '#fafafa' }}>
                                                <td style={{ padding: '1rem 1.25rem', fontWeight: 600, color: '#0f172a' }}>{p.title}</td>
                                                <td style={{ padding: '1rem 1.25rem', color: '#64748b' }}>
                                                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                                                        <i className="ri-map-pin-line" /> {p.location?.name || '—'}
                                                    </span>
                                                </td>
                                                <td style={{ padding: '1rem 1.25rem', color: '#374151' }}>{p.type || '—'}</td>
                                                <td style={{ padding: '1rem 1.25rem' }}>
                                                    <span style={{ padding: '0.25rem 0.75rem', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 600, background: sc.bg, color: sc.color }}>{p.status}</span>
                                                </td>
                                                <td style={{ padding: '1rem 1.25rem', textAlign: 'right' }}>
                                                    <button onClick={() => openEdit(p)} style={{ background: '#eff6ff', color: '#2563eb', border: 'none', borderRadius: '7px', padding: '0.4rem 0.875rem', cursor: 'pointer', marginRight: '0.5rem', fontSize: '0.8rem', fontWeight: 600 }}>
                                                        <i className="ri-edit-line" /> Edit
                                                    </button>
                                                    <button onClick={() => handleDelete(p)} style={{ background: '#fef2f2', color: '#dc2626', border: 'none', borderRadius: '7px', padding: '0.4rem 0.875rem', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600 }}>
                                                        <i className="ri-delete-bin-line" /> Delete
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </main>

            {/* ─── Add / Edit Modal ─── */}
            {modalOpen && (
                <div onClick={e => { if (e.target === e.currentTarget) setModalOpen(false); }}
                    style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.6)', backdropFilter: 'blur(4px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
                    <div style={{ background: '#fff', borderRadius: '20px', padding: '2rem', maxWidth: '520px', width: '100%', boxShadow: '0 24px 64px rgba(0,0,0,0.2)', maxHeight: '85vh', overflowY: 'auto' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a' }}>{editingProject ? 'Edit Project' : 'New Project'}</h3>
                            <button onClick={() => setModalOpen(false)} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: '#94a3b8' }}><i className="ri-close-line" /></button>
                        </div>
                        <form onSubmit={handleSave}>
                            <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '0.35rem' }}>Project Title *</label>
                            <input style={inp} placeholder="e.g. Green Valley Residency" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} required />

                            <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '0.35rem' }}>Location *</label>
                            <select style={inp} value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} required>
                                <option value="">Select Location</option>
                                {locations.map(l => <option key={l._id} value={l._id}>{l.name}</option>)}
                            </select>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div>
                                    <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '0.35rem' }}>Type *</label>
                                    <select style={{ ...inp, marginBottom: 0 }} value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))}>
                                        {['Plot', 'House', 'Building', 'Villa', 'Apartment', 'Office Space', 'Warehouse'].map(t => <option key={t}>{t}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '0.35rem' }}>Status</label>
                                    <select style={{ ...inp, marginBottom: 0 }} value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}>
                                        {['Available', 'Upcoming', 'Sold Out'].map(s => <option key={s}>{s}</option>)}
                                    </select>
                                </div>
                            </div>

                            <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#374151', display: 'block', margin: '1rem 0 0.35rem' }}>Description</label>
                            <textarea style={{ ...inp, minHeight: '80px', resize: 'vertical' }} placeholder="Brief description of the project..." value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />

                            <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '0.35rem' }}>Google Maps Embed Link</label>
                            <input style={inp} placeholder="https://maps.google.com/..." value={form.mapEmbedLink} onChange={e => setForm(f => ({ ...f, mapEmbedLink: e.target.value }))} />

                            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                                <button type="button" onClick={() => setModalOpen(false)} style={{ flex: 1, padding: '0.75rem', border: '1.5px solid #e2e8f0', borderRadius: '10px', background: '#fff', fontWeight: 600, cursor: 'pointer', fontSize: '0.9rem' }}>Cancel</button>
                                <button type="submit" disabled={saving} style={{ flex: 2, padding: '0.75rem', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: 700, cursor: 'pointer', fontSize: '0.9rem', opacity: saving ? 0.7 : 1 }}>
                                    {saving ? 'Saving...' : (editingProject ? 'Update Project' : 'Create Project')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProjectsAdmin;
