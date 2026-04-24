import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchWithAuth } from '../utils/api';
import { AuthContext } from '../context/AuthContext';
import { MapPin, Edit, Trash2 } from 'lucide-react';
import './ListingDetail.css';

export default function ListingDetail() {
  const { id } = useParams();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const getListing = async () => {
      try {
        const data = await fetchWithAuth(`/api/listings/${id}`);
        setListing(data.listing);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    getListing();
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this listing?")) {
      try {
        await fetchWithAuth(`/api/listings/${id}`, { method: 'DELETE' });
        navigate('/');
      } catch (err) {
        alert(err.message);
      }
    }
  };

  if (loading) return <div className="loader">Loading details...</div>;
  if (!listing) return <div className="loader text-danger">Listing not found</div>;

  const isOwner = user && listing.owner === user._id;
  const isAdmin = user && user.role === 'admin';
  const canEdit = isOwner || isAdmin;

  return (
    <div className="container detail-container">
      <div className="detail-header">
        <h1>{listing.title}</h1>
        <div className="listing-location detail-location">
          <MapPin size={18} />
          <span>{listing.location}, {listing.country}</span>
        </div>
      </div>

      <div className="detail-image glass">
        <img src={listing.image?.url || "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&q=80&w=800"} alt={listing.title} />
      </div>

      <div className="detail-content glass">
        <div className="detail-info">
          <h3>Description</h3>
          <p className="description">{listing.description}</p>
          
          <div className="price-tag">
            <span className="amount">₹{listing.price?.toLocaleString("en-IN") || 'N/A'}</span>
            <span className="night">/ night</span>
          </div>
        </div>

        {canEdit && (
          <div className="owner-actions">
            <button className="btn-primary edit-btn" onClick={() => navigate(`/edit/${id}`)}>
              <Edit size={16} /> Edit
            </button>
            <button className="btn-danger delete-btn" onClick={handleDelete}>
              <Trash2 size={16} /> Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
