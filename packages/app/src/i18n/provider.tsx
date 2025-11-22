import type React from 'react';
import { useEffect } from 'react';

import './config';

interface I18nProviderProps {
  children: React.ReactNode;
}

export const I18nProvider: React.FC<I18nProviderProps> = ({ children }) => {
  // Initialize i18n on mount
  useEffect(() => {
    // i18n is initialized in config.ts
    // This component just ensures the config is loaded
  }, []);

  return <>{children}</>;
};
