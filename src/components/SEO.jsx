import SEOHead from './SEOHead';

export default function SEO({ 
  title = "Élisabeth Constantin - Artiste Peintre Multiplan 3D",
  description = "Découvrez l'univers artistique d'Élisabeth Constantin, artiste peintre spécialisée dans la technique multiplan 3D. Galeries de peintures, sculptures et créations en relief.",
  keywords = "artiste peintre, art contemporain, multiplan 3D, peinture relief, sculpture, Elisabeth Constantin, art français, galerie d'art",
  image = "https://elisabeth-constantin.fr/logo.png",
  url = "https://elisabeth-constantin.fr",
  type = "website"
}) {
  return (
    <SEOHead
      title={title}
      description={description}
      keywords={keywords}
      image={image}
      url={url}
    />
  );
}
