import { useAtom } from 'jotai';
import { ArrowRight, Star } from 'lucide-react';
import type React from 'react';

import { customThemeAtom, themeAtom } from '@/app/providers/atoms';
import { Button } from '@/shared/ui/Button';
import { Divider } from '@/shared/ui/Divider';
import { Text } from '@/shared/ui/Text';
import { themes } from '@/styles/themes';

export const UnifiedThemeSettings: React.FC = () => {
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
    'Background Colors': ['bgColor-primary', 'bgColor-secondary', 'bgColor-tertiary', 'bgColor-accent'],
    'Foreground Colors': [
      'fgColor-primary',
      'fgColor-secondary',
      'fgColor-muted',
      'fgColor-active',
      'fgColor-hover',
      'fgColor-accent',
      'fgColor-danger',
    ],
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
      <div className="text-sm text-fgColor-secondary">
        Choose from preset themes or create your own custom theme with personalized colors.
      </div>

      {/* Theme Selection */}
      <div className="space-y-4">
        <div className="text-sm font-medium text-fgColor-primary">Choose a theme</div>
        <div className="flex flex-col gap-3">
          {/* Preset themes */}
          <div className="grid grid-cols-2 gap-3">
            {Object.keys(themes).map((themeKey) => (
              <button
                className={`p-3 rounded-lg border text-sm font-medium transition-colors ${
                  theme === themeKey
                    ? 'border-fgColor-accent bg-fgColor-accent/10 text-fgColor-accent'
                    : 'border-fgColor-active bg-bgColor-secondary text-fgColor-primary hover:bg-bgColor-tertiary'
                }`}
                data-testid={`theme-${themeKey}`}
                key={themeKey}
                onClick={() => handleThemeChange(themeKey)}
                type="button"
              >
                {themeKey.charAt(0).toUpperCase() + themeKey.slice(1)}
              </button>
            ))}
          </div>

          {/* Custom Theme with call-to-action */}
          <div className="flex items-center gap-4">
            {/* Call-to-action arrow and message */}
            {theme !== 'custom' && (
              <div className="flex items-center gap-2 animate-pulse">
                <div className="flex flex-col items-end">
                  <div className="text-xs text-fgColor-secondary bg-bgColor-primary px-2 py-1 rounded-md border border-fgColor-active whitespace-nowrap">
                    Not convinced?
                  </div>
                  <div className="text-xs text-fgColor-secondary bg-bgColor-primary px-2 py-1 rounded-md border border-fgColor-active whitespace-nowrap">
                    Try building your own theme
                  </div>
                </div>
                <ArrowRight className="text-fgColor-accent" size={16} />
              </div>
            )}

            {/* Custom Theme Button */}
            <div className="flex-1">
              <button
                className={`relative p-3 rounded-lg border text-sm font-medium transition-all duration-300 w-full ${
                  theme === 'custom'
                    ? 'border-fgColor-accent bg-fgColor-accent/10 text-fgColor-accent'
                    : 'border-fgColor-active bg-bgColor-secondary text-fgColor-primary hover:bg-bgColor-tertiary'
                }`}
                data-testid="theme-custom"
                onClick={() => handleThemeChange('custom')}
                style={{
                  borderImage:
                    theme === 'custom'
                      ? undefined
                      : 'linear-gradient(45deg, #ff6b6b, #4ecdc4, #45b7d1, #96ceb4, #feca57, #ff9ff3) 1',
                }}
                type="button"
              >
                <div className="flex items-center justify-center gap-2">
                  <Star className={theme === 'custom' ? 'text-fgColor-accent' : 'text-fgColor-primary'} size={14} />
                  <span className={theme === 'custom' ? 'text-fgColor-accent' : 'text-fgColor-primary font-semibold'}>
                    Custom Theme
                  </span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Custom Theme Editor */}
      {theme === 'custom' && (
        <>
          <Divider title="Customize Colors" />

          <div className="space-y-4">
            <div className="space-y-2">
              <Text as="h4" color="primary" size="sm" weight="medium">
                Customize Your Theme
              </Text>
              <p className="text-xs text-fgColor-secondary">
                Adjust colors below to create your perfect theme. Changes are applied instantly and saved automatically.
              </p>
              <div className="flex gap-2">
                <Button dataTestId="theme-reset-all-colors" onClick={resetToDefault} variant="secondary">
                  Reset All Colors
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
                        <div
                          className="w-8 h-8 rounded border border-fgColor-active"
                          style={{ backgroundColor: activeTheme[key] }}
                        />
                        <input
                          aria-label={`${formatKey(key)} color picker`}
                          className="w-12 h-8 rounded border border-fgColor-active cursor-pointer"
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
