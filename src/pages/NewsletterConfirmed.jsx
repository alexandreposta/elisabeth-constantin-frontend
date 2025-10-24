import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import SEOHead from '../components/SEOHead';
import '../styles/newsletter.css';
import '../styles/newsletterPages.css';

export default function NewsletterConfirmed() {
  const [searchParams] = useSearchParams();
  const promoCode = searchParams.get('promo');
  const already = searchParams.get('already') === 'true';
  const [copied, setCopied] = useState(false);

  const copyPromoCode = () => {
    if (promoCode) {
      navigator.clipboard.writeText(promoCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <>
      <SEOHead
        title="Inscription Confirmée - Newsletter"
        description="Merci pour votre inscription à la newsletter d'Élisabeth Constantin"
        noindex={true}
      />

      <div className="newsletter-page">
        <div className="newsletter-page-container">
          <div className="newsletter-page-icon success">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>

          <h1 className="newsletter-page-title">
            {already ? 'Déjà inscrit !' : 'Inscription confirmée !'}
          </h1>

          <p className="newsletter-page-description">
            {already 
              ? 'Votre email était déjà confirmé. Vous recevrez nos prochaines actualités.'
              : 'Merci d\'avoir confirmé votre inscription à notre newsletter ! Vous recevrez désormais en avant-première nos nouvelles œuvres et événements.'
            }
          </p>

          {promoCode && (
            <div className="promo-code-section">
              <p className="promo-code-text">
                Voici votre code promo de bienvenue :
              </p>
              <div className="promo-code-box">
                <code className="promo-code">{promoCode}</code>
                <button 
                  onClick={copyPromoCode}
                  className="promo-code-copy"
                  aria-label="Copier le code promo"
                >
                  {copied ? (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  )}
                </button>
              </div>
              <p className="promo-code-info">
                Bénéficiez de <strong>10% de réduction</strong> sur votre prochaine commande
              </p>
            </div>
          )}

          <div className="newsletter-page-actions">
            <Link to="/" className="newsletter-page-button primary">
              Découvrir les œuvres
            </Link>
            <Link to="/evenements" className="newsletter-page-button secondary">
              Voir les événements
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
