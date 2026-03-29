import React, { useState, useEffect, useCallback } from 'react';
import AdminSidebar from '../components/AdminSidebar';
import AdminHeader from '../components/AdminHeader';
import Toast from '../components/Toast';
import api from '../services/api';
import '../crm.css';
import '../dashboard.css';

const STATUS_STYLES = {
  New:       { bg: '#eff6ff', color: '#2563eb' },
  Contacted: { bg: '#fefce8', color: '#ca8a04' },
  Closed:    { bg: '#ecfdf5', color: '#059669' },
};

const Leads = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [selectedLead, setSelectedLead] = useState(null);
    const [inquiries, setInquiries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [toasts, setToasts] = useState([]);
    const [noteText, setNoteText] = useState('');
    const [search, setSearch] = useState('');
    const [filterStatus, setFilterStatus] = useState('All');
    const [savingNote, setSavingNote] = useState(false);

    const addToast = (msg, type = 'success') => setToasts(p => [...p, { id: Date.now(), message: msg, type }]);
    const dismissToast = (id) => setToasts(p => p.filter(t => t.id !== id));

    const fetchInquiries = useCallback(async () => {
        setLoading(true);
        try {
            const { data } = await api.get('/inquiries');
            setInquiries(Array.isArray(data) ? data : (data?.data || []));
        } catch {
            addToast('Failed to load inquiries', 'error');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchInquiries(); }, [fetchInquiries]);

    const handleStatusChange = async (inquiryId, newStatus) => {
        try {
            await api.put(`/inquiries/${inquiryId}`, { status: newStatus });
            setInquiries(prev => prev.map(i => i._id === inquiryId ? { ...i, status: newStatus } : i));
            if (selectedLead?._id === inquiryId) setSelectedLead(prev => ({ ...prev, status: newStatus }));
            addToast('Status updated', 'success');
        } catch {
            addToast('Failed to update status', 'error');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this inquiry? This cannot be undone.')) return;
        try {
            await api.delete(`/inquiries/${id}`);
            addToast('Inquiry deleted', 'success');
            setInquiries(prev => prev.filter(i => i._id !== id));
            if (selectedLead?._id === id) setSelectedLead(null);
        } catch {
            addToast('Failed to delete inquiry', 'error');
        }
    };

    const handleAddNote = async () => {
        if (!noteText.trim() || !selectedLead) return;
        setSavingNote(true);
        try {
            const { data } = await api.put(`/inquiries/${selectedLead._id}`, { note: noteText.trim() });
            setSelectedLead(data);
            setInquiries(prev => prev.map(i => i._id === data._id ? data : i));
            setNoteText('');
            addToast('Note added', 'success');
        } catch {
            addToast('Failed to add note', 'error');
        } finally {
            setSavingNote(false);
        }
    };

    const openPanel = (lead) => {
        setSelectedLead(lead);
        setNoteText('');
    };
    const closePanel = () => setSelectedLead(null);

    const filtered = inquiries.filter(i => {
        const matchSearch = !search ||
            (i.name || '').toLowerCase().includes(search.toLowerCase()) ||
            (i.email || '').toLowerCase().includes(search.toLowerCase()) ||
            (i.phone || '').includes(search);
        const matchStatus = filterStatus === 'All' || i.status === filterStatus;
        return matchSearch && matchStatus;
    });

    const getDateLabel = (dateStr) => {
        const d = new Date(dateStr);
        const now = new Date();
        const diff = now - d;
        const hours = Math.floor(diff / 3600000);
        if (hours < 1) return 'Just now';
        if (hours < 24) return `${hours}h ago`;
        const days = Math.floor(hours / 24);
        if (days < 7) return `${days}d ago`;
        return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
    };

    return (
        <div style={{ backgroundColor: 'var(--dash-bg)', minHeight: '100vh', display: 'flex', fontFamily: "'Inter', sans-serif", color: 'var(--dash-text-main)' }}>
            <Toast messages={toasts} onDismiss={dismissToast} />
            <AdminSidebar open={sidebarOpen} />

            <main className={`main-content ${selectedLead && window.innerWidth > 1024 ? 'panel-open' : ''}`}>
                <AdminHeader onMenuClick={() => setSidebarOpen(!sidebarOpen)} />

                {/* Dark Hero Header */}
                <div style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', padding: '2rem 2rem 1.5rem' }}>
                    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
                            <div>
                                <h1 style={{ color: '#fff', fontSize: '1.6rem', fontWeight: 800, letterSpacing: '-0.03em', margin: 0 }}>
                                    Website Inquiries
                                </h1>
                                <p style={{ color: '#94a3b8', marginTop: '0.35rem', fontSize: '0.9rem', margin: '0.35rem 0 0' }}>
                                    Track and manage incoming leads from property pages.
                                </p>
                            </div>
                            <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: '12px', padding: '0.75rem 1.25rem', textAlign: 'center' }}>
                                <div style={{ color: '#fff', fontSize: '1.5rem', fontWeight: 800, lineHeight: 1 }}>{inquiries.length}</div>
                                <div style={{ color: '#94a3b8', fontSize: '0.75rem', marginTop: '2px' }}>Total Leads</div>
                            </div>
                        </div>

                        {/* Filters row */}
                        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '10px', padding: '0.5rem 1rem' }}>
                                <i className="ri-search-line" style={{ color: '#94a3b8', marginRight: '8px' }} />
                                <input
                                    type="text"
                                    value={search}
                                    onChange={e => setSearch(e.target.value)}
                                    placeholder="Search by name, email, phone..."
                                    style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: '13px', width: '220px', color: '#fff' }}
                                />
                            </div>
                            <div style={{ display: 'flex', gap: '8px', background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '10px', padding: '0.4rem 0.75rem' }}>
                                <select
                                    value={filterStatus}
                                    onChange={e => setFilterStatus(e.target.value)}
                                    style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: '13px', color: '#e2e8f0', cursor: 'pointer' }}
                                >
                                    <option value="All">All Statuses</option>
                                    <option value="New">New Lead</option>
                                    <option value="Contacted">Contacted</option>
                                    <option value="Closed">Closed</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="app-content" style={{ padding: '24px 30px' }}>
                    {loading ? (
                        <div style={{ textAlign: 'center', padding: '4rem', color: '#94a3b8' }}>
                            <i className="ri-loader-4-line" style={{ fontSize: '2.5rem', display: 'block', marginBottom: '1rem' }} />
                            Loading inquiries...
                        </div>
                    ) : (
                        <div className="data-card" style={{ background: 'white', borderRadius: '16px', border: '1px solid var(--dash-border)', boxShadow: 'var(--dash-shadow-sm)', overflow: 'hidden' }}>
                            {filtered.length === 0 ? (
                                <div style={{ textAlign: 'center', padding: '4rem', color: '#64748b' }}>
                                    <i className="ri-mail-open-line" style={{ fontSize: '3rem', opacity: 0.3, display: 'block', marginBottom: '1rem' }} />
                                    {search || filterStatus !== 'All' ? 'No inquiries match your filters.' : 'No inquiries yet. They will appear here when customers contact you.'}
                                </div>
                            ) : (
                                <div className="table-wrapper" style={{ overflowX: 'auto' }}>
                                    <table className="crm-table admin-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
                                        <thead>
                                            <tr style={{ borderBottom: '1px solid var(--dash-border)', backgroundColor: 'var(--dash-surface)' }}>
                                                {['Lead Contact', 'Interested Property', 'Message', 'Date', 'Status', 'Actions'].map(h => (
                                                    <th key={h} style={{ padding: '14px 16px', textAlign: h === 'Actions' ? 'right' : 'left', fontSize: '11px', fontWeight: 600, color: 'var(--dash-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>{h}</th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filtered.map(lead => {
                                                const sc = STATUS_STYLES[lead.status] || { bg: '#f1f5f9', color: '#64748b' };
                                                return (
                                                    <tr
                                                        key={lead._id}
                                                        onClick={() => openPanel(lead)}
                                                        style={{ borderBottom: '1px solid var(--dash-border)', cursor: 'pointer', backgroundColor: selectedLead?._id === lead._id ? 'var(--dash-surface)' : 'white', verticalAlign: 'middle' }}
                                                    >
                                                        <td style={{ padding: '14px 16px' }}>
                                                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                                <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#eff6ff', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '14px', flexShrink: 0 }}>
                                                                    {(lead.name || '?')[0].toUpperCase()}
                                                                </div>
                                                                <div>
                                                                    <div style={{ fontWeight: 600, color: 'var(--dash-text-main)', fontSize: '14px' }}>{lead.name}</div>
                                                                    <div style={{ fontSize: '12px', color: 'var(--dash-text-muted)' }}>{lead.email}</div>
                                                                    <div style={{ fontSize: '12px', color: 'var(--dash-text-muted)' }}>{lead.phone}</div>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td style={{ padding: '14px 16px' }}>
                                                            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '13px', background: 'var(--dash-surface)', padding: '4px 10px', borderRadius: '20px', fontWeight: 500 }}>
                                                                <i className="ri-building-line" style={{ color: 'var(--dash-primary)' }} /> {lead.interestedProperty || '—'}
                                                            </div>
                                                        </td>
                                                        <td style={{ padding: '14px 16px', maxWidth: '220px' }}>
                                                            <div style={{ fontSize: '13px', color: 'var(--dash-text-main)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                                {lead.message || '—'}
                                                            </div>
                                                        </td>
                                                        <td style={{ padding: '14px 16px' }}>
                                                            <div style={{ fontSize: '13px', color: 'var(--dash-text-muted)', whiteSpace: 'nowrap' }}>{getDateLabel(lead.createdAt)}</div>
                                                        </td>
                                                        <td style={{ padding: '14px 16px' }} onClick={e => e.stopPropagation()}>
                                                            <select
                                                                value={lead.status}
                                                                onChange={e => handleStatusChange(lead._id, e.target.value)}
                                                                style={{ padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 600, background: sc.bg, color: sc.color, border: `1px solid ${sc.color}40`, cursor: 'pointer', outline: 'none' }}
                                                            >
                                                                <option value="New">New Lead</option>
                                                                <option value="Contacted">Contacted</option>
                                                                <option value="Closed">Closed</option>
                                                            </select>
                                                        </td>
                                                        <td style={{ padding: '14px 16px', textAlign: 'right', whiteSpace: 'nowrap' }} onClick={e => e.stopPropagation()}>
                                                            {lead.phone && (
                                                                <a href={`https://wa.me/91${lead.phone.replace(/\D/g, '')}`} target="_blank" rel="noreferrer"
                                                                    style={{ background: '#ecfdf5', color: '#059669', borderRadius: '8px', padding: '5px 10px', fontSize: '12px', fontWeight: 600, textDecoration: 'none', display: 'inline-block', marginRight: '6px' }}>
                                                                    <i className="ri-whatsapp-line" />
                                                                </a>
                                                            )}
                                                            <button onClick={() => handleDelete(lead._id)}
                                                                style={{ background: '#fef2f2', color: '#dc2626', border: 'none', borderRadius: '8px', padding: '5px 10px', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}>
                                                                <i className="ri-delete-bin-line" />
                                                            </button>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </main>

            {/* ─── Slide-Out Lead Detail Panel ─── */}
            <div className={`detail-panel ${selectedLead ? 'open' : ''}`}
                style={{ position: 'fixed', top: 0, right: selectedLead ? 0 : '-420px', width: '400px', height: '100vh', background: 'white', boxShadow: '-5px 0 30px rgba(0,0,0,0.08)', zIndex: 1000, transition: 'right 0.3s ease', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 24px', borderBottom: '1px solid var(--dash-border)', flexShrink: 0 }}>
                    <div style={{ fontSize: '15px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <i className="ri-profile-line" style={{ color: 'var(--dash-text-muted)' }} /> Lead Details
                    </div>
                    <i className="ri-close-line" onClick={closePanel} style={{ fontSize: '20px', cursor: 'pointer', color: 'var(--dash-text-muted)' }} />
                </div>

                {selectedLead && (
                    <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
                        {/* Header */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                            <div>
                                <h2 style={{ fontSize: '20px', fontWeight: 700, letterSpacing: '-0.5px', marginBottom: '6px', color: '#0f172a' }}>{selectedLead.name}</h2>
                                <span style={{ padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 600, background: (STATUS_STYLES[selectedLead.status] || {}).bg, color: (STATUS_STYLES[selectedLead.status] || {}).color }}>
                                    {selectedLead.status}
                                </span>
                            </div>
                            <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: '#eff6ff', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '18px' }}>
                                {(selectedLead.name || '?')[0].toUpperCase()}
                            </div>
                        </div>

                        {/* Contact Card */}
                        <div style={{ background: 'var(--dash-surface)', borderRadius: '12px', padding: '16px', marginBottom: '20px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px', fontSize: '14px' }}>
                                <i className="ri-mail-line" style={{ color: 'var(--dash-text-muted)', width: '16px' }} />
                                <a href={`mailto:${selectedLead.email}`} style={{ color: 'var(--dash-primary)', textDecoration: 'none', fontWeight: 500 }}>{selectedLead.email}</a>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px', fontSize: '14px' }}>
                                <i className="ri-phone-line" style={{ color: 'var(--dash-text-muted)', width: '16px' }} />
                                <span>{selectedLead.phone}</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', paddingTop: '10px', borderTop: '1px dashed var(--dash-border)', fontSize: '14px' }}>
                                <i className="ri-building-line" style={{ color: 'var(--dash-text-muted)', width: '16px', marginTop: '2px' }} />
                                <div>
                                    <div style={{ fontSize: '11px', color: 'var(--dash-text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Interested In</div>
                                    <div style={{ fontWeight: 500, marginTop: '2px' }}>{selectedLead.interestedProperty || '—'}</div>
                                </div>
                            </div>
                        </div>

                        {/* Message */}
                        {selectedLead.message && (
                            <div style={{ marginBottom: '20px' }}>
                                <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--dash-text-muted)', fontWeight: 600, marginBottom: '8px' }}>Inquiry Message</div>
                                <div style={{ background: 'var(--dash-bg)', padding: '14px 16px', borderRadius: '10px', border: '1px solid var(--dash-border)', fontStyle: 'italic', fontSize: '14px', lineHeight: 1.6, color: 'var(--dash-text-main)' }}>
                                    "{selectedLead.message}"
                                </div>
                            </div>
                        )}

                        {/* Notes Timeline */}
                        {selectedLead.notes?.length > 0 && (
                            <div style={{ marginBottom: '20px' }}>
                                <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--dash-text-muted)', fontWeight: 600, marginBottom: '12px' }}>Notes</div>
                                <div style={{ borderLeft: '2px solid var(--dash-border)', paddingLeft: '16px' }}>
                                    {selectedLead.notes.map((note, idx) => (
                                        <div key={idx} style={{ position: 'relative', marginBottom: '12px' }}>
                                            <div style={{ position: 'absolute', left: '-22px', top: '4px', width: '8px', height: '8px', borderRadius: '50%', background: 'var(--dash-primary)', border: '2px solid white' }} />
                                            <div style={{ fontSize: '11px', color: 'var(--dash-text-muted)', marginBottom: '4px' }}>
                                                {new Date(note.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                                            </div>
                                            <div style={{ background: '#eff6ff', borderColor: '#bfdbfe', padding: '10px 12px', borderRadius: '8px', fontSize: '13px', border: '1px solid', color: '#1e40af' }}>
                                                {note.text}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Add Note */}
                        <div>
                            <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--dash-text-muted)', fontWeight: 600, marginBottom: '8px' }}>Add Note</div>
                            <textarea
                                value={noteText}
                                onChange={e => setNoteText(e.target.value)}
                                placeholder="Type internal note about this lead..."
                                style={{ width: '100%', minHeight: '80px', padding: '12px', borderRadius: '10px', border: '1px solid var(--dash-border)', background: 'white', resize: 'vertical', fontSize: '13px', outline: 'none', marginBottom: '10px', fontFamily: 'inherit', boxSizing: 'border-box' }}
                            />
                            <button onClick={handleAddNote} disabled={savingNote || !noteText.trim()}
                                style={{ width: '100%', padding: '10px', borderRadius: '10px', background: 'var(--dash-primary)', color: 'white', border: 'none', fontSize: '13px', fontWeight: 600, cursor: 'pointer', opacity: (!noteText.trim() || savingNote) ? 0.6 : 1 }}>
                                {savingNote ? 'Saving...' : 'Add Note'}
                            </button>
                        </div>
                    </div>
                )}

                {/* Panel Footer */}
                <div style={{ padding: '16px 24px', borderTop: '1px solid var(--dash-border)', background: 'var(--dash-surface)', display: 'flex', gap: '10px', flexShrink: 0 }}>
                    <a href={selectedLead ? `mailto:${selectedLead.email}` : '#'}
                        style={{ flex: 1, justifyContent: 'center', padding: '10px', borderRadius: '10px', border: '1px solid var(--dash-border)', background: 'white', fontSize: '13px', fontWeight: 500, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', textDecoration: 'none', color: 'var(--dash-text-main)' }}>
                        <i className="ri-mail-send-line" /> Email
                    </a>
                    <a href={selectedLead?.phone ? `https://wa.me/91${selectedLead.phone.replace(/\D/g, '')}` : '#'} target="_blank" rel="noreferrer"
                        style={{ flex: 1, justifyContent: 'center', padding: '10px', borderRadius: '10px', border: 'none', background: '#25D366', color: 'white', fontSize: '13px', fontWeight: 500, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', textDecoration: 'none' }}>
                        <i className="ri-whatsapp-line" /> WhatsApp
                    </a>
                </div>
            </div>
        </div>
    );
};

export default Leads;
