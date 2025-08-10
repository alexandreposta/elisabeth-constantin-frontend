import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import '../styles/languageSelector.css';

const LanguageSelector = () => {
  const { currentLanguage, changeLanguage } = useLanguage();

  const languages = [
    { code: 'fr', flag: '🇫🇷', name: 'Français' },
    { code: 'en', flag: '🇬🇧', name: 'English' }
  ];

  const handleLanguageChange = (languageCode) => {
    changeLanguage(languageCode);
  };

  return (
    <div className="language-selector">
      {languages.map((language) => (
        <button
          key={language.code}
          onClick={() => handleLanguageChange(language.code)}
          className={`language-btn ${currentLanguage === language.code ? 'active' : ''}`}
          title={language.name}
        >
          <span className="flag">{language.flag}</span>
        </button>
      ))}
    </div>
  );
};

export default LanguageSelector;
