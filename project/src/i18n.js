import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import enTranslation from './locales/en/translation.json'
import paTranslation from './locales/pa/translation.json'

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: enTranslation
      },
      pa: {
        translation: paTranslation
      }
    },
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  })

export default i18n