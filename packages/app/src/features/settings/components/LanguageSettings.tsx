import type React from 'react';

import { useLanguage, useTranslation } from '@/i18n/hooks';
import { SettingItem } from '@/shared/ui/SettingItem';

interface LanguageSettingsProps {
  dataTestId?: string;
}

const languageOptions = [
  { code: 'en', label: 'English' },
  { code: 'es', label: 'Español' },
  { code: 'fr', label: 'Français' },
];

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
