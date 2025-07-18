import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthService } from '../api/auth';

const ProtectedRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hasChecked, setHasChecked] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const checkAuth = async () => {
      if (hasChecked) {
        return;
      }
      
      try {
        if (!AuthService.isAuthenticated()) {
          if (isMounted) {
            setIsAuthenticated(false);
            setLoading(false);
            setHasChecked(true);
          }
          return;
        }

        const isValid = await AuthService.verifyToken();
        
        if (isMounted) {
          setIsAuthenticated(isValid);
          setHasChecked(true);
        }
      } catch (error) {
        if (isMounted) {
          setIsAuthenticated(false);
          setHasChecked(true);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    checkAuth();

    return () => {
      isMounted = false;
    };
  }, [hasChecked]);

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
