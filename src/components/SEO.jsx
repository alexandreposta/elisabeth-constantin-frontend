import { Helmet } from 'react-helmet-async';

export default function SEO({ 
  title = "Élisabeth Constantin - Artiste Peintre Multiplan 3D",
  description = "Découvrez l'univers artistique d'Élisabeth Constantin, artiste peintre spécialisée dans la technique multiplan 3D. Galeries de peintures, sculptures et créations en relief.",
  keywords = "artiste peintre, art contemporain, multiplan 3D, peinture relief, sculpture, Elisabeth Constantin, art français, galerie d'art",
  image = "https://elisabeth-constantin.fr/logo.png",
  url = "https://elisabeth-constantin.fr",
  type = "website"
}) {
  return (
    <Helmet>
      {/* Balises de base */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      
      {/* Open Graph (Facebook, LinkedIn) */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content={type} />
      <meta property="og:locale" content="fr_FR" />
      <meta property="og:site_name" content="Élisabeth Constantin - Artiste Peintre" />
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      
      {/* URL canonique */}
      <link rel="canonical" href={url} />
      
      {/* Métadonnées supplémentaires */}
      <meta name="author" content="Élisabeth Constantin" />
      <meta name="robots" content="index, follow" />
      <meta name="language" content="French" />
    </Helmet>
  );
}
