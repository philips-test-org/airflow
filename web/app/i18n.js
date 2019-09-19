import i18n from "i18next"
import {initReactI18next} from "react-i18next"
import TranslationsEn from "./locales/en.json"
import TranslationsDe from "./locales/de.json"
import TranslationsEs from "./locales/es.json"
import TranslationsFr from "./locales/fr.json"
import TranslationsNl from "./locales/nl.json"
import TranslationsPt from "./locales/pt.json"
import TranslationsIt from "./locales/it.json"
const resources = {
  en: {
    translation: TranslationsEn
  },
  es: {
  translation: TranslationsEs
  },
  de:{
    translation: TranslationsDe
  },
  fr:{
    translation: TranslationsFr
  },
  nl:{
    translation: TranslationsNl
  },
  pt:{
    translation: TranslationsPt
  },
  it:{
    translation: TranslationsIt
  }
}

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    lng: "de",
    fallbackLng: 'en',
    keySeparator: false, // we do not use keys in form messages.welcome

    interpolation: {
      escapeValue: false // react already safes from xss
    }
  })

export default i18n;