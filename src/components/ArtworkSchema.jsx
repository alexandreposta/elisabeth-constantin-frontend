import { Helmet } from 'react-helmet-async';

export default function ArtworkSchema({ artwork }) {
  const schema = {
    "@context": "https://schema.org/",
    "@type": "VisualArtwork",
    "name": artwork.title,
    "image": artwork.main_image,
    "description": artwork.description || `Œuvre d'art "${artwork.title}" par Élisabeth Constantin`,
    "artMedium": artwork.type || "Peinture",
    "artform": "Peinture",
    "width": {
      "@type": "QuantitativeValue",
      "value": artwork.width,
      "unitCode": "CMT"
    },
    "height": {
      "@type": "QuantitativeValue",
      "value": artwork.height,
      "unitCode": "CMT"
    },
    "creator": {
      "@type": "Person",
      "name": "Élisabeth Constantin",
      "jobTitle": "Artiste Peintre",
      "url": "https://elisabeth-constantin.fr"
    },
    "offers": {
      "@type": "Offer",
      "price": artwork.price,
      "priceCurrency": "EUR",
      "availability": artwork.status === "Disponible" ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      "url": `https://elisabeth-constantin.fr/tableau/${artwork._id}`
    }
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(schema)}
      </script>
    </Helmet>
  );
}
