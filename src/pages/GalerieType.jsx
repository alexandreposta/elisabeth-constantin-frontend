import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getArtworksByGallery } from '../api/artworks';
import SortButton from '../components/SortButton';
import { getThumbnailFallback } from '../utils/image';
import SEO from '../components/SEO';
import '../styles/galerieType.css';

export default function GalerieType() {
  const { galleryType } = useParams();
  const navigate = useNavigate();
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentSort, setCurrentSort] = useState({ field: "title", direction: "asc" });

  useEffect(() => {
    loadArtworks();
  }, [galleryType]);

  const loadArtworks = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getArtworksByGallery(galleryType);
      setArtworks(data);
    } catch (err) {
      setError('Erreur lors du chargement des œuvres');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formatGalleryTitle = (type) => {
    return type.charAt(0).toUpperCase() + type.slice(1);
  };

  const handleArtworkClick = (artwork) => {
    // Tracker la vue d'œuvre pour les analytics
    if (window.analytics) {
      window.analytics.trackArtworkView(artwork._id, artwork.title, artwork.type);
    }
    navigate(`/tableau/${artwork._id}`);
  };

  const handleContactClick = (artwork) => {
    const subject = `Intérêt pour l'œuvre : ${artwork.title}`;
    const body = `Bonjour,\n\nJe suis intéressé(e) par l'œuvre "${artwork.title}" de ${artwork.width}x${artwork.height}cm au prix de ${artwork.price}€.\n\nPouvez-vous me donner plus d'informations ?\n\nCordialement.`;
    window.location.href = `mailto:contact@example.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  const handleSort = (sortConfig) => {
    setCurrentSort(sortConfig);
  };

  const getSortedArtworks = () => {
    return [...artworks].sort((a, b) => {
      let result = 0;
      
      switch (currentSort.field) {
        case 'title':
          result = a.title.localeCompare(b.title);
          break;
        case 'price':
          result = (a.price || 0) - (b.price || 0);
          break;
        case 'size':
          const sizeA = (a.width || 0) * (a.height || 0);
          const sizeB = (b.width || 0) * (b.height || 0);
          result = sizeA - sizeB;
          break;
        default:
          result = 0;
      }
      
      return currentSort.direction === 'desc' ? -result : result;
    });
  };

  if (loading) {
    return (
      <div className="galerie-page">
        <div className="galerie-header">
          <h1 className="galerie-title">{formatGalleryTitle(galleryType)}</h1>
        </div>
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Chargement des œuvres...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="galerie-page">
        <div className="galerie-header">
          <h1 className="galerie-title">{formatGalleryTitle(galleryType)}</h1>
        </div>
        <div className="error-container">
          <p>{error}</p>
          <button onClick={() => navigate('/')} className="back-button">
            Retour à la page d'accueil
          </button>
        </div>
      </div>
    );
  }

  if (artworks.length === 0) {
    return (
      <div className="galerie-page">
        <div className="galerie-header">
          <h1 className="galerie-title">{formatGalleryTitle(galleryType)}</h1>
        </div>
        <div className="no-artworks">
          <h3>Aucune œuvre disponible</h3>
          <p>Cette galerie ne contient actuellement aucune œuvre.</p>
          <button onClick={() => navigate('/')} className="back-button">
            Retour à la page d'accueil
          </button>
        </div>
      </div>
    );
  }

  const sortedArtworks = getSortedArtworks();

  const getGalleryDescription = (type) => {
    const descriptions = {
      'peinture': 'Découvrez la collection de peintures originales d\'Élisabeth Constantin, œuvres uniques et créations artistiques contemporaines.',
      'plan 3d': 'Explorez les œuvres en multiplan 3D d\'Élisabeth Constantin, une technique unique qui donne vie et profondeur aux créations artistiques.',
      'plan3d': 'Explorez les œuvres en multiplan 3D d\'Élisabeth Constantin, une technique unique qui donne vie et profondeur aux créations artistiques.'
    };
    return descriptions[type] || `Découvrez les œuvres de la galerie ${type} d'Élisabeth Constantin`;
  };

  return (
    <>
      <SEO 
        title={`${formatGalleryTitle(galleryType)} - Galerie Élisabeth Constantin`}
        description={getGalleryDescription(galleryType)}
        keywords={`${galleryType}, galerie art, Elisabeth Constantin, œuvres, peinture, multiplan 3D`}
        url={`https://elisabeth-constantin.fr/galerie/${galleryType}`}
      />
      <div className="galerie-page">
      <div className="galerie-header">
        <h1 className="galerie-title">{formatGalleryTitle(galleryType)}</h1>
        <p className="galerie-subtitle">
          {artworks.length} œuvre{artworks.length > 1 ? 's' : ''} disponible{artworks.length > 1 ? 's' : ''}
        </p>
      </div>

      <div className="galerie-controls">
        <div className="sort-buttons-group">
          <span className="sort-buttons-label">Trier par :</span>
          <SortButton
            field="title"
            currentSort={currentSort}
            onSort={handleSort}
            label="Nom"
            size="small"
            className="rounded"
          />
          <SortButton
            field="price"
            currentSort={currentSort}
            onSort={handleSort}
            label="Prix"
            size="small"
            className="rounded"
          />
          <SortButton
            field="size"
            currentSort={currentSort}
            onSort={handleSort}
            label="Taille"
            size="small"
            className="rounded"
          />
        </div>
      </div>

      <div className="artworks-grid">
        {sortedArtworks.map((artwork) => (
          <div key={artwork._id} className="artwork-card" onClick={() => handleArtworkClick(artwork)}>
            <div className="artwork-image-container">
              <img 
                src={getThumbnailFallback(artwork.main_image, artwork.thumbnail)} 
                alt={artwork.title} 
                className="artwork-image" 
                loading="lazy"
              />
            </div>
            <div className="artwork-info">
              <h3 className="artwork-title">{artwork.title}</h3>
              <p className="artwork-dimensions">{artwork.width} x {artwork.height} cm</p>
              <div className={`artwork-status ${artwork.status?.toLowerCase()}`}>
                {artwork.status || 'Non défini'}
              </div>
            </div>
          </div>
        ))}
      </div>
      </div>
    </>
  );
}
