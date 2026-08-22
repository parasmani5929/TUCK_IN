import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import API from '../api/axios';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await API.post('/auth/forgot-password', { email });
      setSent(true);
      toast.success('Password reset link sent to your email.');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send reset link. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <div className="auth-card glass-card" style={{ width: '100%', maxWidth: '400px', padding: '2.5rem', borderRadius: '16px', textAlign: 'center' }}>
        <h2 style={{ marginBottom: '1rem', background: 'linear-gradient(90deg, #fff, #aaa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontSize: '1.8rem' }}>Forgot Password</h2>
        
        {sent ? (
          <div style={{ marginTop: '2rem' }}>
            <p style={{ color: '#aaa', marginBottom: '2rem' }}>
              We've sent a password reset link to <strong style={{ color: '#fff' }}>{email}</strong>. Please check your inbox.
            </p>
            <Link to="/login" style={{ display: 'inline-block', padding: '0.8rem 1.5rem', borderRadius: '8px', background: 'rgba(255,255,255,0.1)', color: '#fff', textDecoration: 'none' }}>Back to Login</Link>
          </div>
        ) : (
          <>
            <p style={{ color: '#aaa', marginBottom: '2rem', fontSize: '0.9rem' }}>Enter your email address and we'll send you a link to reset your password.</p>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', textAlign: 'left' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ color: '#aaa', fontSize: '0.9rem' }}>Email</label>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  style={{ padding: '0.8rem', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', outline: 'none' }}
                />
              </div>
              <button 
                type="submit" 
                disabled={loading}
                style={{ padding: '0.8rem', borderRadius: '8px', background: 'var(--accent, #ff6b35)', color: '#fff', border: 'none', fontWeight: 'bold', cursor: loading ? 'not-allowed' : 'pointer' }}
              >
                {loading ? 'Sending...' : 'Send Reset Link'}
              </button>
            </form>
            <div style={{ marginTop: '1.5rem', fontSize: '0.9rem' }}>
              <Link to="/login" style={{ color: '#aaa', textDecoration: 'none' }}>&larr; Back to Login</Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
