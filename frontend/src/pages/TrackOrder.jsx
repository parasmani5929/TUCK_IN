import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import API from '../api/axios';

const stages = ['Preparing', 'On the Way', 'Out for Delivery', 'Delivered'];

const stageIcons = ['👨‍🍳', '🛵', '📦', '✅'];

const TrackOrder = () => {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await API.get('/orders/track');
        setOrder(res.data);
      } catch (error) {
        if (error.response?.status === 404) {
          setOrder(null);
        } else {
          toast.error('Failed to fetch order details.');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, []);

  if (loading) {
    return (
      <div className="spinner-wrapper" style={{ minHeight: '60vh' }}>
        <div className="spinner" />
      </div>
    );
  }

  if (!order) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
        <div className="glass-card" style={{ padding: '3rem', textAlign: 'center', maxWidth: 420 }}>
          <div style={{ fontSize: '3rem', marginBottom: 16 }}>🛒</div>
          <h2 style={{ marginBottom: 12 }}>No Orders Yet</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: 24 }}>
            You haven't placed any orders yet.
          </p>
          <Link to="/" className="btn btn-primary">Browse Menu</Link>
        </div>
      </div>
    );
  }

  const currentStageIndex = stages.findIndex(
    (s) => s.toLowerCase() === (order.status || '').toLowerCase()
  );
  const validIndex = currentStageIndex === -1 ? 0 : currentStageIndex;

  return (
    <div className="page" style={{ maxWidth: 800 }}>
      <h1 className="section-title">📦 Track Your Order</h1>

      <div className="glass-card" style={{ padding: '2rem', marginBottom: 20 }}>
        {/* Order meta */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12, marginBottom: '2rem' }}>
          <div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: 4 }}>ORDER ID</p>
            <h3 style={{ fontFamily: 'monospace', color: 'var(--text-primary)' }}>
              #{String(order._id).slice(-10).toUpperCase()}
            </h3>
          </div>
          <div style={{ textAlign: 'right' }}>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: 4 }}>TOTAL</p>
            <h3 style={{ color: 'var(--accent)' }}>₹{order.total_price}</h3>
          </div>
          <span style={{
            padding: '6px 18px', borderRadius: 20,
            background: 'rgba(255,107,53,0.15)', color: 'var(--accent)',
            fontWeight: 700, fontSize: '0.9rem',
            border: '1px solid rgba(255,107,53,0.3)'
          }}>
            {order.status}
          </span>
        </div>

        {/* Progress bar */}
        <div style={{ position: 'relative', marginBottom: '2.5rem' }}>
          <div style={{
            position: 'absolute', top: 24, left: '12.5%', right: '12.5%',
            height: 4, background: 'rgba(255,255,255,0.08)', borderRadius: 2
          }} />
          <div style={{
            position: 'absolute', top: 24, left: '12.5%',
            width: `${(validIndex / (stages.length - 1)) * 75}%`,
            height: 4, background: 'var(--accent)', borderRadius: 2,
            transition: 'width 0.6s ease',
          }} />

          <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative', zIndex: 2 }}>
            {stages.map((stage, index) => {
              const isCompleted = index <= validIndex;
              const isActive = index === validIndex;
              return (
                <div key={stage} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '25%' }}>
                  <div style={{
                    width: 48, height: 48, borderRadius: '50%',
                    background: isCompleted ? 'var(--accent)' : 'rgba(255,255,255,0.05)',
                    border: `3px solid ${isCompleted ? 'var(--accent)' : 'rgba(255,255,255,0.1)'}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '1.3rem', marginBottom: 10,
                    boxShadow: isActive ? '0 0 20px rgba(255,107,53,0.5)' : 'none',
                    transition: 'all 0.3s',
                    animation: isActive ? 'pulse 2s infinite' : 'none',
                  }}>
                    {stageIcons[index]}
                  </div>
                  <span style={{
                    fontSize: '0.78rem', textAlign: 'center', fontWeight: isActive ? 700 : 400,
                    color: isCompleted ? 'var(--text-primary)' : 'var(--text-muted)',
                  }}>
                    {stage}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Items */}
        {order.items && order.items.length > 0 && (
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '1.5rem' }}>
            <h4 style={{ marginBottom: 12, color: 'var(--text-secondary)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Items Ordered
            </h4>
            {order.items.map((item, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.04)', fontSize: '0.9rem' }}>
                <span>{item.name || `Item ${i + 1}`} × {item.quantity}</span>
                <span style={{ color: 'var(--accent)' }}>₹{item.price * item.quantity}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        <Link to="/" className="btn btn-ghost">← Back to Menu</Link>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(255,107,53,0.4); }
          50% { box-shadow: 0 0 0 12px rgba(255,107,53,0); }
        }
      `}</style>
    </div>
  );
};

export default TrackOrder;
