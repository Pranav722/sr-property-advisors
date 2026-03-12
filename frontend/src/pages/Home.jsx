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
      {/* Hero Section */}
      <section className="hero-section">
        <img src="/images/hero_bg_exterior_1773059538662.png" alt="Luxury Property Exterior" className="hero-bg" id="heroBgImg" />
        <div className="hero-overlay"></div>

        <div className="container">
          <div className="hero-content animate-fade-in">
            <h1 className="text-3xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-2 md:mb-4 font-sans tracking-tight leading-tight text-white">Discover Extraordinary<br/>Properties Worldwide.</h1>
            <p className="text-base md:text-xl lg:text-2xl mt-4 md:mt-6 mb-6 md:mb-8" style={{ color: 'rgba(255,255,255,0.8)', maxWidth: '700px' }}>
              Expert guidance in curating and acquiring luxury real estate. Find your next premium investment with SR
              Property Advisors.
            </p>

            <div className="search-bar glass-dark w-full md:w-[85%] lg:w-[110%] max-w-[1100px] xl:ml-[-10%] relative z-20">
              <form className="flex flex-col md:flex-row items-stretch md:items-center gap-3 md:gap-4 w-full" action="/projects">
                <input type="text" placeholder="Location, City, or ZIP" className="input-base text-sm md:text-base min-h-[48px] w-full" style={{ flex: 1 }} />
                <div className="hidden md:block w-[1px] bg-white/20 h-8"></div>
                <select className="input-base min-h-[48px] w-full md:w-auto" style={{ background: 'transparent', color: 'white', border: 'none' }}>
                  <option value="" style={{ color: 'black' }}>Property Type</option>
                  <option value="villa" style={{ color: 'black' }}>Villa</option>
                  <option value="apartment" style={{ color: 'black' }}>Apartment</option>
                  <option value="penthouse" style={{ color: 'black' }}>Penthouse</option>
                </select>
                <div className="hidden md:block w-[1px] bg-white/20 h-8"></div>
                <button type="submit" className="btn btn-primary min-h-[48px] w-full md:w-auto mt-2 md:mt-0 whitespace-nowrap px-8">
                  <i className="ri-search-line" style={{ marginRight: '0.5rem' }}></i> Search
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <section className="py-16 md:py-20" style={{ backgroundColor: 'var(--color-bg-alt)' }}>
        <div className="container">
          <div className="text-center mb-8" style={{ textAlign: 'center', maxWidth: '600px', margin: '0 auto 3rem' }}>
            <span className="section-badge">Our Expertise</span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-main">Comprehensive Real Estate Services</h2>
            <p className="text-base md:text-lg mt-4 text-muted">We provide end-to-end advisory for high-net-worth individuals seeking premium real
              estate investments.</p>
          </div>

          <div className="flex flex-col md:grid md:grid-cols-3 gap-4 md:gap-6">
            <div className="card service-card p-6 md:p-8">
              <div className="service-icon"><i className="ri-home-smile-2-line"></i></div>
              <h3 className="text-h4 mb-4 text-main">Property Acquisition</h3>
              <p className="text-body">Exclusive access to off-market luxury properties and expert negotiation to secure the
                best investments.</p>
            </div>
            <div className="card service-card p-6 md:p-8">
              <div className="service-icon"><i className="ri-bar-chart-box-line"></i></div>
              <h3 className="text-h4 mb-4 text-main">Investment Advisory</h3>
              <p className="text-body">Data-driven market analysis and portfolio strategies tailored to your wealth generation
                goals.</p>
            </div>
            <div className="card service-card">
              <div className="service-icon"><i className="ri-key-2-line"></i></div>
              <h3 className="text-h4 mb-4 text-main">Property Management</h3>
              <p className="text-body">Complete asset management services ensuring your premium properties maintain their value
                and prestige.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      <section className="py-16 md:py-20">
        <div className="container">
          <div className="flex items-center justify-between mb-6 md:mb-8">
            <div>
              <span className="section-badge">Featured Portfolio</span>
              <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold text-main">Exclusive Properties</h2>
            </div>
          </div>

          <div className="flex flex-col md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 md:gap-6">
            {/* Card 1 */}
            <Link to="/property/1" className="card">
              <div className="property-image-container">
                <span className="property-badge">For Sale</span>
                <div className="property-price">$4,500,000</div>
                <img src="/images/property_listing_villa_1773059556545.png" alt="Villa" className="property-image" />
              </div>
              <div className="property-content">
                <h3 className="text-h4 text-main" style={{ marginBottom: '0.25rem' }}>Beverly Hills Estate</h3>
                <p className="text-small"><i className="ri-map-pin-line"></i> 1002 Sunset Blvd, Los Angeles</p>

                <div className="property-meta">
                  <div className="meta-item"><i className="ri-layout-masonry-line"></i> 5 Beds</div>
                  <div className="meta-item"><i className="ri-drop-line"></i> 6 Baths</div>
                  <div className="meta-item"><i className="ri-ruler-line"></i> 6,200 sqft</div>
                </div>
              </div>
            </Link>

            {/* Card 2 */}
            <Link to="/property/2" className="card">
              <div className="property-image-container">
                <span className="property-badge" style={{ background: 'var(--color-accent)' }}>New Development</span>
                <div className="property-price">$2,100,000</div>
                <img src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=800"
                  alt="Apartment" className="property-image" />
              </div>
              <div className="property-content">
                <h3 className="text-h4 text-main" style={{ marginBottom: '0.25rem' }}>Skyline Penthouse</h3>
                <p className="text-small"><i className="ri-map-pin-line"></i> 450 Manhattan Ave, New York</p>

                <div className="property-meta">
                  <div className="meta-item"><i className="ri-layout-masonry-line"></i> 3 Beds</div>
                  <div className="meta-item"><i className="ri-drop-line"></i> 3.5 Baths</div>
                  <div className="meta-item"><i className="ri-ruler-line"></i> 3,100 sqft</div>
                </div>
              </div>
            </Link>

            {/* Card 3 */}
            <Link to="/property/3" className="card">
              <div className="property-image-container">
                <span className="property-badge">For Sale</span>
                <div className="property-price">$8,950,000</div>
                <img src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=800"
                  alt="Mansion" className="property-image" />
              </div>
              <div className="property-content">
                <h3 className="text-h4 text-main" style={{ marginBottom: '0.25rem' }}>Coastal Modern Villa</h3>
                <p className="text-small"><i className="ri-map-pin-line"></i> 78 Ocean Drive, Miami</p>

                <div className="property-meta">
                  <div className="meta-item"><i className="ri-layout-masonry-line"></i> 6 Beds</div>
                  <div className="meta-item"><i className="ri-drop-line"></i> 8 Baths</div>
                  <div className="meta-item"><i className="ri-ruler-line"></i> 10,500 sqft</div>
                </div>
              </div>
            </Link>
          </div>

          <div className="flex justify-center mt-8">
            <Link to="/projects" className="btn btn-outline">View All Properties</Link>
          </div>
        </div>
      </section>

      {/* Trust / Stats Section */}
      <section className="py-16 md:py-20" style={{ backgroundColor: 'var(--color-primary)', color: 'white' }}>
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6" style={{ textAlign: 'center' }}>
            <div>
              <div className="text-h2" style={{ color: 'var(--color-accent)', marginBottom: '0.5rem' }}>$2B+</div>
              <div className="text-body" style={{ color: 'rgba(255,255,255,0.7)' }}>Property Sales</div>
            </div>
            <div>
              <div className="text-h2" style={{ color: 'var(--color-accent)', marginBottom: '0.5rem' }}>15+</div>
              <div className="text-body" style={{ color: 'rgba(255,255,255,0.7)' }}>Years Experience</div>
            </div>
            <div>
              <div className="text-h2" style={{ color: 'var(--color-accent)', marginBottom: '0.5rem' }}>300+</div>
              <div className="text-body" style={{ color: 'rgba(255,255,255,0.7)' }}>Happy Clients</div>
            </div>
            <div>
              <div className="text-h2" style={{ color: 'var(--color-accent)', marginBottom: '0.5rem' }}>24/7</div>
              <div className="text-body" style={{ color: 'rgba(255,255,255,0.7)' }}>Advisory Support</div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default Home;
