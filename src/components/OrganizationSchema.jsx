import { Helmet } from 'react-helmet-async';

/**
 * Schema.org Organization pour la page d'accueil
 * Définit Elisabeth Constantin comme artiste/organisation
 */
const OrganizationSchema = () => {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Elisabeth Constantin - Artiste Peintre",
    "url": "https://elisabeth-constantin.fr",
    "logo": "https://elisabeth-constantin.fr/logo.png",
    "description": "Artiste peintre spécialisée dans la technique multiplan 3D, créant des œuvres en relief avec plusieurs plans de profondeur",
    "founder": {
      "@type": "Person",
      "name": "Elisabeth Constantin"
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "Customer Service",
      "email": "contact@elisabeth-constantin.fr"
    },
    "sameAs": [
      // Ajouter liens réseaux sociaux quand créés
      "https://www.instagram.com/elisabethconstantin",
      "https://www.facebook.com/elisabethconstantin"
    ]
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(organizationSchema)}
      </script>
    </Helmet>
  );
};

export default OrganizationSchema;
