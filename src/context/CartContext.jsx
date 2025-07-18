import React, { createContext, useContext, useReducer, useEffect } from 'react';

const CartContext = createContext();

// Fonction utilitaire pour normaliser les IDs
// Les IDs peuvent être stockés sous forme de string ou dans la propriété _id
const normalizeId = (item) => {
  // Assurer une copie pour ne pas modifier l'original
  const normalizedItem = { ...item };
  
  // Si l'objet a un _id et pas d'id, utiliser _id comme id
  if (normalizedItem._id && !normalizedItem.id) {
    normalizedItem.id = normalizedItem._id;
  }
  
  // Si l'id est un objet (parfois MongoDB retourne des objets ObjectId), le convertir en string
  if (typeof normalizedItem.id === 'object') {
    normalizedItem.id = String(normalizedItem.id);
  }
  
  return normalizedItem;
};

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_TO_CART':
      // Normaliser l'item à ajouter
      const normalizedPayload = normalizeId(action.payload);
      
      // Vérifier si l'item existe déjà
      const existingItem = state.items.find(item => 
        String(item.id) === String(normalizedPayload.id) || 
        String(item._id) === String(normalizedPayload.id) ||
        (item._id && normalizedPayload._id && String(item._id) === String(normalizedPayload._id))
      );
      
      if (existingItem) {
        return state; // Ne pas ajouter si déjà présent (œuvres uniques)
      }
      
      return {
        ...state,
        items: [...state.items, normalizedPayload],
      };
    
    case 'REMOVE_FROM_CART':
      return {
        ...state,
        items: state.items.filter(item => String(item.id) !== String(action.payload)),
      };
    
    case 'CLEAR_CART':
      return {
        ...state,
        items: [],
      };
    
    case 'LOAD_CART':
      // Normaliser tous les items chargés
      const normalizedItems = action.payload.map(normalizeId);
      return {
        ...state,
        items: normalizedItems,
      };
    
    default:
      return state;
  }
};

export const CartProvider = ({ children }) => {
  // Initialiser l'état avec les données du localStorage s'il y en a
  const initialState = () => {
    try {
      const savedCart = localStorage.getItem('cart');
      return { items: savedCart ? JSON.parse(savedCart) : [] };
    } catch (error) {
      console.error("Erreur lors du chargement du panier:", error);
      return { items: [] };
    }
  };

  const [state, dispatch] = useReducer(cartReducer, initialState());

  // Sauvegarder le panier dans localStorage chaque fois que l'état change
  useEffect(() => {
    try {
      localStorage.setItem('cart', JSON.stringify(state.items));
    } catch (error) {
      console.error("Erreur lors de la sauvegarde du panier:", error);
    }
  }, [state.items]);

  const addToCart = (artwork) => {
    dispatch({ type: 'ADD_TO_CART', payload: artwork });
  };

  const removeFromCart = (artworkId) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: artworkId });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const getTotalPrice = () => {
    return state.items.reduce((total, item) => total + item.price, 0);
  };

  const getItemCount = () => {
    return state.items.length;
  };

  const isInCart = (artworkId) => {
    return state.items.some(item => item.id === artworkId);
  };

  return (
    <CartContext.Provider value={{
      items: state.items,
      addToCart,
      removeFromCart,
      clearCart,
      getTotalPrice,
      getItemCount,
      isInCart,
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
