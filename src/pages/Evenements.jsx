import React, { useState, useEffect } from 'react';
import { eventsAPI } from '../api/events';
import EventSkeletonLoader from '../components/EventSkeleton';
import SortButton from '../components/SortButton';
import SEO from '../components/SEO';
import EventSchema from '../components/EventSchema';
import BreadcrumbSchema from '../components/BreadcrumbSchema';
import '../styles/evenements.css';
import { useTranslation } from 'react-i18next';

export default function Evenements() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentSort, setCurrentSort] = useState({ field: "date", direction: "asc" });
  const { t, i18n } = useTranslation();
  const locale = i18n.language === 'en' ? 'en-US' : 'fr-FR';
  const statusLabels = t('events.status', { returnObjects: true });

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
      setError(t('events.errors.load'));
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString(locale, {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatDateShort = (dateString) => {
    return new Date(dateString).toLocaleDateString(locale, {
      day: 'numeric',
      month: 'short'
    });
  };

  const getStatusLabel = (status) => {
    return statusLabels?.[status] || status;
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
        title={t('events.seo.title')}
        description={t('events.seo.description')}
        keywords={t('events.seo.keywords')}
        url="https://elisabeth-constantin.fr/evenements"
      />
      <BreadcrumbSchema items={[
        { name: t('events.breadcrumb.home'), url: 'https://elisabeth-constantin.fr' },
        { name: t('events.breadcrumb.self'), url: 'https://elisabeth-constantin.fr/evenements' }
      ]} />
      <div className="evenements-page">
        <div className="events-header">
          <h1 className="events-main-title">{t('events.title')}</h1>
          <p className="events-subtitle">
            {t('events.subtitle')}
          </p>
        
        <div className="sort-buttons-group">
          <span className="sort-buttons-label">{t('events.sort.label')}</span>
          <SortButton
            field="date"
            currentSort={currentSort}
            onSort={handleSort}
            label={t('events.sort.date')}
            size="small"
            className="rounded"
          />
          <SortButton
            field="title"
            currentSort={currentSort}
            onSort={handleSort}
            label={t('events.sort.title')}
            size="small"
            className="rounded"
          />
          <SortButton
            field="status"
            currentSort={currentSort}
            onSort={handleSort}
            label={t('events.sort.status')}
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
              <h3>{t('events.empty.title')}</h3>
              <p>{t('events.empty.description')}</p>
              <button onClick={() => window.location.href = '/'} className="back-button">
                {t('events.empty.cta')}
              </button>
            </div>
          ) : (
            sortedEvents.map((event) => (
              <React.Fragment key={event.id}>
                <EventSchema event={{
                  title: event.title,
                  description: event.description,
                  startDate: new Date(event.start_date).toISOString(),
                  endDate: new Date(event.end_date).toISOString(),
                  locationName: event.location,
                  address: event.location,
                  city: event.location?.split(',')[1]?.trim() || '',
                  postalCode: '',
                  image: event.main_image,
                  price: 0,
                  id: event.id
                }} />
                <div className="event-item">
                  <div className="event-date-badge">
                    <div className="day">{formatDateShort(event.start_date).split(' ')[0]}</div>
                    <div className="month">{formatDateShort(event.start_date).split(' ')[1]}</div>
                  </div>
                
                <div className="event-image-container">
                  <img 
                    src={event.main_image} 
                    alt={event.title} 
                    className="event-image" 
                    loading="lazy"
                  />
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
                        <strong>{t('events.fields.date')}</strong>
                        <p>{formatDate(event.start_date)}</p>
                        {event.start_date !== event.end_date && (
                          <p>{t('events.rangeEnd', { date: formatDate(event.end_date) })}</p>
                        )}
                      </div>
                    </div>
                    
                    <div className="event-detail">
                      <span className="detail-icon">🕒</span>
                      <div className="detail-content">
                        <strong>{t('events.fields.time')}</strong>
                        <p>{event.start_time} - {event.end_time}</p>
                      </div>
                    </div>
                    
                    <div className="event-detail">
                      <span className="detail-icon">📍</span>
                      <div className="detail-content">
                        <strong>{t('events.fields.location')}</strong>
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
              </React.Fragment>
            ))
          )}
        </div>
      )}
      </div>
    </>
  );
}
