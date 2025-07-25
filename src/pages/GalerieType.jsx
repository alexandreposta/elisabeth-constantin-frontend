import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getArtworksByGallery } from '../api/artworks';
import '../styles/galerieType.css';

export default function GalerieType() {
  const { galleryType } = useParams();
  const navigate = useNavigate();
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
          <button onClick={() => navigate('/galerie')} className="back-button">
            Retour à la galerie
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
          <button onClick={() => navigate('/galerie')} className="back-button">
            Retour à la galerie
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="galerie-page">
      <div className="galerie-header">
        <h1 className="galerie-title">{formatGalleryTitle(galleryType)}</h1>
        <p className="galerie-subtitle">
          {artworks.length} œuvre{artworks.length > 1 ? 's' : ''} disponible{artworks.length > 1 ? 's' : ''}
        </p>
      </div>

      <div className="artworks-grid">
        {artworks.map((artwork) => (
          <div key={artwork._id} className="artwork-card" onClick={() => handleArtworkClick(artwork)}>
            <div className="artwork-image-container">
              <img src={artwork.main_image} alt={artwork.title} className="artwork-image" />
            </div>
            <div className="artwork-info">
              <h3 className="artwork-title">{artwork.title}</h3>
              <p className="artwork-dimensions">{artwork.width} x {artwork.height} cm</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
