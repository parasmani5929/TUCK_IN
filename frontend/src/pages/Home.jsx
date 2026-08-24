import { useState, useEffect, useMemo } from 'react';
import API from '../api/axios';
import FoodCard from '../components/FoodCard';
import { FiSearch } from 'react-icons/fi';

export default function Home() {
  const [allFoods, setAllFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    fetchFoods();
  }, [query]);

  const fetchFoods = async () => {
    setLoading(true);
    try {
      const res = await API.get(`/food${query ? `?search=${encodeURIComponent(query)}` : ''}`);
      setAllFoods(res.data);
    } catch {
      setAllFoods([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setQuery(search);
    setSelectedCategory('All'); // Reset category on search
  };

  // Extract unique categories dynamically from the loaded foods
  const categories = useMemo(() => {
    const cats = allFoods.map(food => food.category).filter(Boolean);
    return ['All', ...new Set(cats)];
  }, [allFoods]);

  // Filter foods by selected category
  const displayedFoods = useMemo(() => {
    if (selectedCategory === 'All') return allFoods;
    return allFoods.filter(food => food.category === selectedCategory);
  }, [allFoods, selectedCategory]);

  return (
    <div className="page" style={{ padding: '0 20px 40px' }}>
      {/* Hero Section */}
      <div style={{ 
        marginBottom: '40px', 
        padding: '60px 20px', 
        background: 'linear-gradient(135deg, var(--bg-secondary) 0%, rgba(255, 107, 107, 0.1) 100%)', 
        borderRadius: '0 0 var(--radius-lg) var(--radius-lg)', 
        textAlign: 'center',
        margin: '0 -20px 40px -20px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.05)'
      }}>
        <h1 style={{ 
          fontSize: '3rem', 
          marginBottom: '16px', 
          fontWeight: '800', 
          background: 'linear-gradient(to right, var(--text-primary), var(--accent))', 
          WebkitBackgroundClip: 'text', 
          WebkitTextFillColor: 'transparent' 
        }}>
          Welcome to TuckIN
        </h1>
        <p style={{ fontSize: '1.2rem', marginBottom: '30px', color: 'var(--text-muted)' }}>
          Discover and order the most delicious meals around you.
        </p>
        
        <form onSubmit={handleSearch} style={{ display: 'flex', maxWidth: '600px', margin: '0 auto', gap: '8px', background: 'var(--bg-primary)', padding: '8px', borderRadius: '50px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
          <div style={{ flex: 1, position: 'relative', display: 'flex', alignItems: 'center' }}>
            <FiSearch style={{ position: 'absolute', left: '16px', color: 'var(--text-muted)' }} size={20} />
            <input
              type="text"
              style={{ 
                width: '100%', 
                padding: '12px 12px 12px 48px', 
                border: 'none', 
                background: 'transparent',
                outline: 'none',
                fontSize: '1rem',
                color: 'var(--text-primary)'
              }}
              placeholder="What are you craving today?"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button type="submit" className="btn btn-primary" style={{ borderRadius: '40px', padding: '10px 24px', fontWeight: 'bold' }}>
            Search
          </button>
        </form>
      </div>

      {/* Category Filter Bar */}
      {!loading && allFoods.length > 0 && (
        <div style={{ marginBottom: '32px' }}>
          <div style={{ 
            display: 'flex', 
            gap: '12px', 
            overflowX: 'auto', 
            paddingBottom: '12px',
            scrollbarWidth: 'none', // Firefox
            msOverflowStyle: 'none' // IE/Edge
          }} className="hide-scrollbar">
            {categories.map((cat, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedCategory(cat)}
                style={{
                  padding: '10px 24px',
                  borderRadius: '30px',
                  border: 'none',
                  whiteSpace: 'nowrap',
                  cursor: 'pointer',
                  fontWeight: '600',
                  fontSize: '0.95rem',
                  transition: 'all 0.3s ease',
                  background: selectedCategory === cat ? 'var(--accent)' : 'var(--bg-secondary)',
                  color: selectedCategory === cat ? '#fff' : 'var(--text-primary)',
                  boxShadow: selectedCategory === cat ? '0 4px 12px rgba(255, 107, 107, 0.3)' : '0 2px 4px rgba(0,0,0,0.05)',
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 className="section-title" style={{ margin: 0 }}>
          {query ? `Search Results for "${query}"` : (selectedCategory === 'All' ? 'Our Menu' : `${selectedCategory} Menu`)}
        </h2>
        {!loading && (
          <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Showing {displayedFoods.length} items
          </span>
        )}
      </div>

      {loading ? (
        <div className="spinner-wrapper" style={{ height: '300px' }}><div className="spinner" /></div>
      ) : displayedFoods.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '60px 20px', borderRadius: 'var(--radius-lg)' }}>
          <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🍽️</div>
          <h3 style={{ fontSize: '1.5rem', marginBottom: '8px' }}>No food items found</h3>
          <p style={{ color: 'var(--text-muted)' }}>Try selecting a different category or refining your search.</p>
        </div>
      ) : (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
          gap: '24px' 
        }}>
          {displayedFoods.map((food) => (
            <div key={food._id} style={{ animation: 'fadeIn 0.5s ease' }}>
              <FoodCard food={food} />
            </div>
          ))}
        </div>
      )}

      {/* Injecting some critical CSS for animations & hiding scrollbar */}
      <style>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
