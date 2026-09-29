import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';

interface I18nContextType {
  language: string;
  setLanguage: (lang: string) => void;
  t: (key: string) => string;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState(() => localStorage.getItem('appLanguage') || 'en');
  const [translations, setTranslations] = useState<{ [key: string]: { [key: string]: string } }>({});
  const [fallback, setFallback] = useState<{ [key: string]: string }>({});
  const attemptedLoads = useRef<Set<string>>(new Set());

  useEffect(() => {
    localStorage.setItem('appLanguage', language);
  }, [language]);

  useEffect(() => {
    const loadLang = async (lang: string) => {
      if (attemptedLoads.current.has(lang)) return;
      attemptedLoads.current.add(lang);

      try {
        const res = await fetch(`/i18n/${lang}.json`);
        if (!res.ok) {
          if (lang !== 'en') console.warn(`Translation file for '${lang}' not found.`);
          return;
        }
        const data = await res.json();
        setTranslations(prev => ({ ...prev, [lang]: data }));
        if (lang === 'en') {
          setFallback(data);
        }
      } catch (error) {
        console.error(`Error loading translation file for ${lang}:`, error);
      }
    };

    // Always ensure English is loaded as the fallback.
    loadLang('en');
    // Load the currently selected language if it's different.
    if (language !== 'en') {
      loadLang(language);
    }
  }, [language]);

  const t = useCallback((key: string): string => {
    return translations[language]?.[key] || fallback[key] || key;
  }, [language, translations, fallback]);

  return (
    <I18nContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </I18nContext.Provider>
  );
};

export const useI18n = () => {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
};