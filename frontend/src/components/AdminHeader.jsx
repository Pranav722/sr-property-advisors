import React from 'react';

const AdminHeader = ({ onMenuClick }) => {
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
                <button className="icon-btn">
                    <i className="ri-notification-3-line"></i>
                    <span className="notification-badge"></span>
                </button>
                <div className="user-profile">
                    <div style={{ textAlign: 'right' }} className="max-sm:hidden">
                        <div className="text-sm font-semibold">Alex Consultants</div>
                        <div className="text-xs text-muted">Admin</div>
                    </div>
                    <img src="https://ui-avatars.com/api/?name=Alex+Consultants&background=0D8ABC&color=fff"
                        alt="User Avatar" className="avatar" />
                </div>
            </div>
        </header>
    );
};

export default AdminHeader;
