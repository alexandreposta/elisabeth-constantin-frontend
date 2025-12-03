import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import SEOHead from '../components/SEOHead';
import '../styles/newsletter.css';
import '../styles/newsletterPages.css';
import { useTranslation } from 'react-i18next';

export default function NewsletterConfirmed() {
  const [searchParams] = useSearchParams();
  const promoCode = searchParams.get('promo');
  const already = searchParams.get('already') === 'true';
  const [copied, setCopied] = useState(false);
  const { t } = useTranslation();

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
        title={t('newsletterPages.confirmed.seoTitle')}
        description={t('newsletterPages.confirmed.seoDescription')}
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
            {already ? t('newsletterPages.confirmed.titleAlready') : t('newsletterPages.confirmed.title')}
          </h1>

          <p className="newsletter-page-description">
            {already 
              ? t('newsletterPages.confirmed.descriptionAlready')
              : t('newsletterPages.confirmed.description')
            }
          </p>

          {promoCode && (
            <div className="promo-code-section">
              <p className="promo-code-text">
                {t('newsletterPages.confirmed.promoLabel')}
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
              <p className="promo-code-info" dangerouslySetInnerHTML={{ __html: t('newsletterPages.confirmed.promoInfo') }} />
            </div>
          )}

          <div className="newsletter-page-actions">
            <Link to="/" className="newsletter-page-button primary">
              {t('newsletterPages.confirmed.buttons.discover')}
            </Link>
            <Link to="/evenements" className="newsletter-page-button secondary">
              {t('newsletterPages.confirmed.buttons.events')}
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
