import React, { useState } from 'react';
import AdminSidebar from '../components/AdminSidebar';
import AdminHeader from '../components/AdminHeader';
import '../inventory.css';
import '../dashboard.css';

const Inventory = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [viewMode, setViewMode] = useState('list'); // 'list' or 'grid'
    const [modalOpen, setModalOpen] = useState(false);

    const renderGrid = () => {
        let plots = [];
        for (let i = 1; i <= 120; i++) {
            const rand = Math.random();
            let statusClass = '';
            if (rand < 0.6) statusClass = 'plot-available';
            else if (rand < 0.8) statusClass = 'plot-booked';
            else statusClass = 'plot-sold';
            plots.push(
                <div key={i} className={`plot-item ${statusClass}`} onClick={() => setModalOpen(true)}>
                    {i}
                </div>
            );
        }
        return plots;
    };

    return (
        <div style={{ backgroundColor: 'var(--dash-bg)', minHeight: '100vh', display: 'flex', fontFamily: "'Inter', sans-serif", color: 'var(--dash-text-main)' }}>
            <AdminSidebar open={sidebarOpen} />

            <main className="main-content">
                <AdminHeader onMenuClick={() => setSidebarOpen(!sidebarOpen)} />

                <div className="dashboard-content">

                    <div className="page-header" style={{ flexWrap: 'wrap', gap: '16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                            <h1 className="text-xl">Inventory:</h1>
                            <select className="filter-select" style={{ fontSize: '16px', fontWeight: 600, padding: '10px 40px 10px 16px', backgroundColor: 'var(--dash-surface)' }}>
                                <option>Beverly Hills Estate</option>
                                <option>Coastal Retreat Phase 2</option>
                                <option>Skyline Penthouse</option>
                            </select>
                        </div>

                        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                            <div className="view-tabs">
                                <button className={`view-tab ${viewMode === 'list' ? 'active' : ''}`} onClick={() => setViewMode('list')}><i className="ri-list-check"></i> List View</button>
                                <button className={`view-tab ${viewMode === 'grid' ? 'active' : ''}`} onClick={() => setViewMode('grid')}><i className="ri-layout-grid-line"></i> Layout Visual</button>
                            </div>
                            <button className="btn btn-primary" onClick={() => alert('Opening Bulk Create Wizard (Prototype)')}><i className="ri-add-line"></i> Bulk Create</button>
                        </div>
                    </div>

                    {/* LIST VIEW */}
                    {viewMode === 'list' && (
                        <div id="listView">
                            <div className="table-card">
                                <div className="table-header">
                                    <div className="search-box">
                                        <i className="ri-search-line"></i>
                                        <input type="text" placeholder="Search plot number or buyer..." style={{ border: 'none', background: 'transparent', outline: 'none' }} />
                                    </div>

                                    <div style={{ display: 'flex', gap: '12px' }}>
                                        <select className="filter-select">
                                            <option>All Statuses</option>
                                            <option>Available</option>
                                            <option>Reserved</option>
                                            <option>Sold</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="table-responsive">
                                    <table className="admin-table">
                                        <thead>
                                            <tr>
                                                <th>Plot No.</th>
                                                <th>Size</th>
                                                <th>Area (sqft)</th>
                                                <th>Price</th>
                                                <th>Status</th>
                                                <th>Buyer Name</th>
                                                <th style={{ textAlign: 'right' }}>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {/* Dummy Rows */}
                                            <tr>
                                                <td className="font-medium text-main">#101</td>
                                                <td>100x150</td>
                                                <td>15,000</td>
                                                <td>$1,200,000</td>
                                                <td>
                                                    <span className="status status-available">
                                                        <select className="status-dropdown status-available" style={{ color: 'inherit' }} defaultValue="Available">
                                                            <option>Available</option>
                                                            <option>Booked</option>
                                                            <option>Sold</option>
                                                        </select>
                                                    </span>
                                                </td>
                                                <td className="text-muted">-</td>
                                                <td style={{ textAlign: 'right' }}>
                                                    <button className="icon-btn edit-plot-btn" onClick={() => setModalOpen(true)}><i className="ri-pencil-line"></i></button>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className="font-medium text-main">#102</td>
                                                <td>100x150</td>
                                                <td>15,000</td>
                                                <td>$1,200,000</td>
                                                <td>
                                                    <span className="status status-booked">
                                                        <select className="status-dropdown" style={{ color: 'inherit' }} defaultValue="Booked">
                                                            <option>Available</option>
                                                            <option>Booked</option>
                                                            <option>Sold</option>
                                                        </select>
                                                    </span>
                                                </td>
                                                <td>Sarah Jenkins</td>
                                                <td style={{ textAlign: 'right' }}>
                                                    <button className="icon-btn edit-plot-btn" onClick={() => setModalOpen(true)}><i className="ri-pencil-line"></i></button>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className="font-medium text-main">#103</td>
                                                <td>120x150</td>
                                                <td>18,000</td>
                                                <td>$1,450,000</td>
                                                <td>
                                                    <span className="status status-sold">
                                                        <select className="status-dropdown" style={{ color: 'inherit' }} defaultValue="Sold" disabled>
                                                            <option>Available</option>
                                                            <option>Booked</option>
                                                            <option>Sold</option>
                                                        </select>
                                                    </span>
                                                </td>
                                                <td>Michael Sterling</td>
                                                <td style={{ textAlign: 'right' }}>
                                                    <button className="icon-btn edit-plot-btn" onClick={() => setModalOpen(true)}><i className="ri-pencil-line"></i></button>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* GRID VISUALIZATION VIEW */}
                    {viewMode === 'grid' && (
                        <div id="gridView">
                            <div className="legend">
                                <div className="legend-item">
                                    <div className="legend-color plot-available"></div> Available
                                </div>
                                <div className="legend-item">
                                    <div className="legend-color plot-booked"></div> Booked
                                </div>
                                <div className="legend-item">
                                    <div className="legend-color plot-sold"></div> Sold Out
                                </div>
                            </div>

                            <div className="plot-grid-container" id="visualGrid">
                                {renderGrid()}
                            </div>
                        </div>
                    )}

                </div>
            </main>

            {/* Plot Detail Modal */}
            {modalOpen && (
                <div className="modal-overlay open" onClick={(e) => { if (e.target.className.includes('modal-overlay')) setModalOpen(false); }}>
                    <div className="modal">
                        <div className="modal-header">
                            <h2 className="modal-title">Plot Details - #102</h2>
                            <button className="modal-close" onClick={() => setModalOpen(false)}><i className="ri-close-line"></i></button>
                        </div>
                        <div className="modal-body">
                            <div className="form-grid">

                                <div className="form-group">
                                    <label className="form-label">Dimensions</label>
                                    <div className="form-value">100 x 150 (ft)</div>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Total Area</label>
                                    <div className="form-value">15,000 sqft</div>
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Listed Price</label>
                                    <div className="form-value" style={{ fontSize: '18px', color: 'var(--dash-primary)' }}>$1,200,000</div>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Status</label>
                                    <select className="form-select" style={{ background: '#fefce8', borderColor: '#eab308', color: '#854d0e', fontWeight: 500 }} defaultValue="booked">
                                        <option value="available">Available</option>
                                        <option value="booked">Booked (Hold)</option>
                                        <option value="sold">Sold</option>
                                    </select>
                                </div>

                                <div className="form-group col-span-2">
                                    <label className="form-label" style={{ borderBottom: '1px solid var(--dash-border)', paddingBottom: '8px', marginTop: '8px' }}>Owner / Buyer Details</label>
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Name</label>
                                    <input type="text" className="form-input" defaultValue="Sarah Jenkins" />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Contact</label>
                                    <input type="text" className="form-input" defaultValue="+1 (555) 983-2012" />
                                </div>

                                <div className="form-group col-span-2">
                                    <label className="form-label" style={{ borderBottom: '1px solid var(--dash-border)', paddingBottom: '8px', marginTop: '8px' }}>Documents</label>

                                    <div className="doc-item">
                                        <div className="doc-info">
                                            <i className="ri-file-pdf-line" style={{ color: '#ef4444', fontSize: '20px' }}></i>
                                            Booking_Agreement_102.pdf
                                        </div>
                                        <button className="icon-btn"><i className="ri-download-2-line"></i></button>
                                    </div>

                                    <button className="btn btn-outline" style={{ width: '100%', justifyContent: 'center', borderStyle: 'dashed', marginTop: '8px' }}>
                                        <i className="ri-upload-cloud-2-line"></i> Upload Document
                                    </button>
                                </div>

                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="btn btn-outline" onClick={() => setModalOpen(false)}>Cancel</button>
                            <button className="btn btn-primary" onClick={() => { alert('Plot details updated successfully!'); setModalOpen(false); }}>Save Changes</button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

export default Inventory;
