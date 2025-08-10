import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { translateText, updateManualTranslation, getEntityTranslations } from '../api/translations';
import '../styles/translationEditor.css';

const TranslationEditor = ({ entityType, entityId, fieldName, originalText, onTranslationUpdate }) => {
  const { t, currentLanguage } = useLanguage();
  const [translations, setTranslations] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadTranslations();
  }, [entityType, entityId, fieldName]);

  const loadTranslations = async () => {
    try {
      const response = await getEntityTranslations(entityType, entityId);
      const entityTranslations = response.translations || [];
      
      const fieldTranslation = entityTranslations.find(t => t.field_name === fieldName);
      
      if (fieldTranslation) {
        setTranslations({
          fr: fieldTranslation.fr || originalText,
          en: fieldTranslation.en || '',
          en_manual: fieldTranslation.en_manual || false
        });
      } else {
        setTranslations({
          fr: originalText,
          en: '',
          en_manual: false
        });
      }
    } catch (error) {
      console.error('Error loading translations:', error);
      setTranslations({
        fr: originalText,
        en: '',
        en_manual: false
      });
    }
  };

  const handleAutoTranslate = async () => {
    if (!originalText.trim()) return;

    setIsLoading(true);
    setError('');

    try {
      const result = await translateText(originalText, 'fr', 'en');
      
      setTranslations(prev => ({
        ...prev,
        en: result.translated_text,
        en_manual: false
      }));

      // Sauvegarder automatiquement la traduction automatique
      await updateManualTranslation(entityType, entityId, fieldName, 'en', result.translated_text);
      
      if (onTranslationUpdate) {
        onTranslationUpdate();
      }
    } catch (error) {
      console.error('Error auto-translating:', error);
      setError('Erreur lors de la traduction automatique');
    } finally {
      setIsLoading(false);
    }
  };

  const handleManualEdit = () => {
    setEditedText(translations.en || '');
    setIsEditing(true);
    setError('');
  };

  const handleSaveManualTranslation = async () => {
    if (!editedText.trim()) {
      setError('La traduction ne peut pas être vide');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      await updateManualTranslation(entityType, entityId, fieldName, 'en', editedText);
      
      setTranslations(prev => ({
        ...prev,
        en: editedText,
        en_manual: true
      }));

      setIsEditing(false);
      
      if (onTranslationUpdate) {
        onTranslationUpdate();
      }
    } catch (error) {
      console.error('Error saving manual translation:', error);
      setError('Erreur lors de la sauvegarde');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditedText('');
    setError('');
  };

  const getDisplayText = (language) => {
    if (language === 'fr') {
      return translations.fr || originalText;
    }
    return translations.en || '';
  };

  if (currentLanguage === 'fr') {
    return null; // Ne pas afficher l'éditeur si on est en français
  }

  return (
    <div className="translation-editor">
      <div className="translation-controls">
        <span className="translation-label">
          {t('admin.translation.edit')}
        </span>
        
        {!isEditing && (
          <div className="translation-buttons">
            <button
              onClick={handleAutoTranslate}
              disabled={isLoading}
              className="btn-auto-translate"
              title={t('admin.translation.auto')}
            >
              🔄
            </button>
            <button
              onClick={handleManualEdit}
              disabled={isLoading}
              className="btn-manual-edit"
              title={t('admin.translation.manual')}
            >
              ✏️
            </button>
          </div>
        )}
      </div>

      <div className="translation-content">
        {!isEditing ? (
          <div className="translation-display">
            <div className="translation-text">
              {getDisplayText('en') || (
                <span className="no-translation">
                  Pas de traduction anglaise
                </span>
              )}
            </div>
            {translations.en_manual && (
              <span className="manual-badge">Manuel</span>
            )}
          </div>
        ) : (
          <div className="translation-edit">
            <textarea
              value={editedText}
              onChange={(e) => setEditedText(e.target.value)}
              placeholder="Entrez la traduction anglaise..."
              className="translation-textarea"
              rows={3}
            />
            <div className="edit-buttons">
              <button
                onClick={handleSaveManualTranslation}
                disabled={isLoading || !editedText.trim()}
                className="btn-save"
              >
                {t('common.save')}
              </button>
              <button
                onClick={handleCancelEdit}
                disabled={isLoading}
                className="btn-cancel"
              >
                {t('common.cancel')}
              </button>
            </div>
          </div>
        )}
      </div>

      {error && (
        <div className="translation-error">
          {error}
        </div>
      )}
    </div>
  );
};

export default TranslationEditor;
