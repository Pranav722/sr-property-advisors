import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../projects.css';
import '../style.css';

const Projects = () => {
    return (
        <>
            <Header />

            {/* Page Header */}
            <header className="page-header">
                <div className="container">
                    <h1 className="text-h2 text-main mb-4">Exclusive Properties</h1>
                    <p className="text-body-large">Curated selection of premium real estate investments worldwide.</p>
                </div>
            </header>

            {/* Main Content */}
            <div className="container">
                <div className="layout-sidebar">
                    {/* Sidebar Filters */}
                    <aside className="filter-sidebar">
                        <div className="flex items-center justify-between mb-6 border-b pb-4">
                            <h3 className="text-h4 text-main">Filters</h3>
                            <button className="text-small" style={{ color: 'var(--color-accent)', fontWeight: 500 }}>Reset All</button>
                        </div>

                        <div className="filter-group">
                            <label className="filter-label">Search</label>
                            <div style={{ position: 'relative' }}>
                                <i className="ri-search-line" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }}></i>
                                <input type="text" placeholder="Location or ID" className="input-base" style={{ paddingLeft: '2.5rem' }} />
                            </div>
                        </div>

                        <div className="filter-group">
                            <label className="filter-label">Status</label>
                            <label className="checkbox-item"><input type="checkbox" defaultChecked /> For Sale</label>
                            <label className="checkbox-item"><input type="checkbox" /> New Development</label>
                            <label className="checkbox-item"><input type="checkbox" /> Off-Market</label>
                        </div>

                        <div className="filter-group">
                            <label className="filter-label">Property Type</label>
                            <label className="checkbox-item"><input type="checkbox" defaultChecked /> Villa</label>
                            <label className="checkbox-item"><input type="checkbox" defaultChecked /> Penthouse</label>
                            <label className="checkbox-item"><input type="checkbox" /> Apartment</label>
                            <label className="checkbox-item"><input type="checkbox" /> Estate</label>
                        </div>

                        <div className="filter-group">
                            <label className="filter-label">Price Range</label>
                            <div className="price-range">
                                <input type="text" defaultValue="$1M" className="price-input" />
                                <span style={{ color: 'var(--color-text-muted)' }}>-</span>
                                <input type="text" defaultValue="$50M+" className="price-input" />
                            </div>
                        </div>

                        <button className="btn btn-primary" style={{ width: '100%' }}>Apply Filters</button>
                    </aside>

                    {/* Property Grid */}
                    <main>
                        <div className="map-toggle">
                            <div className="text-body">Showing <strong>24</strong> premium properties</div>
                            <div className="flex gap-2">
                                <button className="btn btn-primary" style={{ padding: '0.5rem 1rem' }}><i className="ri-grid-fill"></i> Grid</button>
                                <button className="btn btn-outline" style={{ padding: '0.5rem 1rem' }}><i className="ri-map-2-line"></i> Map</button>
                            </div>
                        </div>

                        <div className="grid-cols-2">
                            {/* Card 1 */}
                            <Link to="/property/1" className="card">
                                <div className="property-image-container">
                                    <span className="property-badge">For Sale</span>
                                    <div className="property-price">$4,500,000</div>
                                    <img src="/images/property_listing_villa_1773059556545.png" alt="Villa" className="property-image" />
                                </div>
                                <div className="property-content">
                                    <h3 className="text-h4 text-main" style={{ marginBottom: '0.25rem' }}>Beverly Hills Estate</h3>
                                    <p className="text-small"><i className="ri-map-pin-line"></i> 1002 Sunset Blvd, Los Angeles</p>
                                    <div className="property-meta">
                                        <div className="meta-item"><i className="ri-layout-masonry-line"></i> 5 Beds</div>
                                        <div className="meta-item"><i className="ri-drop-line"></i> 6 Baths</div>
                                        <div className="meta-item"><i className="ri-ruler-line"></i> 6,200 sqft</div>
                                    </div>
                                </div>
                            </Link>

                            {/* Card 2 */}
                            <Link to="/property/2" className="card">
                                <div className="property-image-container">
                                    <span className="property-badge" style={{ background: 'var(--color-accent)' }}>New Development</span>
                                    <div className="property-price">$2,100,000</div>
                                    <img src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=800" alt="Apartment" className="property-image" />
                                </div>
                                <div className="property-content">
                                    <h3 className="text-h4 text-main" style={{ marginBottom: '0.25rem' }}>Skyline Penthouse</h3>
                                    <p className="text-small"><i className="ri-map-pin-line"></i> 450 Manhattan Ave, New York</p>
                                    <div className="property-meta">
                                        <div className="meta-item"><i className="ri-layout-masonry-line"></i> 3 Beds</div>
                                        <div className="meta-item"><i className="ri-drop-line"></i> 3.5 Baths</div>
                                        <div className="meta-item"><i className="ri-ruler-line"></i> 3,100 sqft</div>
                                    </div>
                                </div>
                            </Link>

                            {/* Card 3 */}
                            <Link to="/property/3" className="card">
                                <div className="property-image-container">
                                    <span className="property-badge">For Sale</span>
                                    <div className="property-price">$8,950,000</div>
                                    <img src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=800" alt="Mansion" className="property-image" />
                                </div>
                                <div className="property-content">
                                    <h3 className="text-h4 text-main" style={{ marginBottom: '0.25rem' }}>Coastal Modern Villa</h3>
                                    <p className="text-small"><i className="ri-map-pin-line"></i> 78 Ocean Drive, Miami</p>
                                    <div className="property-meta">
                                        <div className="meta-item"><i className="ri-layout-masonry-line"></i> 6 Beds</div>
                                        <div className="meta-item"><i className="ri-drop-line"></i> 8 Baths</div>
                                        <div className="meta-item"><i className="ri-ruler-line"></i> 10,500 sqft</div>
                                    </div>
                                </div>
                            </Link>

                            {/* Card 4 */}
                            <Link to="/property/4" className="card">
                                <div className="property-image-container">
                                    <span className="property-badge">Off-Market</span>
                                    <div className="property-price">$12,000,000</div>
                                    <img src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Mansion" className="property-image" />
                                </div>
                                <div className="property-content">
                                    <h3 className="text-h4 text-main" style={{ marginBottom: '0.25rem' }}>Highland Park Mansion</h3>
                                    <p className="text-small"><i className="ri-map-pin-line"></i> 45 Preston Road, Dallas</p>
                                    <div className="property-meta">
                                        <div className="meta-item"><i className="ri-layout-masonry-line"></i> 7 Beds</div>
                                        <div className="meta-item"><i className="ri-drop-line"></i> 9 Baths</div>
                                        <div className="meta-item"><i className="ri-ruler-line"></i> 14,000 sqft</div>
                                    </div>
                                </div>
                            </Link>
                        </div>

                        {/* Pagination */}
                        <div className="pagination">
                            <button className="page-btn"><i className="ri-arrow-left-s-line"></i></button>
                            <button className="page-btn active">1</button>
                            <button className="page-btn">2</button>
                            <button className="page-btn">3</button>
                            <span style={{ display: 'flex', alignItems: 'flex-end' }}>...</span>
                            <button className="page-btn">8</button>
                            <button className="page-btn"><i className="ri-arrow-right-s-line"></i></button>
                        </div>
                    </main>
                </div>
            </div>
            
            <Footer />
        </>
    );
};

export default Projects;
