import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import api from '../services/api';

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '', interest: 'general' });
  const [submitted, setSubmitted] = useState(false);
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

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    const whatsappMsg = `Hello SR Property Advisors!%0A%0AName: ${formData.name}%0AEmail: ${formData.email}%0APhone: ${formData.phone}%0AInterest: ${formData.interest}%0A%0AMessage: ${formData.message}`;
    const waNumber = settings?.whatsapp?.replace(/\D/g, '') || import.meta.env.VITE_WHATSAPP_NUMBER?.replace(/\s/g, '') || '919876543210';
    window.open(`https://wa.me/${waNumber}?text=${whatsappMsg}`, '_blank');
    setSubmitted(true);
  };

  const contacts = [
    { icon: 'ri-phone-line', label: 'Phone', value: settings?.phone || '+91 82219 10113', href: `tel:${settings?.phone?.replace(/\D/g, '') || '+918221910113'}` },
    { icon: 'ri-mail-line', label: 'Email', value: settings?.email || 'info@srpropertyadvisor.in', href: `mailto:${settings?.email || 'info@srpropertyadvisor.in'}` },
    { icon: 'ri-map-pin-2-line', label: 'Office', value: settings?.address || 'Mumbai, Maharashtra, India', href: '#' },
    { icon: 'ri-whatsapp-line', label: 'WhatsApp', value: settings?.whatsapp || '+91 82219 10113', href: `https://wa.me/${settings?.whatsapp?.replace(/\D/g, '') || '918221910113'}` },
  ];

  const inputStyle = {
    width: '100%', padding: '0.875rem 1rem', border: '1px solid #e2e8f0',
    borderRadius: '12px', fontFamily: 'inherit', fontSize: '1rem', outline: 'none',
    transition: 'border-color 0.15s', background: 'white',
  };

  return (
    <>
      <Header />

      {/* Hero */}
      <section style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 100%)', padding: '10rem 0 6rem', color: 'white' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <span style={{ color: '#60a5fa', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '0.9rem' }}>Get In Touch</span>
          <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 700, margin: '1rem 0', lineHeight: 1.1 }}>
            Let's Find Your<br/>Perfect Property
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '1.125rem', maxWidth: '550px', margin: '0 auto' }}>
            Our expert advisors are ready to guide you through your real estate journey.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section style={{ padding: '6rem 0', background: '#f8fafc' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem', maxWidth: '1100px', margin: '0 auto' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>

              {/* Contact Info */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <h2 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.5rem' }}>Contact Information</h2>
                {contacts.map((c, i) => (
                  <a key={i} href={c.href} target={c.href.startsWith('http') ? '_blank' : undefined} rel="noreferrer"
                    style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.25rem', background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', textDecoration: 'none', color: 'inherit', transition: 'box-shadow 0.2s' }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#eff6ff', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', flexShrink: 0 }}>
                      <i className={c.icon}></i>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '0.2rem', fontWeight: 500 }}>{c.label}</div>
                      <div style={{ fontWeight: 600, color: '#0f172a' }}>{c.value}</div>
                    </div>
                  </a>
                ))}

                {/* Office hours */}
                <div style={{ padding: '1.5rem', background: '#0f172a', borderRadius: '16px', color: 'white' }}>
                  <h3 style={{ fontWeight: 600, marginBottom: '1rem' }}><i className="ri-time-line" style={{ marginRight: '0.5rem' }}></i>Working Hours</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', color: 'rgba(255,255,255,0.7)', fontSize: '0.95rem' }}>
                    <div style={{ whiteSpace: 'pre-line', lineHeight: 1.6 }}>{settings?.workingHours || 'Mon – Sat: 9:00 AM – 7:00 PM\nSunday: By Appointment'}</div>
                  </div>
                </div>
              </div>

              {/* Contact Form */}
              <div style={{ background: 'white', borderRadius: '24px', padding: '2.5rem', border: '1px solid #e2e8f0', boxShadow: '0 4px 24px rgba(0,0,0,0.04)' }}>
                {submitted ? (
                  <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
                    <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎉</div>
                    <h3 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.75rem' }}>Message Sent!</h3>
                    <p style={{ color: '#64748b' }}>We've received your inquiry and will reach out within 24 hours.</p>
                    <button onClick={() => setSubmitted(false)} style={{ marginTop: '1.5rem', padding: '0.75rem 1.5rem', background: '#2563eb', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 600, cursor: 'pointer' }}>Send Another</button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.5rem' }}>Send Us a Message</h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
                      <div>
                        <label style={{ fontSize: '0.875rem', fontWeight: 600, color: '#374151', marginBottom: '0.4rem', display: 'block' }}>Full Name *</label>
                        <input name="name" required value={formData.name} onChange={handleChange} placeholder="Your name" style={inputStyle} />
                      </div>
                      <div>
                        <label style={{ fontSize: '0.875rem', fontWeight: 600, color: '#374151', marginBottom: '0.4rem', display: 'block' }}>Phone Number</label>
                        <input name="phone" value={formData.phone} onChange={handleChange} placeholder="+91 XXXXX XXXXX" style={inputStyle} />
                      </div>
                    </div>
                    <div>
                      <label style={{ fontSize: '0.875rem', fontWeight: 600, color: '#374151', marginBottom: '0.4rem', display: 'block' }}>Email Address *</label>
                      <input name="email" type="email" required value={formData.email} onChange={handleChange} placeholder="your@email.com" style={inputStyle} />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.875rem', fontWeight: 600, color: '#374151', marginBottom: '0.4rem', display: 'block' }}>I'm Interested In</label>
                      <select name="interest" value={formData.interest} onChange={handleChange} style={inputStyle}>
                        <option value="general">General Inquiry</option>
                        <option value="buying">Buying a Property</option>
                        <option value="selling">Selling a Property</option>
                        <option value="investment">Investment Advisory</option>
                        <option value="rental">Rental Management</option>
                      </select>
                    </div>
                    <div>
                      <label style={{ fontSize: '0.875rem', fontWeight: 600, color: '#374151', marginBottom: '0.4rem', display: 'block' }}>Message *</label>
                      <textarea name="message" required value={formData.message} onChange={handleChange} rows={5} placeholder="Tell us about your property requirements..." style={{ ...inputStyle, resize: 'vertical' }} />
                    </div>
                    <button type="submit" className="btn btn-primary" style={{ width: '100%', fontSize: '1rem', padding: '1rem', borderRadius: '12px', fontWeight: 700 }}>
                      <i className="ri-send-plane-line" style={{ marginRight: '0.5rem' }}></i>
                      Send via WhatsApp
                    </button>
                    <p style={{ fontSize: '0.8rem', color: '#94a3b8', textAlign: 'center' }}>Your message will be sent securely via WhatsApp for a faster response.</p>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default Contact;
