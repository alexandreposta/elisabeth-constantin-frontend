import "../styles/header.css";
import { Link, useLocation } from "react-router-dom";
import { FaHeart, FaShoppingCart, FaBars, FaTimes } from "react-icons/fa";
import logo from "../assets/logo.png";
import { useCart } from "../context/CartContext";
import { useState, useEffect } from "react";
import { getAllArtworkTypes } from "../api/artworkTypes";
import { useTranslation } from "react-i18next";
import { useLanguage } from "../context/LanguageContext";

export default function Header() {
  const location = useLocation();
  const { getItemCount } = useCart();
  const cartItemCount = getItemCount();
  const [galleryTypes, setGalleryTypes] = useState([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isGalleryDropdownOpen, setIsGalleryDropdownOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const { t } = useTranslation();
  const { language, toggleLanguage } = useLanguage();
  
  useEffect(() => {
    const fetchGalleryTypes = async () => {
      try {
        // Utiliser uniquement l'API artwork-types (source unique de vérité)
        const types = await getAllArtworkTypes();
        setGalleryTypes(types);
      } catch (error) {
        console.error('Erreur lors du chargement des types de galerie:', error);
        // En cas d'erreur, ne pas afficher de types (pas de fallback hardcodé)
        setGalleryTypes([]);
      }
    };
    
    fetchGalleryTypes();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    const handleClickOutside = (event) => {
      if (isGalleryDropdownOpen && !event.target.closest('.nav-dropdown')) {
        setIsGalleryDropdownOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    document.addEventListener('click', handleClickOutside);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isGalleryDropdownOpen]);
  
  const isActive = (path) =>
    location.pathname.toLowerCase().startsWith(path.toLowerCase());

  const getPastelClass = () => {
    const pastelClasses = ['pastel-1', 'pastel-2', 'pastel-3', 'pastel-4', 'pastel-5', 'pastel-6'];
    return pastelClasses[Math.floor(Math.random() * pastelClasses.length)];
  };

  const getGalleryDisplayName = (type) => {
    const normalized = type.toLowerCase().replace(/\s+/g, '_');
    const fallback = type.charAt(0).toUpperCase() + type.slice(1);
    return t(`header.galleryTypes.${normalized}`, fallback);
  };

  const getGalleryPath = (type) => {
    return `/galerie/${encodeURIComponent(type)}`;
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleGalleryDropdown = (e) => {
    if (isMobile) {
      e.preventDefault();
      e.stopPropagation();
      setIsGalleryDropdownOpen(!isGalleryDropdownOpen);
    } else {
      // Sur desktop, empêcher le clic car on utilise le hover
      e.preventDefault();
    }
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
    setIsGalleryDropdownOpen(false);
  };

  return (
    <header className="header">
      <div className="header-content">
        <Link to="/accueil" className="header-logo">
          <img src={logo} alt="Logo Elisabeth Constantin" />
        </Link>
        
        <nav className={`header-nav ${isMobileMenuOpen ? 'mobile-menu-open' : ''}`}>
          <Link
            to="/accueil"
            className={`nav-link ${isActive("/accueil") ? `active ${getPastelClass()}` : ""}`}
            onClick={closeMobileMenu}
          >
            {t('header.links.home')}
          </Link>
          
          <div className="nav-dropdown">
            <span
              className={`dropdown-trigger ${
                galleryTypes.some(type => isActive(getGalleryPath(type)))
                  ? `active ${getPastelClass()}`
                  : ""
              } ${isMobile ? 'no-underline' : ''}`}
              onClick={toggleGalleryDropdown}
            >
              {t('header.links.gallery')}
              <FaHeart className="dropdown-icon" />
            </span>
            <div className={`dropdown-content ${isGalleryDropdownOpen ? 'dropdown-open' : ''}`}>
              {galleryTypes.map((type, index) => (
                <div key={type}>
                  <Link
                    to={getGalleryPath(type)}
                    className={isActive(getGalleryPath(type)) ? `active ${getPastelClass()}` : ""}
                    onClick={closeMobileMenu}
                  >
                    {getGalleryDisplayName(type)}
                  </Link>
                  {index < galleryTypes.length - 1 && <div className="dropdown-separator" />}
                </div>
              ))}
            </div>
          </div>
          
          <Link
            to="/evenements"
            className={`nav-link ${isActive("/evenements") ? `active ${getPastelClass()}` : ""}`}
            onClick={closeMobileMenu}
          >
            {t('header.links.events')}
          </Link>
          
          <Link
            to="/panier"
            className={`nav-link ${isActive("/panier") ? `active ${getPastelClass()}` : ""}`}
            onClick={closeMobileMenu}
          >
            <FaShoppingCart className="cart-icon" />
            <span>{t('header.links.cart')}</span>
            {cartItemCount > 0 && (
              <span className="cart-badge">{cartItemCount}</span>
            )}
          </Link>
        </nav>
        
        <div className="header-actions">
          <button 
            type="button" 
            className={`language-toggle ${language}`} 
            onClick={toggleLanguage}
            aria-label={t('header.languageToggle')}
          >
            <span>FR</span>
            <span>EN</span>
            <span className="language-indicator" />
          </button>
          <button className="mobile-menu-toggle" onClick={toggleMobileMenu}>
            {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </div>
    </header>
  );
}
