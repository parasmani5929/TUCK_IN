import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { FiX, FiMinus, FiPlus, FiShoppingBag, FiArrowRight } from 'react-icons/fi';
import toast from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '/api' : 'http://localhost:5000/api');
const IMG_URL = API_URL.replace('/api', '');

export default function CartModal({ isOpen, onClose }) {
  const { cart, removeFromCart, updateQuantity, totalPrice } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (!user) {
      toast.error('Please login to checkout');
      onClose();
      navigate('/login');
      return;
    }
    onClose();
    navigate('/checkout');
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      display: 'flex', justifyContent: 'flex-end',
      background: 'rgba(0,0,0,0.7)',
    }}>
      <div style={{ position: 'absolute', inset: 0 }} onClick={onClose} />

      <div style={{
        position: 'relative', width: '100%', maxWidth: '400px',
        background: 'var(--bg-primary)', height: '100%',
        display: 'flex', flexDirection: 'column',
        boxShadow: 'var(--shadow-md)'
      }}>
        <div style={{
          padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          borderBottom: '1px solid var(--border)', background: 'var(--bg-secondary)'
        }}>
          <h2 style={{ fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
            <FiShoppingBag color="var(--accent)" /> Your Order
          </h2>
          <button 
            onClick={onClose}
            className="btn btn-outline"
            style={{ width: '32px', height: '32px', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none' }}
          >
            <FiX />
          </button>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
          {cart.length === 0 ? (
            <div style={{ textAlign: 'center', marginTop: '60px' }}>
              <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🛒</div>
              <h3 style={{ color: 'var(--text-secondary)' }}>Your cart is empty</h3>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {cart.map((item) => (
                <div key={item._id} style={{ 
                  display: 'flex', gap: '12px', background: 'var(--bg-secondary)',
                  padding: '12px', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)'
                }}>
                  <div style={{ width: '60px', height: '60px', borderRadius: '4px', overflow: 'hidden', background: 'var(--bg-tertiary)' }}>
                    <img 
                      src={item.image ? `${IMG_URL}/${item.image}` : '/placeholder.png'} 
                      alt={item.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </div>
                  
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <h4 style={{ margin: 0, fontSize: '1rem' }}>{item.name}</h4>
                      <button 
                        onClick={() => removeFromCart(item._id)}
                        style={{ background: 'none', border: 'none', color: 'var(--error)', cursor: 'pointer' }}
                      ><FiX /></button>
                    </div>
                    
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ color: 'var(--accent)', fontWeight: 'bold' }}>₹{item.price * item.quantity}</span>
                      
                      <div style={{ display: 'flex', alignItems: 'center', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-sm)' }}>
                        <button 
                          style={{ background: 'none', border: 'none', color: 'var(--text-primary)', width: '24px', height: '24px', cursor: 'pointer' }}
                          onClick={() => updateQuantity(item._id, item.quantity - 1)}
                        ><FiMinus size={12} /></button>
                        <span style={{ width: '24px', textAlign: 'center', fontSize: '0.85rem', fontWeight: 'bold' }}>{item.quantity}</span>
                        <button 
                          style={{ background: 'none', border: 'none', color: 'var(--text-primary)', width: '24px', height: '24px', cursor: 'pointer' }}
                          onClick={() => updateQuantity(item._id, item.quantity + 1)}
                        ><FiPlus size={12} /></button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {cart.length > 0 && (
          <div style={{ padding: '20px', borderTop: '1px solid var(--border)', background: 'var(--bg-secondary)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
              <span>Subtotal</span>
              <span>₹{totalPrice}</span>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', fontSize: '1.2rem', fontWeight: 'bold' }}>
              <span>Total</span>
              <span style={{ color: 'var(--accent)' }}>₹{totalPrice}</span>
            </div>

            <button className="btn btn-primary btn-full btn-lg" onClick={handleCheckout}>
              Checkout <FiArrowRight />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
