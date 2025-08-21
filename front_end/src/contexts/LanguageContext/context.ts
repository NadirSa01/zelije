import { createContext } from 'react';
import type { LanguageContextType } from './types';
import type { Language } from './types';

const defaultContext: LanguageContextType = {
  currentLanguage: 'fr' as Language,
  changeLanguage: () => undefined,
};

export const LanguageContext = createContext<LanguageContextType>(defaultContext);
