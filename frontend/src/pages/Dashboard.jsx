import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AdminSidebar from '../components/AdminSidebar';
import AdminHeader from '../components/AdminHeader';
import api from '../services/api';
import '../dashboard.css';

/* ─── Toast Notification (no browser alerts!) ─── */
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
        <span style={{ fontSize: '0.9rem', fontWeight: 500, color: '#1e293b', flex: 1 }}>{m.text}</span>
        <button onClick={() => onDismiss(m.id)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '1.1rem' }}>
          <i className="ri-close-line" />
        </button>
      </div>
    ))}
  </div>
);

/* ─── Modal ─── */
const Modal = ({ title, children, onClose }) => (
  <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.6)', backdropFilter: 'blur(4px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }} onClick={onClose}>
    <div style={{ background: '#fff', borderRadius: '20px', padding: '2rem', maxWidth: '560px', width: '100%', boxShadow: '0 24px 64px rgba(0,0,0,0.2)', maxHeight: '85vh', overflowY: 'auto' }} onClick={e => e.stopPropagation()}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0f172a' }}>{title}</h3>
        <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '1.5rem' }}>
          <i className="ri-close-line" />
        </button>
      </div>
      {children}
    </div>
  </div>
);

const inputStyle = {
  width: '100%', padding: '0.75rem 1rem', border: '1.5px solid #e2e8f0', borderRadius: '10px',
  fontFamily: 'Inter, sans-serif', fontSize: '0.95rem', outline: 'none', marginBottom: '1rem', display: 'block',
};

const Dashboard = () => {
  const navigate = useNavigate();
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));

  const [inquiries, setInquiries] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toasts, setToasts] = useState([]);
  const [modal, setModal] = useState(null); // { type: 'inquiry' | 'project' | 'viewInquiry', data?: {} }
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Form states
  const [projectForm, setProjectForm] = useState({ name: '', location: '', type: 'Apartment', price: '', status: 'For Sale', description: '' });
  const [saving, setSaving] = useState(false);

  /* ─── Helpers ─── */
  const addToast = useCallback((text, type = 'success') => {
    const id = Date.now();
    setToasts(t => [...t, { id, text, type }]);
    setTimeout(() => setToasts(t => t.filter(m => m.id !== id)), 4000);
  }, []);
  const dismissToast = (id) => setToasts(t => t.filter(m => m.id !== id));

  /* ─── Logout ─── */
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userInfo');
    navigate('/login');
  };

  /* ─── Fetch Data ─── */
  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const [inqRes, projRes] = await Promise.allSettled([
        api.get('/inquiries'),
        api.get('/projects'),
      ]);
      if (inqRes.status === 'fulfilled') {
        const d = inqRes.value.data;
        setInquiries(Array.isArray(d) ? d : (d?.data || []));
      }
      if (projRes.status === 'fulfilled') {
        const d = projRes.value.data;
        setProjects(Array.isArray(d) ? d : (d?.data || []));
      }
    } catch {
      addToast('Could not load data. Check backend connection.', 'error');
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  /* ─── CRUD : Projects ─── */
  const handleSaveProject = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (modal?.data?._id) {
        await api.put(`/projects/${modal.data._id}`, projectForm);
        addToast('Project updated successfully!', 'success');
      } else {
        await api.post('/projects', projectForm);
        addToast('Project added successfully!', 'success');
      }
      setModal(null);
      fetchAll();
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to save project.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteProject = async (id, name) => {
    if (!window.confirm) {
      /* Fallback modal flow for no-alert environments */
    }
    try {
      await api.delete(`/projects/${id}`);
      addToast(`"${name}" deleted.`, 'success');
      setProjects(p => p.filter(x => x._id !== id));
    } catch {
      addToast('Could not delete project.', 'error');
    }
  };

  const openEditProject = (p) => {
    setProjectForm({ name: p.name || '', location: p.location || '', type: p.type || 'Apartment', price: p.price || '', status: p.status || 'For Sale', description: p.description || '' });
    setModal({ type: 'project', data: p });
  };

  const openNewProject = () => {
    setProjectForm({ name: '', location: '', type: 'Apartment', price: '', status: 'For Sale', description: '' });
    setModal({ type: 'project', data: null });
  };

  /* ─── CRUD : Inquiries ─── */
  const handleDeleteInquiry = async (id) => {
    try {
      await api.delete(`/inquiries/${id}`);
      addToast('Inquiry archived.', 'success');
      setInquiries(i => i.filter(x => x._id !== id));
    } catch {
      addToast('Could not archive inquiry.', 'error');
    }
  };

  /* ─── Computed Stats ─── */
  const stats = [
    { label: 'Total Projects', value: projects.length, icon: 'ri-building-2-line', color: '#2563eb' },
    { label: 'Active Listings', value: projects.filter(p => p.status !== 'Sold').length, icon: 'ri-home-smile-2-line', color: '#059669' },
    { label: 'Total Inquiries', value: inquiries.length, icon: 'ri-mail-star-line', color: '#d97706' },
    { label: 'New Today', value: inquiries.filter(i => new Date(i.createdAt).toDateString() === new Date().toDateString()).length, icon: 'ri-alarm-line', color: '#7c3aed' },
  ];

  const s = { width: '100%', ...inputStyle };

  return (
    <div style={{ backgroundColor: 'var(--dash-bg)', minHeight: '100vh', display: 'flex', fontFamily: "'Inter', sans-serif", color: 'var(--dash-text-main)' }}>
      <Toast messages={toasts} onDismiss={dismissToast} />

      <AdminSidebar open={sidebarOpen} />

      <main className="main-content" style={{ flex: 1, minWidth: 0 }}>
        <AdminHeader onMenuClick={() => setSidebarOpen(!sidebarOpen)} />

        <div className="dashboard-content" style={{ maxWidth: '1400px', margin: '0 auto', padding: '2rem 1.5rem' }}>

          {/* ─── Page Title ─── */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a' }}>Dashboard</h1>
            <p style={{ color: '#64748b', marginTop: '0.25rem', fontSize: '0.9rem' }}>Manage your projects, inventory and inquiries.</p>
          </div>
          <button onClick={openNewProject} style={{ padding: '0.75rem 1.5rem', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '12px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.95rem' }}>
            <i className="ri-add-line" /> Add New Project
          </button>
        </div>

        {/* ─── Stats ─── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px,1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
          {stats.map(s => (
            <div key={s.label} style={{ background: '#fff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: s.color + '15', color: s.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', flexShrink: 0 }}>
                <i className={s.icon} />
              </div>
              <div>
                <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 500 }}>{s.label}</div>
                <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', lineHeight: 1.2 }}>
                  {loading ? '—' : s.value}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ─── Projects Table ─── */}
        <div style={{ background: '#fff', borderRadius: '20px', border: '1px solid #e2e8f0', marginBottom: '2rem', overflow: 'hidden' }}>
          <div style={{ padding: '1.5rem', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h2 style={{ fontWeight: 700, fontSize: '1.05rem', color: '#0f172a' }}>Projects &amp; Listings</h2>
            <button onClick={fetchAll} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '0.4rem 0.75rem', cursor: 'pointer', fontSize: '0.85rem', color: '#64748b' }}>
              <i className="ri-refresh-line" /> Refresh
            </button>
          </div>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}><i className="ri-loader-4-line" style={{ fontSize: '2rem' }} /></div>
          ) : projects.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
              <i className="ri-building-line" style={{ fontSize: '2.5rem', opacity: 0.3 }} />
              <p style={{ marginTop: '0.75rem' }}>No projects yet. <button onClick={openNewProject} style={{ color: '#2563eb', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}>Add your first one →</button></p>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                <thead>
                  <tr style={{ background: '#f8fafc' }}>
                    {['Project Name', 'Location', 'Type', 'Price', 'Status', 'Actions'].map(h => (
                      <th key={h} style={{ padding: '0.875rem 1.25rem', textAlign: h === 'Actions' ? 'right' : 'left', fontWeight: 600, color: '#64748b', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {projects.map((p, i) => (
                    <tr key={p._id} style={{ borderTop: '1px solid #f1f5f9', background: i % 2 === 0 ? '#fff' : '#fafafa' }}>
                      <td style={{ padding: '1rem 1.25rem', fontWeight: 600, color: '#0f172a' }}>{p.name}</td>
                      <td style={{ padding: '1rem 1.25rem', color: '#64748b' }}><i className="ri-map-pin-line" /> {p.location || '—'}</td>
                      <td style={{ padding: '1rem 1.25rem', color: '#374151' }}>{p.type || '—'}</td>
                      <td style={{ padding: '1rem 1.25rem', fontWeight: 600, color: '#0f172a' }}>{p.price || '—'}</td>
                      <td style={{ padding: '1rem 1.25rem' }}>
                        <span style={{
                          padding: '0.25rem 0.625rem', borderRadius: '99px', fontSize: '0.75rem', fontWeight: 600,
                          background: p.status === 'For Sale' ? '#ecfdf5' : p.status === 'Sold' ? '#fef2f2' : '#eff6ff',
                          color: p.status === 'For Sale' ? '#059669' : p.status === 'Sold' ? '#dc2626' : '#2563eb',
                        }}>{p.status || 'Active'}</span>
                      </td>
                      <td style={{ padding: '1rem 1.25rem', textAlign: 'right' }}>
                        <button onClick={() => openEditProject(p)} style={{ background: '#eff6ff', color: '#2563eb', border: 'none', borderRadius: '8px', padding: '0.4rem 0.75rem', cursor: 'pointer', marginRight: '0.5rem', fontSize: '0.8rem', fontWeight: 600 }}>
                          <i className="ri-edit-line" /> Edit
                        </button>
                        <button onClick={() => handleDeleteProject(p._id, p.name)} style={{ background: '#fef2f2', color: '#dc2626', border: 'none', borderRadius: '8px', padding: '0.4rem 0.75rem', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600 }}>
                          <i className="ri-delete-bin-line" /> Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* ─── Inquiries ─── */}
        <div style={{ background: '#fff', borderRadius: '20px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
          <div style={{ padding: '1.5rem', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h2 style={{ fontWeight: 700, fontSize: '1.05rem', color: '#0f172a' }}>
              Customer Inquiries <span style={{ marginLeft: '0.5rem', padding: '0.15rem 0.5rem', background: '#fef3c7', color: '#d97706', borderRadius: '99px', fontSize: '0.75rem' }}>{inquiries.length}</span>
            </h2>
          </div>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}><i className="ri-loader-4-line" style={{ fontSize: '2rem' }} /></div>
          ) : inquiries.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
              <i className="ri-mail-line" style={{ fontSize: '2.5rem', opacity: 0.3 }} />
              <p style={{ marginTop: '0.75rem' }}>No inquiries yet. They'll appear here when customers contact you.</p>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                <thead>
                  <tr style={{ background: '#f8fafc' }}>
                    {['Name', 'Email / Phone', 'Message', 'Date', 'Actions'].map(h => (
                      <th key={h} style={{ padding: '0.875rem 1.25rem', textAlign: h === 'Actions' ? 'right' : 'left', fontWeight: 600, color: '#64748b', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {inquiries.map((inq, i) => (
                    <tr key={inq._id} style={{ borderTop: '1px solid #f1f5f9', background: i % 2 === 0 ? '#fff' : '#fafafa' }}>
                      <td style={{ padding: '1rem 1.25rem', fontWeight: 600, color: '#0f172a' }}>{inq.name}</td>
                      <td style={{ padding: '1rem 1.25rem', color: '#64748b', fontSize: '0.85rem' }}>
                        <div>{inq.email}</div>
                        {inq.phone && <div style={{ marginTop: '0.2rem' }}>{inq.phone}</div>}
                      </td>
                      <td style={{ padding: '1rem 1.25rem', color: '#374151', maxWidth: '260px' }}>
                        <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{inq.message || inq.interest}</div>
                      </td>
                      <td style={{ padding: '1rem 1.25rem', color: '#94a3b8', fontSize: '0.82rem', whiteSpace: 'nowrap' }}>
                        {new Date(inq.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </td>
                      <td style={{ padding: '1rem 1.25rem', textAlign: 'right' }}>
                        <button onClick={() => setModal({ type: 'viewInquiry', data: inq })} style={{ background: '#eff6ff', color: '#2563eb', border: 'none', borderRadius: '8px', padding: '0.4rem 0.75rem', cursor: 'pointer', marginRight: '0.5rem', fontSize: '0.8rem', fontWeight: 600 }}>
                          <i className="ri-eye-line" /> View
                        </button>
                        <a href={`https://wa.me/91${inq.phone?.replace(/\s/g,'')}`} target="_blank" rel="noreferrer" style={{ background: '#ecfdf5', color: '#059669', border: 'none', borderRadius: '8px', padding: '0.4rem 0.75rem', cursor: 'pointer', marginRight: '0.5rem', fontSize: '0.8rem', fontWeight: 600, textDecoration: 'none', display: 'inline-block' }}>
                          <i className="ri-whatsapp-line" /> WhatsApp
                        </a>
                        <button onClick={() => handleDeleteInquiry(inq._id)} style={{ background: '#fef2f2', color: '#dc2626', border: 'none', borderRadius: '8px', padding: '0.4rem 0.75rem', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600 }}>
                          <i className="ri-archive-line" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          </div>
        </div>
      </main>

      {/* ─── Modals ─── */}
      {modal?.type === 'project' && (
        <Modal title={modal.data ? 'Edit Project' : 'Add New Project'} onClose={() => setModal(null)}>
          <form onSubmit={handleSaveProject}>
            <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#374151', marginBottom: '0.4rem', display: 'block' }}>Project Name *</label>
            <input required style={s} placeholder="e.g. Juhu Sea-View Villa" value={projectForm.name} onChange={e => setProjectForm(f => ({ ...f, name: e.target.value }))} />
            <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#374151', marginBottom: '0.4rem', display: 'block' }}>Location *</label>
            <input required style={s} placeholder="e.g. Juhu, Mumbai" value={projectForm.location} onChange={e => setProjectForm(f => ({ ...f, location: e.target.value }))} />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#374151', marginBottom: '0.4rem', display: 'block' }}>Property Type</label>
                <select style={s} value={projectForm.type} onChange={e => setProjectForm(f => ({ ...f, type: e.target.value }))}>
                  {['Apartment', 'Villa', 'Bungalow', 'Penthouse', 'Plot'].map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#374151', marginBottom: '0.4rem', display: 'block' }}>Status</label>
                <select style={s} value={projectForm.status} onChange={e => setProjectForm(f => ({ ...f, status: e.target.value }))}>
                  {['For Sale', 'New Launch', 'Off-Market', 'Sold'].map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
            </div>
            <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#374151', marginBottom: '0.4rem', display: 'block' }}>Price (e.g. ₹4.5 Cr)</label>
            <input style={s} placeholder="₹" value={projectForm.price} onChange={e => setProjectForm(f => ({ ...f, price: e.target.value }))} />
            <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#374151', marginBottom: '0.4rem', display: 'block' }}>Description</label>
            <textarea rows={3} style={{ ...s, resize: 'vertical' }} value={projectForm.description} onChange={e => setProjectForm(f => ({ ...f, description: e.target.value }))} />
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
              <button type="button" onClick={() => setModal(null)} style={{ padding: '0.75rem 1.5rem', background: '#f1f5f9', color: '#374151', border: 'none', borderRadius: '10px', fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
              <button type="submit" disabled={saving} style={{ padding: '0.75rem 1.5rem', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: 700, cursor: 'pointer' }}>
                {saving ? 'Saving…' : modal.data ? 'Save Changes' : 'Add Project'}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {modal?.type === 'viewInquiry' && (
        <Modal title="Inquiry Details" onClose={() => setModal(null)}>
          {[
            ['Name', modal.data.name],
            ['Email', modal.data.email],
            ['Phone', modal.data.phone || '—'],
            ['Interest', modal.data.interest || '—'],
            ['Message', modal.data.message || modal.data.interest],
            ['Received On', new Date(modal.data.createdAt).toLocaleString('en-IN')],
          ].map(([k, v]) => (
            <div key={k} style={{ display: 'flex', gap: '1rem', padding: '0.875rem 0', borderBottom: '1px solid #f1f5f9' }}>
              <span style={{ minWidth: '110px', fontWeight: 600, color: '#64748b', fontSize: '0.875rem' }}>{k}</span>
              <span style={{ color: '#0f172a', fontSize: '0.9rem', wordBreak: 'break-word' }}>{v}</span>
            </div>
          ))}
          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
            <a href={`mailto:${modal.data.email}`} style={{ flex: 1, padding: '0.75rem', background: '#eff6ff', color: '#2563eb', border: 'none', borderRadius: '10px', fontWeight: 600, cursor: 'pointer', textAlign: 'center', textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}>
              <i className="ri-mail-send-line" /> Reply by Email
            </a>
            {modal.data.phone && (
              <a href={`https://wa.me/91${modal.data.phone.replace(/\s/g,'')}`} target="_blank" rel="noreferrer" style={{ flex: 1, padding: '0.75rem', background: '#ecfdf5', color: '#059669', border: 'none', borderRadius: '10px', fontWeight: 600, cursor: 'pointer', textAlign: 'center', textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}>
                <i className="ri-whatsapp-line" /> WhatsApp
              </a>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Dashboard;
