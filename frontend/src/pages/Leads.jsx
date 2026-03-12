import React, { useState, useEffect } from 'react';
import AdminSidebar from '../components/AdminSidebar';
import AdminHeader from '../components/AdminHeader';
import '../crm.css';
import '../dashboard.css'; // Reuse dashboard styles where applicable

const Leads = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [selectedLead, setSelectedLead] = useState(null);
    const [locations, setLocations] = useState([]);

    useEffect(() => {
        let locsStr = localStorage.getItem('sr_locations');
        if (locsStr) {
            setLocations(JSON.parse(locsStr));
        }

        // Handle resize for panel logic
        const handleResize = () => {
             if (window.innerWidth <= 1024) {
                 // Close panel or let CSS handle it
             }
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const leadsData = [
        {
            id: 1,
            name: 'Michael Chang',
            email: 'michael.ch@example.com',
            phone: '+1 (415) 555-0198',
            property: 'Skyline Penthouse',
            message: "Hi, I'm interested in viewing the floor plans for the penthouse. Are there any units available on the 54th floor facing the ocean?",
            date: '2 hours ago',
            status: 'New Lead',
            assignee: null
        },
        {
            id: 2,
            name: 'Eleanor Vance',
            email: 'eleanor.v@company.com',
            phone: '+1 (555) 302-1244',
            property: 'Beverly Hills Estate (Plot #102)',
            message: "Looking to purchase a plot for custom construction. Would like to discuss financing...",
            date: 'Yesterday, 4:30 PM',
            status: 'Contacted',
            assignee: { name: 'Alex C.', avatar: 'https://ui-avatars.com/api/?name=Alex+C&background=0D8ABC&color=fff' }
        },
        {
            id: 3,
            name: 'Robert King',
            email: 'r.king@gmail.com',
            phone: '+1 (310) 555-0982',
            property: 'Coastal Retreat (General)',
            message: "Do you provide advisory services for foreign investors?",
            date: 'Oct 12, 2025',
            status: 'Closed - Won',
            assignee: { name: 'Sarah J.', avatar: 'https://ui-avatars.com/api/?name=Sarah+J&background=ef4444&color=fff' }
        }
    ];

    const openPanel = (lead) => {
        setSelectedLead(lead);
    };

    const closePanel = () => {
        setSelectedLead(null);
    };

    const handleStatusChange = (e, leadId) => {
        e.stopPropagation();
        alert(`Status updated for lead ${leadId} to ${e.target.value}`);
    };

    const getStatusClass = (status) => {
        if (status.includes('New')) return 'new';
        if (status.includes('Contacted')) return 'contacted';
        return 'closed';
    };

    return (
        <div style={{ backgroundColor: 'var(--dash-bg)', minHeight: '100vh', display: 'flex', fontFamily: "'Inter', sans-serif", color: 'var(--dash-text-main)' }}>
            <AdminSidebar open={sidebarOpen} />

            <main className={`main-content ${selectedLead && window.innerWidth > 1024 ? 'panel-open' : ''}`}>
                <AdminHeader onMenuClick={() => setSidebarOpen(!sidebarOpen)} />

                <div className="app-content" style={{ padding: '30px' }}>
                    <div className="page-header" style={{ flexWrap: 'wrap', gap: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
                        <div>
                            <h1 className="text-xl font-bold" style={{ fontSize: '24px', letterSpacing: '-0.5px' }}>Website Inquiries</h1>
                            <p className="text-sm mt-1" style={{ marginTop: '4px', color: 'var(--dash-text-muted)' }}>Track and manage incoming leads from property pages.</p>
                        </div>

                        <div className="view-filters" style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
                            <div className="filter-group" style={{ display: 'flex', alignItems: 'center', background: 'white', border: '1px solid var(--dash-border)', borderRadius: 'var(--dash-radius)', padding: '6px 12px' }}>
                                <i className="ri-search-line filter-icon" style={{ color: 'var(--dash-text-muted)', marginRight: '8px' }}></i>
                                <input type="text" className="filter-input" placeholder="Search by name, email, or phone..." style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: '13px', width: '220px' }} />
                            </div>
                            <div className="filter-group" style={{ display: 'flex', gap: '12px', background: 'white', border: '1px solid var(--dash-border)', borderRadius: 'var(--dash-radius)', padding: '4px 8px' }}>
                                <select className="filter-select" style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: '13px' }}>
                                    <option>All Statuses</option>
                                    <option>New Lead</option>
                                    <option>Contacted</option>
                                    <option>Archived</option>
                                </select>
                                <div className="filter-divider" style={{ width: '1px', backgroundColor: 'var(--dash-border)', margin: '4px 0' }}></div>
                                <select className="filter-select" style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: '13px' }}>
                                    <option>All Dates</option>
                                    <option>Today</option>
                                    <option>Last 7 Days</option>
                                    <option>This Month</option>
                                </select>
                                <div className="filter-divider" style={{ width: '1px', backgroundColor: 'var(--dash-border)', margin: '4px 0' }}></div>
                                <select className="filter-select" style={{ minWidth: '160px', border: 'none', background: 'transparent', outline: 'none', fontSize: '13px' }}>
                                    <option>Assignee: Any</option>
                                    <option>Alex C.</option>
                                    <option>Sarah J.</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="data-card" style={{ background: 'white', borderRadius: 'var(--dash-radius)', border: '1px solid var(--dash-border)', boxShadow: 'var(--dash-shadow-sm)', overflow: 'hidden' }}>
                        <div className="table-wrapper" style={{ overflowX: 'auto' }}>
                            <table className="crm-table admin-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr style={{ borderBottom: '1px solid var(--dash-border)', backgroundColor: 'var(--dash-surface)' }}>
                                        <th style={{ padding: '16px', textAlign: 'left', fontSize: '12px', fontWeight: 600, color: 'var(--dash-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Lead Contact</th>
                                        <th style={{ padding: '16px', textAlign: 'left', fontSize: '12px', fontWeight: 600, color: 'var(--dash-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Interested Property</th>
                                        <th style={{ padding: '16px', textAlign: 'left', fontSize: '12px', fontWeight: 600, color: 'var(--dash-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Message Preview</th>
                                        <th style={{ padding: '16px', textAlign: 'left', fontSize: '12px', fontWeight: 600, color: 'var(--dash-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Date Received</th>
                                        <th style={{ padding: '16px', textAlign: 'left', fontSize: '12px', fontWeight: 600, color: 'var(--dash-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Status</th>
                                        <th style={{ padding: '16px', textAlign: 'left', fontSize: '12px', fontWeight: 600, color: 'var(--dash-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Assignee</th>
                                        <th style={{ textAlign: 'right', padding: '16px', fontSize: '12px', fontWeight: 600, color: 'var(--dash-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {leadsData.map(lead => (
                                        <tr key={lead.id} onClick={() => openPanel(lead)} style={{ borderBottom: '1px solid var(--dash-border)', cursor: 'pointer', backgroundColor: selectedLead?.id === lead.id ? 'var(--dash-surface)' : 'white' }} className={selectedLead?.id === lead.id ? 'selected' : ''}>
                                            <td style={{ padding: '16px' }}>
                                                <div className="lead-contact" style={{ display: 'flex', flexDirection: 'column' }}>
                                                    <span className="lead-name" style={{ fontWeight: 600, color: 'var(--dash-text-main)' }}>{lead.name}</span>
                                                    <span className="text-muted text-xs" style={{ fontSize: '12px', color: 'var(--dash-text-muted)' }}>{lead.email}</span>
                                                    <span className="text-muted text-xs" style={{ fontSize: '12px', color: 'var(--dash-text-muted)' }}>{lead.phone}</span>
                                                </div>
                                            </td>
                                            <td style={{ padding: '16px' }}>
                                                <div className="lead-property" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '13px', background: 'var(--dash-surface)', padding: '4px 10px', borderRadius: '20px', fontWeight: 500 }}>
                                                    <i className="ri-building-line" style={{ color: 'var(--dash-primary)' }}></i> {lead.property}
                                                </div>
                                            </td>
                                            <td style={{ padding: '16px' }}>
                                                <div className="lead-msg" style={{ fontSize: '13px', color: 'var(--dash-text-main)', maxWidth: '280px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                    {lead.message}
                                                </div>
                                            </td>
                                            <td style={{ padding: '16px' }}>
                                                <div className="lead-date" style={{ fontSize: '13px', color: 'var(--dash-text-muted)' }}>{lead.date}</div>
                                            </td>
                                            <td style={{ padding: '16px' }}>
                                                <span className={`status-badge ${getStatusClass(lead.status)}`} style={{ padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 600, display: 'inline-flex', alignItems: 'center' }}>
                                                    <select 
                                                        defaultValue={lead.status} 
                                                        onChange={(e) => handleStatusChange(e, lead.id)} 
                                                        onClick={(e) => e.stopPropagation()}
                                                        style={{ background: 'transparent', border: 'none', color: 'inherit', fontWeight: 'inherit', outline: 'none', cursor: 'pointer' }}
                                                    >
                                                        <option>New Lead</option>
                                                        <option>Contacted</option>
                                                        <option>Closed - Won</option>
                                                        <option>Closed - Lost</option>
                                                    </select>
                                                </span>
                                            </td>
                                            <td style={{ padding: '16px' }}>
                                                {lead.assignee ? (
                                                    <div className="lead-assignee" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                        <img src={lead.assignee.avatar} className="assignee-avatar" style={{ width: '24px', height: '24px', borderRadius: '50%' }} alt="Assignee" />
                                                        <span className="text-xs font-medium" style={{ fontSize: '12px', fontWeight: 500 }}>{lead.assignee.name}</span>
                                                    </div>
                                                ) : (
                                                    <button className="btn btn-outline" onClick={(e) => { e.stopPropagation(); alert('Assign modal'); }} style={{ fontSize: '11px', padding: '4px 10px', borderRadius: '4px', border: '1px solid var(--dash-border)', background: 'white', cursor: 'pointer' }}>Assign</button>
                                                )}
                                            </td>
                                            <td style={{ textAlign: 'right', padding: '16px' }}>
                                                <button className="icon-btn" style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--dash-text-muted)' }}><i className="ri-arrow-right-line"></i></button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </main>

            {/* Slide-Out Detail Panel */}
            <div className={`detail-panel ${selectedLead ? 'open' : ''}`} id="detailPanel" style={{ position: 'fixed', top: 0, right: selectedLead ? 0 : '-400px', width: '400px', height: '100vh', background: 'white', boxShadow: '-5px 0 25px rgba(0,0,0,0.05)', zIndex: 1000, transition: 'right 0.3s ease', display: 'flex', flexDirection: 'column' }}>
                <div className="panel-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 24px', borderBottom: '1px solid var(--dash-border)' }}>
                    <div className="panel-title" style={{ fontSize: '15px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <i className="ri-profile-line text-muted" style={{ color: 'var(--dash-text-muted)' }}></i> Lead Details
                    </div>
                    <i className="ri-close-line panel-close" onClick={closePanel} style={{ fontSize: '20px', cursor: 'pointer', color: 'var(--dash-text-muted)' }}></i>
                </div>

                {selectedLead && (
                    <div className="panel-body" style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
                            <div>
                                <h2 className="text-xl" style={{ fontSize: '20px', fontWeight: 600, letterSpacing: '-0.5px', marginBottom: '4px' }}>{selectedLead.name}</h2>
                                <div className={`status-badge ${getStatusClass(selectedLead.status)}`} style={{ padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 600, display: 'inline-block' }}>{selectedLead.status}</div>
                            </div>
                            <img src={`https://ui-avatars.com/api/?name=${selectedLead.name.replace(' ', '+')}&background=f1f5f9`} style={{ width: '48px', borderRadius: '50%' }} alt="Lead Avatar" />
                        </div>

                        <div className="contact-card" style={{ background: 'var(--dash-surface)', borderRadius: 'var(--dash-radius)', padding: '20px', marginBottom: '24px' }}>
                            <div className="contact-row" style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px', fontSize: '14px' }}>
                                <i className="ri-mail-line" style={{ color: 'var(--dash-text-muted)' }}></i>
                                <a href={`mailto:${selectedLead.email}`} className="font-medium" style={{ color: 'var(--dash-primary)', textDecoration: 'none', fontWeight: 500 }}>{selectedLead.email}</a>
                            </div>
                            <div className="contact-row" style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '14px' }}>
                                <i className="ri-phone-line" style={{ color: 'var(--dash-text-muted)' }}></i>
                                <span>{selectedLead.phone}</span>
                            </div>
                            <div className="contact-row" style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginTop: '16px', paddingTop: '16px', borderTop: '1px dashed var(--dash-border)', fontSize: '14px' }}>
                                <i className="ri-building-line" style={{ color: 'var(--dash-text-muted)' }}></i>
                                <div>
                                    <div className="text-xs text-muted font-medium" style={{ fontSize: '12px', color: 'var(--dash-text-muted)', fontWeight: 500 }}>Interested In</div>
                                    <div className="font-medium" style={{ fontWeight: 500 }}>{selectedLead.property}</div>
                                </div>
                            </div>
                        </div>

                        <div className="info-block" style={{ marginBottom: '24px' }}>
                            <div className="info-label" style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--dash-text-muted)', fontWeight: 600, marginBottom: '8px' }}>Inquiry Message</div>
                            <div className="info-value" style={{ background: 'var(--dash-bg)', padding: '16px', borderRadius: 'var(--dash-radius-sm)', border: '1px solid var(--dash-border)', fontStyle: 'italic', fontSize: '14px', lineHeight: 1.5, color: 'var(--dash-text-main)' }}>
                                "{selectedLead.message}"
                            </div>
                        </div>

                        <div className="add-note-box">
                            <div className="info-label" style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--dash-text-muted)', fontWeight: 600, marginBottom: '16px' }}>Conversation & Notes</div>

                            <div className="notes-timeline" style={{ borderLeft: '2px solid var(--dash-border)', paddingLeft: '16px', marginBottom: '20px' }}>
                                <div className="note-item primary" style={{ position: 'relative' }}>
                                    <div style={{ position: 'absolute', left: '-22px', top: '0', width: '10px', height: '10px', borderRadius: '50%', background: 'var(--dash-primary)', border: '2px solid white' }}></div>
                                    <div className="note-meta" style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--dash-text-muted)', marginBottom: '4px' }}>
                                        <span style={{ fontWeight: 500 }}>System</span> <span>{selectedLead.date}</span>
                                    </div>
                                    <div className="note-text" style={{ background: '#eff6ff', borderColor: '#bfdbfe', padding: '12px', borderRadius: 'var(--dash-radius-sm)', fontSize: '13px', border: '1px solid' }}>
                                        Lead captured via Website Project Page. {selectedLead.assignee ? `Assigned to ${selectedLead.assignee.name}.` : 'Assigned to Pool.'}
                                    </div>
                                </div>
                            </div>

                            <div style={{ marginTop: '20px' }}>
                                <textarea className="note-textarea" placeholder="Type internal notes regarding this lead..." style={{ width: '100%', minHeight: '80px', padding: '12px', borderRadius: 'var(--dash-radius)', border: '1px solid var(--dash-border)', background: 'white', resize: 'vertical', fontSize: '13px', outline: 'none', marginBottom: '12px', fontFamily: 'inherit' }}></textarea>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <select className="filter-select" style={{ background: 'var(--dash-surface)', border: '1px solid var(--dash-border)', padding: '8px 12px', borderRadius: 'var(--dash-radius)', fontSize: '13px', outline: 'none' }}>
                                        <option>Log Call</option>
                                        <option>Log Meeting</option>
                                        <option>General Note</option>
                                    </select>
                                    <button className="btn btn-primary" style={{ padding: '8px 16px', borderRadius: 'var(--dash-radius)', background: 'var(--dash-primary)', color: 'white', border: 'none', fontSize: '13px', fontWeight: 500, cursor: 'pointer' }} onClick={() => alert('Note added!')}>Add Note</button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                <div className="panel-footer" style={{ padding: '20px 24px', borderTop: '1px solid var(--dash-border)', background: 'var(--dash-surface)', display: 'flex', gap: '12px' }}>
                    <button className="btn btn-outline" style={{ flex: 1, justifyContent: 'center', padding: '10px', borderRadius: 'var(--dash-radius)', border: '1px solid var(--dash-border)', background: 'white', fontSize: '14px', fontWeight: 500, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }} onClick={() => alert('Emailing')}>
                        <i className="ri-mail-send-line"></i> Email
                    </button>
                    <button className="btn btn-whatsapp" style={{ flex: 1, justifyContent: 'center', padding: '10px', borderRadius: 'var(--dash-radius)', border: 'none', background: '#25D366', color: 'white', fontSize: '14px', fontWeight: 500, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }} onClick={() => alert('Opening WhatsApp')}>
                        <i className="ri-whatsapp-line"></i> WhatsApp
                    </button>
                </div>
            </div>

        </div>
    );
};

export default Leads;
