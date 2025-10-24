import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { FaLock, FaCreditCard, FaPaypal, FaArrowLeft, FaCheck, FaExclamationTriangle } from 'react-icons/fa';
import { API_URL } from '../api/config';
import SEO from '../components/SEO';
import '../styles/checkout.css';

// Récupérer la clé publique depuis les variables d'environnement
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

// Options pour le formulaire Stripe
const stripeOptions = {
  fonts: [{ cssSrc: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap' }],
  locale: 'fr',
};

// Mappage des pays vers les codes ISO à 2 caractères pour Stripe
const countryToIsoCode = {
  'France': 'FR',
  'Belgium': 'BE',
  'Switzerland': 'CH',
  'Spain': 'ES',
  'Italy': 'IT',
  // Ajout des versions en français comme elles apparaissent dans le select
  'Belgique': 'BE',
  'Suisse': 'CH',
  'Espagne': 'ES',
  'Italie': 'IT'
};

// Composant pour le formulaire de paiement
const CheckoutForm = ({ confirmedOrder, setConfirmedOrder }) => {
  const navigate = useNavigate();
  const { items, clearCart, getTotalPrice } = useCart();
  const stripe = useStripe();
  const elements = useElements();
  
  const [step, setStep] = useState(1); // 1: Informations, 2: Paiement, 3: Confirmation
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [cardComplete, setCardComplete] = useState(false);
  const [paymentCompleted, setPaymentCompleted] = useState(false); // Nouveau état pour éviter la redirection après paiement
  
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

  const total = getTotalPrice();

  useEffect(() => {
    // Rediriger vers le panier si celui-ci est vide ET que le paiement n'est pas terminé
    if (items.length === 0 && !paymentCompleted) {
      navigate('/panier');
    }
  }, [items, navigate, paymentCompleted]);

  const handleInputChange = (e) => {
    setBuyerInfo({
      ...buyerInfo,
      [e.target.name]: e.target.value,
    });
  };

  const handlePaymentMethodChange = (method) => {
    setPaymentMethod(method);
  };

  const validateStep1 = () => {
    const required = ['email', 'firstName', 'lastName', 'address', 'city', 'postalCode'];
    const missing = required.filter(field => !buyerInfo[field]);
    
    if (missing.length > 0) {
      setError('Veuillez remplir tous les champs obligatoires.');
      return false;
    }
    
    // Validation email basique
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(buyerInfo.email)) {
      setError('Veuillez entrer une adresse email valide.');
      return false;
    }
    
    setError(null);
    return true;
  };

  const goToStep2 = () => {
    if (validateStep1()) {
      setStep(2);
      setError(null);
    }
  };

  const goToStep3 = async (e) => {
    e.preventDefault();
    
    if (!stripe || !elements) {
      setError("Le système de paiement n'est pas encore prêt. Veuillez patienter.");
      return;
    }

    if (paymentMethod === 'card' && !cardComplete) {
      setError("Veuillez compléter les informations de votre carte.");
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
        console.error('❌ Erreur serveur:', errorData);
        throw new Error(errorData.detail || `Erreur serveur: ${response.status}`);
      }

      const responseData = await response.json();
      
      const { client_secret } = responseData;
      
      if (!client_secret) {
        throw new Error('Aucune clé secrète reçue du serveur');
      }

      // Convertir le nom du pays en code ISO
      const countryCode = countryToIsoCode[buyerInfo.country] || 'FR';
      
      // Confirmer le paiement
      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(client_secret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: {
            name: `${buyerInfo.firstName} ${buyerInfo.lastName}`,
            email: buyerInfo.email,
            address: {
              line1: buyerInfo.address,
              city: buyerInfo.city,
              postal_code: buyerInfo.postalCode,
              country: countryCode,
            },
          },
        },
      });

      if (stripeError) {
        console.error('❌ Erreur Stripe:', stripeError);
        throw new Error(stripeError.message);
      }

      if (paymentIntent && paymentIntent.status === 'succeeded') {
        // Marquer le paiement comme terminé pour éviter la redirection
        setPaymentCompleted(true);
        
        // Stocker les détails de la commande avant de vider le panier
        const orderDetails = {
          items: [...items], // Copie des items
          buyerInfo: { ...buyerInfo }, // Copie des infos acheteur
          total: total,
          paymentId: paymentIntent.id,
          orderDate: new Date().toISOString(),
        };
        setConfirmedOrder(orderDetails);
        
        // Mettre à jour les œuvres comme non disponibles
        await Promise.all(items.map(item => 
          fetch(`${API_URL}/artworks/${item.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...item, status: 'Vendu' }),
          })
        ));
        
        setStep(3);
        
        // Délai avant de vider le panier pour permettre l'affichage de la confirmation
        setTimeout(() => {
          clearCart();
        }, 1000); // Réduire le délai à 1 seconde car on a sauvegardé les détails
        
      } else {
        throw new Error(`Le paiement n'a pas abouti. Statut: ${paymentIntent?.status || 'inconnu'}`);
      }
    } catch (err) {
      console.error('❌ Erreur complète de paiement:', err);
      setError(`Erreur de paiement: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const renderStep1 = () => (
    <div className="checkout-step">
      <h2>Informations de livraison</h2>
      <div className="form-grid">
        <div className="form-group">
          <label htmlFor="email">Email *</label>
          <input
            type="email"
            id="email"
            name="email"
            value={buyerInfo.email}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="firstName">Prénom *</label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            value={buyerInfo.firstName}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="lastName">Nom *</label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            value={buyerInfo.lastName}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="phone">Téléphone</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={buyerInfo.phone}
            onChange={handleInputChange}
          />
        </div>
        <div className="form-group full-width">
          <label htmlFor="address">Adresse *</label>
          <input
            type="text"
            id="address"
            name="address"
            value={buyerInfo.address}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="city">Ville *</label>
          <input
            type="text"
            id="city"
            name="city"
            value={buyerInfo.city}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="postalCode">Code postal *</label>
          <input
            type="text"
            id="postalCode"
            name="postalCode"
            value={buyerInfo.postalCode}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="country">Pays *</label>
          <select
            id="country"
            name="country"
            value={buyerInfo.country}
            onChange={handleInputChange}
            required
          >
            <option value="France">France</option>
            <option value="Belgique">Belgique</option>
            <option value="Suisse">Suisse</option>
            <option value="Espagne">Espagne</option>
            <option value="Italie">Italie</option>
          </select>
        </div>
      </div>
      <div className="checkout-actions">
        <button type="button" className="back-button" onClick={() => navigate('/panier')}>
          <FaArrowLeft /> Retour au panier
        </button>
        <button type="button" className="next-button" onClick={goToStep2}>
          Continuer vers le paiement
        </button>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="checkout-step">
      <h2>Méthode de paiement</h2>
      
      <div className="payment-methods">
        <div 
          className={`payment-method ${paymentMethod === 'card' ? 'selected' : ''}`}
          onClick={() => handlePaymentMethodChange('card')}
        >
          <div className="payment-method-icon"><FaCreditCard /></div>
          <div className="payment-method-details">
            <span>Carte bancaire</span>
            <small>Visa, Mastercard, American Express</small>
          </div>
          <div className="payment-method-check">
            {paymentMethod === 'card' && <FaCheck />}
          </div>
        </div>
        
        {/* Cette option est désactivée mais montre la possibilité d'ajouter d'autres méthodes */}
        <div className="payment-method disabled">
          <div className="payment-method-icon"><FaPaypal /></div>
          <div className="payment-method-details">
            <span>PayPal</span>
            <small>Bientôt disponible</small>
          </div>
        </div>
      </div>
      
      {paymentMethod === 'card' && (
        <div className="card-section">
          <h3>Détails de la carte</h3>
          <div className="card-element-container">
            <CardElement
              options={{
                hidePostalCode: true,
                style: {
                  base: {
                    fontSize: '16px',
                    color: '#32325d',
                    fontFamily: 'Inter, sans-serif',
                    fontSmoothing: 'antialiased',
                    '::placeholder': {
                      color: '#aab7c4',
                    },
                  },
                  invalid: {
                    color: '#e53935',
                    iconColor: '#e53935',
                  },
                },
              }}
              onChange={(e) => {
                setCardComplete(e.complete);
                if (e.error) {
                  setError(e.error.message);
                } else {
                  setError(null);
                }
              }}
            />
          </div>
        </div>
      )}
      
      <div className="secure-payment-info">
        <FaLock /> Paiement sécurisé - Toutes vos données sont chiffrées
      </div>
      
      <div className="checkout-actions">
        <button type="button" className="back-button" onClick={() => setStep(1)}>
          <FaArrowLeft /> Retour
        </button>
        <button
          type="submit"
          className="pay-button"
          disabled={loading || (paymentMethod === 'card' && !cardComplete)}
          onClick={goToStep3}
        >
          {loading ? 'Traitement...' : `Payer ${total.toFixed(2)} €`}
        </button>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="checkout-step success-step">
      <div className="success-icon">✓</div>
      <h2>Commande confirmée !</h2>
      <p>Merci pour votre achat. Un email de confirmation a été envoyé à <strong>{confirmedOrder?.buyerInfo?.email || buyerInfo.email}</strong>.</p>
      <p>Vos œuvres seront préparées avec soin et expédiées dans les meilleurs délais.</p>
      
      {/* Afficher les détails de la commande confirmée */}
      {confirmedOrder && (
        <div className="order-details">
          <h3>Détails de votre commande</h3>
          <div className="order-summary">
            <div className="order-items">
              {confirmedOrder.items.map(item => (
                <div className="order-item" key={item.id}>
                  <img src={item.main_image} alt={item.title} className="item-thumbnail-small" />
                  <div className="item-details">
                    <h4>{item.title}</h4>
                    <div className="item-specs">
                      {item.width}×{item.height} cm • {item.type === 'paint' ? 'Peinture' : 'Tableau 3D'}
                    </div>
                    <div className="item-price">{item.price.toFixed(2)} €</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="order-total">
              <strong>Total payé: {confirmedOrder.total.toFixed(2)} €</strong>
            </div>
            <div className="order-info">
              <p><strong>Référence:</strong> {confirmedOrder.paymentId}</p>
              <p><strong>Date:</strong> {new Date(confirmedOrder.orderDate).toLocaleString('fr-FR')}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="checkout-form">
      <div className="checkout-steps-indicator">
        <div className={`step ${step >= 1 ? 'active' : ''} ${step > 1 ? 'completed' : ''}`}>
          <div className="step-number">1</div>
          <div className="step-name">Informations</div>
        </div>
        <div className="step-connector"></div>
        <div className={`step ${step >= 2 ? 'active' : ''} ${step > 2 ? 'completed' : ''}`}>
          <div className="step-number">2</div>
          <div className="step-name">Paiement</div>
        </div>
        <div className="step-connector"></div>
        <div className={`step ${step >= 3 ? 'active' : ''}`}>
          <div className="step-number">3</div>
          <div className="step-name">Confirmation</div>
        </div>
      </div>
      
      {error && (
        <div className="checkout-error">
          <FaExclamationTriangle /> {error}
        </div>
      )}
      
      <form onSubmit={(e) => e.preventDefault()}>
        {step === 1 && renderStep1()}
        {step === 2 && renderStep2()}
        {step === 3 && renderStep3()}
      </form>
    </div>
  );
};

// Composant principal qui enveloppe le formulaire avec Elements
export default function Checkout() {
  const { items } = useCart();
  const navigate = useNavigate();
  const [confirmedOrder, setConfirmedOrder] = useState(null);
  
  useEffect(() => {
    if (items.length === 0 && !confirmedOrder) {
      navigate('/panier');
    }
  }, [items, navigate, confirmedOrder]);
  
  return (
    <>
      <SEO 
        title="Paiement Sécurisé - Élisabeth Constantin"
        description="Finalisez votre achat en toute sécurité. Paiement par carte bancaire sécurisé via Stripe."
        url="https://elisabeth-constantin.fr/checkout"
      />
      <div className="checkout-container">
      <div className="checkout-main">
        <div className="checkout-content">
          <Elements stripe={stripePromise} options={stripeOptions}>
            <CheckoutForm confirmedOrder={confirmedOrder} setConfirmedOrder={setConfirmedOrder} />
          </Elements>
        </div>
        
        <CheckoutSummary confirmedOrder={confirmedOrder} />
      </div>
    </div>
    </>
  );
}

// Composant séparé pour le résumé de commande
const CheckoutSummary = ({ confirmedOrder }) => {
  const { items } = useCart();
  
  // Utiliser soit les items du panier, soit ceux de la commande confirmée
  const displayItems = confirmedOrder?.items || items;
  const displayTotal = confirmedOrder?.total || items.reduce((sum, item) => sum + item.price, 0);
  
  return (
    <div className="checkout-summary">
      <h3>Récapitulatif de commande</h3>
      <div className="checkout-items">
        {displayItems.map(item => (
          <div className="checkout-item" key={item.id}>
            <img src={item.main_image} alt={item.title} className="item-thumbnail" />
            <div className="item-details">
              <h4>{item.title}</h4>
              <div className="item-specs">
                {item.width}×{item.height} cm • {item.type === 'paint' ? 'Peinture' : 'Tableau 3D'}
              </div>
              <div className="item-price">{item.price.toFixed(2)} €</div>
            </div>
          </div>
        ))}
      </div>
      <div className="checkout-summary-totals">
        <div className="summary-row">
          <span>Sous-total</span>
          <span>{displayTotal.toFixed(2)} €</span>
        </div>
        <div className="summary-row">
          <span>Livraison</span>
          <span>Offerte</span>
        </div>
        <div className="summary-row total">
          <span>Total</span>
          <span>{displayTotal.toFixed(2)} €</span>
        </div>
        {confirmedOrder && (
          <div className="summary-row confirmed">
            <span>✓ Commande confirmée</span>
          </div>
        )}
      </div>
    </div>
  );
};
