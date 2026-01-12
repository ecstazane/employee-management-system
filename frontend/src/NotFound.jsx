import React, { useContext } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';
import './styles/NotFound.css';

const NotFound = () => {
  const navigate = useNavigate();
  const { token, loading } = useContext(AuthContext);

  // Redirect to login if not authenticated
  if (!loading && !token) {
    return <Navigate to="/login" replace />;
  }

  // Don't show 404 page while loading
  if (loading) {
    return (
      <div className="not-found-container">
        <div className="not-found-content">
          <h2>Loading...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="not-found-container">
      <div className="not-found-content">
        <h1>404</h1>
        <h2>Page Not Found</h2>
        <p>The page you're looking for doesn't exist.</p>
        <button 
          className="btn-primary" 
          onClick={() => navigate('/employees')}
        >
          Go to Employees
        </button>
      </div>
    </div>
  );
};

export default NotFound;
