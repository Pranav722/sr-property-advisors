import React, { useState, useEffect, useCallback } from 'react';
import AdminSidebar from '../components/AdminSidebar';
import AdminHeader from '../components/AdminHeader';
import Toast from '../components/Toast';
import api from '../services/api';
import '../inventory.css';
import '../dashboard.css';

/* ─── Constants ─── */
const STATUS_OPTS = ['Available', 'Hold', 'Sold'];

const STATUS_STYLE = {
    Available: { bg: '#ecfdf5', color: '#059669' },
    Hold:      { bg: '#fefce8', color: '#d97706' },
    Sold:      { bg: '#fef2f2', color: '#dc2626' },
};

const PLOT_CLASS = {
    Available: 'plot-available',
    Hold:      'plot-booked',
    Sold:      'plot-sold',
};

/* ─── Default form ─── */
const DEFAULT_FORM = { plotNumber: '', sizeSqFt: '', price: '', status: 'Available', buyerName: '', buyerContact: '' };
const DEFAULT_BULK = { count: 10, sizeSqFt: 1000, price: 0, prefix: 'P' };

const Inventory = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [viewMode, setViewMode] = useState('list');
    const [toasts, setToasts] = useState([]);

    /* Projects */
    const [projects, setProjects] = useState([]);
    const [selectedProject, setSelectedProject] = useState('');

    /* Plots */
    const [plots, setPlots] = useState([]);
    const [loadingPlots, setLoadingPlots] = useState(false);

    /* Filters */
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');

    /* Plot modal */
    const [plotModal, setPlotModal] = useState(false);
    const [editingPlot, setEditingPlot] = useState(null);
    const [plotForm, setPlotForm] = useState(DEFAULT_FORM);
    const [savingPlot, setSavingPlot] = useState(false);

    /* Bulk modal */
    const [bulkModal, setBulkModal] = useState(false);
    const [bulkForm, setBulkForm] = useState(DEFAULT_BULK);
    const [savingBulk, setSavingBulk] = useState(false);

    const addToast = (msg, type = 'success') => setToasts(p => [...p, { id: Date.now(), message: msg, type }]);
    const dismissToast = id => setToasts(p => p.filter(t => t.id !== id));

    /* ── Fetch projects ── */
    useEffect(() => {
        api.get('/projects')
            .then(({ data }) => {
                const list = Array.isArray(data) ? data : (data?.data || []);
                setProjects(list);
                if (list.length > 0) setSelectedProject(list[0]._id);
            })
            .catch(() => addToast('Failed to load projects', 'error'));
    }, []);

    /* ── Fetch plots on project change ── */
    const fetchPlots = useCallback(async (projectId) => {
        if (!projectId) return;
        try {
            setLoadingPlots(true);
            const { data } = await api.get(`/plots?projectId=${projectId}`);
            setPlots(Array.isArray(data) ? data : (data?.data || []));
        } catch {
            addToast('Failed to load plots', 'error');
        } finally {
            setLoadingPlots(false);
        }
    }, []);

    useEffect(() => {
        if (selectedProject) fetchPlots(selectedProject);
        else setPlots([]);
    }, [selectedProject, fetchPlots]);

    /* ── Filtered plots ── */
    const filtered = plots.filter(p => {
        const matchSearch = !search ||
            p.plotNumber?.toLowerCase().includes(search.toLowerCase()) ||
            p.buyerName?.toLowerCase().includes(search.toLowerCase());
        const matchStatus = statusFilter === 'All' || p.status === statusFilter;
        return matchSearch && matchStatus;
    });

    /* ── Stats ── */
    const stats = {
        total: plots.length,
        available: plots.filter(p => p.status === 'Available').length,
        hold: plots.filter(p => p.status === 'Hold').length,
        sold: plots.filter(p => p.status === 'Sold').length,
    };

    /* ── Open Add modal ── */
    const openAdd = () => {
        setEditingPlot(null);
        setPlotForm(DEFAULT_FORM);
        setPlotModal(true);
    };

    /* ── Open Edit modal ── */
    const openEdit = (plot) => {
        setEditingPlot(plot);
        setPlotForm({
            plotNumber: plot.plotNumber || '',
            sizeSqFt: plot.sizeSqFt || '',
            price: plot.price || '',
            status: plot.status || 'Available',
            buyerName: plot.buyerName || '',
            buyerContact: plot.buyerContact || '',
        });
        setPlotModal(true);
    };

    /* ── Save plot ── */
    const handleSavePlot = async (e) => {
        e.preventDefault();
        if (!plotForm.plotNumber.trim()) return addToast('Plot number is required', 'error');
        if (!selectedProject) return addToast('Please select a project first', 'error');
        setSavingPlot(true);
        try {
            const payload = {
                ...plotForm,
                sizeSqFt: Number(plotForm.sizeSqFt),
                price: Number(plotForm.price),
                project: selectedProject,
            };
            if (editingPlot) {
                await api.put(`/plots/${editingPlot._id}`, payload);
                addToast('Plot updated!');
            } else {
                await api.post('/plots', payload);
                addToast('Plot added!');
            }
            setPlotModal(false);
            fetchPlots(selectedProject);
        } catch (err) {
            addToast(err?.response?.data?.message || 'Failed to save plot', 'error');
        } finally {
            setSavingPlot(false);
        }
    };

    /* ── Inline status update ── */
    const handleStatusChange = async (plotId, newStatus) => {
        try {
            await api.put(`/plots/${plotId}`, { status: newStatus });
            setPlots(prev => prev.map(p => p._id === plotId ? { ...p, status: newStatus } : p));
        } catch {
            addToast('Failed to update status', 'error');
        }
    };

    /* ── Delete plot ── */
    const handleDelete = async (plot) => {
        if (!window.confirm(`Delete plot ${plot.plotNumber}? This cannot be undone.`)) return;
        try {
            await api.delete(`/plots/${plot._id}`);
            addToast(`Plot ${plot.plotNumber} deleted`);
            setPlots(prev => prev.filter(p => p._id !== plot._id));
        } catch {
            addToast('Failed to delete plot', 'error');
        }
    };

    /* ── Bulk create ── */
    const handleBulkCreate = async (e) => {
        e.preventDefault();
        if (!selectedProject) return addToast('Please select a project first', 'error');
        setSavingBulk(true);
        try {
            const { data } = await api.post('/plots/bulk', {
                project: selectedProject,
                count: Number(bulkForm.count),
                sizeSqFt: Number(bulkForm.sizeSqFt),
                price: Number(bulkForm.price),
                prefix: bulkForm.prefix || 'P',
            });
            addToast(`Created ${data.count} plots!`);
            setBulkModal(false);
            fetchPlots(selectedProject);
        } catch (err) {
            addToast(err?.response?.data?.message || 'Bulk create failed', 'error');
        } finally {
            setSavingBulk(false);
        }
    };

    /* ── Form input style ── */
    const inp = {
        width: '100%', padding: '0.65rem 0.875rem', border: '1.5px solid #e2e8f0',
        borderRadius: '8px', fontFamily: 'Inter, sans-serif', fontSize: '0.875rem',
        outline: 'none', marginBottom: '1rem', display: 'block', boxSizing: 'border-box',
    };

    return (
        <div style={{ backgroundColor: 'var(--dash-bg)', minHeight: '100vh', display: 'flex', fontFamily: "'Inter', sans-serif", color: 'var(--dash-text-main)' }}>
            <Toast messages={toasts} onDismiss={dismissToast} />
            <AdminSidebar open={sidebarOpen} />

            <main className="main-content" style={{ flex: 1, minWidth: 0, overflowY: 'auto' }}>
                <AdminHeader onMenuClick={() => setSidebarOpen(!sidebarOpen)} />

                {/* ── Dark Hero Header ── */}
                <div style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', padding: '2rem 2rem 1.5rem' }}>
                    <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
                        <div>
                            <h1 style={{ color: '#fff', fontSize: '1.6rem', fontWeight: 800, letterSpacing: '-0.03em', margin: 0 }}>Plot Inventory</h1>
                            <p style={{ color: '#94a3b8', marginTop: '0.35rem', fontSize: '0.9rem', margin: '0.35rem 0 0' }}>Manage plot availability, buyers, and sales status.</p>
                        </div>
                        <div style={{ display: 'flex', gap: '10px', flexShrink: 0, alignItems: 'center', flexWrap: 'wrap' }}>
                            {/* Stats pills */}
                            {[['Total', stats.total, '#fff'], ['Available', stats.available, '#34d399'], ['Hold', stats.hold, '#fbbf24'], ['Sold', stats.sold, '#f87171']].map(([label, val, clr]) => (
                                <div key={label} style={{ background: 'rgba(255,255,255,0.1)', borderRadius: '10px', padding: '0.4rem 0.875rem', textAlign: 'center', minWidth: '56px' }}>
                                    <div style={{ color: clr, fontSize: '1.2rem', fontWeight: 800, lineHeight: 1 }}>{val}</div>
                                    <div style={{ color: '#94a3b8', fontSize: '0.65rem', marginTop: '2px' }}>{label}</div>
                                </div>
                            ))}
                            <button onClick={() => setBulkModal(true)} style={{ padding: '0.6rem 1rem', background: 'rgba(255,255,255,0.15)', color: '#fff', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '10px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem' }}>
                                <i className="ri-stack-line" /> Bulk Create
                            </button>
                            <button onClick={openAdd} style={{ padding: '0.65rem 1.25rem', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.875rem' }}>
                                <i className="ri-add-line" /> Add Plot
                            </button>
                        </div>
                    </div>

                    {/* Controls row */}
                    <div style={{ maxWidth: '1200px', margin: '1.25rem auto 0', display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
                        {/* Project selector */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <span style={{ color: '#94a3b8', fontSize: '0.82rem', whiteSpace: 'nowrap' }}>Project:</span>
                            <select
                                value={selectedProject}
                                onChange={e => setSelectedProject(e.target.value)}
                                style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', borderRadius: '8px', padding: '0.45rem 0.875rem', fontSize: '0.875rem', cursor: 'pointer', outline: 'none' }}
                            >
                                {projects.length === 0 && <option value="">No projects yet</option>}
                                {projects.map(p => <option key={p._id} value={p._id} style={{ color: '#0f172a', background: '#fff' }}>{p.title}</option>)}
                            </select>
                        </div>

                        {/* View tabs */}
                        <div style={{ display: 'flex', background: 'rgba(255,255,255,0.08)', borderRadius: '8px', padding: '3px' }}>
                            {[['list', 'ri-list-check', 'List'], ['grid', 'ri-layout-grid-line', 'Visual']].map(([mode, icon, label]) => (
                                <button key={mode} onClick={() => setViewMode(mode)} style={{ padding: '0.35rem 0.75rem', borderRadius: '6px', background: viewMode === mode ? '#2563eb' : 'transparent', color: '#fff', border: 'none', cursor: 'pointer', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '5px', fontWeight: viewMode === mode ? 700 : 400 }}>
                                    <i className={icon} /> {label}
                                </button>
                            ))}
                        </div>

                        {/* Search */}
                        <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '10px', padding: '0.45rem 1rem', flex: '1', minWidth: '160px', maxWidth: '300px' }}>
                            <i className="ri-search-line" style={{ color: '#94a3b8', marginRight: '8px' }} />
                            <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search plot or buyer..."
                                style={{ background: 'transparent', border: 'none', outline: 'none', color: '#fff', fontSize: '0.825rem', width: '100%' }} />
                        </div>

                        {/* Status filter */}
                        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
                            style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', borderRadius: '8px', padding: '0.45rem 0.875rem', fontSize: '0.825rem', cursor: 'pointer', outline: 'none' }}>
                            <option value="All" style={{ color: '#0f172a', background: '#fff' }}>All Statuses</option>
                            {STATUS_OPTS.map(s => <option key={s} value={s} style={{ color: '#0f172a', background: '#fff' }}>{s}</option>)}
                        </select>
                    </div>
                </div>

                <div style={{ maxWidth: '1200px', margin: '1.5rem auto', padding: '0 1.5rem' }}>
                    {projects.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '5rem 1rem', color: '#64748b' }}>
                            <i className="ri-building-4-line" style={{ fontSize: '3rem', opacity: 0.3, display: 'block', marginBottom: '0.75rem' }} />
                            <p style={{ fontWeight: 600 }}>No projects yet.</p>
                            <p style={{ fontSize: '0.875rem', marginTop: '0.4rem' }}>Create a project first from <a href="/projects-admin" style={{ color: '#2563eb' }}>Projects Admin</a>.</p>
                        </div>
                    ) : loadingPlots ? (
                        <div style={{ textAlign: 'center', padding: '5rem 1rem', color: '#94a3b8' }}>
                            <i className="ri-loader-4-line" style={{ fontSize: '2.5rem', display: 'block', marginBottom: '0.75rem' }} />
                            Loading plots…
                        </div>
                    ) : (
                        <>
                            {/* ── LIST VIEW ── */}
                            {viewMode === 'list' && (
                                <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
                                    <div style={{ overflowX: 'auto' }}>
                                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
                                            <thead>
                                                <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                                                    {['Plot No.', 'Size (sqft)', 'Price', 'Status', 'Buyer', 'Contact', 'Actions'].map(h => (
                                                        <th key={h} style={{ padding: '0.875rem 1rem', textAlign: h === 'Actions' ? 'right' : 'left', fontWeight: 600, color: '#64748b', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>{h}</th>
                                                    ))}
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {filtered.length === 0 ? (
                                                    <tr>
                                                        <td colSpan={7} style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>
                                                            <i className="ri-map-2-line" style={{ fontSize: '2rem', display: 'block', marginBottom: '0.5rem', opacity: 0.4 }} />
                                                            {search || statusFilter !== 'All' ? 'No plots match your filters.' : 'No plots yet. Click "Add Plot" or use "Bulk Create".'}
                                                        </td>
                                                    </tr>
                                                ) : filtered.map((plot, i) => {
                                                    const sc = STATUS_STYLE[plot.status] || { bg: '#f1f5f9', color: '#64748b' };
                                                    return (
                                                        <tr key={plot._id} style={{ borderTop: i === 0 ? 'none' : '1px solid #f1f5f9', background: i % 2 === 0 ? '#fff' : '#fafafa', verticalAlign: 'middle' }}>
                                                            <td style={{ padding: '0.875rem 1rem', fontWeight: 700, color: '#0f172a' }}>{plot.plotNumber}</td>
                                                            <td style={{ padding: '0.875rem 1rem', color: '#374151' }}>{plot.sizeSqFt?.toLocaleString()}</td>
                                                            <td style={{ padding: '0.875rem 1rem', color: '#0f172a', fontWeight: 600 }}>
                                                                {plot.price ? `₹${Number(plot.price).toLocaleString()}` : '—'}
                                                            </td>
                                                            <td style={{ padding: '0.875rem 1rem' }}>
                                                                <select
                                                                    value={plot.status}
                                                                    onChange={e => handleStatusChange(plot._id, e.target.value)}
                                                                    style={{ padding: '0.3rem 0.6rem', borderRadius: '999px', fontSize: '0.72rem', fontWeight: 700, background: sc.bg, color: sc.color, border: 'none', cursor: 'pointer', outline: 'none' }}
                                                                >
                                                                    {STATUS_OPTS.map(s => <option key={s}>{s}</option>)}
                                                                </select>
                                                            </td>
                                                            <td style={{ padding: '0.875rem 1rem', color: '#374151' }}>{plot.buyerName || <span style={{ color: '#94a3b8' }}>—</span>}</td>
                                                            <td style={{ padding: '0.875rem 1rem', color: '#374151' }}>{plot.buyerContact || <span style={{ color: '#94a3b8' }}>—</span>}</td>
                                                            <td style={{ padding: '0.875rem 1rem', textAlign: 'right', whiteSpace: 'nowrap' }}>
                                                                <button onClick={() => openEdit(plot)} style={{ background: '#eff6ff', color: '#2563eb', border: 'none', borderRadius: '7px', padding: '0.35rem 0.75rem', cursor: 'pointer', marginRight: '0.4rem', fontSize: '0.78rem', fontWeight: 600 }}>
                                                                    <i className="ri-edit-line" /> Edit
                                                                </button>
                                                                <button onClick={() => handleDelete(plot)} style={{ background: '#fef2f2', color: '#dc2626', border: 'none', borderRadius: '7px', padding: '0.35rem 0.75rem', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 600 }}>
                                                                    <i className="ri-delete-bin-line" />
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    );
                                                })}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}

                            {/* ── GRID VISUAL VIEW ── */}
                            {viewMode === 'grid' && (
                                <div>
                                    <div className="legend" style={{ display: 'flex', gap: '1.25rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
                                        {[['plot-available', 'Available'], ['plot-booked', 'Hold'], ['plot-sold', 'Sold']].map(([cls, label]) => (
                                            <div key={cls} className="legend-item" style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', color: '#374151' }}>
                                                <div className={`legend-color ${cls}`} style={{ width: '14px', height: '14px', borderRadius: '4px' }} />
                                                {label}
                                            </div>
                                        ))}
                                        <span style={{ color: '#94a3b8', fontSize: '0.8rem', marginLeft: 'auto' }}>{filtered.length} plots shown</span>
                                    </div>
                                    {filtered.length === 0 ? (
                                        <div style={{ textAlign: 'center', padding: '4rem 1rem', color: '#94a3b8', background: '#fff', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                                            <i className="ri-map-2-line" style={{ fontSize: '2.5rem', opacity: 0.3, display: 'block', marginBottom: '0.75rem' }} />
                                            No plots to display.
                                        </div>
                                    ) : (
                                        <div className="plot-grid-container">
                                            {filtered.map(plot => (
                                                <div
                                                    key={plot._id}
                                                    className={`plot-item ${PLOT_CLASS[plot.status] || ''}`}
                                                    onClick={() => openEdit(plot)}
                                                    title={`${plot.plotNumber} — ${plot.status}${plot.buyerName ? ` (${plot.buyerName})` : ''}`}
                                                >
                                                    {plot.plotNumber}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}
                        </>
                    )}
                </div>
            </main>

            {/* ── Add / Edit Plot Modal ── */}
            {plotModal && (
                <div onClick={e => { if (e.target === e.currentTarget) setPlotModal(false); }}
                    style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.6)', backdropFilter: 'blur(4px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
                    <div style={{ background: '#fff', borderRadius: '20px', padding: '2rem', maxWidth: '480px', width: '100%', boxShadow: '0 24px 64px rgba(0,0,0,0.2)', maxHeight: '90vh', overflowY: 'auto' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a' }}>{editingPlot ? `Edit Plot — ${editingPlot.plotNumber}` : 'Add New Plot'}</h3>
                            <button onClick={() => setPlotModal(false)} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: '#94a3b8' }}><i className="ri-close-line" /></button>
                        </div>

                        <form onSubmit={handleSavePlot}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 1rem' }}>
                                <div>
                                    <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '0.3rem' }}>Plot Number *</label>
                                    <input style={inp} placeholder="e.g. P001" value={plotForm.plotNumber} onChange={e => setPlotForm(f => ({ ...f, plotNumber: e.target.value }))} required />
                                </div>
                                <div>
                                    <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '0.3rem' }}>Status</label>
                                    <select style={inp} value={plotForm.status} onChange={e => setPlotForm(f => ({ ...f, status: e.target.value }))}>
                                        {STATUS_OPTS.map(s => <option key={s}>{s}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '0.3rem' }}>Size (sqft)</label>
                                    <input style={inp} type="number" placeholder="e.g. 1200" value={plotForm.sizeSqFt} onChange={e => setPlotForm(f => ({ ...f, sizeSqFt: e.target.value }))} />
                                </div>
                                <div>
                                    <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '0.3rem' }}>Price (₹)</label>
                                    <input style={inp} type="number" placeholder="e.g. 500000" value={plotForm.price} onChange={e => setPlotForm(f => ({ ...f, price: e.target.value }))} />
                                </div>
                            </div>

                            <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '1rem', marginBottom: '0.5rem' }}>
                                <p style={{ fontSize: '0.78rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem' }}>Buyer Details (optional)</p>
                                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '0.3rem' }}>Buyer Name</label>
                                <input style={inp} placeholder="e.g. Rahul Sharma" value={plotForm.buyerName} onChange={e => setPlotForm(f => ({ ...f, buyerName: e.target.value }))} />
                                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '0.3rem' }}>Contact</label>
                                <input style={inp} placeholder="e.g. +91 98765 43210" value={plotForm.buyerContact} onChange={e => setPlotForm(f => ({ ...f, buyerContact: e.target.value }))} />
                            </div>

                            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.25rem' }}>
                                <button type="button" onClick={() => setPlotModal(false)} style={{ flex: 1, padding: '0.75rem', border: '1.5px solid #e2e8f0', borderRadius: '10px', background: '#fff', fontWeight: 600, cursor: 'pointer', fontSize: '0.9rem' }}>Cancel</button>
                                <button type="submit" disabled={savingPlot} style={{ flex: 2, padding: '0.75rem', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: 700, cursor: 'pointer', fontSize: '0.9rem', opacity: savingPlot ? 0.7 : 1 }}>
                                    {savingPlot ? 'Saving…' : (editingPlot ? 'Update Plot' : 'Add Plot')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* ── Bulk Create Modal ── */}
            {bulkModal && (
                <div onClick={e => { if (e.target === e.currentTarget) setBulkModal(false); }}
                    style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.6)', backdropFilter: 'blur(4px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
                    <div style={{ background: '#fff', borderRadius: '20px', padding: '2rem', maxWidth: '420px', width: '100%', boxShadow: '0 24px 64px rgba(0,0,0,0.2)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a' }}>Bulk Create Plots</h3>
                            <button onClick={() => setBulkModal(false)} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: '#94a3b8' }}><i className="ri-close-line" /></button>
                        </div>

                        <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '1.25rem' }}>
                            Creates <strong>{bulkForm.count}</strong> plots auto-numbered as <strong>{bulkForm.prefix || 'P'}001</strong>, <strong>{bulkForm.prefix || 'P'}002</strong>… for <strong>{projects.find(p => p._id === selectedProject)?.title || '—'}</strong>. Duplicates are skipped.
                        </p>

                        <form onSubmit={handleBulkCreate}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 1rem' }}>
                                <div>
                                    <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '0.3rem' }}>Number of Plots</label>
                                    <input style={inp} type="number" min="1" max="500" value={bulkForm.count} onChange={e => setBulkForm(f => ({ ...f, count: e.target.value }))} required />
                                </div>
                                <div>
                                    <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '0.3rem' }}>Plot Prefix</label>
                                    <input style={inp} placeholder="P" maxLength="4" value={bulkForm.prefix} onChange={e => setBulkForm(f => ({ ...f, prefix: e.target.value }))} />
                                </div>
                                <div>
                                    <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '0.3rem' }}>Default Size (sqft)</label>
                                    <input style={inp} type="number" placeholder="1000" value={bulkForm.sizeSqFt} onChange={e => setBulkForm(f => ({ ...f, sizeSqFt: e.target.value }))} />
                                </div>
                                <div>
                                    <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '0.3rem' }}>Default Price (₹)</label>
                                    <input style={inp} type="number" placeholder="0" value={bulkForm.price} onChange={e => setBulkForm(f => ({ ...f, price: e.target.value }))} />
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.25rem' }}>
                                <button type="button" onClick={() => setBulkModal(false)} style={{ flex: 1, padding: '0.75rem', border: '1.5px solid #e2e8f0', borderRadius: '10px', background: '#fff', fontWeight: 600, cursor: 'pointer', fontSize: '0.9rem' }}>Cancel</button>
                                <button type="submit" disabled={savingBulk} style={{ flex: 2, padding: '0.75rem', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: 700, cursor: 'pointer', fontSize: '0.9rem', opacity: savingBulk ? 0.7 : 1 }}>
                                    {savingBulk ? 'Creating…' : `Create ${bulkForm.count} Plots`}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Inventory;
