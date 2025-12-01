import { useState } from 'react';
import { subscribeToNewsletter } from '../api/newsletter';
import '../styles/newsletter.css';

export default function NewsletterSubscribe() {
  const [email, setEmail] = useState('');
  const [consent, setConsent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null); // 'success' | 'error' | null
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!consent) {
      setStatus('error');
      setMessage('Vous devez accepter de recevoir des emails pour vous inscrire.');
      return;
    }

    setLoading(true);
    setStatus(null);
    setMessage('');

    try {
      const data = await subscribeToNewsletter(email, consent);
      setStatus('success');
      setMessage('📧 Email de confirmation envoyé ! Vérifiez votre boîte email pour confirmer votre inscription.');
      setEmail('');
      setConsent(false);
    } catch (err) {
      setStatus('error');
      if (err.message.includes('409') || err.message.includes('déjà abonné')) {
        setMessage('Cet email est déjà inscrit à la newsletter.');
      } else {
        setMessage(err.message || 'Une erreur est survenue. Veuillez réessayer.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="newsletter-container">
      <form onSubmit={handleSubmit} className="newsletter-form">
        <div className="newsletter-input-group">
          <input
            type="email"
            placeholder="votre@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="newsletter-input"
            aria-label="Adresse email"
          />
          <button 
            type="submit" 
            disabled={loading || !email}
            className="newsletter-button"
          >
            {loading ? (
              <span className="newsletter-button-loading">
                <svg className="spinner" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" fill="none" />
                </svg>
              </span>
            ) : (
              <span>S'inscrire</span>
            )}
          </button>
        </div>

        <label className="newsletter-consent">
          <input
            type="checkbox"
            checked={consent}
            onChange={(e) => setConsent(e.target.checked)}
            className="newsletter-checkbox"
          />
          <span className="newsletter-consent-text">
            J'accepte de recevoir des emails et j'ai lu la{' '}
            <a href="/politique-confidentialite" className="newsletter-link">
              politique de confidentialité
            </a>
          </span>
        </label>

        {status && (
          <div className={`newsletter-message newsletter-message-${status}`}>
            <div className="newsletter-message-icon">
              {status === 'success' ? '✓' : '!'}
            </div>
            <p className="newsletter-message-text">{message}</p>
          </div>
        )}
      </form>
    </div>
  );
}
