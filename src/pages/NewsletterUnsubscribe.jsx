import { useState, useEffect } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { unsubscribeFromNewsletter } from '../api/newsletter';
import SEOHead from '../components/SEOHead';
import '../styles/newsletterPages.css';

export default function NewsletterUnsubscribe() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleUnsubscribe = async () => {
    if (!token) {
      setError('Token de désinscription invalide');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await unsubscribeFromNewsletter(token);
      navigate('/newsletter/unsubscribed');
    } catch (err) {
      setError(err.message || 'Une erreur est survenue lors de la désinscription');
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <>
        <SEOHead
          title="Erreur - Désinscription Newsletter"
          description="Lien de désinscription invalide"
          noindex={true}
        />
        <div className="newsletter-page">
          <div className="newsletter-page-container">
            <div className="newsletter-page-icon error">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h1 className="newsletter-page-title">Lien invalide</h1>
            <p className="newsletter-page-description">
              Le lien de désinscription est invalide ou a expiré.
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

  return (
    <>
      <SEOHead
        title="Se Désinscrire - Newsletter"
        description="Confirmation de désinscription de la newsletter"
        noindex={true}
      />

      <div className="newsletter-page">
        <div className="newsletter-page-container">
          <div className="newsletter-page-icon warning">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>

          <h1 className="newsletter-page-title">
            Êtes-vous sûr de vouloir vous désinscrire ?
          </h1>

          <p className="newsletter-page-description">
            Vous ne recevrez plus nos actualités sur les nouvelles œuvres et événements à venir.
          </p>

          <p className="newsletter-page-description secondary">
            Nous serions tristes de vous voir partir... Vous pourrez toujours vous réinscrire plus tard depuis notre site.
          </p>

          {error && (
            <div className="newsletter-page-error">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          <div className="newsletter-page-actions">
            <button 
              onClick={handleUnsubscribe}
              disabled={loading}
              className="newsletter-page-button danger"
            >
              {loading ? (
                <>
                  <svg className="newsletter-page-spinner" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" fill="none" />
                  </svg>
                  <span>Désinscription en cours...</span>
                </>
              ) : (
                'Confirmer la désinscription'
              )}
            </button>
            <Link to="/" className="newsletter-page-button secondary">
              Non, rester abonné
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
