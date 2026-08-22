import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { FiShoppingCart, FiUser, FiLogOut } from 'react-icons/fi';

export default function Navbar({ onCartClick }) {
  const { user, isAdmin, logout } = useAuth();
  const { totalItems } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      background: 'var(--bg-secondary)',
      borderBottom: '1px solid var(--border)',
      height: '64px',
      display: 'flex', alignItems: 'center'
    }}>
      <div style={{
        width: '100%', maxWidth: '1200px', margin: '0 auto', padding: '0 24px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between'
      }}>
        <Link to="/" style={{
          fontSize: '1.5rem', fontWeight: 700, color: 'var(--accent)'
        }}>
          🍕 TuckIN
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          {!isAdmin && (
            <>
              <Link to="/about" style={{ color: 'var(--text-primary)' }}>About</Link>
              <Link to="/contact" style={{ color: 'var(--text-primary)' }}>Contact</Link>
            </>
          )}
          
          {!isAdmin && (
            <Link to="/admin/login" style={{ color: 'var(--text-muted)' }}>Admin Login</Link>
          )}

          {user && !isAdmin && (
            <Link to="/track-order" style={{ color: 'var(--text-primary)' }}>Track Order</Link>
          )}

          {isAdmin && (
            <Link to="/admin/dashboard" style={{ color: 'var(--warning)', fontWeight: 600 }}>
              Admin Panel
            </Link>
          )}

          <div style={{ width: '1px', height: '24px', background: 'var(--border)' }} />

          {user ? (
            <>
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FiUser /> {user.name.split(' ')[0]}
              </span>
              <button onClick={handleLogout} className="btn btn-sm btn-outline" style={{ color: 'var(--error)' }}>
                <FiLogOut /> Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" style={{ color: 'var(--text-primary)' }}>Login</Link>
              <Link to="/register" className="btn btn-primary btn-sm">Sign Up</Link>
            </>
          )}

          {!isAdmin && (
            <button 
              onClick={onCartClick} 
              className="btn btn-outline btn-sm"
              style={{ position: 'relative' }}
            >
              <FiShoppingCart />
              {totalItems > 0 && (
                <span style={{
                  position: 'absolute', top: '-8px', right: '-8px',
                  background: 'var(--accent)', color: '#fff',
                  borderRadius: '50%', width: '20px', height: '20px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '12px', fontWeight: 'bold'
                }}>
                  {totalItems}
                </span>
              )}
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
