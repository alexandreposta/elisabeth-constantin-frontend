import React from 'react';
import '../styles/eventSkeleton.css';

const EventSkeleton = () => {
  return (
    <div className="event-item-skeleton">
      <div className="event-date-badge-skeleton">
        <div className="day-skeleton skeleton-shimmer"></div>
        <div className="month-skeleton skeleton-shimmer"></div>
      </div>
      
      <div className="event-image-container-skeleton">
        <div className="event-image-skeleton skeleton-shimmer"></div>
        <div className="event-status-skeleton skeleton-shimmer"></div>
      </div>
      
      <div className="event-info-skeleton">
        <div className="event-header-info-skeleton">
          <div className="event-title-skeleton skeleton-shimmer"></div>
        </div>
        
        <div className="event-details-grid-skeleton">
          <div className="event-detail-skeleton">
            <div className="detail-icon-skeleton skeleton-shimmer"></div>
            <div className="detail-content-skeleton">
              <div className="detail-title-skeleton skeleton-shimmer"></div>
              <div className="detail-text-skeleton skeleton-shimmer"></div>
            </div>
          </div>
          
          <div className="event-detail-skeleton">
            <div className="detail-icon-skeleton skeleton-shimmer"></div>
            <div className="detail-content-skeleton">
              <div className="detail-title-skeleton skeleton-shimmer"></div>
              <div className="detail-text-skeleton skeleton-shimmer"></div>
            </div>
          </div>
          
          <div className="event-detail-skeleton">
            <div className="detail-icon-skeleton skeleton-shimmer"></div>
            <div className="detail-content-skeleton">
              <div className="detail-title-skeleton skeleton-shimmer"></div>
              <div className="detail-text-skeleton skeleton-shimmer"></div>
            </div>
          </div>
        </div>
        
        <div className="event-description-skeleton">
          <div className="description-line-skeleton skeleton-shimmer"></div>
          <div className="description-line-skeleton skeleton-shimmer"></div>
          <div className="description-line-skeleton skeleton-shimmer short"></div>
        </div>
      </div>
    </div>
  );
};

const EventSkeletonLoader = ({ count = 3 }) => {
  return (
    <div className="events-container">
      {Array.from({ length: count }).map((_, index) => (
        <EventSkeleton key={index} />
      ))}
    </div>
  );
};

export default EventSkeletonLoader;
