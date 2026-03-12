import React, { useState, useEffect } from 'react';
import AdminSidebar from '../components/AdminSidebar';
import AdminHeader from '../components/AdminHeader';
import '../dashboard.css';

const ProjectsAdmin = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [locations, setLocations] = useState([]);
    const [uploadMode, setUploadMode] = useState('upload'); // 'upload' or 'url'

    useEffect(() => {
        let locsStr = localStorage.getItem('sr_locations');
        if (locsStr) {
            setLocations(JSON.parse(locsStr));
        }
    }, []);

    const addCustomLocation = () => {
        const loc = prompt("Enter new Location Name (e.g., London, UK):");
        if (loc && loc.trim() !== "") {
            const cleanedLoc = loc.trim();
            const newLocs = [...locations];
            if (!newLocs.includes(cleanedLoc)) {
                newLocs.push(cleanedLoc);
                localStorage.setItem('sr_locations', JSON.stringify(newLocs));
                setLocations(newLocs);
                alert(`Location "${cleanedLoc}" added successfully!`);
            } else {
                alert('Location already exists.');
            }
        }
    };

    const handleSaveProject = (e) => {
        e.preventDefault();
        alert('Project Creation mock triggered.');
        setModalOpen(false);
    };

    return (
        <div style={{ backgroundColor: 'var(--dash-bg)', minHeight: '100vh', display: 'flex', fontFamily: "'Inter', sans-serif", color: 'var(--dash-text-main)' }}>
            <AdminSidebar open={sidebarOpen} />

            <main className="main-content">
                <AdminHeader onMenuClick={() => setSidebarOpen(!sidebarOpen)} />

                <div className="dashboard-content">

                    <div className="page-header">
                        <div>
                            <h1 className="text-xl">Projects</h1>
                            <p className="text-sm mt-1">Manage property developments, layouts, and inventory groups.</p>
                        </div>
                        <div style={{ display: 'flex', gap: '12px' }}>
                            <button className="btn btn-outline"><i className="ri-download-line"></i> Export</button>
                            <button className="btn btn-primary" onClick={() => setModalOpen(true)}><i className="ri-add-line"></i> New Project</button>
                        </div>
                    </div>

                    <div className="table-card">
                        <div className="table-header" style={{ flexWrap: 'wrap', gap: '16px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', background: 'var(--dash-bg)', border: '1px solid var(--dash-border)', borderRadius: 'var(--dash-radius)', padding: '6px 12px', width: '260px' }}>
                                <i className="ri-search-line" style={{ color: 'var(--dash-text-muted)', marginRight: '8px' }}></i>
                                <input type="text" style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%', fontSize: '13px' }} placeholder="Search projects..." />
                            </div>

                            <div className="table-filters" style={{ flexWrap: 'wrap' }}>
                                <select className="filter-select">
                                    <option value="">All Locations</option>
                                    <option>Los Angeles</option>
                                    <option>New York</option>
                                    <option>Miami</option>
                                    <option>Dubai</option>
                                    {locations.map(loc => <option key={loc} value={loc}>{loc}</option>)}
                                </select>
                                <button className="icon-btn small" onClick={addCustomLocation} title="Add Location" style={{ border: '1px dashed var(--dash-border)' }}><i className="ri-add-line"></i></button>
                                <select className="filter-select">
                                    <option>Property Type</option>
                                    <option>Plot</option>
                                    <option>House</option>
                                    <option>Building</option>
                                    <option>Villa</option>
                                    <option>Apartment</option>
                                    <option>Office Space</option>
                                    <option>Warehouse</option>
                                </select>
                                <select className="filter-select">
                                    <option>Status</option>
                                    <option>Available</option>
                                    <option>Sold Out</option>
                                    <option>Upcoming</option>
                                </select>
                            </div>
                        </div>

                        <div className="table-responsive">
                            <table className="admin-table">
                                <thead>
                                    <tr>
                                        <th className="sortable">Project Name <i className="ri-expand-up-down-line"></i></th>
                                        <th className="sortable">Location <i className="ri-expand-up-down-line"></i></th>
                                        <th className="sortable">Type <i className="ri-expand-up-down-line"></i></th>
                                        <th>Status</th>
                                        <th className="sortable">Plots Available <i className="ri-expand-up-down-line"></i></th>
                                        <th className="sortable">Created Date <i className="ri-expand-up-down-line"></i></th>
                                        <th style={{ textAlign: 'right' }}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td><div className="font-medium text-main">Beverly Hills Estate</div></td>
                                        <td><i className="ri-map-pin-line text-muted"></i> Los Angeles, CA</td>
                                        <td>Villa</td>
                                        <td><span className="status status-active">Available</span></td>
                                        <td><span className="font-medium text-main">12</span> <span className="text-muted text-xs">/ 45</span></td>
                                        <td>Oct 12, 2025</td>
                                        <td style={{ textAlign: 'right' }}>
                                            <button className="icon-btn" title="View"><i className="ri-eye-line"></i></button>
                                            <button className="icon-btn" style={{ marginLeft: '8px' }} title="Edit"><i className="ri-edit-line"></i></button>
                                            <button className="icon-btn" style={{ marginLeft: '8px', color: '#ef4444' }} title="Delete"><i className="ri-delete-bin-line"></i></button>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td><div className="font-medium text-main">Skyline Penthouse Collection</div></td>
                                        <td><i className="ri-map-pin-line text-muted"></i> New York, NY</td>
                                        <td>Apartment</td>
                                        <td><span className="status status-active">Available</span></td>
                                        <td><span className="font-medium text-main">3</span> <span className="text-muted text-xs">/ 8</span></td>
                                        <td>Nov 04, 2025</td>
                                        <td style={{ textAlign: 'right' }}>
                                            <button className="icon-btn" title="View"><i className="ri-eye-line"></i></button>
                                            <button className="icon-btn" style={{ marginLeft: '8px' }} title="Edit"><i className="ri-edit-line"></i></button>
                                            <button className="icon-btn" style={{ marginLeft: '8px', color: '#ef4444' }} title="Delete"><i className="ri-delete-bin-line"></i></button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </main>

            {/* Project Creation Modal */}
            {modalOpen && (
                <div className="modal-overlay open" onClick={(e) => { if (e.target.className.includes('modal-overlay')) setModalOpen(false); }}>
                    <div className="modal">
                        <div className="modal-header">
                            <h2 className="modal-title">Create New Project</h2>
                            <button className="modal-close" onClick={() => setModalOpen(false)}><i className="ri-close-line"></i></button>
                        </div>
                        <div className="modal-body">
                            <form id="projectForm" onSubmit={handleSaveProject}>
                                <div className="form-grid">
                                    <div className="form-group col-span-2">
                                        <label className="form-label">Project Title</label>
                                        <input type="text" className="form-input" placeholder="e.g. Palm Jumeirah Villas" required />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Location</label>
                                        <select className="form-select" required>
                                            <option value="">Select Location</option>
                                            <option>Los Angeles, CA</option>
                                            <option>New York, NY</option>
                                            {locations.map(loc => <option key={loc} value={loc}>{loc}</option>)}
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Property Type</label>
                                        <select className="form-select" required>
                                            <option value="">Select Type</option>
                                            <option value="villa">Villa</option>
                                            <option value="apartment">Apartment</option>
                                        </select>
                                    </div>
                                </div>
                            </form>
                        </div>
                        <div className="modal-footer">
                            <button className="btn btn-outline" onClick={() => setModalOpen(false)}>Cancel</button>
                            <button className="btn btn-primary" onClick={handleSaveProject}>Create Project</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProjectsAdmin;
