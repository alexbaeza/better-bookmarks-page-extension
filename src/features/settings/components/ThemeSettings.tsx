import { useAtom } from 'jotai';
import { CheckIcon } from 'lucide-react';

import { themeAtom } from '@/app/providers/atoms';
import { themes } from '@/styles/themes';

interface ThemeSettingsProps {
  dataTestId?: string;
}

export const ThemeSettings = ({ dataTestId }: ThemeSettingsProps) => {
  const [theme, setTheme] = useAtom(themeAtom);

  return (
    <div data-testid={dataTestId} className="mt-4 flex w-full justify-center rounded-lg bg-bgColor-tertiary p-2">
      <div className="flex flex-wrap justify-center gap-2">
        {Object.entries(themes).map(([themeName, colors]) => {
          const isSelected = theme === themeName;
          const bgColor = colors['bgColor-primary'];

          return (
            <button
              type="button"
              key={themeName}
              data-testid={`theme-button-${themeName}`}
              onClick={() => setTheme(themeName)}
              className={`
                size-8 rounded-lg border-2
                ${isSelected ? 'border-fgColor-accent' : 'border-transparent'}
              `}
              style={{ backgroundColor: bgColor }}
            >
              {isSelected && (
                <div className="flex size-full items-center justify-center">
                  <CheckIcon size={8} className="text-fgColor-accent" />
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
