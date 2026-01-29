import { createI18n } from 'vue-i18n'
import en from './locales/en.json'
import de from './locales/de.json'

export type MessageSchema = typeof en

export const i18n = createI18n<[MessageSchema], 'en' | 'de'>({
  legacy: false,
  locale: navigator.language.startsWith('de') ? 'de' : 'en',
  fallbackLocale: 'en',
  messages: {
    en,
    de
  }
})
