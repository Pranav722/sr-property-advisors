import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../home.css';
import '../style.css';

const Home = () => {
  return (
    <>
      <Header />

      {/* ─── HERO ─── */}
      <section className="hero-section">
        <img
          src="/images/hero_bg_exterior_1773059538662.png"
          alt="Luxury Property"
          className="hero-bg"
        />
        <div className="hero-overlay" />

        <div className="container" style={{ paddingTop: '5rem', paddingBottom: '5rem' }}>
          <div className="hero-content animate-fade-in">
            <span className="section-badge" style={{ color: '#60a5fa' }}>Premium Real Estate</span>
            <h1 className="text-h1" style={{ color: '#fff', marginTop: '0.5rem' }}>
              Discover<br />Extraordinary<br />Properties.
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.72)', fontSize: 'clamp(1rem,2vw,1.2rem)', marginTop: '1.25rem', maxWidth: '540px', lineHeight: 1.7 }}>
              Expert guidance in curating and acquiring luxury real estate worldwide. Find your next premium investment with SR Property Advisors.
            </p>

            {/* Search Bar */}
            <div className="search-bar-wrap">
              <div className="search-input-group">
                <i className="ri-map-pin-2-line" style={{ fontSize: '1.2rem', flexShrink: 0 }} />
                <input type="text" placeholder="City, neighbourhood or ZIP" />
              </div>
              <div className="search-divider" />
              <div className="search-input-group" style={{ flexShrink: 0, minWidth: 0 }}>
                <i className="ri-home-4-line" style={{ fontSize: '1.2rem', flexShrink: 0 }} />
                <select>
                  <option>Property Type</option>
                  <option>Villa</option>
                  <option>Apartment</option>
                  <option>Penthouse</option>
                  <option>Estate</option>
                </select>
              </div>
              <div className="search-divider" />
              <Link to="/projects" className="btn btn-primary" style={{ borderRadius: '12px', padding: '0.75rem 1.75rem', flexShrink: 0, width: '100%', justifyContent: 'center' }}>
                <i className="ri-search-line" /> Search
              </Link>
            </div>

            {/* Quick stats */}
            <div style={{ display: 'flex', gap: '2.5rem', marginTop: '2.25rem', flexWrap: 'wrap' }}>
              {[['300+', 'Properties'], ['15+', 'Years'], ['$2B+', 'Sales']].map(([num, label]) => (
                <div key={label}>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fff' }}>{num}</div>
                  <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.55)', fontWeight: 500 }}>{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── SERVICES ─── */}
      <section style={{ padding: '6rem 0', background: '#f8fafc' }} id="services">
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <span className="section-badge">Our Expertise</span>
            <h2 className="text-h2 text-main" style={{ marginTop: '0.5rem' }}>Comprehensive Real Estate Services</h2>
            <p className="text-body" style={{ marginTop: '1rem', maxWidth: '540px', marginInline: 'auto' }}>
              End-to-end advisory for high-net-worth individuals seeking premium investments.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px,1fr))', gap: '1.5rem' }}>
            {[
              { icon: 'ri-home-smile-2-line', title: 'Property Acquisition', desc: 'Exclusive access to off-market luxury listings with expert negotiation.' },
              { icon: 'ri-bar-chart-box-line', title: 'Investment Advisory', desc: 'Data-driven market analysis tailored to your wealth goals.' },
              { icon: 'ri-key-2-line', title: 'Property Management', desc: 'End-to-end asset management protecting your portfolio value.' },
            ].map((s) => (
              <div key={s.title} className="card service-card">
                <div className="service-icon"><i className={s.icon} /></div>
                <h3 className="text-h4 text-main" style={{ marginBottom: '0.75rem' }}>{s.title}</h3>
                <p className="text-body">{s.desc}</p>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
            <Link to="/services" className="btn btn-outline">View All Services</Link>
          </div>
        </div>
      </section>

      {/* ─── FEATURED PROPERTIES ─── */}
      <section style={{ padding: '6rem 0', background: '#fff' }}>
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '2.5rem', gap: '1rem', flexWrap: 'wrap' }}>
            <div>
              <span className="section-badge">Featured Portfolio</span>
              <h2 className="text-h2 text-main" style={{ marginTop: '0.5rem' }}>Exclusive Properties</h2>
            </div>
            <Link to="/projects" className="btn btn-outline">View All →</Link>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px,1fr))', gap: '1.5rem' }}>
            {[
              { img: '/images/property_listing_villa_1773059556545.png', badge: 'For Sale', price: '$4,500,000', title: 'Beverly Hills Estate', loc: 'Los Angeles, CA', beds: 5, baths: 6, sqft: '6,200' },
              { img: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=800', badge: 'New Development', price: '$2,100,000', title: 'Skyline Penthouse', loc: 'Manhattan, New York', beds: 3, baths: 3, sqft: '3,100' },
              { img: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=800', badge: 'For Sale', price: '$8,950,000', title: 'Coastal Modern Villa', loc: 'Miami, FL', beds: 6, baths: 8, sqft: '10,500' },
              { img: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=800', badge: 'Off-Market', price: '$12,000,000', title: 'Highland Park Mansion', loc: 'Dallas, TX', beds: 7, baths: 9, sqft: '14,000' },
            ].map((p, i) => (
              <Link key={i} to={`/property/${i + 1}`} className="card" style={{ display: 'block' }}>
                <div className="property-image-container">
                  <span className="property-badge" style={{ background: p.badge === 'New Development' ? '#2563eb' : p.badge === 'Off-Market' ? '#7c3aed' : undefined }}>{p.badge}</span>
                  <span className="property-price">{p.price}</span>
                  <img src={p.img} alt={p.title} className="property-image" />
                </div>
                <div className="property-content">
                  <h3 className="text-h4 text-main">{p.title}</h3>
                  <p className="text-small" style={{ marginTop: '0.25rem' }}><i className="ri-map-pin-line" /> {p.loc}</p>
                  <div className="property-meta">
                    <span className="meta-item"><i className="ri-door-line" /> {p.beds} Beds</span>
                    <span className="meta-item"><i className="ri-drop-line" /> {p.baths} Baths</span>
                    <span className="meta-item"><i className="ri-ruler-line" /> {p.sqft} ft²</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─── STATS ─── */}
      <section style={{ padding: '5rem 0', background: '#0f172a', color: '#fff' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px,1fr))', gap: '2rem', textAlign: 'center' }}>
            {[
              ['$2B+', 'Property Sales'],
              ['15+', 'Years Experience'],
              ['300+', 'Happy Clients'],
              ['24/7', 'Advisory Support'],
            ].map(([n, l]) => (
              <div key={l}>
                <div style={{ fontSize: 'clamp(1.75rem,4vw,2.5rem)', fontWeight: 800, color: '#60a5fa' }}>{n}</div>
                <div style={{ color: 'rgba(255,255,255,0.55)', marginTop: '0.4rem', fontSize: '0.875rem', fontWeight: 500 }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section style={{ padding: '6rem 0', background: '#eff6ff' }}>
        <div className="container" style={{ textAlign: 'center', maxWidth: '700px', marginInline: 'auto' }}>
          <span className="section-badge">Ready to Invest?</span>
          <h2 className="text-h2 text-main" style={{ marginTop: '0.5rem' }}>
            Find Your Next<br />Premium Property
          </h2>
          <p className="text-body" style={{ marginTop: '1rem', marginBottom: '2rem' }}>
            Our advisors are available 24/7 to guide your real estate journey from search to handover.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/contact" className="btn btn-primary" style={{ padding: '0.875rem 2rem' }}>Book a Consultation</Link>
            <Link to="/projects" className="btn btn-outline" style={{ padding: '0.875rem 2rem' }}>Browse Properties</Link>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default Home;
