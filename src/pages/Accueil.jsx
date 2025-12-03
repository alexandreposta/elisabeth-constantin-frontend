import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../styles/accueil.css";
import { getAllArtworks } from "../api/artworks";
import { getThumbnailFallback } from "../utils/image";
import { useMosaicAnimation } from "../hooks/useMosaicAnimation";
import SEO from "../components/SEO";
import NewsletterSubscribe from "../components/NewsletterSubscribe";
import img1 from "../assets/Salon/1.jpg";
import img2 from "../assets/Tableau_1/1.jpg";
import img3 from "../assets/Salon/3.jpg";
import img4 from "../assets/Tableau_3/1.jpg";
import img5 from "../assets/Tableau_2/1.jpg";
import img6 from "../assets/Tableau_5/1.jpg";
import img7 from "../assets/Tableau_6/3.jpg";
import card from "../assets/card.jpg";
import trefle from "../assets/trefle-a-quatre-feuilles.png";
import { FaInstagram, FaFacebookF, FaYoutube } from "react-icons/fa";
import { useTranslation } from "react-i18next";

export default function Accueil() {
  const [artworks, setArtworks] = useState([]);
  const mosaicImages = [img1, img2, img3, img4, img5, img6, img7];
  const { t } = useTranslation();
  const discoverParagraphs = t('home.discover.paragraphs');
  
  const { mosaicLayout, isAnimating, redistributeImages, imagesLoaded } = useMosaicAnimation(mosaicImages);

  useEffect(() => {
    const fetchArtworks = async () => {
      const data = await getAllArtworks();
      setArtworks(data);
    };
    fetchArtworks();
  }, []);

  return (
    <>
      <SEO 
        title={t('home.seo.title')}
        description={t('home.seo.description')}
        keywords={t('home.seo.keywords')}
        image={img1}
        url="https://elisabeth-constantin.fr/accueil"
      />
      <div className="accueil">
        <h1 className="hero-title">{t('home.heroTitle')}</h1>

      <div className="artwork-mosaic">
        {!imagesLoaded && (
          <div className="mosaic-loader">
            <div className="loader-spinner"></div>
            <p>{t('home.mosaic.loading')}</p>
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
            className="redistribute-btn"
            title={t('home.redistribute')}
            aria-label={t('home.redistribute')}
          >
            <img 
              src={trefle}
              alt="Trèfle à quatre feuilles"
              className={`trefle-icon ${isAnimating ? 'spinning' : ''}`}
            />
          </button>
        </div>
      )}

      <section className="discover-section">
        <div className="discover-container">
          <div className="left-column">
            <img
              className="discover-image"
              src={card}
              alt="Elisabeth Constantin dans son atelier"
            />

            <div className="newsletter-container">
              <h3 className="newsletter-title">{t('home.newsletter.title')}</h3>
              <p className="newsletter-sub">{t('home.newsletter.subtitle')}</p>
              <NewsletterSubscribe />
            </div>
          </div>

          <div className="discover-content">
            <h2 className="discover-title">{t('home.discover.title')}</h2>
            <div className="discover-text">
              {Array.isArray(discoverParagraphs) && discoverParagraphs.map((paragraph, index) => (
                <p key={`discover-${index}`} dangerouslySetInnerHTML={{ __html: paragraph }} />
              ))}
            </div>
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
        <h2 className="gallery-main-title">{t('home.gallery.title')}</h2>
        <div className="gallery-grid">
          {artworks.map((artwork) => (
            <Link 
              key={artwork._id} 
              to={`/tableau/${artwork._id}`}
              className="gallery-item"
            >
              <img
                className="gallery-image"
                src={getThumbnailFallback(artwork.main_image, artwork.thumbnail)}
                alt={artwork.title}
                loading="lazy"
              />
              <h3 className="gallery-title">{artwork.title}</h3>
              <p className="gallery-price">{artwork.price} €</p>
              <div className={`gallery-status ${artwork.status?.toLowerCase()}`}>
                {artwork.status || t('home.gallery.statusFallback')}
              </div>
            </Link>
          ))}
        </div>
      </section>
      </div>
    </>
  );
}
