import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { FaTrash, FaShoppingCart, FaLock } from 'react-icons/fa';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import SEO from '../components/SEO';
import '../styles/panier.css';
import { useTranslation } from 'react-i18next';

const STRIPE_PUBLIC_KEY = import.meta.env.VITE_STRIPE_PUBLIC_KEY;
if (!STRIPE_PUBLIC_KEY || STRIPE_PUBLIC_KEY === 'pk_live_YOUR_PUBLIC_KEY_HERE') {
  console.error('Stripe public key is missing. Check your environment variables.');
}

const stripeOptions = {
  fonts: [
    {
      cssSrc: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500&display=swap',
    },
  ],
};
const stripePromise = loadStripe(STRIPE_PUBLIC_KEY);

const PanierContent = () => {
  const { items, removeFromCart, getTotalPrice } = useCart();
  const { t } = useTranslation();

  const total = getTotalPrice();

  const getTypeLabel = (type) => {
    if (!type) {
      return t('gallery.typeLabels.default');
    }
    const normalized = type.toLowerCase().replace(/\s+/g, '_');
    return t(`gallery.typeLabels.${normalized}`, {
      defaultValue: type,
    });
  };

  if (items.length === 0) {
    return (
      <div className="panier-container">
        <div className="empty-cart">
          <FaShoppingCart size={64} color="#ccc" />
          <h2>{t('cart.empty.title')}</h2>
          <p>{t('cart.empty.subtitle')}</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEO 
        title={t('cart.seo.title')}
        description={t('cart.seo.description')}
        url="https://elisabeth-constantin.fr/panier"
      />
      <div className="panier-container">
      <div className="panier-header">
        <h1>{t('cart.header')}</h1>
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
                  <span className="type">{getTypeLabel(item.type)}</span>
                </div>
                <div className="cart-item-price">{item.price.toFixed(2)} €</div>
              </div>
              <button
                onClick={() => removeFromCart(item.id)}
                className="remove-item-btn"
                title={t('cart.actions.remove')}
              >
                <FaTrash />
              </button>
            </div>
          ))}
        </div>

        <div className="cart-summary">
          <div className="summary-content">
            <h3>{t('cart.summary.title')}</h3>
            <div className="summary-line">
              <span>
                {t('cart.summary.subtotal')} ({items.length} {t('cart.summary.items', { count: items.length })})
              </span>
              <span>{total.toFixed(2)} €</span>
            </div>
            <div className="summary-line">
              <span>{t('cart.summary.shipping')}</span>
              <span>{t('cart.summary.shippingValue')}</span>
            </div>
            <div className="summary-line total">
              <span>{t('cart.summary.total')}</span>
              <span>{total.toFixed(2)} €</span>
            </div>
            
            <div className="security-info">
              <p><FaLock /> {t('cart.security.securePayment')}</p>
              <p>{t('cart.security.shipping')}</p>
              <p>{t('cart.security.certificate')}</p>
            </div>

            <button
              onClick={() => window.location.href = '/checkout'}
              className="checkout-btn"
            >
              {t('cart.actions.checkout')}
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
