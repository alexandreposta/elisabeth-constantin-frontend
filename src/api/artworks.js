import { API_URL } from './config';

const API = `${API_URL}/artworks`;

export async function getAllArtworks() {
  const res = await fetch(`${API}/`, {
    credentials: 'include',
  });
  if (!res.ok) throw new Error("Impossible de récupérer les œuvres");  
  return await res.json();
}

export async function getArtworkById(id) {
  const res = await fetch(`${API}/${id}`, {
    credentials: 'include',
  });
  if (!res.ok) throw new Error("Œuvre introuvable");
  return await res.json();
}

export async function createArtwork(payload) {
  const res = await fetch(`${API}/`, {
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
  const timestamp = Date.now();
  const url = `${API}/gallery-types?_t=${timestamp}`;
  
  const res = await fetch(url, {
    credentials: 'include',
  });
  if (!res.ok) {
    throw new Error("Impossible de récupérer les types de galerie");
  }
  
  const data = await res.json();
  return data;
}

export async function getAllGalleryTypes() {
  const res = await fetch(`${API}/gallery-types/all`);
  if (!res.ok) throw new Error("Impossible de récupérer tous les types de galerie");
  return await res.json();
}

export async function getArtworksByGallery(galleryType) {
  // Décoder d'abord pour éviter le double-encodage si galleryType est déjà encodé
  let decoded = galleryType;
  try {
    decoded = decodeURIComponent(galleryType);
  } catch (e) {
    // si decodeURIComponent échoue, on garde la valeur d'origine
    decoded = galleryType;
  }

  const url = `${API}/by-gallery/${encodeURIComponent(decoded)}`;
  const res = await fetch(url);
  // Si la réponse est du HTML (index.html), probablement VITE_API_URL mal configurée ou rewrite qui sert le frontend
  const contentType = res.headers.get('content-type') || '';
  if (contentType.includes('text/html')) {
    const body = await res.text();
    console.error('API response is HTML (possible misconfigured API URL). Requested:', url);
    console.error('Response body starts with:', body.slice(0, 200));
    throw new Error('API misconfigured: received HTML instead of JSON. Check VITE_API_URL and vercel rewrites.');
  }
  if (!res.ok) throw new Error("Impossible de récupérer les œuvres de cette galerie");
  return await res.json();
}

// API pour la gestion des types d'œuvres
export async function updateArtworkType(oldType, newType) {
  const payload = { oldType, newType };
  const url = `${API}/type/update`;
  try {
    const res = await fetch(url, {
      method: 'PUT',
      credentials: 'include',
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
