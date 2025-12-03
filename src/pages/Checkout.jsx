import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { FaLock, FaCreditCard, FaPaypal, FaArrowLeft, FaCheck, FaExclamationTriangle } from 'react-icons/fa';
import { API_URL } from '../api/config';
import SEO from '../components/SEO';
import '../styles/checkout.css';
import { useTranslation, Trans } from 'react-i18next';

// Récupérer la clé publique depuis les variables d'environnement
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

// Options pour le formulaire Stripe
const stripeOptions = {
  fonts: [{ cssSrc: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap' }],
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
const CheckoutForm = ({ confirmedOrder, setConfirmedOrder, onDiscountChange }) => {
  const navigate = useNavigate();
  const { items, clearCart, getTotalPrice } = useCart();
  const stripe = useStripe();
  const elements = useElements();
  const { t, i18n } = useTranslation();
  const locale = i18n.language === 'en' ? 'en-US' : 'fr-FR';
  
  const [step, setStep] = useState(1); // 1: Informations, 2: Paiement, 3: Confirmation
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [cardComplete, setCardComplete] = useState(false);
  const [paymentCompleted, setPaymentCompleted] = useState(false); // Nouveau état pour éviter la redirection après paiement
  const [discount, setDiscount] = useState(0); // Pourcentage de réduction
  const [promoCode, setPromoCode] = useState(null); // Code promo de l'abonné
  const [discountMessage, setDiscountMessage] = useState(''); // Message de confirmation
  
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

  const baseTotal = getTotalPrice();
  const discountAmount = (baseTotal * discount) / 100;
  const total = baseTotal - discountAmount;

  // Vérifier si l'email est abonné quand il change
  const checkSubscriberDiscount = async (email) => {
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return;
    }
    
    
    try {
      const url = `${API_URL}/newsletter/check-subscriber/${encodeURIComponent(email)}`;
      
      const response = await fetch(url);
      
      if (response.ok) {
        const data = await response.json();
        
        if (data.is_subscriber && data.discount > 0) {
          setDiscount(data.discount);
          setPromoCode(data.promo_code);
          setDiscountMessage(data.message || t('checkout.discount.applied', { discount: data.discount }));
          
        } else {
          setDiscount(0);
          setPromoCode(null);
          setDiscountMessage(data.message || '');
          
        }
      } else {
        console.error('API error:', response.status, response.statusText);
      }
    } catch (err) {
      console.error('Erreur lors de la vérification de l\'abonné:', err);
    }
  };

  useEffect(() => {
    // Rediriger vers le panier si celui-ci est vide ET que le paiement n'est pas terminé
    if (items.length === 0 && !paymentCompleted) {
      navigate('/panier');
    }
  }, [items, navigate, paymentCompleted]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBuyerInfo({
      ...buyerInfo,
      [name]: value,
    });
    
    // Vérifier l'abonné si c'est l'email qui change
    if (name === 'email') {
      checkSubscriberDiscount(value);
    }
  };

  const handlePaymentMethodChange = (method) => {
    setPaymentMethod(method);
  };

  const validateStep1 = () => {
    const required = ['email', 'firstName', 'lastName', 'address', 'city', 'postalCode'];
    const missing = required.filter(field => !buyerInfo[field]);
    
    if (missing.length > 0) {
      setError(t('checkout.errors.missingFields'));
      return false;
    }
    
    // Validation email basique
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(buyerInfo.email)) {
      setError(t('checkout.errors.invalidEmail'));
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
      setError(t('checkout.errors.stripeUnavailable'));
      return;
    }

    if (paymentMethod === 'card' && !cardComplete) {
      setError(t('checkout.errors.cardIncomplete'));
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
        throw new Error(t('checkout.errors.missingSecret'));
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
        
        // Si un code promo a été utilisé, le marquer comme utilisé
        if (discount > 0 && buyerInfo.email) {
          try {
            await fetch(`${API_URL}/newsletter/mark-promo-used/${encodeURIComponent(buyerInfo.email)}`, {
              method: 'POST'
            });
            
          } catch (err) {
            console.error('Error marking promo as used:', err);
          }
        }
        
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
        throw new Error(
          t('checkout.errors.paymentFailed', { status: paymentIntent?.status || 'inconnu' })
        );
      }
    } catch (err) {
      console.error('❌ Erreur complète de paiement:', err);
      setError(
        t('checkout.errors.paymentGeneric', { message: err.message || 'unknown' })
      );
    } finally {
      setLoading(false);
    }
  };

  const renderStep1 = () => (
    <div className="checkout-step">
      <h2>{t('checkout.step1.title')}</h2>
      <div className="form-grid">
        <div className="form-group">
          <label htmlFor="email">{t('checkout.step1.fields.email')}</label>
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
          <label htmlFor="firstName">{t('checkout.step1.fields.firstName')}</label>
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
          <label htmlFor="lastName">{t('checkout.step1.fields.lastName')}</label>
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
          <label htmlFor="phone">{t('checkout.step1.fields.phone')}</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={buyerInfo.phone}
            onChange={handleInputChange}
          />
        </div>
        <div className="form-group full-width">
          <label htmlFor="address">{t('checkout.step1.fields.address')}</label>
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
          <label htmlFor="city">{t('checkout.step1.fields.city')}</label>
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
          <label htmlFor="postalCode">{t('checkout.step1.fields.postalCode')}</label>
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
          <label htmlFor="country">{t('checkout.step1.fields.country')}</label>
          <select
            id="country"
            name="country"
            value={buyerInfo.country}
            onChange={handleInputChange}
            required
          >
            <option value="France">{t('checkout.countries.France')}</option>
            <option value="Belgique">{t('checkout.countries.Belgique')}</option>
            <option value="Suisse">{t('checkout.countries.Suisse')}</option>
            <option value="Espagne">{t('checkout.countries.Espagne')}</option>
            <option value="Italie">{t('checkout.countries.Italie')}</option>
          </select>
        </div>
      </div>
      <div className="checkout-actions">
        <button type="button" className="back-button" onClick={() => navigate('/panier')}>
          <FaArrowLeft /> {t('checkout.step1.actions.back')}
        </button>
        <button type="button" className="next-button" onClick={goToStep2}>
          {t('checkout.step1.actions.next')}
        </button>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="checkout-step">
      <h2>{t('checkout.step2.title')}</h2>
      
      <div className="payment-methods">
        <div 
          className={`payment-method ${paymentMethod === 'card' ? 'selected' : ''}`}
          onClick={() => handlePaymentMethodChange('card')}
        >
          <div className="payment-method-icon"><FaCreditCard /></div>
          <div className="payment-method-details">
            <span>{t('checkout.step2.methods.card.title')}</span>
            <small>{t('checkout.step2.methods.card.subtitle')}</small>
          </div>
          <div className="payment-method-check">
            {paymentMethod === 'card' && <FaCheck />}
          </div>
        </div>
        
        {/* Cette option est désactivée mais montre la possibilité d'ajouter d'autres méthodes */}
        <div className="payment-method disabled">
          <div className="payment-method-icon"><FaPaypal /></div>
          <div className="payment-method-details">
            <span>{t('checkout.step2.methods.paypal.title')}</span>
            <small>{t('checkout.step2.methods.paypal.subtitle')}</small>
          </div>
        </div>
      </div>
      
      {paymentMethod === 'card' && (
        <div className="card-section">
          <h3>{t('checkout.step2.cardDetails')}</h3>
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
        <FaLock /> {t('checkout.step2.secure')}
      </div>
      
      <div className="checkout-actions">
        <button type="button" className="back-button" onClick={() => setStep(1)}>
          <FaArrowLeft /> {t('checkout.step2.actions.back')}
        </button>
        <button
          type="submit"
          className="pay-button"
          disabled={loading || (paymentMethod === 'card' && !cardComplete)}
          onClick={goToStep3}
        >
          {loading ? t('checkout.step2.actions.processing') : t('checkout.step2.actions.submit', { amount: total.toFixed(2) })}
        </button>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="checkout-step success-step">
      <div className="success-icon">✓</div>
      <h2>{t('checkout.step3.title')}</h2>
      <p>
        <Trans
          i18nKey="checkout.step3.description"
          values={{ email: confirmedOrder?.buyerInfo?.email || buyerInfo.email }}
          components={[<strong key="email" />]}
        />
      </p>
      <p>{t('checkout.step3.secondary')}</p>
      
      {/* Afficher les détails de la commande confirmée */}
      {confirmedOrder && (
        <div className="order-details">
          <h3>{t('checkout.step3.detailsTitle')}</h3>
          <div className="order-summary">
            <div className="order-items">
              {confirmedOrder.items.map(item => (
                <div className="order-item" key={item.id}>
                  <img src={item.main_image} alt={item.title} className="item-thumbnail-small" />
                  <div className="item-details">
                    <h4>{item.title}</h4>
                    <div className="item-specs">
                      {item.width}×{item.height} cm • {getTypeLabel(item.type)}
                    </div>
                    <div className="item-price">{item.price.toFixed(2)} €</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="order-total">
              <strong>{t('checkout.step3.total')} {confirmedOrder.total.toFixed(2)} €</strong>
            </div>
            <div className="order-info">
              <p><strong>{t('checkout.step3.reference')}</strong> {confirmedOrder.paymentId}</p>
              <p><strong>{t('checkout.step3.date')}</strong> {new Date(confirmedOrder.orderDate).toLocaleString(locale)}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  // Notifier le parent des changements de discount
  React.useEffect(() => {
    if (onDiscountChange) {
      onDiscountChange({ discount, discountMessage, baseTotal });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [discount, discountMessage, baseTotal]);

  return (
    <div className="checkout-form">
      <div className="checkout-steps-indicator">
        <div className={`step ${step >= 1 ? 'active' : ''} ${step > 1 ? 'completed' : ''}`}>
          <div className="step-number">1</div>
          <div className="step-name">{t('checkout.steps.info')}</div>
        </div>
        <div className="step-connector"></div>
        <div className={`step ${step >= 2 ? 'active' : ''} ${step > 2 ? 'completed' : ''}`}>
          <div className="step-number">2</div>
          <div className="step-name">{t('checkout.steps.payment')}</div>
        </div>
        <div className="step-connector"></div>
        <div className={`step ${step >= 3 ? 'active' : ''}`}>
          <div className="step-number">3</div>
          <div className="step-name">{t('checkout.steps.confirmation')}</div>
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
  const [discountInfo, setDiscountInfo] = useState({ discount: 0, discountMessage: '', baseTotal: 0 });
  const { t, i18n } = useTranslation();
  
  useEffect(() => {
    if (items.length === 0 && !confirmedOrder) {
      navigate('/panier');
    }
  }, [items, navigate, confirmedOrder]);
  
  const handleDiscountChange = React.useCallback((info) => {
    setDiscountInfo(info);
  }, []);
  
  return (
    <>
      <SEO 
        title={t('checkout.seo.title')}
        description={t('checkout.seo.description')}
        url="https://elisabeth-constantin.fr/checkout"
      />
      <div className="checkout-container">
        <div className="checkout-main">
        <div className="checkout-content">
          <Elements stripe={stripePromise} options={{ ...stripeOptions, locale: i18n.language }}>
            <CheckoutForm 
              confirmedOrder={confirmedOrder} 
              setConfirmedOrder={setConfirmedOrder}
              onDiscountChange={handleDiscountChange}
            />
          </Elements>
        </div>
        
        <CheckoutSummary 
          confirmedOrder={confirmedOrder} 
          discount={discountInfo.discount} 
          discountMessage={discountInfo.discountMessage} 
          baseTotal={discountInfo.baseTotal} 
        />
      </div>
    </div>
    </>
  );
}

// Composant séparé pour le résumé de commande
const CheckoutSummary = ({ confirmedOrder, discount = 0, discountMessage = '', baseTotal = 0 }) => {
  const { items } = useCart();
  const { t } = useTranslation();
  
  // Utiliser soit les items du panier, soit ceux de la commande confirmée
  const displayItems = confirmedOrder?.items || items;
  const calculatedBaseTotal = confirmedOrder ? confirmedOrder.total : (baseTotal || items.reduce((sum, item) => sum + item.price, 0));
  const discountAmount = (calculatedBaseTotal * discount) / 100;
  const displayTotal = calculatedBaseTotal - discountAmount;
  
  const getTypeLabel = (type) => {
    if (!type) {
      return t('gallery.typeLabels.default');
    }
    const normalized = type.toLowerCase().replace(/\s+/g, '_');
    return t(`gallery.typeLabels.${normalized}`, {
      defaultValue: type,
    });
  };

  const appliedDiscountMessage = discountMessage || t('checkout.discount.applied', { discount });

  return (
    <div className="checkout-summary">
      <h3>{t('checkout.summary.title')}</h3>
      <div className="checkout-items">
        {displayItems.map(item => (
          <div className="checkout-item" key={item.id}>
            <img src={item.main_image} alt={item.title} className="item-thumbnail" />
            <div className="item-details">
              <h4>{item.title}</h4>
              <div className="item-specs">
                {item.width}×{item.height} cm • {getTypeLabel(item.type)}
              </div>
              <div className="item-price">{item.price.toFixed(2)} €</div>
            </div>
          </div>
        ))}
      </div>
      <div className="checkout-summary-totals">
        <div className="summary-row">
          <span>{t('checkout.summary.subtotal')}</span>
          <span>{calculatedBaseTotal.toFixed(2)} €</span>
        </div>
        {!confirmedOrder && discount > 0 && (
          <div className="summary-row discount">
            <span>🎉 {appliedDiscountMessage} (-{discount}%)</span>
            <span>-{discountAmount.toFixed(2)} €</span>
          </div>
        )}
        <div className="summary-row">
          <span>{t('checkout.summary.shipping')}</span>
          <span>{t('checkout.summary.shippingValue')}</span>
        </div>
        <div className="summary-row total">
          <span>{t('checkout.summary.total')}</span>
          <span>{displayTotal.toFixed(2)} €</span>
        </div>
        {confirmedOrder && (
          <div className="summary-row confirmed">
            <span>{t('checkout.summary.confirmed')}</span>
          </div>
        )}
      </div>
    </div>
  );
};
  const getTypeLabel = (type) => {
    if (!type) {
      return t('gallery.typeLabels.default');
    }
    const normalized = type.toLowerCase().replace(/\s+/g, '_');
    return t(`gallery.typeLabels.${normalized}`, {
      defaultValue: type,
    });
  };
