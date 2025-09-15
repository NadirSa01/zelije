import { useLanguage } from "@/hooks/useLanguage";
import { LANGUAGES } from "@/constants/languages";
import { useState, useRef, useEffect } from "react";
import {  FR, MA, US } from 'country-flag-icons/react/3x2'

export function LanguageSelector() {
  const { currentLanguage, changeLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentLang = LANGUAGES.find((lang) => lang.code === currentLanguage);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 text-sm font-medium bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all"
      >
        <span className="text-base">{currentLang?.code== "en" ? <US title="United States" className="w-4 h-3" /> :currentLang?.code== "fr" ? <FR title="France" className="w-4 h-3" /> :currentLang?.code== "ar" ? <MA title="Arabic" className="w-4 h-3" /> :null }</span>
        <span>{currentLang?.label}</span>
        <svg
          className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg py-1">
          {LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              onClick={() => {
                changeLanguage(lang.code);
                setIsOpen(false);
              }}
              className={`w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100 transition-colors ${
                currentLanguage === lang.code ? "bg-gray-50 font-medium" : ""
              }`}
            >
              <span className="text-base"> {lang.code== "en" ? <US title="United States" className="w-4 h-3" /> :lang.code== "fr" ? <FR title="France" className="w-4 h-3" /> :lang.code== "ar" ? <MA title="Arabic" className="w-4 h-3" /> :null }</span>
              <span>{lang.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
