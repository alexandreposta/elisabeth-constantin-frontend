import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import i18n from '../i18n';

const LanguageContext = createContext();

const getBrowserLanguage = () => {
  if (typeof window === 'undefined') {
    return 'fr';
  }
  const stored = window.localStorage.getItem('app_language');
  if (stored) {
    return stored;
  }
  const navigatorLang = window.navigator?.language?.slice(0, 2).toLowerCase();
  return navigatorLang === 'en' ? 'en' : 'fr';
};

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(getBrowserLanguage);

  useEffect(() => {
    i18n.changeLanguage(language);
    if (typeof document !== 'undefined') {
      document.documentElement.lang = language;
    }
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('app_language', language);
    }
  }, [language]);

  const toggleLanguage = useCallback(() => {
    setLanguage((prev) => (prev === 'fr' ? 'en' : 'fr'));
  }, []);

  const value = useMemo(
    () => ({
      language,
      setLanguage,
      toggleLanguage,
    }),
    [language, toggleLanguage],
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
