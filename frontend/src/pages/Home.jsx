import { useState, useEffect } from 'react';
import API from '../api/axios';
import FoodCard from '../components/FoodCard';
import { FiSearch } from 'react-icons/fi';

export default function Home() {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [query, setQuery] = useState('');

  useEffect(() => {
    fetchFoods();
  }, [query]);

  const fetchFoods = async () => {
    setLoading(true);
    try {
      const res = await API.get(`/food${query ? `?search=${encodeURIComponent(query)}` : ''}`);
      setFoods(res.data);
    } catch {
      setFoods([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setQuery(search);
  };

  return (
    <div className="page">
      <div style={{ marginBottom: '40px', padding: '40px 20px', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-lg)', textAlign: 'center' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '16px' }}>Welcome to TuckIN</h1>
        <p style={{ fontSize: '1.1rem', marginBottom: '24px' }}>Delicious food delivered to your door.</p>
        
        <form onSubmit={handleSearch} style={{ display: 'flex', maxWidth: '500px', margin: '0 auto', gap: '8px' }}>
          <div style={{ flex: 1, position: 'relative' }}>
            <FiSearch style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="text"
              className="form-input"
              style={{ paddingLeft: '40px' }}
              placeholder="Search for food..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button type="submit" className="btn btn-primary">Search</button>
        </form>
      </div>

      <h2 className="section-title">
        {query ? `Search Results for "${query}"` : 'Our Menu'}
      </h2>

      {loading ? (
        <div className="spinner-wrapper"><div className="spinner" /></div>
      ) : foods.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
          <h3>No food items found</h3>
          <p>Try a different search term.</p>
        </div>
      ) : (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', 
          gap: '24px' 
        }}>
          {foods.map((food) => (
            <FoodCard key={food._id} food={food} />
          ))}
        </div>
      )}
    </div>
  );
}
