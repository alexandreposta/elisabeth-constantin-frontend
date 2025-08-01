# Composant SortButton

Un composant React moderne et minimaliste pour les boutons de tri, avec une logique visuelle constante dans toute l'application.

## Fonctionnalités

- **Design moderne et minimaliste** avec dégradés et animations fluides
- **Indicateurs visuels clairs** pour l'état de tri (inactif, croissant, décroissant)
- **Animations** pour les changements d'état
- **Tailles configurables** (small, medium, large)
- **Styles variants** (default, minimal, rounded, pill)
- **Responsive** sur tous les appareils
- **Accessible** avec les bonnes pratiques d'accessibilité

## Installation

Le composant est déjà disponible dans le projet :
- **Composant :** `/src/components/SortButton.jsx`
- **Styles :** `/src/styles/sortButton.css`

## Utilisation de base

```jsx
import SortButton from '../components/SortButton';

function MyComponent() {
  const [currentSort, setCurrentSort] = useState({ field: "title", direction: "asc" });

  const handleSort = (sortConfig) => {
    setCurrentSort(sortConfig);
  };

  return (
    <SortButton
      field="title"
      currentSort={currentSort}
      onSort={handleSort}
      label="Titre"
    />
  );
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `field` | string | **required** | L'identifiant unique du champ de tri |
| `currentSort` | object | **required** | L'état actuel du tri `{ field, direction }` |
| `onSort` | function | **required** | Callback appelé lors du clic `(sortConfig) => void` |
| `label` | string | **required** | Le texte affiché sur le bouton |
| `size` | string | `'medium'` | Taille du bouton (`'small'`, `'medium'`, `'large'`) |
| `className` | string | `''` | Classes CSS additionnelles |

## Exemples d'utilisation

### Groupe de boutons de tri

```jsx
<div className="sort-buttons-group">
  <span className="sort-buttons-label">Trier par :</span>
  <SortButton
    field="title"
    currentSort={currentSort}
    onSort={handleSort}
    label="Titre"
    size="medium"
  />
  <SortButton
    field="price"
    currentSort={currentSort}
    onSort={handleSort}
    label="Prix"
    size="medium"
  />
  <SortButton
    field="date"
    currentSort={currentSort}
    onSort={handleSort}
    label="Date"
    size="medium"
  />
</div>
```

### Avec styles variants

```jsx
{/* Style minimal */}
<SortButton
  field="title"
  currentSort={currentSort}
  onSort={handleSort}
  label="Titre"
  className="minimal"
/>

{/* Style arrondi */}
<SortButton
  field="price"
  currentSort={currentSort}
  onSort={handleSort}
  label="Prix"
  className="rounded"
/>

{/* Style pill */}
<SortButton
  field="date"
  currentSort={currentSort}
  onSort={handleSort}
  label="Date"
  className="pill"
/>
```

### Logique de tri complète

```jsx
import React, { useState } from 'react';
import SortButton from '../components/SortButton';

function DataTable({ data }) {
  const [currentSort, setCurrentSort] = useState({ field: "name", direction: "asc" });

  const handleSort = (sortConfig) => {
    setCurrentSort(sortConfig);
  };

  const sortedData = [...data].sort((a, b) => {
    let result = 0;
    
    switch (currentSort.field) {
      case 'name':
        result = a.name.localeCompare(b.name);
        break;
      case 'price':
        result = a.price - b.price;
        break;
      case 'date':
        result = new Date(a.date) - new Date(b.date);
        break;
      default:
        result = 0;
    }
    
    return currentSort.direction === 'desc' ? -result : result;
  });

  return (
    <div>
      <div className="sort-buttons-group">
        <span className="sort-buttons-label">Trier par :</span>
        <SortButton
          field="name"
          currentSort={currentSort}
          onSort={handleSort}
          label="Nom"
        />
        <SortButton
          field="price"
          currentSort={currentSort}
          onSort={handleSort}
          label="Prix"
        />
        <SortButton
          field="date"
          currentSort={currentSort}
          onSort={handleSort}
          label="Date"
        />
      </div>
      
      {/* Affichage des données triées */}
      {sortedData.map(item => (
        <div key={item.id}>{item.name}</div>
      ))}
    </div>
  );
}
```

## Styles CSS disponibles

### Classes de base
- `.sort-button` - Style de base
- `.sort-button.small` - Petite taille
- `.sort-button.medium` - Taille moyenne (défaut)
- `.sort-button.large` - Grande taille
- `.sort-button.active` - État actif (tri appliqué)

### Classes de variant
- `.sort-button.minimal` - Style minimal et transparent
- `.sort-button.rounded` - Coins arrondis
- `.sort-button.pill` - Style capsule

### Classes d'état
- `.sort-icon.inactive` - Icône inactive
- `.sort-icon.active` - Icône active
- `.sort-icon.ascending` - Animation tri croissant
- `.sort-icon.descending` - Animation tri décroissant

## Intégration dans les pages existantes

Le composant a été intégré dans :

1. **AdminArtworks** - Tri des œuvres d'art
2. **AdminEvents** - Tri des événements
3. **AdminOrders** - Tri des commandes
4. **Evenements** - Tri des événements publics

## Responsive Design

Le composant s'adapte automatiquement :
- **Desktop** : Boutons en ligne avec espacements
- **Tablet** : Boutons plus compacts
- **Mobile** : Boutons empilés verticalement sur toute la largeur

## Personnalisation

Pour personnaliser l'apparence, modifiez le fichier `/src/styles/sortButton.css` :

```css
/* Personnaliser les couleurs */
.sort-button {
  --primary-color: #667eea;
  --secondary-color: #764ba2;
  --text-color: #2c3e50;
  --border-color: rgba(102, 126, 234, 0.1);
}

/* Nouveau variant personnalisé */
.sort-button.custom {
  background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%);
  border-color: #ff6b6b;
}
```

## Accessibilité

Le composant respecte les standards d'accessibilité :
- Navigation au clavier
- Indicateurs visuels clairs
- Transitions fluides
- Contraste suffisant
- Labels descriptifs

## Maintenance

Pour ajouter de nouveaux champs de tri :
1. Ajoutez le champ dans votre logique de tri
2. Créez un nouveau `SortButton` avec le bon `field`
3. Le composant gère automatiquement l'état visuel
