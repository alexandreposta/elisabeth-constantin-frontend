// Configuration des animations pour la mosaïque
export const ANIMATION_CONFIG = {
  // Délai initial avant la première animation (ms)
  initialDelay: 500,
  
  // Délai entre les animations de colonnes (ms)
  columnDelay: 150,
  
  // Délai entre les animations d'images dans une colonne (ms)
  imageDelay: 100,
  
  // Durée de l'animation de fade out (ms)
  fadeOutDuration: 300,
  
  // Durée de l'animation de fade in (ms)
  fadeInDuration: 600,
  
  // Durée totale de l'animation (ms)
  totalAnimationDuration: 1200,
  
  // Répartition des images dans les colonnes
  columnSizes: [2, 2, 3],
  
  // Délai pour la redistribution automatique (ms)
  autoRedistributeDelay: 3000,
  
  // Transitions CSS
  transitions: {
    opacity: '0.6s ease',
    transform: '0.3s ease'
  }
};

// Configuration des styles pour les boutons
export const BUTTON_STYLES = {
  padding: '12px 24px',
  borderRadius: '25px',
  fontSize: '0.9rem',
  fontWeight: '500',
  minWidth: '180px',
  transition: 'all 0.3s ease',
  
  // Couleurs
  activeBackground: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  disabledBackground: '#bdc3c7',
  activeShadow: '0 4px 15px rgba(102, 126, 234, 0.3)',
  
  // Transformations
  activeScale: 'scale(1)',
  disabledScale: 'scale(0.95)'
};
