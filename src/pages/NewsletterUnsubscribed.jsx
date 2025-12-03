import { Link } from 'react-router-dom';
import SEOHead from '../components/SEOHead';
import '../styles/newsletterPages.css';
import { useTranslation } from 'react-i18next';

export default function NewsletterUnsubscribed() {
  const { t } = useTranslation();

  return (
    <>
      <SEOHead
        title={t('newsletterPages.unsubscribed.seoTitle')}
        description={t('newsletterPages.unsubscribed.seoDescription')}
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
            {t('newsletterPages.unsubscribed.title')}
          </h1>

          <p className="newsletter-page-description">
            {t('newsletterPages.unsubscribed.description')}
          </p>

          <p className="newsletter-page-description secondary">
            {t('newsletterPages.unsubscribed.secondary')}
          </p>

          <div className="newsletter-page-actions">
            <Link to="/" className="newsletter-page-button primary">
              {t('newsletterPages.unsubscribed.button')}
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
