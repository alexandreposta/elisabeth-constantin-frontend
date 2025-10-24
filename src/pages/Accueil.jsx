import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../styles/accueil.css";
import { getAllArtworks } from "../api/artworks";
import { useMosaicAnimation } from "../hooks/useMosaicAnimation";
import SEO from "../components/SEO";
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

export default function Accueil() {
  const [artworks, setArtworks] = useState([]);
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterConsent, setNewsletterConsent] = useState(false);
  const [newsletterStatus, setNewsletterStatus] = useState(null);
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
    <>
      <SEO 
        title="Accueil - Élisabeth Constantin | Artiste Peintre Multiplan 3D"
        description="Découvrez l'univers artistique d'Élisabeth Constantin, artiste peintre spécialisée dans la technique unique du multiplan 3D. Explorez ses œuvres originales, peintures et créations événementielles."
        keywords="Elisabeth Constantin, artiste peintre, multiplan 3D, peinture, art contemporain, galerie art, œuvres originales, plan 3D"
        image={img1}
        url="https://elisabeth-constantin.fr/accueil"
      />
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
            title="Redistribuer les images"
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
              <h3 className="newsletter-title">Inscrivez-vous à la newsletter</h3>
              <p className="newsletter-sub">Recevez les nouveautés et offres exclusives.</p>
              <form
                className="newsletter-form"
                onSubmit={async (e) => {
                  e.preventDefault();
                  setNewsletterStatus(null);
                  try {
                    const res = await fetch('/api/newsletter/subscribe', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ email: newsletterEmail, consent_accepted: newsletterConsent })
                    });
                    if (res.ok) {
                      setNewsletterStatus({ ok: true, msg: 'Email envoyé. Vérifiez votre boîte pour confirmer.' });
                    } else {
                      const json = await res.json();
                      setNewsletterStatus({ ok: false, msg: json.detail || 'Erreur lors de l\'envoi.' });
                    }
                  } catch (err) {
                    setNewsletterStatus({ ok: false, msg: 'Erreur réseau. Veuillez réessayer.' });
                  }
                }}
              >
                <input
                  type="email"
                  placeholder="Votre email"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  required
                  className="newsletter-input"
                />
                <label className="newsletter-consent">
                  <input type="checkbox" checked={newsletterConsent} onChange={(e) => setNewsletterConsent(e.target.checked)} />
                  <span>J'accepte la politique de confidentialité</span>
                </label>
                <button className="newsletter-submit" type="submit">S'inscrire</button>
              </form>
              {newsletterStatus && (
                <div className={`newsletter-status ${newsletterStatus.ok ? 'ok' : 'error'}`}>
                  {newsletterStatus.msg}
                </div>
              )}
            </div>
          </div>

          <div className="discover-content">
            <h2 className="discover-title">Mon univers</h2>
            <p className="discover-text">
              Dès l'enfance, je suis attirée par l'art.
              Formée à Lyon, je construis depuis plus de 25 ans une œuvre ancrée dans le geste pictural, la couleur et l'observation du réel.<br/><br/>
              
              En 2017, un tournant majeur se produit : j'abandonne le support classique au profit d'un matériau transparent — le verre synthétique.
              Je l'apprivoise et le transforme en territoire d'expérimentation.<br/><br/>
              
              Ces strates transparentes, une fois superposées, donnent naissance à une image tridimensionnelle suspendue dans l'espace.<br/><br/>
              
              <strong>Procédé et perception</strong><br/>
              L'œuvre devient mouvement : elle vit à travers les déplacements du spectateur, les jeux d'ombre, de lumière et de transparence.
              Selon l'angle ou l'éclairage, les lignes se décalent, des formes apparaissent ou disparaissent, et la profondeur se modifie.<br/><br/>

              <strong>Le pourquoi</strong><br/>
              Mon travail s'inscrit dans une recherche visant à dépasser l'image fixe.
              Chaque œuvre interroge notre perception : elle devient à la fois image et volume, une peinture vivante et changeante.
              L'œuvre ne se lit pas d'un seul point de vue : elle se révèle dans le dialogue avec le regard.
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
          {artworks.map((artwork) => (
            <Link 
              key={artwork._id} 
              to={`/tableau/${artwork._id}`}
              className="gallery-item"
            >
              <img
                className="gallery-image"
                src={artwork.main_image}
                alt={artwork.title}
                loading="lazy"
              />
              <h3 className="gallery-title">{artwork.title}</h3>
              <p className="gallery-price">{artwork.price} €</p>
              <div className={`gallery-status ${artwork.status?.toLowerCase()}`}>
                {artwork.status || 'Non défini'}
              </div>
            </Link>
          ))}
        </div>
      </section>
      </div>
    </>
  );
}
