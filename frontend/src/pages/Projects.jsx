import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import api from '../services/api';
import '../projects.css';
import '../style.css';

const BASE_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';

// Status display mapping from backend enum to friendly label
const STATUS_LABEL = {
  Available: 'For Sale',
  Upcoming: 'New Launch',
  'Sold Out': 'Sold Out',
};
const STATUS_COLOR = {
  Available: '#059669',
  Upcoming: '#2563eb',
  'Sold Out': '#dc2626',
};

const Projects = () => {
  const [allProjects, setAllProjects] = useState([]);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedType, setSelectedType] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedLocation, setSelectedLocation] = useState('All');

  const TYPES = ['All', 'Plot', 'House', 'Building', 'Villa', 'Apartment', 'Office Space', 'Warehouse'];
  const STATUSES = ['All', 'Available', 'Upcoming', 'Sold Out'];

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [projRes, locRes] = await Promise.allSettled([
          api.get('/projects'),
          api.get('/locations'),
        ]);
        if (projRes.status === 'fulfilled') {
          const d = projRes.value.data;
          setAllProjects(Array.isArray(d) ? d : (d?.data || []));
        }
        if (locRes.status === 'fulfilled') {
          const d = locRes.value.data;
          setLocations(Array.isArray(d) ? d : (d?.data || []));
        }
      } catch (err) {
        console.error('Failed to load projects', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filtered = allProjects.filter(p => {
    const locName = p.location?.name || '';
    const matchSearch = !search ||
      (p.title || '').toLowerCase().includes(search.toLowerCase()) ||
      locName.toLowerCase().includes(search.toLowerCase());
    const matchType = selectedType === 'All' || p.type === selectedType;
    const matchStatus = selectedStatus === 'All' || p.status === selectedStatus;
    const matchLoc = selectedLocation === 'All' || locName === selectedLocation;
    return matchSearch && matchType && matchStatus && matchLoc;
  });

  const reset = () => {
    setSearch('');
    setSelectedType('All');
    setSelectedStatus('All');
    setSelectedLocation('All');
  };

  return (
    <>
      <Header />

      {/* Page Header */}
      <header className="page-header">
        <div className="container">
          <span className="section-badge" style={{ color: '#93c5fd' }}>Browse Listings</span>
          <h1 className="text-h1" style={{ marginTop: '0.5rem' }}>Premium Properties in India</h1>
          <p style={{ marginTop: '0.75rem', color: 'rgba(255,255,255,0.65)', fontSize: '1.05rem' }}>
            Curated selection of luxury homes across India.
          </p>
        </div>
      </header>

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

            {/* Search */}
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

            {/* Location filter — dynamic from DB */}
            <div className="filter-group">
              <div className="filter-label">Location</div>
              <label className="checkbox-item">
                <input type="radio" name="location" checked={selectedLocation === 'All'} onChange={() => setSelectedLocation('All')} />
                All Locations
              </label>
              {locations.map(l => (
                <label key={l._id} className="checkbox-item">
                  <input type="radio" name="location" checked={selectedLocation === l.name} onChange={() => setSelectedLocation(l.name)} />
                  {l.name}
                </label>
              ))}
            </div>

            {/* Status */}
            <div className="filter-group">
              <div className="filter-label">Status</div>
              {STATUSES.map(s => (
                <label key={s} className="checkbox-item">
                  <input type="radio" name="status" checked={selectedStatus === s} onChange={() => setSelectedStatus(s)} />
                  {s === 'All' ? 'All' : STATUS_LABEL[s] || s}
                </label>
              ))}
            </div>

            {/* Property Type */}
            <div className="filter-group">
              <div className="filter-label">Property Type</div>
              {TYPES.map(t => (
                <label key={t} className="checkbox-item">
                  <input type="radio" name="type" checked={selectedType === t} onChange={() => setSelectedType(t)} />
                  {t}
                </label>
              ))}
            </div>

            <button className="btn btn-primary" style={{ width: '100%', marginTop: '0.5rem' }} onClick={() => setFiltersOpen(false)}>
              View {filtered.length} Properties
            </button>
          </aside>

          {/* Property Grid */}
          <main>
            <div className="grid-toolbar">
              <div>
                Showing <strong>{filtered.length}</strong> {filtered.length === 1 ? 'property' : 'properties'}
                {selectedType !== 'All' && <span> · {selectedType}</span>}
                {selectedStatus !== 'All' && <span> · {STATUS_LABEL[selectedStatus] || selectedStatus}</span>}
                {selectedLocation !== 'All' && <span> · {selectedLocation}</span>}
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

            {loading ? (
              <div style={{ textAlign: 'center', padding: '5rem 1rem', color: '#94a3b8' }}>
                <i className="ri-loader-4-line" style={{ fontSize: '3rem', display: 'block', marginBottom: '1rem' }} />
                <p>Loading properties…</p>
              </div>
            ) : filtered.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '5rem 1rem', color: '#64748b' }}>
                <i className="ri-search-eye-line" style={{ fontSize: '3rem', opacity: 0.3 }} />
                <p style={{ marginTop: '1rem', fontWeight: 600 }}>No properties match your filters.</p>
                <button onClick={reset} className="btn btn-outline" style={{ marginTop: '1rem' }}>Clear Filters</button>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(270px,1fr))', gap: '1.5rem' }}>
                {filtered.map((p) => {
                  const imgUrl = p.coverImage
                    ? `${BASE_URL}/api${p.coverImage}`
                    : 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=800';
                  const badgeColor = STATUS_COLOR[p.status] || '#64748b';
                  const badgeLabel = STATUS_LABEL[p.status] || p.status;
                  return (
                    <Link key={p._id} to={`/property/${p._id}`} className="card" style={{ display: 'block', textDecoration: 'none' }}>
                      <div className="property-image-container">
                        <span className="property-badge" style={{ background: badgeColor }}>{badgeLabel}</span>
                        {p.price && <span className="property-price">{p.price}</span>}
                        <img src={imgUrl} alt={p.title} className="property-image" />
                      </div>
                      <div className="property-content">
                        <h3 className="text-h4 text-main">{p.title}</h3>
                        <p className="text-small" style={{ marginTop: '0.2rem' }}>
                          <i className="ri-map-pin-line" /> {p.location?.name || 'India'}
                        </p>
                        <div className="property-meta">
                          <span className="meta-item"><i className="ri-building-line" /> {p.type}</span>
                          <span className="meta-item" style={{
                            padding: '0.2rem 0.6rem', borderRadius: '999px', fontSize: '0.72rem', fontWeight: 700,
                            background: badgeColor + '18', color: badgeColor
                          }}>{badgeLabel}</span>
                        </div>
                      </div>
                    </Link>
                  );
                })}
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
