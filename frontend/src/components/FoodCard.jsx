import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';
import toast from 'react-hot-toast';
import { FiStar, FiPlus, FiMinus, FiShoppingBag } from 'react-icons/fi';

const API_URL = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '/api' : 'http://localhost:5000/api');
const IMG_URL = API_URL.replace('/api', '');

export default function FoodCard({ food }) {
  const { addToCart } = useCart();
  const { user } = useAuth();
  const [qty, setQty] = useState(1);
  const [rating, setRating] = useState(0);

  const imageUrl = food.image ? `${IMG_URL}/${food.image}` : '/placeholder.png';

  const handleAddToCart = () => {
    addToCart(food, qty);
    setQty(1);
  };

  const submitRating = async (val) => {
    if (!user) {
      toast.error('Please login to rate');
      return;
    }
    try {
      await API.post('/food/rate', { food_id: food._id, rating: val });
      setRating(val);
      toast.success('Thanks for your rating!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit rating');
    }
  };

  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', padding: 0, overflow: 'hidden' }}>
      <div style={{ position: 'relative', width: '100%', height: '200px', background: 'var(--bg-tertiary)' }}>
        <img 
          src={imageUrl} 
          alt={food.name} 
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
        <div className="badge badge-default" style={{ position: 'absolute', top: 10, left: 10 }}>
          {food.category}
        </div>
      </div>

      <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', flex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
          <h3 style={{ margin: 0 }}>{food.name}</h3>
          <span style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--accent)' }}>₹{food.price}</span>
        </div>
        
        <p style={{ fontSize: '0.9rem', marginBottom: '16px', flex: 1 }}>{food.description}</p>

        <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 16 }}>
          {[1, 2, 3, 4, 5].map((star) => (
            <FiStar 
              key={star}
              size={16}
              color={(rating || food.avgRating) >= star ? '#ffd700' : 'var(--text-muted)'}
              fill={(rating || food.avgRating) >= star ? '#ffd700' : 'none'}
              style={{ cursor: 'pointer' }}
              onClick={() => submitRating(star)}
            />
          ))}
          <span style={{ marginLeft: 8, fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            ({food.totalRatings || 0})
          </span>
        </div>

        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-sm)' }}>
            <button 
              style={{ background: 'transparent', border: 'none', color: 'var(--text-primary)', padding: '8px', cursor: 'pointer' }}
              onClick={() => setQty(q => Math.max(1, q - 1))}
            ><FiMinus /></button>
            
            <span style={{ width: '24px', textAlign: 'center', fontWeight: 'bold' }}>{qty}</span>
            
            <button 
              style={{ background: 'transparent', border: 'none', color: 'var(--text-primary)', padding: '8px', cursor: 'pointer' }}
              onClick={() => setQty(q => q + 1)}
            ><FiPlus /></button>
          </div>

          <button className="btn btn-primary" style={{ flex: 1 }} onClick={handleAddToCart}>
            <FiShoppingBag /> Add
          </button>
        </div>
      </div>
    </div>
  );
}
