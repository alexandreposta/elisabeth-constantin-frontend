import { API_URL } from './config';

export async function getOrdersByEmail(email) {
  try {
    const response = await fetch(`${API_URL}/orders/user/${email}`);
    if (!response.ok) {
      throw new Error('Erreur lors de la récupération des commandes');
    }
    return await response.json();
  } catch (error) {
    console.error('Erreur API:', error);
    throw error;
  }
}

export async function getOrderById(orderId) {
  try {
    const response = await fetch(`${API_URL}/orders/${orderId}`);
    if (!response.ok) {
      throw new Error('Erreur lors de la récupération de la commande');
    }
    return await response.json();
  } catch (error) {
    console.error('Erreur API:', error);
    throw error;
  }
}

// API pour l'administration des commandes
export const ordersAdminAPI = {
  // Récupérer toutes les commandes (admin)
  getAllOrders: async () => {
    try {
      const response = await fetch(`${API_URL}/orders/admin/all`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Erreur lors de la récupération des commandes:', error);
      throw error;
    }
  },

  // Récupérer une commande par ID (admin)
  getOrderById: async (orderId) => {
    try {
      const response = await fetch(`${API_URL}/orders/admin/${orderId}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Erreur lors de la récupération de la commande:', error);
      throw error;
    }
  },

  // Mettre à jour le statut d'une commande (admin)
  updateOrderStatus: async (orderId, status) => {
    try {
      const response = await fetch(`${API_URL}/orders/admin/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Erreur lors de la mise à jour du statut:', error);
      throw error;
    }
  },
};
