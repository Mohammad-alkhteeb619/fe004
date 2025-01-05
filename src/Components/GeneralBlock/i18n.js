i18n.js
 
 
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import HttpApi from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';
 
i18n
  .use(HttpApi) // Load translations via HTTP
  .use(LanguageDetector) // Detect language from the browser
  .use(initReactI18next) // Bind to React
  .init({
    supportedLngs: ['en', 'ar'], // Add your supported languages
    fallbackLng: 'en', // Default language
    debug: true, // Enable debug mode in development
    backend: {
      loadPath: '/locales/{{lng}}/translation.json', // Path to translation files
    },
    detection: {
      order: ['querystring', 'cookie', 'localStorage', 'navigator', 'htmlTag', 'path', 'subdomain'],
      caches: ['cookie', 'localStorage'],
    },
    react: {
      useSuspense: true, // Enable suspense mode
    },
  });
 
export default i18n;