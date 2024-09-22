import React from 'react';
import { useAtom } from 'jotai';
import { themeAtom } from '../../Context/atoms';
import { CheckIcon } from '../IconButton/Icons/Icons';

interface ThemeSettingsProps {
  dataTestId?: string;
}

export const ThemeSettings = ({ dataTestId }: ThemeSettingsProps) => {
  const [theme, setTheme] = useAtom(themeAtom);

  const renderThemeOption = (themeValue: string, colourClass: string) => {
    const isSelected = theme === themeValue;

    const containerClass =
      'cursor-pointer mx-auto flex flex-col items-center justify-center relative';
    return (
      <div className={containerClass}>
        <button
          data-testid={`theme-button-${themeValue}`}
          onClick={() => setTheme(themeValue)}
          className={`size-8 rounded-lg border-4 border-accent ${colourClass} cursor-pointer outline-none`}
        />
        {isSelected && (
          <div
            data-testid="background-check-icon-container"
            className="absolute right-0 top-0 p-1.5"
          >
            <CheckIcon
              dataTestId="background-check-icon"
              size="xs"
              className="text-accent"
            />
          </div>
        )}
      </div>
    );
  };
  return (
    <>
      <div data-testid={dataTestId} className="my-3 flex justify-between">
        <span className={`text-sm font-bold text-text-primary`}>Theme</span>
      </div>
      <label className={`mb-2 block text-sm font-medium text-text-primary`}>
        🎨 Change the default colours to your likes.
      </label>
      <div className="mt-4 flex flex-row">
        <div
          className={`flex w-full items-center justify-center rounded-lg bg-secondary-dark p-2`}
        >
          <div
            className={`xs:gap-1 flex w-80 items-center justify-center gap-0.5 sm:gap-2 md:gap-4`}
          >
            {renderThemeOption('default', 'bg-[#252525]')}
            {renderThemeOption('light', 'bg-[#ffffff]')}
            <div className="h-8 border border-l-2 border-accent"></div>
            {renderThemeOption('red', 'bg-red-500')}
            {renderThemeOption('orange', 'bg-orange-500')}
            {renderThemeOption('green', 'bg-green-500')}
            {renderThemeOption('teal', 'bg-teal-500')}
            {renderThemeOption('blue', 'bg-blue-500')}
            {renderThemeOption('indigo', 'bg-indigo-500')}
            {renderThemeOption('purple', 'bg-purple-500')}
            {renderThemeOption('pink', 'bg-pink-500')}
          </div>
        </div>
      </div>
    </>
  );
};
