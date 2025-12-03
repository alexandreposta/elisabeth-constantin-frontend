import { useSearchParams, Link } from 'react-router-dom';
import SEOHead from '../components/SEOHead';
import '../styles/newsletterPages.css';
import { useTranslation } from 'react-i18next';

export default function NewsletterError() {
  const [searchParams] = useSearchParams();
  const reason = searchParams.get('reason') || 'default';
  const { t } = useTranslation();
  const errorMessages = t('newsletterPages.error.reasons', { returnObjects: true });
  const error = errorMessages[reason] || errorMessages.default;

  return (
    <>
      <SEOHead
        title={t('newsletterPages.error.seoTitle')}
        description={t('newsletterPages.error.seoDescription')}
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
              {t('newsletterPages.error.buttons.home')}
            </Link>
            <a 
              href="mailto:contact@elisabeth-constantin.fr" 
              className="newsletter-page-button secondary"
            >
              {t('newsletterPages.error.buttons.contact')}
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
