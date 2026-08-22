import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FiBox, FiList } from 'react-icons/fi';

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <div className="page">
      <h1 className="section-title">Admin Dashboard</h1>
      <p style={{ fontSize: '1.2rem', marginBottom: '40px' }}>Welcome back, {user?.name}</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
        <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '40px 20px' }}>
          <FiBox size={48} color="var(--warning)" style={{ marginBottom: '16px' }} />
          <h3 style={{ marginBottom: '8px' }}>Manage Food Menu</h3>
          <p style={{ marginBottom: '24px' }}>Add, edit, or remove food items from the public menu.</p>
          <Link to="/admin/food" className="btn btn-outline">Go to Food Menu</Link>
        </div>

        <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '40px 20px' }}>
          <FiList size={48} color="var(--accent)" style={{ marginBottom: '16px' }} />
          <h3 style={{ marginBottom: '8px' }}>Manage Orders</h3>
          <p style={{ marginBottom: '24px' }}>Track incoming orders and update delivery status.</p>
          <Link to="/admin/orders" className="btn btn-primary">Go to Orders</Link>
        </div>
      </div>
    </div>
  );
}
