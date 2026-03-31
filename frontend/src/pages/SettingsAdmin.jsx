import React, { useState, useEffect } from 'react';
import AdminSidebar from '../components/AdminSidebar';
import AdminHeader from '../components/AdminHeader';
import Toast from '../components/Toast';
import api from '../services/api';
import '../dashboard.css';

const SettingsAdmin = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [toasts, setToasts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    email: '',
    phone: '',
    whatsapp: '',
    address: '',
    workingHours: '',
    facebook: '',
    instagram: '',
    twitter: '',
  });

  const addToast = (msg, type = 'success') => setToasts(p => [...p, { id: Date.now(), message: msg, type }]);
  const dismissToast = id => setToasts(p => p.filter(t => t.id !== id));

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data } = await api.get('/settings');
        if (data?.data) setForm(data.data);
      } catch (err) {
        addToast('Failed to load settings', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put('/settings', form);
      addToast('Settings updated successfully', 'success');
    } catch (err) {
      addToast('Failed to update settings', 'error');
    } finally {
      setSaving(false);
    }
  };

  const inp = {
    width: '100%', padding: '0.75rem 1rem', border: '1.5px solid #e2e8f0', borderRadius: '10px',
    fontFamily: 'Inter, sans-serif', fontSize: '0.9rem', outline: 'none', marginBottom: '1.25rem',
    display: 'block', boxSizing: 'border-box', background: '#fff'
  };

  const lbl = {
    fontSize: '0.8rem', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '0.4rem', 
    textTransform: 'uppercase', letterSpacing: '0.05em'
  };

  const sectionStyle = {
    background: '#fff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '1.75rem', marginBottom: '1.5rem'
  };

  return (
    <div style={{ backgroundColor: 'var(--dash-bg)', minHeight: '100vh', display: 'flex', fontFamily: "'Inter', sans-serif" }}>
      <Toast messages={toasts} onDismiss={dismissToast} />
      <AdminSidebar open={sidebarOpen} />

      <main className="main-content" style={{ flex: 1, minWidth: 0, overflowY: 'auto' }}>
        <AdminHeader onMenuClick={() => setSidebarOpen(!sidebarOpen)} title="Site Settings" />

        <div style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', padding: '2rem 2rem 1.5rem' }}>
          <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
            <h1 style={{ color: '#fff', fontSize: '1.6rem', fontWeight: 800, letterSpacing: '-0.03em', margin: 0 }}>Global Settings</h1>
            <p style={{ color: '#94a3b8', marginTop: '0.35rem', fontSize: '0.9rem' }}>Manage contact information, address, and social links site-wide.</p>
          </div>
        </div>

        <div style={{ maxWidth: '1000px', margin: '2rem auto', padding: '0 1.5rem' }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '5rem', color: '#94a3b8' }}>
              <i className="ri-loader-4-line" style={{ fontSize: '2.5rem', animation: 'spin 1s linear infinite' }} />
            </div>
          ) : (
            <form onSubmit={handleSave}>
              <div style={sectionStyle}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <i className="ri-contacts-book-line" style={{ color: '#2563eb' }} /> Contact Details
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '0 1.5rem' }}>
                  <div>
                    <label style={lbl}>Email Address</label>
                    <input name="email" value={form.email || ''} onChange={handleChange} style={inp} placeholder="e.g. hello@company.com" />
                  </div>
                  <div>
                    <label style={lbl}>Phone Number</label>
                    <input name="phone" value={form.phone || ''} onChange={handleChange} style={inp} placeholder="e.g. +91 98765 43210" />
                  </div>
                  <div>
                    <label style={lbl}>WhatsApp Number</label>
                    <input name="whatsapp" value={form.whatsapp || ''} onChange={handleChange} style={inp} placeholder="e.g. +91 98765 43210" />
                  </div>
                  <div>
                    <label style={lbl}>Working Hours</label>
                    <input name="workingHours" value={form.workingHours || ''} onChange={handleChange} style={inp} placeholder="e.g. Mon-Sat: 9AM - 6PM" />
                  </div>
                </div>
                <div style={{ marginTop: '0.5rem' }}>
                  <label style={lbl}>Physical Address</label>
                  <textarea name="address" value={form.address || ''} onChange={handleChange} rows={2} style={{ ...inp, resize: 'vertical' }} placeholder="Enter full address" />
                </div>
              </div>

              <div style={sectionStyle}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <i className="ri-share-forward-line" style={{ color: '#d97706' }} /> Social & Links
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '0 1.5rem' }}>
                  <div>
                    <label style={lbl}>Facebook URL</label>
                    <input name="facebook" value={form.facebook || ''} onChange={handleChange} style={inp} placeholder="https://facebook.com/yourpage" />
                  </div>
                  <div>
                    <label style={lbl}>Instagram URL</label>
                    <input name="instagram" value={form.instagram || ''} onChange={handleChange} style={inp} placeholder="https://instagram.com/yourhandle" />
                  </div>
                  <div>
                    <label style={lbl}>Twitter / X URL</label>
                    <input name="twitter" value={form.twitter || ''} onChange={handleChange} style={inp} placeholder="https://twitter.com/yourhandle" />
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '3rem' }}>
                <button type="submit" disabled={saving} style={{ background: '#2563eb', color: '#fff', border: 'none', borderRadius: '12px', padding: '0.875rem 2rem', fontWeight: 700, fontSize: '0.95rem', cursor: 'pointer', opacity: saving ? 0.7 : 1, display: 'flex', alignItems: 'center', gap: '0.5rem', boxShadow: '0 4px 12px rgba(37, 99, 235, 0.2)' }}>
                  {saving ? (
                    <><i className="ri-loader-4-line" style={{ animation: 'spin 1s linear infinite' }} /> Saving...</>
                  ) : (
                    <><i className="ri-save-3-line" /> Save Settings</>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </main>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

export default SettingsAdmin;
