import { createContext } from 'react';
import type { LanguageContextType } from './types';

export const LanguageContext = createContext<LanguageContextType>({
  currentLanguage: 'fr',
  changeLanguage: () => undefined
});
