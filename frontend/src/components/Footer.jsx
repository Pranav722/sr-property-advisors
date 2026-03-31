import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

const Footer = () => {
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data } = await api.get('/settings');
        if (data?.data) setSettings(data.data);
      } catch (err) {
        // silently fallback
      }
    };
    fetchSettings();
  }, []);

  return (
    <footer className="footer">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12" style={{ paddingBottom: '3rem', borderBottom: '1px solid rgba(255,255,255,0.1)', marginBottom: '2rem' }}>
          <div style={{ gridColumn: 'span 1' }}>
            <Link to="/" className="logo mb-4">
              <i className="ri-building-4-fill"></i> SR Property
            </Link>
            <p className="text-body mt-4" style={{ color: 'rgba(255,255,255,0.6)' }}>
              Premium real estate advisory firm specializing in luxury acquisitions and high-yield property portfolios.
            </p>
            <div className="social-icons">
              {settings?.facebook && <a href={settings.facebook} target="_blank" rel="noreferrer" className="social-icon"><i className="ri-facebook-fill"></i></a>}
              {settings?.twitter && <a href={settings.twitter} target="_blank" rel="noreferrer" className="social-icon"><i className="ri-twitter-x-line"></i></a>}
              {settings?.instagram && <a href={settings.instagram} target="_blank" rel="noreferrer" className="social-icon"><i className="ri-instagram-line"></i></a>}
            </div>
          </div>

          <div>
            <h4 className="footer-heading">Company</h4>
            <ul className="footer-links">
              <li><Link to="/about" className="footer-link">About Us</Link></li>
              <li><Link to="/services" className="footer-link">Our Services</Link></li>
              <li><Link to="/careers" className="footer-link">Careers</Link></li>
              <li><Link to="/contact" className="footer-link">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="footer-heading">Properties</h4>
            <ul className="footer-links">
              <li><Link to="/projects?type=villa" className="footer-link">Villas</Link></li>
              <li><Link to="/projects?type=penthouse" className="footer-link">Penthouses</Link></li>
              <li><Link to="/projects?type=commercial" className="footer-link">Commercial</Link></li>
              <li><Link to="/projects?type=offmarket" className="footer-link">Off-Market</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="footer-heading">Contact Info</h4>
            <ul className="footer-links">
              <li style={{ display: 'flex', gap: '0.5rem', color: 'rgba(255,255,255,0.6)' }}><i className="ri-map-pin-line" style={{ color: '#60a5fa', flexShrink: 0 }} /> {settings?.address || 'Mumbai, Maharashtra, India'}</li>
              <li style={{ display: 'flex', gap: '0.5rem', color: 'rgba(255,255,255,0.6)' }}><i className="ri-phone-line" style={{ color: '#60a5fa', flexShrink: 0 }} /> {settings?.phone || '+91 82219 10113'}</li>
              <li style={{ display: 'flex', gap: '0.5rem', color: 'rgba(255,255,255,0.6)' }}><i className="ri-mail-line" style={{ color: '#60a5fa', flexShrink: 0 }} /> {settings?.email || 'info@srpropertyadvisor.in'}</li>
            </ul>
          </div>
        </div>
        <div className="flex justify-between items-center text-small" style={{ color: 'rgba(255,255,255,0.4)' }}>
          <p>&copy; 2026 SR Property Advisors. All rights reserved.</p>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <Link to="/privacy" className="footer-link">Privacy Policy</Link>
            <Link to="/terms" className="footer-link">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
