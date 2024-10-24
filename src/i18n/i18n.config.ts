import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import { en, uk } from "./translations";

const resources = {
  en: {
    translation: en,
  },

  uk: {
    translation: uk,
  },
};

i18next.use(initReactI18next).init({
  fallbackLng: "en",
  compatibilityJSON: 'v3',
  debug: true,
  lng: "en",
  resources,
});

export default i18next;