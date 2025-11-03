import type React from 'react';

import { useApplyTheme } from '@/shared/hooks/useApplyTheme';

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  useApplyTheme();
  return <>{children}</>;
};
