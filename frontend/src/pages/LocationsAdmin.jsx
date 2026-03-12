import React, { useState, useEffect } from 'react';
import AdminSidebar from '../components/AdminSidebar';
import AdminHeader from '../components/AdminHeader';
import '../dashboard.css';

const LocationsAdmin = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [locations, setLocations] = useState([]);

    const defaultLocs = ['Los Angeles, CA', 'New York, NY', 'Miami, FL', 'Dubai, UAE', 'London, UK'];

    useEffect(() => {
        let savedStr = localStorage.getItem('sr_locations');
        let savedLocs = savedStr ? JSON.parse(savedStr) : [];
        let allLocs = [...new Set([...defaultLocs, ...savedLocs])];
        setLocations(allLocs);
    }, []);

    const addCustomLocation = () => {
        const loc = prompt("Enter new Location Name (e.g., Tokyo, JP):");
        if (loc && loc.trim() !== "") {
            const cleanedLoc = loc.trim();
            const newLocs = [...locations];
            if (!newLocs.includes(cleanedLoc)) {
                newLocs.push(cleanedLoc);
                
                // Save to localStorage specifically for custom ones to keep logic similar to prototype
                let savedStr = localStorage.getItem('sr_locations');
                let savedLocs = savedStr ? JSON.parse(savedStr) : [];
                if (!savedLocs.includes(cleanedLoc)) {
                    savedLocs.push(cleanedLoc);
                    localStorage.setItem('sr_locations', JSON.stringify(savedLocs));
                }

                setLocations(newLocs);
                alert(`Location "${cleanedLoc}" added successfully!`);
            } else {
                alert('Location already exists.');
            }
        }
    };

    return (
        <div style={{ backgroundColor: 'var(--dash-bg)', minHeight: '100vh', display: 'flex', fontFamily: "'Inter', sans-serif", color: 'var(--dash-text-main)' }}>
            <AdminSidebar open={sidebarOpen} />

            <main className="main-content">
                <AdminHeader onMenuClick={() => setSidebarOpen(!sidebarOpen)} />

                <div className="dashboard-content">
                    <div className="page-header">
                        <div>
                            <h1 className="text-xl">Locations</h1>
                            <p className="text-sm mt-1">Manage global property locations and market regions.</p>
                        </div>
                        <div style={{ display: 'flex', gap: '12px' }}>
                            <button className="btn btn-primary" onClick={addCustomLocation}><i className="ri-add-line"></i> New Location</button>
                        </div>
                    </div>

                    {/* Locations Grid */}
                    <div id="locationsGrid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px', marginTop: '24px' }}>
                        {locations.map((loc) => (
                            <div key={loc} style={{ background: 'white', border: '1px solid var(--dash-border)', borderRadius: 'var(--dash-radius)', padding: '20px', display: 'flex', alignItems: 'center', gap: '16px', boxShadow: 'var(--dash-shadow-sm)' }}>
                                <div style={{ background: 'rgba(37, 99, 235, 0.1)', color: 'var(--app-primary)', width: '48px', height: '48px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', flexShrink: 0 }}>
                                    <i className="ri-map-pin-2-fill"></i>
                                </div>
                                <div style={{ flex: 1 }}>
                                    <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--dash-text-main)', marginBottom: '2px' }}>{loc}</h3>
                                    <p style={{ fontSize: '13px', color: 'var(--dash-text-muted)' }}>Active Market</p>
                                </div>
                                <div>
                                    <button className="icon-btn small"><i className="ri-more-2-fill"></i></button>
                                </div>
                            </div>
                        ))}
                    </div>

                </div>
            </main>
        </div>
    );
};

export default LocationsAdmin;
