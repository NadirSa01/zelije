import { useEffect, useState, type ReactNode } from 'react';
import { LanguageContext } from './context';
import i18n from '@/i18n/i18n';
import type { LANGUAGES } from '@/constants/languages';

interface LanguageProviderProps {
  children: ReactNode;
}

export default function LanguageProvider({ children }: LanguageProviderProps) {
  const [currentLanguage, setCurrentLanguage] = useState(() => {
    return (localStorage.getItem('language') || 'fr') as typeof LANGUAGES[number]['code'];
  });

  useEffect(() => {
    i18n.changeLanguage(currentLanguage);
    localStorage.setItem('language', currentLanguage);
    document.dir = currentLanguage === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = currentLanguage;
  }, [currentLanguage]);

  const changeLanguage = (lang: typeof LANGUAGES[number]['code']) => {
    setCurrentLanguage(lang);
  };

  return (
    <LanguageContext.Provider value={{ currentLanguage, changeLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};
