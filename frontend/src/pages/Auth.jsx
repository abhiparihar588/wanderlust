import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { fetchWithAuth } from '../utils/api';
import './Auth.css';

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState('');
  const { login, user } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (user) navigate('/');
    const searchParams = new URLSearchParams(location.search);
    if (searchParams.get('mode') === 'signup') {
      setIsLogin(false);
    } else {
      setIsLogin(true);
    }
  }, [location, user, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.submitter?.setAttribute("disabled", "true");
    e.preventDefault();
    setError('');
    const endpoint = isLogin ? '/api/users/login' : '/api/users/signup';
    
    try {
      const data = await fetchWithAuth(endpoint, {
        method: 'POST',
        body: JSON.stringify(isLogin ? {
           username: formData.username, 
           password: formData.password 
        } : formData)
      });
      
      login(data.user, data.token);
      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      e.submitter?.removeAttribute("disabled");
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card glass">
        <h2>{isLogin ? 'Welcome Back' : 'Join Wanderlust'}</h2>
        {error && <div className="auth-error">{error}</div>}
        
        <form onSubmit={handleSubmit} className="auth-form">
          <input 
            type="text" 
            name="username" 
            value={formData.username} 
            onChange={handleChange} 
            placeholder="Username" 
            className="input-field" 
            required
          />
          {!isLogin && (
            <input 
              type="email" 
              name="email" 
              value={formData.email} 
              onChange={handleChange} 
              placeholder="Email" 
              className="input-field" 
              required
            />
          )}
          <input 
            type="password" 
            name="password" 
            value={formData.password} 
            onChange={handleChange} 
            placeholder="Password" 
            className="input-field" 
            required
          />
          <button type="submit" className="btn-primary auth-submit">
            {isLogin ? 'Login' : 'Sign Up'}
          </button>
        </form>
        
        <div className="auth-toggle">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <span onClick={() => setIsLogin(!isLogin)} className="toggle-link">
            {isLogin ? 'Sign up' : 'Login'}
          </span>
        </div>
      </div>
    </div>
  );
}
