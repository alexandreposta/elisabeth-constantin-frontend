import SchemaScript from './SchemaScript';

export default function ArtistSchema( {
  name = "Élisabeth Constantin",
  url = "https://elisabeth-constantin.fr",
  image = "https://elisabeth-constantin.fr/logo.png",
  description = "Artiste peintre française spécialisée dans la technique unique du multiplan 3D, créant des œuvres en relief et des peintures contemporaines.",
  jobTitle = "Artiste Peintre",
  sameAs = []
}) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": name,
    "url": url,
    "image": image,
    "description": description,
    "jobTitle": jobTitle,
    "worksFor": {
      "@type": "Organization",
      "name": "Atelier Élisabeth Constantin"
    },
    "nationality": {
      "@type": "Country",
      "name": "France"
    },
    "knowsAbout": [
      "Peinture",
      "Art contemporain",
      "Multiplan 3D",
      "Sculpture",
      "Art en relief"
    ],
    "sameAs": sameAs
  };

  return (
    <SchemaScript schema={schema} id="artist-schema" />
  );
}
