import type React from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import { AppStateProvider } from '@/app/providers/app-state-provider';
import { ModalProvider } from '@/app/providers/modal-context';
import { ThemeProvider } from '@/app/providers/theme-provider';
import { BookmarkNavigationProvider } from '@/features/bookmarks/contexts/BookmarkNavigationContext';
import { BookmarkSearchProvider } from '@/features/bookmarks/contexts/BookmarkSearchContext';

export const AppProviders: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <AppStateProvider>
    <ThemeProvider>
      <DndProvider backend={HTML5Backend}>
        <BookmarkNavigationProvider>
          <BookmarkSearchProvider>
            <ModalProvider>{children}</ModalProvider>
          </BookmarkSearchProvider>
        </BookmarkNavigationProvider>
      </DndProvider>
    </ThemeProvider>
  </AppStateProvider>
);
