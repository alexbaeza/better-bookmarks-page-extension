import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';

import ar from './locales/ar.json';
import az from './locales/az.json';
import cs from './locales/cs.json';
import de from './locales/de.json';
import el from './locales/el.json';
import en from './locales/en.json';
import es from './locales/es.json';
import fr from './locales/fr.json';
import hu from './locales/hu.json';
import id from './locales/id.json';
import it from './locales/it.json';
import ja from './locales/ja.json';
import ko from './locales/ko.json';
import nl from './locales/nl.json';
import pl from './locales/pl.json';
import pt from './locales/pt.json';
import ro from './locales/ro.json';
import ru from './locales/ru.json';
import sv from './locales/sv.json';
import th from './locales/th.json';
import tr from './locales/tr.json';
import uk from './locales/uk.json';
import vi from './locales/vi.json';
import zhCN from './locales/zh-CN.json';
import zhTW from './locales/zh-TW.json';

const resources = {
  ar: { translation: ar },
  az: { translation: az },
  cs: { translation: cs },
  de: { translation: de },
  el: { translation: el },
  en: { translation: en },
  es: { translation: es },
  fr: { translation: fr },
  hu: { translation: hu },
  id: { translation: id },
  it: { translation: it },
  ja: { translation: ja },
  ko: { translation: ko },
  nl: { translation: nl },
  pl: { translation: pl },
  pt: { translation: pt },
  ro: { translation: ro },
  ru: { translation: ru },
  sv: { translation: sv },
  th: { translation: th },
  tr: { translation: tr },
  uk: { translation: uk },
  vi: { translation: vi },
  'zh-CN': { translation: zhCN },
  'zh-TW': { translation: zhTW },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    defaultNS: 'translation',
    supportedLngs: [
      'ar',
      'az',
      'cs',
      'de',
      'el',
      'en',
      'es',
      'fr',
      'hu',
      'id',
      'it',
      'ja',
      'ko',
      'nl',
      'pl',
      'pt',
      'ro',
      'ru',
      'sv',
      'th',
      'tr',
      'uk',
      'vi',
      'zh-CN',
      'zh-TW',
    ],
    interpolation: {
      escapeValue: false, // React already escapes values
    },
    detection: {
      // Order of detection methods
      order: ['localStorage', 'navigator'],
      // Keys to lookup language from
      lookupLocalStorage: 'i18nextLng',
      // Cache user language
      caches: ['localStorage'],
      // Convert language codes (e.g., 'zh' -> 'zh-CN', 'pt-BR' -> 'pt')
      convertDetectedLanguage: (lng: string) => {
        // Handle Chinese variants
        if (lng.startsWith('zh')) {
          if (lng.includes('TW') || lng.includes('HK') || lng.includes('MO')) {
            return 'zh-TW';
          }
          return 'zh-CN';
        }
        // Handle Portuguese variants (pt-BR, pt-PT -> pt)
        if (lng.startsWith('pt')) {
          return 'pt';
        }
        // Return base language code for other languages
        return lng.split('-')[0];
      },
    },
    react: {
      useSuspense: false, // Disable suspense for better compatibility
    },
  });

export default i18n;
