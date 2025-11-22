import type { ReactNode } from 'react';

interface ThemeButtonProps {
  children: ReactNode;
  isActive: boolean;
  onClick: () => void;
  'data-testid'?: string;
  variant?: 'default' | 'rainbow';
}

const DefaultThemeButton = ({
  children,
  isActive,
  onClick,
  'data-testid': testId,
}: Omit<ThemeButtonProps, 'variant'>) => {
  return (
    <button
      className={`p-3 rounded-lg border text-sm font-medium transition-colors ${
        isActive
          ? 'border-fgColor-accent bg-fgColor-accent/10 text-fgColor-accent'
          : 'border-fgColor-active bg-bgColor-secondary text-fgColor-primary hover:bg-bgColor-tertiary'
      }`}
      data-testid={testId}
      onClick={onClick}
      type="button"
    >
      {children}
    </button>
  );
};

const RainbowThemeButton = ({
  children,
  isActive,
  onClick,
  'data-testid': testId,
}: Omit<ThemeButtonProps, 'variant'>) => {
  if (isActive) {
    return (
      <button
        className="p-3 rounded-lg border border-fgColor-accent bg-fgColor-accent/10 text-fgColor-accent text-sm font-medium transition-all duration-300 w-full"
        data-testid={testId}
        onClick={onClick}
        type="button"
      >
        {children}
      </button>
    );
  }

  return (
    <button
      className="p-[2px] rounded-lg text-sm font-medium transition-all duration-300 w-full"
      data-testid={testId}
      onClick={onClick}
      style={{
        background: 'linear-gradient(45deg, #ff6b6b, #4ecdc4, #45b7d1, #96ceb4, #feca57, #ff9ff3)',
      }}
      type="button"
    >
      <div className="p-3 rounded-[6px] bg-bgColor-secondary text-fgColor-primary hover:bg-bgColor-tertiary">
        {children}
      </div>
    </button>
  );
};

export const ThemeButton = ({
  children,
  isActive,
  onClick,
  'data-testid': testId,
  variant = 'default',
}: ThemeButtonProps) => {
  if (variant === 'rainbow') {
    return (
      <RainbowThemeButton data-testid={testId} isActive={isActive} onClick={onClick}>
        {children}
      </RainbowThemeButton>
    );
  }

  return (
    <DefaultThemeButton data-testid={testId} isActive={isActive} onClick={onClick}>
      {children}
    </DefaultThemeButton>
  );
};
