import React from 'react';
import { useNavigate } from 'react-router-dom';

const AdminHeader = ({ onMenuClick }) => {
    const navigate = useNavigate();
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userInfo');
        navigate('/login');
    };

    return (
        <header className="top-header">
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <button className="mobile-nav-toggle" onClick={onMenuClick}>
                    <i className="ri-menu-2-line"></i>
                </button>
                <div className="search-container">
                    <i className="ri-search-line"></i>
                    <input type="text" className="search-input" placeholder="Search projects, plots, or leads..." />
                </div>
            </div>

            <div className="header-actions">
                <button onClick={handleLogout} style={{ padding: '0.4rem 0.75rem', background: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', fontSize: '0.85rem' }}>
                    <i className="ri-logout-circle-r-line" /> Logout
                </button>
                <div className="user-profile">
                    <div style={{ textAlign: 'right' }} className="max-sm:hidden">
                        <div className="text-sm font-semibold">{userInfo?.name || 'Admin User'}</div>
                        <div className="text-xs text-muted">Administrator</div>
                    </div>
                    <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(userInfo?.name || 'Admin')}&background=eff6ff&color=2563eb`}
                        alt="User Avatar" className="avatar" style={{ borderRadius: '50%', objectFit: 'cover' }} />
                </div>
            </div>
        </header>
    );
};

export default AdminHeader;
