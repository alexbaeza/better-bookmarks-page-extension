import { useAtom } from 'jotai';
import { ArrowRight, Star } from 'lucide-react';
import type React from 'react';

import { customThemeAtom, themeAtom } from '@/app/providers/atoms';
import { useTranslation } from '@/i18n/hooks';
import { Button } from '@/shared/ui/Button';
import { Divider } from '@/shared/ui/Divider';
import { Text } from '@/shared/ui/Text';
import { themes } from '@/styles/themes';
import { ThemeButton } from './ThemeButton';

export const UnifiedThemeSettings: React.FC = () => {
  const { t } = useTranslation();
  const [theme, setTheme] = useAtom(themeAtom);
  const [customTheme, setCustomTheme] = useAtom(customThemeAtom);
  const handleThemeChange = (selectedTheme: string) => {
    if (selectedTheme === 'custom') {
      // If switching to custom, initialize with current theme as base
      if (!customTheme) {
        setCustomTheme(themes[theme]);
      }
      setTheme('custom');
    } else {
      // If switching to preset, clear custom theme
      setCustomTheme(null);
      setTheme(selectedTheme);
    }
  };

  const handleColorChange = (key: string, value: string) => {
    const baseTheme = themes[theme === 'custom' ? 'default' : theme];
    const activeTheme = customTheme ?? baseTheme;

    setCustomTheme({
      ...activeTheme,
      [key]: value,
    });
  };

  const resetToDefault = () => {
    setCustomTheme(themes.default);
  };

  const colorGroups = {
    [t('settings.theme.backgroundColors')]: ['bgColor-primary', 'bgColor-secondary', 'bgColor-accent'],
    [t('settings.theme.foregroundColors')]: ['fgColor-primary', 'fgColor-secondary', 'fgColor-accent'],
  };

  const formatKey = (key: string) => {
    return key
      .replace(/([A-Z])/g, ' $1')
      .toLowerCase()
      .replace(/fg|bg/, (match) => (match === 'fg' ? 'fg' : 'bg'));
  };

  const getActiveTheme = () => {
    if (theme === 'custom' && customTheme) {
      return customTheme;
    }
    return themes[theme];
  };

  const activeTheme = getActiveTheme();

  return (
    <div className="space-y-4" data-testid="theme-settings">
      <div className="text-sm text-fgColor-secondary">{t('settings.theme.description')}</div>

      {/* Theme Selection */}
      <div className="space-y-4">
        <div className="text-sm font-medium text-fgColor-primary">{t('settings.theme.chooseTheme')}</div>
        <div className="flex flex-col gap-3">
          {/* Preset themes */}
          <div className="grid grid-cols-2 gap-3">
            {Object.keys(themes).map((themeKey) => (
              <ThemeButton
                data-testid={`theme-${themeKey}`}
                isActive={theme === themeKey}
                key={themeKey}
                onClick={() => handleThemeChange(themeKey)}
              >
                {themeKey.charAt(0).toUpperCase() + themeKey.slice(1)}
              </ThemeButton>
            ))}
          </div>

          {/* Custom Theme with call-to-action */}
          <div className="flex items-center gap-4">
            {/* Call-to-action arrow and message */}
            {theme !== 'custom' && (
              <div className="flex items-center gap-2 animate-pulse">
                <div className="flex flex-col items-end">
                  <div className="text-xs text-fgColor-secondary bg-bgColor-primary px-2 py-1 rounded-md border border-fgColor-secondary/30 whitespace-nowrap">
                    {t('settings.theme.notConvinced')}
                  </div>
                  <div className="text-xs text-fgColor-secondary bg-bgColor-primary px-2 py-1 rounded-md border border-fgColor-secondary/30 whitespace-nowrap">
                    {t('settings.theme.tryBuilding')}
                  </div>
                </div>
                <ArrowRight className="text-fgColor-accent" size={16} />
              </div>
            )}

            {/* Custom Theme Button */}
            <div className="flex-1">
              <ThemeButton
                data-testid="theme-custom"
                isActive={theme === 'custom'}
                onClick={() => handleThemeChange('custom')}
                variant="rainbow"
              >
                <div className="flex items-center justify-center gap-2">
                  <Star className={theme === 'custom' ? 'text-fgColor-accent' : 'text-fgColor-primary'} size={14} />
                  <span className={theme === 'custom' ? 'text-fgColor-accent' : 'text-fgColor-primary font-semibold'}>
                    {t('settings.theme.customTheme')}
                  </span>
                </div>
              </ThemeButton>
            </div>
          </div>
        </div>
      </div>

      {/* Custom Theme Editor */}
      {theme === 'custom' && (
        <>
          <Divider title={t('settings.theme.customizeColors')} />

          <div className="space-y-4">
            <div className="space-y-2">
              <Text as="h4" color="primary" size="sm" weight="medium">
                {t('settings.theme.customizeTitle')}
              </Text>
              <p className="text-xs text-fgColor-secondary">{t('settings.theme.customizeDescription')}</p>
              <div className="flex gap-2">
                <Button dataTestId="theme-reset-all-colors" onClick={resetToDefault} variant="secondary">
                  {t('settings.theme.resetAllColors')}
                </Button>
              </div>
            </div>

            {Object.entries(colorGroups).map(([groupName, keys]) => (
              <div className="space-y-3" key={groupName}>
                <Text as="h5" className="uppercase tracking-wide" color="secondary" size="xs" weight="medium">
                  {groupName}
                </Text>
                <div className="grid grid-cols-1 gap-3">
                  {keys.map((key) => (
                    <div className="flex items-center justify-between gap-3" key={key}>
                      <div className="flex-1">
                        <label className="text-sm font-medium text-fgColor-primary" htmlFor={`color-input-${key}`}>
                          {formatKey(key)}
                        </label>
                        <div className="text-xs text-fgColor-secondary font-mono">{activeTheme[key]}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          aria-label={t('settings.theme.colorPicker', { color: formatKey(key) })}
                          className="w-8 h-8 rounded border border-fgColor-secondary/30 cursor-pointer"
                          id={`color-input-${key}`}
                          onChange={(e) => handleColorChange(key, e.target.value)}
                          type="color"
                          value={activeTheme[key]}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};
