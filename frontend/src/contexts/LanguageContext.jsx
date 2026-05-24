import React, { createContext, useState, useContext, useEffect } from 'react';
import en from '../i18n/en.json';
import th from '../i18n/th.json';

const translations = { en, th };

const LanguageContext = createContext();

export const useLanguage = () => useContext(LanguageContext);

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('th');

  useEffect(() => {
    const savedLang = localStorage.getItem('appLanguage');
    if (savedLang && translations[savedLang]) {
      setLanguage(savedLang);
    }
  }, []);

  const changeLanguage = (lang) => {
    if (translations[lang]) {
      setLanguage(lang);
      localStorage.setItem('appLanguage', lang);
    }
  };

  const t = (key) => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, changeLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};
