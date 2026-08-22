import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { FiEdit2, FiTrash2, FiPlus, FiX } from 'react-icons/fi';
import api from '../../api/axios';

const API_URL = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '/api' : 'http://localhost:5000/api');
const IMG_URL = API_URL.replace('/api', '');

export default function ManageFood() {
  const [foodItems, setFoodItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ name: '', description: '', price: '', category: '' });
  const [imageFile, setImageFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => { fetchFoodItems(); }, []);

  const fetchFoodItems = async () => {
    try {
      const res = await api.get('/admin/food');
      setFoodItems(res.data);
    } catch (error) {
      toast.error('Failed to load food items');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleImageChange = (e) => setImageFile(e.target.files[0]);

  const resetForm = () => {
    setFormData({ name: '', description: '', price: '', category: '' });
    setImageFile(null);
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const data = new FormData();
    Object.keys(formData).forEach(key => data.append(key, formData[key]));
    if (imageFile) data.append('image', imageFile);

    try {
      if (editingId) {
        await api.put(`/admin/food/${editingId}`, data);
        toast.success('Food updated successfully');
      } else {
        await api.post('/admin/food', data);
        toast.success('Food added successfully');
      }
      resetForm();
      setShowForm(false);
      fetchFoodItems();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save food item');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this food item?')) return;
    try {
      await api.delete(`/admin/food/${id}`);
      toast.success('Food item deleted');
      fetchFoodItems();
    } catch (error) {
      toast.error('Failed to delete food item');
    }
  };

  const handleEdit = (item) => {
    setFormData({ name: item.name, description: item.description, price: item.price, category: item.category });
    setEditingId(item._id);
    setShowForm(true);
    window.scrollTo(0, 0);
  };

  return (
    <div className="page">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 className="section-title" style={{ margin: 0, border: 'none', padding: 0 }}>Manage Food</h1>
        <button onClick={() => { resetForm(); setShowForm(!showForm); }} className="btn btn-primary">
          {showForm ? <FiX /> : <FiPlus />} {showForm ? 'Cancel' : 'Add New Food'}
        </button>
      </div>

      {showForm && (
        <div className="card" style={{ marginBottom: '32px' }}>
          <h2 style={{ marginBottom: '20px' }}>{editingId ? 'Edit Food Item' : 'Add New Food Item'}</h2>
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="form-group">
                <label className="form-label">Name</label>
                <input type="text" name="name" value={formData.name} onChange={handleInputChange} required className="form-input" />
              </div>
              <div className="form-group">
                <label className="form-label">Category</label>
                <input type="text" name="category" value={formData.category} onChange={handleInputChange} required className="form-input" />
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="form-group">
                <label className="form-label">Price (₹)</label>
                <input type="number" name="price" value={formData.price} onChange={handleInputChange} required min="0" className="form-input" />
              </div>
              <div className="form-group">
                <label className="form-label">Image</label>
                <input type="file" accept="image/*" onChange={handleImageChange} className="form-input" style={{ background: 'transparent', padding: '8px' }} />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea name="description" value={formData.description} onChange={handleInputChange} required rows="3" className="form-input"></textarea>
            </div>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Saving...' : 'Save Food Item'}
            </button>
          </form>
        </div>
      )}

      {loading ? (
        <div className="spinner-wrapper"><div className="spinner"></div></div>
      ) : (
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {foodItems.length === 0 ? (
                <tr><td colSpan="5" style={{ textAlign: 'center' }}>No food items found.</td></tr>
              ) : (
                foodItems.map((item) => (
                  <tr key={item._id}>
                    <td>
                      <img 
                        src={item.image ? `${IMG_URL}/${item.image}` : '/placeholder.png'} 
                        alt={item.name}
                        style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: '4px' }}
                      />
                    </td>
                    <td style={{ fontWeight: 600 }}>{item.name}</td>
                    <td><span className="badge badge-default">{item.category}</span></td>
                    <td>₹{item.price}</td>
                    <td>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button onClick={() => handleEdit(item)} className="btn btn-sm btn-outline"><FiEdit2 /></button>
                        <button onClick={() => handleDelete(item._id)} className="btn btn-sm btn-danger"><FiTrash2 /></button>
                      </div>
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
