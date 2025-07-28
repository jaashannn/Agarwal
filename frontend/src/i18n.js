import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

// Importing translations
import enTranslation from './locales/en/translation.json'
import paTranslation from './locales/pa/translation.json'
import hiTranslation from './locales/hi/translation.json'  // ✅ Hindi added here

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: enTranslation
      },
      pa: {
        translation: paTranslation
      },
      hi: {
        translation: hiTranslation  // ✅ Hindi added here
      }
    },
    lng: 'en',
    fallbackLng: 'en', // You can optionally set this to 'hi' or 'pa' too
    interpolation: {
      escapeValue: false
    }
  })

export default i18n
