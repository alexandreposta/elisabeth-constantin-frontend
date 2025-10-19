import React, { useState, useEffect } from 'react';
import { eventsAPI } from '../api/events';
import EventSkeletonLoader from '../components/EventSkeleton';
import SortButton from '../components/SortButton';
import SEO from '../components/SEO';
import '../styles/evenements.css';

export default function Evenements() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentSort, setCurrentSort] = useState({ field: "date", direction: "asc" });

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      setLoading(true);
      const data = await eventsAPI.getAllEvents();
      // Filtrer les événements actifs et les trier par date
      const activeEvents = data
        .filter(event => event.is_active)
        .sort((a, b) => new Date(a.start_date) - new Date(b.start_date));
      setEvents(activeEvents);
    } catch (err) {
      setError('Erreur lors du chargement des événements');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatDateShort = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short'
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

  const getSortedEvents = () => {
    // Filtrer seulement les événements actifs (non annulés)
    const activeEvents = events.filter(event => event.status !== 'cancelled');
    
    // Appliquer le tri
    return [...activeEvents].sort((a, b) => {
      let result = 0;
      
      switch (currentSort.field) {
        case 'date':
          result = new Date(a.start_date) - new Date(b.start_date);
          break;
        case 'title':
          result = a.title.localeCompare(b.title);
          break;
        case 'status':
          result = a.status.localeCompare(b.status);
          break;
        default:
          result = 0;
      }
      
      return currentSort.direction === 'desc' ? -result : result;
    });
  };

  const handleSort = (sortConfig) => {
    setCurrentSort(sortConfig);
  };

  const sortedEvents = getSortedEvents();

  if (error) return <div className="events-error">{error}</div>;

  return (
    <>
      <SEO 
        title="Événements - Élisabeth Constantin | Expositions et Vernissages"
        description="Découvrez les prochains événements d'Élisabeth Constantin : expositions, vernissages, ateliers artistiques et rencontres autour de l'art et de la technique multiplan 3D."
        keywords="événements, expositions, vernissages, ateliers, Elisabeth Constantin, art, galerie"
        url="https://elisabeth-constantin.fr/evenements"
      />
      <div className="evenements-page">
        <div className="events-header">
          <h1 className="events-main-title">Événements</h1>
          <p className="events-subtitle">
            Découvrez nos expositions, vernissages et ateliers artistiques
          </p>
        
        <div className="sort-buttons-group">
          <span className="sort-buttons-label">Trier par :</span>
          <SortButton
            field="date"
            currentSort={currentSort}
            onSort={handleSort}
            label="Date"
            size="small"
            className="rounded"
          />
          <SortButton
            field="title"
            currentSort={currentSort}
            onSort={handleSort}
            label="Titre"
            size="small"
            className="rounded"
          />
          <SortButton
            field="status"
            currentSort={currentSort}
            onSort={handleSort}
            label="Statut"
            size="small"
            className="rounded"
          />
        </div>
      </div>

      {loading ? (
        <EventSkeletonLoader count={3} />
      ) : (
        <div className="events-container">
          {sortedEvents.length === 0 ? (
            <div className="no-events">
              <h3>Aucun événement disponible</h3>
              <p>Cette section ne contient actuellement aucun événement.</p>
              <button onClick={() => window.location.href = '/'} className="back-button">
                Retour à l'accueil
              </button>
            </div>
          ) : (
            sortedEvents.map((event) => (
              <div key={event.id} className="event-item">
                <div className="event-date-badge">
                  <div className="day">{formatDateShort(event.start_date).split(' ')[0]}</div>
                  <div className="month">{formatDateShort(event.start_date).split(' ')[1]}</div>
                </div>
                
                <div className="event-image-container">
                  <img src={event.main_image} alt={event.title} className="event-image" />
                  <div className={`event-status ${event.status}`}>
                    {getStatusLabel(event.status)}
                  </div>
                </div>
                
                <div className="event-info">
                  <div className="event-header-info">
                    <h2 className="event-title">{event.title}</h2>
                  </div>
                  
                  <div className="event-details-grid">
                    <div className="event-detail">
                      <span className="detail-icon">📅</span>
                      <div className="detail-content">
                        <strong>Date</strong>
                        <p>{formatDate(event.start_date)}</p>
                        {event.start_date !== event.end_date && (
                          <p>au {formatDate(event.end_date)}</p>
                        )}
                      </div>
                    </div>
                    
                    <div className="event-detail">
                      <span className="detail-icon">🕒</span>
                      <div className="detail-content">
                        <strong>Horaires</strong>
                        <p>{event.start_time} - {event.end_time}</p>
                      </div>
                    </div>
                    
                    <div className="event-detail">
                      <span className="detail-icon">📍</span>
                      <div className="detail-content">
                        <strong>Lieu</strong>
                        <p>{event.location}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="event-description">
                    <div 
                      className="description-text"
                      dangerouslySetInnerHTML={{
                        __html: event.description.replace(/\n/g, '<br>').replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" target="_blank" rel="noopener noreferrer" class="description-link">$1</a>')
                      }}
                    />
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
      </div>
    </>
  );
}
