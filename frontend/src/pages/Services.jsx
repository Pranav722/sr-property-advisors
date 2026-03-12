import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Link } from 'react-router-dom';

const services = [
  {
    icon: 'ri-home-smile-2-line',
    title: 'Property Acquisition',
    desc: 'Exclusive access to off-market luxury properties. We identify, evaluate, and negotiate acquisitions to secure the highest-value investments for your portfolio.',
    features: ['Off-market listings', 'Expert negotiation', 'Due diligence support', 'Global network access'],
    color: '#2563eb',
  },
  {
    icon: 'ri-bar-chart-box-line',
    title: 'Investment Advisory',
    desc: 'Data-driven market analysis and bespoke portfolio strategies tailored to maximize your wealth generation goals across Indian and global real estate markets.',
    features: ['Market trend reports', 'ROI projections', 'Portfolio structuring', 'Risk assessment'],
    color: '#7c3aed',
  },
  {
    icon: 'ri-key-2-line',
    title: 'Property Management',
    desc: 'End-to-end asset management ensuring your premium properties maintain their value, prestige, and income generation year after year.',
    features: ['Tenant management', 'Maintenance oversight', 'Rental optimization', 'Quarterly reporting'],
    color: '#059669',
  },
  {
    icon: 'ri-file-text-line',
    title: 'Legal & Documentation',
    desc: 'Comprehensive legal services covering documentation, title verification, legal compliance, and smooth transfer of ownership with zero hassle.',
    features: ['Title verification', 'Legal compliance', 'Sale deed drafting', 'Registration support'],
    color: '#dc2626',
  },
  {
    icon: 'ri-building-2-line',
    title: 'New Development Sales',
    desc: 'First access to pre-launch and under-construction premium developments, complete with developer due diligence and best-price guarantees.',
    features: ['Pre-launch access', 'Developer vetting', 'Payment plan advisory', 'Registration support'],
    color: '#d97706',
  },
  {
    icon: 'ri-customer-service-2-line',
    title: 'Wealth Concierge',
    desc: '24/7 dedicated relationship managers for our HNI clients. From property search to handover, every step is handled with white-glove precision.',
    features: ['Dedicated advisor', 'Priority access', '24/7 availability', 'End-to-end handling'],
    color: '#0e7490',
  },
];

const Services = () => {
  return (
    <>
      <Header />

      {/* Hero */}
      <section style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 100%)', padding: '10rem 0 6rem', color: 'white' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <span style={{ color: '#60a5fa', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '0.9rem' }}>Our Services</span>
          <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 700, margin: '1rem 0', lineHeight: 1.1 }}>
            Premium Real Estate<br/>Advisory Services
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '1.125rem', maxWidth: '600px', margin: '0 auto 2.5rem' }}>
            From acquisition to asset management, our expert team delivers tailored solutions for discerning investors.
          </p>
          <Link to="/contact" className="btn btn-primary" style={{ fontSize: '1rem', padding: '1rem 2.5rem', borderRadius: '12px' }}>
            Book a Consultation
          </Link>
        </div>
      </section>

      {/* Services Grid */}
      <section style={{ padding: '6rem 0', background: '#f8fafc' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
            {services.map((s, i) => (
              <div key={i} className="card" style={{ padding: '2.5rem' }}>
                <div style={{ width: '64px', height: '64px', borderRadius: '16px', background: s.color + '18', color: s.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.75rem', marginBottom: '1.5rem' }}>
                  <i className={s.icon}></i>
                </div>
                <h3 style={{ fontSize: '1.35rem', fontWeight: 700, marginBottom: '0.75rem', color: '#0f172a' }}>{s.title}</h3>
                <p style={{ color: '#64748b', lineHeight: 1.7, marginBottom: '1.5rem' }}>{s.desc}</p>
                <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {s.features.map((f, j) => (
                    <li key={j} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#374151', fontSize: '0.9rem' }}>
                      <i className="ri-check-line" style={{ color: s.color, fontWeight: 700 }}></i> {f}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section style={{ background: '#2563eb', padding: '5rem 0', color: 'white', textAlign: 'center' }}>
        <div className="container">
          <h2 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.75rem)', fontWeight: 700, marginBottom: '1rem' }}>Ready to Make Your Move?</h2>
          <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '1.1rem', marginBottom: '2.5rem', maxWidth: '500px', margin: '0 auto 2.5rem' }}>
            Schedule a free consultation with our senior advisors.
          </p>
          <Link to="/contact" className="btn" style={{ background: 'white', color: '#2563eb', fontSize: '1rem', padding: '1rem 2.5rem', borderRadius: '12px', fontWeight: 700 }}>
            Get in Touch
          </Link>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default Services;
