import React, { useState, useEffect } from 'react';
import { eventsAPI } from '../api/events';
import EventSkeletonLoader from '../components/EventSkeleton';
import '../styles/evenements.css';

export default function Evenements() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all'); // all, upcoming, ongoing

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

  const getFilteredEvents = () => {
    switch (filter) {
      case 'upcoming':
        return events.filter(event => event.status === 'upcoming');
      case 'ongoing':
        return events.filter(event => event.status === 'ongoing');
      default:
        return events.filter(event => event.status !== 'cancelled');
    }
  };

  const filteredEvents = getFilteredEvents();

  if (error) return <div className="events-error">{error}</div>;

  return (
    <div className="evenements-page">
      <div className="events-header">
        <h1 className="events-main-title">Événements</h1>
        <p className="events-subtitle">
          Découvrez nos expositions, vernissages et ateliers artistiques
        </p>
        
        <div className="events-filters">
          <button 
            className={filter === 'all' ? 'filter-btn active' : 'filter-btn'}
            onClick={() => setFilter('all')}
          >
            Tous
          </button>
          <button 
            className={filter === 'upcoming' ? 'filter-btn active' : 'filter-btn'}
            onClick={() => setFilter('upcoming')}
          >
            À venir
          </button>
          <button 
            className={filter === 'ongoing' ? 'filter-btn active' : 'filter-btn'}
            onClick={() => setFilter('ongoing')}
          >
            En cours
          </button>
        </div>
      </div>

      {loading ? (
        <EventSkeletonLoader count={3} />
      ) : (
        <div className="events-container">
          {filteredEvents.length === 0 ? (
            <div className="no-events">
              <h3>Aucun événement trouvé</h3>
              <p>Revenez bientôt pour découvrir nos prochains événements !</p>
            </div>
          ) : (
            filteredEvents.map((event) => (
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
  );
}
