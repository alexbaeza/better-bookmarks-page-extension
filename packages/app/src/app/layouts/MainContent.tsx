import type React from 'react';

import { Content } from '@/shared/ui/Content';
import { Scrollable } from '@/shared/ui/Scrollable';

import { Header } from './Header';

export const MainContent: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden" data-testid="app-content-container">
      <Scrollable data-testid="app-content">
        <Header />
        <Content>{children}</Content>
      </Scrollable>
    </div>
  );
};
