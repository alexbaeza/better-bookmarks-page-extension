import type React from 'react';

import { Header } from './Header';

export const MainContent: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  return (
    <div className="flex-1 overflow-y-auto" data-testid="app-content-container">
      <Header />
      <div className="flex-1 overflow-y-auto p-2" data-testid="app-content">
        {children}
      </div>
    </div>
  );
};
