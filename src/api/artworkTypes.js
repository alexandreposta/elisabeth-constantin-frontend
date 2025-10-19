import { API_URL } from './config';

const API = `${API_URL}/artwork-types/`;

export async function getAllArtworkTypes() {
  const res = await fetch(`${API}`, {
    credentials: 'include',
  });
  if (!res.ok) throw new Error("Impossible de récupérer les types d'œuvres");
  return await res.json();
}

export async function createArtworkType(name, displayName = null) {
  const payload = { 
    name: name.toLowerCase().trim(),
    display_name: displayName || null
  };
  
  const res = await fetch(`${API}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(payload)
  });
  
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Erreur ${res.status}: ${errorText}`);
  }
  
  return await res.json();
}

export async function deleteArtworkType(typeName) {
  const res = await fetch(`${API}/${encodeURIComponent(typeName)}`, {
    method: 'DELETE',
    credentials: 'include',
  });
  
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Erreur ${res.status}: ${errorText}`);
  }
  
  return await res.json();
}
