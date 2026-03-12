import React, { useState } from 'react';
import AdminSidebar from '../components/AdminSidebar';
import AdminHeader from '../components/AdminHeader';
import '../dashboard.css';

const Dashboard = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div style={{ backgroundColor: 'var(--dash-bg)', minHeight: '100vh', display: 'flex', fontFamily: "'Inter', sans-serif", color: 'var(--dash-text-main)' }}>
            <AdminSidebar open={sidebarOpen} />

            <main className="main-content">
                <AdminHeader onMenuClick={() => setSidebarOpen(!sidebarOpen)} />

                {/* Dashboard Content Area */}
                <div className="dashboard-content">

                    <div className="page-header">
                        <div>
                            <h1 className="text-xl">Overview</h1>
                            <p className="text-sm mt-1">Here's what's happening with your properties today.</p>
                        </div>
                        <div style={{ display: 'flex', gap: '12px' }}>
                            <button className="btn btn-outline"><i className="ri-download-line"></i> Export</button>
                            <button className="btn btn-primary"><i className="ri-add-line"></i> Add Project</button>
                        </div>
                    </div>

                    {/* Widgets */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6 mb-8">
                        <div className="metric-card">
                            <div className="metric-header">
                                <span className="metric-title">Total Projects</span>
                                <div className="metric-icon blue"><i className="ri-building-2-line"></i></div>
                            </div>
                            <div className="metric-value">24</div>
                            <div className="metric-trend trend-up">
                                <i className="ri-arrow-right-up-line"></i> 12% from last month
                            </div>
                        </div>

                        <div className="metric-card">
                            <div className="metric-header">
                                <span className="metric-title">Total Plots</span>
                                <div className="metric-icon purple"><i className="ri-map-pin-range-line"></i></div>
                            </div>
                            <div className="metric-value">1,492</div>
                            <div className="metric-trend trend-up">
                                <i className="ri-arrow-right-up-line"></i> 4% from last month
                            </div>
                        </div>

                        <div className="metric-card">
                            <div className="metric-header">
                                <span className="metric-title">Available Plots</span>
                                <div className="metric-icon green"><i className="ri-check-double-line"></i></div>
                            </div>
                            <div className="metric-value">342</div>
                            <div className="metric-trend text-muted">
                                <span>22% of total inventory</span>
                            </div>
                        </div>

                        <div className="metric-card">
                            <div className="metric-header">
                                <span className="metric-title">New Inquiries</span>
                                <div className="metric-icon orange"><i className="ri-mail-star-line"></i></div>
                            </div>
                            <div className="metric-value">89</div>
                            <div className="metric-trend trend-down">
                                <i className="ri-arrow-right-down-line"></i> 2% from last week
                            </div>
                        </div>
                    </div>

                    {/* Charts */}
                    <div className="charts-grid">
                        <div className="chart-card">
                            <div className="chart-header">
                                <h3 className="text-base">Plot Sales (Last 6 Months)</h3>
                                <select className="filter-select" style={{ backgroundColor: 'transparent', border: 'none' }}>
                                    <option>Monthly</option>
                                    <option>Weekly</option>
                                </select>
                            </div>
                            {/* Mock Bar Chart */}
                            <div className="mock-bar-chart">
                                <div className="bar" style={{ height: '40%' }} title="Jan: 40"></div>
                                <div className="bar" style={{ height: '60%' }} title="Feb: 60"></div>
                                <div className="bar" style={{ height: '30%' }} title="Mar: 30"></div>
                                <div className="bar" style={{ height: '80%' }} title="Apr: 80"></div>
                                <div className="bar" style={{ height: '50%' }} title="May: 50"></div>
                                <div className="bar" style={{ height: '90%' }} title="Jun: 90"></div>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '12px', color: 'var(--dash-text-muted)', fontSize: '12px', fontWeight: 500 }}>
                                <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span>
                            </div>
                        </div>

                        <div className="chart-card">
                            <div className="chart-header">
                                <h3 className="text-base">Inquiries Trend</h3>
                            </div>
                            {/* Mock Line Chart area */}
                            <div className="mock-line-chart"></div>
                            <div style={{ marginTop: '16px' }}>
                                <div className="text-sm font-semibold">Overall Traffic</div>
                                <div className="text-xs text-muted mt-1">+14.5% compared to prior month. Increase driven by new Beverly Hills listing.</div>
                            </div>
                        </div>
                    </div>

                    {/* Data Table */}
                    <div className="table-card">
                        <div className="table-header">
                            <h3 className="text-base">Recent Inventory Updates</h3>
                            <div className="table-filters">
                                <select className="filter-select">
                                    <option>All Projects</option>
                                    <option>Beverly Hills Estate</option>
                                    <option>Skyline Penthouse</option>
                                </select>
                                <select className="filter-select">
                                    <option>Status</option>
                                    <option>Available</option>
                                    <option>Sold</option>
                                    <option>Pending</option>
                                </select>
                            </div>
                        </div>

                        <div className="table-responsive overflow-x-auto">
                            <table className="admin-table">
                                <thead>
                                    <tr>
                                        <th className="sortable">Plot / Unit <i className="ri-expand-up-down-line"></i></th>
                                        <th className="sortable">Project <i className="ri-expand-up-down-line"></i></th>
                                        <th className="sortable">Price <i className="ri-expand-up-down-line"></i></th>
                                        <th>Status</th>
                                        <th>Assigned Agent</th>
                                        <th style={{ textAlign: 'right' }}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>
                                            <div className="font-medium text-main">Villa 1A</div>
                                            <div className="text-xs text-muted mt-1">6,200 sqft • 5 beds</div>
                                        </td>
                                        <td>Beverly Hills Estate</td>
                                        <td className="font-medium">$4,500,000</td>
                                        <td><span className="status status-active">Available</span></td>
                                        <td>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><img src="https://ui-avatars.com/api/?name=Michael+S&background=random&size=24" style={{ borderRadius: '50%' }} /> Michael S.</div>
                                        </td>
                                        <td style={{ textAlign: 'right' }}>
                                            <button className="icon-btn"><i className="ri-edit-line"></i></button>
                                            <button className="icon-btn" style={{ marginLeft: '8px' }}><i className="ri-more-2-fill"></i></button>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <div className="font-medium text-main">Unit 402</div>
                                            <div className="text-xs text-muted mt-1">3,100 sqft • 3 beds</div>
                                        </td>
                                        <td>Skyline Penthouse</td>
                                        <td className="font-medium">$2,100,000</td>
                                        <td><span className="status status-pending">Pending</span></td>
                                        <td>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><img src="https://ui-avatars.com/api/?name=Sarah+J&background=random&size=24" style={{ borderRadius: '50%' }} /> Sarah J.</div>
                                        </td>
                                        <td style={{ textAlign: 'right' }}>
                                            <button className="icon-btn"><i className="ri-edit-line"></i></button>
                                            <button className="icon-btn" style={{ marginLeft: '8px' }}><i className="ri-more-2-fill"></i></button>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <div className="font-medium text-main">Villa 1B</div>
                                            <div className="text-xs text-muted mt-1">5,500 sqft • 4 beds</div>
                                        </td>
                                        <td>Beverly Hills Estate</td>
                                        <td className="font-medium">$3,950,000</td>
                                        <td><span className="status status-sold">Sold</span></td>
                                        <td>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><img src="https://ui-avatars.com/api/?name=Michael+S&background=random&size=24" style={{ borderRadius: '50%' }} /> Michael S.</div>
                                        </td>
                                        <td style={{ textAlign: 'right' }}>
                                            <button className="icon-btn"><i className="ri-edit-line"></i></button>
                                            <button className="icon-btn" style={{ marginLeft: '8px' }}><i className="ri-more-2-fill"></i></button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        <div className="pagination">
                            <div className="pagination-info">Showing 1 to 3 of 342 entries</div>
                            <div className="pagination-controls">
                                <button className="page-btn" disabled><i className="ri-arrow-left-s-line"></i></button>
                                <button className="page-btn active">1</button>
                                <button className="page-btn">2</button>
                                <button className="page-btn">3</button>
                                <span style={{ padding: '0 4px', display: 'flex', alignItems: 'center', color: 'var(--dash-text-muted)' }}>...</span>
                                <button className="page-btn">86</button>
                                <button className="page-btn"><i className="ri-arrow-right-s-line"></i></button>
                            </div>
                        </div>
                    </div>

                </div>
            </main>
        </div>
    );
};

export default Dashboard;
