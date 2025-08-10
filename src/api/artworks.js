import { API_URL } from './config';

const API = `${API_URL}/artworks`;

export async function getAllArtworks(language = 'fr') {
  const res = await fetch(`${API}?language=${language}`, {
    credentials: 'include',
  });
  if (!res.ok) throw new Error("Impossible de récupérer les œuvres");  
  return await res.json();
}

export async function getArtworkById(id, language = 'fr') {
  const res = await fetch(`${API}/${id}?language=${language}`, {
    credentials: 'include',
  });
  if (!res.ok) throw new Error("Œuvre introuvable");
  return await res.json();
}

export async function createArtwork(payload) {
  const res = await fetch(API, {
    method: "POST",
    credentials: 'include',
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error("Création impossible");
  return await res.json();
}

export async function updateArtwork(id, payload) {
  const res = await fetch(`${API}/${id}`, {
    method: "PUT",
    credentials: 'include',
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error("Mise à jour impossible");
  return await res.json();
}

export async function deleteArtworkById(id) {
  const res = await fetch(`${API}/${id}`, { 
    method: "DELETE",
    credentials: 'include',
  });
  if (!res.ok) throw new Error("Suppression impossible");
  return await res.json();
}

export async function getGalleryTypes() {
  const res = await fetch(`${API}/gallery-types`, {
    credentials: 'include',
  });
  if (!res.ok) throw new Error("Impossible de récupérer les types d'œuvres");
  return await res.json();
}

export async function getArtworksByGallery(galleryType, language = 'fr') {
  const res = await fetch(`${API}/by-gallery/${encodeURIComponent(galleryType)}?language=${language}`, {
    credentials: 'include',
  });
  if (!res.ok) throw new Error("Impossible de récupérer les œuvres de cette galerie");
  return await res.json();
}

export async function getAllGalleryTypes() {
  const res = await fetch(`${API}/gallery-types/all`);
  if (!res.ok) throw new Error("Impossible de récupérer tous les types de galerie");
  return await res.json();
}

// API pour la gestion des types d'œuvres
export async function updateArtworkType(oldType, newType) {
  const payload = { oldType, newType };
  const url = `${API}/update-type`;
  try {
    const res = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
    
    if (!res.ok) {
      // Lire le corps de la réponse pour plus de détails
      const errorText = await res.text();
      throw new Error(`Erreur ${res.status}: ${res.statusText} - ${errorText}`);
    }
    
    const result = await res.json();
    return result;
  } catch (error) {
    throw error;
  }
}
