import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';

const OrderSuccess = () => {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('order_id') || 'Unknown';

  return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <div className="glass-card" style={{ width: '100%', maxWidth: '500px', padding: '3rem 2rem', borderRadius: '24px', textAlign: 'center' }}>
        <div style={{ width: '100px', height: '100px', borderRadius: '50%', background: 'rgba(76, 175, 80, 0.1)', color: '#4CAF50', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem', margin: '0 auto 2rem' }}>
          ✓
        </div>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: '#fff' }}>Order Placed!</h1>
        <p style={{ fontSize: '1.1rem', color: '#aaa', marginBottom: '0.5rem' }}>
          Your order has been successfully placed.
        </p>
        <p style={{ fontSize: '1.1rem', color: 'var(--accent, #ff6b35)', fontWeight: 'bold', marginBottom: '2rem' }}>
          Order ID: #{orderId}
        </p>
        
        <div style={{ background: 'rgba(255,255,255,0.05)', padding: '1.5rem', borderRadius: '12px', marginBottom: '2rem' }}>
          <h3 style={{ color: '#fff', marginBottom: '0.5rem' }}>Cash on Delivery</h3>
          <p style={{ color: '#aaa', fontSize: '0.9rem' }}>Pay when your order arrives at your doorstep.</p>
        </div>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/" style={{ padding: '0.8rem 1.5rem', borderRadius: '8px', background: 'rgba(255,255,255,0.1)', color: '#fff', textDecoration: 'none', fontWeight: 'bold' }}>
            Back to Home
          </Link>
          <Link to={`/track-order?id=${orderId}`} style={{ padding: '0.8rem 1.5rem', borderRadius: '8px', background: 'var(--accent, #ff6b35)', color: '#fff', textDecoration: 'none', fontWeight: 'bold' }}>
            Track Order
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;
