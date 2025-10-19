import { Helmet } from 'react-helmet-async';

/**
 * Schema.org pour événements (expositions, salons)
 * Google affichera ces événements dans les recherches et Google Calendar
 * 
 * Usage:
 * <EventSchema event={eventData} />
 */
const EventSchema = ({ event }) => {
  if (!event) return null;

  const eventSchema = {
    "@context": "https://schema.org",
    "@type": "Event",
    "name": event.title,
    "description": event.description,
    "startDate": event.startDate,
    "endDate": event.endDate,
    "eventStatus": "https://schema.org/EventScheduled",
    "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
    "location": {
      "@type": "Place",
      "name": event.locationName,
      "address": {
        "@type": "PostalAddress",
        "streetAddress": event.address,
        "addressLocality": event.city,
        "postalCode": event.postalCode,
        "addressCountry": "FR"
      }
    },
    "image": event.image ? `https://elisabeth-constantin.fr${event.image}` : "https://elisabeth-constantin.fr/og-image.jpg",
    "organizer": {
      "@type": "Person",
      "name": "Elisabeth Constantin",
      "url": "https://elisabeth-constantin.fr"
    },
    "performer": {
      "@type": "Person",
      "name": "Elisabeth Constantin"
    }
  };

  // Ajouter le prix si disponible
  if (event.price !== undefined) {
    eventSchema.offers = {
      "@type": "Offer",
      "price": event.price,
      "priceCurrency": "EUR",
      "availability": "https://schema.org/InStock",
      "url": `https://elisabeth-constantin.fr/evenements/${event.id}`
    };
  }

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(eventSchema)}
      </script>
    </Helmet>
  );
};

export default EventSchema;
