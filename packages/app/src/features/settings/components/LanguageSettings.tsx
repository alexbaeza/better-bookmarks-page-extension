import type React from 'react';

import { useLanguage, useTranslation } from '@/i18n/hooks';
import { SettingItem } from '@/shared/ui/SettingItem';

interface LanguageSettingsProps {
  dataTestId?: string;
}

const languageOptions = [
  { code: 'ar', label: 'العربية' },
  { code: 'az', label: 'Azərbaycan' },
  { code: 'cs', label: 'Čeština' },
  { code: 'de', label: 'Deutsch' },
  { code: 'el', label: 'Ελληνικά' },
  { code: 'en', label: 'English' },
  { code: 'es', label: 'Español' },
  { code: 'fr', label: 'Français' },
  { code: 'hu', label: 'Magyar' },
  { code: 'id', label: 'Bahasa Indonesia' },
  { code: 'it', label: 'Italiano' },
  { code: 'ja', label: '日本語' },
  { code: 'ko', label: '한국어' },
  { code: 'nl', label: 'Nederlands' },
  { code: 'pl', label: 'Polski' },
  { code: 'pt', label: 'Português' },
  { code: 'ro', label: 'Română' },
  { code: 'ru', label: 'Русский' },
  { code: 'sv', label: 'Svenska' },
  { code: 'th', label: 'ไทย' },
  { code: 'tr', label: 'Türkçe' },
  { code: 'uk', label: 'Українська' },
  { code: 'vi', label: 'Tiếng Việt' },
  { code: 'zh-CN', label: '简体中文' },
  { code: 'zh-TW', label: '繁體中文' },
].sort((a, b) => a.label.localeCompare(b.label));

export const LanguageSettings: React.FC<LanguageSettingsProps> = ({ dataTestId }) => {
  const { t } = useTranslation();
  const { currentLanguage, changeLanguage } = useLanguage();

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    changeLanguage(e.target.value);
  };

  // Get the base language code (e.g., 'en' from 'en-US')
  const baseLanguage = currentLanguage.split('-')[0];

  return (
    <SettingItem dataTestId={dataTestId} label={t('language.title')}>
      <select
        className="w-full rounded-lg px-3 py-2 bg-bgColor-secondary border border-fgColor-secondary/30 text-fgColor-primary focus:outline-none focus:ring-2 focus:ring-fgColor-accent cursor-pointer"
        data-testid="language-select"
        id="language-select"
        onChange={handleLanguageChange}
        value={baseLanguage}
      >
        {languageOptions.map((lang) => (
          <option data-testid={`language-option-${lang.code}`} key={lang.code} value={lang.code}>
            {lang.label}
          </option>
        ))}
      </select>
    </SettingItem>
  );
};
