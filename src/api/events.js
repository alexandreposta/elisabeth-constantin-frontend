import { API_URL } from './config';

const API_BASE_URL = API_URL;

export const eventsAPI = {
  // Récupérer tous les événements
  getAllEvents: async (language = 'fr') => {
    const response = await fetch(`${API_BASE_URL}/events/?language=${language}`, {
      credentials: 'include',
    });
    if (!response.ok) {
      throw new Error('Erreur lors de la récupération des événements');
    }
    return response.json();
  },

  // Récupérer un événement par ID
  getEventById: async (id, language = 'fr') => {
    const response = await fetch(`${API_BASE_URL}/events/${id}?language=${language}`, {
      credentials: 'include',
    });
    if (!response.ok) {
      throw new Error('Erreur lors de la récupération de l\'événement');
    }
    return response.json();
  },

  // Créer un nouvel événement
  createEvent: async (eventData) => {
    const response = await fetch(`${API_BASE_URL}/events/`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(eventData),
    });
    if (!response.ok) {
      throw new Error('Erreur lors de la création de l\'événement');
    }
    return response.json();
  },

  // Mettre à jour un événement
  updateEvent: async (id, eventData) => {
    const response = await fetch(`${API_BASE_URL}/events/${id}`, {
      method: 'PUT',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(eventData),
    });
    if (!response.ok) {
      throw new Error('Erreur lors de la mise à jour de l\'événement');
    }
    return response.json();
  },

  // Supprimer un événement
  deleteEvent: async (id) => {
    const response = await fetch(`${API_BASE_URL}/events/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    });
    if (!response.ok) {
      throw new Error('Erreur lors de la suppression de l\'événement');
    }
    return response.json();
  },
};
