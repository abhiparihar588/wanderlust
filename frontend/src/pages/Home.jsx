import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchWithAuth } from '../utils/api';
import { MapPin } from 'lucide-react';
import './Home.css';

export default function Home() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getListings = async () => {
      try {
        const data = await fetchWithAuth('/api/listings');
        setListings(data.listings || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    getListings();
  }, []);

  if (loading) return <div className="loader">Loading properties...</div>;

  return (
    <div className="container home-container">
      <div className="hero-section">
        <h1>Find your next adventure</h1>
        <p>Discover stunning properties around the world suitable for your lifestyle</p>
      </div>

      <div className="listings-grid">
        {listings.map(listing => (
          <Link to={`/listing/${listing._id}`} key={listing._id} className="listing-card glass">
            <div className="listing-image">
              <img src={listing.image?.url || "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&q=80&w=800"} alt={listing.title} />
            </div>
            <div className="listing-details">
              <h3>{listing.title}</h3>
              <p className="listing-price">
                <span className="amount">₹{listing.price?.toLocaleString("en-IN") || 'N/A'}</span> / night
              </p>
              <div className="listing-location">
                <MapPin size={14} />
                <span>{listing.location}, {listing.country}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
