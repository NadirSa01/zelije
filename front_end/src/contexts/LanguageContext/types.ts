import { languages } from '@/constants/languages';

export type Language = typeof languages[number]['code'];

export interface LanguageContextType {
  currentLanguage: Language;
  changeLanguage: (lang: Language) => void;
}
