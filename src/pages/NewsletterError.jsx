import { useSearchParams, Link } from 'react-router-dom';
import SEOHead from '../components/SEOHead';
import '../styles/newsletterPages.css';

const ERROR_MESSAGES = {
  invalid_token: {
    title: 'Lien invalide',
    message: 'Ce lien de confirmation n\'est plus valide ou a déjà été utilisé.',
    help: 'Le lien de confirmation expire après 48 heures. Vous pouvez demander un nouveau lien depuis notre formulaire d\'inscription.'
  },
  not_found: {
    title: 'Email non trouvé',
    message: 'Aucune inscription ne correspond à cet email.',
    help: 'Veuillez vérifier que vous utilisez le bon lien ou réessayer de vous inscrire.'
  },
  update_failed: {
    title: 'Erreur de mise à jour',
    message: 'Une erreur est survenue lors de la mise à jour de votre inscription.',
    help: 'Veuillez réessayer plus tard ou nous contacter si le problème persiste.'
  },
  invalid_unsubscribe_token: {
    title: 'Lien de désinscription invalide',
    message: 'Ce lien de désinscription n\'est plus valide.',
    help: 'Veuillez utiliser le lien présent dans l\'email le plus récent que vous avez reçu.'
  },
  unsubscribe_failed: {
    title: 'Erreur de désinscription',
    message: 'Une erreur est survenue lors de la désinscription.',
    help: 'Veuillez réessayer ou nous contacter directement.'
  },
  default: {
    title: 'Une erreur est survenue',
    message: 'Nous n\'avons pas pu traiter votre demande.',
    help: 'Veuillez réessayer plus tard ou nous contacter si le problème persiste.'
  }
};

export default function NewsletterError() {
  const [searchParams] = useSearchParams();
  const reason = searchParams.get('reason') || 'default';
  const error = ERROR_MESSAGES[reason] || ERROR_MESSAGES.default;

  return (
    <>
      <SEOHead
        title="Erreur - Newsletter"
        description="Une erreur est survenue"
        noindex={true}
      />

      <div className="newsletter-page">
        <div className="newsletter-page-container">
          <div className="newsletter-page-icon error">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>

          <h1 className="newsletter-page-title">
            {error.title}
          </h1>

          <p className="newsletter-page-description">
            {error.message}
          </p>

          <p className="newsletter-page-description secondary">
            {error.help}
          </p>

          <div className="newsletter-page-actions">
            <Link to="/" className="newsletter-page-button primary">
              Retour à l'accueil
            </Link>
            <a 
              href="mailto:contact@elisabeth-constantin.fr" 
              className="newsletter-page-button secondary"
            >
              Nous contacter
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
