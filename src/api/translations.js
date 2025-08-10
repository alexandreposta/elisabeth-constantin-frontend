import { API_URL } from './config';

export const translateText = async (text, sourceLanguage = 'fr', targetLanguage = 'en') => {
  try {
    const response = await fetch(`${API_URL}/translations/translate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text,
        source_language: sourceLanguage,
        target_language: targetLanguage
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error translating text:', error);
    throw error;
  }
};

export const updateManualTranslation = async (entityType, entityId, fieldName, language, translatedText) => {
  try {
    const response = await fetch(`${API_URL}/translations/manual-update`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        entity_type: entityType,
        entity_id: entityId,
        field_name: fieldName,
        language,
        translated_text: translatedText
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error updating manual translation:', error);
    throw error;
  }
};

export const getEntityTranslations = async (entityType, entityId) => {
  try {
    const response = await fetch(`${API_URL}/translations/entity/${entityType}/${entityId}`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error getting entity translations:', error);
    throw error;
  }
};

export const refreshEntityTranslations = async (entityType, entityId) => {
  try {
    const response = await fetch(`${API_URL}/translations/refresh/${entityType}/${entityId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error refreshing translations:', error);
    throw error;
  }
};

export const getDeepLUsage = async () => {
  try {
    const response = await fetch(`${API_URL}/translations/usage`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error getting DeepL usage:', error);
    throw error;
  }
};
