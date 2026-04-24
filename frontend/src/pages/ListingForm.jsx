import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchWithAuth } from '../utils/api';
import './Auth.css'; 

export default function ListingForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  
  const [formData, setFormData] = useState({
    title: '', description: '', price: '', 
    location: '', country: ''
  });
  const [imageFile, setImageFile] = useState(null);
  
  const [loading, setLoading] = useState(isEdit);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isEdit) {
      const fetchListing = async () => {
        try {
          const data = await fetchWithAuth(`/api/listings/${id}`);
          const { title, description, price, location, country } = data.listing;
          setFormData({ title, description, price, location, country });
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };
      fetchListing();
    }
  }, [id, isEdit]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setImageFile(e.target.files[0]);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Construct FormData natively
    const submitData = new FormData();
    submitData.append('title', formData.title);
    submitData.append('description', formData.description);
    submitData.append('price', formData.price);
    submitData.append('location', formData.location);
    submitData.append('country', formData.country);
    
    if (imageFile) {
        submitData.append('image', imageFile);
    }

    try {
      if (id) {
        await fetchWithAuth(`/api/listings/${id}`, { method: 'PUT', body: submitData });
      } else {
        await fetchWithAuth(`/api/listings`, { method: 'POST', body: submitData });
      }
      navigate('/');
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <div className="loader">Loading...</div>;

  return (
    <div className="auth-wrapper">
      <div className="auth-card glass" style={{ maxWidth: '600px' }}>
        <h2>{isEdit ? 'Edit Listing' : 'Create New Listing'}</h2>
        {error && <div className="auth-error">{error}</div>}
        
        <form onSubmit={handleSubmit} className="auth-form" encType="multipart/form-data">
          <input type="text" name="title" value={formData.title} onChange={handleChange} placeholder="Title" required className="input-field" />
          <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Description" required className="input-field" rows="4"></textarea>
          <input type="number" name="price" value={formData.price} onChange={handleChange} placeholder="Price per night (INR)" required className="input-field" />
          <input type="text" name="location" value={formData.location} onChange={handleChange} placeholder="Location" required className="input-field" />
          <input type="text" name="country" value={formData.country} onChange={handleChange} placeholder="Country" required className="input-field" />
          
          <label style={{ textAlign: 'left', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Upload Image</label>
          <input type="file" name="image" onChange={handleFileChange} accept="image/*" className="input-field" />
          
          <button type="submit" className="btn-primary auth-submit">
            {isEdit ? 'Update Listing' : 'Create Listing'}
          </button>
        </form>
      </div>
    </div>
  );
}
