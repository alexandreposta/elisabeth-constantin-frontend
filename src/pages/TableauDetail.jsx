import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getArtworkById } from '../api/artworks';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import { FaShoppingCart, FaCheck } from 'react-icons/fa';
import '../styles/tableauDetail.css';

export default function TableauDetail() {
  const { id } = useParams();
  const { addToCart, isInCart } = useCart();
  const { currentLanguage, t } = useLanguage();
  const [tableau, setTableau] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
  const [isZooming, setIsZooming] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTableau = async () => {
      try {
        setLoading(true);
        const artwork = await getArtworkById(id, currentLanguage);
        
        // Adapter les données de l'API au format attendu
        const tableauData = {
          id: artwork._id,
          titre: artwork.title,
          prix: artwork.price,
          description: artwork.description || "Description non disponible pour cette œuvre.",
          images: [
            artwork.main_image,
            ...(artwork.other_images || [])
          ].filter(img => img), // Filtrer les images null/undefined
          dimensions: artwork.width && artwork.height ? `${artwork.width} x ${artwork.height} cm` : "Dimensions non spécifiées",
          technique: artwork.type === "3D" ? "Tableau 3 dimensions" : "Peinture",
          type: artwork.type,
          disponible: artwork.is_available !== false // Par défaut disponible si pas spécifié
        };
        
        setTableau(tableauData);
      } catch (error) {
        console.error('Erreur lors du chargement du tableau:', error);
        setError(t('common.error', 'Impossible de charger les détails de cette œuvre.'));
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchTableau();
    }
  }, [id, currentLanguage]);

  const handleMouseMove = (e) => {
    if (!isZooming) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    setZoomPosition({ x, y });
  };

  const handleAddToCart = () => {
    if (!tableau.disponible) return;
    
    addToCart({
      id: tableau.id,
      title: tableau.titre,
      price: tableau.prix,
      main_image: tableau.images[0],
      description: tableau.description,
      width: tableau.dimensions.split(' x ')[0],
      height: tableau.dimensions.split(' x ')[1]?.replace(' cm', ''),
      type: tableau.type,
      is_available: tableau.disponible
    });
  };

  if (loading) {
    return (
      <div className="tableau-detail">
        <div className="loading">Chargement...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="tableau-detail">
        <div className="loading" style={{ color: '#dc2626' }}>{error}</div>
      </div>
    );
  }

  if (!tableau) {
    return (
      <div className="tableau-detail">
        <div className="loading">Œuvre non trouvée.</div>
      </div>
    );
  }

  return (
    <div className="tableau-detail">
      <div className="tableau-container">
        
        {/* Galerie photos - Gauche */}
        <div className="tableau-gallery">
          <div className="main-image-container">
            <div 
              className={`main-image ${isZooming ? 'zooming' : ''}`}
              onMouseMove={handleMouseMove}
              onMouseEnter={() => setIsZooming(true)}
              onMouseLeave={() => setIsZooming(false)}
              style={{
                '--zoom-x': `${zoomPosition.x}%`,
                '--zoom-y': `${zoomPosition.y}%`
              }}
            >
              <img 
                src={tableau.images[selectedImage]} 
                alt={tableau.titre}
              />
              {isZooming && (
                <div 
                  className="zoom-lens"
                  style={{
                    left: `${zoomPosition.x}%`,
                    top: `${zoomPosition.y}%`
                  }}
                />
              )}
            </div>
          </div>
          
          {tableau.images.length > 1 && (
            <div className="thumbnail-container">
              {tableau.images.map((image, index) => (
                <div 
                  key={index}
                  className={`thumbnail ${selectedImage === index ? 'active' : ''}`}
                  onClick={() => setSelectedImage(index)}
                >
                  <img src={image} alt={`Vue ${index + 1}`} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Informations - Droite */}
        <div className="tableau-info">
          <h1 className="tableau-titre">{tableau.titre}</h1>
          
          <div className="tableau-prix">
            {tableau.prix}€
          </div>

          <div className="tableau-details">
            <div className="detail-item">
              <span className="detail-label">Dimensions :</span>
              <span className="detail-value">{tableau.dimensions}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Technique :</span>
              <span className="detail-value">{tableau.technique}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Disponibilité :</span>
              <span className={`detail-value ${tableau.disponible ? 'disponible' : 'indisponible'}`}>
                {tableau.disponible ? 'En stock' : 'Épuisé'}
              </span>
            </div>
          </div>

          <div className="tableau-description">
            <h3>Description</h3>
            <p>{tableau.description}</p>
          </div>

          <div className="tableau-action">
            {!tableau.disponible ? (
              <button className="add-to-cart-btn unavailable" disabled>
                Indisponible
              </button>
            ) : isInCart(tableau.id) ? (
              <button className="add-to-cart-btn in-cart" disabled>
                <FaCheck /> Dans le panier
              </button>
            ) : (
              <button 
                className="add-to-cart-btn"
                onClick={handleAddToCart}
              >
                <FaShoppingCart /> Ajouter au panier
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
