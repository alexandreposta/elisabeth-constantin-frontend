import React, { useState, useEffect } from 'react';
import { getOrdersByEmail } from '../api/orders';
import { FaBox, FaCheckCircle, FaShippingFast, FaBoxOpen, FaRegTimesCircle } from 'react-icons/fa';
import SEO from '../components/SEO';
import '../styles/mesCommandes.css';

const statusIcons = {
  pending: <FaBox color="#f39c12" />,
  paid: <FaCheckCircle color="#27ae60" />,
  shipped: <FaShippingFast color="#3498db" />,
  delivered: <FaBoxOpen color="#2ecc71" />,
  cancelled: <FaRegTimesCircle color="#e74c3c" />
};

const statusLabels = {
  pending: "En attente",
  paid: "Payée",
  shipped: "Expédiée",
  delivered: "Livrée",
  cancelled: "Annulée"
};

const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('fr-FR', options);
};

export default function MesCommandes() {
  const [email, setEmail] = useState('');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searched, setSearched] = useState(false);
  const [activeOrder, setActiveOrder] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
      // Fermer les détails si on passe en mode mobile
      if (window.innerWidth <= 768) {
        setActiveOrder(null);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;

    setLoading(true);
    setError(null);
    
    try {
      const ordersData = await getOrdersByEmail(email);
      setOrders(ordersData);
      setSearched(true);
    } catch (error) {
      setError("Impossible de récupérer vos commandes. Veuillez vérifier votre email.");
    } finally {
      setLoading(false);
    }
  };

  const toggleOrderDetails = (orderId) => {
    // Désactiver l'ouverture des détails sur mobile
    if (isMobile) {
      return;
    }
    setActiveOrder(activeOrder === orderId ? null : orderId);
  };

  return (
    <>
      <SEO 
        title="Mes Commandes - Suivi de Commande | Élisabeth Constantin"
        description="Suivez l'état de votre commande d'œuvres d'art d'Élisabeth Constantin. Consultez le statut de livraison et l'historique de vos achats."
        url="https://elisabeth-constantin.fr/mes-commandes"
      />
      <div className="mes-commandes-container">
      <h1>Mes Commandes</h1>
      
      <div className="search-orders">
        <p>Entrez l'email utilisé lors de votre commande pour consulter son statut</p>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Votre email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? 'Recherche...' : 'Rechercher'}
          </button>
        </form>
        {error && <div className="error-message">{error}</div>}
      </div>

      {searched && (
        <div className="orders-results">
          {orders.length === 0 ? (
            <div className="no-orders">
              <p>Aucune commande trouvée pour cet email.</p>
            </div>
          ) : (
            <div className="orders-list">
              <h2>Vos commandes</h2>
              {orders.map((order) => (
                <div key={order.id} className="order-item">
                  <div 
                    className={`order-header ${isMobile ? 'mobile-header' : ''}`} 
                    onClick={() => toggleOrderDetails(order.id)}
                    style={isMobile ? { cursor: 'default' } : {}}
                  >
                    <div className="order-basic-info">
                      <div className="order-id">Commande #{order.id.substring(order.id.length - 8)}</div>
                      <div className="order-date">{formatDate(order.created_at)}</div>
                    </div>
                    <div className="order-status">
                      {statusIcons[order.status]} {statusLabels[order.status]}
                    </div>
                    <div className="order-total">
                      {order.total.toFixed(2)} €
                    </div>
                    {!isMobile && (
                      <div className="order-expand-indicator">
                        {activeOrder === order.id ? '▼' : '▶'}
                      </div>
                    )}
                  </div>
                  
                  {!isMobile && activeOrder === order.id && (
                    <div className="order-details">
                      <h3>Détails de la commande</h3>
                      <div className="order-items-list">
                        {order.items.map((item, index) => (
                          <div key={index} className="order-detail-item">
                            <div className="item-title">{item.title}</div>
                            <div className="item-price">{item.price.toFixed(2)} €</div>
                          </div>
                        ))}
                      </div>
                      
                      <div className="order-shipping-info">
                        <h4>Informations de livraison</h4>
                        <p>
                          {order.buyer_info.firstName} {order.buyer_info.lastName}<br />
                          {order.buyer_info.address}<br />
                          {order.buyer_info.postalCode} {order.buyer_info.city}<br />
                          {order.buyer_info.country}
                        </p>
                      </div>
                      
                      {order.status === 'shipped' && (
                        <div className="tracking-info">
                          <h4>Suivi de livraison</h4>
                          <p>Votre commande a été expédiée et est en cours d'acheminement.</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      
      <div className="help-section">
        <h3>Besoin d'aide avec votre commande ?</h3>
        <p>N'hésitez pas à me contacter par email à <a href="mailto:contact@elisabethconstantin.com">contact@elisabethconstantin.com</a> ou par téléphone au +33 6 85 50 09 73.</p>
      </div>
    </div>
    </>
  );
}
