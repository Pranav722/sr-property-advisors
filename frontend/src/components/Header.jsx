import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';

// Pages that have a DARK hero section at the top (navbar can start transparent + white links)
const DARK_HERO_PAGES = ['/'];

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const isHome = location.pathname === '/';
  // For pages WITHOUT a dark background at the top, start in scrolled (solid) mode
  const hasDarkHero = DARK_HERO_PAGES.includes(location.pathname);
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));
  const isAdmin = userInfo?.role === 'admin';
  const isLoggedIn = !!(userInfo?.token);

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
    // If page doesn't have a dark hero, treat as already scrolled
    if (!hasDarkHero) setScrolled(true);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [hasDarkHero]);

  // Close menu on route change
  useEffect(() => {
    setMenuOpen(false);
    if (!hasDarkHero) setScrolled(true);
    else setScrolled(window.scrollY > 50);
  }, [location.pathname]);

  const navClass = [
    'navbar',
    scrolled ? 'scrolled' : '',
    isHome && !scrolled ? 'navbar-light' : '',
  ].filter(Boolean).join(' ');

  return (
    <nav className={navClass} id="navbar">
      <div className="container flex items-center justify-between">

        {/* Left Side: Logo */}
        <Link to="/" className="logo">
          <i className="ri-building-4-fill"></i>
          SR Property
        </Link>

        {/* Center Side: Links */}
        <div className={`nav-links hidden md:flex items-center gap-6 lg:gap-8 ${menuOpen ? 'active' : ''}`}>
          <NavLink to="/" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>Home</NavLink>
          <NavLink to="/projects" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>Projects</NavLink>
          <NavLink to="/services" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>Services</NavLink>
          <NavLink to="/contact" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>Contact</NavLink>
          {isAdmin && (
            <Link to="/dashboard" className="nav-link"><i className="ri-dashboard-line"></i> Dashboard</Link>
          )}

          {/* Mobile visible right-side elements */}
          <div className="md:hidden flex flex-col gap-4 mt-4 pt-4 mobile-only-block" style={{ borderTop: '1px solid rgba(255,255,255,0.1)' }}>
            <NavLink to="/services" className="nav-link">Services</NavLink>
            <NavLink to="/contact" className="nav-link">Contact</NavLink>
            {!isLoggedIn ? (
              <Link to="/login" className="nav-link text-center">Login</Link>
            ) : (
              <button onClick={handleLogout} className="nav-link text-center">Logout</button>
            )}
          </div>
        </div>

        {/* Right Side: Auth / CTA (Desktop only) */}
        <div className="hidden md:flex items-center gap-4 lg:gap-6 2xl:gap-8">
          {!isLoggedIn ? (
            <Link to="/login" className="nav-link font-medium">Login / Account</Link>
          ) : (
            <button onClick={handleLogout} className="nav-link font-medium text-sm">Logout</button>
          )}
          <Link to="/contact" className="btn btn-primary" style={{ padding: '0.5rem 1.25rem' }}>Contact Us</Link>
        </div>

        {/* Hamburger Menu Icon (Hidden in App format) */}
        <button
          className="menu-btn hidden"
          style={{ color: scrolled ? 'var(--color-primary)' : 'white', fontSize: '1.5rem' }}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <i className="ri-menu-3-line"></i>
        </button>

      </div>
    </nav>
  );
};

export default Header;
