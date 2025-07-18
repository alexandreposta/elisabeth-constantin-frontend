import React, { useState, useEffect } from 'react';
import { FaPlus, FaTrash, FaEdit } from 'react-icons/fa';
import '../styles/artworkTypesManager.css';

const ArtworkTypesManager = ({ 
  availableTypes, 
  onTypesChange, 
  selectedType, 
  onTypeSelect 
}) => {
  const [showManager, setShowManager] = useState(false);
  const [types, setTypes] = useState(availableTypes || []);
  const [newType, setNewType] = useState('');
  const [editingType, setEditingType] = useState(null);
  const [editingValue, setEditingValue] = useState('');

  useEffect(() => {
    setTypes(availableTypes || []);
  }, [availableTypes]);

  const handleAddType = () => {
    if (newType.trim() && !types.includes(newType.trim().toLowerCase())) {
      const updatedTypes = [...types, newType.trim().toLowerCase()];
      setTypes(updatedTypes);
      onTypesChange(updatedTypes);
      setNewType('');
    }
  };

  const handleDeleteType = (typeToDelete) => {
    const updatedTypes = types.filter(type => type !== typeToDelete);
    setTypes(updatedTypes);
    onTypesChange(updatedTypes);
  };

  const handleEditType = (oldType, newValue) => {
    if (newValue.trim() && !types.includes(newValue.trim().toLowerCase())) {
      const updatedTypes = types.map(type => 
        type === oldType ? newValue.trim().toLowerCase() : type
      );
      setTypes(updatedTypes);
      onTypesChange(updatedTypes);
      setEditingType(null);
      setEditingValue('');
    }
  };

  const getDisplayName = (type) => {
    const displayNames = {
      'paint': 'Peinture',
      '3d': '3D',
      'sculpture': 'Sculpture',
      'aquarelle': 'Aquarelle'
    };
    return displayNames[type] || type.charAt(0).toUpperCase() + type.slice(1);
  };

  return (
    <div className="artwork-types-manager">
      <div className="type-selector">
        <label>Type d'œuvre</label>
        <div className="type-input-group">
          <select
            value={selectedType}
            onChange={(e) => onTypeSelect(e.target.value)}
            required
          >
            <option value="">Sélectionner un type</option>
            {types.map(type => (
              <option key={type} value={type}>
                {getDisplayName(type)}
              </option>
            ))}
          </select>
          <button
            type="button"
            className="manage-types-btn"
            onClick={() => setShowManager(!showManager)}
          >
            <FaEdit />
          </button>
        </div>
      </div>

      {showManager && (
        <div className="types-manager-panel">
          <h4>Gérer les types d'œuvres</h4>
          
          <div className="add-type-section">
            <input
              type="text"
              placeholder="Nouveau type d'œuvre"
              value={newType}
              onChange={(e) => setNewType(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddType()}
            />
            <button
              type="button"
              className="add-type-btn"
              onClick={handleAddType}
            >
              <FaPlus />
            </button>
          </div>

          <div className="types-list">
            {types.map(type => (
              <div key={type} className="type-item">
                {editingType === type ? (
                  <div className="edit-type-group">
                    <input
                      type="text"
                      value={editingValue}
                      onChange={(e) => setEditingValue(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          handleEditType(type, editingValue);
                        }
                      }}
                      autoFocus
                    />
                    <button
                      type="button"
                      onClick={() => handleEditType(type, editingValue)}
                      className="save-edit-btn"
                    >
                      ✓
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setEditingType(null);
                        setEditingValue('');
                      }}
                      className="cancel-edit-btn"
                    >
                      ✗
                    </button>
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
                      >
                        <FaEdit />
                      </button>
                      <button
                        type="button"
                        className="delete-type-btn"
                        onClick={() => handleDeleteType(type)}
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ArtworkTypesManager;
