import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const userInfo = JSON.parse(localStorage.getItem('userInfo'));
  const isAdmin = userInfo?.user?.role === 'admin';
  const isLoggedIn = !!userInfo;

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userInfo');
    navigate('/login');
  };

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
        
        {/* Left Side: Logo */}
        <Link to="/" className="logo">
          <i className="ri-building-4-fill"></i>
          SR Property
        </Link>
        
        {/* Center Side: Links */}
        <div className={`nav-links ${menuOpen ? 'active' : ''}`}>
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/projects" className="nav-link">Projects</Link>
          <a href="#services" className="nav-link">Services</a>
          {isAdmin && (
            <Link to="/dashboard" className="nav-link"><i className="ri-dashboard-line"></i> Dashboard</Link>
          )}

          {/* Mobile visible right-side elements */}
          <div className="md:hidden flex flex-col gap-4 mt-4 pt-4 border-t border-gray-100/20" style={{borderTopColor: 'rgba(255,255,255,0.1)'}}>
            {!isLoggedIn ? (
              <Link to="/login" className="nav-link text-center">Login</Link>
            ) : (
              <button onClick={handleLogout} className="nav-link text-center">Logout</button>
            )}
            <a href="#contact" className="btn btn-primary text-center">Contact Us</a>
          </div>
        </div>

        {/* Right Side: Auth / CTA (Desktop only) */}
        <div className="hidden md:flex items-center gap-4 lg:gap-6 2xl:gap-8">
            {!isLoggedIn ? (
              <Link to="/login" className="nav-link font-medium">Login / Account</Link>
            ) : (
              <button onClick={handleLogout} className="nav-link font-medium text-sm">Logout / Profile</button>
            )}
            <a href="#contact" className="btn btn-primary" style={{ padding: '0.5rem 1.25rem' }}>Contact Us</a>
        </div>

        {/* Hamburger Menu Icon */}
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
