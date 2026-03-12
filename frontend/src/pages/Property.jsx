import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../property.css';
import '../style.css';

const Property = () => {
    return (
        <>
            <Header />

            <div className="container">
                {/* Gallery */}
                <div className="gallery-grid">
                    <div className="gallery-main">
                        <img src="/images/property_listing_villa_1773059556545.png" alt="Exterior" className="gallery-img" />
                    </div>
                    <div className="gallery-side">
                        <img src="/images/property_interior_living_1773059573182.png" alt="Interior" className="gallery-img" />
                    </div>
                    <div className="gallery-side">
                        <img src="https://images.unsplash.com/photo-1584622650111-993a426fbf0a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                            alt="Kitchen" className="gallery-img" />
                    </div>
                </div>

                {/* Content */}
                <div className="property-layout">
                    {/* Main Details */}
                    <main>
                        <div className="detail-section">
                            <div className="flex items-center justify-between mb-2">
                                <span className="badge badge-blue">For Sale</span>
                                <span className="text-h3 text-main">$4,500,000</span>
                            </div>
                            <h1 className="text-h2 text-main mb-2">Beverly Hills Estate</h1>
                            <p className="text-body-large"><i className="ri-map-pin-line text-accent"></i> 1002 Sunset Blvd, Los
                                Angeles, CA 90210</p>
                        </div>

                        <div className="detail-section">
                            <h2 className="text-h3 text-main mb-6">Property Specifications</h2>
                            <div className="spec-grid">
                                <div className="spec-item">
                                    <i className="ri-layout-masonry-line spec-icon"></i>
                                    <div>
                                        <div className="text-small">Bedrooms</div>
                                        <div className="text-h4 text-main">5</div>
                                    </div>
                                </div>
                                <div className="spec-item">
                                    <i className="ri-drop-line spec-icon"></i>
                                    <div>
                                        <div className="text-small">Bathrooms</div>
                                        <div className="text-h4 text-main">6</div>
                                    </div>
                                </div>
                                <div className="spec-item">
                                    <i className="ri-ruler-line spec-icon"></i>
                                    <div>
                                        <div className="text-small">Area</div>
                                        <div className="text-h4 text-main">6,200 sqft</div>
                                    </div>
                                </div>
                                <div className="spec-item">
                                    <i className="ri-car-line spec-icon"></i>
                                    <div>
                                        <div className="text-small">Garage</div>
                                        <div className="text-h4 text-main">3 Cars</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="detail-section">
                            <h2 className="text-h3 text-main mb-4">Description</h2>
                            <p className="text-body mb-4">
                                An architectural masterpiece situated in the prestigious Beverly Hills area. This modern estate
                                offers unparalleled luxury and privacy, featuring panoramic views of the city skyline and the
                                ocean beyond.
                            </p>
                            <p className="text-body">
                                The property boasts a seamless indoor-outdoor flow, perfect for entertaining. The gourmet
                                kitchen is equipped with top-of-the-line appliances, and the master suite is a private sanctuary
                                with a spa-like bathroom and an expansive walk-in closet. The outdoor area includes a zero-edge
                                infinity pool, a built-in BBQ, and lush landscaping.
                            </p>
                        </div>

                        <div className="detail-section">
                            <h2 className="text-h3 text-main mb-4">Available Plots / Units</h2>
                            <p className="text-body">This development features several phases. See availability below.</p>
                            <div style={{ overflowX: 'auto' }}>
                                <table className="plots-table">
                                    <thead>
                                        <tr>
                                            <th>Unit Ref</th>
                                            <th>Type</th>
                                            <th>Size (sqft)</th>
                                            <th>Price</th>
                                            <th>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>Villa 1A</td>
                                            <td>5 Bed / 6 Bath</td>
                                            <td>6,200</td>
                                            <td>$4,500,000</td>
                                            <td><span className="badge" style={{ background: 'var(--color-primary)', color: 'white' }}>Available</span></td>
                                        </tr>
                                        <tr>
                                            <td>Villa 1B</td>
                                            <td>4 Bed / 5 Bath</td>
                                            <td>5,500</td>
                                            <td>$3,950,000</td>
                                            <td><span className="badge badge-gray">Reserved</span></td>
                                        </tr>
                                        <tr>
                                            <td>Villa 2A</td>
                                            <td>6 Bed / 7 Bath</td>
                                            <td>7,100</td>
                                            <td>$5,200,000</td>
                                            <td><span className="badge" style={{ background: 'var(--color-primary)', color: 'white' }}>Available</span></td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <div className="detail-section">
                            <div style={{ width: '100%', height: '400px', background: '#e2e8f0', borderRadius: 'var(--border-radius-lg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <div className="text-center" style={{ color: 'var(--color-text-muted)' }}>
                                    <i className="ri-map-pin-2-fill" style={{ fontSize: '3rem', color: 'var(--color-accent)' }}></i><br/>
                                    Interactive Map Loading...
                                </div>
                            </div>
                        </div>
                    </main>

                    {/* Sidebar */}
                    <aside>
                        <div className="contact-sidebar">
                            <div className="card advisor-card">
                                <img src="/images/advisor_profile_1773059592043.png" alt="Advisor" className="advisor-img" />
                                <h3 className="text-h4 text-main">Michael Sterling</h3>
                                <p className="text-small mb-6">Senior Wealth & Property Advisor</p>

                                <button className="btn btn-primary" style={{ width: '100%' }}><i className="ri-mail-send-line" style={{ marginRight: '0.5rem' }}></i> Request Details</button>

                                <button className="btn-whatsapp" style={{ padding: '0.75rem 1.5rem', borderRadius: '0.5rem', fontWeight: 600, border: 'none', cursor: 'pointer' }}>
                                    <i className="ri-whatsapp-line" style={{ fontSize: '1.25rem' }}></i> Contact on WhatsApp
                                </button>

                                <div className="mt-6 pt-6 border-t" style={{ borderTop: '1px solid var(--border-color)' }}>
                                    <div className="flex items-center justify-center gap-2 text-small">
                                        <i className="ri-phone-line text-accent"></i> +1 (555) 019-8273
                                    </div>
                                </div>
                            </div>

                            <a href="#" className="brochure-card">
                                <div style={{ width: '48px', height: '48px', background: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--shadow-sm)' }}>
                                    <i className="ri-file-download-line" style={{ color: 'var(--color-accent)', fontSize: '1.25rem' }}></i>
                                </div>
                                <div>
                                    <div className="text-h4 text-main" style={{ fontSize: '1rem' }}>Download Brochure</div>
                                    <div className="text-small">PDF, 4.2 MB</div>
                                </div>
                            </a>
                        </div>
                    </aside>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default Property;
