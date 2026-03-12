import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../home.css';
import '../style.css';

const indianProperties = [
  {
    img: '/images/property_listing_villa_1773059556545.png',
    badge: 'For Sale', badgeColor: undefined,
    price: '₹4.5 Cr', title: 'Juhu Sea-View Villa', loc: 'Juhu, Mumbai',
    beds: 5, baths: 4, sqft: '4,200',
  },
  {
    img: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=800',
    badge: 'New Launch', badgeColor: '#2563eb',
    price: '₹1.8 Cr', title: 'Skyline Residences', loc: 'Powai, Mumbai',
    beds: 3, baths: 2, sqft: '1,450',
  },
  {
    img: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=800',
    badge: 'For Sale', badgeColor: undefined,
    price: '₹7.2 Cr', title: 'Golf Course Bungalow', loc: 'Koregaon Park, Pune',
    beds: 6, baths: 5, sqft: '6,800',
  },
  {
    img: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=800',
    badge: 'Off-Market', badgeColor: '#7c3aed',
    price: '₹12 Cr', title: 'Whitefield Luxury Estate', loc: 'Whitefield, Bengaluru',
    beds: 7, baths: 7, sqft: '10,000',
  },
];

const Home = () => {
  return (
    <>
      <Header />

      {/* ─── HERO ─── */}
      <section className="hero-section">
        <img src="/images/hero_bg_exterior_1773059538662.png" alt="Luxury Property" className="hero-bg" />
        <div className="hero-overlay" />

        <div className="container" style={{ paddingTop: '7rem', paddingBottom: '5rem' }}>
          <div className="hero-content animate-fade-in">
            <span className="section-badge" style={{ color: '#93c5fd', fontSize: '0.8rem' }}>
              <i className="ri-map-pin-2-line" style={{ marginRight: '0.35rem' }} />
              Premium Indian Real Estate
            </span>
            <h1 className="text-h1" style={{ color: '#fff', marginTop: '0.75rem' }}>
              Find Your Dream<br />Property in India.
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.72)', fontSize: 'clamp(1rem,2vw,1.15rem)', marginTop: '1.25rem', lineHeight: 1.75 }}>
              Expert guidance in buying, selling, and investing in premium real estate across Mumbai, Pune, Bengaluru, Hyderabad & beyond.
            </p>

            {/* Search Bar */}
            <div className="search-bar-wrap">
              <div className="search-input-group">
                <i className="ri-map-pin-2-line" style={{ fontSize: '1.2rem', flexShrink: 0 }} />
                <input type="text" placeholder="City, Colony, Locality or Society" />
              </div>
              <div className="search-divider" />
              <div className="search-input-group" style={{ flexShrink: 0 }}>
                <i className="ri-home-4-line" style={{ fontSize: '1.2rem', flexShrink: 0 }} />
                <select>
                  <option>Property Type</option>
                  <option>Flat / Apartment</option>
                  <option>Independent Villa</option>
                  <option>Bungalow / Row House</option>
                  <option>Penthouse</option>
                  <option>Plot / Land</option>
                  <option>Commercial</option>
                </select>
              </div>
              <div className="search-divider" />
              <Link to="/projects" className="btn btn-primary" style={{ borderRadius: '12px', padding: '0.75rem 1.75rem', flexShrink: 0, width: '100%', justifyContent: 'center' }}>
                <i className="ri-search-line" /> Search
              </Link>
            </div>

            {/* Quick stats */}
            <div style={{ display: 'flex', gap: '2.5rem', marginTop: '2.25rem', flexWrap: 'wrap', justifyContent: 'center' }}>
              {[['500+', 'Properties Listed'], ['15+', 'Years of Trust'], ['₹500 Cr+', 'Transactions Closed'], ['RERA', 'Registered']].map(([num, label]) => (
                <div key={label} style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#fff' }}>{num}</div>
                  <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', fontWeight: 500, marginTop: '0.2rem' }}>{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── WHY SR PROPERTY ─── */}
      <section style={{ padding: '5rem 0', background: '#fff' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <span className="section-badge">Why Choose Us</span>
            <h2 className="text-h2 text-main" style={{ marginTop: '0.5rem' }}>India's Most Trusted<br />Property Advisors</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px,1fr))', gap: '1.5rem' }}>
            {[
              { icon: 'ri-shield-check-line', color: '#2563eb', title: 'RERA Registered', desc: 'All our projects are 100% RERA compliant for your protection.' },
              { icon: 'ri-hand-coin-line', color: '#059669', title: 'Best Price Guarantee', desc: 'We negotiate directly with developers to secure the best price.' },
              { icon: 'ri-customer-service-2-line', color: '#7c3aed', title: '24/7 Expert Support', desc: 'Dedicated relationship managers available round the clock.' },
              { icon: 'ri-bank-line', color: '#d97706', title: 'Home Loan Assistance', desc: 'Tie-ups with all major banks for fast loan approvals.' },
            ].map((s) => (
              <div key={s.title} className="card" style={{ padding: '2rem', textAlign: 'center' }}>
                <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: s.color + '15', color: s.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.75rem', margin: '0 auto 1rem' }}>
                  <i className={s.icon} />
                </div>
                <h3 className="text-h4 text-main" style={{ marginBottom: '0.5rem' }}>{s.title}</h3>
                <p className="text-body" style={{ fontSize: '0.9rem' }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FEATURED PROPERTIES ─── */}
      <section style={{ padding: '5rem 0', background: '#f8fafc' }}>
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '2.5rem', gap: '1rem', flexWrap: 'wrap' }}>
            <div>
              <span className="section-badge">Featured Portfolio</span>
              <h2 className="text-h2 text-main" style={{ marginTop: '0.5rem' }}>Handpicked Properties</h2>
            </div>
            <Link to="/projects" className="btn btn-outline">View All →</Link>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px,1fr))', gap: '1.5rem' }}>
            {indianProperties.map((p, i) => (
              <Link key={i} to={`/property/${i + 1}`} className="card" style={{ display: 'block' }}>
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
        </div>
      </section>

      {/* ─── SERVICES ─── */}
      <section style={{ padding: '5rem 0', background: '#fff' }} id="services">
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <span className="section-badge">Our Services</span>
            <h2 className="text-h2 text-main" style={{ marginTop: '0.5rem' }}>Complete Real Estate Solutions</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px,1fr))', gap: '1.5rem' }}>
            {[
              { icon: 'ri-home-smile-2-line', title: 'Residential Properties', desc: 'Flats, villas, bungalows — we help you find the perfect home across all budgets.' },
              { icon: 'ri-bar-chart-box-line', title: 'Investment Advisory', desc: 'Data-driven insights on emerging micro-markets across Tier 1 & Tier 2 cities.' },
              { icon: 'ri-building-2-line', title: 'Commercial Real Estate', desc: 'Office spaces, retail shops & commercial plots for business growth.' },
            ].map((s) => (
              <div key={s.title} className="card service-card">
                <div className="service-icon"><i className={s.icon} /></div>
                <h3 className="text-h4 text-main" style={{ marginBottom: '0.75rem' }}>{s.title}</h3>
                <p className="text-body">{s.desc}</p>
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
            <Link to="/services" className="btn btn-outline">Explore All Services</Link>
          </div>
        </div>
      </section>

      {/* ─── STATS ─── */}
      <section style={{ padding: '5rem 0', background: '#0f172a', color: '#fff' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px,1fr))', gap: '2rem', textAlign: 'center' }}>
            {[['₹500 Cr+', 'Transactions Closed'], ['15+', 'Years of Experience'], ['2,000+', 'Happy Families'], ['50+', 'Cities Covered']].map(([n, l]) => (
              <div key={l}>
                <div style={{ fontSize: 'clamp(1.75rem,4vw,2.5rem)', fontWeight: 800, color: '#60a5fa' }}>{n}</div>
                <div style={{ color: 'rgba(255,255,255,0.55)', marginTop: '0.4rem', fontSize: '0.85rem', fontWeight: 500 }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section style={{ padding: '5rem 0', background: '#eff6ff' }}>
        <div className="container" style={{ textAlign: 'center', maxWidth: '680px', marginInline: 'auto' }}>
          <span className="section-badge">Get Started Today</span>
          <h2 className="text-h2 text-main" style={{ marginTop: '0.5rem' }}>Ready to Find Your Next Property?</h2>
          <p className="text-body" style={{ marginTop: '1rem', marginBottom: '2rem' }}>
            Talk to an expert advisor today — free consultation, no obligations.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/contact" className="btn btn-primary" style={{ padding: '0.875rem 2rem' }}>Book Free Consultation</Link>
            <Link to="/projects" className="btn btn-outline" style={{ padding: '0.875rem 2rem' }}>Browse Properties</Link>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default Home;
