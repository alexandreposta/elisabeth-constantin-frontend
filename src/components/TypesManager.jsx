import React, { useState, useEffect } from 'react';
import { FaPlus, FaTrash, FaEdit, FaCog, FaTimes, FaCheck } from 'react-icons/fa';
import { updateArtworkType } from '../api/artworks';
import { createArtworkType, deleteArtworkType as deleteArtworkTypeAPI } from '../api/artworkTypes';
import '../styles/typesManager.css';

const TypesManager = ({ availableTypes, onTypesChange }) => {
  const [showModal, setShowModal] = useState(false);
  const [newType, setNewType] = useState('');
  const [editingType, setEditingType] = useState(null);
  const [editingValue, setEditingValue] = useState('');

  const handleAddType = async () => {
    if (newType.trim() && !availableTypes.includes(newType.trim().toLowerCase())) {
      try {
        const result = await createArtworkType(newType.trim().toLowerCase());
        const updatedTypes = [...availableTypes, newType.trim().toLowerCase()];
        onTypesChange(updatedTypes);
        setNewType('');
      } catch (error) {
        console.error('Erreur lors de la création du type:', error);
        alert('Erreur lors de la création du type d\'œuvre: ' + error.message);
      }
    }
  };

  const handleDeleteType = async (typeToDelete) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer le type "${getDisplayName(typeToDelete)}" ?`)) {
      try {
        await deleteArtworkTypeAPI(typeToDelete);
        const updatedTypes = availableTypes.filter(type => type !== typeToDelete);
        onTypesChange(updatedTypes);
      } catch (error) {
        console.error('Erreur lors de la suppression du type:', error);
        alert('Erreur lors de la suppression du type d\'œuvre: ' + error.message);
      }
    }
  };

  const handleEditType = async (oldType, newValue) => {
    if (newValue.trim() && newValue.trim().toLowerCase() !== oldType && !availableTypes.includes(newValue.trim().toLowerCase())) {
      try {
        const result = await updateArtworkType(oldType, newValue.trim().toLowerCase());
        
        const updatedTypes = availableTypes.map(type => 
          type === oldType ? newValue.trim().toLowerCase() : type
        );
        onTypesChange(updatedTypes);
        setEditingType(null);
        setEditingValue('');
      } catch (error) {
        alert('Erreur lors de la mise à jour du type d\'œuvre');
      }
    } else {
      setEditingType(null);
      setEditingValue('');
    }
  };

  const getDisplayName = (type) => {
    const displayNames = {
      'paint': 'Peinture',
      'peinture': 'Peinture',
      '3d': '3D',
      'sculpture': 'Sculpture',
      'aquarelle': 'Aquarelle'
    };
    return displayNames[type] || type.charAt(0).toUpperCase() + type.slice(1);
  };

  const handleModalClose = () => {
    setShowModal(false);
    setEditingType(null);
    setEditingValue('');
    setNewType('');
  };

  // Fermer le modal avec Escape
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        handleModalClose();
      }
    };

    if (showModal) {
      document.addEventListener('keydown', handleEscape);
      // Empêcher le scroll
      document.body.classList.add('modal-open');
    } else {
      document.body.classList.remove('modal-open');
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.classList.remove('modal-open');
    };
  }, [showModal]);

  return (
    <>
      <button
        className="types-manager-btn"
        onClick={() => setShowModal(true)}
      >
        <FaCog />
        Gérer les Types
      </button>

      {showModal && (
        <div className="types-modal-overlay" onClick={handleModalClose}>
          <div className="types-modal" onClick={(e) => e.stopPropagation()}>
            <div className="types-modal-header">
              <h2>Gestion des Types d'Œuvres</h2>
              <button
                className="modal-close-btn"
                onClick={handleModalClose}
              >
                <FaTimes />
              </button>
            </div>

            <div className="types-modal-content">
              <div className="add-type-section">
                <input
                  type="text"
                  placeholder="Nouveau type d'œuvre"
                  value={newType}
                  onChange={(e) => setNewType(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddType()}
                  className="add-type-input"
                />
                <button
                  type="button"
                  className="add-type-btn"
                  onClick={handleAddType}
                  disabled={!newType.trim()}
                >
                  <FaPlus />
                  Ajouter
                </button>
              </div>

              <div className="types-list">
                {availableTypes.length === 0 ? (
                  <div className="no-types">
                    <p>Aucun type d'œuvre disponible</p>
                  </div>
                ) : (
                  availableTypes.map(type => (
                    <div key={type} className="type-item">
                      {editingType === type ? (
                        <div className="edit-type-form">
                          <input
                            type="text"
                            value={editingValue}
                            onChange={(e) => setEditingValue(e.target.value)}
                            onKeyPress={(e) => {
                              if (e.key === 'Enter') {
                                handleEditType(type, editingValue);
                              }
                              if (e.key === 'Escape') {
                                setEditingType(null);
                                setEditingValue('');
                              }
                            }}
                            className="edit-type-input"
                            autoFocus
                          />
                          <div className="edit-type-actions">
                            <button
                              type="button"
                              className="confirm-edit-btn"
                              onClick={() => handleEditType(type, editingValue)}
                            >
                              <FaCheck />
                            </button>
                            <button
                              type="button"
                              className="cancel-edit-btn"
                              onClick={() => {
                                setEditingType(null);
                                setEditingValue('');
                              }}
                            >
                              <FaTimes />
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="type-display">
                          <span className="type-name">{getDisplayName(type)}</span>
                          <div className="type-actions">
                            <button
                              type="button"
                              className="edit-type-btn"
                              onClick={() => {
                                setEditingType(type);
                                setEditingValue(type);
                              }}
                              title="Modifier le type"
                            >
                              <FaEdit />
                            </button>
                            <button
                              type="button"
                              className="delete-type-btn"
                              onClick={() => handleDeleteType(type)}
                              title="Supprimer le type"
                            >
                              <FaTrash />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TypesManager;
