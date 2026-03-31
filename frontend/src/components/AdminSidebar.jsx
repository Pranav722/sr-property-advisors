import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const AdminSidebar = ({ open }) => {
    const location = useLocation();
    const isActive = (path) => location.pathname === path ? 'nav-item active' : 'nav-item';

    return (
        <aside className={`sidebar ${open ? 'open' : ''}`} id="sidebar">
            <div className="sidebar-header">
                <div className="sidebar-brand">
                    <div className="sidebar-brand-icon">
                        <i className="ri-building-4-fill" style={{ fontSize: '14px' }}></i>
                    </div>
                    SR Advisory Admin
                </div>
            </div>

            <div className="sidebar-nav">
                <div className="nav-section">
                    <div className="nav-title">Menu</div>
                    <Link to="/dashboard" className={isActive('/dashboard')}>
                        <i className="ri-dashboard-line"></i> Dashboard
                    </Link>
                    <Link to="/projects-admin" className={isActive('/projects-admin')}>
                        <i className="ri-building-line"></i> Projects
                    </Link>
                    <Link to="/inventory" className={isActive('/inventory')}>
                        <i className="ri-map-pin-line"></i> Plot Inventory
                    </Link>
                    <Link to="/locations" className={isActive('/locations')}>
                        <i className="ri-compass-3-line"></i> Locations
                    </Link>
                    <Link to="/settings" className={isActive('/settings')}>
                        <i className="ri-settings-4-line"></i> Settings
                    </Link>
                </div>

                <div className="nav-section">
                    <div className="nav-title">Sales & CRM</div>
                    <Link to="/leads" className={isActive('/leads')}>
                        <i className="ri-user-star-line"></i> Leads
                    </Link>
                </div>

                <div className="nav-section">
                    <div className="nav-title">System</div>
                    <Link to="/users-admin" className={isActive('/users-admin')}>
                        <i className="ri-team-line"></i> Staff & Admins
                    </Link>
                    <Link to="/file-manager" className={isActive('/file-manager')}>
                        <i className="ri-folder-open-line"></i> File Manager
                    </Link>
                    <Link to="/" className="nav-item">
                        <i className="ri-global-line"></i> Main Website
                    </Link>
                </div>
            </div>
        </aside>
    );
};

export default AdminSidebar;
