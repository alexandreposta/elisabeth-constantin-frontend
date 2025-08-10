import React, { useState, useEffect } from 'react';
import { getAllArtworks } from '../api/artworks';
import { eventsAPI } from '../api/events';
import { getEntityTranslations, translateText, updateManualTranslation, refreshEntityTranslations } from '../api/translations';
import TranslationEditor from '../components/TranslationEditor';
import '../styles/adminTranslations.css';

const AdminTranslations = () => {
  const [activeTab, setActiveTab] = useState('artworks');
  const [artworks, setArtworks] = useState([]);
  const [events, setEvents] = useState([]);
  const [selectedEntity, setSelectedEntity] = useState(null);
  const [translations, setTranslations] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadData();
  }, [activeTab]);

  const loadData = async () => {
    try {
      setLoading(true);
      if (activeTab === 'artworks') {
        const artworksData = await getAllArtworks('fr');
        setArtworks(artworksData);
      } else {
        const eventsData = await eventsAPI.getAllEvents('fr');
        setEvents(eventsData);
      }
    } catch (error) {
      console.error('Error loading data:', error);
      setError('Erreur lors du chargement des données');
    } finally {
      setLoading(false);
    }
  };

  const loadEntityTranslations = async (entityType, entityId) => {
    try {
      const response = await getEntityTranslations(entityType, entityId);
      const entityTranslations = {};
      
      response.translations.forEach(translation => {
        entityTranslations[translation.field_name] = translation;
      });
      
      setTranslations(entityTranslations);
    } catch (error) {
      console.error('Error loading translations:', error);
      setTranslations({});
    }
  };

  const handleEntitySelect = (entity, type) => {
    setSelectedEntity({ ...entity, type });
    loadEntityTranslations(type, entity._id || entity.id);
  };

  const handleTranslationUpdate = () => {
    if (selectedEntity) {
      loadEntityTranslations(selectedEntity.type, selectedEntity._id || selectedEntity.id);
    }
  };

  const handleRefreshTranslations = async (entityType, entityId) => {
    try {
      setLoading(true);
      await refreshEntityTranslations(entityType, entityId);
      loadEntityTranslations(entityType, entityId);
    } catch (error) {
      console.error('Error refreshing translations:', error);
      setError('Erreur lors de l\'actualisation des traductions');
    } finally {
      setLoading(false);
    }
  };

  const renderEntityList = () => {
    const entities = activeTab === 'artworks' ? artworks : events;
    const entityType = activeTab === 'artworks' ? 'artwork' : 'event';

    return (
      <div className="entity-list">
        <h3>
          {activeTab === 'artworks' ? 'Œuvres d\'art' : 'Événements'}
        </h3>
        
        {entities.map((entity) => (
          <div
            key={entity._id || entity.id}
            className={`entity-item ${selectedEntity?._id === entity._id || selectedEntity?.id === entity.id ? 'selected' : ''}`}
            onClick={() => handleEntitySelect(entity, entityType)}
          >
            <div className="entity-info">
              <h4>{entity.title}</h4>
              <p className="entity-description">
                {entity.description?.substring(0, 100)}...
              </p>
              {activeTab === 'artworks' && (
                <span className="entity-type">{entity.type}</span>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderTranslationEditor = () => {
    if (!selectedEntity) {
      return (
        <div className="no-selection">
          <p>Sélectionnez une entité pour gérer ses traductions</p>
        </div>
      );
    }

    return (
      <div className="translation-editor-container">
        <div className="entity-header">
          <h3>{selectedEntity.title}</h3>
          <button
            onClick={() => handleRefreshTranslations(
              selectedEntity.type,
              selectedEntity._id || selectedEntity.id
            )}
            className="btn-refresh"
            disabled={loading}
          >
            🔄 Actualiser les traductions automatiques
          </button>
        </div>

        <div className="translation-fields">
          {/* Titre */}
          <div className="field-section">
            <h4>Titre</h4>
            <div className="field-content">
              <div className="french-text">
                <strong>Français:</strong> {selectedEntity.title}
              </div>
              <TranslationEditor
                entityType={selectedEntity.type}
                entityId={selectedEntity._id || selectedEntity.id}
                fieldName="title"
                originalText={selectedEntity.title}
                onTranslationUpdate={handleTranslationUpdate}
              />
            </div>
          </div>

          {/* Description */}
          {selectedEntity.description && (
            <div className="field-section">
              <h4>Description</h4>
              <div className="field-content">
                <div className="french-text">
                  <strong>Français:</strong>
                  <p>{selectedEntity.description}</p>
                </div>
                <TranslationEditor
                  entityType={selectedEntity.type}
                  entityId={selectedEntity._id || selectedEntity.id}
                  fieldName="description"
                  originalText={selectedEntity.description}
                  onTranslationUpdate={handleTranslationUpdate}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="admin-translations">
      <div className="page-header">
        <h1>Gestion des traductions</h1>
        <p>Gérez les traductions automatiques et manuelles de vos contenus</p>
      </div>

      <div className="tabs">
        <button
          className={`tab ${activeTab === 'artworks' ? 'active' : ''}`}
          onClick={() => setActiveTab('artworks')}
        >
          Œuvres d'art
        </button>
        <button
          className={`tab ${activeTab === 'events' ? 'active' : ''}`}
          onClick={() => setActiveTab('events')}
        >
          Événements
        </button>
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      <div className="content-container">
        <div className="left-panel">
          {loading ? (
            <div className="loading">Chargement...</div>
          ) : (
            renderEntityList()
          )}
        </div>

        <div className="right-panel">
          {renderTranslationEditor()}
        </div>
      </div>
    </div>
  );
};

export default AdminTranslations;
