import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../projects.css';
import '../style.css';

const ALL_PROPERTIES = [
  { id: 1, img: '/images/property_listing_villa_1773059556545.png', badge: 'For Sale', price: '₹4.5 Cr', title: 'Juhu Sea-View Villa', loc: 'Juhu, Mumbai', beds: 5, baths: 4, sqft: '4,200', type: 'Villa', status: 'For Sale' },
  { id: 2, img: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=800', badge: 'New Launch', badgeColor: '#2563eb', price: '₹1.8 Cr', title: 'Skyline Residences', loc: 'Powai, Mumbai', beds: 3, baths: 2, sqft: '1,450', type: 'Apartment', status: 'New Launch' },
  { id: 3, img: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=800', badge: 'For Sale', price: '₹7.2 Cr', title: 'Golf Course Bungalow', loc: 'Koregaon Park, Pune', beds: 6, baths: 5, sqft: '6,800', type: 'Bungalow', status: 'For Sale' },
  { id: 4, img: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=800', badge: 'Off-Market', badgeColor: '#7c3aed', price: '₹12 Cr', title: 'Whitefield Luxury Estate', loc: 'Whitefield, Bengaluru', beds: 7, baths: 7, sqft: '10,000', type: 'Villa', status: 'Off-Market' },
  { id: 5, img: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&q=80&w=800', badge: 'New Launch', badgeColor: '#2563eb', price: '₹3.2 Cr', title: 'Hiranandani Penthouse', loc: 'Hiranandani Gardens, Mumbai', beds: 4, baths: 3, sqft: '3,100', type: 'Penthouse', status: 'New Launch' },
  { id: 6, img: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=800', badge: 'For Sale', price: '₹85 L', title: 'Gachibowli IT Hub Flat', loc: 'Gachibowli, Hyderabad', beds: 3, baths: 2, sqft: '1,650', type: 'Apartment', status: 'For Sale' },
  { id: 7, img: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&q=80&w=800', badge: 'For Sale', price: '₹2.4 Cr', title: 'Sector 65 Villas', loc: 'Sector 65, Gurugram', beds: 4, baths: 4, sqft: '3,600', type: 'Villa', status: 'For Sale' },
  { id: 8, img: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&q=80&w=800', badge: 'Off-Market', badgeColor: '#7c3aed', price: '₹5.5 Cr', title: 'Auroville Heritage Bungalow', loc: 'ECR Road, Chennai', beds: 5, baths: 4, sqft: '5,200', type: 'Bungalow', status: 'Off-Market' },
];

const TYPES = ['All', 'Apartment', 'Villa', 'Bungalow', 'Penthouse'];
const STATUSES = ['All', 'For Sale', 'New Launch', 'Off-Market'];

const Projects = () => {
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedType, setSelectedType] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');

  const filtered = ALL_PROPERTIES.filter(p => {
    const matchSearch = !search || p.title.toLowerCase().includes(search.toLowerCase()) || p.loc.toLowerCase().includes(search.toLowerCase());
    const matchType = selectedType === 'All' || p.type === selectedType;
    const matchStatus = selectedStatus === 'All' || p.status === selectedStatus;
    return matchSearch && matchType && matchStatus;
  });

  const reset = () => { setSearch(''); setSelectedType('All'); setSelectedStatus('All'); };

  return (
    <>
      <Header />

      {/* Page Header */}
      <header className="page-header">
        <div className="container">
          <span className="section-badge" style={{ color: '#93c5fd' }}>Browse Listings</span>
          <h1 className="text-h1" style={{ marginTop: '0.5rem' }}>Premium Properties in India</h1>
          <p style={{ marginTop: '0.75rem', color: 'rgba(255,255,255,0.65)', fontSize: '1.05rem' }}>
            Curated selection of luxury homes across Mumbai, Pune, Bengaluru, Hyderabad &amp; more.
          </p>
        </div>
      </header>

      {/* Main Content */}
      <div className="container">
        {filtersOpen && (
          <div className="fixed inset-0 bg-black/60 z-[199] lg:hidden" onClick={() => setFiltersOpen(false)} />
        )}

        <div className="layout-sidebar">
          {/* Sidebar Filters */}
          <aside className={`filter-sidebar ${filtersOpen ? 'open' : ''}`}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', paddingBottom: '1rem', borderBottom: '1px solid #f1f5f9' }}>
              <h3 style={{ fontWeight: 700, color: '#0f172a', fontSize: '1.05rem' }}>Filters</h3>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <button onClick={reset} style={{ color: '#2563eb', fontWeight: 600, fontSize: '0.85rem', background: 'none', border: 'none', cursor: 'pointer' }}>Reset</button>
                <button className="lg:hidden" onClick={() => setFiltersOpen(false)} style={{ color: '#64748b', background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer' }}>
                  <i className="ri-close-line" />
                </button>
              </div>
            </div>

            <div className="filter-group">
              <div className="filter-label">Search</div>
              <div style={{ position: 'relative' }}>
                <i className="ri-search-line" style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                <input
                  type="text"
                  placeholder="City, society or name"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="input-base"
                  style={{ paddingLeft: '2.5rem' }}
                />
              </div>
            </div>

            <div className="filter-group">
              <div className="filter-label">Status</div>
              {STATUSES.map(s => (
                <label key={s} className="checkbox-item">
                  <input type="radio" name="status" checked={selectedStatus === s} onChange={() => setSelectedStatus(s)} />
                  {s}
                </label>
              ))}
            </div>

            <div className="filter-group">
              <div className="filter-label">Property Type</div>
              {TYPES.map(t => (
                <label key={t} className="checkbox-item">
                  <input type="radio" name="type" checked={selectedType === t} onChange={() => setSelectedType(t)} />
                  {t}
                </label>
              ))}
            </div>

            <div className="filter-group">
              <div className="filter-label">Price Range</div>
              <div className="price-range">
                <input type="text" defaultValue="₹50 L" className="price-input" />
                <span style={{ color: '#94a3b8' }}>—</span>
                <input type="text" defaultValue="₹50 Cr+" className="price-input" />
              </div>
            </div>

            <button className="btn btn-primary" style={{ width: '100%', marginTop: '0.5rem' }} onClick={() => setFiltersOpen(false)}>
              Apply &amp; View {filtered.length} Properties
            </button>
          </aside>

          {/* Property Grid */}
          <main>
            <div className="grid-toolbar">
              <div>
                Showing <strong>{filtered.length}</strong> properties
                {selectedType !== 'All' && <span> · {selectedType}</span>}
                {selectedStatus !== 'All' && <span> · {selectedStatus}</span>}
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                <button
                  className="btn btn-outline lg:hidden"
                  onClick={() => setFiltersOpen(true)}
                  style={{ padding: '0.5rem 1rem', minHeight: '40px' }}
                >
                  <i className="ri-filter-3-line" /> Filters
                </button>
              </div>
            </div>

            {filtered.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '5rem 1rem', color: '#64748b' }}>
                <i className="ri-search-eye-line" style={{ fontSize: '3rem', opacity: 0.3 }} />
                <p style={{ marginTop: '1rem', fontWeight: 600 }}>No properties match your filters.</p>
                <button onClick={reset} className="btn btn-outline" style={{ marginTop: '1rem' }}>Clear Filters</button>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(270px,1fr))', gap: '1.5rem' }}>
                {filtered.map((p) => (
                  <Link key={p.id} to={`/property/${p.id}`} className="card" style={{ display: 'block' }}>
                    <div className="property-image-container">
                      <span className="property-badge" style={{ background: p.badgeColor }}>{p.badge}</span>
                      <span className="property-price">{p.price}</span>
                      <img src={p.img} alt={p.title} className="property-image" />
                    </div>
                    <div className="property-content">
                      <h3 className="text-h4 text-main">{p.title}</h3>
                      <p className="text-small" style={{ marginTop: '0.2rem' }}><i className="ri-map-pin-line" /> {p.loc}</p>
                      <div className="property-meta">
                        <span className="meta-item"><i className="ri-door-line" /> {p.beds} BHK</span>
                        <span className="meta-item"><i className="ri-drop-line" /> {p.baths} Bath</span>
                        <span className="meta-item"><i className="ri-ruler-line" /> {p.sqft} sq.ft</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </main>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default Projects;
