import React, { useState, useEffect } from 'react';
import AdminSidebar from '../components/AdminSidebar';
import AdminHeader from '../components/AdminHeader';
import Toast from '../components/Toast';
import api from '../services/api';
import '../dashboard.css';

const UsersAdmin = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [toasts, setToasts] = useState([]);

    const addToast = (msg, type = 'success') => {
        setToasts(prev => [...prev, { id: Date.now(), message: msg, type }]);
    };
    const dismissToast = (id) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const { data } = await api.get('/users');
            if (data.success) {
                setUsers(data.data);
            }
        } catch (error) {
            addToast('Failed to load users', 'error');
        } finally {
            setLoading(false);
        }
    };

    const toggleRole = async (userId, currentRole) => {
        const newRole = currentRole === 'admin' ? 'user' : 'admin';
        try {
            const { data } = await api.put(`/users/${userId}/role`, { role: newRole });
            if (data.success) {
                addToast(`User role updated to ${newRole}`, 'success');
                setUsers(users.map(u => u._id === userId ? { ...u, role: newRole } : u));
            }
        } catch (error) {
            addToast(error?.response?.data?.message || 'Failed to update role', 'error');
        }
    };

    return (
        <div style={{ backgroundColor: 'var(--dash-bg)', minHeight: '100vh', display: 'flex', fontFamily: "'Inter', sans-serif", color: 'var(--dash-text-main)' }}>
            <Toast messages={toasts} onDismiss={dismissToast} />
            <AdminSidebar open={sidebarOpen} />

            <main className="main-content" style={{ flex: 1, minWidth: 0 }}>
                <AdminHeader onMenuClick={() => setSidebarOpen(!sidebarOpen)} />

                {/* Dark Hero Header */}
                <div style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', padding: '2rem 2rem 1.5rem' }}>
                    <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
                        <div>
                            <h1 style={{ color: '#fff', fontSize: '1.6rem', fontWeight: 800, letterSpacing: '-0.03em', margin: 0 }}>Staff & Admins</h1>
                            <p style={{ color: '#94a3b8', marginTop: '0.35rem', fontSize: '0.9rem', margin: '0.35rem 0 0' }}>Manage website administrators and staff roles.</p>
                        </div>
                    </div>
                </div>

                <div className="dashboard-content" style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1.5rem' }}>

                    <div className="table-card" style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
                        <div className="table-responsive">
                            <table className="admin-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr style={{ borderBottom: '1px solid #e2e8f0', background: '#f8fafc' }}>
                                        <th style={{ padding: '1rem', textAlign: 'left', color: '#64748b', fontWeight: 600, fontSize: '0.85rem' }}>Name</th>
                                        <th style={{ padding: '1rem', textAlign: 'left', color: '#64748b', fontWeight: 600, fontSize: '0.85rem' }}>Email</th>
                                        <th style={{ padding: '1rem', textAlign: 'left', color: '#64748b', fontWeight: 600, fontSize: '0.85rem' }}>Role</th>
                                        <th style={{ padding: '1rem', textAlign: 'right', color: '#64748b', fontWeight: 600, fontSize: '0.85rem' }}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {loading ? (
                                        <tr><td colSpan="4" style={{ textAlign: 'center', padding: '2rem' }}>Loading users...</td></tr>
                                    ) : users.length === 0 ? (
                                        <tr><td colSpan="4" style={{ textAlign: 'center', padding: '2rem' }}>No users found.</td></tr>
                                    ) : (
                                        users.map(user => (
                                            <tr key={user._id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                                <td style={{ padding: '1rem', fontWeight: 500 }}>{user.name}</td>
                                                <td style={{ padding: '1rem', color: '#64748b' }}>{user.email}</td>
                                                <td style={{ padding: '1rem' }}>
                                                    <span style={{ 
                                                        padding: '0.25rem 0.75rem', 
                                                        borderRadius: '999px', 
                                                        fontSize: '0.75rem', 
                                                        fontWeight: 600,
                                                        background: user.role === 'admin' ? '#eff6ff' : '#f1f5f9',
                                                        color: user.role === 'admin' ? '#2563eb' : '#64748b'
                                                    }}>
                                                        {user.role === 'admin' ? 'Admin' : 'User'}
                                                    </span>
                                                </td>
                                                <td style={{ padding: '1rem', textAlign: 'right' }}>
                                                    <button 
                                                        onClick={() => toggleRole(user._id, user.role)}
                                                        style={{ 
                                                            padding: '0.5rem 1rem', 
                                                            borderRadius: '6px', 
                                                            border: 'none', 
                                                            fontWeight: 600, 
                                                            cursor: 'pointer',
                                                            fontSize: '0.8rem',
                                                            background: user.role === 'admin' ? '#fef2f2' : '#ecfdf5',
                                                            color: user.role === 'admin' ? '#dc2626' : '#059669',
                                                            transition: 'background 0.2s'
                                                        }}
                                                    >
                                                        {user.role === 'admin' ? 'Revoke Admin' : 'Make Admin'}
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default UsersAdmin;
