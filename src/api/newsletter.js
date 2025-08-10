import { API_URL } from './config';

export const subscribeToNewsletter = async (email) => {
  console.log('🔵 [Newsletter] Début de l\'abonnement pour:', email);
  
  try {
    const url = `${API_URL}/newsletter/subscribe`;
    console.log('🔵 [Newsletter] URL appelée:', url);
    console.log('🔵 [Newsletter] API_URL value:', API_URL);
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    console.log('🔵 [Newsletter] Réponse reçue, status:', response.status);
    console.log('🔵 [Newsletter] Response OK:', response.ok);

    const data = await response.json();
    console.log('🔵 [Newsletter] Données reçues:', data);

    if (!response.ok) {
      console.error('❌ [Newsletter] Erreur HTTP:', response.status, data);
      throw new Error(data.detail || 'Erreur lors de l\'inscription');
    }

    console.log('✅ [Newsletter] Abonnement réussi:', data);
    return data;
  } catch (error) {
    console.error('❌ [Newsletter] Erreur complète:', error);
    console.error('❌ [Newsletter] Error message:', error.message);
    console.error('❌ [Newsletter] Error stack:', error.stack);
    throw error;
  }
};

export const unsubscribeFromNewsletter = async (token) => {
  try {
    const response = await fetch(`${API_URL}/newsletter/unsubscribe/${token}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.detail || 'Erreur lors de la désinscription');
    }

    return data;
  } catch (error) {
    console.error('Erreur newsletter unsubscription:', error);
    throw error;
  }
};

export const checkNewsletterDiscount = async (email) => {
  try {
    const response = await fetch(`${API_URL}/orders/check-newsletter-discount`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.detail || 'Erreur lors de la vérification');
    }

    return data;
  } catch (error) {
    console.error('Erreur newsletter discount check:', error);
    throw error;
  }
};
