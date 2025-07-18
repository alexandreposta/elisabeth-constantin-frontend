import { API_URL } from './config';

// Service d'authentification
export class AuthService {
  static TOKEN_KEY = 'admin_token';

  // Utilitaires pour cookies
  static setCookie(name, value, days = 7) {
    const expires = new Date();
    expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
    document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;secure;samesite=strict`;
  }

  static getCookie(name) {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for(let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === ' ') c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
  }

  static deleteCookie(name) {
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
  }

  // Connexion
  static async login(username, password) {
    try {
      const response = await fetch(`${API_URL}/admin/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Erreur de connexion');
      }

      const data = await response.json();
      // Stocker le token uniquement dans un cookie sécurisé
      this.setCookie(this.TOKEN_KEY, data.access_token);
      return data;
    } catch (error) {
      console.error('Erreur lors de la connexion:', error);
      throw error;
    }
  }

  // Déconnexion
  static logout() {
    this.deleteCookie(this.TOKEN_KEY);
  }

  // Vérifier si connecté
  static isAuthenticated() {
    return this.getCookie(this.TOKEN_KEY) !== null;
  }

  // Récupérer le token
  static getToken() {
    return this.getCookie(this.TOKEN_KEY);
  }

  // Vérifier la validité du token
  static async verifyToken() {
    try {
      const token = this.getToken();
      
      if (!token) {
        return false;
      }
      const response = await fetch(`${API_URL}/admin/verify-token`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        this.logout();
        return false;
      }
      return true;
    } catch (error) {
      console.error('AuthService: verifyToken - Erreur:', error);
      this.logout(); // Supprimer le token en cas d'erreur
      return false;
    }
  }

  // Récupérer les infos de l'admin connecté
  static async getCurrentAdmin() {
    try {
      const token = this.getToken();
      if (!token) return null;

      const response = await fetch(`${API_URL}/admin/me`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des données admin');
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur lors de la récupération des données admin:', error);
      return null;
    }
  }

  // Récupérer les statistiques du dashboard
  static async getDashboardStats() {
    try {
      const token = this.getToken();
      if (!token) throw new Error('Token manquant');

      const response = await fetch(`${API_URL}/admin/dashboard/stats`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des statistiques');
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur lors de la récupération des statistiques:', error);
      throw error;
    }
  }

  // Créer un nouvel admin (super admin uniquement)
  static async createAdmin(adminData) {
    try {
      const token = this.getToken();
      if (!token) throw new Error('Token manquant');

      const response = await fetch(`${API_URL}/admin/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(adminData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Erreur lors de la création');
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur lors de la création admin:', error);
      throw error;
    }
  }
}

// Hook pour utiliser l'authentification dans les composants
export const useAuth = () => {
  const isAuthenticated = AuthService.isAuthenticated();
  
  const login = async (username, password) => {
    return await AuthService.login(username, password);
  };

  const logout = () => {
    AuthService.logout();
    window.location.href = '/admin/login';
  };

  const getCurrentAdmin = async () => {
    return await AuthService.getCurrentAdmin();
  };

  const getDashboardStats = async () => {
    return await AuthService.getDashboardStats();
  };

  return {
    isAuthenticated,
    login,
    logout,
    getCurrentAdmin,
    getDashboardStats,
  };
};
