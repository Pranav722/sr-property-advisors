import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from '../components/AdminSidebar';
import AdminHeader from '../components/AdminHeader';
import Toast from '../components/Toast';
import api from '../services/api';
import '../dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();

  const [inquiries, setInquiries] = useState([]);
  const [projects, setProjects] = useState([]);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toasts, setToasts] = useState([]);
  const [modal, setModal] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Form state — field names NOW match the backend Project model
  const [projectForm, setProjectForm] = useState({
    title: '', location: '', type: 'Apartment', price: '', status: 'Available', description: ''
  });
  const [coverFile, setCoverFile] = useState(null);
  const [saving, setSaving] = useState(false);

  /* ─── Helpers ─── */
  const addToast = useCallback((text, type = 'success') => {
    const id = Date.now();
    setToasts(t => [...t, { id, text, type }]);
    setTimeout(() => setToasts(t => t.filter(m => m.id !== id)), 4000);
  }, []);
  const dismissToast = (id) => setToasts(t => t.filter(m => m.id !== id));

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userInfo');
    navigate('/login');
  };

  /* ─── Fetch Data ─── */
  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const [inqRes, projRes, locRes] = await Promise.allSettled([
        api.get('/inquiries'),
        api.get('/projects'),
        api.get('/locations'),
      ]);
      if (inqRes.status === 'fulfilled') {
        const d = inqRes.value.data;
        setInquiries(Array.isArray(d) ? d : (d?.data || []));
      }
      if (projRes.status === 'fulfilled') {
        const d = projRes.value.data;
        setProjects(Array.isArray(d) ? d : (d?.data || []));
      }
      if (locRes.status === 'fulfilled') {
        const d = locRes.value.data;
        setLocations(Array.isArray(d) ? d : (d?.data || []));
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
    if (!projectForm.location) return addToast('Please select a location', 'error');
    setSaving(true);
    try {
      // Always use FormData so file upload works
      const fd = new FormData();
      Object.entries(projectForm).forEach(([k, v]) => fd.append(k, v));
      if (coverFile) fd.append('coverImage', coverFile);

      if (modal?.data?._id) {
        await api.put(`/projects/${modal.data._id}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
        addToast('Project updated!', 'success');
      } else {
        await api.post('/projects', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
        addToast('Project added!', 'success');
      }
      setModal(null);
      setCoverFile(null);
      fetchAll();
    } catch (err) {
      addToast(err.response?.data?.message || err.response?.data?.errors?.[0]?.msg || 'Failed to save project.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteProject = async (id, title) => {
    if (!window.confirm(`Delete "${title}"? This cannot be undone.`)) return;
    try {
      await api.delete(`/projects/${id}`);
      addToast(`"${title}" deleted.`, 'success');
      setProjects(p => p.filter(x => x._id !== id));
    } catch {
      addToast('Could not delete project.', 'error');
    }
  };

  const openEditProject = (p) => {
    setProjectForm({
      title: p.title || '',
      location: p.location?._id || p.location || '',
      type: p.type || 'Apartment',
      price: p.price || '',
      status: p.status || 'Available',
      description: p.description || ''
    });
    setCoverFile(null);
    setModal({ type: 'project', data: p });
  };

  const openNewProject = () => {
    setProjectForm({ title: '', location: '', type: 'Apartment', price: '', status: 'Available', description: '' });
    setCoverFile(null);
    setModal({ type: 'project', data: null });
  };

  /* ─── CRUD : Inquiries ─── */
  const handleDeleteInquiry = async (id) => {
    try {
      await api.delete(`/inquiries/${id}`);
      addToast('Inquiry deleted.', 'success');
      setInquiries(i => i.filter(x => x._id !== id));
    } catch {
      addToast('Could not delete inquiry.', 'error');
    }
  };

  /* ─── Stats ─── */
  const stats = [
    { label: 'Total Projects', value: projects.length, icon: 'ri-building-2-line', color: '#2563eb' },
    { label: 'Active Listings', value: projects.filter(p => p.status !== 'Sold Out').length, icon: 'ri-home-smile-2-line', color: '#059669' },
    { label: 'Total Inquiries', value: inquiries.length, icon: 'ri-mail-star-line', color: '#d97706' },
    { label: 'New Today', value: inquiries.filter(i => new Date(i.createdAt).toDateString() === new Date().toDateString()).length, icon: 'ri-alarm-line', color: '#7c3aed' },
  ];

  const inp = {
    width: '100%', padding: '0.75rem 1rem', border: '1.5px solid #e2e8f0', borderRadius: '10px',
    fontFamily: 'Inter, sans-serif', fontSize: '0.9rem', outline: 'none', marginBottom: '1rem',
    display: 'block', boxSizing: 'border-box',
  };

  const STATUS_COLORS = {
    Available: { bg: '#ecfdf5', color: '#059669' },
    Upcoming: { bg: '#eff6ff', color: '#2563eb' },
    'Sold Out': { bg: '#fef2f2', color: '#dc2626' },
  };

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
                <p style={{ marginTop: '0.75rem' }}>No projects yet. Add them from the Projects menu.</p>
              </div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                  <thead>
                    <tr style={{ background: '#f8fafc' }}>
                      {['Project Title', 'Location', 'Type', 'Price', 'Status', 'Actions'].map(h => (
                        <th key={h} style={{ padding: '0.875rem 1.25rem', textAlign: h === 'Actions' ? 'right' : 'left', fontWeight: 600, color: '#64748b', fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {projects.map((p, i) => {
                      const sc = STATUS_COLORS[p.status] || { bg: '#f1f5f9', color: '#64748b' };
                      return (
                        <tr key={p._id} style={{ borderTop: '1px solid #f1f5f9', background: i % 2 === 0 ? '#fff' : '#fafafa', verticalAlign: 'middle' }}>
                          <td style={{ padding: '1rem 1.25rem', fontWeight: 600, color: '#0f172a' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                              {p.coverImage && (
                                <img src={`${import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000'}${p.coverImage}`} alt="" style={{ width: '36px', height: '36px', borderRadius: '8px', objectFit: 'cover', flexShrink: 0 }} />
                              )}
                              {p.title}
                            </div>
                          </td>
                          <td style={{ padding: '1rem 1.25rem', color: '#64748b' }}><i className="ri-map-pin-line" /> {p.location?.name || '—'}</td>
                          <td style={{ padding: '1rem 1.25rem', color: '#374151' }}>{p.type || '—'}</td>
                          <td style={{ padding: '1rem 1.25rem', fontWeight: 600, color: '#0f172a' }}>{p.price || '—'}</td>
                          <td style={{ padding: '1rem 1.25rem' }}>
                            <span style={{ padding: '0.3rem 0.75rem', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 600, background: sc.bg, color: sc.color }}>{p.status}</span>
                          </td>
                          <td style={{ padding: '1rem 1.25rem', textAlign: 'right', whiteSpace: 'nowrap' }}>
                            <button onClick={() => openEditProject(p)} style={{ background: '#eff6ff', color: '#2563eb', border: 'none', borderRadius: '8px', padding: '0.4rem 0.75rem', cursor: 'pointer', marginRight: '0.5rem', fontSize: '0.8rem', fontWeight: 600 }}>
                              <i className="ri-edit-line" /> Edit
                            </button>
                            <button onClick={() => handleDeleteProject(p._id, p.title)} style={{ background: '#fef2f2', color: '#dc2626', border: 'none', borderRadius: '8px', padding: '0.4rem 0.75rem', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600 }}>
                              <i className="ri-delete-bin-line" /> Delete
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
                      {['Name', 'Email / Phone', 'Property', 'Message', 'Date', 'Actions'].map(h => (
                        <th key={h} style={{ padding: '0.875rem 1.25rem', textAlign: h === 'Actions' ? 'right' : 'left', fontWeight: 600, color: '#64748b', fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {inquiries.map((inq, i) => (
                      <tr key={inq._id} style={{ borderTop: '1px solid #f1f5f9', background: i % 2 === 0 ? '#fff' : '#fafafa', verticalAlign: 'middle' }}>
                        <td style={{ padding: '1rem 1.25rem', fontWeight: 600, color: '#0f172a' }}>{inq.name}</td>
                        <td style={{ padding: '1rem 1.25rem', color: '#64748b', fontSize: '0.85rem' }}>
                          <div>{inq.email}</div>
                          {inq.phone && <div style={{ marginTop: '0.2rem' }}>{inq.phone}</div>}
                        </td>
                        <td style={{ padding: '1rem 1.25rem', color: '#374151', fontSize: '0.85rem' }}>{inq.interestedProperty || '—'}</td>
                        <td style={{ padding: '1rem 1.25rem', color: '#374151', maxWidth: '220px' }}>
                          <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: '0.85rem' }}>{inq.message || '—'}</div>
                        </td>
                        <td style={{ padding: '1rem 1.25rem', color: '#94a3b8', fontSize: '0.82rem', whiteSpace: 'nowrap' }}>
                          {new Date(inq.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </td>
                        <td style={{ padding: '1rem 1.25rem', textAlign: 'right', whiteSpace: 'nowrap' }}>
                          {inq.phone && (
                            <a href={`https://wa.me/91${inq.phone.replace(/\D/g, '')}`} target="_blank" rel="noreferrer" style={{ background: '#ecfdf5', color: '#059669', border: 'none', borderRadius: '8px', padding: '0.4rem 0.75rem', cursor: 'pointer', marginRight: '0.5rem', fontSize: '0.8rem', fontWeight: 600, textDecoration: 'none', display: 'inline-block' }}>
                              <i className="ri-whatsapp-line" /> WA
                            </a>
                          )}
                          <button onClick={() => handleDeleteInquiry(inq._id)} style={{ background: '#fef2f2', color: '#dc2626', border: 'none', borderRadius: '8px', padding: '0.4rem 0.75rem', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600 }}>
                            <i className="ri-delete-bin-line" />
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

      {/* ─── Add / Edit Project Modal ─── */}
      {modal?.type === 'project' && (
        <div onClick={e => { if (e.target === e.currentTarget) setModal(null); }}
          style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.6)', backdropFilter: 'blur(4px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div style={{ background: '#fff', borderRadius: '20px', padding: '2rem', maxWidth: '540px', width: '100%', boxShadow: '0 24px 64px rgba(0,0,0,0.2)', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0f172a' }}>{modal.data ? 'Edit Project' : 'Add New Project'}</h3>
              <button onClick={() => setModal(null)} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: '#94a3b8' }}><i className="ri-close-line" /></button>
            </div>

            <form onSubmit={handleSaveProject}>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '0.35rem' }}>Project Title *</label>
              <input required style={inp} placeholder="e.g. Green Valley Residency" value={projectForm.title} onChange={e => setProjectForm(f => ({ ...f, title: e.target.value }))} />

              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '0.35rem' }}>Location *</label>
              <select required style={inp} value={projectForm.location} onChange={e => setProjectForm(f => ({ ...f, location: e.target.value }))}>
                <option value="">Select Location</option>
                {locations.map(l => <option key={l._id} value={l._id}>{l.name}</option>)}
              </select>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '0.35rem' }}>Type *</label>
                  <select style={{ ...inp, marginBottom: 0 }} value={projectForm.type} onChange={e => setProjectForm(f => ({ ...f, type: e.target.value }))}>
                    {['Plot', 'House', 'Building', 'Villa', 'Apartment', 'Office Space', 'Warehouse'].map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '0.35rem' }}>Status</label>
                  <select style={{ ...inp, marginBottom: 0 }} value={projectForm.status} onChange={e => setProjectForm(f => ({ ...f, status: e.target.value }))}>
                    {['Available', 'Upcoming', 'Sold Out'].map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
              </div>

              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#374151', display: 'block', margin: '1rem 0 0.35rem' }}>Price (e.g. ₹4.5 Cr)</label>
              <input style={inp} placeholder="₹" value={projectForm.price} onChange={e => setProjectForm(f => ({ ...f, price: e.target.value }))} />

              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '0.35rem' }}>Description</label>
              <textarea rows={3} style={{ ...inp, resize: 'vertical' }} value={projectForm.description} onChange={e => setProjectForm(f => ({ ...f, description: e.target.value }))} />

              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '0.35rem' }}>Cover Image</label>
              <input type="file" accept="image/*" style={{ ...inp, padding: '0.5rem', border: '1.5px dashed #e2e8f0', cursor: 'pointer' }}
                onChange={e => setCoverFile(e.target.files[0])} />
              {coverFile && <div style={{ fontSize: '0.8rem', color: '#059669', marginBottom: '0.75rem' }}>✓ {coverFile.name}</div>}
              {modal?.data?.coverImage && !coverFile && (
                <div style={{ marginBottom: '1rem' }}>
                  <img src={`${import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000'}${modal.data.coverImage}`} alt="Cover" style={{ width: '80px', height: '60px', objectFit: 'cover', borderRadius: '8px' }} />
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '4px' }}>Current cover image</div>
                </div>
              )}

              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button type="button" onClick={() => setModal(null)} style={{ flex: 1, padding: '0.75rem', border: '1.5px solid #e2e8f0', borderRadius: '10px', background: '#fff', fontWeight: 600, cursor: 'pointer', fontSize: '0.9rem' }}>Cancel</button>
                <button type="submit" disabled={saving} style={{ flex: 2, padding: '0.75rem', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: 700, cursor: 'pointer', fontSize: '0.9rem', opacity: saving ? 0.7 : 1 }}>
                  {saving ? 'Saving…' : modal.data ? 'Update Project' : 'Create Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
