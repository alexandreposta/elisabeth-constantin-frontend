import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getArtworksByGallery } from '../api/artworks';
import SortButton from '../components/SortButton';
import { getThumbnailFallback } from '../utils/image';
import SEO from '../components/SEO';
import '../styles/galerieType.css';
import { useTranslation } from 'react-i18next';

export default function GalerieType() {
  const { galleryType } = useParams();
  const navigate = useNavigate();
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentSort, setCurrentSort] = useState({ field: "title", direction: "asc" });
  const { t } = useTranslation();
  const decodedGalleryType = decodeURIComponent(galleryType || '');

  useEffect(() => {
    loadArtworks();
  }, [galleryType, t]);

  const getGalleryDisplayName = (type) => {
    if (!type) return '';
    const normalized = type.toLowerCase().replace(/\s+/g, '_');
    const fallback = formatGalleryTitle(type);
    return t(`header.galleryTypes.${normalized}`, fallback);
  };

  const readableGalleryType = getGalleryDisplayName(decodedGalleryType);

  const loadArtworks = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getArtworksByGallery(galleryType);
      setArtworks(data);
    } catch (err) {
      setError(t('gallery.error'));
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  function formatGalleryTitle(type) {
    if (!type) return '';
    return type.charAt(0).toUpperCase() + type.slice(1);
  }

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
          <h1 className="galerie-title">{readableGalleryType}</h1>
        </div>
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>{t('gallery.loading')}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="galerie-page">
        <div className="galerie-header">
          <h1 className="galerie-title">{readableGalleryType}</h1>
        </div>
        <div className="error-container">
          <p>{error}</p>
          <button onClick={() => navigate('/')} className="back-button">
            {t('gallery.back')}
          </button>
        </div>
      </div>
    );
  }

  if (artworks.length === 0) {
    return (
      <div className="galerie-page">
        <div className="galerie-header">
          <h1 className="galerie-title">{readableGalleryType}</h1>
        </div>
        <div className="no-artworks">
          <h3>{t('gallery.empty.title')}</h3>
          <p>{t('gallery.empty.description')}</p>
          <button onClick={() => navigate('/')} className="back-button">
            {t('gallery.back')}
          </button>
        </div>
      </div>
    );
  }

  const sortedArtworks = getSortedArtworks();

  const getGalleryDescription = (type) => {
    const normalized = (type || '').toLowerCase().replace(/\s+/g, '_');
    return t(`gallery.descriptions.${normalized}`, {
      defaultValue: t('gallery.descriptions.default', { type: readableGalleryType }),
    });
  };

  const getTypeLabel = (type) => {
    if (!type) {
      return t('gallery.typeLabels.default');
    }
    const normalized = type.toLowerCase().replace(/\s+/g, '_');
    return t(`gallery.typeLabels.${normalized}`, {
      defaultValue: t('gallery.typeLabels.default'),
    });
  };

  return (
    <>
      <SEO 
        title={`${readableGalleryType} - Galerie Élisabeth Constantin`}
        description={getGalleryDescription(decodedGalleryType)}
        keywords={`${decodedGalleryType}, galerie art, Elisabeth Constantin, œuvres, peinture, multiplan 3D`}
        url={`https://elisabeth-constantin.fr/galerie/${galleryType}`}
      />
      <div className="galerie-page">
      <div className="galerie-header">
        <h1 className="galerie-title">{readableGalleryType}</h1>
        <p className="galerie-subtitle">
          {t('gallery.count', { count: artworks.length })}
        </p>
      </div>

      <div className="galerie-controls">
        <div className="sort-buttons-group">
          <span className="sort-buttons-label">{t('gallery.sort.label')}</span>
          <SortButton
            field="title"
            currentSort={currentSort}
            onSort={handleSort}
            label={t('gallery.sort.title')}
            size="small"
            className="rounded"
          />
          <SortButton
            field="price"
            currentSort={currentSort}
            onSort={handleSort}
            label={t('gallery.sort.price')}
            size="small"
            className="rounded"
          />
          <SortButton
            field="size"
            currentSort={currentSort}
            onSort={handleSort}
            label={t('gallery.sort.size')}
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
              <p className="artwork-type">{getTypeLabel(artwork.type)}</p>
              <div className={`artwork-status ${artwork.status?.toLowerCase()}`}>
                {artwork.status || t('gallery.statusFallback')}
              </div>
            </div>
          </div>
        ))}
      </div>
      </div>
    </>
  );
}
