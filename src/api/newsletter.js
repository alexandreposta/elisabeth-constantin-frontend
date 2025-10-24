import { API_URL } from './config';

/**
 * API Newsletter avec double opt-in Mailjet
 */

/**
 * Inscription à la newsletter (double opt-in)
 * Envoie un email de confirmation
 */
export const subscribeToNewsletter = async (email, consentAccepted = true) => {
  const response = await fetch(`${API_URL}/newsletter/subscribe`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email,
      consent_accepted: consentAccepted
    })
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'Erreur lors de l\'inscription' }));
    throw new Error(error.detail || 'Erreur lors de l\'inscription');
  }

  return await response.json();
};

/**
 * Renvoyer l'email de confirmation
 */
export const resendConfirmation = async (email) => {
  const response = await fetch(`${API_URL}/newsletter/resend-confirmation`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email })
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'Erreur lors du renvoi' }));
    throw new Error(error.detail || 'Erreur lors du renvoi de l\'email');
  }

  return await response.json();
};

/**
 * Désinscription de la newsletter
 */
export const unsubscribeFromNewsletter = async (token, reason = null) => {
  const response = await fetch(`${API_URL}/newsletter/unsubscribe`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ token, reason })
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'Erreur lors de la désinscription' }));
    throw new Error(error.detail || 'Erreur lors de la désinscription');
  }

  return await response.json();
};

/**
 * Récupérer les statistiques (admin)
 */
export const getNewsletterStats = async () => {
  const response = await fetch(`${API_URL}/newsletter/stats`);

  if (!response.ok) {
    throw new Error('Erreur lors de la récupération des statistiques');
  }

  return await response.json();
};
