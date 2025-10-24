import { useState } from 'react';
import { API_URL } from '../api/config';
import '../styles/newsletter.css';

export default function NewsletterSubscribe() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [promo, setPromo] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    setError(null);
    setPromo(null);

    try {
      const res = await fetch(`${API_URL}/subscribe/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      if (res.status === 409) {
        setError('Cet email est déjà abonné.');
        setLoading(false);
        return;
      }

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.detail || 'Erreur lors de l abonnement');
      }

      const data = await res.json();
      setMessage('Merci ! Vous êtes abonné(e) à la newsletter.');
      setPromo(data.promo_code || null);
      setEmail('');
    } catch (err) {
      console.error(err);
      setError(err.message || 'Erreur réseau');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="newsletter-subscribe">
      <form onSubmit={handleSubmit} className="newsletter-form">
        <label htmlFor="newsletter-email">Inscrivez-vous à la newsletter</label>
        <div className="newsletter-input-row">
          <input
            id="newsletter-email"
            type="email"
            placeholder="Votre email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button type="submit" disabled={loading}>{loading ? 'Envoi...' : "S'abonner"}</button>
        </div>
      </form>

      {message && (
        <div className="newsletter-success">
          <p>{message}</p>
          {promo && <p>Voici votre code promo : <strong>{promo}</strong> (10% sur votre prochaine commande)</p>}
        </div>
      )}

      {error && (
        <div className="newsletter-error">{error}</div>
      )}
    </div>
  );
}
