import { useEffect } from 'react';

/**
 * Composant SEO personnalisé compatible React 19+
 * Remplace react-helmet-async avec l'API DOM native
 * 
 * Props:
 * - title: titre de la page
 * - description: meta description
 * - keywords: meta keywords (optionnel)
 * - image: image Open Graph (optionnel)
 * - url: URL canonique (optionnel)
 * - noindex: boolean pour noindex (optionnel)
 */
export default function SEOHead({ 
  title, 
  description, 
  keywords, 
  image, 
  url,
  noindex = false 
}) {
  useEffect(() => {
    // Titre de la page
    if (title) {
      document.title = title;
    }

    // Meta description
    updateOrCreateMeta('name', 'description', description);

    // Meta keywords
    if (keywords) {
      updateOrCreateMeta('name', 'keywords', keywords);
    }

    // Meta robots (noindex)
    if (noindex) {
      updateOrCreateMeta('name', 'robots', 'noindex, nofollow');
    } else {
      // Supprimer noindex si présent
      const robotsMeta = document.querySelector('meta[name="robots"]');
      if (robotsMeta && robotsMeta.content === 'noindex, nofollow') {
        robotsMeta.remove();
      }
    }

    // Open Graph
    updateOrCreateMeta('property', 'og:title', title);
    updateOrCreateMeta('property', 'og:description', description);
    updateOrCreateMeta('property', 'og:type', 'website');
    
    if (url) {
      updateOrCreateMeta('property', 'og:url', url);
    }
    
    if (image) {
      updateOrCreateMeta('property', 'og:image', image);
    }

    // Twitter Card
    updateOrCreateMeta('name', 'twitter:card', 'summary_large_image');
    updateOrCreateMeta('name', 'twitter:title', title);
    updateOrCreateMeta('name', 'twitter:description', description);
    
    if (image) {
      updateOrCreateMeta('name', 'twitter:image', image);
    }

    // Canonical URL
    if (url) {
      updateOrCreateLink('canonical', url);
    }

  }, [title, description, keywords, image, url, noindex]);

  return null; // Ce composant ne rend rien dans le DOM React
}

/**
 * Crée ou met à jour une balise meta
 */
function updateOrCreateMeta(attribute, attributeValue, content) {
  if (!content) return;

  let element = document.querySelector(`meta[${attribute}="${attributeValue}"]`);
  
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attribute, attributeValue);
    document.head.appendChild(element);
  }
  
  element.setAttribute('content', content);
}

/**
 * Crée ou met à jour une balise link (canonical)
 */
function updateOrCreateLink(rel, href) {
  if (!href) return;

  let element = document.querySelector(`link[rel="${rel}"]`);
  
  if (!element) {
    element = document.createElement('link');
    element.setAttribute('rel', rel);
    document.head.appendChild(element);
  }
  
  element.setAttribute('href', href);
}
