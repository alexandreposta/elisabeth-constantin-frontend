import React, { useState, useEffect } from 'react';
import { ordersAdminAPI } from '../api/orders';
import AdminHeader from '../components/AdminHeader';
import { FaEye, FaEdit, FaEnvelope, FaPhone, FaMapMarkerAlt, FaCalendarAlt, FaEuroSign } from 'react-icons/fa';
import '../styles/adminOrders.css';

const ORDER_STATUS = {
  pending: 'En attente',
  paid: 'Payée',
  shipped: 'Expédiée',
  delivered: 'Livrée',
  cancelled: 'Annulée'
};

const STATUS_COLORS = {
  pending: '#f39c12',
  paid: '#2ecc71',
  shipped: '#3498db',
  delivered: '#27ae60',
  cancelled: '#e74c3c'
};

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderDetails, setShowOrderDetails] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('created_at');
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const data = await ordersAdminAPI.getAllOrders();
      setOrders(data);
    } catch (err) {
      setError('Erreur lors du chargement des commandes');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      setIsUpdatingStatus(true);
      await ordersAdminAPI.updateOrderStatus(orderId, newStatus);
      
      // Mettre à jour l'état local
      setOrders(prev => prev.map(order => 
        order.id === orderId ? { ...order, status: newStatus } : order
      ));
      
      // Mettre à jour la commande sélectionnée si elle correspond
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder(prev => ({ ...prev, status: newStatus }));
      }
      
    } catch (err) {
      setError('Erreur lors de la mise à jour du statut');
      console.error(err);
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleViewOrder = async (orderId) => {
    try {
      const orderDetails = await ordersAdminAPI.getOrderById(orderId);
      setSelectedOrder(orderDetails);
      setShowOrderDetails(true);
    } catch (err) {
      setError('Erreur lors de la récupération des détails de la commande');
      console.error(err);
    }
  };

  const getFilteredOrders = () => {
    let filtered = orders;
    
    if (filterStatus !== 'all') {
      filtered = filtered.filter(order => order.status === filterStatus);
    }
    
    return filtered.sort((a, b) => {
      switch (sortBy) {
        case 'created_at':
          return new Date(b.created_at) - new Date(a.created_at);
        case 'total':
          return b.total - a.total;
        case 'status':
          return a.status.localeCompare(b.status);
        default:
          return 0;
      }
    });
  };

  const sendEmail = (email, subject = 'Concernant votre commande') => {
    window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}`;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTotalOrders = () => orders.length;
  const getPendingOrders = () => orders.filter(order => order.status === 'pending').length;
  const getTotalRevenue = () => orders.reduce((sum, order) => sum + order.total, 0);

  if (loading) return <div className="admin-loading">Chargement des commandes...</div>;
  if (error) return <div className="admin-error">{error}</div>;

  return (
    <>
      <AdminHeader />
      <div className="admin-orders-container">
        <header className="admin-orders-header">
          <h1>Administration des Commandes</h1>
          <div className="admin-stats">
            <div className="stat-card">
              <div className="stat-number">{getTotalOrders()}</div>
              <div className="stat-label">Total Commandes</div>
            </div>
            <div className="stat-card">
            <div className="stat-number">{getPendingOrders()}</div>
            <div className="stat-label">En Attente</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{getTotalRevenue().toFixed(2)} €</div>
            <div className="stat-label">Chiffre d'Affaires</div>
          </div>
        </div>
      </header>

      <div className="admin-controls">
        <div className="filter-controls">
          <select 
            value={filterStatus} 
            onChange={(e) => setFilterStatus(e.target.value)}
            className="admin-select"
          >
            <option value="all">Tous les statuts</option>
            <option value="pending">En attente</option>
            <option value="paid">Payée</option>
            <option value="shipped">Expédiée</option>
            <option value="delivered">Livrée</option>
            <option value="cancelled">Annulée</option>
          </select>
          
          <select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)}
            className="admin-select"
          >
            <option value="created_at">Date de création</option>
            <option value="total">Montant</option>
            <option value="status">Statut</option>
          </select>
        </div>
      </div>

      <div className="orders-table-container">
        <table className="orders-table">
          <thead>
            <tr>
              <th>ID Commande</th>
              <th>Client</th>
              <th>Date</th>
              <th>Montant</th>
              <th>Statut</th>
              <th>Articles</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {getFilteredOrders().map(order => (
              <tr key={order.id}>
                <td className="order-id">#{order.id.slice(-8)}</td>
                <td className="customer-info">
                  <div className="customer-name">
                    {order.buyer_info.firstName} {order.buyer_info.lastName}
                  </div>
                  <div className="customer-email">{order.buyer_info.email}</div>
                </td>
                <td className="order-date">{formatDate(order.created_at)}</td>
                <td className="order-total">
                  <strong>{order.total.toFixed(2)} €</strong>
                </td>
                <td className="order-status">
                  <select
                    value={order.status}
                    onChange={(e) => handleUpdateStatus(order.id, e.target.value)}
                    className="status-select"
                    style={{ backgroundColor: STATUS_COLORS[order.status] }}
                    disabled={isUpdatingStatus}
                  >
                    <option value="pending">En attente</option>
                    <option value="paid">Payée</option>
                    <option value="shipped">Expédiée</option>
                    <option value="delivered">Livrée</option>
                    <option value="cancelled">Annulée</option>
                  </select>
                </td>
                <td className="order-items">
                  {order.items.length} article{order.items.length > 1 ? 's' : ''}
                </td>
                <td className="order-actions">
                  <button
                    onClick={() => handleViewOrder(order.id)}
                    className="admin-btn-secondary"
                    title="Voir les détails"
                  >
                    <FaEye />
                  </button>
                  <button
                    onClick={() => sendEmail(order.buyer_info.email, `Concernant votre commande #${order.id.slice(-8)}`)}
                    className="admin-btn-primary"
                    title="Contacter le client"
                  >
                    <FaEnvelope />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal des détails de commande */}
      {showOrderDetails && selectedOrder && (
        <div className="admin-modal-overlay">
          <div className="admin-modal-container">
            <div className="admin-modal-header">
              <h2>Détails de la Commande #{selectedOrder.id.slice(-8)}</h2>
              <button 
                onClick={() => setShowOrderDetails(false)}
                className="admin-modal-close"
              >
                ×
              </button>
            </div>
            
            <div className="admin-modal-content">
              <div className="order-details-grid">
                {/* Informations de la commande */}
                <div className="order-section">
                  <h3><FaCalendarAlt /> Informations Commande</h3>
                  <div className="order-info">
                    <p><strong>ID:</strong> {selectedOrder.id}</p>
                    <p><strong>Date:</strong> {formatDate(selectedOrder.created_at)}</p>
                    <p><strong>Statut:</strong> 
                      <span 
                        className="status-badge"
                        style={{ backgroundColor: STATUS_COLORS[selectedOrder.status] }}
                      >
                        {ORDER_STATUS[selectedOrder.status]}
                      </span>
                    </p>
                    <p><strong>Montant Total:</strong> {selectedOrder.total.toFixed(2)} €</p>
                    {selectedOrder.stripe_payment_intent_id && (
                      <p><strong>ID Paiement Stripe:</strong> {selectedOrder.stripe_payment_intent_id}</p>
                    )}
                  </div>
                </div>

                {/* Informations client */}
                <div className="order-section">
                  <h3><FaMapMarkerAlt /> Informations Client</h3>
                  <div className="customer-details">
                    <p><strong>Nom:</strong> {selectedOrder.buyer_info.firstName} {selectedOrder.buyer_info.lastName}</p>
                    <p><strong>Email:</strong> 
                      <a href={`mailto:${selectedOrder.buyer_info.email}`}>
                        {selectedOrder.buyer_info.email}
                      </a>
                    </p>
                    {selectedOrder.buyer_info.phone && (
                      <p><strong>Téléphone:</strong> 
                        <a href={`tel:${selectedOrder.buyer_info.phone}`}>
                          {selectedOrder.buyer_info.phone}
                        </a>
                      </p>
                    )}
                    <p><strong>Adresse:</strong></p>
                    <div className="address-block">
                      {selectedOrder.buyer_info.address}<br />
                      {selectedOrder.buyer_info.postalCode} {selectedOrder.buyer_info.city}<br />
                      {selectedOrder.buyer_info.country}
                    </div>
                  </div>
                </div>
              </div>

              {/* Articles commandés */}
              <div className="order-section full-width">
                <h3><FaEuroSign /> Articles Commandés</h3>
                <div className="order-items-list">
                  {selectedOrder.items.map((item, index) => (
                    <div key={index} className="order-item-card">
                      <div className="item-info">
                        <h4>{item.title}</h4>
                        <p className="item-price">{item.price.toFixed(2)} €</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions rapides */}
              <div className="order-section full-width">
                <h3>Actions Rapides</h3>
                <div className="quick-actions">
                  <button
                    onClick={() => sendEmail(selectedOrder.buyer_info.email, `Concernant votre commande #${selectedOrder.id.slice(-8)}`)}
                    className="admin-btn-primary"
                  >
                    <FaEnvelope /> Contacter le client
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(selectedOrder.id, 'shipped')}
                    className="admin-btn-secondary"
                    disabled={selectedOrder.status === 'shipped' || selectedOrder.status === 'delivered'}
                  >
                    Marquer comme expédiée
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(selectedOrder.id, 'delivered')}
                    className="admin-btn-success"
                    disabled={selectedOrder.status === 'delivered'}
                  >
                    Marquer comme livrée
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      </div>
    </>
  );
}
