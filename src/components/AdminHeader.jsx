import { Link, useLocation } from "react-router-dom";
import { FaHome, FaPaintBrush, FaCalendarAlt, FaShoppingCart, FaTachometerAlt } from "react-icons/fa";
import "../styles/adminHeader.css";

export default function AdminHeader() {
  const location = useLocation();
  
  const isActive = (path) => location.pathname === path;
  
  return (
    <header className="admin-header">
      <div className="admin-header-container">
        <Link 
          to="/admin/dashboard" 
          className={`admin-dashboard-link ${isActive('/admin/dashboard') ? 'active' : ''}`}
        >
          <FaTachometerAlt />
          <span>Dashboard</span>
        </Link>
        
        <nav className="admin-nav">
          <Link 
            to="/admin/artworks" 
            className={`admin-nav-link ${isActive('/admin/artworks') ? 'active' : ''}`}
          >
            <FaPaintBrush />
            <span>Œuvres</span>
          </Link>
          
          <Link 
            to="/admin/events" 
            className={`admin-nav-link ${isActive('/admin/events') ? 'active' : ''}`}
          >
            <FaCalendarAlt />
            <span>Événements</span>
          </Link>
          
          <Link 
            to="/admin/orders" 
            className={`admin-nav-link ${isActive('/admin/orders') ? 'active' : ''}`}
          >
            <FaShoppingCart />
            <span>Commandes</span>
          </Link>
        </nav>
        
        <Link 
          to="/" 
          className="admin-nav-link"
        >
          <FaHome />
          <span>Voir le site</span>
        </Link>
      </div>
    </header>
  );
}
