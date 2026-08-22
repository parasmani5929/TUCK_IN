import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import API from '../api/axios';
import toast from 'react-hot-toast';
import { FiCreditCard, FiTruck } from 'react-icons/fi';

const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace('/api', '');

export default function Checkout() {
  const { cart, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState('');
  const [review, setReview] = useState('');
  const [loading, setLoading] = useState(false);

  const handlePlaceOrder = async () => {
    if (!paymentMethod) { toast.error('Please select a payment method.'); return; }
    if (cart.length === 0) { toast.error('Your cart is empty!'); return; }

    setLoading(true);
    try {
      const res = await API.post('/orders', {
        cart: cart.map((item) => ({ food_id: item.food_id, quantity: item.quantity })),
        payment_method: paymentMethod,
        review,
      });
      clearCart();
      if (paymentMethod === 'upi') {
        navigate(`/payment?order_id=${res.data.order_id}&amount=${res.data.total_price}`);
      } else {
        navigate(`/order-success?order_id=${res.data.order_id}`);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Order failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page" style={{ maxWidth: 700 }}>
      <h1 className="section-title">🛒 Checkout</h1>

      {/* Order Summary */}
      <div className="glass-card" style={{ padding: 24, marginBottom: 20 }}>
        <h3 style={{ marginBottom: 16, color: 'var(--text-secondary)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          Order Summary
        </h3>
        {cart.map((item) => (
          <div key={item.food_id} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <img
                src={`${API_URL}/${item.image}`}
                alt={item.name}
                style={{ width: 44, height: 44, objectFit: 'cover', borderRadius: 8 }}
                onError={(e) => { e.target.src = 'https://placehold.co/44x44/1a1a2e/ff6b35?text=F'; }}
              />
              <div>
                <div style={{ fontWeight: 600 }}>{item.name}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>× {item.quantity}</div>
              </div>
            </div>
            <div style={{ fontWeight: 700, color: 'var(--accent)' }}>₹{(item.price * item.quantity).toFixed(0)}</div>
          </div>
        ))}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 16, fontSize: '1.1rem', fontWeight: 700 }}>
          <span>Total</span>
          <span style={{ color: 'var(--accent)' }}>₹{totalPrice.toFixed(0)}</span>
        </div>
      </div>

      {/* Payment Method */}
      <div className="glass-card" style={{ padding: 24, marginBottom: 20 }}>
        <h3 style={{ marginBottom: 16 }}>Select Payment Method</h3>
        <div style={{ display: 'flex', gap: 12 }}>
          <button
            onClick={() => setPaymentMethod('upi')}
            className={paymentMethod === 'upi' ? 'btn btn-primary' : 'btn btn-outline'}
            style={{ flex: 1 }}
          >
            <FiCreditCard /> UPI / QR Code
          </button>
          <button
            onClick={() => setPaymentMethod('cod')}
            className={paymentMethod === 'cod' ? 'btn btn-primary' : 'btn btn-outline'}
            style={{ flex: 1 }}
          >
            <FiTruck /> Cash on Delivery
          </button>
        </div>
      </div>

      {/* Optional Review */}
      <div className="glass-card" style={{ padding: 24, marginBottom: 24 }}>
        <h3 style={{ marginBottom: 12 }}>Leave a Review <span style={{ color: 'var(--text-muted)', fontWeight: 400, fontSize: '0.85rem' }}>(optional)</span></h3>
        <textarea
          className="form-input"
          rows={3}
          placeholder="How was your experience? Share your thoughts..."
          value={review}
          onChange={(e) => setReview(e.target.value)}
        />
      </div>

      <button
        className="btn btn-primary btn-full btn-lg"
        onClick={handlePlaceOrder}
        disabled={loading || !paymentMethod}
      >
        {loading ? 'Placing Order...' : 'Place Order →'}
      </button>
    </div>
  );
}
