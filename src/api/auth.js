import { API_URL } from './config';

// Service d'authentification avec sessions sécurisées
export class AuthService {
  
  // Connexion avec cookie sécurisé automatique
  static async login(username, password) {
    try {
      const response = await fetch(`${API_URL}/admin/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Important pour les cookies
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Le cookie est automatiquement géré par le navigateur
        return { success: true, message: data.message };
      } else {
        return { success: false, message: data.message || 'Erreur de connexion' };
      }
    } catch (error) {
      return { success: false, message: 'Erreur réseau' };
    }
  }

  // Déconnexion
  static async logout() {
    try {
      await fetch(`${API_URL}/admin/logout`, {
        method: 'POST',
        credentials: 'include'
      });
      // Le cookie est automatiquement supprimé côté serveur
      return true;
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
      return false;
    }
  }

  // Vérification de session
  static async isAuthenticated() {
    try {
      const response = await fetch(`${API_URL}/admin/verify`, {
        method: 'GET',
        credentials: 'include' // Inclure le cookie
      });

      if (response.ok) {
        const data = await response.json();
        return data.valid;
      }
      
      // Si le statut est 401, c'est normal (pas encore authentifié)
      if (response.status === 401) {
        return false;
      }
      
      return false;
    } catch (error) {
      // Erreur réseau ou serveur indisponible - retourner false silencieusement
      return false;
    }
  }

  // Récupérer les infos utilisateur
  static async getCurrentUser() {
    try {
      const response = await fetch(`${API_URL}/admin/verify`, {
        method: 'GET', 
        credentials: 'include'
      });

      if (response.ok) {
        const data = await response.json();
        return data.valid ? { username: data.username } : null;
      }
      return null;
    } catch (error) {
      return null;
    }
  }

  // Alias pour getCurrentUser (pour compatibilité)
  static async getCurrentAdmin() {
    return await this.getCurrentUser();
  }

  // Nettoyer complètement l'authentification
  static async clearAuth() {
    try {
      await fetch(`${API_URL}/admin/clear-auth`, {
        method: 'POST',
        credentials: 'include'
      });
      return true;
    } catch (error) {
      console.error('Erreur lors du nettoyage de l\'authentification:', error);
      return false;
    }
  }

  // Méthode pour configurer les requêtes authentifiées
  static async authenticatedFetch(url, options = {}) {
    const defaultOptions = {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    };

    return fetch(url, { ...defaultOptions, ...options });
  }

  // Récupérer les statistiques du dashboard
  static async getDashboardStats() {
    try {
      const response = await this.authenticatedFetch(`${API_URL}/admin/dashboard/stats`);
      
      if (response.status === 401) {
        // Session expirée, rediriger vers login
        window.location.href = '/admin/login';
        throw new Error('Session expirée');
      }
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Erreur API dashboard:', response.status, errorText);
        throw new Error(`Erreur ${response.status}: ${errorText || 'Erreur serveur'}`);
      }

      return await response.json();
    } catch (error) {
      if (error.message === 'Session expirée') {
        throw error; // Re-throw pour permettre la redirection
      }
      
      console.error('Erreur lors de la récupération des statistiques:', error);
      
      // Retourner des données par défaut plutôt que de faire planter l'app
      return {
        sales: { daily_sales: [], popular_artworks: [], monthly_trends: [] },
        inventory: { artwork_types: [], price_ranges: [] },
        performance: { conversion_data: { total_artworks: 0, total_orders: 0, conversion_rate: 0 }, avg_days_between_orders: 0 },
        last_updated: new Date().toISOString(),
        error: true,
        errorMessage: error.message || 'Erreur de connexion'
      };
    }
  }
}

// Hook pour utiliser l'authentification dans les composants
export const useAuth = () => {
  const login = async (username, password) => {
    return await AuthService.login(username, password);
  };

  const logout = async () => {
    const success = await AuthService.logout();
    if (success) {
      window.location.href = '/admin/login';
    }
    return success;
  };

  const getCurrentUser = async () => {
    return await AuthService.getCurrentUser();
  };

  const getDashboardStats = async () => {
    return await AuthService.getDashboardStats();
  };

  const checkAuthentication = async () => {
    return await AuthService.isAuthenticated();
  };

  return {
    login,
    logout,
    getCurrentUser,
    getDashboardStats,
    checkAuthentication,
  };
};
