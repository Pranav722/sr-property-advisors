import React, { useState, useEffect, useRef } from 'react';
import AdminSidebar from '../components/AdminSidebar';
import AdminHeader from '../components/AdminHeader';
import Toast from '../components/Toast';
import api from '../services/api';
import '../dashboard.css';

const BASE_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';

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
    const [coverFile, setCoverFile] = useState(null);
    const [coverPreview, setCoverPreview] = useState(null);
    const [galleryFiles, setGalleryFiles] = useState([]);      // new uploads
    const [galleryPreviews, setGalleryPreviews] = useState([]);// {url, existing?}
    const fileRef = useRef(null);
    const galleryRef = useRef(null);

    const addToast = (msg, type = 'success') => setToasts(p => [...p, { id: Date.now(), message: msg, type }]);
    const dismissToast = (id) => setToasts(p => p.filter(t => t.id !== id));

    const [form, setForm] = useState({
        title: '', location: '', type: 'Apartment', status: 'Available', description: '', mapEmbedLink: '', price: ''
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
        } catch { /* silently ignore */ }
    };

    const openNew = () => {
        setForm({ title: '', location: '', type: 'Apartment', status: 'Available', description: '', mapEmbedLink: '', price: '', isFeatured: false });
        setCoverFile(null);
        setCoverPreview(null);
        setGalleryFiles([]);
        setGalleryPreviews([]);
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
            price: p.price || '',
            isFeatured: p.isFeatured || false,
        });
        setCoverFile(null);
        setCoverPreview(p.coverImage ? `${BASE_URL}/api${p.coverImage}` : null);
        // Existing gallery
        const existingGallery = (p.gallery || []).map(g => ({ url: `${BASE_URL}/api${g}`, existing: true, path: g }));
        setGalleryFiles([]);
        setGalleryPreviews(existingGallery);
        setEditingProject(p);
        setModalOpen(true);
    };

    const handleCoverChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setCoverFile(file);
        setCoverPreview(URL.createObjectURL(file));
    };

    const handleGalleryChange = (e) => {
        const files = Array.from(e.target.files);
        if (!files.length) return;
        const newPreviews = files.map(f => ({ url: URL.createObjectURL(f), existing: false }));
        setGalleryFiles(prev => [...prev, ...files]);
        setGalleryPreviews(prev => [...prev, ...newPreviews]);
        e.target.value = '';
    };

    const removeGalleryItem = (idx) => {
        const item = galleryPreviews[idx];
        // If existing server image, mark for removal
        if (item.existing) {
            setGalleryPreviews(prev => prev.filter((_, i) => i !== idx));
            // We'll track removed on save
        } else {
            // New file — count index among non-existing
            const newIdx = galleryPreviews.slice(0, idx).filter(p => !p.existing).length;
            setGalleryFiles(prev => prev.filter((_, i) => i !== newIdx));
            setGalleryPreviews(prev => prev.filter((_, i) => i !== idx));
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        if (!form.title.trim()) return addToast('Project title is required', 'error');
        if (!form.location) return addToast('Please select a location', 'error');
        setSaving(true);
        try {
            const fd = new FormData();
            Object.entries(form).forEach(([k, v]) => fd.append(k, v));
            if (coverFile) fd.append('coverImage', coverFile);
            // Append new gallery files
            galleryFiles.forEach(f => fd.append('gallery', f));
            // Append removed existing gallery paths for server to remove
            if (editingProject) {
                const originalGallery = (editingProject.gallery || []);
                const remainingExisting = galleryPreviews.filter(p => p.existing).map(p => p.path);
                const removedPaths = originalGallery.filter(g => !remainingExisting.includes(g));
                removedPaths.forEach(p => fd.append('galleryRemove', p));
            }

            if (editingProject) {
                await api.put(`/projects/${editingProject._id}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
                addToast('Project updated!', 'success');
            } else {
                await api.post('/projects', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
                addToast('Project created! Folder auto-created in File Manager.', 'success');
            }
            setModalOpen(false);
            fetchProjects();
        } catch (err) {
            addToast(err?.response?.data?.message || err?.response?.data?.errors?.[0]?.msg || 'Failed to save project', 'error');
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
        Upcoming:  { bg: '#eff6ff', color: '#2563eb' },
        'Sold Out':{ bg: '#fef2f2', color: '#dc2626' },
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
                <div style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', padding: '2rem 2rem 1.5rem' }}>
                    <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
                        <div>
                            <h1 style={{ color: '#fff', fontSize: '1.6rem', fontWeight: 800, letterSpacing: '-0.03em', margin: 0 }}>Projects</h1>
                            <p style={{ color: '#94a3b8', marginTop: '0.35rem', fontSize: '0.9rem', margin: '0.35rem 0 0' }}>Manage property developments, layouts, and listings.</p>
                        </div>
                        <div style={{ display: 'flex', gap: '10px', flexShrink: 0, alignItems: 'center' }}>
                            <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: '10px', padding: '0.5rem 1rem', textAlign: 'center', minWidth: '70px' }}>
                                <div style={{ color: '#fff', fontSize: '1.4rem', fontWeight: 800, lineHeight: 1 }}>{projects.length}</div>
                                <div style={{ color: '#94a3b8', fontSize: '0.7rem', marginTop: '2px' }}>Projects</div>
                            </div>
                            <button onClick={openNew} style={{ padding: '0.65rem 1.25rem', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.875rem' }}>
                                <i className="ri-add-line" /> New Project
                            </button>
                        </div>
                    </div>

                    {/* Search Bar */}
                    <div style={{ maxWidth: '1200px', margin: '1.25rem auto 0' }}>
                        <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '10px', padding: '0.5rem 1rem', maxWidth: '360px' }}>
                            <i className="ri-search-line" style={{ color: '#94a3b8', marginRight: '8px' }} />
                            <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search projects..."
                                style={{ background: 'transparent', border: 'none', outline: 'none', color: '#fff', fontSize: '0.875rem', width: '100%' }} />
                        </div>
                    </div>
                </div>

                {/* ─── Table ─── */}
                <div style={{ maxWidth: '1200px', margin: '1.5rem auto', padding: '0 1.5rem' }}>
                    <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
                                <thead>
                                    <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                                        {['Project', 'Location', 'Type', 'Price', 'Status', 'Actions'].map(h => (
                                            <th key={h} style={{ padding: '1rem 1.25rem', textAlign: h === 'Actions' ? 'right' : 'left', fontWeight: 600, color: '#64748b', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {loading ? (
                                        <tr><td colSpan={6} style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}><i className="ri-loader-4-line" style={{ fontSize: '1.5rem' }} /></td></tr>
                                    ) : filtered.length === 0 ? (
                                        <tr><td colSpan={6} style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
                                            <i className="ri-building-line" style={{ fontSize: '2.5rem', opacity: 0.3, display: 'block', marginBottom: '0.5rem' }} />
                                            {search ? 'No matching projects.' : <span>No projects yet. <button onClick={openNew} style={{ color: '#2563eb', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}>Add your first →</button></span>}
                                        </td></tr>
                                    ) : filtered.map((p, i) => {
                                        const sc = STATUS_COLORS[p.status] || { bg: '#f1f5f9', color: '#64748b' };
                                        return (
                                            <tr key={p._id} style={{ borderTop: i === 0 ? 'none' : '1px solid #f1f5f9', background: i % 2 === 0 ? '#fff' : '#fafafa', verticalAlign: 'middle' }}>
                                                <td style={{ padding: '1rem 1.25rem', fontWeight: 600, color: '#0f172a' }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                        {p.coverImage ? (
                                                            <img src={`${BASE_URL}/api${p.coverImage}`} alt="" style={{ width: '40px', height: '32px', borderRadius: '6px', objectFit: 'cover', flexShrink: 0, border: '1px solid #e2e8f0' }} />
                                                        ) : (
                                                            <div style={{ width: '40px', height: '32px', borderRadius: '6px', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                                                <i className="ri-building-line" style={{ color: '#94a3b8' }} />
                                                            </div>
                                                        )}
                                                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                                {p.title}
                                                                {p.isFeatured && <i className="ri-star-fill" style={{ color: '#f59e0b', fontSize: '1rem' }} title="Featured on Homepage" />}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td style={{ padding: '1rem 1.25rem', color: '#64748b' }}>
                                                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                                                        <i className="ri-map-pin-line" /> {p.location?.name || '—'}
                                                    </span>
                                                </td>
                                                <td style={{ padding: '1rem 1.25rem', color: '#374151' }}>{p.type || '—'}</td>
                                                <td style={{ padding: '1rem 1.25rem', color: '#0f172a', fontWeight: 600 }}>{p.price || '—'}</td>
                                                <td style={{ padding: '1rem 1.25rem' }}>
                                                    <span style={{ padding: '0.3rem 0.75rem', borderRadius: '999px', fontSize: '0.73rem', fontWeight: 700, background: sc.bg, color: sc.color, whiteSpace: 'nowrap' }}>{p.status}</span>
                                                </td>
                                                <td style={{ padding: '1rem 1.25rem', textAlign: 'right', whiteSpace: 'nowrap' }}>
                                                    <button onClick={() => openEdit(p)} style={{ background: '#eff6ff', color: '#2563eb', border: 'none', borderRadius: '8px', padding: '0.4rem 0.875rem', cursor: 'pointer', marginRight: '0.5rem', fontSize: '0.8rem', fontWeight: 600 }}>
                                                        <i className="ri-edit-line" /> Edit
                                                    </button>
                                                    <button onClick={() => handleDelete(p)} style={{ background: '#fef2f2', color: '#dc2626', border: 'none', borderRadius: '8px', padding: '0.4rem 0.875rem', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600 }}>
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
                    <div style={{ background: '#fff', borderRadius: '20px', padding: '2rem', maxWidth: '540px', width: '100%', boxShadow: '0 24px 64px rgba(0,0,0,0.2)', maxHeight: '90vh', overflowY: 'auto' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a' }}>{editingProject ? 'Edit Project' : 'New Project'}</h3>
                            <button onClick={() => setModalOpen(false)} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: '#94a3b8' }}><i className="ri-close-line" /></button>
                        </div>
                        <form onSubmit={handleSave}>
                            {/* Cover Image */}
                            <div style={{ marginBottom: '1.25rem' }}>
                                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '0.5rem' }}>Cover Image</label>
                                <div
                                    onClick={() => fileRef.current?.click()}
                                    style={{ border: '2px dashed #e2e8f0', borderRadius: '12px', overflow: 'hidden', cursor: 'pointer', position: 'relative', height: '140px', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    {coverPreview ? (
                                        <img src={coverPreview} alt="Cover preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    ) : (
                                        <div style={{ textAlign: 'center', color: '#94a3b8' }}>
                                            <i className="ri-image-add-line" style={{ fontSize: '2rem', display: 'block', marginBottom: '6px' }} />
                                            <span style={{ fontSize: '13px' }}>Click to upload cover image</span>
                                        </div>
                                    )}
                                </div>
                                <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleCoverChange} />
                                {coverPreview && (
                                    <button type="button" onClick={() => { setCoverFile(null); setCoverPreview(null); }} style={{ fontSize: '12px', color: '#64748b', background: 'none', border: 'none', cursor: 'pointer', marginTop: '4px' }}>
                                        Remove image
                                    </button>
                                )}
                            </div>
                            <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '0.35rem' }}>Gallery Images <span style={{ fontWeight: 400, color: '#94a3b8' }}>(optional, up to 10)</span></label>
                            <div style={{ marginBottom: '1rem' }}>
                                {/* Thumbnail grid */}
                                {galleryPreviews.length > 0 && (
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))', gap: '0.5rem', marginBottom: '0.75rem' }}>
                                        {galleryPreviews.map((item, idx) => (
                                            <div key={idx} style={{ position: 'relative', height: '72px', borderRadius: '8px', overflow: 'hidden', border: '1px solid #e2e8f0' }}>
                                                <img src={item.url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                <button
                                                    type="button"
                                                    onClick={() => removeGalleryItem(idx)}
                                                    style={{ position: 'absolute', top: '2px', right: '2px', width: '18px', height: '18px', background: 'rgba(220,38,38,0.85)', border: 'none', borderRadius: '50%', color: '#fff', fontSize: '11px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', lineHeight: 1 }}
                                                >×</button>
                                            </div>
                                        ))}
                                        {/* Add more button */}
                                        <div
                                            onClick={() => galleryRef.current?.click()}
                                            style={{ height: '72px', borderRadius: '8px', border: '2px dashed #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#94a3b8', flexDirection: 'column', gap: '2px' }}
                                        >
                                            <i className="ri-add-line" style={{ fontSize: '1.25rem' }} />
                                            <span style={{ fontSize: '10px' }}>Add</span>
                                        </div>
                                    </div>
                                )}
                                {galleryPreviews.length === 0 && (
                                    <div
                                        onClick={() => galleryRef.current?.click()}
                                        style={{ border: '2px dashed #e2e8f0', borderRadius: '12px', padding: '1rem', cursor: 'pointer', textAlign: 'center', color: '#94a3b8', background: '#f8fafc' }}
                                    >
                                        <i className="ri-images-line" style={{ fontSize: '1.5rem', display: 'block', marginBottom: '4px' }} />
                                        <span style={{ fontSize: '12px' }}>Click to add gallery images</span>
                                    </div>
                                )}
                                <input ref={galleryRef} type="file" accept="image/*" multiple style={{ display: 'none' }} onChange={handleGalleryChange} />
                            </div>

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

                            <div style={{ padding: '0.75rem', background: '#f8fafc', borderRadius: '10px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '10px', margin: '0.75rem 0' }}>
                                <input type="checkbox" id="isFeatured" checked={form.isFeatured} onChange={e => setForm(f => ({ ...f, isFeatured: e.target.checked }))} style={{ width: '18px', height: '18px', accentColor: '#2563eb', cursor: 'pointer' }} />
                                <label htmlFor="isFeatured" style={{ fontSize: '0.85rem', fontWeight: 600, color: '#374151', cursor: 'pointer', margin: 0 }}>Pin to Homepage (Handpicked Featured)</label>
                            </div>

                            <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#374151', display: 'block', margin: '1rem 0 0.35rem' }}>Price (e.g. ₹4.5 Cr)</label>
                            <input style={inp} placeholder="₹" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} />

                            <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '0.35rem' }}>Description</label>
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
