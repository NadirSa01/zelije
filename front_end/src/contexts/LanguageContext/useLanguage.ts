import { useContext } from 'react';
import { LanguageContext } from './context';
import type { LanguageContextType } from './types';

export function useLanguage(): LanguageContextType {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
