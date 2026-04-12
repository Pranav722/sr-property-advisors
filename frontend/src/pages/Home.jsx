import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Header from '../components/Header';
import Footer from '../components/Footer';
import api from '../services/api';
import '../home.css';
import '../style.css';

const BASE_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';

const STATUS_COLOR = {
  'Available': '#10b981',
  'Upcoming': '#3b82f6',
  'Sold Out': '#ef4444'
};

const Home = () => {
  const [featuredProjects, setFeaturedProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const { data } = await api.get('/projects?isFeatured=true');
        if (data.success && Array.isArray(data.data)) {
          setFeaturedProjects(data.data.slice(0, 4)); // Only show top 4 on homepage
        }
      } catch (err) {
        console.error('Failed to fetch featured projects');
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  return (
    <>
      <Helmet>
        <title>SR Property Advisor | Premium Real Estate in India</title>
        <meta name="description" content="Buy, sell, or invest in verified premium properties across Mumbai, Pune, Bengaluru & beyond with India's most trusted property advisors – SR Property Advisor." />
        <meta name="keywords" content="property in india, real estate advisor india, buy property mumbai, premium plots india, sr property advisor, investment property india" />
        <link rel="canonical" href="https://srpropertyadvisor.in/" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="SR Property Advisor | Premium Real Estate in India" />
        <meta property="og:description" content="Buy, sell, or invest in verified premium properties across India with SR Property Advisor." />
        <meta property="og:url" content="https://srpropertyadvisor.in/" />
        <meta property="og:image" content="https://srpropertyadvisor.in/images/hero_bg_exterior_1773059538662.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "RealEstateAgent",
          "name": "SR Property Advisor",
          "url": "https://srpropertyadvisor.in",
          "description": "Premium real estate advisory services across India – verified listings, best price guarantee, 24/7 expert support.",
          "address": { "@type": "PostalAddress", "addressCountry": "IN" },
          "areaServed": ["Mumbai", "Pune", "Bengaluru", "Hyderabad", "India"]
        })}</script>
      </Helmet>
      <Header />

      {/* ─── HERO ─── */}
      <section className="hero-section">
        <div className="container">
          <div className="hero-grid animate-fade-in">
            {/* Left Content */}
            <div className="hero-content">
              <span className="section-badge" style={{ color: '#2563eb', fontSize: '0.8rem', background: '#eff6ff' }}>
                <i className="ri-map-pin-2-line" style={{ marginRight: '0.35rem' }} />
                Premium Indian Real Estate
              </span>
              <h1 className="text-h1" style={{ color: '#0f172a', marginTop: '1rem', lineHeight: 1.15 }}>
                Find Your Dream<br />Property in India.
              </h1>
              <p style={{ color: '#475569', fontSize: 'clamp(1rem,2vw,1.15rem)', marginTop: '1.25rem', lineHeight: 1.75 }}>
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
                <div className="search-btn-wrap">
                  <Link to="/projects" className="btn btn-primary" style={{ borderRadius: '12px', padding: '0.75rem 1.75rem', width: '100%', justifyContent: 'center' }}>
                    <i className="ri-search-line" /> Search
                  </Link>
                </div>
              </div>

              {/* Quick stats */}
              <div style={{ display: 'flex', gap: '2.5rem', marginTop: '2.5rem', flexWrap: 'wrap' }}>
                {[['500+', 'Properties Listed'], ['15+', 'Years of Trust'], ['₹500 Cr+', 'Transactions'], ['50+', 'Cities Covered']].map(([num, label]) => (
                  <div key={label}>
                    <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a' }}>{num}</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600, marginTop: '0.2rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Image */}
            <div style={{ position: 'relative' }}>
              <div className="hero-image-wrapper">
                <img src="/images/hero_bg_exterior_1773059538662.png" alt="Luxury Indian Property" style={{ height: '600px', objectFit: 'cover' }} />
              </div>
              <div className="hero-floating-badge">
                <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#eff6ff', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', flexShrink: 0 }}>
                  <i className="ri-verified-badge-fill" />
                </div>
                <div>
                  <div style={{ fontWeight: 800, color: '#0f172a', fontSize: '1.1rem' }}>#1 Rated</div>
                  <div style={{ color: '#64748b', fontSize: '0.8rem', fontWeight: 500 }}>Property Advisors in India</div>
                </div>
              </div>
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
              { icon: 'ri-shield-check-line', color: '#2563eb', title: 'Verified Listings', desc: 'All our projects are strictly verified and legally compliant for your protection.' },
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

          {loading ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>
              <i className="ri-loader-4-line" style={{ fontSize: '2rem', display: 'inline-block', animation: 'spin 1s linear infinite' }} />
              <div style={{ marginTop: '0.5rem' }}>Loading featured properties...</div>
            </div>
          ) : featuredProjects.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8', background: '#fff', borderRadius: '16px', border: '1px dashed #cbd5e1' }}>
              <i className="ri-building-line" style={{ fontSize: '3rem', opacity: 0.5 }} />
              <div style={{ marginTop: '1rem', fontSize: '1.1rem' }}>No featured properties curated yet.</div>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px,1fr))', gap: '1.5rem' }}>
              {featuredProjects.map((p) => {
                const imgUrl = p.coverImage ? `${BASE_URL}/api${p.coverImage}` : 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=800';
                const badgeColor = STATUS_COLOR[p.status] || '#64748b';
                
                return (
                  <Link key={p._id} to={`/property/${p._id}`} className="card" style={{ display: 'block' }}>
                    <div className="property-image-container">
                      <span className="property-badge" style={{ background: badgeColor }}>{p.status}</span>
                      <span className="property-price" style={{ fontWeight: 800 }}>{p.price || 'Price on request'}</span>
                      <img src={imgUrl} alt={p.title} className="property-image" />
                    </div>
                    <div className="property-content">
                      <h3 className="text-h4 text-main" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.title}</h3>
                      <p className="text-small" style={{ marginTop: '0.35rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <i className="ri-map-pin-line" style={{ color: '#3b82f6' }} /> 
                        {p.location?.name || 'Location Not Specified'}
                      </p>
                      <div className="property-meta" style={{ marginTop: '1rem', borderTop: '1px solid #f1f5f9', paddingTop: '1rem' }}>
                        <span className="meta-item"><i className="ri-building-2-line" /> {p.type}</span>
                        {p.status === 'Available' && <span className="meta-item"><i className="ri-checkbox-circle-line" /> Ready</span>}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
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
