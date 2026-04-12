import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Header from '../components/Header';
import Footer from '../components/Footer';
import api from '../services/api';
import {
  buildTitle,
  buildDescription,
  buildKeywords,
  buildPropertySchema,
  buildBreadcrumbSchema,
  propertyCanonical,
  SITE_NAME,
} from '../utils/seo';
import '../property.css';
import '../style.css';

const BASE_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';

const FALLBACK_IMG = 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=1200';

const STATUS_BADGE = {
    Available: { label: 'For Sale', color: '#059669', bg: '#ecfdf5' },
    Upcoming:  { label: 'New Launch', color: '#2563eb', bg: '#eff6ff' },
    'Sold Out':{ label: 'Sold Out', color: '#dc2626', bg: '#fef2f2' },
};

const PLOT_STATUS_STYLE = {
    Available: { background: '#059669', color: '#fff' },
    Hold:      { background: '#d97706', color: '#fff' },
    Sold:      { background: '#dc2626', color: '#fff' },
};

const Property = () => {
    const { id, slug } = useParams();  // supports both /property/:id and /property/slug/:slug
    const [project, setProject] = useState(null);
    const [relatedProjects, setRelatedProjects] = useState([]);
    const [plots, setPlots] = useState([]);
    const [settings, setSettings] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [lightboxImg, setLightboxImg] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError('');

                // Fetch by slug or by id
                const projectPromise = slug
                    ? api.get(`/projects/slug/${slug}`)
                    : api.get(`/projects/${id}`);

                const [projRes, plotsRes, setRes, allProjRes] = await Promise.allSettled([
                    projectPromise,
                    slug ? Promise.resolve(null) : api.get(`/plots?projectId=${id}`),
                    api.get('/settings'),
                    api.get('/projects'),
                ]);

                let loadedProject = null;

                if (projRes.status === 'fulfilled') {
                    const d = projRes.value.data;
                    loadedProject = d?.data || d;
                    setProject(loadedProject);

                    // Fetch plots using resolved project id
                    if (slug && loadedProject?._id) {
                        try {
                            const plotsData = await api.get(`/plots?projectId=${loadedProject._id}`);
                            const d2 = plotsData.data;
                            setPlots(Array.isArray(d2) ? d2 : (d2?.data || []));
                        } catch (_) {}
                    }
                } else {
                    setError('Project not found.');
                }

                if (plotsRes.status === 'fulfilled' && plotsRes.value) {
                    const d = plotsRes.value.data;
                    setPlots(Array.isArray(d) ? d : (d?.data || []));
                }

                if (setRes.status === 'fulfilled') {
                    setSettings(setRes.value.data?.data);
                }

                // Build related projects (same type or same location, excluding self)
                if (allProjRes.status === 'fulfilled' && loadedProject) {
                    const all = allProjRes.value.data?.data || [];
                    const related = all
                        .filter(p =>
                            p._id !== loadedProject._id &&
                            (p.type === loadedProject.type ||
                             p.location?._id === loadedProject.location?._id ||
                             p.location === loadedProject.location)
                        )
                        .slice(0, 3);
                    setRelatedProjects(related);
                }
            } catch {
                setError('Failed to load project.');
            } finally {
                setLoading(false);
            }
        };
        if (id || slug) fetchData();
    }, [id, slug]);

    // ── Skeleton Loader ──────────────────────────────────────
    if (loading) {
        return (
            <>
                <Helmet>
                    <title>Loading Property… | {SITE_NAME}</title>
                </Helmet>
                <Header />
                <div style={{ minHeight: '80vh', paddingTop: '7rem' }} className="container">
                    {/* Gallery skeleton */}
                    <div className="gallery-grid" style={{ marginBottom: '2rem' }}>
                        <div style={{ background: '#f1f5f9', borderRadius: '16px', height: '340px', animation: 'pulse 1.5s ease-in-out infinite' }} />
                    </div>
                    {/* Content skeleton */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '2rem' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {[200, 140, 100, 160].map((w, i) => (
                                <div key={i} style={{ background: '#f1f5f9', borderRadius: '8px', height: '20px', width: `${w}px`, animation: 'pulse 1.5s ease-in-out infinite' }} />
                            ))}
                        </div>
                        <div style={{ background: '#f1f5f9', borderRadius: '16px', height: '260px', animation: 'pulse 1.5s ease-in-out infinite' }} />
                    </div>
                </div>
                <Footer />
                <style>{`@keyframes pulse { 0%,100%{opacity:1}50%{opacity:0.4} }`}</style>
            </>
        );
    }

    if (error || !project) {
        return (
            <>
                <Helmet>
                    <title>Property Not Found | {SITE_NAME}</title>
                    <meta name="robots" content="noindex" />
                </Helmet>
                <Header />
                <div style={{ minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '1rem', color: '#64748b', paddingTop: '6rem' }}>
                    <i className="ri-building-line" style={{ fontSize: '4rem', opacity: 0.3 }} />
                    <p style={{ fontWeight: 600 }}>{error || 'Project not found.'}</p>
                    <Link to="/projects" className="btn btn-outline" style={{ marginTop: '0.5rem' }}>← Browse Projects</Link>
                </div>
                <Footer />
            </>
        );
    }

    // ── Derived Data ─────────────────────────────────────────
    const coverUrl = project.coverImage ? `${BASE_URL}/api${project.coverImage}` : FALLBACK_IMG;
    const galleryImages = (project.gallery || []).map(g => `${BASE_URL}/api${g}`);
    const badge = STATUS_BADGE[project.status] || { label: project.status, color: '#64748b', bg: '#f1f5f9' };
    const allImgs = [coverUrl, ...galleryImages];
    const locationName = project.location?.name || 'India';
    const canonical = project.slug ? propertyCanonical(project.slug) : `https://srpropertyadvisor.in/property/${project._id}`;

    // SEO data
    const pageTitle = buildTitle(project);
    const pageDesc  = buildDescription(project);
    const keywords  = buildKeywords(project);
    const propSchema = buildPropertySchema(project);
    const breadcrumbSchema = buildBreadcrumbSchema(project);

    return (
        <>
            {/* ── Dynamic SEO Head ── */}
            <Helmet>
                <title>{pageTitle}</title>
                <meta name="description" content={pageDesc} />
                <meta name="keywords" content={keywords} />
                <link rel="canonical" href={canonical} />

                {/* Open Graph */}
                <meta property="og:type" content="website" />
                <meta property="og:title" content={pageTitle} />
                <meta property="og:description" content={pageDesc} />
                <meta property="og:image" content={coverUrl} />
                <meta property="og:url" content={canonical} />
                <meta property="og:site_name" content={SITE_NAME} />

                {/* Twitter Card */}
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content={pageTitle} />
                <meta name="twitter:description" content={pageDesc} />
                <meta name="twitter:image" content={coverUrl} />

                {/* JSON-LD: Property schema */}
                {propSchema && (
                    <script type="application/ld+json">
                        {JSON.stringify(propSchema)}
                    </script>
                )}

                {/* JSON-LD: Breadcrumb schema */}
                <script type="application/ld+json">
                    {JSON.stringify(breadcrumbSchema)}
                </script>
            </Helmet>

            <Header />

            {/* ── Lightbox ── */}
            {lightboxImg && (
                <div
                    onClick={() => setLightboxImg(null)}
                    style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.88)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', cursor: 'zoom-out' }}
                >
                    <button
                        onClick={() => setLightboxImg(null)}
                        style={{ position: 'absolute', top: '1rem', right: '1.5rem', background: 'none', border: 'none', color: '#fff', fontSize: '2rem', cursor: 'pointer', lineHeight: 1 }}
                    >
                        <i className="ri-close-line" />
                    </button>
                    <img
                        src={lightboxImg}
                        alt={`${project.title} in ${locationName} – full view`}
                        onClick={e => e.stopPropagation()}
                        style={{ maxWidth: '92vw', maxHeight: '90vh', borderRadius: '12px', objectFit: 'contain', boxShadow: '0 24px 64px rgba(0,0,0,0.5)' }}
                        loading="lazy"
                    />
                </div>
            )}

            <div className="container">

                {/* ── Breadcrumb Navigation ── */}
                <nav aria-label="breadcrumb" style={{ paddingTop: '5.5rem', paddingBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.82rem', color: '#64748b', flexWrap: 'wrap' }}>
                    <Link to="/" style={{ color: '#2563eb', textDecoration: 'none', fontWeight: 500 }}>Home</Link>
                    <i className="ri-arrow-right-s-line" style={{ color: '#cbd5e1' }} />
                    <Link to="/projects" style={{ color: '#2563eb', textDecoration: 'none', fontWeight: 500 }}>Properties</Link>
                    <i className="ri-arrow-right-s-line" style={{ color: '#cbd5e1' }} />
                    <Link
                        to={`/projects?location=${encodeURIComponent(locationName)}`}
                        style={{ color: '#2563eb', textDecoration: 'none', fontWeight: 500 }}
                    >
                        {locationName}
                    </Link>
                    <i className="ri-arrow-right-s-line" style={{ color: '#cbd5e1' }} />
                    <span style={{ color: '#94a3b8', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{project.title}</span>
                </nav>

                {/* ── Gallery Grid ── */}
                <div className="gallery-grid">
                    {/* Main image */}
                    <div className="gallery-main" style={{ cursor: 'zoom-in' }} onClick={() => setLightboxImg(allImgs[0])}>
                        <img
                            src={allImgs[0]}
                            alt={`${project.title} – ${project.type} in ${locationName} exterior view`}
                            className="gallery-img"
                            loading="eager"
                            fetchpriority="high"
                        />
                        {allImgs.length > 1 && (
                            <div style={{ position: 'absolute', bottom: '1rem', right: '1rem', background: 'rgba(15,23,42,0.75)', color: '#fff', padding: '0.35rem 0.875rem', borderRadius: '999px', fontSize: '0.78rem', fontWeight: 600, backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <i className="ri-image-line" /> {allImgs.length} Photos
                            </div>
                        )}
                    </div>

                    {/* Side images */}
                    {[1, 2].map(i => (
                        <div key={i} className="gallery-side" style={{ cursor: allImgs[i] ? 'zoom-in' : 'default' }} onClick={() => allImgs[i] && setLightboxImg(allImgs[i])}>
                            {allImgs[i] ? (
                                <img
                                    src={allImgs[i]}
                                    alt={`${project.title} – ${project.type} in ${locationName} gallery photo ${i}`}
                                    className="gallery-img"
                                    loading="lazy"
                                />
                            ) : (
                                <div style={{ width: '100%', height: '100%', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <i className="ri-image-line" style={{ fontSize: '2.5rem', color: '#cbd5e1' }} />
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* ── Content Layout ── */}
                <div className="property-layout">
                    {/* Main Details */}
                    <main>
                        {/* H1: Property title */}
                        <div className="detail-section">
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '0.75rem' }}>
                                <span style={{ padding: '0.3rem 0.875rem', borderRadius: '999px', fontSize: '0.78rem', fontWeight: 700, background: badge.bg, color: badge.color }}>
                                    {badge.label}
                                </span>
                                {project.price && (
                                    <span className="text-h3 text-main">{project.price}</span>
                                )}
                            </div>
                            <h1 className="text-h2 text-main mb-2">{project.title}</h1>
                            {/* H2: Location + highlights */}
                            <h2 style={{ fontSize: '1rem', fontWeight: 500, color: '#64748b', display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.5rem', marginBottom: 0 }}>
                                <i className="ri-map-pin-line" style={{ color: '#2563eb' }} />
                                {locationName} · {project.type}
                            </h2>
                        </div>

                        {/* H3: Description section */}
                        {project.description && (
                            <div className="detail-section">
                                <h3 className="text-h3 text-main mb-4">About This Property</h3>
                                <p className="text-body" style={{ whiteSpace: 'pre-line' }}>{project.description}</p>
                            </div>
                        )}

                        {/* H3: Gallery section */}
                        {galleryImages.length > 2 && (
                            <div className="detail-section">
                                <h3 className="text-h3 text-main mb-4">Gallery</h3>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '0.75rem' }}>
                                    {galleryImages.map((img, idx) => (
                                        <div
                                            key={idx}
                                            onClick={() => setLightboxImg(img)}
                                            style={{ height: '110px', borderRadius: '10px', overflow: 'hidden', cursor: 'zoom-in', border: '1px solid #e2e8f0' }}
                                        >
                                            <img
                                                src={img}
                                                alt={`${project.title} – ${locationName} property photo ${idx + 1}`}
                                                style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s' }}
                                                loading="lazy"
                                                onMouseOver={e => e.currentTarget.style.transform = 'scale(1.06)'}
                                                onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* H3: Plot Inventory */}
                        {plots.length > 0 && (
                            <div className="detail-section">
                                <h3 className="text-h3 text-main mb-4">Available Units / Plots</h3>
                                <p className="text-body" style={{ marginBottom: '1rem' }}>
                                    {plots.filter(p => p.status === 'Available').length} of {plots.length} units available.
                                </p>
                                <div style={{ overflowX: 'auto' }}>
                                    <table className="plots-table">
                                        <thead>
                                            <tr>
                                                <th>Plot No.</th>
                                                <th>Size (sqft)</th>
                                                <th>Price (₹)</th>
                                                <th>Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {plots.map(plot => (
                                                <tr key={plot._id}>
                                                    <td style={{ fontWeight: 600 }}>{plot.plotNumber}</td>
                                                    <td>{plot.sizeSqFt?.toLocaleString()}</td>
                                                    <td>{plot.price ? `₹${Number(plot.price).toLocaleString()}` : '—'}</td>
                                                    <td>
                                                        <span style={{
                                                            padding: '0.25rem 0.75rem', borderRadius: '999px',
                                                            fontSize: '0.75rem', fontWeight: 700,
                                                            ...(PLOT_STATUS_STYLE[plot.status] || { background: '#f1f5f9', color: '#64748b' })
                                                        }}>
                                                            {plot.status}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {/* H3: Map */}
                        {project.mapEmbedLink && (
                            <div className="detail-section">
                                <h3 className="text-h3 text-main mb-4">Location Map</h3>
                                {String(project.mapEmbedLink).includes('http') ? (
                                    <div style={{ width: '100%', height: '380px', borderRadius: '16px', overflow: 'hidden', border: '1px solid #e2e8f0' }}>
                                        <iframe
                                            src={project.mapEmbedLink}
                                            title={`Map location of ${project.title} in ${locationName}`}
                                            width="100%"
                                            height="100%"
                                            style={{ border: 'none' }}
                                            allowFullScreen
                                            loading="lazy"
                                            referrerPolicy="no-referrer-when-downgrade"
                                        />
                                    </div>
                                ) : (
                                    <div style={{ padding: '2rem', background: '#f8fafc', borderRadius: '16px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                        <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#eff6ff', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', flexShrink: 0 }}>
                                            <i className="ri-map-pin-2-line" />
                                        </div>
                                        <div>
                                            <div style={{ fontWeight: 600, color: '#0f172a', fontSize: '1.1rem' }}>{project.mapEmbedLink}</div>
                                            <div style={{ color: '#64748b', fontSize: '0.9rem', marginTop: '0.2rem' }}>Property Location Details</div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* ── Internal Links: Related Properties ── */}
                        {relatedProjects.length > 0 && (
                            <div className="detail-section">
                                <h3 className="text-h3 text-main mb-4" style={{ marginBottom: '1rem' }}>
                                    More Properties in {locationName}
                                </h3>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1rem' }}>
                                    {relatedProjects.map(rp => {
                                        const rpImg = rp.coverImage ? `${BASE_URL}/api${rp.coverImage}` : FALLBACK_IMG;
                                        const rpHref = rp.slug ? `/property/slug/${rp.slug}` : `/property/${rp._id}`;
                                        return (
                                            <Link
                                                key={rp._id}
                                                to={rpHref}
                                                className="card"
                                                style={{ display: 'block', textDecoration: 'none' }}
                                                title={`${rp.type} in ${rp.location?.name || locationName} – ${rp.title}`}
                                            >
                                                <img
                                                    src={rpImg}
                                                    alt={`${rp.title} – ${rp.type} in ${rp.location?.name || locationName}`}
                                                    style={{ width: '100%', height: '130px', objectFit: 'cover', borderRadius: '12px 12px 0 0' }}
                                                    loading="lazy"
                                                />
                                                <div style={{ padding: '0.875rem' }}>
                                                    <p style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.9rem', marginBottom: '0.2rem' }}>{rp.title}</p>
                                                    <p style={{ fontSize: '0.8rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                        <i className="ri-map-pin-line" style={{ color: '#3b82f6' }} />
                                                        {rp.location?.name || locationName}
                                                        {rp.price && <> · <span style={{ color: '#059669', fontWeight: 600 }}>{rp.price}</span></>}
                                                    </p>
                                                </div>
                                            </Link>
                                        );
                                    })}
                                </div>
                                <Link
                                    to={`/projects?location=${encodeURIComponent(locationName)}`}
                                    style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: '#2563eb', fontWeight: 600, fontSize: '0.9rem', marginTop: '1rem', textDecoration: 'none' }}
                                >
                                    Explore all properties in {locationName} <i className="ri-arrow-right-line" />
                                </Link>
                            </div>
                        )}
                    </main>

                    {/* Sidebar */}
                    <aside>
                        <div className="contact-sidebar">
                            <div className="card" style={{ padding: '1.75rem', textAlign: 'center', marginBottom: '1.25rem' }}>
                                <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', fontSize: '1.75rem', color: '#2563eb' }}>
                                    <i className="ri-home-smile-line" />
                                </div>
                                <h3 className="text-h4 text-main">Interested in this property?</h3>
                                <p className="text-small" style={{ marginTop: '0.35rem', marginBottom: '1.25rem' }}>Our advisors will get back to you within 24 hours.</p>

                                <Link to="/contact" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                                    <i className="ri-mail-send-line" /> Request Details
                                </Link>

                                <a
                                    href={`https://wa.me/${(settings?.whatsapp || '919876543210').replace(/\D/g, '')}?text=${encodeURIComponent(`Hi, I'm interested in the property: ${project.title}`)}`}
                                    target="_blank"
                                    rel="noreferrer noopener"
                                    className="btn-whatsapp"
                                    style={{ padding: '0.75rem 1.5rem', borderRadius: '0.5rem', fontWeight: 600, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', textDecoration: 'none', marginTop: '0.75rem' }}
                                    aria-label={`Contact about ${project.title} on WhatsApp`}
                                >
                                    <i className="ri-whatsapp-line" style={{ fontSize: '1.25rem' }} /> Contact on WhatsApp
                                </a>

                                <div style={{ marginTop: '1.25rem', paddingTop: '1.25rem', borderTop: '1px solid #f1f5f9', fontSize: '0.85rem', color: '#64748b' }}>
                                    <i className="ri-map-pin-line" style={{ color: '#2563eb' }} /> {locationName}
                                    &nbsp;·&nbsp;
                                    <i className="ri-building-line" style={{ color: '#2563eb' }} /> {project.type}
                                </div>
                            </div>

                            {project.brochureUrl && (
                                <a
                                    href={`${BASE_URL}/api${project.brochureUrl}`}
                                    download
                                    className="brochure-card"
                                    style={{ textDecoration: 'none' }}
                                    aria-label={`Download brochure for ${project.title}`}
                                >
                                    <div style={{ width: '48px', height: '48px', background: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', flexShrink: 0 }}>
                                        <i className="ri-file-download-line" style={{ color: '#2563eb', fontSize: '1.25rem' }} />
                                    </div>
                                    <div>
                                        <div className="text-h4 text-main" style={{ fontSize: '1rem' }}>Download Brochure</div>
                                        <div className="text-small">PDF Document</div>
                                    </div>
                                </a>
                            )}

                            <Link to="/projects" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#2563eb', fontWeight: 600, fontSize: '0.9rem', marginTop: '1.25rem', textDecoration: 'none' }}>
                                <i className="ri-arrow-left-line" /> Back to All Projects
                            </Link>
                        </div>
                    </aside>
                </div>
            </div>

            <style>{`
                @keyframes spin { to { transform: rotate(360deg); } }
                @keyframes pulse { 0%,100%{opacity:1}50%{opacity:0.4} }
                .gallery-main { position: relative; }
            `}</style>

            <Footer />
        </>
    );
};

export default Property;
