import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchWithAuth } from '../utils/api';
import { AuthContext } from '../context/AuthContext';
import { Users, Trash2, Home, Star } from 'lucide-react';
import './AdminDashboard.css';

export default function AdminDashboard() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [stats, setStats] = useState({ listings: 0, users: 0, reviews: 0 });
  const [usersList, setUsersList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // If not admin, redirect
    if (!user || user.role !== 'admin') {
      navigate('/');
      return;
    }

    const fetchData = async () => {
      try {
        const [statsData, usersData] = await Promise.all([
          fetchWithAuth('/api/admin/stats'),
          fetchWithAuth('/api/users')
        ]);
        setStats(statsData.stats);
        setUsersList(usersData.users);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, navigate]);

  const handleDeleteUser = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user? This cannot be undone.")) {
      try {
        await fetchWithAuth(`/api/users/${userId}`, { method: 'DELETE' });
        setUsersList(usersList.filter(u => u._id !== userId));
        setStats(prev => ({ ...prev, users: prev.users - 1 }));
      } catch (err) {
        alert(err.message);
      }
    }
  };

  if (loading) return <div className="loader">Loading Dashboard...</div>;

  return (
    <div className="admin-container">
      <h1 className="admin-title">Admin Dashboard</h1>
      {error && <div className="auth-error">{error}</div>}

      <div className="stats-grid">
        <div className="stat-card glass">
          <div className="stat-icon users-icon"><Users size={24} /></div>
          <div className="stat-info">
            <h3>Total Users</h3>
            <p className="stat-number">{stats.users}</p>
          </div>
        </div>
        <div className="stat-card glass">
          <div className="stat-icon listings-icon"><Home size={24} /></div>
          <div className="stat-info">
            <h3>Total Listings</h3>
            <p className="stat-number">{stats.listings}</p>
          </div>
        </div>
        <div className="stat-card glass">
          <div className="stat-icon reviews-icon"><Star size={24} /></div>
          <div className="stat-info">
            <h3>Total Reviews</h3>
            <p className="stat-number">{stats.reviews}</p>
          </div>
        </div>
      </div>

      <div className="users-section glass">
        <h2>Manage Users</h2>
        <div className="table-responsive">
          <table className="users-table">
            <thead>
              <tr>
                <th>Username</th>
                <th>Email</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {usersList.map(u => (
                <tr key={u._id}>
                  <td>{u.username}</td>
                  <td>{u.email}</td>
                  <td><span className={`role-badge ${u.role}`}>{u.role}</span></td>
                  <td>
                    {u._id !== user._id && (
                      <button 
                        className="btn-danger delete-user-btn" 
                        onClick={() => handleDeleteUser(u._id)}
                        title="Delete User"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {usersList.length === 0 && (
                <tr>
                  <td colSpan="4" style={{textAlign: 'center', padding: '2rem'}}>No users found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
