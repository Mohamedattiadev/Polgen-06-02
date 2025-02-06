import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// Import translation files
import enTranslation from "./locales/en/en_translation.json";
import trTranslation from "./locales/tr/tr_translation.json";
import arTranslation from "./locales/ar/ar_translation.json";
import frTranslation from "./locales/fr/fr_translation.json";
import ruTranslation from "./locales/ru/ru_translation.json";
import grTranslation from "./locales/gr/gr_translation.json";

// Initialize i18n
i18n.use(initReactI18next).init({
  resources: {
    en: { translation: enTranslation },
    tr: { translation: trTranslation },
    ar: { translation: arTranslation },
    fr: { translation: frTranslation },
    ru: { translation: ruTranslation },
    gr: { translation: grTranslation },
  },
  lng: "en", // Default language
  fallbackLng: "en", // Fallback language if translation is missing
  interpolation: { escapeValue: false }, // React already escapes values
});

export default i18n;
