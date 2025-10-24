import SchemaScript from './SchemaScript';

/**
 * Fil d'Ariane avec Schema.org pour améliorer la navigation Google
 * 
 * Usage:
 * <BreadcrumbSchema items={[
 *   { name: 'Accueil', url: 'https://elisabeth-constantin.fr' },
 *   { name: 'Galeries', url: 'https://elisabeth-constantin.fr/galeries' },
 *   { name: 'Peinture', url: 'https://elisabeth-constantin.fr/galerie/peinture' }
 * ]} />
 */
const BreadcrumbSchema = ({ items }) => {
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.url
    }))
  };

  return (
    <SchemaScript schema={breadcrumbSchema} id="breadcrumb-schema" />
  );
};

export default BreadcrumbSchema;
