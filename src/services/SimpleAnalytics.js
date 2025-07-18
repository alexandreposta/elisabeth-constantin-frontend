// Service de tracking simple pour les visites et tendances
// Compatible avec GitHub Pages + Vercel, 100% gratuit

class SimpleAnalytics {
  constructor() {
    this.storageKey = 'site-analytics';
    this.artworkKey = 'artwork-views';
  }

  // Initialiser le tracking
  init() {
    this.trackSiteConnection(); // Compter les connexions uniques
    this.trackPageView(); // Suivre les pages vues
    this.setupBeforeUnload();
  }

  // Tracker une connexion au site (une seule par jour)
  trackSiteConnection() {
    const data = this.getStoredData();
    const today = new Date();
    const month = today.toISOString().slice(0, 7); // YYYY-MM
    const day = today.toISOString().slice(0, 10); // YYYY-MM-DD

    // Vérifier si c'est une nouvelle connexion aujourd'hui
    const lastConnectionDay = data.lastConnectionDay;
    if (lastConnectionDay === day) {
      return; // Déjà connecté aujourd'hui, ne pas compter
    }

    // Nouvelle connexion
    data.totalConnections = (data.totalConnections || 0) + 1;
    data.lastConnectionDay = day;

    // Connexions par mois
    data.monthlyConnections = data.monthlyConnections || {};
    data.monthlyConnections[month] = (data.monthlyConnections[month] || 0) + 1;

    // Dernière visite
    data.lastVisit = today.toISOString();

    this.saveData(data);
  }

  // Tracker une vue de page (pour les statistiques détaillées)
  trackPageView() {
    const data = this.getStoredData();
    const page = window.location.pathname;

    // Vues par page
    data.pageViews = data.pageViews || {};
    data.pageViews[page] = (data.pageViews[page] || 0) + 1;

    this.saveData(data);
  }

  // Tracker la vue d'une œuvre
  trackArtworkView(artworkId, artworkTitle, artworkType) {
    const data = this.getArtworkData();
    const key = `${artworkId}`;
    const month = new Date().toISOString().slice(0, 7);

    if (!data[key]) {
      data[key] = {
        id: artworkId,
        title: artworkTitle,
        type: artworkType,
        totalViews: 0,
        monthlyViews: {}
      };
    }

    data[key].totalViews += 1;
    data[key].monthlyViews[month] = (data[key].monthlyViews[month] || 0) + 1;
    data[key].lastViewed = new Date().toISOString();

    this.saveArtworkData(data);
  }

  // Obtenir les statistiques mensuelles des connexions
  getMonthlyConnectionStats() {
    const data = this.getStoredData();
    return data.monthlyConnections || {};
  }

  // Obtenir les tendances des œuvres
  getArtworkTrends(limit = 10) {
    const data = this.getArtworkData();
    const artworks = Object.values(data);
    
    return artworks
      .sort((a, b) => b.totalViews - a.totalViews)
      .slice(0, limit)
      .map(artwork => ({
        id: artwork.id,
        title: artwork.title,
        type: artwork.type,
        views: artwork.totalViews,
        lastViewed: artwork.lastViewed
      }));
  }

  // Obtenir les stats du mois en cours
  getCurrentMonthStats() {
    const currentMonth = new Date().toISOString().slice(0, 7);
    const data = this.getStoredData();
    const artworkData = this.getArtworkData();

    const totalConnections = data.monthlyConnections?.[currentMonth] || 0;
    const artworkViews = Object.values(artworkData)
      .reduce((sum, artwork) => sum + (artwork.monthlyViews?.[currentMonth] || 0), 0);

    return {
      totalConnections,
      artworkViews,
      month: currentMonth
    };
  }

  // Obtenir toutes les stats pour le dashboard
  getDashboardStats() {
    const data = this.getStoredData();
    const artworkData = this.getArtworkData();
    const trends = this.getArtworkTrends(5);
    const monthlyStats = this.getMonthlyConnectionStats();

    return {
      overview: {
        totalConnections: data.totalConnections || 0,
        totalArtworkViews: Object.values(artworkData).reduce((sum, a) => sum + a.totalViews, 0),
        lastVisit: data.lastVisit
      },
      monthly: monthlyStats,
      topArtworks: trends,
      currentMonth: this.getCurrentMonthStats()
    };
  }

  // Utilitaires de stockage
  getStoredData() {
    try {
      return JSON.parse(localStorage.getItem(this.storageKey) || '{}');
    } catch {
      return {};
    }
  }

  getArtworkData() {
    try {
      return JSON.parse(localStorage.getItem(this.artworkKey) || '{}');
    } catch {
      return {};
    }
  }

  saveData(data) {
    localStorage.setItem(this.storageKey, JSON.stringify(data));
  }

  saveArtworkData(data) {
    localStorage.setItem(this.artworkKey, JSON.stringify(data));
  }

  // Nettoyer les données anciennes (optionnel)
  cleanup() {
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    const cutoffMonth = sixMonthsAgo.toISOString().slice(0, 7);

    const data = this.getStoredData();
    if (data.monthlyConnections) {
      Object.keys(data.monthlyConnections).forEach(month => {
        if (month < cutoffMonth) {
          delete data.monthlyConnections[month];
        }
      });
      this.saveData(data);
    }
  }

  setupBeforeUnload() {
    // Sauvegarder avant fermeture (optionnel)
    window.addEventListener('beforeunload', () => {
      this.cleanup();
    });
  }
}

// Export pour utilisation
export default SimpleAnalytics;
