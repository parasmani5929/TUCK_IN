import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import api from '../../api/axios';

const AdminRegister = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/admin/auth/register', formData);
      toast.success('Admin registration successful! Please login.');
      navigate('/admin/login');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="card auth-box" style={{ borderTop: '4px solid var(--warning)' }}>
        <div className="auth-header">
          <h2 style={{ color: 'var(--warning)' }}>Admin Registration</h2>
          <p>Create an admin account for TuckIN</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="form-input"
              placeholder="Admin Name"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="form-input"
              placeholder="admin@tuckin.com"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="form-input"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary btn-full"
            style={{ background: 'var(--warning)', color: '#000', marginTop: '16px' }}
          >
            {loading ? 'Registering...' : 'Register as Admin'}
          </button>
        </form>

        <div className="auth-footer">
          <span style={{ color: 'var(--text-secondary)' }}>
            Already have an account?{' '}
            <Link to="/admin/login" style={{ color: 'var(--warning)' }}>
              Login here
            </Link>
          </span>
        </div>
      </div>
    </div>
  );
};

export default AdminRegister;
