import React from 'react';
import '../styles/adminCard.css';

const AdminCard = ({ 
  item, 
  type, // 'artwork' ou 'event'
  onEdit, 
  onDelete,
  statusIndicator 
}) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'upcoming': return 'À venir';
      case 'ongoing': return 'En cours';
      case 'completed': return 'Terminé';
      case 'cancelled': return 'Annulé';
      default: return status;
    }
  };

  return (
    <div className="admin-card" onClick={() => onEdit(item)}>
      {statusIndicator && (
        <div className={`status-indicator ${statusIndicator.class}`}>
          {statusIndicator.label}
        </div>
      )}
      
      <div className="admin-card-image">
        <img 
          src={item.main_image} 
          alt={item.title} 
          className="card-image"
        />
      </div>
      
      <div className="admin-card-content">
        <h3 className="card-title">{item.title}</h3>
        
        {type === 'artwork' && (
          <div className="card-details">
            <p className="card-price">{item.price}€</p>
            <p className="card-dimensions">{item.width} × {item.height} cm</p>
            <p className="card-type">{item.type}</p>
          </div>
        )}
        
        {type === 'event' && (
          <div className="card-details">
            <p className="card-date">{formatDate(item.start_date)}</p>
            <p className="card-location">{item.location}</p>
            <p className="card-status">{getStatusLabel(item.status)}</p>
          </div>
        )}
        
        <p className="card-description">
          {item.description ? 
            `${item.description.substring(0, 100)}${item.description.length > 100 ? '...' : ''}` 
            : 'Aucune description'
          }
        </p>
      </div>
      
      <div className="admin-card-actions">
        <button 
          className="edit-btn"
          onClick={(e) => {
            e.stopPropagation();
            onEdit(item);
          }}
        >
          Modifier
        </button>
        <button 
          className="delete-btn"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(item);
          }}
        >
          Supprimer
        </button>
      </div>
    </div>
  );
};

export default AdminCard;
