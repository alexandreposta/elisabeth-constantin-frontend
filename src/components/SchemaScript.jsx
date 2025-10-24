import { useEffect } from 'react';

/**
 * Composant pour injecter des données structurées JSON-LD
 * Compatible React 19+ sans dépendances externes
 * 
 * Props:
 * - schema: objet JavaScript à convertir en JSON-LD
 * - id: identifiant unique pour le script (optionnel)
 */
export default function SchemaScript({ schema, id }) {
  useEffect(() => {
    if (!schema) return;

    const scriptId = id || `schema-${Date.now()}`;
    
    // Créer ou mettre à jour le script
    let scriptElement = document.getElementById(scriptId);
    
    if (!scriptElement) {
      scriptElement = document.createElement('script');
      scriptElement.id = scriptId;
      scriptElement.type = 'application/ld+json';
      document.head.appendChild(scriptElement);
    }
    
    scriptElement.textContent = JSON.stringify(schema);

    // Cleanup: retirer le script quand le composant est démonté
    return () => {
      const element = document.getElementById(scriptId);
      if (element) {
        element.remove();
      }
    };
  }, [schema, id]);

  return null;
}
