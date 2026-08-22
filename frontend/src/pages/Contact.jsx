import React from 'react';
import { FiPhone, FiMail, FiMapPin, FiClock } from 'react-icons/fi';

const Contact = () => {
  return (
    <div style={{ minHeight: '80vh', padding: '4rem 2rem', color: '#fff' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <h1 style={{ fontSize: '3.5rem', marginBottom: '1rem', background: 'linear-gradient(90deg, #ff6b35, #f5a623)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Get in Touch
          </h1>
          <p style={{ fontSize: '1.2rem', color: '#aaa', maxWidth: '600px', margin: '0 auto' }}>
            We'd love to hear from you. Reach out to us for any queries, feedback, or support.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
          <div className="glass-card" style={{ padding: '2rem', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'rgba(255,107,53,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent, #ff6b35)', fontSize: '1.8rem' }}>
              <FiMapPin />
            </div>
            <div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Location</h3>
              <p style={{ color: '#aaa' }}>Kalamassery, Kerala, India</p>
            </div>
          </div>

          <div className="glass-card" style={{ padding: '2rem', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'rgba(255,107,53,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent, #ff6b35)', fontSize: '1.8rem' }}>
              <FiPhone />
            </div>
            <div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Phone</h3>
              <p style={{ color: '#aaa' }}>+91 95444 88 333</p>
            </div>
          </div>

          <div className="glass-card" style={{ padding: '2rem', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'rgba(255,107,53,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent, #ff6b35)', fontSize: '1.8rem' }}>
              <FiMail />
            </div>
            <div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Email</h3>
              <p style={{ color: '#aaa' }}>tuckin@gmail.com</p>
            </div>
          </div>

          <div className="glass-card" style={{ padding: '2rem', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'rgba(255,107,53,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent, #ff6b35)', fontSize: '1.8rem' }}>
              <FiClock />
            </div>
            <div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Working Hours</h3>
              <p style={{ color: '#aaa' }}>Mon-Sun: 9:00 AM - 11:00 PM</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
