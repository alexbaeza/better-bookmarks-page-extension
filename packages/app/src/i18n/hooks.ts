import { useTranslation as useI18nTranslation } from 'react-i18next';

import i18n from './config';

export const useTranslation = () => {
  return useI18nTranslation();
};

export const useLanguage = () => {
  const { i18n: i18nInstance } = useI18nTranslation();

  const changeLanguage = (lng: string) => {
    return i18nInstance.changeLanguage(lng);
  };

  return {
    currentLanguage: i18nInstance.language,
    changeLanguage,
    availableLanguages: ['en', 'es', 'fr'],
  };
};

export { i18n };
