import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthService } from '../api/auth';

const ProtectedRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const checkAuth = async () => {
      try {
        const isValid = await AuthService.isAuthenticated();
        
        if (isMounted) {
          setIsAuthenticated(isValid);
          setLoading(false);
        }
      } catch (error) {
        console.error('Erreur lors de la vérification auth:', error);
        if (isMounted) {
          setIsAuthenticated(false);
          setLoading(false);
        }
      }
    };

    checkAuth();

    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh',
        fontSize: '1.2rem',
        color: '#7f8c8d'
      }}>
        Vérification de l'authentification...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
