import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { FaTrash, FaShoppingCart, FaCreditCard, FaLock } from 'react-icons/fa';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { API_URL } from '../api/config';
import SEO from '../components/SEO';
import '../styles/panier.css';

// Clé publique Stripe depuis les variables d'environnement
const STRIPE_PUBLIC_KEY = import.meta.env.VITE_STRIPE_PUBLIC_KEY;

// Vérifier que la clé Stripe est configurée
if (!STRIPE_PUBLIC_KEY || STRIPE_PUBLIC_KEY === 'pk_live_YOUR_PUBLIC_KEY_HERE') {
  console.error('❌ ERREUR: Clé publique Stripe non configurée. Vérifiez votre fichier .env');
}

// Options pour le chargement de Stripe
const stripeOptions = {
  fonts: [
    {
      cssSrc: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500&display=swap',
    },
  ],
};

// Initialiser Stripe une seule fois
const stripePromise = loadStripe(STRIPE_PUBLIC_KEY);

const CheckoutForm = ({ total, items, onSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [cardReady, setCardReady] = useState(false);
  const [cardStatus, setCardStatus] = useState('Initialisation...');
  const [buyerInfo, setBuyerInfo] = useState({
    email: '',
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    postalCode: '',
    country: 'France',
    phone: '',
  });
  
  // Vérifier l'état de Stripe dès le chargement du composant
  React.useEffect(() => {
    if (stripe) {
      setCardStatus('Formulaire de paiement prêt');
    } else {
      setCardStatus('Chargement du système de paiement...');
    }
  }, [stripe]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!stripe || !elements) {
      setError("Le système de paiement n'est pas disponible. Veuillez réessayer dans quelques instants.");
      return;
    }
    
    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      setError("Le formulaire de carte bancaire n'est pas chargé correctement.");
      return;
    }
    
    // Vérifier que la carte a été remplie
    const { error: cardError } = await stripe.createToken(cardElement);
    if (cardError) {
      setError(`Erreur de carte bancaire : ${cardError.message}`);
      return;
    }
    
    // Validation des champs obligatoires du formulaire
    const requiredFields = ['email', 'firstName', 'lastName', 'address', 'city', 'postalCode'];
    const missingFields = requiredFields.filter(field => !buyerInfo[field]);
    
    if (missingFields.length > 0) {
      setError(`Veuillez remplir tous les champs obligatoires : ${missingFields.join(', ')}`);
      return;
    }
    
    setLoading(true);
    setError(null);

    try {
      // Créer l'intention de paiement côté backend
      const response = await fetch(`${API_URL}/orders/create-payment-intent`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: items.map(item => ({
            artwork_id: item.id,
            title: item.title,
            price: item.price,
          })),
          buyer_info: buyerInfo,
          total: total,
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `Erreur serveur: ${response.status}`);
      }

      const data = await response.json();
      if (!data.client_secret) {
        throw new Error("Réponse invalide du serveur de paiement");
      }
      
      const { client_secret } = data;

      // Confirmer le paiement
      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(client_secret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: `${buyerInfo.firstName} ${buyerInfo.lastName}`,
            email: buyerInfo.email,
            address: {
              line1: buyerInfo.address,
              city: buyerInfo.city,
              postal_code: buyerInfo.postalCode,
              country: buyerInfo.country.toLowerCase(),
            },
          },
        },
      });

      if (stripeError) {
        // Messages d'erreur plus détaillés selon le type d'erreur
        switch (stripeError.type) {
          case 'card_error':
            setError(`Erreur de carte bancaire : ${stripeError.message}`);
            break;
          case 'validation_error':
            setError(`Erreur de validation : ${stripeError.message}`);
            break;
          default:
            setError(`Erreur de paiement : ${stripeError.message}`);
        }
      } else if (paymentIntent.status === 'succeeded') {
        onSuccess(paymentIntent);
      } else {
        setError(`Le paiement n'a pas abouti (statut: ${paymentIntent.status}). Veuillez réessayer.`);
      }
    } catch (err) {
      setError(`Erreur lors du paiement: ${err.message || 'Erreur inconnue'}. Veuillez réessayer.`);
      console.error('Erreur de paiement détaillée:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setBuyerInfo({
      ...buyerInfo,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="checkout-form">
      {cardStatus && (
        <div className="stripe-status-message">
          Status: {cardStatus}
        </div>
      )}
      <div className="checkout-section">
        <h3><FaLock /> Informations de facturation</h3>
        <div className="form-grid">
          <input
            type="email"
            name="email"
            placeholder="Email *"
            value={buyerInfo.email}
            onChange={handleInputChange}
            required
          />
          <input
            type="text"
            name="firstName"
            placeholder="Prénom *"
            value={buyerInfo.firstName}
            onChange={handleInputChange}
            required
          />
          <input
            type="text"
            name="lastName"
            placeholder="Nom *"
            value={buyerInfo.lastName}
            onChange={handleInputChange}
            required
          />
          <input
            type="text"
            name="phone"
            placeholder="Téléphone"
            value={buyerInfo.phone}
            onChange={handleInputChange}
          />
          <input
            type="text"
            name="address"
            placeholder="Adresse *"
            value={buyerInfo.address}
            onChange={handleInputChange}
            required
          />
          <input
            type="text"
            name="city"
            placeholder="Ville *"
            value={buyerInfo.city}
            onChange={handleInputChange}
            required
          />
          <input
            type="text"
            name="postalCode"
            placeholder="Code postal *"
            value={buyerInfo.postalCode}
            onChange={handleInputChange}
            required
          />
          <select
            name="country"
            value={buyerInfo.country}
            onChange={handleInputChange}
            required
          >
            <option value="France">France</option>
            <option value="Belgium">Belgique</option>
            <option value="Switzerland">Suisse</option>
            <option value="Spain">Espagne</option>
            <option value="Italy">Italie</option>
          </select>
        </div>
      </div>

      <div className="checkout-section">
        <h3><FaCreditCard /> Paiement sécurisé</h3>
        <p className="card-instruction">
          <strong>Formulaire de carte bancaire:</strong> Entrez les informations de votre carte ci-dessous.
        </p>
        <div className="card-element-container" onClick={() => {
          // Focus sur le composant CardElement si possible
          const stripeInputs = document.querySelectorAll('.StripeElement iframe');
          if (stripeInputs && stripeInputs.length > 0) {
            stripeInputs[0].focus();
          }
        }}>
          {stripe ? (
            <CardElement
              options={{
                style: {
                  base: {
                    fontSize: '18px',
                    lineHeight: '24px',
                    color: '#424770',
                    fontFamily: 'Arial, sans-serif',
                    fontSmoothing: 'antialiased',
                    padding: '20px',
                    '::placeholder': {
                      color: '#aab7c4',
                    },
                    ':-webkit-autofill': {
                      color: '#424770',
                    },
                  },
                  invalid: {
                    color: '#e74c3c',
                    iconColor: '#e74c3c',
                  },
                },
                hidePostalCode: true,
              }}
              onChange={(event) => {
                if (event.error) {
                  setError(event.error.message);
                } else if (event.complete) {
                  setCardReady(true);
                  setError(null);
                } else {
                  setCardReady(false);
                }
              }}
              onReady={(element) => {
                setCardStatus('Formulaire prêt');
                // Aucun besoin de focus forcé, laissons l'utilisateur cliquer sur le champ
              }}
            />
          ) : (
            <div className="stripe-loading">Chargement du formulaire de paiement...</div>
          )}
        </div>
        <p className="secure-info">
          <FaLock size={12} /> Toutes les informations sont chiffrées et sécurisées
        </p>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="legal-notice">
        <p><strong>Mentions légales :</strong></p>
        <ul>
          <li>Paiement sécurisé par Stripe</li>
          <li>Satisfaction garantie ou remboursé sous 14 jours</li>
          <li>Livraison assurée et emballage professionnel</li>
          <li>Certificat d'authenticité fourni</li>
          <li>En finalisant votre commande, vous acceptez nos <a href="/conditions-generales-vente" target="_blank" rel="noopener noreferrer">conditions générales de vente</a></li>
        </ul>
      </div>

      <div className="button-container">
        {cardStatus && (
          <div className="stripe-status-message">
            {cardStatus}
          </div>
        )}
        <button
          type="submit"
          disabled={!stripe || loading}
          className={`pay-button ${!stripe || loading ? 'disabled' : ''}`}
        >
          {loading ? 'Traitement...' : `Payer ${total.toFixed(2)} €`}
        </button>
      </div>
    </form>
  );
};

// Le composant principal du panier, enveloppé avec Elements de Stripe
const PanierContent = () => {
  const { items, removeFromCart, clearCart, getTotalPrice } = useCart();
  const [showCheckout, setShowCheckout] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [stripeError, setStripeError] = useState(null);

  const total = getTotalPrice();

  const handlePaymentSuccess = (paymentIntent) => {
    setOrderSuccess(true);
    clearCart();
    // Marquer les œuvres comme non disponibles
    items.forEach(item => {
      // API call pour mettre à jour la disponibilité
      fetch(`${API_URL}/artworks/${item.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...item,
          status: 'Vendu',
        }),
      });
    });
  };

  if (orderSuccess) {
    return (
      <div className="panier-container">
        <div className="order-success">
          <h1>🎉 Commande confirmée !</h1>
          <p>Merci pour votre achat. Vous recevrez un email de confirmation sous peu.</p>
          <p>Vos œuvres seront préparées avec soin et expédiées dans les plus brefs délais.</p>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="panier-container">
        <div className="empty-cart">
          <FaShoppingCart size={64} color="#ccc" />
          <h2>Votre panier est vide</h2>
          <p>Découvrez nos œuvres uniques dans la galerie</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEO 
        title="Mon Panier - Élisabeth Constantin"
        description="Consultez votre panier et finalisez votre commande d'œuvres d'art d'Élisabeth Constantin. Paiement sécurisé par Stripe."
        url="https://elisabeth-constantin.fr/panier"
      />
      <div className="panier-container">
      <div className="panier-header">
        <h1>Mon Panier</h1>
      </div>

      <div className="panier-content">
        <div className="cart-items">
          {items.map((item) => (
            <div key={item.id} className="cart-item">
              <img src={item.main_image} alt={item.title} className="cart-item-image" />
              <div className="cart-item-info">
                <h3>{item.title}</h3>
                <p className="cart-item-description">{item.description}</p>
                <div className="cart-item-details">
                  <span className="dimensions">{item.width} × {item.height} cm</span>
                  <span className="type">{item.type === 'paint' ? 'Peinture' : 'Tableau 3D'}</span>
                </div>
                <div className="cart-item-price">{item.price.toFixed(2)} €</div>
              </div>
              <button
                onClick={() => removeFromCart(item.id)}
                className="remove-item-btn"
                title="Supprimer du panier"
              >
                <FaTrash />
              </button>
            </div>
          ))}
        </div>

        <div className="cart-summary">
          <div className="summary-content">
            <h3>Récapitulatif</h3>
            <div className="summary-line">
              <span>Sous-total ({items.length} œuvre{items.length > 1 ? 's' : ''})</span>
              <span>{total.toFixed(2)} €</span>
            </div>
            <div className="summary-line">
              <span>Livraison</span>
              <span>Offerte</span>
            </div>
            <div className="summary-line total">
              <span>Total</span>
              <span>{total.toFixed(2)} €</span>
            </div>
            
            <div className="security-info">
              <p><FaLock /> Paiement 100% sécurisé</p>
              <p>🚚 Livraison assurée et emballage professionnel</p>
              <p>📜 Certificat d'authenticité inclus</p>
            </div>

            {stripeError && (
              <div className="stripe-error">
                <p>Erreur lors du chargement du système de paiement: {stripeError}</p>
                <p>Veuillez rafraîchir la page ou réessayer plus tard.</p>
              </div>
            )}

            <button
              onClick={() => window.location.href = '/checkout'}
              className="checkout-btn"
            >
              Procéder au paiement
            </button>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

// Composant d'export qui enveloppe le contenu du panier avec Elements de Stripe
export default function Panier() {
  return (
    <Elements stripe={stripePromise} options={stripeOptions}>
      <PanierContent />
    </Elements>
  );
}