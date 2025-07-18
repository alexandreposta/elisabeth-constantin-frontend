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
      return false;
    } catch (error) {
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
      
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des statistiques');
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur lors de la récupération des statistiques:', error);
      throw error;
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
