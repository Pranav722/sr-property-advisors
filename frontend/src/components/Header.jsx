import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`} id="navbar">
      <div className="container flex items-center justify-between">
        <Link to="/" className="logo">
          <i className="ri-building-4-fill"></i>
          SR Property
        </Link>
        <div className={`nav-links ${menuOpen ? 'active' : ''}`}>
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/projects" className="nav-link">Projects</Link>
          <a href="#services" className="nav-link">Services</a>
          <Link to="/dashboard" className="nav-link"><i className="ri-dashboard-line"></i> Dashboard</Link>
          <a href="#contact" className="btn btn-primary" style={{ padding: '0.5rem 1.25rem' }}>Contact Us</a>
        </div>
        <button 
          className="menu-btn" 
          style={{ color: scrolled ? 'var(--color-primary)' : 'white', fontSize: '1.5rem', display: 'block' }} 
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <i className="ri-menu-3-line"></i>
        </button>
      </div>
    </nav>
  );
};

export default Header;
