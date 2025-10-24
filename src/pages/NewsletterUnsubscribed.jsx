import { Link } from 'react-router-dom';
import SEOHead from '../components/SEOHead';
import '../styles/newsletterPages.css';

export default function NewsletterUnsubscribed() {
  return (
    <>
      <SEOHead
        title="Désinscription Réussie - Newsletter"
        description="Vous avez été désinscrit de la newsletter"
        noindex={true}
      />

      <div className="newsletter-page">
        <div className="newsletter-page-container">
          <div className="newsletter-page-icon info">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>

          <h1 className="newsletter-page-title">
            Désinscription réussie
          </h1>

          <p className="newsletter-page-description">
            Vous avez été désinscrit de notre newsletter. Vous ne recevrez plus d'emails de notre part.
          </p>

          <p className="newsletter-page-description secondary">
            Nous sommes désolés de vous voir partir. Si vous changez d'avis, vous pouvez vous réinscrire à tout moment depuis notre site.
          </p>

          <div className="newsletter-page-actions">
            <Link to="/" className="newsletter-page-button primary">
              Retour à l'accueil
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
