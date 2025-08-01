import { Link, useLocation } from "react-router-dom";
import { FaHome, FaPaintBrush, FaCalendarAlt, FaShoppingCart, FaTachometerAlt, FaBars, FaTimes } from "react-icons/fa";
import { useState, useEffect } from "react";
import "../styles/adminHeader.css";

export default function AdminHeader() {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  const isActive = (path) => location.pathname === path;
  
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };
  
  return (
    <header className="admin-header">
      <div className="admin-header-container">
        <Link 
          to="/admin/dashboard" 
          className={`admin-dashboard-link ${isActive('/admin/dashboard') ? 'active' : ''}`}
          onClick={closeMobileMenu}
        >
          <FaTachometerAlt />
          <span>Dashboard</span>
        </Link>
        
        <nav className={`admin-nav ${isMobileMenuOpen ? 'mobile-menu-open' : ''}`}>
          <Link 
            to="/admin/artworks" 
            className={`admin-nav-link ${isActive('/admin/artworks') ? 'active' : ''}`}
            onClick={closeMobileMenu}
          >
            <FaPaintBrush />
            <span>Œuvres</span>
          </Link>
          
          <Link 
            to="/admin/events" 
            className={`admin-nav-link ${isActive('/admin/events') ? 'active' : ''}`}
            onClick={closeMobileMenu}
          >
            <FaCalendarAlt />
            <span>Événements</span>
          </Link>
          
          <Link 
            to="/admin/orders" 
            className={`admin-nav-link ${isActive('/admin/orders') ? 'active' : ''}`}
            onClick={closeMobileMenu}
          >
            <FaShoppingCart />
            <span>Commandes</span>
          </Link>
          
          <Link 
            to="/" 
            className="admin-nav-link"
            onClick={closeMobileMenu}
          >
            <FaHome />
            <span>Voir le site</span>
          </Link>
        </nav>
        
        <button className="mobile-menu-toggle" onClick={toggleMobileMenu}>
          {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>
    </header>
  );
}
