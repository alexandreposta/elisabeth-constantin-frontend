import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../styles/accueil.css";
import { getAllArtworks } from "../api/artworks";
import { useMosaicAnimation } from "../hooks/useMosaicAnimation";
import img1 from "../assets/Salon/1.jpg";
import img2 from "../assets/Tableau_1/1.jpg";
import img3 from "../assets/Salon/3.jpg";
import img4 from "../assets/Tableau_3/1.jpg";
import img5 from "../assets/Tableau_2/1.jpg";
import img6 from "../assets/Tableau_5/1.jpg";
import img7 from "../assets/Tableau_6/3.jpg";
import card from "../assets/card.jpg";
import { FaInstagram, FaFacebookF, FaYoutube, FaRecycle } from "react-icons/fa";

export default function Accueil() {
  const [artworks, setArtworks] = useState([]);
  const mosaicImages = [img1, img2, img3, img4, img5, img6, img7];
  
  const { mosaicLayout, isAnimating, redistributeImages, imagesLoaded } = useMosaicAnimation(mosaicImages);

  useEffect(() => {
    const fetchArtworks = async () => {
      const data = await getAllArtworks();
      setArtworks(data);
    };
    fetchArtworks();
  }, []);

  return (
    <div className="accueil">
      <h1 className="hero-title">Elisabeth Constantin</h1>

      <div className="artwork-mosaic">
        {!imagesLoaded && (
          <div className="mosaic-loader">
            <div className="loader-spinner"></div>
            <p>Chargement de la galerie...</p>
          </div>
        )}
        {imagesLoaded && mosaicLayout.map((item, index) => (
          <div 
            key={`${item.id}-${index}`}
            className={`mosaic-item-absolute ${item.animationClass || ''}`}
            style={{
              position: 'absolute',
              left: `${item.x}px`,
              top: `${item.y}px`,
              width: `${item.width}px`,
              height: `${item.height}px`,
              opacity: item.opacity,
              transition: 'opacity 0.6s ease, transform 0.3s ease',
              zIndex: 1
            }}
          >
            <img 
              src={item.src} 
              alt={`Œuvre ${item.id + 1}`}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                borderRadius: '8px',
                transition: 'transform 0.6s ease, box-shadow 0.6s ease'
              }}
            />
          </div>
        ))}
      </div>

      {imagesLoaded && (
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <button
            onClick={redistributeImages}
            disabled={isAnimating}
            style={{
              width: '60px',
              height: '60px',
              background: isAnimating ? '#bdc3c7' : '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '50%',
              cursor: isAnimating ? 'not-allowed' : 'pointer',
              fontSize: '1.5rem',
              transition: 'all 0.3s ease',
              boxShadow: isAnimating ? 'none' : '0 4px 15px rgba(108, 117, 125, 0.3)',
              transform: isAnimating ? 'scale(0.95)' : 'scale(1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto'
            }}
            title="Redistribuer les images"
          >
            <FaRecycle 
              style={{
                animation: isAnimating ? 'spin 1s linear infinite' : 'none'
              }}
            />
          </button>
        </div>
      )}

      <section className="discover-section">
        <div className="discover-container">
          <img
            className="discover-image"
            src={card}
            alt="Elisabeth Constantin dans son atelier"
          />
          <div className="discover-content">
            <h2 className="discover-title">Découvrez mon univers...</h2>
            <p className="discover-text">
              Passionnée par mon métier, je m'investis dans la création et les projets artistiques depuis plus de 20 ans.<br/><br/>
              Mon style s'imprègne de ce qui m'entoure : je trace par des croquis les idées, saisies avec une exécution rapide qui engendre d'autres idées...
            </p>
            <div className="social-links">
              <a className="social-icon" href="https://www.instagram.com/elisabeth_constantin/?hl=fr" target="_blank" rel="noopener noreferrer">
                <FaInstagram />
              </a>
              <a className="social-icon" href="https://www.facebook.com/Elisabethconstantin.8/" target="_blank" rel="noopener noreferrer">
                <FaFacebookF />
              </a>
              <a className="social-icon" href="https://www.youtube.com/@elisabethconstantin" target="_blank" rel="noopener noreferrer">
                <FaYoutube />
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="gallery-section">
        <h2 className="gallery-main-title">Galerie</h2>
        <div className="gallery-grid">
          {artworks.slice(0, 8).map((artwork) => (
            <Link 
              key={artwork._id} 
              to={`/tableau/${artwork._id}`}
              className="gallery-item"
            >
              <img
                className="gallery-image"
                src={artwork.main_image}
                alt={artwork.title}
              />
              <h3 className="gallery-title">{artwork.title}</h3>
              <p className="gallery-price">{artwork.price} €</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
