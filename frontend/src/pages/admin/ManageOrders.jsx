import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import api from '../../api/axios';

export default function ManageOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await api.get('/admin/orders');
      setOrders(res.data);
    } catch (error) {
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await api.put(`/admin/orders/${id}/status`, { status: newStatus });
      toast.success('Order status updated');
      fetchOrders();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const getStatusBadgeClass = (status) => {
    switch(status?.toLowerCase()) {
      case 'pending': return 'badge-pending';
      case 'paid': return 'badge-paid';
      case 'preparing': return 'badge-preparing';
      case 'on the way':
      case 'out for delivery': return 'badge-default';
      case 'delivered':
      case 'completed': return 'badge-paid';
      default: return 'badge-default';
    }
  };

  return (
    <div className="page">
      <h1 className="section-title">Manage Orders</h1>

      {loading ? (
        <div className="spinner-wrapper"><div className="spinner"></div></div>
      ) : (
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Items</th>
                <th>Total</th>
                <th>Payment</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Update Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '40px' }}>No orders found</td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order._id}>
                    <td style={{ fontFamily: 'monospace', color: 'var(--text-muted)' }}>
                      {String(order._id).slice(-8).toUpperCase()}
                    </td>
                    <td>
                      <div style={{ fontWeight: 600 }}>{order.user?.name || 'Guest'}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{order.user?.phone || ''}</div>
                    </td>
                    <td>
                      <div style={{ maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {order.items?.map(i => i.name).join(', ')}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        {order.items?.length || 0} items
                      </div>
                    </td>
                    <td style={{ fontWeight: 'bold' }}>₹{order.total_price}</td>
                    <td>
                      <span className="badge badge-default">{order.paymentMethod}</span>
                    </td>
                    <td>
                      <span className={`badge ${getStatusBadgeClass(order.status)}`}>
                        {order.status || 'Pending'}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <select 
                        value={order.status || 'Pending'} 
                        onChange={(e) => handleStatusChange(order._id, e.target.value)}
                        className="form-input"
                        style={{ padding: '6px', width: 'auto', display: 'inline-block' }}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Paid">Paid</option>
                        <option value="Preparing">Preparing</option>
                        <option value="On the Way">On the Way</option>
                        <option value="Out for Delivery">Out for Delivery</option>
                        <option value="Delivered">Delivered</option>
                      </select>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
