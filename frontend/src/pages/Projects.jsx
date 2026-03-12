import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../projects.css';
import '../style.css';

const Projects = () => {
    const [filtersOpen, setFiltersOpen] = useState(false);

    return (
        <>
            <Header />

            {/* Page Header */}
            <header className="page-header">
                <div className="container">
                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-main mb-4">Exclusive Properties</h1>
                    <p className="text-lg md:text-xl text-muted">Curated selection of premium real estate investments worldwide.</p>
                </div>
            </header>

            {/* Main Content */}
            <div className="container">
                {/* Mobile Filter Backdrop */}
                {filtersOpen && (
                    <div 
                        className="fixed inset-0 bg-black/60 z-50 lg:hidden transition-opacity"
                        onClick={() => setFiltersOpen(false)}
                    />
                )}

                <div className="layout-sidebar">
                    {/* Sidebar Filters */}
                    <aside className={`filter-sidebar ${filtersOpen ? 'open' : ''}`}>
                        <div className="flex items-center justify-between mb-6 border-b pb-4">
                            <h3 className="text-h4 text-main">Filters</h3>
                            <div className="flex items-center gap-4">
                                <button className="text-small" style={{ color: 'var(--color-accent)', fontWeight: 500 }}>Reset</button>
                                <button className="lg:hidden text-gray-500 hover:text-gray-800" onClick={() => setFiltersOpen(false)}>
                                    <i className="ri-close-line text-2xl"></i>
                                </button>
                            </div>
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
                        <div className="map-toggle flex-col md:flex-row items-start md:items-center gap-4">
                            <div className="text-body w-full md:w-auto flex justify-between items-center">
                                <span>Showing <strong>24</strong> premium properties</span>
                                <button 
                                    className="lg:hidden btn btn-outline min-h-[44px]" 
                                    onClick={() => setFiltersOpen(true)}
                                >
                                    <i className="ri-filter-3-line mr-2"></i> Filters
                                </button>
                            </div>
                            <div className="flex gap-2 w-full md:w-auto">
                                <button className="btn btn-primary flex-1 md:flex-none min-h-[44px]" style={{ padding: '0.5rem 1rem' }}><i className="ri-grid-fill"></i> Grid</button>
                                <button className="btn btn-outline flex-1 md:flex-none min-h-[44px]" style={{ padding: '0.5rem 1rem' }}><i className="ri-map-2-line"></i> Map</button>
                            </div>
                        </div>

                        <div className="flex flex-col md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
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
                        <div className="flex justify-between items-center py-4 border-t border-gray-100 mt-6">
                            <button className="btn btn-outline min-h-[44px] px-4"><i className="ri-arrow-left-s-line"></i> Prev</button>
                            <span className="text-sm font-medium text-gray-500">Page 1 of 8</span>
                            <button className="btn btn-outline min-h-[44px] px-4">Next <i className="ri-arrow-right-s-line"></i></button>
                        </div>
                    </main>
                </div>
            </div>
            
            <Footer />
        </>
    );
};

export default Projects;
