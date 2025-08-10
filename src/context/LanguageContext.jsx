import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

// Dictionnaire des traductions
const translations = {
  fr: {
    // Header
    'nav.home': 'Accueil',
    'nav.gallery': 'Galerie',
    'nav.events': 'Événements',
    'nav.cart': 'Panier',
    
    // Gallery types
    'gallery.peinture': 'Peinture',
    'gallery.3d': '3D',
    'gallery.sculpture': 'Sculpture',
    'gallery.aquarelle': 'Aquarelle',
    
    // Footer
    'footer.newsletter.title': 'Restez informé',
    'footer.newsletter.subtitle': 'Abonnez-vous pour recevoir nos dernières créations',
    'footer.newsletter.placeholder': 'Votre adresse email',
    'footer.newsletter.subscribe': 'S\'abonner',
    'footer.newsletter.success': 'Merci pour votre abonnement !',
    'footer.newsletter.error': 'Erreur lors de l\'abonnement. Veuillez réessayer.',
    'footer.newsletter.already_subscribed': 'Vous êtes déjà abonné avec cette adresse email.',
    'footer.track_orders': 'Suivi de commandes',
    'footer.legal_notice': 'Mentions légales',
    'footer.privacy_policy': 'Politique de confidentialité',
    'footer.terms': 'CGV',
    'footer.cookies': 'Cookies',
    'footer.rights': 'Tous droits réservés.',
    'footer.contact': 'Pour toute question, contactez-moi via les réseaux sociaux.',
    
    // Common
    'common.loading': 'Chargement...',
    'common.error': 'Une erreur est survenue',
    'common.save': 'Enregistrer',
    'common.cancel': 'Annuler',
    'common.edit': 'Modifier',
    'common.delete': 'Supprimer',
    'common.price': 'Prix',
    'common.availability': 'Disponibilité',
    'common.available': 'Disponible',
    'common.sold': 'Vendu',
    
    // Artwork details
    'artwork.dimensions': 'Dimensions',
    'artwork.type': 'Type',
    'artwork.add_to_cart': 'Ajouter au panier',
    'artwork.in_cart': 'Dans le panier',
    
    // Events
    'event.date': 'Date',
    'event.time': 'Horaires',
    'event.location': 'Lieu',
    'event.status.upcoming': 'À venir',
    'event.status.ongoing': 'En cours',
    'event.status.completed': 'Terminé',
    'event.status.cancelled': 'Annulé',
    
    // Admin
    'admin.login': 'Connexion Admin',
    'admin.dashboard': 'Tableau de bord',
    'admin.artworks': 'Œuvres d\'art',
    'admin.events': 'Événements',
    'admin.orders': 'Commandes',
    'admin.newsletter': 'Newsletter',
    'admin.translation.edit': 'Modifier la traduction',
    'admin.translation.auto': 'Traduction automatique',
    'admin.translation.manual': 'Traduction manuelle',
  },
  en: {
    // Header
    'nav.home': 'Home',
    'nav.gallery': 'Gallery',
    'nav.events': 'Events',
    'nav.cart': 'Cart',
    
    // Gallery types
    'gallery.peinture': 'Painting',
    'gallery.3d': '3D',
    'gallery.sculpture': 'Sculpture',
    'gallery.aquarelle': 'Watercolor',
    
    // Footer
    'footer.newsletter.title': 'Stay informed',
    'footer.newsletter.subtitle': 'Subscribe to receive our latest creations',
    'footer.newsletter.placeholder': 'Your email address',
    'footer.newsletter.subscribe': 'Subscribe',
    'footer.newsletter.success': 'Thank you for subscribing!',
    'footer.newsletter.error': 'Error during subscription. Please try again.',
    'footer.newsletter.already_subscribed': 'You are already subscribed with this email address.',
    'footer.track_orders': 'Order tracking',
    'footer.legal_notice': 'Legal notice',
    'footer.privacy_policy': 'Privacy policy',
    'footer.terms': 'Terms',
    'footer.cookies': 'Cookies',
    'footer.rights': 'All rights reserved.',
    'footer.contact': 'For any questions, contact me via social media.',
    
    // Common
    'common.loading': 'Loading...',
    'common.error': 'An error occurred',
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.edit': 'Edit',
    'common.delete': 'Delete',
    'common.price': 'Price',
    'common.availability': 'Availability',
    'common.available': 'Available',
    'common.sold': 'Sold',
    
    // Artwork details
    'artwork.dimensions': 'Dimensions',
    'artwork.type': 'Type',
    'artwork.add_to_cart': 'Add to cart',
    'artwork.in_cart': 'In cart',
    
    // Events
    'event.date': 'Date',
    'event.time': 'Time',
    'event.location': 'Location',
    'event.status.upcoming': 'Upcoming',
    'event.status.ongoing': 'Ongoing',
    'event.status.completed': 'Completed',
    'event.status.cancelled': 'Cancelled',
    
    // Admin
    'admin.login': 'Admin Login',
    'admin.dashboard': 'Dashboard',
    'admin.artworks': 'Artworks',
    'admin.events': 'Events',
    'admin.orders': 'Orders',
    'admin.newsletter': 'Newsletter',
    'admin.translation.edit': 'Edit translation',
    'admin.translation.auto': 'Automatic translation',
    'admin.translation.manual': 'Manual translation',
  }
};

export const LanguageProvider = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState(() => {
    // Récupérer la langue depuis localStorage ou utiliser 'fr' par défaut
    return localStorage.getItem('language') || 'fr';
  });

  useEffect(() => {
    // Sauvegarder la langue dans localStorage
    localStorage.setItem('language', currentLanguage);
  }, [currentLanguage]);

  const changeLanguage = (language) => {
    if (translations[language]) {
      setCurrentLanguage(language);
    }
  };

  const t = (key, fallback = key) => {
    const translation = translations[currentLanguage]?.[key];
    return translation || fallback;
  };

  const value = {
    currentLanguage,
    changeLanguage,
    t,
    availableLanguages: Object.keys(translations)
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
